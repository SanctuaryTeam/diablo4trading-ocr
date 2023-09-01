import leven from "leven";
import {Assets} from '@diablosnaps/assets';

export default class ItemBuilder {

    item = {
        implicitAffixes: [],
        affixes: [],
    }

    lines = null;

    constructor(text) {
        // this.lines = text.split(/\r\n|\n|\r/);

        this.lines = [
            "BITTER WEAPGN /",
            "Ancestral Rare Two-Handed e",
            "Sword (Slashing) /",
            "794 Item Power",
            "—_—— o",
            "2,244 Damage Per Second (-35)",
            "': [1,795 - 2,693] Damage per Hit",
            "1.00 Attacks per Second",
            "@ +35.0% Critical Strike Damage",
            "[35.01%",
            "———_—— o ——",
            "© +41.0% Critical Strike Damage [28.0 -",
            "42.00%",
            "& +39.0% Vulnerable Damage [33.0 -",
            "47.0%",
            "@ +54 All Stats +[40 - 56]",
            "& +67.0% Basic Skill Damage [37.0 -",
            "79.01% ]",
            "Requires Level 97",
            "- e",
            "Sell Value: 33,254 &",
            "R Durability: 100/100 |",
            ""
        ];
    }

    async build() {
        this.lines.filter(l => l).forEach((line, index) => {
            this.findEssentials(line, index);
            this.findItemPower(line, index);

            //TODO: only if item category has armor
            this.findArmor(line, index);

            //TODO: only if item category has dph
            this.findDamagePerHit(line, index);

            this.findRequiredLevel(line, index);

            //TODO: sockets

            this.findClass(line, index);
        })

        await this.findaffixes();

        console.log('this.item', this.item);

        return this.item;
    }

    async findaffixes() {
        //TODO: extract relevant item affixes using item category and rarity
        const affixDescriptions = (await Assets.loadAffixes()).descriptions.enUS;

        for (const affixId in affixDescriptions) {
            const replacement = affixDescriptions[affixId].includes('*100|1%') ? '#%' : '#';
            affixDescriptions[affixId] = affixDescriptions[affixId].replace(/\[.*?VALUE.*?\]|\{.*?VALUE.*?\}/g, replacement);
        }

        const potentialAffixes = this.potentialAffixes(this.lines);
        let affixMatches = [];

        potentialAffixes.forEach((potentialAffix) => {
            // const hasIncreasesRanksOf = this.hasRanksOfOrSimilar(potentialAffix.line);

            for (const affixId in affixDescriptions) {
                const affix = affixDescriptions[affixId];

                let similarity = this.similarText(affix, potentialAffix.line);

                if (similarity >= 80 && similarity <= 90) {
                    similarity = this.similarText(potentialAffix.line.replace(/\[(.*)|\{(.*)|\((.*)/).trim(), affix)
                }

                if (similarity >= 89) {
                    let value = potentialAffix.withoutSpecialCharacters.replace(/[a-zA-Z]/, '').replace(/\+/g, '').trim();
                    value = value.match(/(?<!\+)[-+]?\b(?:\d+(?:,\d+)*(?:\.\d+)?|\.\d+)\b/);
                    value = value ? value[0] : '0';
                    value = value.replace('/,/', '.');

                    const affixMatch = {
                        id: affixId,
                        line: potentialAffix.line,
                        description: affix,
                        match: similarity,
                        value: parseFloat(value),
                        keys: potentialAffix.keys,
                    };

                    affixMatches.push(affixMatch);
                }
            }
        });

        let groupedByKeys = [];

        // Iterate through matched affixes
        affixMatches.forEach((matchedAffix) => {
            // Iterate through grouped keys
            let addedToGroup = false;
            for (let groupKey = 0; groupKey < groupedByKeys.length; groupKey++) {
                const group = groupedByKeys[groupKey];
                // Check if there are common keys between the group and matchedAffix
                const commonKeys = group.flatMap(affix => affix.keys).filter(key => matchedAffix.keys.includes(key));
                if (commonKeys.length > 0) {
                    // Check if any affix in the group is similar to the matchedAffix
                    const similarAffix = group.some(affix => {
                        const perc = this.similarText(affix.line.trim(), matchedAffix.line.trim()); // Use a similarity function
                        return perc >= 86;
                    });
                    if (similarAffix) {
                        group.push(matchedAffix);
                        addedToGroup = true;
                        break;
                    }
                }
            }
            if (!addedToGroup) {
                groupedByKeys.push([matchedAffix]);
            }
        });

        const itemAffixes = groupedByKeys.map(group => {
            return group.sort((a, b) => b.match - a.match)[0];
        });

        itemAffixes.forEach(itemAffix => {
            let isImplicit = false;

            if (this.item.itemCategory) {
                // Check if the affix belongs to the item's category and is implicit
                //TODO: some check here
                isImplicit = false

                // Prevent duplicate implicits
                if (this.item.implicitAffixes && this.item.implicitAffixes.some(implicitAffix => implicitAffix.id === itemAffix.id)) {
                    isImplicit = false;
                }
            }

            // Add implicit affix to array
            if (isImplicit) {
                this.item.implicitAffixes.push(itemAffix);
                return;
            }

            // Prevent duplicate affixes
            if (this.item.affixes && this.item.affixes.some(affix => affix.id === itemAffix.id)) {
                return;
            }

            // Add affix to item
            this.item.affixes.push(itemAffix);
        });
    }


    // (astral / sacred), rarity, category (gloves, boots etc)
    findEssentials(line, index) {
        if (this.item.hasOwnProperty('enhancement_id')
            && this.item.hasOwnProperty('item_rarity_id')
            && this.item.hasOwnProperty('item_category_id')) {
            return;
        }

        line.split(" ").forEach((word) => {

            //rarity
            const rarities = ['Magic', 'Rare'];

            rarities.forEach((rarity, key) => {
                if (this.similarText(word, rarity) >= 80) {
                    this.lines.splice(key, index);
                }
            });
        });
    }


    findItemPower(line, index) {
        if (this.item.hasOwnProperty("Item Power")) {
            return;
        }

        if (line.includes("Item Power") || this.similarText(line, "Item Power") >= 80) {
            const filteredNumbers = line.split(/\D+/).filter(Boolean);
            this.item.item_power = parseInt(filteredNumbers[0]);
            this.lines.splice(index, 1);
        }
    }

    findArmor(line, index) {
        if (this.item.hasOwnProperty("armor")) {
            return;
        }

        if (line.includes("Armor") || this.similarText(line, "Armor") >= 80) {
            const filteredNumbers = line.split(/\D+/).filter(Boolean);
            this.item.item_power = parseInt(filteredNumbers[0]);
            this.lines.splice(index, 1);
        }
    }

    findDamagePerHit(line, index) {
        if (this.item.hasOwnProperty("min_damage_per_hit") && this.item.hasOwnProperty("max_damage_per_hit")) {
            return
        }


        const withoutBrackets = line.replace(/\([^()]*\)|\{[^{}]*\}|\[[^\[\]]*\]/g, '').trim();
        const alphaNumeric = withoutBrackets.replace(/[^A-Za-z0-9 ]/g, '');

        if (!this.similarText(alphaNumeric.replace(/[0-9]+/g, '').trim(), "Damage per Hit") >= 90) {
            return;
        }

        const contentInBrackets = line.match(/(?:\[[^\[\]]*\]|\([^()]*\)|\{[^{}]*\}|\[[^\]]*\]|\([^)]*\)|\{[^}]*\})/);

        if (!contentInBrackets) {
            return;
        }

        const numbersInBrackets = contentInBrackets[0].match(/\b\d[\d,.]*\b/g);

        if (numbersInBrackets && numbersInBrackets.length >= 2) {
            this.item.min_damage_per_hit = parseInt(numbersInBrackets[0].replace(/,/g, ''), 10);
            this.item.max_damage_per_hit = parseInt(numbersInBrackets[1].replace(/,/g, ''), 10);
            this.lines.splice(index, 1);
        }
    }

