
import {wrap, square, unwrap} from './';

function expectWrap(method, input, expected, args = [], unwrapped = input) {
  const output = method(input, ...args);
  expect(output).to.equal(expected);
  expect(unwrap(output), 'unwrap').to.equal(unwrapped);
}

describe('wrap', () => {
  it('basics', () => {
    expectWrap(wrap, '', '');
    expectWrap(wrap, 'a b', 'a\nb', [{width: 1}]);
    expectWrap(wrap, 'a b', 'a\nb', [{width: 2}]);
    expectWrap(wrap, 'a b c', 'a b\nc', [{width: 3}]);
  });

  it('word too long', () => {
    expectWrap(wrap, 'a bbb c', 'a\nbbb\nc', [{width: 2}]);
  });

  it('collapses whitespace', () => {
    expectWrap(wrap, ' a\nb  ccc\tddd', 'a b\nccc\nddd', [{width: 3}], 'a b ccc ddd');
    expectWrap(wrap, ' \t\n\r', '', [], '');
  });

  it('respects nbsp', () => {
    expectWrap(wrap, 'aa bb\u00A0cc', 'aa\nbb\u00A0cc', [{width: 2}]);
  });

  it('respects graphemes', () => {
    // just making sure dependency being used
    // JS natively thinks that '🏳️‍🌈'.length === 6
    expectWrap(wrap, '🏳️‍🌈 a b c', '🏳️‍🌈 a\nb c', [{width: 3}]);
  });

  it('respects ANSI escape codes', () => {
    expectWrap(wrap, '\u001B[4m', '\u001B[4m', [{width: 1}]);
    expectWrap(wrap, '\u001B[4mcake\u001B[0m yeah', '\u001B[4mcake\u001B[0m yeah', [{width: 9}]);
    expectWrap(wrap, 'yeah \u001B[4mcake\u001B[0m', 'yeah \u001B[4mcake\u001B[0m', [{width: 9}]);
    expectWrap(wrap, ' \u001B[4m cake \u001B[0m yeah', '\u001B[4m cake \u001B[0m yeah', [{width: 13}], '\u001B[4m cake \u001B[0m yeah');
    expectWrap(wrap, 'yeah \u001B[4mcake\u001B[0m ', 'yeah \u001B[4mcake\u001B[0m', [{width: 9}], 'yeah \u001B[4mcake\u001B[0m');

    expectWrap(wrap, '\u001B[4m\u001B[4mcake\u001B[0m\u001B[0m yeah', '\u001B[4m\u001B[4mcake\u001B[0m\u001B[0m yeah', [{width: 9}]);
    expectWrap(wrap, 'yeah \u001B[4m\u001B[4mcake\u001B[0m\u001B[0m', 'yeah \u001B[4m\u001B[4mcake\u001B[0m\u001B[0m', [{width: 9}], 'yeah \u001B[4m\u001B[4mcake\u001B[0m\u001B[0m', );
    expectWrap(wrap, ' \u001B[4m\u001B[4m cake \u001B[0m\u001B[0m yeah', '\u001B[4m\u001B[4m cake \u001B[0m\u001B[0m yeah', [{width: 13}], '\u001B[4m\u001B[4m cake \u001B[0m\u001B[0m yeah');
    expectWrap(wrap, 'yeah \u001B[4m\u001B[4mcake\u001B[0m\u001B[0m ', 'yeah \u001B[4m\u001B[4mcake\u001B[0m\u001B[0m', [{width: 9}], 'yeah \u001B[4m\u001B[4mcake\u001B[0m\u001B[0m');
  });
});

describe('square', () => {
  it('basics', () => {
    expectWrap(square, '', '', [{widthMultiplier: 1}]);
    expectWrap(square, 'a', 'a', [{widthMultiplier: 1}]);
    expectWrap(square, 'a b', 'a\nb', [{widthMultiplier: 1}]);
    expectWrap(square, 'aa bb', 'aa\nbb', [{widthMultiplier: 1}]);
    expectWrap(square, 'aaa bbb ccc', 'aaa\nbbb\nccc', [{widthMultiplier: 1}]);
  });

  it('unbalenced', () => {
    expectWrap(square, 'aa', 'aa', [{widthMultiplier: 1}]);
    expectWrap(square, 'a b c', 'a b\nc', [{widthMultiplier: 1}]);
    expectWrap(square, 'aa bb cc', 'aa\nbb\ncc', [{widthMultiplier: 1}]);

    expectWrap(square, 'a bb', 'a\nbb', [{widthMultiplier: 1}]);
    expectWrap(square, 'a bb ccc', 'a\nbb\nccc', [{widthMultiplier: 1}]);
    expectWrap(square, 'a bb ccc dddd', 'a bb\nccc\ndddd', [{widthMultiplier: 1}]);
  });

  it('long word', () => {
    expectWrap(square, 'a b c ddddd', 'a b\nc\nddddd', [{widthMultiplier: 1}]);
  });

  it('long word with longWordForcesRect', () => {
    expectWrap(square, 'a b c ddddd', 'a b c\nddddd', [{longWordForcesRect: true, widthMultiplier: 1}]);
  });

  it('widthMultiplier', () => {
    expectWrap(square, 'aa bb c d', 'aa\nbb\nc d', [{widthMultiplier: 1}]);
    expectWrap(square, 'aa bb c d', 'aa bb\nc d', [{widthMultiplier: 2}]);
    expectWrap(square, 'aa bb c d', 'aa bb\nc d');
    expectWrap(square, 'aa bb c d', 'aa bb c d', [{widthMultiplier: 3}]);
  });
});
