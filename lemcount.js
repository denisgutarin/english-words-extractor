const fs = require("fs");
const lemmatizer = require("node-lemmatizer");

const excludeSet = new Set();
const excludeLemmaSet = new Set();

const normalizeWord = (wordInput, lemmatized) => {
  const word = wordInput
    .trim()
    .toLowerCase()
    .replace(/[^a-z\-']+/g, "");
  if (!word) {
    return [];
  }
  if (lemmatized) {
    const lemmas = lemmatizer.lemmas(word.trim().toLowerCase());
    return lemmas;
  } else {
    return [[word, undefined]];
  }
};

const excludeWord = (word, lemmatized) => {
  const list = normalizeWord(word, lemmatized);

  list.forEach((pair) => {
    const lemma = pair[0];
    const type = pair[1];
    excludeSet.add(lemma);
    excludeLemmaSet.add(lemma);
    if (type === "verb") {
      excludeSet.add(lemma + "ing");
      excludeSet.add(lemma.substr(0, lemma.length - 1) + "ing");
      excludeSet.add(lemma + "ed");
      excludeSet.add(lemma + "d");
      excludeSet.add(lemma.substr(0, lemma.length - 1) + "d");
      excludeSet.add(lemma.substr(0, lemma.length - 1) + "ed");
    }
    if (type === "adj") {
      excludeSet.add(lemma + "ly");
      excludeSet.add(lemma + "lly");
      excludeSet.add(lemma.substr(0, lemma.length - 1) + "ly");
      excludeSet.add(lemma.substr(0, lemma.length - 1) + "lly");
    }
    if (type === "noun") {
      excludeSet.add(lemma + "ing");
      excludeSet.add(lemma.substr(0, lemma.length - 1) + "ing");
      excludeSet.add(lemma + "ed");
      excludeSet.add(lemma + "d");
      excludeSet.add(lemma.substr(0, lemma.length - 1) + "d");
      excludeSet.add(lemma.substr(0, lemma.length - 1) + "ed");
    }
  });
};

const excludeLine = (line) => {
  line
    .toLowerCase()
    .split(/\s+/)
    .forEach((word) => excludeWord(word, true));
};

const excludeText = (text) => {
  text.split("\n").forEach(excludeLine);
};

const ankiFile = "anki.txt";
const ankiText = fs.readFileSync(ankiFile, "utf8");
ankiText.split("\n").forEach((line) => {
  if (line[0] === "#" || line.length < 10) {
    return;
  }
  const cells = line.split("\t");
  const phrase = (cells[1] + " " + cells[4] + " " + cells[5])
    .trim()
    .toLowerCase()
    .replace(/[^a-z\-]+/g, " ");

  excludeLine(phrase);
});

const britlexFile = "britlex.txt";
const britlexText = fs.readFileSync(britlexFile, "utf8");
britlexText
  .toLowerCase()
  .replaceAll(/\[.+\]/g, "")
  .split(/\s+/)
  .forEach((word) => {
    excludeWord(word);
  });

const lemFile = "poplem.txt";
const lemText = fs.readFileSync(lemFile, "utf8");
excludeText(lemText);

// Read the input file
const inputFile = "input.txt";
const inputText = fs.readFileSync(inputFile, "utf8");

const sentences = inputText
  .replaceAll("--", "")
  .replaceAll('."', '".')
  .replaceAll('?"', '?".')
  .replaceAll('!"', '!".')
  .replaceAll("!", "!.")
  .replaceAll("?", "?.")
  .replaceAll(";", ".")
  .split(/[?\.!]+/);

// Create a map to store the word counts
const rareCountMap = new Map();
const allCountSet = new Set();
let allWordsCount = 0;
let rareWordsCount = 0;

sentences.forEach((sentence) => {
  const words = sentence.split(/\s+/).map((word) => word.trim());

  words.forEach((word) => {
    word = word.replaceAll(/[^a-zA-Z\-']+/g, "").trim();

    allWordsCount += 1;

    if (/[A-Z]/g.test(word) || word.includes("'")) {
      return;
    }

    if (word.length < 4) {
      return;
    }

    // Transform word to lowercase and remove non-letter symbols
    const cleanedWordForms = normalizeWord(word, true);
    if (!cleanedWordForms.length) {
      return;
    }

    cleanedWordForms.forEach(([cleanedWord, type]) => {
      allCountSet.add(cleanedWord);

      if (!excludeSet.has(cleanedWord)) {
        rareWordsCount += 1;
        const found = rareCountMap.get(cleanedWord);
        const count = found?.count || 0;
        const newSentence = sentence
          .replace(/\s+/g, " ")
          .trim()
          .replaceAll(word, `<b>${word}</b>`);

        if (!newSentence.length > 0) {
          return;
        }
        const gap = new Array(word.length).fill("").join("_");
        const gapSentence = newSentence.replaceAll(word, gap);
        rareCountMap.set(cleanedWord, {
          count: count + 1,
          word,
          sentence:
            newSentence.length > (found?.sentence?.length ?? 0) ||
            !found?.sentence?.length
              ? newSentence
              : found.sentence,
          gapSentence:
            newSentence.length > (found?.sentence?.length ?? 0) ||
            !found?.sentence?.length
              ? gapSentence
              : found.gapSentence,
        });
      }
    });
  });
});

// Sort the map entries by count in descending order
const sortedEntries = [...rareCountMap.entries()].sort(
  (a, b) => b[1].count - a[1].count
);

// Create a string representation of the sorted entries
const resultString = sortedEntries
  .map(
    ([lemma, props]) =>
      props.count +
      "\t" +
      lemma +
      "\t" +
      props.word +
      "\t" +
      props.sentence +
      "\t" +
      props.gapSentence
  )
  .join("\n");

// Save the result string to a file
const resultFile = "result.txt";
fs.writeFileSync(resultFile, resultString, "utf8");

const excludedFile = "excluded.txt";
fs.writeFileSync(excludedFile, [...excludeLemmaSet].join("\n"), "utf8");

console.log("Word count map saved to", resultFile);
console.log("All input words count: ", allWordsCount);
console.log("All rare words count: ", rareWordsCount);
console.log(
  "Text simplicity: ",
  ((100 * (allWordsCount - rareWordsCount)) / allWordsCount).toFixed(1) + "%"
);
console.log("Unique input lemmas count: ", allCountSet.size);
console.log("Unique fundamental lemmas count: ", excludeLemmaSet.size);
console.log("Unique rare lemmas count: ", sortedEntries.length);
