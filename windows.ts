import * as path from 'path';

export class OpenedWindows {
  private static binding = require('./binding.node');
  private static codes: { [key: number]: string } = {
    1: 'EISDIR', // ERROR_INVALID_FUNCTION
    2: 'ENOENT', // ERROR_FILE_NOT_FOUND
    3: 'ENOENT', // ERROR_PATH_NOT_FOUND
    4: 'EMFILE', // ERROR_TOO_MANY_OPEN_FILES
    5: 'EPERM', // ERROR_ACCESS_DENIED
    6: 'EBADF', // ERROR_INVALID_HANDLE
    8: 'ENOMEM', // ERROR_NOT_ENOUGH_MEMORY
    14: 'ENOMEM', // ERROR_OUTOFMEMORY
    15: 'ENOENT', // ERROR_INVALID_DRIVE
    32: 'ERROR_SHARING_VIOLATION',
    33: 'ERROR_LOCK_VIOLATION',
  };

  private static pathBuffer(spath: string) {
    const pathLong = (path as any)._makeLong(spath);
    const buffer = Buffer.alloc(Buffer.byteLength(pathLong, 'utf-8') + 1);
    buffer.write(pathLong, 0, buffer.length - 1, 'utf-8');
    buffer[buffer.length - 1] = 0;
    if (buffer.indexOf(0) !== buffer.length - 1) {
      throw new Error('path must be a string without null bytes');
    }
    return buffer;
  }

  static file(path: string, end: any) {
    OpenedWindows.binding.opened(OpenedWindows.pathBuffer(path), (result: number) => {
      let code: string;
      if (result === 0) {
        return end(undefined, false);
      }
      if (OpenedWindows.codes.hasOwnProperty(result)) {
        code = OpenedWindows.codes[result];
      } else {
        code = 'ENOSYS';
      }
      if (['ERROR_SHARING_VIOLATION', 'ERROR_LOCK_VIOLATION'].indexOf(code) >= 0) {
        return end(undefined, true);
      }
      const error: any = new Error(`${code}: -${result}, opened(${path})`);
      error.code = code;
      end(error);
    });
  }
}
