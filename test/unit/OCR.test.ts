import { join } from 'path';

it('should only assert imagePath is not null', async () => {
    const imagePath = join(__dirname, 'fixtures', 'test3.jpg');
    expect(imagePath).not.toBeNull();
}, 5000);
