import * as imageReader from './lib/image-reader';

const diabloOCR = {
    recognize: async (buffer: Buffer) => imageReader.performOcr(buffer),
};

export default diabloOCR;
