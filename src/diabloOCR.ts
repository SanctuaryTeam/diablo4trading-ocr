import * as imageReader from './lib/image-reader';

const diabloOCR = {
    recognize(image): Promise<any> {
        return new Promise((resolve) => {
            resolve(imageReader.performOcr(image));
        });
    },
};

export default diabloOCR;
