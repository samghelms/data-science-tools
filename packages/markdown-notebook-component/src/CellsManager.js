import { buttonsWidget } from './buttonsWidget'

const blockBeginRegex = /```[\s]{0,5}[A-Za-z]+$/g
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
        // this.addOutput = this.addOutput.bind(this)
        this.getStartLine = this.getStartLine.bind(this)
        this.buttonsWidget = buttonsWidget(start, 200, () => this.addOutput(), this.getStartLine)
        this.editor.addContentWidget(this.buttonsWidget)
    }

    addSerializedOutput(html, line) {
        console.log('adding serialized')
        console.log(html)
        console.log(line)
        const this2 = this
        this.editor.changeViewZones(function(changeAccessor) {
            if (this2.viewZoneId) {
                // changeAccessor.removeZone(this2.viewZoneId)
                // TODO: raise an error here
                return
            }
            this2.outputNode = document.createElement('div')
            this2.outputNode.innerHTML = html
            this2.zone = {
                afterLineNumber: line,
                heightInLines: 5,
                domNode: this2.outputNode
            }

            this2.viewZoneId = changeAccessor.addZone(this2.zone)
        })
    }

    addOutput() {
        const this2 = this
        this.editor.changeViewZones(function(changeAccessor) {
            // remove existing zone if it exists
            if (this2.viewZoneId) {
                changeAccessor.removeZone(this2.viewZoneId)
            }
            // console.log("executing, start", this2.start)
            // console.log("end", this2.end)
            const cellContents = this2._model.getValueInRange({startLineNumber: this2.start, endLineNumber: this2.end})
            const splitContents = cellContents.split(this2._model.getEOL())
            const header = splitContents[0]
            const body = splitContents.slice(1,).join(this2._model.getEOL())
            const executeResults = this2._kernelManager.execute(header, body)
            // this2.outputNode = document.createElement('div')
            // this2.outputNode.innerHTML = cellContents
            // this2.outputNode.style.background = 'lightgreen'
            // this2.outputNode.appendChild(executeResults.node)
            this2.zone = {
                afterLineNumber: this2.end,
                heightInLines: 5,
                domNode: executeResults.node
            }

            this2.viewZoneId = changeAccessor.addZone(this2.zone)
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
            const serializedContents = cell.zone.domNode.innerHTML.split('\n').join('<br>')
            serializedCells.push({line: cell.end, html: serializedContents})
        }
        return serializedCells
    }
}