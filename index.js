"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const unix_1 = require("./unix");
const windows_1 = require("./windows");
const isWin = process.platform === 'win32';
exports.Opened = isWin ? new windows_1.OpenedWindows() : new unix_1.OpenedUnix();
exports.OpenedElectron = isWin ? new windows_1.OpenedWindows() : new unix_1.OpenedElectronUnix();
