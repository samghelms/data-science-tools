import React, {Component} from 'react'
import finder from './finderInternals';
import './finder-style.css'
import * as _ from './util';

const isMD = (item) => {
    const splitName = item.name.split('.');
    return splitName[splitName.length - 1] === 'md'

}

const isFolder = info => {
    return info.type === 'directory'
}

const ButtonGroup = ({mode, onCancel, onNameChange, disabledOpen, selectedFile, openFile, createFile, fileName}) => {
    console.log(fileName)
    if (mode === 'save') {
        return <span>
        <span>Save as: </span><input onChange={onNameChange} defaultValue={fileName}></input>
        <button onClick={onCancel} style={{float: "right"}}>cancel</button>
        <button disabled={disabledOpen} onClick={() => createFile(selectedFile, fileName)} style={{float: "right"}}>save</button>
    </span>
    }
    return <span>
        <button onClick={onCancel} style={{float: "right"}}>cancel</button>
        <button disabled={disabledOpen} onClick={() => openFile(selectedFile)} style={{float: "right"}}>open</button>
    </span>
}


export default class Finder extends Component {
    constructor(props) {
        super(props)
        this.finderRef = React.createRef();
        this.createSimpleColumn = this.createSimpleColumn.bind(this)
        this.createItemContent = this.createItemContent.bind(this)
        this.handleNameChange = this.handleNameChange.bind(this)
        this.createFile = this.createFile.bind(this)
        this.state = {disabledOpen: true, fileName: this.props.fileName}

        this.tests = mode => {
            if (mode === 'save') {
                return isFolder
            }
            return isMD
        }
    }

    componentDidMount() {
        const this2 = this
        // createExample(this.finderRef)
        this.finder = finder(this.finderRef, this.props.fsProvider.get, {
            createItemContent: this.createItemContent
        });
    
        // when a leaf node selected, display the details in a new column
        this.finder.on('leaf-selected', function selected(item) {
            this2.finder.emit('create-column', this2.createSimpleColumn(item));
        });
    
        // scroll to the right if necessary when a new column is created
        this.finder.on('column-created', function columnCreated() {
            this2.finderRef.scrollLeft = this2.finderRef.scrollWidth - this2.finderRef.clientWidth;
        });

        this.finder.on('item-selected', (obj) => {
            const item = obj.item._item;
            this.setState({selectedFile: item, disabledOpen: !this.tests(this.props.mode)(item)})
        });

    }

    createSimpleColumn(item) {
        var div = _.el('div.fjs-col.leaf-col');
        var row = _.el('div.leaf-row');
        var filename = _.text(item.name);
        var i = _.el('i');
        var size = _.el('div.meta');
        var sizeLabel = _.el('strong');
        var mod = _.el('div.meta');
        var modLabel = _.el('strong');
        var path = _.el('div.meta');
        var pathLabel = _.el('strong');
        
    
        _.addClass(i, ['fa', 'fa-file-o']);
        _.append(sizeLabel, _.text('Size: '));
        _.append(size, [sizeLabel, _.text(item.size)]);
        _.append(modLabel, _.text('Modified: '));
        _.append(mod, [modLabel, _.text(item.last_modified)]);
        _.append(pathLabel, _.text('Path: '));
        _.append(path, [pathLabel, _.text(item.path)]);
    
        _.append(row, [i, filename, size, mod, path]);
    
        if (this.tests(this.props.mode)(item)) {
            var open = _.el('div.meta');
            var openLabel = _.el('strong');
            _.append(openLabel, _.text('Open as notebook: '));
            var button = _.el('button');
            button.onclick = () => this.props.openFile(item)
            _.append(button, [_.text('open')])
            _.append(open, [openLabel, button]);
            _.append(row, [open])
        }
    
        return _.append(div, row);
    }

    // how each item in a column should be rendered
    createItemContent(cfg, item) {
        var frag = document.createDocumentFragment();
        var label = _.el('span');
        var iconPrepend = _.el('i');
        var iconAppend = _.el('i');
        var prependClasses = ['fa'];
        var appendClasses = ['fa'];

        // prepended icon
        if (item.type === 'directory') {
            prependClasses.push('fa-folder');
        } else if (item.type === 'file') {
            prependClasses.push('fa-file-o');
        }
        _.addClass(iconPrepend, prependClasses);

        // text label
        _.append(label, [iconPrepend, _.text(item.name)]);
        frag.appendChild(label);

        // appended icon
        if (item.type === 'directory') {
            appendClasses.push('fa-caret-right');
        }

        _.addClass(iconAppend, appendClasses);
        frag.appendChild(iconAppend);

        if (this.tests(this.props.mode)(item)) {
            label.ondblclick = () => this.props.openFile(item)
        }

        return frag;
    }

    createFile (fileInfo, fileName) {
        this.props.createFile(fileInfo.path + '/' + fileName, fileName)
    }   

    handleNameChange(e) {
        const newName = e.target.value
        this.setState({fileName: newName})
    }

    handleKeys(e) {
        console.log("key press detected")
    }

    render() {
        return <div><div onKeyPress={this.handleKeys} style={this.props.style} ref={c => this.finderRef = c}/>
            <ButtonGroup createFile={this.createFile} onNameChange={this.handleNameChange} fileName={this.state.fileName} saveFile={this.saveFile} onCancel={this.props.onCancel} selectedFile={this.state.selectedFile} disabledOpen={this.state.disabledOpen} openFile={this.props.openFile} mode={this.props.mode}/>
        </div>
    }
}