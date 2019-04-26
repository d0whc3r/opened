export class OpenedUnix {
  protected child = require('child_process');

  file(filepath: string, end: (error: Error | null, status?: boolean) => void) {
    const parsedPath = filepath.replace(/"/g, '\\"');
    const command = `lsof -F n -- "${parsedPath}"`;
    const options = {
      encoding: 'utf-8',
      maxBuffer: 2 * 1024 * 1024,
    };
    this.child.exec(command, options, (error: any, _: any, stderr: any) => {
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

  protected unescape(sourceString: string): string {
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
      } else if (target) {
        target[targetIndex++] = source[sourceIndex++];
      } else {
        sourceIndex++;
      }
    }
    if (target) {
      return target.toString('utf-8', 0, targetIndex);
    } else {
      return sourceString;
    }
  }

  protected get unescapeTable() {
    const table = Buffer.alloc(256).map((_, i) => i);
    const codes: { [key: string]: string } = {
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

export class OpenedElectronUnix extends OpenedUnix {
  protected child = require('electron').remote.require('child_process');
}
