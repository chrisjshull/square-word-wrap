/**
 * Base module for ________.
 * ________________________________.
 * @module index
 * @example
 * import ________ from '________';
 * ________
 */

// future: grok terminal color escapes like https://github.com/chalk/chalk, https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color
// future: grok hyphens, inc. soft hyphens
// future: assume or allow passing or size of tabs
// future: support preserving existing whitespace chars without forcing them to be spaces inc. what to do with leading and repeating whitespace

import GraphemeSplitter from 'grapheme-splitter';
import ansiRegex from 'ansi-regex';

const splitter = new GraphemeSplitter();

const DEBUG = false;

/**
 * ________
 */
export function parseWords(str) {
  let longestWordLength = 0;
  let charCount = 0;
  const words = str.split(/[\t\n\r ]+/).map(wordTxt => { // collapsible whitespace, like HTML/CSS
    const word = [];

    const re = ansiRegex();
    let lastIndex = re.lastIndex;
    let leftANSI = '';

    const appendNonANSI = (endIndex = undefined) => {
      const prevTxt = wordTxt.substring(lastIndex, endIndex);
      if (prevTxt) {
        const graphemes = splitter.splitGraphemes(prevTxt);
        if (leftANSI) {
          graphemes[0] = leftANSI + graphemes[0];
          leftANSI = '';
        }
        word.push(...graphemes);
      }
    };

    let match;
    while ((match = re.exec(wordTxt)) !== null) {
      appendNonANSI(match.index);

      const ansi = match[0];

      if (word.length) {
        // try to "hide" ansi escapes inside of previous grapheme char
        word[word.length - 1] += ansi;
      } else {
        // or hold ANSI to try to "hide" in next grapheme char
        leftANSI += ansi;
      }

      lastIndex = re.lastIndex;
    }

    appendNonANSI();
    if (leftANSI) {
      word.push(leftANSI);
    }

    return word;
  }).filter(word => {
    charCount += word.length;
    longestWordLength = Math.max(longestWordLength, word.length);
    return word.length;
  });
  charCount += words.length - 1;

  return {words, charCount, longestWordLength};
}

function wrapToTarget(words, target, opts = {}) {
  const output = [];
  const line = [];
  for (let i = 0; i < words.length; i++) {
    const word = words[i];

    /* istanbul ignore next */
    DEBUG && console.log({word, line, target}, line.length + 1 + word.length);

    if (line.length + 1 + word.length > target && line.length) {
      output.push(line.join(''));
      line.length = 0;
    }

    if (line.length) line.push(' ');
    line.push(...word);

    if (i === words.length - 1) output.push(line.join(''));
  }

  /* istanbul ignore next */
  DEBUG && console.log({output});

  return output.join(opts.lineDelimeter || '\n');
}

export function wrap(str, opts) {
  const {words} = parseWords(str);
  return wrapToTarget(words, opts && opts.width || 80, opts);
}

export function square(str, opts = {}) {
  const {words, charCount, longestWordLength} = parseWords(str);

  let target = Math.max(
    opts.longWordForcesRect ? longestWordLength : 0,
    Math.ceil(Math.sqrt(charCount)) // chances are an extra line will be needed, so round up to columns
  );

  target *= opts.widthMultiplier || 2;

  /* istanbul ignore next */
  DEBUG && console.log({str, target, charCount, longestWordLength}, words);

  return wrapToTarget(words, target, opts);
}

export function unwrap(str, opts = {}) {
  const {words} = parseWords(str);

  return words.map(word => word.join('')).join(' ');
}
