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
 * Preprocesses raw text by cleaning web/Wikipedia citations, bracketed notes, and fixing punctuation spacing.
 */
export function cleanAndPreprocessText(text: string): string {
  // Strip bracketed citations like [citation needed], [1], [note 1], [edit], [12]
  let cleaned = text.replace(/\[\s*(?:citation needed|\d+|note \d+|edit|clarification needed|source\?)[^\]]*\]/gi, '');
  
  // Normalize punctuation spacing: if period/exclamation/question is immediately followed by a capital letter without space
  cleaned = cleaned.replace(/([.!?])(?=[A-Z])/g, '$1 ');

  return cleaned.trim();
}

/**
 * Splits text into sentences while respecting common abbreviations, quotes, and web artifacts.
 */
export function splitIntoSentences(text: string): string[] {
  const cleaned = cleanAndPreprocessText(text);

  // Protect common abbreviations strictly when followed by lowercase letters or numbers (case-sensitive)
  const protectedText = cleaned
    .replace(/\b(e\.g\.|i\.e\.|et al\.|Dr\.|Prof\.|Mr\.|Mrs\.|Ms\.|vs\.)\s+(?=[a-z0-9])/g, (match) => match.replace(/\./g, '__DOT__'))
    .replace(/\betc\.\s+(?=[a-z,])/g, 'etc__DOT__ ');

  // Split on sentence-terminating punctuation followed by quotes/parens and whitespace or newline
  const rawSentences = protectedText
    .split(/(?<=[.!?]["'»”’\)]?)(?:\s+|\n+)/)
    .map((s) => s.replace(/__DOT__/g, '.').trim())
    .filter((s) => s.length > 0);

  // Fallback: If no sentence punctuation exists at all (e.g. user pasted a single long block), split on semicolons or newlines
  if (rawSentences.length === 1 && cleaned.length > 120) {
    const clauseSplit = cleaned
      .split(/(?<=[;:])(?:\s+|\n+)/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    if (clauseSplit.length > 1) {
      return clauseSplit;
    }
  }

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

    // Sentence 1 is ALWAYS 100% intact lead-in
    if (isLeadIn) {
      sentences.push({
        index: sIndex,
        rawText: sentenceText,
        tokens: [{ type: 'plain', text: sentenceText }],
        isLeadIn: true,
        isLeadOut: false,
      });
      return;
    }

    // Lead-out sentence: If sentenceCount >= 4 and we have already reached or almost reached target gaps,
    // keep the final sentence completely intact as lead-out
    const isLeadOut = sentenceCount >= 4 && sIndex === sentenceCount - 1 && gaps.length >= targetGaps;

    if (isLeadOut) {
      sentences.push({
        index: sIndex,
        rawText: sentenceText,
        tokens: [{ type: 'plain', text: sentenceText }],
        isLeadIn: false,
        isLeadOut: true,
      });
      return;
    }

    // Parse tokens within gap-eligible sentences
    const tokens: Token[] = [];
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
      isLeadIn: false,
      isLeadOut: sIndex === sentenceCount - 1,
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
