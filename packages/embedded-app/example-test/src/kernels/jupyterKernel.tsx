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

export interface JupyterKernelDisplayProps {
    settings: any;
}

export interface JupyterKernelDisplayState {
    settings: any;
    running: any | null;
    potentialKernels: any | null;
    defaultKernel: any | null;
}

class JupyterKernelDisplay extends React.Component<JupyterKernelDisplayProps, JupyterKernelDisplayState> {
    _kernelCache: any;
    constructor(props: JupyterKernelDisplayProps) {
        super(props)
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

    async shutdown(run: any) {
        console.log("shutting kernel down")
        const kernel = await Kernel.connectTo(run);
        await kernel.shutdown()

        const running = await Kernel.listRunning(this.props.settings)
        this.setState({running})
    }

    async restart(run: any) {
        console.log("restarting kernel")
        const kernel = await Kernel.connectTo(run);
        await kernel.restart()
    }

    render() {
        return <div>
            {this.state.running ?
            <h4>running kernels</h4>: null}
            {this.state.running ? 
            this.state.running.map((run: any, i: number) => (
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
            this.state.potentialKernels.map((k: any, i: number) => (
                <div key={i}>
                    <div><b>{k.name}</b></div>
                    <div>{`example block header: \`\`\`python {kernel: ${k.name}} `}</div>
                </div>
            )): null}
        </div>
    }
}


class Sanitizer implements ISanitizer {
    sanitize(dirty: string) {
        let clean = dirty.replace('"dataframe"', '"dataframe mdl-data-table mdl-js-data-table mdl-shadow--2dp"')
        return clean
    }
}

export default class JupyterKernel {
    // TODO: language server neeeds a port range
    // TODO: handle situations where language servers die or won't start (escape hatch at the very least)
    _settings: any;
    _default: any;
    kernel: any;
    beginRegex: RegExp;
    _kernelCache: any;
    _languageServerPort: any;
    _languageServers: any;
    // _completionProvider: any;
    constructor(settings: any, languageServerPort = 3000) { 
        this._settings = settings
        this._default = Kernel.getSpecs(settings).then(kernelSpecs => kernelSpecs.default)
        this.kernel = null
        this.beginRegex = /^```python/
        this._kernelCache = {}
        this._languageServerPort = languageServerPort
        this._languageServers = {}
        // this._completionProvider = new CompletionProvider()
    }

    async getParsedHeader(header: string) {
        const parsedHeader = this.parseHeader(header)
        let kernelName = null;
        if (parsedHeader && 'kernel' in parsedHeader) {
            kernelName = parsedHeader['kernel']
        } else {
            kernelName = await this._default;
        }
        return kernelName
    }

    // async getLanguageServerProvider(header: string) {

    //     return this._completionProvider.languageClient;
    // }

    async setLanguageServerProvider(provider: any, id: any) {
        this._languageServers[id] = provider
    }

    async getKernelName(header: string) {
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

    reactElement(parentKeyName: any, key: any) {
        return <JupyterKernelDisplay settings={this._settings} key={key}/>
    }

    parseHeader(header: string) {
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

    execute(header: string, code: string) {
        const model = new OutputAreaModel();
        const opts = { initialFactories, sanitizer: new Sanitizer() }
        const rendermime = new RenderMimeRegistry(opts);
        const outputArea = new SimplifiedOutputArea({ model, rendermime }) as any;

        this.getOrStartKernel(header).then(kernel => {
            const future = kernel.requestExecute({ code: code });
            outputArea.future = future;
        })

        outputArea.onChildAdded = (msg: any) => {
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

    async getOrStartKernel(header: string) {
        const parsedHeader = this.parseHeader(header)
        let kernelName: any = null;
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
        this._kernelCache[kernelName] = newKernel.id;
        return newKernel
    }

    match(header: string) {
        console.log("matching header", header)
        return header.match(this.beginRegex) !== null;
    }

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