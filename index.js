"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const unix_1 = require("./unix");
const windows_1 = require("./windows");
exports.Opened = process.platform === 'win32' ? windows_1.OpenedWindows : unix_1.OpenedUnix;
exports.OpenedElectron = process.platform === 'win32' ? windows_1.OpenedWindows : unix_1.OpenedElectronUnix;
