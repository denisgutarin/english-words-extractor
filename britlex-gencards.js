const fs = require("fs");
const lemmatizer = require("node-lemmatizer");

const INPUT_FILE_NAME = "britlex-phrases.txt";

const excludeSet = new Set();
const excludeLemmaSet = new Set();

const normalizeWord = (wordInput, lemmatized) => {
  const word = wordInput
    .toLowerCase()
    .replace(/[^a-z\-']+/g, " ")
    .trim();
  if (!word) {
    return [];
  }
  if (lemmatized) {
    const lemmas = lemmatizer.lemmas(word);
    return lemmas;
  } else {
    return [[word, undefined]];
  }
};

// Read the input file
const inputFile = INPUT_FILE_NAME;
const inputText = fs.readFileSync(inputFile, "utf8");

const lines = inputText.split("\n");
let resultText = "";

const wrongSentences = [];

lines.forEach((line, index) => {
  let [lemma, translation, sentence, ...rest] = line.split("\t");
  sentence = sentence + " " + rest.join(" ");
  let gapped = sentence;
  const words = sentence.split(/[^a-zA-Z]+/).map((word) => word.trim());
  let found = false;

  lemma = lemma.toLowerCase().trim();

  words.forEach((word) => {
    word = word.trim();
    if (word.length < 2) {
      return;
    }

    // Transform word to lowercase and remove non-letter symbols
    const cleanedWordForms = normalizeWord(word.toLowerCase(), true);
    if (!cleanedWordForms.length) {
      return;
    }

    const lemmaToCompareList = lemma
      .split(/[^a-zA-Z]+/)
      .map((item) => item.trim())
      .filter(Boolean);

    if (
      cleanedWordForms
        .map((item) => item[0])
        .find((word) =>
          lemmaToCompareList.some((lemmaToCompare) =>
            word.includes(lemmaToCompare)
          )
        )
    ) {
      found = true;

      sentence = sentence
        .replace(/\s+/g, " ")
        .trim()
        .replaceAll(word, `<b>${word}</b>`);

      const gap = new Array(word.length).fill("_").join("");
      gapped = gapped
        .replace(/\s+/g, " ")
        .trim()
        .replaceAll(word, `<b>${gap}</b>`);
    }
  });

  if (!found) {
    wrongSentences.push(line);
    return;
  }

  const newLine =
    String(5000 - index) +
    "\t" +
    lemma +
    "\t" +
    lemma +
    "\t" +
    sentence +
    "\t" +
    gapped +
    "<br><br>" +
    translation +
    "\n";

  resultText += newLine;
});

// Save the result string to a file
const resultFile = "britlex-cards.txt";
fs.writeFileSync(resultFile, resultText, "utf8");

console.log("Couldn't found a word in:");
console.log(wrongSentences.join("\n"));
