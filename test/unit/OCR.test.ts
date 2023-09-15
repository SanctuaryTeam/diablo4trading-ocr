import { join } from 'path';
import { loadImageFromPath } from '../../src/lib/node';
import { performOcr } from '../../src/lib/image-reader';

it('should only assert imagePath is not null', async () => {
    const imagePath = join(__dirname, '..', 'fixtures', 'test3.jpg');
    expect(imagePath).not.toBeNull();
    const imageBuffer = loadImageFromPath(imagePath)!;
    console.log(await performOcr(imageBuffer))
}, 60000);
