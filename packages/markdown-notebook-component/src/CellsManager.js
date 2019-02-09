import { buttonsWidget } from './buttonsWidget'
import CompletionProvider from './CompletionProvider'

const blockBeginRegex = /```[\s]{0,5}[A-Za-z]+/g
const blockEndRegex = /```([\s]+$|$)/g

class Cell {
    constructor(start, end, editor, model, kernelManager) {
        this.start = start
        this.end = end
        this.editor = editor
        this._model = model
        this._kernelManager = kernelManager
        this.zone = null
        this.viewZoneId = null 
        this.overlay = null 
        this.zoneHeight = 200
        // this.addOutput = this.addOutput.bind(this)
        this.getStartLine = this.getStartLine.bind(this)
        this.buttonsWidget = buttonsWidget(start, 200, () => this.addExecuteOutput(), this.getStartLine)
        this.editor.addContentWidget(this.buttonsWidget)

        this.outputExpanded = false
    }

    addSerializedOutput(html, line) {

        this.outputNode = document.createElement('div')
        this.outputNode.innerHTML = html

        this._addOutput(this.outputNode, line)
    }

    addExecuteOutput() {
        const cellContents = this._model.getValueInRange({startLineNumber: this.start, endLineNumber: this.end})
        const splitContents = cellContents.split(this._model.getEOL())
        const header = splitContents[0]
        const body = splitContents.slice(1,).join(this._model.getEOL());
        const executeResults = this._kernelManager.execute(header, body);
        if (executeResults) {
            this._addOutput(executeResults.node)
        }
    }

    _addOutput(nodeToAdd) {
        const this2 = this
        this.editor.changeViewZones(function(changeAccessor) {
            nodeToAdd.style.zIndex = 100;
            nodeToAdd.style.overflow = 'hidden'
            // allows interacting with outputs
            nodeToAdd.onmousedown = (e) => {
                e.stopPropagation();
            }

            nodeToAdd.onmousemove = (e) => {
                e.stopPropagation();
            }

            const margin = document.createElement('div')
            const btn = document.createElement('button')
            btn.innerText = 'expand'
            margin.style.zIndex = 1
            margin.appendChild(btn)

            // resets to 5 lines after an execution
            this2.zoneHeight = 100
            this2.zone = {
                afterLineNumber: this2.end,
                heightInPx: this2.zoneHeight,
                domNode: nodeToAdd,
                marginDomNode: margin
            }
            // remove old zones
            if (this2.viewZoneId) {
                changeAccessor.removeZone(this2.viewZoneId)
            }
            this2.viewZoneId = changeAccessor.addZone(this2.zone)
    
            btn.onclick = () => {
                if (this2.outputExpanded) {
                    this2.zone.heightInPx = 100
                    this2.editor.changeViewZones(function(changeAccessor2) {
                        changeAccessor2.layoutZone(this2.viewZoneId)
                    })
                    this2.outputExpanded = false
                    btn.innerText = 'expand'
                } else {
                    this2.zone.heightInPx = nodeToAdd.scrollHeight;
                    this2.editor.changeViewZones(function(changeAccessor2) {
                        changeAccessor2.layoutZone(this2.viewZoneId)
                    })
                    this2.outputExpanded = true
                    btn.innerText = 'collapse'
                }
            }
        })
    }

