"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./App.css");
var react_1 = __importStar(require("react"));
// import Notebook from './Notebook2';
var kernelManager_1 = __importDefault(require("./kernelManager"));
var jupyterKernel_1 = __importDefault(require("./kernels/jupyterKernel"));
var services_1 = require("@jupyterlab/services");
// import Finder from 'finder-component';
// // import JupyterFSProvider from './jupyterFSProvider'
// import Nav from './Nav'
// import ReactModal from 'react-modal';
var markdown_notebook_component_1 = __importDefault(require("markdown-notebook-component"));
var App = /** @class */ (function (_super) {
    __extends(App, _super);
    function App(props) {
        var _this = _super.call(this, props) || this;
        _this.notificationSystem = react_1.default.createRef();
        // this.warningMessage = this.warningMessage.bind(this)
        // this._kernelManager = new KernelManager(this.warningMessage);
        _this._kernelManager = new kernelManager_1.default(function () { return null; });
        _this.state = {
            showFS: false,
            fsProvider: null,
            name: 'Untitled.md',
            needsRename: false,
            width: window.innerWidth,
            path: null
        };
        // this.openNotebook = this.openNotebook.bind(this)
        // this.openFile = this.openFile.bind(this)
        // this.getContent = this.getContent.bind(this)
        // this.saveContent = this.saveContent.bind(this)
        // this.registerModel = this.registerModel.bind(this)
        // this.createFile = this.createFile.bind(this)
        // this.changeName = this.changeName.bind(this)
        _this.updateWidth = _this.updateWidth.bind(_this);
        return _this;
    }
    // warningMessage(msg) {
    //   // event.preventDefault();
    //   const notification = this.notificationSystem.current;
    //   if (notification) {
    //     notification.addNotification({
    //       message: msg,
    //       level: 'error'
    //     });
    //   }
    // }
    App.prototype.updateWidth = function () {
        console.log("updating width");
        this.setState({ width: window.innerWidth });
    };
    App.prototype.componentDidMount = function () {
        window.addEventListener('resize', this.updateWidth);
        // ReactModal.setAppElement(document.querySelector('#content'));
        if (document.location) {
            var settings = services_1.ServerConnection.makeSettings({
                baseUrl: document.location.origin,
                wsUrl: "ws://" + document.location.host,
                token: this.props.token
            });
            var kernel = new jupyterKernel_1.default(settings);
            this.registerKernel(kernel);
        }
    };
    App.prototype.registerKernel = function (kernel) {
        this._kernelManager.register(kernel);
    };
    App.prototype.componentWillUnmount = function () {
        this._kernelManager.close();
        window.removeEventListener('resize', this.updateWidth);
    };
    // openNotebook(path) {
    //   this.setState({view: 'notebook'})
    // }
    // showFS(showOrHide: boolean, mode = null) {
    //   this.setState({showFS: showOrHide, showFSMode: mode})
    // }
    // async openFile(fileInfo) {
    //   const {path, name} = fileInfo
    //   this.showFS(false)
    //   this.setState({path: path, name: name, lastSavePath: path})
    // }
    // promptForPath() {
    //   this.showFS(true, 'save')
    // }
    // async saveContent(editorContent) {
    //   if (this.state.fsProvider) {
    //     const joinedContent = editorContent.join('\n')// TODO: figure out if I need to do anything special with EOL characters for different platforms
    //     if (!this.state.path) {
    //       this.promptForPath()
    //     } else {
    //       if (this.state.needsRename) {
    //         // this.state.lastSavePath
    //         await this.state.fsProvider.rename(this.state.lastSavePath, this.state.path);
    //         // this.state.name
    //       }
    //       this.state.fsProvider.save(this.state.path, joinedContent)
    //       if (this.state.needsRename) {
    //         document.location.pathname = `imarkdown/edit/${this.state.path}`
    //       }
    //       // this.setState({lastSavePath: this.state.path, needsRename: false})
    //     }
    //   }
    //   // TODO: add warning if no fs provider
    // }
    // createFile(path, name) {
    //   const content = this.state.editorModel ? this.state.editorModel.getLinesContent().join('\n') : ''
    //   this.state.fsProvider.save(path, content);
    //   document.location.pathname = `imarkdown/edit/${path}`
    //   // this.showFS(false)
    //   // this.setState({path: path, name: name})
    // }
    // async getContent() {
    //   const {content} = await this.state.fsProvider.getContent(this.state.path);
    //   return content;
    // }
    // changeName(newName) {
    //   let newState = { name: newName }
    //   if(this.state.path) {
    //     const splitPath = this.state.path.split('/')
    //     splitPath[splitPath.length - 1] = newName
    //     const newPath = splitPath.join('/')
    //     newState['path'] = newPath
    //     // TODO: add renaming call here
    //     if (this.state.name !== newName) {
    //       newState['needsRename'] = true
    //     }
    //   }
    //   this.setState(newState)
    // }
    // registerModel(model) {
    //   this.setState({editorModel: model})
    // }
    // openFilePath(fileInfo) {
    //   const {path, name} = fileInfo
    //   document.location.pathname = `imarkdown/edit/${fileInfo.path}`
    // }
    App.prototype.render = function () {
        return react_1.default.createElement("div", null,
            react_1.default.createElement("div", { id: 'content' },
                react_1.default.createElement(markdown_notebook_component_1.default
                // registerModel={this.registerModel} 
                , { 
                    // registerModel={this.registerModel} 
                    path: this.state.path || "", 
                    // isRename={this.state.needsRename} 
                    // save={this.saveContent} 
                    // getContent={this.getContent} 
                    kernelManager: this._kernelManager, style: { width: this.state.width + "px", height: "100%" } })));
    };
    return App;
}(react_1.Component));
exports.default = App;
//# sourceMappingURL=app.js.map