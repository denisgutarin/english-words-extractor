const fs = require("fs");

function stemWord(inword) {
  inword = inword.trim().toLowerCase();

  const endings = [
    "lessness",
    "fulness",
    "iveness",
    "ivness",
    "ingly",
    "able",
    "tion",
    "sion",
    "ness",
    "less",
    "illy",
    "edly",
    "elly",
    "ive",
    "ing",
    "dly",
    "lly",
    "ely",
    "ly",
    "ily",
    "ble",
    "ous",
    "ize",
    "ise",
    "ful",
    "est",
    "ed",
    "es",
    "s",
    "d",
  ];

  for (let ending of endings) {
    if (inword.length <= ending.length) {
      continue;
    }
    if (
      inword.substr(inword.length - ending.length, ending.length) === ending
    ) {
      return inword.substr(0, inword.length - ending.length);
    }
  }
}
console.log(stemWord("capable"));
function addWord(set, inputWord) {
  word = inputWord.trim().toLowerCase();
  set.add(word);
  set.add(word + "ly");
  set.add(word + "lly");
  set.add(word + "ely");
  set.add(word + "elly");
  set.add(word + "ly");
  set.add(word + "ly");
  set.add(word + "er");
  set.add(word + "est");
  set.add(word + "st");
  set.add(word + "r");
  set.add(word + "ily");
  set.add(word + "illy");
  set.add(word + "ed");
  set.add(word + "es");
  set.add(word + "s");
  set.add(word + "d");
  set.add(word + "ing");
  set.add(word + "ingly");
  set.add(word + "dly");
  set.add(word + "edly");
  set.add(word + "ble");
  set.add(word + "able");
  set.add(word + "tion");
  set.add(word + "sion");
  set.add(word + "ness");
  set.add(word + "ous");
  set.add(word + "ize");
  set.add(word + "ise");
  set.add(word + "ful");
  set.add(word + "fulness");
  set.add(word + "less");
  set.add(word + "lessness");
  set.add(word + "ive");
  set.add(word + "iveness");
  set.add(word + "ivness");
  set.add(word + word.at(-1) + "ing");
  set.add(word + word.at(-1) + "ed");
  set.add(word + word.at(-1) + "es");
  set.add(word + word.at(-1) + "ingly");
  set.add(word + word.at(-1) + "dly");
  set.add(word + word.at(-1) + "edly");

  if (word.at(-1) === "e") {
    set.add(word + "d");
    set.add(word + "s");
    set.add(word.slice(0, word.length - 1) + "ing");
  } else if (word.at(-1) === "y") {
    set.add(word.slice(0, word.length - 1) + "ied");
    set.add(word.slice(0, word.length - 1) + "ies");
    set.add(word + "ing");
  } else if (word.at(-1) === "ye") {
    set.add(word.slice(0, word.length - 2) + "ied");
    set.add(word.slice(0, word.length - 2) + "ies");
    set.add(word.slice(0, word.length - 1) + "ing");
  }

  if (word.at(-1) === "f") {
    ankiSet.add(word.slice(0, word.length - 1) + "ves");
    ankiSet.add(word.slice(0, word.length - 1) + "ved");
    ankiSet.add(word.slice(0, word.length - 1) + "ving");
    ankiSet.add(word.slice(0, word.length - 1) + "ffing");
    ankiSet.add(word.slice(0, word.length - 1) + "ffed");
    ankiSet.add(word.slice(0, word.length - 1) + "ffes");
  } else if (word.at(-2) === "fe") {
    ankiSet.add(word.slice(0, word.length - 2) + "ves");
    ankiSet.add(word.slice(0, word.length - 2) + "ved");
    ankiSet.add(word.slice(0, word.length - 2) + "ving");
    ankiSet.add(word.slice(0, word.length - 2) + "fes");
    ankiSet.add(word.slice(0, word.length - 2) + "fed");
    ankiSet.add(word.slice(0, word.length - 2) + "fing");
    ankiSet.add(word.slice(0, word.length - 2) + "ffes");
    ankiSet.add(word.slice(0, word.length - 2) + "ffed");
    ankiSet.add(word.slice(0, word.length - 2) + "ffng");
  }
}

const ankiFile = "anki.txt";
const ankiText = fs.readFileSync(ankiFile, "utf8");

const ankiSet = new Set();
ankiText.split("\n").forEach((line) => {
  if (line[0] === "#" || line.length < 10) {
    return;
  }
  const cells = line.split("\t");
  const phrase = (cells[1] + " " + cells[4] + " " + cells[5])
    .trim()
    .toLowerCase()
    .replace(/[^a-z]+/g, " ");

  phrase.split(/\s+/).forEach((word) => {
    addWord(ankiSet, word);
  });
});

const vocabFile = "vocab.txt";
const vocabText = fs.readFileSync(vocabFile, "utf8");

const vocabSet = new Set();
const vocabList = vocabText
  .split(/\s+/)
  .filter((word) => /[a-z]+/.test(word.toLowerCase()));

