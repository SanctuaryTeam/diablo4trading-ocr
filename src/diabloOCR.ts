import * as imageReader from './lib/image-reader';
import ItemBuilder from "./lib/item-builder";

const diabloOCR = {
    recognize(image): Promise<any> {
        return new Promise(async (resolve) => {
            let text = await imageReader.performOcr(image);
            console.log('text');
            resolve(new ItemBuilder(text).build());
        });
    },
};

export default diabloOCR;
