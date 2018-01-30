'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = squareWordWrap;

var _graphemeSplitter = require('grapheme-splitter');

var _graphemeSplitter2 = _interopRequireDefault(_graphemeSplitter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } } /**
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

var splitter = new _graphemeSplitter2.default();

var isWhiteSpace = function isWhiteSpace(char) {
  return (/^[\t\n\r ]$/.test(char)
  );
}; // collapsible whitespace, like HTML/CSS

var DEBUG = false;

/**
 * ________
 */
function squareWordWrap(str) {
  var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var chars = splitter.splitGraphemes(str);
  var words = [];
  var longestWordLength = 0;
  var charCount = 0;
  {
    var word = [];
    for (var i = 0; i < chars.length; i++) {
      var char = chars[i];
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

  var target = Math.max(opts.longWordForcesRect ? longestWordLength : 0, Math.ceil(Math.sqrt(charCount)) // chances are an extra line will be needed, so round up to columns
  );

  DEBUG && console.log({ str: str, target: target, charCount: charCount, longestWordLength: longestWordLength }, words);

  var output = [];
  var line = []; //words[0];
  for (var _i = 0; _i < words.length; _i++) {
    var _word = words[_i];
    DEBUG && console.log({ word: _word, line: line }, line.length + 1 + _word.length);

    if (line.length + 1 + _word.length > target && line.length) {
      output.push(line.join(''));
      line.length = 0;
    }

    if (line.length) line.push(' ');
    line.push.apply(line, _toConsumableArray(_word));

    if (_i === words.length - 1) output.push(line.join(''));
  }

  DEBUG && console.log({ output: output });

  return output.join('\n');
}