/**
 * Base module for wrap-words.
 * @module index
 * @example
 * import {wrap} from 'wrap-words';
 * console.log(wrap('hello world '.repeat(100)));
 */

// future: grok hyphens, inc. soft hyphens
// future: assume or allow passing or size of tabs
// future: support preserving existing whitespace chars without forcing them to be spaces inc. what to do with leading and repeating whitespace

import GraphemeSplitter from 'grapheme-splitter';
import ansiRegex from 'ansi-regex';

const splitter = new GraphemeSplitter();

const DEBUG = false;

function parseWords(text) {
  let longestWordLength = 0;
  let charCount = 0;
  const words = text.split(/[\t\n\r ]+/).map(wordTxt => { // collapsible whitespace, like HTML/CSS
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

/**
 * Wrap a string so that it has `opts.width` characters max line length.
 * (Unless a given word is longer than `opts.width`).
 *
 * @param {String} text
 * @param {Number} [opts.width=80]
 * @param {String} [opts.lineDelimeter="\n"]
 * @returns {String}
 */
export function wrap(text, opts) {
  const {words} = parseWords(text);
  return wrapToTarget(words, (opts && opts.width) || 80, opts);
}

/**
 * Wrap a string such that the resulting text should be of approximately the same width and height.
 *
 * @param {String} text
 * @param {Number} [opts.widthMultiplier=2] Make each row this much longer to account for characters being taller than they are wide.
 * @param {String} [opts.lineDelimeter="\n"]
 * @returns {String}
 */
export function square(text, opts = {}) {
  const {words, charCount, longestWordLength} = parseWords(text);

  let target = Math.max(
    opts.longWordForcesRect ? longestWordLength : 0,
    Math.ceil(Math.sqrt(charCount)) // chances are an extra line will be needed, so round up to columns
  );

  target *= opts.widthMultiplier || 2;

  /* istanbul ignore next */
  DEBUG && console.log({text, target, charCount, longestWordLength}, words);

  return wrapToTarget(words, target, opts);
}

/**
 * Removes newlines (and other whitespace), collapsing to a single space.
 *
 * @param {String} text
 * @returns {String}
 */
export function unwrap(text) {
  const {words} = parseWords(text);

  return words.map(word => word.join('')).join(' ');
}
