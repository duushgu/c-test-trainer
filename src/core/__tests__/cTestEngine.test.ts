import { describe, it, expect } from 'vitest';
import {
  calculateGapSplit,
  isEligibleWord,
  splitIntoSentences,
  generateCTest,
} from '../cTestEngine';

describe('C-Test Engine: Split Calculation', () => {
  it('correctly splits even-length words: floor(L/2) retained, ceil(L/2) deleted', () => {
    // L=4: test -> te | st
    const split4 = calculateGapSplit('test');
    expect(split4.prefix).toBe('te');
    expect(split4.suffix).toBe('st');
    expect(split4.prefixLength).toBe(2);
    expect(split4.gapLength).toBe(2);

    // L=6: system -> sys | tem
    const split6 = calculateGapSplit('system');
    expect(split6.prefix).toBe('sys');
    expect(split6.suffix).toBe('tem');
    expect(split6.prefixLength).toBe(3);
    expect(split6.gapLength).toBe(3);

    // L=8: decision -> deci | sion
    const split8 = calculateGapSplit('decision');
    expect(split8.prefix).toBe('deci');
    expect(split8.suffix).toBe('sion');
    expect(split8.prefixLength).toBe(4);
    expect(split8.gapLength).toBe(4);
  });

  it('correctly splits odd-length words: floor(L/2) retained, ceil(L/2) deleted', () => {
    // L=3: the -> t | he
    const split3 = calculateGapSplit('the');
    expect(split3.prefix).toBe('t');
    expect(split3.suffix).toBe('he');
    expect(split3.prefixLength).toBe(1);
    expect(split3.gapLength).toBe(2);

    // L=5: model -> mo | del
    const split5 = calculateGapSplit('model');
    expect(split5.prefix).toBe('mo');
    expect(split5.suffix).toBe('del');
    expect(split5.prefixLength).toBe(2);
    expect(split5.gapLength).toBe(3);

    // L=7: physics -> phy | sics
    const split7 = calculateGapSplit('physics');
    expect(split7.prefix).toBe('phy');
    expect(split7.suffix).toBe('sics');
    expect(split7.prefixLength).toBe(3);
    expect(split7.gapLength).toBe(4);
  });
});

describe('C-Test Engine: Word Eligibility', () => {
  it('rejects short words (L < 3)', () => {
    expect(isEligibleWord('a', false)).toBe(false);
    expect(isEligibleWord('in', false)).toBe(false);
    expect(isEligibleWord('to', false)).toBe(false);
  });

  it('rejects non-alphabetic tokens', () => {
    expect(isEligibleWord('123', false)).toBe(false);
    expect(isEligibleWord('e-mail', false)).toBe(false);
  });

  it('skips mid-sentence proper nouns but accepts initial capitalized words', () => {
    expect(isEligibleWord('Einstein', false)).toBe(false);
    expect(isEligibleWord('Einstein', true)).toBe(true);
    expect(isEligibleWord('particle', false)).toBe(true);
  });
});

describe('C-Test Engine: Sentence Splitting', () => {
  it('splits standard paragraphs into sentences', () => {
    const text = 'First sentence here. Second sentence follows! Is this the third? Yes it is.';
    const sentences = splitIntoSentences(text);
    expect(sentences.length).toBe(4);
    expect(sentences[0]).toBe('First sentence here.');
  });
});

describe('C-Test Engine: Full Passage Generation', () => {
  const sampleText = `
Quantum mechanics represents one of the greatest triumphs of modern theoretical physics.
At microscopic scales, physical systems exhibit behaviors that defy our everyday intuition.
Particles can exist in superpositions of states until an observation forces a collapse.
This probabilistic framework revolutionized our understanding of atomic spectra and chemical bonding.
Today, quantum information science promises to transform computation, cryptography, and precision metrology.
`.trim();

  it('keeps the first and last sentences completely intact', () => {
    const ctest = generateCTest(sampleText, { targetGaps: 10 });
    expect(ctest.sentences[0].isLeadIn).toBe(true);
    expect(ctest.sentences[0].tokens.every((t) => t.type === 'plain')).toBe(true);

    const lastIdx = ctest.sentences.length - 1;
    expect(ctest.sentences[lastIdx].isLeadOut).toBe(true);
    expect(ctest.sentences[lastIdx].tokens.every((t) => t.type === 'plain')).toBe(true);
  });

  it('generates gaps in middle sentences according to the C-cadence', () => {
    const ctest = generateCTest(sampleText, { targetGaps: 10 });
    expect(ctest.gaps.length).toBeGreaterThan(0);
    expect(ctest.gaps.length).toBeLessThanOrEqual(10);

    ctest.gaps.forEach((gap) => {
      expect(gap.prefix + gap.suffix).toBe(gap.fullWord);
      expect(gap.prefix.length).toBe(gap.prefixLength);
      expect(gap.suffix.length).toBe(gap.gapLength);
    });
  });

  it('generates valid C-tests for all 59 passages in the library (35 academic + 24 UAB)', async () => {
    const { RAW_PASSAGES } = await import('../../data/passages');
    expect(RAW_PASSAGES.length).toBe(59);

    RAW_PASSAGES.forEach((p) => {
      const targetGaps = p.batteryId.startsWith('battery-8') ||
        p.batteryId.startsWith('battery-9') ||
        p.batteryId.startsWith('battery-10') ||
        p.batteryId.startsWith('battery-11') ||
        p.batteryId.startsWith('battery-12') ||
        p.batteryId.startsWith('battery-13') ? 25 : 20;

      const ctest = generateCTest(p.rawText, { targetGaps });
      expect(ctest.gaps.length).toBe(targetGaps);
      expect(ctest.sentences[0].isLeadIn).toBe(true);
    });
  });

  it('correctly handles Wikipedia text with [citation needed] and abbreviation boundary', () => {
    const wikiText = `In literary theory, a text is any object that can be read, literally or figuratively, whether this object is a work of literature, a street sign, an arrangement of buildings on a city block, or styles of clothing.[citation needed] It is a set of signs that is available to be reconstructed by a reader (or observer) if sufficient interpretants are available.[citation needed] This set of signs is considered in terms of the informative message's content, rather than in terms of its physical form or the medium in which it is represented.[citation needed]

Within the field of literary criticism, "text" also refers to the original information content of a particular piece of writing; that is, the "text" of a work is that primal symbolic arrangement of letters as originally composed, apart from later alterations, deterioration, commentary, translations, paratext, etc. Therefore, when literary criticism is concerned with the determination of a "text", it is concerned with the distinguishing of the original information content from whatever has been added to or subtracted from that content as it appears in a given textual document (that is`;

    const ctest = generateCTest(wikiText, { targetGaps: 20 });
    expect(ctest.sentences.length).toBe(5);
    expect(ctest.gaps.length).toBe(20);
    expect(ctest.sentences[0].isLeadIn).toBe(true);
  });
});
