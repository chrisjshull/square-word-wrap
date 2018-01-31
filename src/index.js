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

const splitter = new GraphemeSplitter();

const isWhiteSpace = (char) => /^[\t\n\r ]$/.test(char); // collapsible whitespace, like HTML/CSS

const DEBUG = false;

/**
 * ________
 */
export function square(str, opts = {}) {
  const chars = splitter.splitGraphemes(str);
  const words = [];
  let longestWordLength = 0;
  let charCount = 0;
  {
    let word = [];
    for (let i = 0; i < chars.length; i++) {
      const char = chars[i];
      if (!isWhiteSpace(char)) {
        charCount++;
        word.push(char);
        if (i < chars.length - 1) continue;
      }

      if (word.length) {
        longestWordLength = Math.max(longestWordLength, word.length);
        words.push(word);
        word = [];
      }
    }
  }
  charCount += words.length - 1;

  if (!words.length) return '';

  const target = Math.max(
    opts.longWordForcesRect ? longestWordLength : 0,
    Math.ceil(Math.sqrt(charCount)) // chances are an extra line will be needed, so round up to columns
  );

  DEBUG && console.log({str, target, charCount, longestWordLength}, words);

  const output = [];
  const line = []; //words[0];
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    DEBUG && console.log({word, line}, line.length + 1 + word.length);

    if (line.length + 1 + word.length > target && line.length) {
      output.push(line.join(''));
      line.length = 0;
    }

    if (line.length) line.push(' ');
    line.push(...word);

    if (i === words.length - 1) output.push(line.join(''));
  }

  DEBUG && console.log({output});

  return output.join('\n');
}
