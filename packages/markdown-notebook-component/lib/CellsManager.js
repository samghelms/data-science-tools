"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var buttonsWidget_1 = require("./buttonsWidget");
var CompletionProvider_1 = __importDefault(require("./CompletionProvider"));
var blockBeginRegex = /```[\s]{0,5}[A-Za-z]+/g;
var blockEndRegex = /```([\s]+$|$)/g;
var Cell = /** @class */ (function () {
    // TODO kernel manager type
    function Cell(start, end, editor, model, kernelManager) {
        var _this = this;
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
        this.buttonsWidget = buttonsWidget_1.buttonsWidget(start, 200, function () { return _this.addExecuteOutput(); }, function () { return _this.clearExecuteOutput(); }, this.getStartLine);
        this.editor.addContentWidget(this.buttonsWidget);
        this.outputExpanded = false;
    }
    Cell.prototype.getHeader = function () {
        return this._model.getLineContent(this.start);
    };
    Cell.prototype.getLanguageServerProvider = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._kernelManager.getLanguageServerProvider(this.getHeader())];
                    case 1: 
                    /** Checks if a language server exists. Creates one if not. */
                    // this.get
                    return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Cell.prototype.addSerializedOutput = function (html) {
        this.outputNode = document.createElement('div');
        this.outputNode.innerHTML = html;
        console.log("adding serialized output");
        console.log(this.outputNode);
        this._addOutput(this.outputNode);
    };
    Cell.prototype.addExecuteOutput = function (line) {
        var start;
        var end;
        if (line) {
            start = line;
            end = line + 1;
        }
        else {
            start = this.start;
            end = this.end;
        }
        var getRange = { startLineNumber: start, endLineNumber: end, startColumn: null, endColumn: null };
        var cellContents = this._model.getValueInRange(getRange);
        var header;
        var body;
        if (line) {
            header = this.getHeader();
            body = cellContents;
        }
        else {
            var splitContents = cellContents.split(this._model.getEOL());
            header = splitContents[0];
            body = splitContents.slice(1).join(this._model.getEOL());
        }
        var executeResults = this._kernelManager.execute(header, body);
        if (executeResults) {
            this._addOutput(executeResults.node);
        }
    };
    Cell.prototype.clearExecuteOutput = function () {
        var this2 = this;
        this.editor.changeViewZones(function (changeAccessor) {
            if (this2.viewZoneId) {
                changeAccessor.removeZone(this2.viewZoneId);
            }
        });
    };
    Cell.prototype._addOutput = function (nodeToAdd) {
        console.log(nodeToAdd);
        console.log(nodeToAdd.childNodes);
        var this2 = this;
        this.editor.changeViewZones(function (changeAccessor) {
            nodeToAdd.style.zIndex = "100";
            nodeToAdd.style.overflow = "hidden";
            // allows interacting with outputs
            nodeToAdd.onmousedown = function (e) {
                e.stopPropagation();
            };
            nodeToAdd.onmousemove = function (e) {
                e.stopPropagation();
            };
            var margin = document.createElement("div");
            var btn = document.createElement("button");
            btn.innerText = "expand";
            margin.style.zIndex = "1";
            margin.appendChild(btn);
            // nodeToAdd.style.border = '5px solid black';
            var outCont = document.createElement("div");
            outCont.style.zIndex = "100";
            outCont.style.borderBottom = '1px solid black';
            outCont.style.overflow = 'hidden';
            outCont.className = 'output-area';
            // outCont.style.borderBottom = '1px solid black';
            outCont.appendChild(nodeToAdd);
            // resets to 5 lines after an execution
            this2.zoneHeight = 100;
            this2.zone = {
                afterLineNumber: this2.end,
                heightInPx: this2.zoneHeight,
                domNode: outCont,
                marginDomNode: margin
            };
            // remove old zones
            if (this2.viewZoneId) {
                changeAccessor.removeZone(this2.viewZoneId);
            }
            this2.viewZoneId = changeAccessor.addZone(this2.zone);
            btn.onclick = function () {
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
    };
    Cell.prototype.getStartLine = function () {
        return this.start;
    };
    Cell.prototype.updateStart = function (lineDiff) {
        this.start += lineDiff;
        this.editor.layoutContentWidget(this.buttonsWidget);
    };
    Cell.prototype.updateEnd = function (lineDiff) {
        this.end += lineDiff;
        if (this.viewZoneId) {
            this.zone.afterLineNumber = this.end;
            var this2_1 = this;
            this.editor.changeViewZones(function (changeAccessor) {
                changeAccessor.layoutZone(this2_1.viewZoneId);
            });
        }
    };
    Cell.prototype.contains = function (lineNum) {
        console.log('contains called', this.end, this.start);
        return lineNum <= this.end && lineNum >= this.start;
    };
    Cell.prototype.dispose = function () {
        var this2 = this;
        this.editor.changeViewZones(function (changeAccessor) {
            // remove existing zone if it exists
            if (this2.viewZoneId) {
                changeAccessor.removeZone(this2.viewZoneId);
            }
        });
        this.editor.removeContentWidget(this.buttonsWidget);
    };
    return Cell;
}());
var CellsManager = /** @class */ (function () {
    // TODO: kernelmanager type
    function CellsManager(model, editor, kernelManager) {
        console.log('CellsManager constructor call =======');
        this._model = model;
        this._editor = editor;
        this._cells = new Map();
        this._kernelManager = kernelManager; // Kernels for lack of a better word. Anything that can execute code.
        this.serializeCells = this.serializeCells.bind(this);
        this.serializedOutputs = new Map();
        this.inCellValue = this.inCellValue.bind(this);
        // this.getClientForCell = this.getClientForCell.bind(this);
        this._completionProvider = new CompletionProvider_1["default"](editor, this);
        this.getTypeForLine = this.getTypeForLine.bind(this);
        // configureLanguageServer(this);
        this.executeCursorCell = this.executeCursorCell.bind(this);
        this.executeCursorLine = this.executeCursorLine.bind(this);
    }
    CellsManager.prototype.executeCursorCell = function () {
        var cell = this.cellContaining(this._editor.getPosition().lineNumber);
        if (cell.value) {
            cell.value.addExecuteOutput();
        }
    };
    CellsManager.prototype.executeCursorLine = function () {
        var line = this._editor.getPosition().lineNumber;
        var cell = this.cellContaining(line);
        console.log("executeCursorLine");
        if (cell.value) {
            cell.value.addExecuteOutput(line);
        }
    };
    CellsManager.prototype.addSerializedOutput = function (serializeOutput, line) {
        this.serializedOutputs.set(line.toString(), serializeOutput);
    };
    CellsManager.prototype.addCell = function (start, end) {
        console.log("add cell called");
        console.log(end);
        console.log(this.serializedOutputs);
        var newCell = new Cell(start, end, this._editor, this._model, this._kernelManager);
        var endStr = end.toString();
        if (this.serializedOutputs.has(endStr)) {
            console.log("addSerializedOutput");
            newCell.addSerializedOutput(this.serializedOutputs.get(endStr));
        }
        this._cells.set(start.toString(), newCell);
    };
    CellsManager.prototype.updateCells = function (changeEvent) {
        var _this = this;
        //TODO: add a check for the start line being on a cell boundary, handle creating/destroying cells and language servers there
        changeEvent.changes.map(function (ch) {
            // console.log(ch.text.split('\n'))
            var newLines = ch.text.split(_this._model.getEOL());
            var newLinesLength = newLines.length - 1;
            var startLine = ch.range.startLineNumber;
            var endLine = ch.range.endLineNumber;
            var length = endLine - startLine;
            var lineDiff = newLinesLength - length;
            // figure out if we need to remove cells
            if (lineDiff < 0) {
                // delete cells in the deleted range
                var cellsInRange = _this.cellsInside(startLine, endLine);
                if (cellsInRange.length > 0) {
                    // console.log("cells inside")
                    // console.log(cellsInRange)
                    cellsInRange.map(function (k) {
                        _this._cells.get(k).dispose();
                        _this._cells["delete"](k);
                    });
                }
                // update our cells reference
                // this._cells = this._cells.filter(cell => cell.line > startLine && cell.line < endLine)
            }
            else if (lineDiff > 0) {
                if (_this.inCell(startLine)) {
                    endLine += lineDiff;
                }
                else {
                    // console.log("parsing pasted input", newLines)
                    // parse input for new cells
                    var inCellFlag = false;
                    var start = null;
                    var foundCell = false;
                    for (var i = 0; i < newLines.length; i++) {
                        var l = newLines[i];
                        // console.log(l);
                        // console.log(inCellFlag)
                        if (inCellFlag === false) {
                            var startTest = l.match(blockBeginRegex);
                            if (startTest) {
                                start = i + startLine;
                                inCellFlag = true;
                            }
                        }
                        else if (inCellFlag === true) {
                            var endTest = l.match(blockEndRegex);
                            if (endTest) {
                                var end = i + startLine;
                                // console.log('start', start)
                                // this._cells[start] = new Cell(start, end, this._editor, this._model, this._kernelManager);
                                _this.addCell(start, end);
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
                if (_this.inCell(startLine)) {
                    var boundary = _this.onCellBoundary(startLine);
                    var boundaryLine = _this._model.getLineContent(startLine);
                    if (boundary !== 0) {
                        // 1 == start boundary
                        if (boundary === 1) {
                            var startTest = boundaryLine.match(blockBeginRegex);
                            if (startTest === null) {
                                var cellInRange1 = _this.cellContaining(startLine);
                                cellInRange1.value.dispose();
                                _this._cells["delete"](cellInRange1.key);
                            }
                        }
                        else if (boundary === 2) {
                            var endTest = boundaryLine.match(blockEndRegex);
                            if (endTest === null) {
                                var cellInRange2 = _this.cellContaining(startLine);
                                cellInRange2.value.dispose();
                                _this._cells["delete"](cellInRange2.key);
                            }
                        }
                    }
                }
                else {
                    // console.log("line diff 0")
                    // handle getting new blocks
                    var thisLine = _this._model.getLineContent(startLine);
                    var startTest = thisLine.match(blockBeginRegex);
                    var endTest = thisLine.match(blockEndRegex);
                    if (startTest) {
                        // console.log("start test triggered")
                        // search forwards for an end mark
                        var getRange = {
                            startLineNumber: startLine + 1,
                            endLineNumber: _this._model.getLineCount() + 1,
                            endColumn: null,
                            startColumn: null
                        };
                        var remainingLines = _this._model.getValueInRange(getRange).split(_this._model.getEOL());
                        for (var i = 0; i < remainingLines.length; i++) {
                            var l = remainingLines[i];
                            if (l.match(blockEndRegex)) {
                                // this._cells[i] = new Cell(startLine, startLine + i + 1, this._editor, this._model, this._kernelManager); //{start: startLine + 1, end: startLine + i}
                                _this.addCell(startLine, startLine + i + 1);
                                break;
                            }
                            if (l.match(blockBeginRegex)) {
                                break;
                            }
                        }
                    }
                    else if (endTest) {
                        var getRange = {
                            startLineNumber: 0,
                            endLineNumber: startLine,
                            endColumn: null,
                            startColumn: null
                        };
                        var prevLines = _this._model.getValueInRange(getRange).split(_this._model.getEOL());
                        // console.log(prevLines);
                        for (var i = prevLines.length - 1; i >= 0; i--) {
                            // console.log(i);
                            var l = prevLines[i];
                            if (l.match(blockBeginRegex) && !(i in _this._cells)) {
                                // this._cells[i] = new Cell(i + 1, startLine, this._editor, this._model, this._kernelManager); //{start: i + 1, end: startLine};
                                _this.addCell(i + 1, startLine);
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
            for (var _i = 0, _a = Array.from(_this._cells.keys()); _i < _a.length; _i++) {
                var key = _a[_i];
                var cell = _this._cells.get(key);
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
    };
    CellsManager.prototype.setLanguageServerProvider = function (provider, selectorId) {
    };
    CellsManager.prototype.getTypeForLine = function () {
        var pos = this._editor.getPosition();
        var lineNum = pos.lineNumber;
        var cell = this.inCellValue(lineNum);
        if (cell) {
            var header = cell.getHeader();
            console.log(header);
            if (header.includes('python') && (lineNum !== cell.start) && (lineNum !== cell.end)) {
                return 'python';
            }
        }
        return null;
    };
    CellsManager.prototype.inCell = function (lineNum) {
        var _inCell = function (obj) { return (obj.contains(lineNum)); };
        return Array.from(this._cells.values()).filter(_inCell).length > 0;
    };
    CellsManager.prototype.inCellValue = function (lineNum) {
        var _inCell = function (obj) { return (obj.contains(lineNum)); };
        var val = Array.from(this._cells.values()).filter(_inCell);
        return val.length > 0 ? val[0] : null;
    };
    CellsManager.prototype.cellsInside = function (start, end) {
        var _this = this;
        var _inCell = function (key) { return (_this._cells.get(key).start >= start && _this._cells.get(key).end <= end); };
        return Array.from(this._cells.keys()).filter(_inCell);
    };
    CellsManager.prototype.cellContaining = function (lineNum) {
        var _this = this;
        var checkContains = function (key) {
            if (!_this._cells.has(key))
                return false;
            var end = _this._cells.get(key).end;
            var start = _this._cells.get(key).start;
            if (!start || !end) {
                return false;
            }
            return (start <= lineNum) && end >= lineNum;
        };
        var k = Array.from(this._cells.keys()).filter(checkContains)[0];
        var v = this._cells.get(k);
        return { key: k, value: v };
    };
    CellsManager.prototype.onCellBoundary = function (line) {
        var cell = this.inCellValue(line);
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
    };
    CellsManager.prototype.disposeCells = function () {
        for (var _i = 0, _a = Array.from(this._cells.keys()); _i < _a.length; _i++) {
            var key = _a[_i];
            var v = this._cells.get(key);
            if (v)
                v.dispose();
            this._cells["delete"](key);
        }
    };
    // async getClientForCell(lineNumber: number): Promise<MonacoLanguageClient | null> {
    //     const cell = this.cellContaining(lineNumber);
    //     if(cell && cell.value) {
    //         const header = cell.value.getHeader();
    //         return await this._kernelManager.getLanguageServerProvider(header);
    //     }
    //     return Promise.resolve(null);
    // }
    CellsManager.prototype.serializeCells = function () {
        console.log('serializing cells');
        var serializedCells = [];
        for (var _i = 0, _a = Array.from(this._cells.values()); _i < _a.length; _i++) {
            var cell = _a[_i];
            var serializedContents = null;
            if (cell.zone && cell.zone.domNode) {
                serializedContents = cell.zone.domNode.innerHTML.split('\n').join('&#10;');
            }
            serializedCells.push({ line: cell.end, html: serializedContents });
        }
        return serializedCells;
    };
    return CellsManager;
}());
exports["default"] = CellsManager;
