# opened
Check if a file is open in another application on Windows, macOS and Linux compatible for electron.

This is a minified version of `@ronomon/opened` package using typescript [site project](https://github.com/ronomon/opened)

## Installation
```
npm install @d0whc3r/opened
```

## Windows
`Opened` uses a native binding on Windows to try and open an existing file with exclusive sharing mode (`dwShareMode`) 
and detect an `ERROR_SHARING_VIOLATION` error if another application already has an open handle to the file. 
This will detect any applications with open handles to the file, but not applications which have opened, 
buffered the file for display, and then closed the handle (i.e. applications which may be showing the file to the user, 
but which no longer have an open handle to the file).

## Unix
`Opened` uses `lsof` on macOS and on Linux. On Linux (but not on macOS).

In some cases `lsof` requires sudo permissions to iterate across open file descriptors for the user, 
otherwise no files will be detected as open and no permissions error will be returned.

## Electron
`OpenedElectron` use `require('electron').remote.require('child_process')` to avoid errors in Linux systems.

## Usage

```javascript
const { Opened, OpenedElectron } = require('@d0whc3r/opened');

const pathfile = 'some/path/file.ext';
Opened.file(pathfile, (error, status) => {
    if (error) {
      console.log('Some error ocurred');
      throw new Error(error);
    }
    if (status) {
      console.log('file is opened');
    } else {
      console.log('file is closed');
    }
  });
```
