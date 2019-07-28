"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importDefault(require("react"));
require("./index.css");
var react_dom_1 = require("react-dom");
var App_1 = __importDefault(require("./App"));
// import Router from './router';
var dataEl = document.querySelector("#jupyter-config-data");
var config = JSON.parse(dataEl.textContent);
react_dom_1.render(react_1.default.createElement(App_1.default, { token: "", path: "" }), document.querySelector('#app'));
//# sourceMappingURL=index.js.map