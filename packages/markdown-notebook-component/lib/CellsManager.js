"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const buttonsWidget_1 = require("./buttonsWidget");
const CompletionProvider_1 = __importDefault(require("./CompletionProvider"));
const blockBeginRegex = /```[\s]{0,5}[A-Za-z]+/g;
const blockEndRegex = /```([\s]+$|$)/g;
class Cell {
    // TODO kernel manager type
    constructor(start, end, editor, model, kernelManager) {
        this.start = start;
        this.end = end;
        this.editor = editor;
        this._model = model;
        this._kernelManager = kernelManager;
        this.zone = null;
        this.viewZoneId = null;
        this.zoneHeight = 200;
        this.getStartLine = this.getStartLine.bind(this);
        this.getHeader = this.getHeader.bind(this);
        this.buttonsWidget = buttonsWidget_1.buttonsWidget(start, 200, () => this.addExecuteOutput(), () => this.clearExecuteOutput(), this.getStartLine);
        this.editor.addContentWidget(this.buttonsWidget);
        this.outputExpanded = false;
    }
    getHeader() {
        return this._model.getLineContent(this.start);
    }
    async getLanguageServerProvider() {
        /** Checks if a language server exists. Creates one if not. */
        // this.get
        return await this._kernelManager.getLanguageServerProvider(this.getHeader());
    }
    addSerializedOutput(html) {
        this.outputNode = document.createElement('div');
        this.outputNode.innerHTML = html;
        this._addOutput(this.outputNode);
    }
    addExecuteOutput() {
        const getRange = { startLineNumber: this.start, endLineNumber: this.end, startColumn: null, endColumn: null };
        const cellContents = this._model.getValueInRange(getRange);
        const splitContents = cellContents.split(this._model.getEOL());
        const header = splitContents[0];
        const body = splitContents.slice(1).join(this._model.getEOL());
        const executeResults = this._kernelManager.execute(header, body);
        if (executeResults) {
            this._addOutput(executeResults.node);
        }
    }
    clearExecuteOutput() {
        const this2 = this;
        this.editor.changeViewZones(function (changeAccessor) {
            if (this2.viewZoneId) {
                changeAccessor.removeZone(this2.viewZoneId);
            }
        });
    }
    _addOutput(nodeToAdd) {
        const this2 = this;
        this.editor.changeViewZones(function (changeAccessor) {
            nodeToAdd.style.zIndex = "100";
            nodeToAdd.style.overflow = "hidden";
            // allows interacting with outputs
            nodeToAdd.onmousedown = (e) => {
                e.stopPropagation();
            };
            nodeToAdd.onmousemove = (e) => {
                e.stopPropagation();
            };
            const margin = document.createElement("div");
            const btn = document.createElement("button");
            btn.innerText = "expand";
            margin.style.zIndex = "1";
            margin.appendChild(btn);
            // resets to 5 lines after an execution
            this2.zoneHeight = 100;
            this2.zone = {
                afterLineNumber: this2.end,
                heightInPx: this2.zoneHeight,
                domNode: nodeToAdd,
                marginDomNode: margin
            };
            // remove old zones
            if (this2.viewZoneId) {
                changeAccessor.removeZone(this2.viewZoneId);
            }
            this2.viewZoneId = changeAccessor.addZone(this2.zone);
            btn.onclick = () => {
                if (this2.outputExpanded) {
                    this2.zone.heightInPx = 100;
                    this2.editor.changeViewZones(function (changeAccessor2) {
                        changeAccessor2.layoutZone(this2.viewZoneId);
                    });
                    this2.outputExpanded = false;
                    btn.innerText = 'expand';
                }
                else {
                    this2.zone.heightInPx = nodeToAdd.scrollHeight;
                    this2.editor.changeViewZones(function (changeAccessor2) {
                        changeAccessor2.layoutZone(this2.viewZoneId);
                    });
                    this2.outputExpanded = true;
                    btn.innerText = 'collapse';
                }
            };
        });
    }
    getStartLine() {
        return this.start;
    }
    updateStart(lineDiff) {
        this.start += lineDiff;
        this.editor.layoutContentWidget(this.buttonsWidget);
    }
    updateEnd(lineDiff) {
        this.end += lineDiff;
        if (this.viewZoneId) {
            this.zone.afterLineNumber = this.end;
            const this2 = this;
            this.editor.changeViewZones(function (changeAccessor) {
                changeAccessor.layoutZone(this2.viewZoneId);
            });
        }
    }
    contains(lineNum) {
        console.log('contains called', this.end, this.start);
        return lineNum <= this.end && lineNum >= this.start;
    }
    dispose() {
        const this2 = this;
        this.editor.changeViewZones(function (changeAccessor) {
            // remove existing zone if it exists
            if (this2.viewZoneId) {
                changeAccessor.removeZone(this2.viewZoneId);
            }
        });
        this.editor.removeContentWidget(this.buttonsWidget);
    }
}
class CellsManager {
    // TODO: kernelmanager type
    constructor(model, editor, kernelManager) {
        console.log('CellsManager constructor call =======');
        this._model = model;
        this._editor = editor;
        this._cells = new Map();
        this._kernelManager = kernelManager; // Kernels for lack of a better word. Anything that can execute code.
        this.serializeCells = this.serializeCells.bind(this);
        this.serializedOutputs = new Map();
        this.inCellValue = this.inCellValue.bind(this);
        // this.getClientForCell = this.getClientForCell.bind(this);
        this._completionProvider = new CompletionProvider_1.default(editor, this);
        this.getTypeForLine = this.getTypeForLine.bind(this);
        // configureLanguageServer(this);
    }
    addSerializedOutput(serializeOutput, line) {
        this.serializedOutputs.set(line.toString(), serializeOutput);
    }
    addCell(start, end) {
        const newCell = new Cell(start, end, this._editor, this._model, this._kernelManager);
        if (end in this.serializedOutputs) {
            newCell.addSerializedOutput(this.serializedOutputs.get(end.toString()));
        }
        this._cells.set(start.toString(), newCell);
    }
    updateCells(changeEvent) {
        //TODO: add a check for the start line being on a cell boundary, handle creating/destroying cells and language servers there
        changeEvent.changes.map((ch) => {
            // console.log(ch.text.split('\n'))
            const newLines = ch.text.split(this._model.getEOL());
            const newLinesLength = newLines.length - 1;
            const startLine = ch.range.startLineNumber;
            let endLine = ch.range.endLineNumber;
            const length = endLine - startLine;
            let lineDiff = newLinesLength - length;
            // figure out if we need to remove cells
            if (lineDiff < 0) {
                // delete cells in the deleted range
                const cellsInRange = this.cellsInside(startLine, endLine);
                if (cellsInRange.length > 0) {
                    // console.log("cells inside")
                    // console.log(cellsInRange)
                    cellsInRange.map(k => {
                        this._cells.get(k).dispose();
                        this._cells.delete(k);
                    });
                }
                // update our cells reference
                // this._cells = this._cells.filter(cell => cell.line > startLine && cell.line < endLine)
            }
            else if (lineDiff > 0) {
                if (this.inCell(startLine)) {
                    endLine += lineDiff;
                }
                else {
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
                            const startTest = l.match(blockBeginRegex);
                            if (startTest) {
                                start = i + startLine;
                                inCellFlag = true;
                            }
                        }
                        else if (inCellFlag === true) {
                            const endTest = l.match(blockEndRegex);
                            if (endTest) {
                                const end = i + startLine;
                                // console.log('start', start)
                                // this._cells[start] = new Cell(start, end, this._editor, this._model, this._kernelManager);
                                this.addCell(start, end);
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
            }
            else if (lineDiff === 0) {
                if (this.inCell(startLine)) {
                    const boundary = this.onCellBoundary(startLine);
                    const boundaryLine = this._model.getLineContent(startLine);
                    if (boundary !== 0) {
                        // 1 == start boundary
                        if (boundary === 1) {
                            const startTest = boundaryLine.match(blockBeginRegex);
                            if (startTest === null) {
                                const cellInRange1 = this.cellContaining(startLine);
                                cellInRange1.value.dispose();
                                this._cells.delete(cellInRange1.key);
                            }
                        }
                        else if (boundary === 2) {
                            const endTest = boundaryLine.match(blockEndRegex);
                            if (endTest === null) {
                                const cellInRange2 = this.cellContaining(startLine);
                                cellInRange2.value.dispose();
                                this._cells.delete(cellInRange2.key);
                            }
                        }
                    }
                }
                else {
                    // console.log("line diff 0")
                    // handle getting new blocks
                    const thisLine = this._model.getLineContent(startLine);
                    const startTest = thisLine.match(blockBeginRegex);
                    const endTest = thisLine.match(blockEndRegex);
                    if (startTest) {
                        // console.log("start test triggered")
                        // search forwards for an end mark
                        const getRange = {
                            startLineNumber: startLine + 1,
                            endLineNumber: this._model.getLineCount() + 1,
                            endColumn: null,
                            startColumn: null
                        };
                        const remainingLines = this._model.getValueInRange(getRange).split(this._model.getEOL());
                        for (let i = 0; i < remainingLines.length; i++) {
                            const l = remainingLines[i];
                            if (l.match(blockEndRegex)) {
                                // this._cells[i] = new Cell(startLine, startLine + i + 1, this._editor, this._model, this._kernelManager); //{start: startLine + 1, end: startLine + i}
                                this.addCell(startLine, startLine + i + 1);
                                break;
                            }
                            if (l.match(blockBeginRegex)) {
                                break;
                            }
                        }
                    }
                    else if (endTest) {
                        const getRange = {
                            startLineNumber: 0,
                            endLineNumber: startLine,
                            endColumn: null,
                            startColumn: null
                        };
                        const prevLines = this._model.getValueInRange(getRange).split(this._model.getEOL());
                        // console.log(prevLines);
                        for (let i = prevLines.length - 1; i >= 0; i--) {
                            // console.log(i);
                            const l = prevLines[i];
                            if (l.match(blockBeginRegex) && !(i in this._cells)) {
                                // this._cells[i] = new Cell(i + 1, startLine, this._editor, this._model, this._kernelManager); //{start: i + 1, end: startLine};
                                this.addCell(i + 1, startLine);
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
            for (let key of Array.from(this._cells.keys())) {
                const cell = this._cells.get(key);
                // console.log(cell)
                if (cell.start >= endLine) {
                    cell.updateStart(lineDiff);
                    cell.updateEnd(lineDiff);
                }
                else if (cell.end >= endLine) {
                    cell.updateEnd(lineDiff);
                }
            }
        });
        // checks to see if any language servers need to be started
        // for (let key of Array.from(this._cells.keys())) {
        //     const cell = this._cells.get(key);
        //     this._kernelManager.startLSIfNeeded(cell.getHeader(), this._editor)
        // }
    }
    setLanguageServerProvider(provider, selectorId) {
    }
    getTypeForLine() {
        const pos = this._editor.getPosition();
        const lineNum = pos.lineNumber;
        const cell = this.inCellValue(lineNum);
        if (cell) {
            const header = cell.getHeader();
            console.log(header);
            if (header.includes('python') && (lineNum !== cell.start) && (lineNum !== cell.end)) {
                return 'python';
            }
        }
        return null;
    }
    inCell(lineNum) {
        const _inCell = (obj) => (obj.contains(lineNum));
        return Array.from(this._cells.values()).filter(_inCell).length > 0;
    }
    inCellValue(lineNum) {
        const _inCell = (obj) => (obj.contains(lineNum));
        const val = Array.from(this._cells.values()).filter(_inCell);
        return val.length > 0 ? val[0] : null;
    }
    cellsInside(start, end) {
        const _inCell = (key) => (this._cells.get(key).start >= start && this._cells.get(key).end <= end);
        return Array.from(this._cells.keys()).filter(_inCell);
    }
    cellContaining(lineNum) {
        const checkContains = (key) => {
            if (!this._cells.has(key))
                return false;
            const end = this._cells.get(key).end;
            const start = this._cells.get(key).start;
            if (!start || !end) {
                return false;
            }
            return (start <= lineNum) && end >= lineNum;
        };
        const k = Array.from(this._cells.keys()).filter(checkContains)[0];
        const v = this._cells.get(k);
        return { key: k, value: v };
    }
    onCellBoundary(line) {
        const cell = this.inCellValue(line);
        if (cell === null) {
            return 0;
        }
        if (cell.start === line) {
            return 1;
        }
        if (cell.end === line) {
            return 2;
        }
        return 0;
    }
    disposeCells() {
        for (let key of Array.from(this._cells.keys())) {
            const v = this._cells.get(key);
            if (v)
                v.dispose();
            this._cells.delete(key);
        }
    }
    // async getClientForCell(lineNumber: number): Promise<MonacoLanguageClient | null> {
    //     const cell = this.cellContaining(lineNumber);
    //     if(cell && cell.value) {
    //         const header = cell.value.getHeader();
    //         return await this._kernelManager.getLanguageServerProvider(header);
    //     }
    //     return Promise.resolve(null);
    // }
    serializeCells() {
        const serializedCells = [];
        for (let cell of Array.from(this._cells.values())) {
            let serializedContents = null;
            if (cell.zone && cell.zone.domNode) {
                serializedContents = cell.zone.domNode.innerHTML.split('\n').join('&#10;');
            }
            serializedCells.push({ line: cell.end, html: serializedContents });
        }
        return serializedCells;
    }
}
exports.default = CellsManager;
