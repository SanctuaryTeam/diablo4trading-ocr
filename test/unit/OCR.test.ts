import {join} from 'path';
import {loadImageFromPath} from '../../src/lib/node';
import {performOcr} from '../../src/lib/image-reader';
import {Game} from "@diablosnaps/common";

async function performOCRWithTests(file_name) {
    const imagePath = join(__dirname, '..', 'fixtures', file_name);
    expect(imagePath).not.toBeNull();
    const imageBuffer = loadImageFromPath(imagePath)!;
    console.log(await performOcr(imageBuffer))

    //TODO: return item object that uses the Item interface
    return {};
}

describe('Compare fixtures against built items', () => {
    it('should match against test1 image', async () => {
        const item = await performOCRWithTests('test1.png');

        const fixtureItem: Game.Item = {
            language: Game.Language.English,
            quality: Game.ItemQuality.Rare,
            variant: Game.ItemVariant.Ancestral,
            id: '',
            type: Game.ItemType.Ring,
            power: 766,
            requiredLevel: 80,
            classRestriction: null,
            accountBound: false,
            inherentAffixes: [
                {
                    id: 'basic_67#5',
                    value: 24.5,
                },
                {
                    id: 'basic_67#4',
                    value: 24.5,
                }
            ],
            affixes: [
                {
                    id: 'basic_618#4294967295',
                    value: 23.5,
                },
                {
                    id: 'basic_618#4294967295',
                    value: 3.4,
                },
                {
                    id: 'basic_792#2',
                    value: 19.0,
                },
                {
                    id: 'basic_155#4294967295',
                    value: 10.5,
                },
            ],
            legendaryAffix: null,
            uniqueAffix: null,
            socketType: null,
        };

        expect(fixtureItem).toEqual(item)
    }, 6000);


    it('should match against test2 image', async () => {
        const item = await performOCRWithTests('test2.png');

        const fixtureItem: Game.Item = {
            language: Game.Language.English,
            quality: Game.ItemQuality.Rare,
            variant: Game.ItemVariant.Ancestral,
            id: '',
            type: Game.ItemType.Amulet,
            power: 764,
            requiredLevel: 83,
            classRestriction: null,
            accountBound: false,
            inherentAffixes: [
                {
                    id: 'basic_69#4294967295',
                    value: 18.1,
                },
            ],
            affixes: [
                {
                    id: 'basic_963#495561',
                    value: 2,
                },
                {
                    id: 'basic_60#4294967295',
                    value: 14.0,
                },
                {
                    id: 'basic_206#4294967295',
                    value: 8.0,
                },
                {
                    id: 'basic_940#4294967295',
                    value: 5.5,
                },
            ],
            legendaryAffix: null,
            uniqueAffix: null,
            socketType: null,
        };

        expect(fixtureItem).toEqual(item)
    }, 6000);

    it('should match against test3 image', async () => {
        const item = await performOCRWithTests('test3.jpg');

        const fixtureItem: Game.Item = {
            language: Game.Language.English,
            quality: Game.ItemQuality.Rare,
            variant: Game.ItemVariant.Ancestral,
            id: '',
            type: Game.ItemType.Sword,
            power: 765,
            requiredLevel: 77,
            classRestriction: null,
            accountBound: false,
            inherentAffixes: [
                {
                    id: 'basic_232#4294967295',
                    value: 17.5,
                },
            ],
            affixes: [
                {
                    id: 'basic_212#2834424330',
                    value: 13.0,
                },
                {
                    id: 'basic_618#4294967295',
                    value: 20.5,
                },
                {
                    id: 'basic_232#4294967295',
                    value: 16.0,
                },
                {
                    id: 'basic_254#4294967295',
                    value: 37.5,
                },
            ],
            legendaryAffix: null,
            uniqueAffix: null,
            socketType: null,
        };

        expect(fixtureItem).toEqual(item)
    }, 6000);

    it('should match against test4 image', async () => {
        const item = await performOCRWithTests('test4.png');

        const fixtureItem: Game.Item = {
            language: Game.Language.English,
            quality: Game.ItemQuality.Rare,
            variant: Game.ItemVariant.Ancestral,
            id: '',
            type: Game.ItemType.Sword,
            power: 790,
            requiredLevel: 89,
            classRestriction: null,
            accountBound: false,
            inherentAffixes: [
                {
                    id: 'basic_232#4294967295',
                    value: 17.5,
                },
            ],
            affixes: [
                {
                    id: 'basic_2#4294967295',
                    value: 57,
                },
                {
                    id: 'basic_794#4294967295',
                    value: 9.5,
                },
                {
                    id: 'basic_232#4294967295',
                    value: 21.0,
                },
                {
                    id: 'basic_618#4294967295',
                    value: 22.5,
                },
            ],
            legendaryAffix: null,
            uniqueAffix: null,
            socketType: null,
        };

        expect(fixtureItem).toEqual(item)
    }, 6000);

    it('should match against test5 image', async () => {
        const item = await performOCRWithTests('test5.png');

        const fixtureItem: Game.Item = {
            language: Game.Language.English,
            quality: Game.ItemQuality.Rare,
            variant: Game.ItemVariant.Ancestral,
            id: '',
            type: Game.ItemType.Sword,
            power: 734,
            requiredLevel: 89,
            classRestriction: null,
            accountBound: false,
            inherentAffixes: [
                {
                    id: 'basic_232#4294967295',
                    value: 17.5,
                },
            ],
            affixes: [
                {
                    id: 'basic_232#4294967295',
                    value: 16.0,
                },
                {
                    id: 'basic_212#2834424330',
                    value: 17.5,
                },
                {
                    id: 'basic_932#4294967295',
                    value: 30.0,
                },
                {
                    id: 'basic_6#4294967295',
                    value: 26,
                },
            ],
            legendaryAffix: null,
            uniqueAffix: null,
            socketType: null,
        };

        expect(fixtureItem).toEqual(item)
    }, 6000);
});