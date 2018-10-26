"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(require("path"));
class OpenedWindows {
    static pathBuffer(spath) {
        const pathLong = path._makeLong(spath);
        const buffer = Buffer.alloc(Buffer.byteLength(pathLong, 'utf-8') + 1);
        buffer.write(pathLong, 0, buffer.length - 1, 'utf-8');
        buffer[buffer.length - 1] = 0;
        if (buffer.indexOf(0) !== buffer.length - 1) {
            throw new Error('path must be a string without null bytes');
        }
        return buffer;
    }
    static file(path, end) {
        OpenedWindows.binding.opened(OpenedWindows.pathBuffer(path), (result) => {
            let code;
            if (result === 0) {
                return end(null, false);
            }
            if (OpenedWindows.codes.hasOwnProperty(result)) {
                code = OpenedWindows.codes[result];
            }
            else {
                code = 'ENOSYS';
            }
            if (['ERROR_SHARING_VIOLATION', 'ERROR_LOCK_VIOLATION'].indexOf(code) >= 0) {
                return end(null, true);
            }
            const error = new Error(`${code}: -${result}, opened(${path})`);
            error.code = code;
            end(error);
        });
    }
}
OpenedWindows.binding = require('./binding.node');
OpenedWindows.codes = {
    1: 'EISDIR',
    2: 'ENOENT',
    3: 'ENOENT',
    4: 'EMFILE',
    5: 'EPERM',
    6: 'EBADF',
    8: 'ENOMEM',
    14: 'ENOMEM',
    15: 'ENOENT',
    32: 'ERROR_SHARING_VIOLATION',
    33: 'ERROR_LOCK_VIOLATION',
};
exports.OpenedWindows = OpenedWindows;