    findRequiredLevel(line, index) {
        if (this.item.hasOwnProperty("character_level_requirement")) {
            return;
        }

        if (this.similarText(line.replace(/[0-9]+/g, "").trim(), "Requires Level") >= 80) {
            const numbers = line.match(/\d+/);

            if (numbers && numbers.length > 0) {
                this.item.character_level_requirement = parseInt(numbers[numbers.length - 1], 10);
                this.lines.splice(index, 1);
            }
        }
    }

    findClass(line, index) {
        if (this.item.hasOwnProperty("class")) {
            return;
        }

        //TODO: import character classes
        const characterClasses = ["Rogue", "Druid"];

        for (const characterClass of characterClasses) {
            if (line.includes(characterClass) || this.similarText(line, characterClass) >= 80) {
                let hasOnly = false;

                //word doesn't have 'only' - removes skill upgrade affixes
                line.split(' ').forEach((word) => {
                    if (this.similarText('Only', word.replace(/[()]/g, '')) >= 80) {
                        hasOnly = true;
                    }
                });

                if (!hasOnly) {
                    this.item.class = characterClass;
                    this.lines.splice(index, 1);
                    break; // If needed, you can break the loop
                }
            }
        }
    }

    potentialAffixes(lines) {
        let potentialAffixes = [];

        // combine the next four lines for each remaining line
        // given these four lines
        // 1 => "+14.0% Total Armor while in",
        // 2 => "Werewolf Form [7.0 - 14.0]%",
        // 3 => "",
        // 4 => "* 6.6% Spirit Cost Reduction [4.2 - 7.0]%",

        // the output will be:
        // 1 => "+14.0% Total Armor while in"
        // 2 => "+14.0% Total Armor while in Werewolf Form [7.0 - 14.0]%"
        // 3 => "+14.0% Total Armor while in Werewolf Form [7.0 - 14.0]% * 6.6% Spirit Cost Reduction [4.2 - 7.0]%"
        // 4 => "+14.0% Total Armor while in Werewolf Form [7.0 - 14.0]% * 6.6% Spirit Cost Reduction [4.2 - 7.0]% 38.0% Shadow Resistance [24.5 -"
        // 5 => "Werewolf Form [7.0 - 14.0]%"
        // 6 => "Werewolf Form [7.0 - 14.0]% * 6.6% Spirit Cost Reduction [4.2 - 7.0]%"
        // 7 => "Werewolf Form [7.0 - 14.0]% * 6.6% Spirit Cost Reduction [4.2 - 7.0]% 38.0% Shadow Resistance [24.5 -"
        // 8 => "Werewolf Form [7.0 - 14.0]% * 6.6% Spirit Cost Reduction [4.2 - 7.0]% 38.0% Shadow Resistance [24.5 - 45.5)%"

        lines.forEach((line, key) => {
            potentialAffixes.push({line, keys: [key]});

            if (lines[key + 1]) {
                potentialAffixes.push({line: line + ' ' + lines[key + 1], keys: [key, key + 1]});

                if (lines[key + 2]) {
                    potentialAffixes.push({
                        line: line + ' ' + lines[key + 1] + ' ' + lines[key + 2],
                        keys: [key, key + 1, key + 2]
                    });

                    if (lines[key + 3]) {
                        potentialAffixes.push({
                            line: line + ' ' + lines[key + 1] + ' ' + lines[key + 2] + ' ' + lines[key + 3],
                            keys: [key, key + 1, key + 2, key + 3],
                        });
                    }
                }
            }
        });


        // string manipulation (get as close to as the affix description)
        // in: ®38.0% Shadow Resistance [24.5 -
        // out: #% Shadow Resistance
        potentialAffixes = potentialAffixes.map((potentialAffix) => {
            let line = potentialAffix.line;

            // Remove percentages after closing brackets
            line = line.replace(/(?<=\])\%/, "");
            line = line.replace(/(?<=\))\%/, "");
            line = line.replace(/(?<=\})\%/, "");

