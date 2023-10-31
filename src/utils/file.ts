import * as fs from 'fs/promises';

export const fileExist = async (path: string): Promise<boolean> => {
  try {
    await fs.stat(path);

    return true;
  } catch (error) {
    return false;
  }
};
