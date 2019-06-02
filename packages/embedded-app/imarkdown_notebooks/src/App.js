import './App.css'
import React, {Component} from 'react'
// import Notebook from './Notebook2';
import KernelManager from './kernelManager'
import JupyterKernel from './kernels/jupyterKernel'
import { KernelMessage, Kernel, ServerConnection } from '@jupyterlab/services';
import JupyterFSProvider from './jupyterFSProvider'
import Nav from './Nav'
import ReactModal from 'react-modal';
import Notebook from 'markdown-notebook-component'
import Finder from 'finder-component';
import NotificationSystem from 'react-notification-system';

class App extends Component {

  constructor(props) {
    super(props)
    console.log("creating app")
    this.notificationSystem = React.createRef()
    this.warningMessage = this.warningMessage.bind(this)
    this._kernelManager = new KernelManager(this.warningMessage);
    this.state = {showFS: false, path: null, fsProvider: null, name: 'Untitled.md', needsRename: false, width: window.innerWidth}
    this.openNotebook = this.openNotebook.bind(this)
    this.openFile = this.openFile.bind(this)
    this.getContent = this.getContent.bind(this)
    this.saveContent = this.saveContent.bind(this)
    this.registerModel = this.registerModel.bind(this)
    this.createFile = this.createFile.bind(this)
    this.changeName = this.changeName.bind(this)
    this.updateWidth = this.updateWidth.bind(this)
  }


  warningMessage(msg) {
    // event.preventDefault();
    const notification = this.notificationSystem.current;
    notification.addNotification({
      message: msg,
      level: 'error'
    });
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.updateWidth)
  }

  updateWidth() {
    console.log("updating width")
    this.setState({width: window.innerWidth})
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateWidth)
    ReactModal.setAppElement(document.querySelector('#content'));
    const settings = ServerConnection.makeSettings(
      {
          baseUrl: document.location.origin, 
          wsUrl: `ws://${document.location.host}`,
          token: this.props.token
      }
    )
    const kernel = new JupyterKernel(settings)
    // kernel.initializeKernel('').then(() => this.registerKernel(kernel))
    this.registerKernel(kernel)
    const fsProvider = new JupyterFSProvider(settings)

    this.setState({fsProvider: fsProvider})

    if (this.props.path) {
      console.log('Path: ', this.props.path)
      const splitPath = this.props.path.split("/");
      const name = splitPath[splitPath.length - 1];
      this.openFile({name, path: this.props.path})
    }

  }

  registerKernel(kernel) {
    this._kernelManager.register(kernel)
  }

  componentWillUnmount() {
    this._kernelManager.close()
  }

  openNotebook(path) {
    this.setState({view: 'notebook'})
  }

  showFS(showOrHide, mode = null) {
    this.setState({showFS: showOrHide, showFSMode: mode})
  }

  async openFile(fileInfo) {
    const {path, name} = fileInfo
    this.showFS(false)
    this.setState({path: path, name: name, lastSavePath: path})
  }

  promptForPath() {
    this.showFS(true, 'save')
  }

  async saveContent(editorContent) {
    if (this.state.fsProvider) {
      const joinedContent = editorContent.join('\n')// TODO: figure out if I need to do anything special with EOL characters for different platforms
      if (!this.state.path) {
        this.promptForPath()
      } else {
        if (this.state.needsRename) {
          // this.state.lastSavePath
          await this.state.fsProvider.rename(this.state.lastSavePath, this.state.path);
          // this.state.name
        }
        this.state.fsProvider.save(this.state.path, joinedContent)
        if (this.state.needsRename) {
          document.location.pathname = `imarkdown/edit/${this.state.path}`
        }
        // this.setState({lastSavePath: this.state.path, needsRename: false})
      }
    }
    // TODO: add warning if no fs provider
  }

  createFile(path, name) {
    const content = this.state.editorModel ? this.state.editorModel.getLinesContent().join('\n') : ''
    this.state.fsProvider.save(path, content);
    document.location.pathname = `imarkdown/edit/${path}`
    // this.showFS(false)
    // this.setState({path: path, name: name})
  }

  async getContent() {
    const {content} = await this.state.fsProvider.getContent(this.state.path);
    return content;
  }

  changeName(newName) {
    let newState = { name: newName }
    if(this.state.path) {
      const splitPath = this.state.path.split('/')
      splitPath[splitPath.length - 1] = newName
      const newPath = splitPath.join('/')
      newState['path'] = newPath
      // TODO: add renaming call here
      if (this.state.name !== newName) {
        newState['needsRename'] = true
      }
    }
    this.setState(newState)
  }

  registerModel(model) {
    this.setState({editorModel: model})
  }

  openFilePath(fileInfo) {
    const {path, name} = fileInfo
    document.location.pathname = `imarkdown/edit/${fileInfo.path}`
  }

  render() {
      return <div> 
        <Nav 
          nameChange={this.changeName} 
          fileName={this.state.name} 
          filePath={this.state.path} 
          showFS={() => this.showFS(true, 'open')}
          kernelManager={this._kernelManager}
        />
        <div id='content'>
          <Notebook 
            registerModel={this.registerModel} 
            path={this.state.path} 
            isRename={this.state.needsRename} 
            save={this.saveContent} 
            getContent={this.getContent} 
            kernelManager={this._kernelManager} 
            style={{width: this.state.width, height: "100%"}}
          />
          <ReactModal 
            isOpen={this.state.showFS}
            contentLabel="Minimal Modal Example"
            parentSelector={() => document.querySelector('#content')}
          >
            {this.state.fsProvider ? 
              <Finder openFile={this.openFilePath} 
                      onCancel={() => this.showFS(false)} 
                      fsProvider={this.state.fsProvider}
                      fileName={this.state.name}
                      mode={this.state.showFSMode}
                      createFile={this.createFile}
              />
              : <div>loading file system provider</div>
            }
          </ReactModal>
        </div>
        <NotificationSystem ref={this.notificationSystem} />
      </div>
  }
}

export default App;