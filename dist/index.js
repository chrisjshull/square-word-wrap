'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.wrap = wrap;
exports.square = square;
exports.unwrap = unwrap;

var _graphemeSplitter = require('grapheme-splitter');

var _graphemeSplitter2 = _interopRequireDefault(_graphemeSplitter);

var _ansiRegex = require('ansi-regex');

var _ansiRegex2 = _interopRequireDefault(_ansiRegex);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } } /**
                                                                                                                                                                                                     * Base module for __PROJECT_NAME__.
                                                                                                                                                                                                     * ________________________________.
                                                                                                                                                                                                     * @module index
                                                                                                                                                                                                     * @example
                                                                                                                                                                                                     * import ________ from '__PROJECT_NAME__';
                                                                                                                                                                                                     * ________
                                                                                                                                                                                                     */

// future: grok terminal color escapes like https://github.com/chalk/chalk, https://stackoverflow.com/questions/9781218/how-to-change-node-jss-console-font-color
// future: grok hyphens, inc. soft hyphens
// future: assume or allow passing or size of tabs
// future: support preserving existing whitespace chars without forcing them to be spaces inc. what to do with leading and repeating whitespace

var splitter = new _graphemeSplitter2.default();

var DEBUG = false;

/**
 * ________
 */
function parseWords(str) {
  var longestWordLength = 0;
  var charCount = 0;
  var words = str.split(/[\t\n\r ]+/).map(function (wordTxt) {
    // collapsible whitespace, like HTML/CSS
    var word = [];

    var re = (0, _ansiRegex2.default)();
    var lastIndex = re.lastIndex;
    var leftANSI = '';

    var appendNonANSI = function appendNonANSI() {
      var endIndex = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;

      var prevTxt = wordTxt.substring(lastIndex, endIndex);
      if (prevTxt) {
        var graphemes = splitter.splitGraphemes(prevTxt);
        if (leftANSI) {
          graphemes[0] = leftANSI + graphemes[0];
          leftANSI = '';
        }
        word.push.apply(word, _toConsumableArray(graphemes));
      }
    };

    var match = void 0;
    while ((match = re.exec(wordTxt)) !== null) {
      appendNonANSI(match.index);

      var ansi = match[0];

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
  }).filter(function (word) {
    charCount += word.length;
    longestWordLength = Math.max(longestWordLength, word.length);
    return word.length;
  });
  charCount += words.length - 1;

  return { words: words, charCount: charCount, longestWordLength: longestWordLength };
}

function wrapToTarget(words, target) {
  var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var output = [];
  var line = [];
  for (var i = 0; i < words.length; i++) {
    var word = words[i];

    /* istanbul ignore next */
    DEBUG && console.log({ word: word, line: line, target: target }, line.length + 1 + word.length);

    if (line.length + 1 + word.length > target && line.length) {
      output.push(line.join(''));
      line.length = 0;
    }

    if (line.length) line.push(' ');
    line.push.apply(line, _toConsumableArray(word));

    if (i === words.length - 1) output.push(line.join(''));
  }

  /* istanbul ignore next */
  DEBUG && console.log({ output: output });

  return output.join(opts.lineDelimeter || '\n');
}

function wrap(str, opts) {
  var _parseWords = parseWords(str),
      words = _parseWords.words;

  return wrapToTarget(words, opts && opts.width || 80, opts);
}

function square(str) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var _parseWords2 = parseWords(str),
      words = _parseWords2.words,
      charCount = _parseWords2.charCount,
      longestWordLength = _parseWords2.longestWordLength;

  var target = Math.max(opts.longWordForcesRect ? longestWordLength : 0, Math.ceil(Math.sqrt(charCount)) // chances are an extra line will be needed, so round up to columns
  );

  target *= opts.widthMultiplier || 2;

  /* istanbul ignore next */
  DEBUG && console.log({ str: str, target: target, charCount: charCount, longestWordLength: longestWordLength }, words);

  return wrapToTarget(words, target, opts);
}

function unwrap(str) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var _parseWords3 = parseWords(str),
      words = _parseWords3.words;

  return words.map(function (word) {
    return word.join('');
  }).join(' ');
}