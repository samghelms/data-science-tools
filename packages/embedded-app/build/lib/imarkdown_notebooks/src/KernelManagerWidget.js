import React, {Component} from 'react'

class Kernels extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        if (this.props.kernelsList) {
            return <div>
            {this.props.kernelsList}
            </div>
        } else {
            return <div>loading kernels list</div>
        }
    }
}

export default class KernelManagerWidget extends Component {
    constructor(props) {
        super(props)
        this.handleNameChange = this.handleNameChange.bind(this)
        this.state = {}
    }

    handleNameChange(e) {
        this.props.nameChange(e.target.value)
    }

    async componentDidMount() {
        const kernels = await this.props.kernelManager.list()
        this.setState({kernels: kernels})
    }

    render() {
        return <div style={{height: 65, width: '100%'}}> 
            <Kernels kernelsList={this.state.kernels}></Kernels>
        </div>
    }
}