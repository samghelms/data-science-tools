import * as React from 'react';
import {NavButton, MorphIcon} from 'react-svg-buttons';
import ReactModal from 'react-modal';
import KernelManager from './KernelManagerWidget';

export default class Nav extends React.Component {
    constructor(props) {
        super(props)
        this.handleNameChange = this.handleNameChange.bind(this)
        this.state = {hoverKernel: false, clicked: false, height: 65}
        this.onHoverKernel = this.onHoverKernel.bind(this)
        this.padding = 10
    }
    handleNameChange(e) {
        this.props.nameChange(e.target.value)
    }

    onHoverKernel(status) {
        this.setState({hoverKernel: status})
    }

    onClickKernel(status) {
        this.setState({clicked: status})
    }

    render() {
        return <div style={{height: this.state.height, width: '100%'}}> 
            <input onChange={this.handleNameChange} contentEditable style={{top: 20, left: 20, position: "absolute"}} value={this.props.fileName}/>
            <NavButton onClick={() => this.props.showFS(true)} style={{cursor: 'pointer', float: "right", height: this.state.height - 2 * this.padding, padding: this.padding, marginRight: 40}} direction="down" opened={false} />
            <MorphIcon onClick={() => this.onClickKernel(true)} onMouseLeave={() => this.onHoverKernel(false)} onMouseOver={() => this.onHoverKernel(true)} style={{cursor: 'pointer', height: this.state.height - 2 * this.padding, float: "right", padding: this.padding, marginRight: 20}} type={this.state.hoverKernel ? 'plusSparks' : 'thunderbolt'}/>
            <ReactModal 
            isOpen={this.state.clicked}
            contentLabel="Minimal Modal Example"
            parentSelector={() => document.querySelector('#content')}
          >
            <KernelManager kernelManager={this.props.kernelManager}/>
            <button style={{position: "absolute", bottom: 0, right: 0}} onClick={() => this.onClickKernel(false)}>close</button>
          </ReactModal>
        </div>
    }
}