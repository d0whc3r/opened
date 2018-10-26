"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const unix_1 = require("./unix");
const windows_1 = require("./windows");
if (process.platform === 'win32') {
    module.exports = {
        OpenedElectron: windows_1.OpenedWindows,
        Opened: windows_1.OpenedWindows,
    };
}
else {
    module.exports = {
        OpenedElectron: unix_1.OpenedElectronUnix,
        Opened: unix_1.OpenedUnix,
    };
}
