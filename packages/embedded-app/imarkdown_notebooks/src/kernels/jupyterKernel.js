import * as React from 'react';
import { SimplifiedOutputArea, OutputAreaModel } from '@jupyterlab/outputarea';
import {
  RenderMimeRegistry,
  standardRendererFactories as initialFactories
} from '@jupyterlab/rendermime';
import { Kernel, TerminalSession } from '@jupyterlab/services';
import * as yaml from 'js-yaml';
import CompletionProvider from 'markdown-notebook-component/lib/CompletionProvider'
import { ISanitizer } from '@jupyterlab/apputils'

class JupyterKernelDisplay extends React.Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    componentDidMount() {
        const running = Kernel.listRunning(this.props.settings).then(running => {
            this.setState({running})
        })

        const potentialKernels = Kernel.getSpecs(this.props.settings).then(potentialKernels => {
            console.log(potentialKernels)
            this.setState({potentialKernels: Object.values(potentialKernels.kernelspecs), defaultKernel: potentialKernels.default})
        })
    }

    async shutdown(run) {
        console.log("shutting kernel down")
        const kernel = await Kernel.connectTo(run);
        await kernel.shutdown()

        const running = await Kernel.listRunning(this.props.settings)
        this.setState({running})
    }

    async restart(run) {
        console.log("restarting kernel")
        const kernel = await Kernel.connectTo(run);
        await kernel.restart()
    }

    render() {
        return <div>
            {this.state.running ?
            <h4>running kernels</h4>: null}
            {this.state.running ? 
            this.state.running.map((run, i) => (
                <div key={i}>
                    <div>{run.name}</div>
                    <div>{run.execution_state}</div>
                    <div>{run.last_activity}</div>
                    <button onClick={() => this.shutdown(run)}>shut down</button>
                    <button onClick={() => this.restart(run)}>restart kernel</button>
                </div>
            )): null}
            {this.state.potentialKernels ?
            <h4>Potential kernels</h4>: null}
            {this.state.potentialKernels ? 
            this.state.potentialKernels.map((k, i) => (
                <div key={i}>
                    <div><b>{k.name}</b></div>
                    <div>{`example block header: \`\`\`python {kernel: ${k.name}} `}</div>
                </div>
            )): null}
        </div>
    }
}


class Sanitizer {
    sanitize(dirty, options) {
        let clean = dirty.replace('"dataframe"', '"dataframe mdl-data-table mdl-js-data-table mdl-shadow--2dp"')
        return clean
    }
}