    addOutput() {
        const this2 = this
        this.editor.changeViewZones(function(changeAccessor) {
            // remove existing zone if it exists
            if (this2.viewZoneId) {
                changeAccessor.removeZone(this2.viewZoneId)
            }

            const cellContents = this2._model.getValueInRange({startLineNumber: this2.start, endLineNumber: this2.end})
            const splitContents = cellContents.split(this2._model.getEOL())
            const header = splitContents[0]
            const body = splitContents.slice(1,).join(this2._model.getEOL());
            const executeResults = this2._kernelManager.execute(header, body);

            // const container = document.createElement('div')
            // container.appendChild(executeResults.node)

            // container.style.border = '1px solid black'
            // container.style.overflow = 'hidden'
            executeResults.node.style.zIndex = 100;
            // allows interacting with outputs
            executeResults.node.onmousedown = (e) => {
                e.stopPropagation();
            }

            executeResults.node.onmousemove = (e) => {
                e.stopPropagation();
            }

            const margin = document.createElement('div')
            const btn = document.createElement('button')
            btn.innerText = 'expand'
            margin.style.zIndex = 1
            margin.appendChild(btn)

            // resets to 5 lines after an execution
            this2.zoneHeight = 100
            if (executeResults) {
                this2.zone = {
                    afterLineNumber: this2.end,
                    heightInPx: this2.zoneHeight,
                    domNode: executeResults.node,
                    marginDomNode: margin
                }
                this2.viewZoneId = changeAccessor.addZone(this2.zone)
            }
            console.log(executeResults)
            btn.onclick = () => {
                if (this2.outputExpanded) {
                    this2.zone.heightInPx = 100
                    this2.editor.changeViewZones(function(changeAccessor2) {
                        changeAccessor2.layoutZone(this2.viewZoneId)
                    })
                    this2.outputExpanded = false
                    btn.innerText = 'expand'
                } else {
                    this2.zone.heightInPx = executeResults.node.scrollHeight;
                    this2.editor.changeViewZones(function(changeAccessor2) {
                        changeAccessor2.layoutZone(this2.viewZoneId)
                    })
                    this2.outputExpanded = true
                    btn.innerText = 'collapse'
                }
            }

        })
    }

    getStartLine() {
        return this.start
    }

    updateStart(lineDiff) {
        this.start += lineDiff;
        this.editor.layoutContentWidget(this.buttonsWidget)
    }

    updateEnd(lineDiff) {
        this.end += lineDiff;
        if (this.viewZoneId) {
            this.zone.afterLineNumber = this.end;
            const this2 = this;
            this.editor.changeViewZones(function(changeAccessor) {
                changeAccessor.layoutZone(this2.viewZoneId)
            })
        }
    }

    contains(lineNum) {
        return lineNum <= this.end && lineNum >= this.start;
    }

    dispose() {
        const this2 = this
        this.editor.changeViewZones(function(changeAccessor) {
            // remove existing zone if it exists
            if (this2.viewZoneId) {
                changeAccessor.removeZone(this2.viewZoneId)
            }
        })
        this.editor.removeContentWidget(this.buttonsWidget)
    }
}

export default class CellsManager {
    constructor(model, editor, kernelManager) {
        this._model = model;
        this._editor = editor;
        this._cells = {};
        this._kernelManager = kernelManager; // Kernels for lack of a better word. Anything that can execute code.
        this.serializeCells = this.serializeCells.bind(this)
        this.serializedOutputs = {}
        this.inCellValue = this.inCellValue.bind(this)
        this._completionProvider = new CompletionProvider(this._editor)
    }

    addSerializedOutput(serializeOutput, line) {
        this.serializedOutputs[line] = serializeOutput
    }

    addCell(start, end) {
        const newCell = new Cell(start, end, this._editor, this._model, this._kernelManager);
        if (end in this.serializedOutputs) {
            newCell.addSerializedOutput(this.serializedOutputs[end], end)
        }
        this._cells[start] = newCell
    }

