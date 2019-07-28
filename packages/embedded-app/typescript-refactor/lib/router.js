"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
var react_router_dom_1 = require("react-router-dom");
// import App from './App' 
var Test = function () { return (react_1.default.createElement("div", null, "test")); };
var router = function (_a) {
    var token = _a.token;
    return (react_1.default.createElement(react_router_dom_1.BrowserRouter, null,
        react_1.default.createElement(react_router_dom_1.Switch, null,
            react_1.default.createElement(react_router_dom_1.Route, { render: function (props) { return react_1.default.createElement(Test, null); }, exact: true, path: "/imarkdown/edit" }),
            react_1.default.createElement(react_router_dom_1.Route, { render: function (props) { return react_1.default.createElement(Test, null); }, exact: true, path: "/imarkdown/edit/:path*" }))));
};
exports.default = router;
//# sourceMappingURL=router.js.map