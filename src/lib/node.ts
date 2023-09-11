import * as fs from 'fs';
import * as path from 'path';

export const loadImageFromPath = (imagePath: string): Buffer | null => {
  try {
    const absolutePath = path.resolve(imagePath); // resolve the path
    const imageBuffer = fs.readFileSync(absolutePath); // read the file into a Buffer
    return imageBuffer;
  } catch (error) {
    console.error(`Error loading image: ${error.message}`);
    return null;
  }
};