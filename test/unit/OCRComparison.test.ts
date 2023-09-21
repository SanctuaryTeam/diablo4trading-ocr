import { join } from 'path';
import { readdirSync } from 'fs';
import { loadImageFromPath } from '../../src/lib/node';
import ItemBuilder from '../../src/lib/item-builder';
import { performOcr } from '../../src/lib/image-reader';

async function performOCRWithTests(imagePath: string) {
    expect(imagePath).not.toBeNull();
    const imageBuffer = loadImageFromPath(imagePath)!;
    const text = await performOcr(imageBuffer);
    const builder = new ItemBuilder(text);
    return builder.build();
}

const fixturePath = join(__dirname, '..', 'fixtures');
const dataPath = join(__dirname, '..', 'data'); // added the data path
const getFixturePath = (fileName: string) => join(fixturePath, fileName);
const getDataPath = (fileName: string) => join(dataPath, fileName);

describe('Compare fixtures with structured data', () => {
    it('should be a basic test', () => {
        expect(true).toBe(true);
    });
});

describe('Compare fixtures with structured data', () => {
    const imageFiles = readdirSync(fixturePath).filter(file =>
        file.endsWith('.png') || file.endsWith('.jpg')
    );

    for (const file of imageFiles) {
        it(`should match against ${file} image`, async () => {
            const item = await performOCRWithTests(getFixturePath(file));
            const tsFilename = getDataPath(file.replace(/\.(png|jpg)$/, '.ts'));
            const dataModule = await import(tsFilename);
            const itemName = file.replace(/\.(png|jpg)$/, 'Item');
            const expectedItem = dataModule[itemName];

            expect(expectedItem).toEqual(item);
        }, 6000);
    }
});