            // Remove "+" before {,[,(
            line = line.replace(/\+(?=[\(\{\[])/, "");

            // Remove min & max rolls (balanced pairs of parentheses, curly braces, and square brackets)
            const regex = /\((?:[^()]|[^()]*(?=\(\)))*\)|\{(?:[^{}]|[^{}]*(?=\{\}))*\}|\[(?:[^\[\]]|[^\[\]]*(?=\[\]))*\]|\[[^\[\]\(\)]*\]/g;
            while (regex.test(line)) {
                line = line.replace(regex, '');
            }

            // Remove special characters
            line = line.replace(/[*@©°®¢©|&‘]/, "");

            // Remove "‘" at the start of the string
            const withoutMismatched = line.replace(/^‘/, "");

            // Replace affix value with '#' to match affix description names
            let refinedLine = withoutMismatched.replace(/\d+(?:,\d+)*(?:\.\d+)*/, "#").trim();

            // Remove unmatched curly brackets, parentheses, and square brackets
            refinedLine = this.removeMismatchedContent(refinedLine).trim();

            potentialAffix.withoutSpecialCharacters = withoutMismatched;
            potentialAffix.line = refinedLine;

            return potentialAffix;
        });


        // ignore lines past "Properties lost when equipped:"
        let propsLostLineExists = false;

        return potentialAffixes.filter((potentialAffix) => {
            if (propsLostLineExists) {
                return false;
            }

            if (this.similarText("Properties lost when equipped:", potentialAffix.line.trim()) >= 90) {
                propsLostLineExists = true;
                return false;
            }

            return true;
        });
    }

    // Function to check if the input string has "Ranks of" or similar
    hasRanksOfOrSimilar(inputString) {
        const targetString = "Ranks of";

        // Check if the exact target string is present (case-insensitive)
        if (inputString.toLowerCase().includes(targetString.toLowerCase())) {
            return true;
        }

        // Check if similarity is above the threshold
        if (this.similarText(inputString, targetString) >= 80) {
            return true;
        }

        return false;
    }

    // Remove unmatched curly brackets, parentheses, and square brackets
    removeMismatchedContent(text) {
        const stack = [];
        const openingBrackets = ["[", "{"];
        const closingBrackets = ["]", "}"];
        const bracketPairs = {"[": "]", "{": "}"};
        let result = '';

        for (let i = 0; i < text.length; i++) {
            const char = text[i];

            if (openingBrackets.includes(char)) {
                stack.push(char);
            } else if (closingBrackets.includes(char)) {
                if (stack.length === 0 || char !== bracketPairs[stack[stack.length - 1]]) {
                    continue; // Skip closing bracket if it doesn't match
                }
                stack.pop();
            } else {
                if (stack.length === 0) {
                    result += char;
                }
            }
        }

        return result;
    }

    similarText(first, second) {
        return (100 - (leven(first.toLowerCase(), second.toLowerCase()) / Math.max(first.length, second.length)) * 100);
    }
}