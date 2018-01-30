
import squareWordWrap from './';

describe('squareWordWrap', () => {
  it('basics', () => {
    expect(squareWordWrap('')).to.equal('');
    expect(squareWordWrap('a')).to.equal('a');
    expect(squareWordWrap('a b')).to.equal('a\nb');
    expect(squareWordWrap('aa bb')).to.equal('aa\nbb');
    expect(squareWordWrap('aaa bbb ccc')).to.equal('aaa\nbbb\nccc');
  });

  it('unbalenced', () => {
    expect(squareWordWrap('aa')).to.equal('aa');
    expect(squareWordWrap('a b c')).to.equal('a b\nc');
    expect(squareWordWrap('aa bb cc')).to.equal('aa\nbb\ncc');

    expect(squareWordWrap('a bb')).to.equal('a\nbb');
    expect(squareWordWrap('a bb ccc')).to.equal('a\nbb\nccc');
    expect(squareWordWrap('a bb ccc dddd')).to.equal('a bb\nccc\ndddd');
  });

  it('long word', () => {
    expect(squareWordWrap('a b c ddddd')).to.equal('a b\nc\nddddd');
  });

  it('long word with longWordForcesRect', () => {
    expect(squareWordWrap('a b c ddddd', {longWordForcesRect: true})).to.equal('a b c\nddddd');
  });

  it('collapses whitespace', () => {
    expect(squareWordWrap(' a\nb  ccc\tddd')).to.equal('a b\nccc\nddd');
  });

  it('respects nbsp', () => {
    expect(squareWordWrap('aa bb\u00A0cc')).to.equal('aa\nbb\u00A0cc');
  });

  it('respects graphemes', () => {
    // just making sure dependency being used
    // JS natively thinks that '🏳️‍🌈'.length === 6
    expect(squareWordWrap('🏳️‍🌈 a b c')).to.equal('🏳️‍🌈 a\nb c');
  });
});