let mark = false;
const vocabListStemmedSet = new Set();
vocabList.forEach((word, index) => {
  vocabListStemmedSet.add(stemWord(word));
  if (vocabListStemmedSet.size < 7000) {
    addWord(vocabSet, word);
  } else if (!mark) {
    console.log("Passed popular words: ", index);
    mark = true;
  }
});

// Read the input file
const inputFile = "input.txt";
const inputText = fs.readFileSync(inputFile, "utf8");

// Split the input text into an array of words
const words = inputText.split(/[\s'\-"]+/);

// Array of pronouns in all forms
const pronouns = [
  "i",
  "me",
  "my",
  "mine",
  "myself",
  "you",
  "your",
  "yours",
  "yourself",
  "he",
  "him",
  "his",
  "himself",
  "she",
  "her",
  "hers",
  "herself",
  "it",
  "its",
  "itself",
  "we",
  "us",
  "our",
  "ours",
  "ourselves",
  "ourselves",
  "they",
  "them",
  "their",
  "theirs",
  "themselves",
];

// Array of prepositions
const prepositions = [
  "aboard",
  "about",
  "above",
  "across",
  "after",
  "against",
  "along",
  "amid",
  "among",
  "around",
  "as",
  "at",
  "before",
  "behind",
  "below",
  "beneath",
  "beside",
  "between",
  "beyond",
  "but",
  "by",
  "concerning",
  "considering",
  "despite",
  "down",
  "during",
  "except",
  "for",
  "from",
  "in",
  "inside",
  "into",
  "like",
  "near",
  "of",
  "off",
  "on",
  "onto",
  "out",
  "outside",
  "over",
  "past",
  "regarding",
  "round",
  "since",
  "through",
  "throughout",
  "to",
  "toward",
  "under",
  "underneath",
  "until",
  "unto",
  "up",
  "upon",
  "with",
  "within",
  "without",
];

// Array of articles
const articles = ["a", "an", "the"];

// Array of conjunctions
const conjunctions = [
  "and",
  "but",
  "for",
  "nor",
  "or",
  "so",
  "yet",
  "after",
  "although",
  "as",
  "because",
  "before",
  "if",
  "since",
  "though",
  "unless",
  "until",
  "when",
  "where",
  "while",
];

// Array of common forms of "to be" verb
const toBeForms = [
  "am",
  "is",
  "are",
  "was",
  "were",
  "been",
  "being",
  "isn",
  "aren",
  "wasn",
  "weren",
  "won",
  "amn",
];

// Array of common forms of "to have" verb
const toHaveForms = ["have", "has", "had", "having"];

// Array of common forms of "to say" verb
const toSayForms = ["say", "says", "said", "saying"];

// Array of common forms of "to go" verb
const toGoForms = ["go", "goes", "went", "going"];

// Array of common forms of "to tell" verb
const toTellForms = ["tell", "tells", "told", "telling"];

// Array of common forms of "to ask" verb
const toAskForms = ["ask", "asks", "asked", "asking"];

// Array of common forms of "to do"
const toDoForms = ["do", "did", "didn", "done", "doing"];

// Create a map to store the word counts
const wordCountMap = new Map();
const allCountSet = new Set();

// Count the occurrences of each word
words.forEach((word) => {
  // Transform word to lowercase and remove non-letter symbols
  const cleanedWord = word
    .trim()
    .toLowerCase()
    .replace(/[^a-z]+/g, "");
  if (cleanedWord === "") {
    return;
  }

  if (/[A-Z]/.test(word.trim()[0])) {
    return;
  }

  allCountSet.add(cleanedWord);

  if (
    !pronouns.includes(cleanedWord) &&
    !prepositions.includes(cleanedWord) &&
    !articles.includes(cleanedWord) &&
    !conjunctions.includes(cleanedWord) &&
    !toBeForms.includes(cleanedWord) &&
    !toHaveForms.includes(cleanedWord) &&
    !toSayForms.includes(cleanedWord) &&
    !toGoForms.includes(cleanedWord) &&
    !toTellForms.includes(cleanedWord) &&
    !toAskForms.includes(cleanedWord) &&
    !toDoForms.includes(cleanedWord) &&
    !vocabSet.has(cleanedWord) &&
    !ankiSet.has(cleanedWord)
  ) {
    const count = wordCountMap.get(cleanedWord) || 0;
    wordCountMap.set(cleanedWord, count + 1);
  }
});

// Sort the map entries by count in descending order
const sortedEntries = [...wordCountMap.entries()].sort((a, b) => b[1] - a[1]);

// Create a string representation of the sorted entries
const resultString = sortedEntries
  .map(([word, count]) => `${word}: ${count}`)
  .join("\n");

// Save the result string to a file
const resultFile = "result.txt";
fs.writeFileSync(resultFile, resultString, "utf8");

console.log("Word count map saved to", resultFile);
console.log("Input words count: ", allCountSet.size);
console.log("Result words count: ", sortedEntries.length);
