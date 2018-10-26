import { OpenedElectronUnix, OpenedUnix } from './unix';
import { OpenedWindows } from './windows';

if (process.platform === 'win32') {
  module.exports = {
    OpenedElectron: OpenedWindows,
    Opened: OpenedWindows,
  };
} else {
  module.exports = {
    OpenedElectron: OpenedElectronUnix,
    Opened: OpenedUnix,
  };
}
