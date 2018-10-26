import { OpenedElectronUnix, OpenedUnix } from './unix';
import { OpenedWindows } from './windows';

export const Opened = process.platform === 'win32' ? OpenedWindows : OpenedUnix;
export const OpenedElectron = process.platform === 'win32' ? OpenedWindows : OpenedElectronUnix;
