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
Object.defineProperty(exports, "__esModule", { value: true });
var KernelManager = /** @class */ (function () {
    function KernelManager(warningMessageCB) {
        this._kernels = [];
        this.warningMessageCB = warningMessageCB;
    }
    // return a promise that resolves when the entire execution is done as well as an initial placeholder
    // allows you to pass arbitrary string arguments to your kernel
    KernelManager.prototype.execute = function (header, body) {
        var kernel = this.findMatchingKernel(header);
        if (kernel) {
            return kernel.execute(header, body);
        }
        this.warningMessageCB("error: could not find kernel for " + header);
        return null;
    };
    KernelManager.prototype.findMatchingKernel = function (header) {
        for (var _i = 0, _a = this._kernels; _i < _a.length; _i++) {
            var k = _a[_i];
            if (k.match(header)) {
                return k;
            }
        }
        return null;
    };
    // startLSIfNeeded(header: string, editor) {
    //     const kernel = this.findMatchingKernel(header);
    //     if (kernel) kernel.startLSIfNeeded(header, editor);
    // }
    KernelManager.prototype.getLanguageServerProvider = function (header) {
        return __awaiter(this, void 0, void 0, function () {
            var kernel;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        kernel = this.findMatchingKernel(header);
                        if (!kernel) return [3 /*break*/, 2];
                        return [4 /*yield*/, kernel.getLanguageServerProvider(header)];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2: return [2 /*return*/, null];
                }
            });
        });
    };
    KernelManager.prototype.register = function (newKernel) {
        this._kernels.push(newKernel);
    };
    KernelManager.prototype.list = function () {
        return this._kernels.map(function (k, i) { return k.reactElement(i); });
    };
    KernelManager.prototype.close = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, k;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _i = 0, _a = this._kernels;
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 4];
                        k = _a[_i];
                        return [4 /*yield*/, k.close()];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return KernelManager;
}());
exports.default = KernelManager;
//# sourceMappingURL=kernelManager.js.map