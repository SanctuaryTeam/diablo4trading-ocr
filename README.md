# Diablo IV Item OCR Library - README.md

---

## **Introduction**

This library aims to provide developers with an easy-to-use Optical Character Recognition (OCR) system, specially designed for recognizing and interpreting in-game items in Diablo. Built using Node and the power of tesseract.js, this library is perfect for browser-based applications.

---

## **Features**

- Built using Node and tesseract.js
- Works seamlessly in the browser.
- Supports multiple languages for a broad range of players.
- Accounts for varying tooltip sizes, making it versatile.
- Designed to recognize items even under different color blind settings.
- Converts the recognized item into a structured JSON representation, in line with our game data packages.

---

## **Requirements**

### **1. System & Environment**

- Node.js (Version XX or higher)
- A modern web browser (Chrome, Firefox, Safari, etc.)

### **2. Game Data Packages**

- Make sure the game data packages are available and up-to-date. This ensures accurate JSON representation.

---
## Links
**Discord support channels**

[#project-discussion](https://discord.com/channels/989899054815281243/1133463025958002729)

[#project-forum](https://discord.com/channels/989899054815281243/1138949095877263400)

**Sanctuary Team projects**

[Sanctuary Team Repos](https://github.com/SanctuaryTeam)

[Front End](https://github.com/SanctuaryTeam/diablo4trading-fe)

[Back End](https://github.com/SanctuaryTeam/diablo4trading-be)

[Shared](https://github.com/SanctuaryTeam/shared)
---

## **Installation & Setup**
   _NOTE:_ These steps are an example as of 8/24/2023. Official steps be updated in the future.  

1. **Install the package**

   ```bash
   yarn run diablo4trading-ocr
   ```

2. **Include in your project**

   ```javascript
   const diabloOCR = require('diablo4trading-ocr');
   ```

3. **Setup game data packages**

   Ensure the game data packages are located in a reachable directory. Refer to the `config` documentation section for specifying the path.

---

## **Usage**

1. **Initiate the OCR process**

   ```javascript
   let itemImage = document.getElementById('item-image');  // Get your item image

   diabloOCR.recognize(itemImage).then(data => {
       console.log(data);  // JSON representation of the item
   });
   ```

2. **Language & Settings Configuration**

   The library supports easy configuration for different languages, tooltip sizes, and color blind settings. Refer to the `config` documentation section for a detailed guide.

---

## **Processing Strategy**
1. **Image Submission**
Image is passed to the library.

2. **Post Processing**
Any required post-processing of the image is done to enhance readability and recognition.

3. **Edge Detection**
Attempt to detect the edges of the tooltip to determine the boundary of relevant content.

4. **Bullet Point Detection**
Detect bullet points on the image. This helps in identifying item properties and features.

5. **Image Breakdown**
The image is broken down into smaller pieces when required. This strategy assists in dealing with complex affixes and ensuring accurate recognition.

6. **Text Scanning**
Scan the text content of each image segment and any remaining pieces.

7. **Language Determination**
Determine the language of the recognized text to ensure proper translation and representation.

8. **Item Property Extraction**
After all previous steps, item properties are determined and extracted for further use.

---

## Essential Dependencies

   [diablosnaps](https://github.com/Kyusung4698/diablosnaps)
   [tesseract.js](https://github.com/naptha/tesseract.js) 

1. Game Data Packages Dependency

For accurate JSON representation, this project depends on packages from the repository ```diablosnaps```. While these packages are essential for the OCR system, there are a few considerations to be made:

**Maintenance Concerns:** With the evolution of Diablo IV — encompassing new game features, seasons, and expansions — the data from ```diablosnaps``` must remain current. Yet, the sustained upkeep of this repository isn't guaranteed.

**Forking & Alternatives:** In the event that the primary repository becomes inactive or outdated, the community may opt to fork it or search for other alternatives. Such actions, however, might bring forth new challenges, such as maintaining the fork or smoothly integrating alternate data sources.

**Risks:** Depending on an external repository carries inherent risks. Alterations or discontinuations in the dependency could impact this OCR library's functionality.

Proposed Strategy & Outreach:

   _With release of new Diablo IV features, season mechanics, affix's, item names, item types... etc.  Montiroing diablosnaps repository for signs of outdated data._

---
## **Test Coverage**

### Strategy:

Our approach to ensuring the accuracy and reliability of the Diablo Item OCR Library hinges on comprehensive test coverage. Here's a step-by-step breakdown of our test coverage strategy:

1. **Fixture Data Collection**:
   - We maintain a curated set of fixture data, comprised of a series of known item images. These images are representative of different scenarios, languages, tooltip sizes, and color blind settings to ensure our library's broad applicability.

2. **Automated Testing**:
   - For each image in the fixture data set, we have an associated known output (i.e., a predetermined JSON representation of the item). 
   - During testing, our test cases loop through each image in the fixture data, process it using the OCR library, and then generate an output.

3. **Asserting Accuracy**:
   - The generated output is then compared or "asserted" against the known output. Any discrepancies are flagged, allowing us to pinpoint potential issues in the OCR recognition or processing.

4. **Continuous Integration**:
   - To maintain the highest level of reliability, these tests are routinely run, especially when any changes or updates are made to the library. This ensures that any modifications do not introduce regressions or unexpected behaviors.

### Contribution to Tests:

If you come across any in-game items that you believe would make valuable additions to our fixture data set, please consider contributing! It helps us to continually refine and enhance the accuracy of the library.

## **Contributing**

Feel free to fork, modify, and send in pull requests. The main aim is to enhance the library's accuracy and support for various in-game items. Check the `CONTRIBUTING.md` file for detailed guidelines.

---

## **Support**

For any issues or feature requests, open an issue on [GitHub](https://github.com/SanctuaryTeam).

---

## **License**

MIT License. See the `LICENSE` file for more details.

---

Thank you for choosing and supporting the Diablo Item OCR Library. Happy coding! 🎮🔥