import Jimp from 'jimp';
import { createWorker as createTesseract } from 'tesseract.js';

const optimizeImageForTesseract = async (buffer: Buffer): Promise<Buffer> => {
  // Load the image using Jimp
  const image = await Jimp.read(buffer);

  // Convert image to grayscale
  image.grayscale();

  // Perform binary thresholding
  image.threshold({ max: 255, replace: 50 });

  // Get the buffer from the Jimp image
  const optimizedBuffer = await image.getBufferAsync(Jimp.MIME_PNG);

  return optimizedBuffer;
};

const performOcr = async (image: Buffer): Promise<string> => {
    const optimizedBuffer = await optimizeImageForTesseract(image);
    const worker = await createTesseract();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    const { data: { text } } = await worker.recognize(optimizedBuffer);
    await worker.terminate();
    return text;
};

export { optimizeImageForTesseract, performOcr };
