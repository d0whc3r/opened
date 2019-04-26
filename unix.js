"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class OpenedUnix {
    constructor() {
        this.child = require('child_process');
    }
    file(filepath, end) {
        const parsedPath = filepath.replace(/"/g, '\\"');
        const command = `lsof -F n -- "${parsedPath}"`;
        const options = {
            encoding: 'utf-8',
            maxBuffer: 2 * 1024 * 1024,
        };
        this.child.exec(command, options, (error, _, stderr) => {
            // lsof returns an error and a status code of 1 if a file is not open:
            if (error && error.code === 1 && stderr.length === 0) {
                error = undefined;
            }
            if (error) {
                if (/No such file or directory/i.test(stderr)) {
                    error.code = 'ENOENT';
                }
                return end(error, false);
            }
            end(null, true);
        });
    }
    unescape(sourceString) {
        const source = Buffer.from(sourceString, 'utf-8');
        let sourceIndex = 0;
        let sourceLength = source.length;
        let target, targetIndex = 0;
        while (sourceIndex < sourceLength) {
            if (source[sourceIndex] === 92 && sourceIndex + 1 < sourceLength) { // "\\"
                if (!target) {
                    target = Buffer.alloc(sourceLength);
                    targetIndex = source.copy(target, 0, 0, sourceIndex);
                }
                sourceIndex++;
                target[targetIndex++] = this.unescapeTable[source[sourceIndex++]];
            }
            else if (target) {
                target[targetIndex++] = source[sourceIndex++];
            }
            else {
                sourceIndex++;
            }
        }
        if (target) {
            return target.toString('utf-8', 0, targetIndex);
        }
        else {
            return sourceString;
        }
    }
    get unescapeTable() {
        const table = Buffer.alloc(256).map((_, i) => i);
        const codes = {
            b: '\b',
            f: '\f',
            t: '\t',
            n: '\n',
            r: '\r',
        };
        Object.keys(codes).forEach((code) => {
            const val = codes[code];
            table[code.charCodeAt(0)] = val.charCodeAt(0);
        });
        return table;
    }
}
exports.OpenedUnix = OpenedUnix;
class OpenedElectronUnix extends OpenedUnix {
    constructor() {
        super(...arguments);
        this.child = require('electron').remote.require('child_process');
    }
}
exports.OpenedElectronUnix = OpenedElectronUnix;
