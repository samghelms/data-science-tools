import * as React from 'react';
import {NavButton} from 'react-svg-buttons';

export default class Nav extends React.Component {
    constructor(props) {
        super(props)
        this.handleNameChange = this.handleNameChange.bind(this)
    }
    handleNameChange(e) {
        this.props.nameChange(e.target.value)
    }

    render() {
        return <div style={{height: 65, width: '100%'}}> 
            <input onChange={this.handleNameChange} contentEditable style={{top: 20, left: 20, position: "absolute"}} value={this.props.fileName}/>
            <NavButton onClick={() => this.props.showFS(true)} style={{float: "right", padding: 10, marginRight: 40}} direction="down" opened={false} />
        </div>
    }
}