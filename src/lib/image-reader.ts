import { createWorker } from 'tesseract.js';

const optimizeImageForTesseract = (image: HTMLImageElement): string => {
    const threshold = 50;

    let canvas = document.createElement('canvas');
    let canvasContext = canvas.getContext('2d');

    const imgW = image.width;
    const imgH = image.height;
    canvas.width = imgW;
    canvas.height = imgH;

    canvasContext!.drawImage(image, 0, 0);
    const imgPixels = canvasContext!.getImageData(0, 0, imgW, imgH);
    let data = imgPixels.data;

    for (let i = 0; i < data.length; i += 4) {
        // Convert RGB values to grayscale
        let grayscale = data[i] * 0.3 + data[i + 1] * 0.59 + data[i + 2] * 0.11;

        // Check if the value is above or below the threshold value and return white or black
        let finalColor = grayscale < threshold ? 0 : 255;

        // assign the color
        data[i] = finalColor;
        data[i + 1] = finalColor;
        data[i + 2] = finalColor;
    }

    canvasContext!.putImageData(imgPixels, 0, 0, 0, 0, imgPixels.width, imgPixels.height);
    return canvas.toDataURL();
};

const performOcr = async (image: HTMLImageElement): Promise<string> => {
    // Omit data:image/png;base64
    let base64 = optimizeImageForTesseract(image).replace(/^data:image\/[a-z]+;base64,/, '');
    let imageBuffer = Buffer.from(base64, 'base64');

    const worker = await createWorker();

    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    console.log('Recognizing...');
    const { data: { text } } = await worker.recognize(imageBuffer);
    console.log('text', text);
    await worker.terminate();
    return text;
};

// Convert module.exports to ES6 exports
export { optimizeImageForTesseract, performOcr };
