import getbuild from './get-build';
import savebuild from './save-build';

export const commands = {
  getbuild,
  savebuild,
};

export const availableCommands = Object.keys(commands);
