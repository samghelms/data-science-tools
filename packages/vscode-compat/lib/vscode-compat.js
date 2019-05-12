"use strict";
/* --------------------------------------------------------------------------------------------
 * Copyright (c) 2018 TypeFox GmbH (http://www.typefox.io). All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
var vscode_api_1 = require("./vscode-api");
var services_1 = require("monaco-languageclient/lib/services");
var Cells_1 = require("./Cells");
module.exports = vscode_api_1.createVSCodeApi(services_1.Services.get, Cells_1.Cells.getCellsManager);
//# sourceMappingURL=vscode-compat.js.map