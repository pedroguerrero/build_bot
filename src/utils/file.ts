import axios from 'axios';
import * as fs from 'fs/promises';
import { generatePath } from './path';
import { Upload } from '../enums/upload.enum';

export const fileExist = async (path: string): Promise<boolean> => {
  try {
    await fs.stat(path);

    return true;
  } catch (error) {
    return false;
  }
};

export const downloadAndSave = async (
  id: string,
  url: string,
): Promise<void> => {
  const { data: imageBuff } = await axios.get(url, {
    responseType: 'arraybuffer',
  });

  const filename = generatePath(__dirname, '..', Upload.DIRECTORY, id);

  await fs.writeFile(filename, imageBuff);
};
