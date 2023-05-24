const fs = require("fs");
const lemmatizer = require("node-lemmatizer");

const excludeSet = new Set();

const normalizeWord = (wordInput, lemmatized) => {
  const word = wordInput
    .trim()
    .toLowerCase()
    .replace(/[^a-z\-']+/g, "");
  if (!word) {
    return [];
  }
  if (lemmatized) {
    const lemmas = lemmatizer.only_lemmas(word.trim().toLowerCase());
    return lemmas;
  } else {
    return [word];
  }
};

const excludeWord = (word, lemmatized) => {
  const list = normalizeWord(word, lemmatized);
  list.forEach((lemma) => {
    excludeSet.add(lemma);
    excludeSet.add(lemma + "ing");
    excludeSet.add(lemma.substr(0, lemma.length - 1) + "ing");
    excludeSet.add(lemma + "ly");
    excludeSet.add(lemma + "lly");
    excludeSet.add(lemma.substr(0, lemma.length - 1) + "ly");
    excludeSet.add(lemma.substr(0, lemma.length - 1) + "lly");
  });
};

const excludeLine = (line) => {
  line.toLowerCase().split(/\s+/).forEach(excludeWord);
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

const lemFile = "poplem.txt";
const lemText = fs.readFileSync(lemFile, "utf8");
excludeText(lemText);

// Read the input file
const inputFile = "input.txt";
const inputText = fs.readFileSync(inputFile, "utf8");

const sentences = inputText
  .replaceAll("--", "")
  .replaceAll('."', '".')
  .split(/[?\.!]+/);

// Create a map to store the word counts
const rareCountMap = new Map();
const allCountSet = new Set();

sentences.forEach((sentence) => {
  const words = sentence.split(/\s+/).map((word) => word.trim());

  words.forEach((word) => {
    if (/[A-Z]/g.test(word) || word.includes("'")) {
      return;
    }

    // Transform word to lowercase and remove non-letter symbols
    const cleanedWordForms = normalizeWord(word, true);
    if (!cleanedWordForms.length) {
      return;
    }

    cleanedWordForms.forEach((cleanedWord) => {
      allCountSet.add(cleanedWord);

      if (!excludeSet.has(cleanedWord)) {
        const found = rareCountMap.get(cleanedWord);
        const count = found?.count || 0;
        const sentences =
          (found?.sentences?.length ?? 0) < 3
            ? [...(found?.sentences ?? []), sentence.replace(/\s+/g, " ")]
            : found.sentences;

        rareCountMap.set(cleanedWord, { count: count + 1, sentences });
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
    ([word, props]) =>
      props.count + "\t\t" + word + "\t" + props.sentences.join(". ")
  )
  .join("\n");

// Save the result string to a file
const resultFile = "result.txt";
fs.writeFileSync(resultFile, resultString, "utf8");

console.log("Word count map saved to", resultFile);
console.log("Input words count: ", allCountSet.size);
console.log("Result words count: ", sortedEntries.length);
