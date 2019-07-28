"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = __importStar(require("react"));
var outputarea_1 = require("@jupyterlab/outputarea");
var rendermime_1 = require("@jupyterlab/rendermime");
var services_1 = require("@jupyterlab/services");
var yaml = __importStar(require("js-yaml"));
var JupyterKernelDisplay = /** @class */ (function (_super) {
    __extends(JupyterKernelDisplay, _super);
    function JupyterKernelDisplay(props) {
        return _super.call(this, props) || this;
    }
    JupyterKernelDisplay.prototype.componentDidMount = function () {
        var _this = this;
        var running = services_1.Kernel.listRunning(this.props.settings).then(function (running) {
            _this.setState({ running: running });
        });
        var potentialKernels = services_1.Kernel.getSpecs(this.props.settings).then(function (potentialKernels) {
            console.log(potentialKernels);
            _this.setState({ potentialKernels: Object.values(potentialKernels.kernelspecs), defaultKernel: potentialKernels.default });
        });
    };
    JupyterKernelDisplay.prototype.shutdown = function (run) {
        return __awaiter(this, void 0, void 0, function () {
            var kernel, running;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("shutting kernel down");
                        return [4 /*yield*/, services_1.Kernel.connectTo(run)];
                    case 1:
                        kernel = _a.sent();
                        return [4 /*yield*/, kernel.shutdown()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, services_1.Kernel.listRunning(this.props.settings)];
                    case 3:
                        running = _a.sent();
                        this.setState({ running: running });
                        return [2 /*return*/];
                }
            });
        });
    };
    JupyterKernelDisplay.prototype.restart = function (run) {
        return __awaiter(this, void 0, void 0, function () {
            var kernel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("restarting kernel");
                        return [4 /*yield*/, services_1.Kernel.connectTo(run)];
                    case 1:
                        kernel = _a.sent();
                        return [4 /*yield*/, kernel.restart()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    JupyterKernelDisplay.prototype.render = function () {
        var _this = this;
        return React.createElement("div", null,
            this.state.running ?
                React.createElement("h4", null, "running kernels") : null,
            this.state.running ?
                this.state.running.map(function (run, i) { return (React.createElement("div", { key: i },
                    React.createElement("div", null, run.name),
                    React.createElement("div", null, run.execution_state),
                    React.createElement("div", null, run.last_activity),
                    React.createElement("button", { onClick: function () { return _this.shutdown(run); } }, "shut down"),
                    React.createElement("button", { onClick: function () { return _this.restart(run); } }, "restart kernel"))); }) : null,
            this.state.potentialKernels ?
                React.createElement("h4", null, "Potential kernels") : null,
            this.state.potentialKernels ?
                this.state.potentialKernels.map(function (k, i) { return (React.createElement("div", { key: i },
                    React.createElement("div", null,
                        React.createElement("b", null, k.name)),
                    React.createElement("div", null, "example block header: ```python {kernel: " + k.name + "} "))); }) : null);
    };
    return JupyterKernelDisplay;
}(React.Component));
var Sanitizer = /** @class */ (function () {
    function Sanitizer() {
    }
    Sanitizer.prototype.sanitize = function (dirty) {
        var clean = dirty.replace('"dataframe"', '"dataframe mdl-data-table mdl-js-data-table mdl-shadow--2dp"');
        return clean;
    };
    return Sanitizer;
}());
var JupyterKernel = /** @class */ (function () {
    // _completionProvider: any;
    function JupyterKernel(settings, languageServerPort) {
        if (languageServerPort === void 0) { languageServerPort = 3000; }
        this._settings = settings;
        this._default = services_1.Kernel.getSpecs(settings).then(function (kernelSpecs) { return kernelSpecs.default; });
        this.kernel = null;
        this.beginRegex = /^```python/;
        this._kernelCache = {};
        this._languageServerPort = languageServerPort;
        this._languageServers = {};
        // this._completionProvider = new CompletionProvider()
    }
    JupyterKernel.prototype.getParsedHeader = function (header) {
        return __awaiter(this, void 0, void 0, function () {
            var parsedHeader, kernelName;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        parsedHeader = this.parseHeader(header);
                        kernelName = null;
                        if (!(parsedHeader && 'kernel' in parsedHeader)) return [3 /*break*/, 1];
                        kernelName = parsedHeader['kernel'];
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, this._default];
                    case 2:
                        kernelName = _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/, kernelName];
                }
            });
        });
    };
    // async getLanguageServerProvider(header: string) {
    //     return this._completionProvider.languageClient;
    // }
    JupyterKernel.prototype.setLanguageServerProvider = function (provider, id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this._languageServers[id] = provider;
                return [2 /*return*/];
            });
        });
    };
    JupyterKernel.prototype.getKernelName = function (header) {
        return __awaiter(this, void 0, void 0, function () {
            var kernelNameRegex, kernelName, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        kernelNameRegex = /kernel: ([A-Za-z0-9\s]*)/;
                        kernelName = header.match(kernelNameRegex);
                        if (!(kernelName && kernelName.length > 1)) return [3 /*break*/, 1];
                        _a = kernelName[1];
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, this._default];
                    case 2:
                        _a = (_b.sent());
                        _b.label = 3;
                    case 3: return [2 /*return*/, _a];
                }
            });
        });
    };
    JupyterKernel.prototype.list = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, services_1.Kernel.listRunning(this._settings).then(function (kernelModels) {
                            return kernelModels;
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    JupyterKernel.prototype.reactElement = function (parentKeyName, key) {
        return React.createElement(JupyterKernelDisplay, { settings: this._settings, key: key });
    };
    JupyterKernel.prototype.parseHeader = function (header) {
        // Examine all text after the begin regex. Parses as if it is a yaml object.
        var headerStart = header.replace(this.beginRegex, "");
        // Get document, or throw exception on error
        try {
            return yaml.safeLoad(headerStart);
        }
        catch (e) {
            console.log(e);
            return null;
        }
    };
    JupyterKernel.prototype.execute = function (header, code) {
        var model = new outputarea_1.OutputAreaModel();
        var opts = { initialFactories: rendermime_1.standardRendererFactories, sanitizer: new Sanitizer() };
        var rendermime = new rendermime_1.RenderMimeRegistry(opts);
        var outputArea = new outputarea_1.SimplifiedOutputArea({ model: model, rendermime: rendermime });
        this.getOrStartKernel(header).then(function (kernel) {
            var future = kernel.requestExecute({ code: code });
            outputArea.future = future;
        });
        outputArea.onChildAdded = function (msg) {
            // msg.child.removeClass('jp-OutputArea-output')
            msg.child.removeClass('jp-RenderedHTMLCommon');
        };
        return outputArea;
    };
    JupyterKernel.prototype.getRunning = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, services_1.Kernel.listRunning(this._settings).then(function (kernelModels) {
                            return kernelModels;
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    JupyterKernel.prototype.getSpecs = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                services_1.Kernel.getSpecs(this._settings).then(function (kernelSpecs) {
                    console.log('specs', Object.keys(kernelSpecs));
                });
                return [2 /*return*/];
            });
        });
    };
    JupyterKernel.prototype.getOrStartKernel = function (header) {
        return __awaiter(this, void 0, void 0, function () {
            var parsedHeader, kernelName, runningKernels, runningKernel, id_1, newKernelName, _a, options, newKernel;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        parsedHeader = this.parseHeader(header);
                        kernelName = null;
                        if (!(parsedHeader && 'kernel' in parsedHeader)) return [3 /*break*/, 1];
                        kernelName = parsedHeader['kernel'];
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, this._default];
                    case 2:
                        kernelName = _b.sent();
                        _b.label = 3;
                    case 3: return [4 /*yield*/, this.getRunning()];
                    case 4:
                        runningKernels = _b.sent();
                        if ((runningKernels.length > 0) && (kernelName in this._kernelCache)) {
                            id_1 = this._kernelCache[kernelName];
                            runningKernel = runningKernels.find(function (el) { return el.name === kernelName && el.id == id_1; });
                        }
                        if (runningKernel) {
                            console.log("found running kernel");
                            return [2 /*return*/, services_1.Kernel.connectTo(runningKernel, this._settings)];
                        }
                        console.log("Alert, no kernel found, starting new");
                        if (!(kernelName === 'default' || kernelName === null)) return [3 /*break*/, 6];
                        return [4 /*yield*/, this._default];
                    case 5:
                        _a = (_b.sent());
                        return [3 /*break*/, 7];
                    case 6:
                        _a = kernelName;
                        _b.label = 7;
                    case 7:
                        newKernelName = _a;
                        options = {
                            name: newKernelName,
                            serverSettings: this._settings
                        };
                        return [4 /*yield*/, services_1.Kernel.startNew(options)];
                    case 8:
                        newKernel = _b.sent();
                        console.log("new kernel");
                        console.log(newKernel);
                        this._kernelCache[kernelName] = newKernel.id;
                        return [2 /*return*/, newKernel];
                }
            });
        });
    };
    JupyterKernel.prototype.match = function (header) {
        console.log("matching header", header);
        return header.match(this.beginRegex) !== null;
    };
    JupyterKernel.prototype.close = function () {
        return __awaiter(this, void 0, void 0, function () {
            var runningKernels, _i, runningKernels_1, k, kernel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getRunning()];
                    case 1:
                        runningKernels = _a.sent();
                        _i = 0, runningKernels_1 = runningKernels;
                        _a.label = 2;
                    case 2:
                        if (!(_i < runningKernels_1.length)) return [3 /*break*/, 5];
                        k = runningKernels_1[_i];
                        if (!(k.id in this._kernelCache)) return [3 /*break*/, 4];
                        return [4 /*yield*/, services_1.Kernel.connectTo(k)];
                    case 3:
                        kernel = _a.sent();
                        kernel.shutdown();
                        delete this._kernelCache[k.id];
                        _a.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    return JupyterKernel;
}());
exports.default = JupyterKernel;
//# sourceMappingURL=jupyterKernel.js.map