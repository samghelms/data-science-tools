import './App.css'
import React, {Component} from 'react'
// import Notebook from './Notebook2';
import KernelSelector from './kernelSelector';
import KernelManager from './kernelManager'
import JupyterKernel from './kernels/jupyterKernel'
import { KernelMessage, Kernel, ServerConnection } from '@jupyterlab/services';
import Finder from 'finder-component';
import JupyterFSProvider from './jupyterFSProvider'
import Nav from './Nav'
import ReactModal from 'react-modal';
import {CloseButton, PlusButton} from 'react-svg-buttons';
import Notebook from 'markdown-notebook-component'

class App extends Component {

  constructor(props) {
    super(props)
    this._kernelManager = new KernelManager();
    this.state = {showFS: false, path: null, fsProvider: null, name: 'Untitled.md', needsRename: false}
    this.openNotebook = this.openNotebook.bind(this)
    this.openFile = this.openFile.bind(this)
    this.getContent = this.getContent.bind(this)
    this.saveContent = this.saveContent.bind(this)
    this.registerModel = this.registerModel.bind(this)
    this.createFile = this.createFile.bind(this)
    this.changeName = this.changeName.bind(this)
  }

  componentDidMount() {
    ReactModal.setAppElement(document.querySelector('#content'));
    const settings = ServerConnection.makeSettings(
      {
          baseUrl: document.location.origin, 
          wsUrl: `ws://${document.location.host}`,
          token: this.props.token
      }
    )
    const kernel = new JupyterKernel(settings)
    kernel.initializeKernel('').then(() => this.registerKernel(kernel))
    const fsProvider = new JupyterFSProvider(settings)

    this.setState({fsProvider: fsProvider})
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
        this.setState({lastSavePath: this.state.path, needsRename: false})
      }
    }
    // add warning if no fs provider
  }

  createFile(path, name) {
    const content = this.state.editorModel ? this.state.editorModel.getLinesContent().join('\n') : ''
    this.state.fsProvider.save(path, content);
    this.showFS(false)
    this.setState({path: path, name: name})
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

  render() {
      return <div> 
        <Nav nameChange={this.changeName} fileName={this.state.name} filePath={this.state.path} showFS={() => this.showFS(true, 'open')}/>
        <div id='content'>
          <Notebook registerModel={this.registerModel} path={this.state.path} isRename={this.state.needsRename} save={this.saveContent} getContent={this.getContent} kernelManager={this._kernelManager} style={{width: 800, height: 800}}/>
          <ReactModal 
            isOpen={this.state.showFS}
            contentLabel="Minimal Modal Example"
            parentSelector={() => document.querySelector('#content')}
          >
            {this.state.fsProvider ? 
              <Finder openFile={this.openFile} 
                      onCancel={() => this.showFS(false)} 
                      fsProvider={this.state.fsProvider}
                      fileName={this.state.name}
                      mode={this.state.showFSMode}
                      createFile={this.createFile}
              />
              : <div>loading</div>
            }
          </ReactModal>
        </div>
      </div>
  }
}

export default App;