    updateCells(changeEvent) {
        changeEvent.changes.map((ch) => {
            // console.log(ch.text.split('\n'))
            const newLines = ch.text.split(this._model.getEOL())
            const newLinesLength = newLines.length - 1;
            const startLine = ch.range.startLineNumber;
            let endLine = ch.range.endLineNumber;
            const length = endLine - startLine;

            const lineDiff = newLinesLength - length;

            // figure out if we need to remove cells
            if (lineDiff < 0) {
                // delete cells in the deleted range
                const cellsInRange = this.cellsInside(startLine, endLine)
                if (cellsInRange.length > 0) {
                    // console.log("cells inside")
                    // console.log(cellsInRange)
                    cellsInRange.map(k => {
                        this._cells[k].dispose()
                        delete this._cells[k]
                    })
                }
                // update our cells reference
                // this._cells = this._cells.filter(cell => cell.line > startLine && cell.line < endLine)
            } else if (lineDiff > 0) {
                if (this.inCell(startLine)) {
                    endLine += lineDiff
                } else {
                    // console.log("parsing pasted input", newLines)
                    // parse input for new cells
                    let inCellFlag = false;
                    let start = null;
                    let foundCell = false;
                    for (let i = 0; i < newLines.length; i++) {
                        const l = newLines[i];
                        // console.log(l);
                        // console.log(inCellFlag)
                        if (inCellFlag === false) {
                            const startTest = l.match(blockBeginRegex)
                            if (startTest) {
                                start = i + startLine;
                                inCellFlag = true;
                            }
                        } else if (inCellFlag === true) {
                            const endTest = l.match(blockEndRegex)
                            if (endTest) {
                                const end = i + startLine;
                                // console.log('start', start)
                                // this._cells[start] = new Cell(start, end, this._editor, this._model, this._kernelManager);
                                this.addCell(start, end)
                                inCellFlag = false;
                                foundCell = true;
                            }
                        }
                    }
                    endLine += lineDiff;
                    if (foundCell) {
                        endLine += 1;
                    }
                }
            } else if (lineDiff === 0) {
                if (this.inCell(startLine)) {

                } else {
                    // console.log("line diff 0")
                    // handle getting new blocks
                    const thisLine = this._model.getLineContent(startLine);
                    const startTest = thisLine.match(blockBeginRegex);
                    const endTest = thisLine.match(blockEndRegex);
                    if (startTest) {
                        // console.log("start test triggered")
                        // search forwards for an end mark
                        const remainingLines = this._model.getValueInRange({startLineNumber: startLine + 1, endLineNumber: this._model.getLineCount() + 1}).split(this._model.getEOL())
                        console.log(remainingLines);
                        for (let i = 0; i < remainingLines.length; i++) {
                            const l = remainingLines[i];
                            console.log(l)
                            if (l.match(blockEndRegex)) {
                                // this._cells[i] = new Cell(startLine, startLine + i + 1, this._editor, this._model, this._kernelManager); //{start: startLine + 1, end: startLine + i}
                                this.addCell(startLine, startLine + i + 1)
                                break;
                            }
                            if (l.match(blockBeginRegex)) {
                                break;
                            }
                        }
                    } else if (endTest) {
                        const prevLines = this._model.getValueInRange({startLineNumber: 0, endLineNumber: startLine}).split(this._model.getEOL())
                        // console.log(prevLines);
                        for (let i = prevLines.length - 1; i >= 0; i--) {
                            // console.log(i);
                            const l = prevLines[i];
                            if (l.match(blockBeginRegex) && !(i in this._cells)) {
                                // this._cells[i] = new Cell(i + 1, startLine, this._editor, this._model, this._kernelManager); //{start: i + 1, end: startLine};
                                this.addCell(i + 1, startLine)
                                break;
                            }
                            if (l.match(blockEndRegex)) {
                                break;
                            }
                        }
                    }   
                }

            }
            // console.log('endline', endLine)
            for (let key of Object.keys(this._cells)) {
                const cell = this._cells[key];
                // console.log(cell)
                if (cell.start >= endLine) {
                    cell.updateStart(lineDiff);
                } 
                if (cell.end >= endLine) {
                    cell.updateEnd(lineDiff);
                }
            }

        })
    }

    inCell(lineNum) {
        // console.log("incell called")
        const _inCell = (obj) => (obj.contains(lineNum));
        return Object.values(this._cells).filter(_inCell).length > 0
    }

    inCellValue(lineNum) {
        // console.log("incell called")
        const _inCell = (obj) => (obj.contains(lineNum));
        return Object.values(this._cells).filter(_inCell)
    }

    cellsInside(start, end) {
        const _inCell = (key) => (this._cells[key].start >= start && this._cells[key].end <= end);
        return Object.keys(this._cells).filter(_inCell)
    }

    disposeCells() {
        for (let key of Object.keys(this._cells)) {
            this._cells[key].dispose()
            delete this._cells[key]
        }
    }

    serializeCells() {
        const serializedCells = []
        for (let cell of Object.values(this._cells)) {
            let serializedContents = null;
            if (cell.zone && cell.zone.domNode) {
                serializedContents = cell.zone.domNode.innerHTML.split('\n').join('&#10;')
            }
            serializedCells.push({line: cell.end, html: serializedContents})
        }
        return serializedCells
    }
}