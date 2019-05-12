import React, { Component } from "react";
import languagePluginLoader from './pyodide-loader'
import { Pyodide } from './pyodide-loader/types'
// import { editor } from "monaco-editor";
import MonacoEditor from "@nteract/monaco-editor";
import styled from "styled-components";
import RingLoader from 'react-spinners/RingLoader';

const EditorContainer = styled.div`
  left: 0;
  height: 400px;
  width: 600px;
  .monaco {
    height: 100%;
  }
`;

// const editorOptions: editor.IEditorConstructionOptions = {
//   glyphMargin: true,
//   wordWrap: "on"
// }
// const startState = {
//   language: 'python',
//   defaultVal: "print('hi')",
//   rows: [],
//   contentWidgets: [],
//   newContentWidgets: true,
// }


export class PyPlayground extends Component<{}, {pyodide: Pyodide, text: string, result: string}> {
  // _model: editor.ITextModel
  // _editor:editor.IStandaloneCodeEditor
  // _monacoRef = React.createRef<HTMLDivElement>();

  constructor(props) {
    super(props);
    this.state = {pyodide: null, text: "'test'", result: null};
    // this._model = editor.createModel(startState.defaultVal, startState.language);
  }

  async componentDidMount() {
  
    // this._editor = editor.create(this._monacoRef.current!, {
    //   value: 'test',
    //   language: "python",
    //   // theme: this.props.theme,
    //   minimap: {
    //     enabled: false
    //   },
    //   autoIndent: true
    // });
        // this._editor.setModel(this._model)
        
        // this._model.onDidChangeContent((changeEvent) => {
        //     this._cellsManager.updateCells(changeEvent);
        // })

        // this._editor.layout()
    // }

    const pyodide = await languagePluginLoader('http://localhost:5000/static/');
    await pyodide.loadPackage(['numpy', 'pandas'])
    this.setState({pyodide});
  }

  handleChange = (newText: string) => {
    this.setState({ text: newText });
  }

  execute = () => {
    console.log("executing", this.state.text)
    const res = this.state.pyodide.runPython(this.state.text) as any;
    console.log('finished, res', res)
    this.setState({result: res})
  }

  render() {
    if (this.state.pyodide) {
      return <div>
        <EditorContainer>
          <MonacoEditor
            theme="vscode"
            mode="python"
            value={this.state.text}
            onChange={this.handleChange}
          />
        </EditorContainer>
        <button onClick={this.execute}>run code</button>
        <div>output: </div>
        {this.state.result ? <div>{this.state.result}</div> : <div>none yet</div>}
      </div>
    }
    return <div>
      <h3>loading python...</h3>
      <RingLoader/>
    </div>
  }
}