export default class JupyterKernel {
    // TODO: language server neeeds a port range
    // TODO: handle situations where language servers die or won't start (escape hatch at the very least)
    constructor(settings, languageServerPort = 3000) { 
        this._settings = settings
        this._default = Kernel.getSpecs(settings).then(kernelSpecs => kernelSpecs.default)
        this.kernel = null
        this.beginRegex = /^```python/
        this._kernelCache = {}
        this._languageServerPort = languageServerPort
        this._languageServers = {}
        this._completionProvider = new CompletionProvider()
    }

    startLanguageServer(port, pythonPath) {
        // Create a named terminal session and send some data.
        console.log('pythonPath')
        console.log(pythonPath)
        // const options = {
        //     serverSettings: this._settings
        // };
        // TerminalSession.startNew(this._settings).then(session => {
        //     console.log("session")
        //     console.log(session)
        //     session.send({ type: 'stdin', content: [`${pythonPath} `] });
        // });
        // TODO: prompt user if connection doesn't work (say you're on a remote machine with ports that are closed off)
        // Q: how would this work with ssh?
        // Potential solution: one server for kernel + language services
    }

    async getParsedHeader(header) {
        const parsedHeader = this.parseHeader(header)
        let kernelName = null;
        if (parsedHeader && 'kernel' in parsedHeader) {
            kernelName = parsedHeader['kernel']
        } else {
            kernelName = await this._default;
        }
        return kernelName
    }

    async getLanguageServerProvider(header) {
        // const kernelName = await this.getParsedHeader(header);
        // console.log("kernelName", kernelName)
        // if (kernelName in this._languageServers) {
        //     return this._languageServers[kernelName];
        // }
        return this._completionProvider.languageClient;
    }

    async setLanguageServerProvider(provider, id) {
        this.languageServers[id] = provider
    }

    async getKernelName(header) {
        // need to put some sort of non whitespace or alphanumeric character after to break it up
        const kernelNameRegex = /kernel: ([A-Za-z0-9\s]*)/
        const kernelName = header.match(kernelNameRegex)
        return kernelName && kernelName.length > 1 ? kernelName[1] : (await this._default)
    }

    async list() {
        return await Kernel.listRunning(this._settings).then(kernelModels => {
            return kernelModels
        });
    }

    reactElement(parentKeyName, key) {
        return <JupyterKernelDisplay settings={this._settings} key={key}/>
    }

    parseHeader(header) {
        console.log("parsing header")
        // Examine all text after the begin regex. Parses as if it is a yaml object.
        const headerStart = header.replace(this.beginRegex, "");

        // Get document, or throw exception on error
        try {
            return yaml.safeLoad(headerStart);
        } catch (e) {
            console.log(e);
            return null;
        }
        
    }

    execute(header, code) {
        const model = new OutputAreaModel();
        const rendermime = new RenderMimeRegistry({ initialFactories, sanitizer: new Sanitizer() });
        const outputArea = new SimplifiedOutputArea({ model, rendermime });

        this.getOrStartKernel(header).then(kernel => {
            const future = kernel.requestExecute({ code: code });
            outputArea.future = future;
        })

        outputArea.onChildAdded = (msg) => {
            // msg.child.removeClass('jp-OutputArea-output')
            msg.child.removeClass('jp-RenderedHTMLCommon')
        }

        return outputArea
    }

    async getRunning () {
        return await Kernel.listRunning(this._settings).then(kernelModels => {
            return kernelModels
        });
    }

    async getSpecs() {
        Kernel.getSpecs(this._settings).then(kernelSpecs => {
            console.log('specs', Object.keys(kernelSpecs));
        })
    }

    async getOrStartKernel(header) {
        const parsedHeader = this.parseHeader(header)
        let kernelName = null;
        if (parsedHeader && 'kernel' in parsedHeader) {
            kernelName = parsedHeader['kernel']
        } else {
            kernelName = await this._default;
        }

        const runningKernels = await this.getRunning();

        let runningKernel;
        if ((runningKernels.length > 0) && (kernelName in this._kernelCache)) {
            const id = this._kernelCache[kernelName]
            runningKernel = runningKernels.find(el => el.name === kernelName && el.id ==id);
        }

        if (runningKernel) {
            console.log("found running kernel")
            return Kernel.connectTo(runningKernel, this._settings);
        }
        console.log("Alert, no kernel found, starting new")
        const newKernelName = (kernelName === 'default' || kernelName === null) ?  (await this._default) : kernelName
        let options = {
            name: newKernelName,
            serverSettings: this._settings
        };
        const newKernel = await Kernel.startNew(options)
        console.log("new kernel")
        console.log(newKernel)
        this._kernelCache[kernelName] = newKernel._id;
        return newKernel
    }

    match(header) {
        console.log("matching header", header)
        return header.match(this.beginRegex) !== null;
    }

    // async startLSIfNeeded(header, editor) {
    //     // const parsedHeader = this.parseHeader(header)
    //     // let kernelName = null;
    //     // if (parsedHeader && 'kernel' in parsedHeader) {
    //     //     kernelName = parsedHeader['kernel']
    //     // } else {
    //     //     kernelName = await this._default;
    //     // }

    //     // if (this._languageServers.includes(kernelName)) {
    //     //     return
    //     // }

    //     // const pythonPath = await Kernel.getSpecs(this._settings).then(kernelSpecs => {
    //     //     // console.log('Default spec:', kernelSpecs.default);
    //     //     const match = Object.keys(kernelSpecs.kernelspecs).filter(n => n === kernelName)
    //     //     if (match.length > 0) {
    //     //         return kernelSpecs.kernelspecs[match[0]].argv[0]
    //     //     }
    //     //     return Promise.resolve(null);
    //     // })
    //     // if (pythonPath) {
    //     //     this.startLanguageServer(this._languageServerPort, pythonPath);
    //     //     this._languageServers.push(kernelName);
    //     // }
    //     console.log("starting ls")
    //     const parsedHeader = await this.getParsedHeader(header);
    //     this._completionProvider = new CompletionProvider(editor, parsedHeader);
    // }

    async close() {
        const runningKernels = await this.getRunning();
        for(let k of runningKernels) {
            if (k.id in this._kernelCache) {
                const kernel = await Kernel.connectTo(k);
                kernel.shutdown()
                delete this._kernelCache[k.id]
            }
        }
    }
}