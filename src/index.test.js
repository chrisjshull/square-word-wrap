
import {square} from './';

describe('square', () => {
  it('basics', () => {
    expect(square('')).to.equal('');
    expect(square('a')).to.equal('a');
    expect(square('a b')).to.equal('a\nb');
    expect(square('aa bb')).to.equal('aa\nbb');
    expect(square('aaa bbb ccc')).to.equal('aaa\nbbb\nccc');
  });

  it('unbalenced', () => {
    expect(square('aa')).to.equal('aa');
    expect(square('a b c')).to.equal('a b\nc');
    expect(square('aa bb cc')).to.equal('aa\nbb\ncc');

    expect(square('a bb')).to.equal('a\nbb');
    expect(square('a bb ccc')).to.equal('a\nbb\nccc');
    expect(square('a bb ccc dddd')).to.equal('a bb\nccc\ndddd');
  });

  it('long word', () => {
    expect(square('a b c ddddd')).to.equal('a b\nc\nddddd');
  });

  it('long word with longWordForcesRect', () => {
    expect(square('a b c ddddd', {longWordForcesRect: true})).to.equal('a b c\nddddd');
  });

  it('collapses whitespace', () => {
    expect(square(' a\nb  ccc\tddd')).to.equal('a b\nccc\nddd');
  });

  it('respects nbsp', () => {
    expect(square('aa bb\u00A0cc')).to.equal('aa\nbb\u00A0cc');
  });

  it('respects graphemes', () => {
    // just making sure dependency being used
    // JS natively thinks that '🏳️‍🌈'.length === 6
    expect(square('🏳️‍🌈 a b c')).to.equal('🏳️‍🌈 a\nb c');
  });
});
