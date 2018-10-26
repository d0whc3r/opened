import { OpenedElectronUnix, OpenedUnix } from './unix';
import { OpenedWindows } from './windows';

const isWin = process.platform === 'win32';

export const Opened = isWin ? new OpenedWindows() : new OpenedUnix();
export const OpenedElectron = isWin ? new OpenedWindows() : new OpenedElectronUnix();
