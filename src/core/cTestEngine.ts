export interface GapToken {
  id: string;
  gapIndex: number;
  fullWord: string;
  cleanWord: string;
  prefix: string;
  suffix: string;
  prefixLength: number;
  gapLength: number;
  sentenceIndex: number;
  leadingPunct: string;
  trailingPunct: string;
}

export type Token =
  | { type: 'plain'; text: string }
  | { type: 'gap'; gap: GapToken };

export interface CTestSentence {
  index: number;
  rawText: string;
  tokens: Token[];
  isLeadIn: boolean;
  isLeadOut: boolean;
}

export interface CTestPassage {
  id: string;
  title: string;
  domain?: string;
  difficulty?: 'B2' | 'C1' | 'C2';
  source?: string;
  rawText: string;
  sentences: CTestSentence[];
  gaps: GapToken[];
  totalGaps: number;
}

/**
 * Calculates prefix and suffix lengths according to standard C-Test principle:
 * Retained prefix: k = floor(L / 2)
 * Deleted suffix: g = ceil(L / 2) = L - k
 */
export function calculateGapSplit(word: string): { prefix: string; suffix: string; prefixLength: number; gapLength: number } {
  const L = word.length;
  const k = Math.floor(L / 2);
  return {
    prefix: word.slice(0, k),
    suffix: word.slice(k),
    prefixLength: k,
    gapLength: L - k,
  };
}

/**
 * Splits text into sentences while respecting common abbreviations
 */
export function splitIntoSentences(text: string): string[] {
  // Protect common abbreviations (e.g., Dr., Prof., e.g., i.e., et al., etc.)
  const protectedText = text
    .replace(/\b(e\.g\.|i\.e\.|et al\.|etc\.|Dr\.|Prof\.|Mr\.|Mrs\.|Ms\.|vs\.)\s/gi, (match) => match.replace(/\./g, '__DOT__'));

  const rawSentences = protectedText
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.replace(/__DOT__/g, '.').trim())
    .filter((s) => s.length > 0);

  return rawSentences;
}

/**
 * Checks if a token is an eligible candidate for C-Test gap creation.
 * Standard C-Test rules:
 * - Minimum length: 3 letters (L >= 3)
 * - Must be purely alphabetic letters (no numbers or special characters)
 * - Skips proper nouns (capitalized words that are NOT at the beginning of a sentence)
 */
export function isEligibleWord(word: string, isSentenceStart: boolean): boolean {
  if (word.length < 3) return false;
  if (!/^[a-zA-Z]+$/.test(word)) return false;

  // Proper noun check: Capitalized but not at start of sentence
  if (!isSentenceStart && /^[A-Z][a-z]+$/.test(word)) {
    return false;
  }

  return true;
}

/**
 * Generates a C-Test passage from raw text following the Klein-Braley & Raatz C-Principle.
 */
export function generateCTest(
  rawText: string,
  options: {
    id?: string;
    title?: string;
    domain?: string;
    difficulty?: 'B2' | 'C1' | 'C2';
    source?: string;
    targetGaps?: number;
  } = {}
): CTestPassage {
  const targetGaps = options.targetGaps ?? 20;
  const sentencesRaw = splitIntoSentences(rawText);
  const sentenceCount = sentencesRaw.length;

  const gaps: GapToken[] = [];
  const sentences: CTestSentence[] = [];

  let gapCandidateCounter = 0; // Cadence counter: 1 (intact), 2 (gap), 3 (intact), 4 (gap)...

  sentencesRaw.forEach((sentenceText, sIndex) => {
    const isLeadIn = sIndex === 0;
    const isLeadOut = sentenceCount >= 3 && sIndex === sentenceCount - 1;

    // Sentence 1 and the final sentence stay completely intact
    if (isLeadIn || isLeadOut) {
      sentences.push({
        index: sIndex,
        rawText: sentenceText,
        tokens: [{ type: 'plain', text: sentenceText }],
        isLeadIn,
        isLeadOut,
      });
      return;
    }

    // Parse tokens within gap-eligible middle sentences
    const tokens: Token[] = [];
    // Regex splits word characters from punctuation and whitespace
    const tokenRegex = /([a-zA-Z]+|[^a-zA-Z\s]+|\s+)/g;
    const parts = sentenceText.match(tokenRegex) || [sentenceText];

    let wordInSentenceIndex = 0;

    for (let pIndex = 0; pIndex < parts.length; pIndex++) {
      const part = parts[pIndex];

      if (/^[a-zA-Z]+$/.test(part)) {
        const isStart = wordInSentenceIndex === 0;
        wordInSentenceIndex++;

        const eligible = isEligibleWord(part, isStart);

        if (eligible && gaps.length < targetGaps) {
          gapCandidateCounter++;
          // Rule: Starting with word 2, every second eligible word is truncated
          // gapCandidateCounter: 1 = untouched, 2 = gap, 3 = untouched, 4 = gap ...
          if (gapCandidateCounter % 2 === 0) {
            const split = calculateGapSplit(part);
            const gapId = `gap-${gaps.length}`;

            const gapToken: GapToken = {
              id: gapId,
              gapIndex: gaps.length,
              fullWord: part,
              cleanWord: part,
              prefix: split.prefix,
              suffix: split.suffix,
              prefixLength: split.prefixLength,
              gapLength: split.gapLength,
              sentenceIndex: sIndex,
              leadingPunct: '',
              trailingPunct: '',
            };

            gaps.push(gapToken);
            tokens.push({ type: 'gap', gap: gapToken });
            continue;
          }
        }

        // Intact word
        tokens.push({ type: 'plain', text: part });
      } else {
        // Punctuation or whitespace
        tokens.push({ type: 'plain', text: part });
      }
    }

    sentences.push({
      index: sIndex,
      rawText: sentenceText,
      tokens,
      isLeadIn,
      isLeadOut,
    });
  });

  return {
    id: options.id || `ctest-${Date.now()}`,
    title: options.title || 'Untitled Passage',
    domain: options.domain || 'General Academic',
    difficulty: options.difficulty || 'C1',
    source: options.source,
    rawText,
    sentences,
    gaps,
    totalGaps: gaps.length,
  };
}
