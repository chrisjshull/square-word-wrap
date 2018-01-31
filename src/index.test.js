
import {wrap, square, unwrap} from './';

function expectWrap(method, input, expected, unwrapped = input, args = []) {
  const output = method(input, ...args);
  expect(output).to.equal(expected);
  expect(unwrap(output)).to.equal(unwrapped);
}

describe('wrap', () => {
  it('basics', () => {
    expectWrap(wrap, '', '');
    expectWrap(wrap, 'a b', 'a\nb', undefined, [{width: 1}]);
    expectWrap(wrap, 'a b', 'a\nb', undefined, [{width: 2}]);
    expectWrap(wrap, 'a b c', 'a b\nc', undefined, [{width: 3}]);
  });

  it('word too long', () => {
    expectWrap(wrap, 'a bbb c', 'a\nbbb\nc', undefined, [{width: 2}]);
  });

  it('collapses whitespace', () => {
    expectWrap(wrap, ' a\nb  ccc\tddd', 'a b\nccc\nddd', 'a b ccc ddd', [{width: 3}]);
    expectWrap(wrap, ' \t\n\r', '', '');
  });

  it('respects nbsp', () => {
    expectWrap(wrap, 'aa bb\u00A0cc', 'aa\nbb\u00A0cc', undefined, [{width: 2}]);
  });

  it('respects graphemes', () => {
    // just making sure dependency being used
    // JS natively thinks that '🏳️‍🌈'.length === 6
    expectWrap(wrap, '🏳️‍🌈 a b c', '🏳️‍🌈 a\nb c', undefined, [{width: 3}]);
  });
});

describe('square', () => {
  it('basics', () => {
    expectWrap(square, '', '');
    expectWrap(square, 'a', 'a');
    expectWrap(square, 'a b', 'a\nb');
    expectWrap(square, 'aa bb', 'aa\nbb');
    expectWrap(square, 'aaa bbb ccc', 'aaa\nbbb\nccc');
  });

  it('unbalenced', () => {
    expectWrap(square, 'aa', 'aa');
    expectWrap(square, 'a b c', 'a b\nc');
    expectWrap(square, 'aa bb cc', 'aa\nbb\ncc');

    expectWrap(square, 'a bb', 'a\nbb');
    expectWrap(square, 'a bb ccc', 'a\nbb\nccc');
    expectWrap(square, 'a bb ccc dddd', 'a bb\nccc\ndddd');
  });

  it('long word', () => {
    expectWrap(square, 'a b c ddddd', 'a b\nc\nddddd');
  });

  it('long word with longWordForcesRect', () => {
    expectWrap(square, 'a b c ddddd', 'a b c\nddddd', undefined, [{longWordForcesRect: true}]);
  });
});
