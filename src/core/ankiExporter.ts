import type { CTestPassage } from './cTestEngine';
import type { GapEvaluation } from './evaluator';

export interface AnkiCard {
  front: string; // The cloze formatted sentence
  backHint: string; // The missing word or notes
  tags: string[];
}

/**
 * Builds Anki-compatible Cloze deletion text for a sentence containing gaps.
 * Format: "In a landmark deci{{c1::sion}}, the court agreed."
 */
export function buildSentenceCloze(
  passage: CTestPassage,
  failedGaps: GapEvaluation[]
): AnkiCard[] {
  const failedGapIds = new Set(failedGaps.map((g) => g.gapId));
  const cards: AnkiCard[] = [];

  passage.sentences.forEach((sentence) => {
    // Check if sentence has any failed gaps
    const sentenceGaps = sentence.tokens.filter(
      (t) => t.type === 'gap' && failedGapIds.has(t.gap.id)
    );

    if (sentenceGaps.length === 0) return;

    // Construct the sentence with Anki cloze markers {{c1::...}}
    let clozeSentence = '';
    let clozeIndex = 1;

    sentence.tokens.forEach((token) => {
      if (token.type === 'plain') {
        clozeSentence += token.text;
      } else {
        const isFailed = failedGapIds.has(token.gap.id);
        if (isFailed) {
          // Cloze format: prefix + {{c1::suffix}}
          clozeSentence += `${token.gap.prefix}{{c${clozeIndex}::${token.gap.suffix}}}`;
          clozeIndex++;
        } else {
          // Gaps answered correctly or not failed stay full word for clear context
          clozeSentence += token.gap.fullWord;
        }
      }
    });

    const wordsFailed = sentenceGaps
      .map((t) => (t.type === 'gap' ? t.gap.fullWord : ''))
      .filter(Boolean)
      .join(', ');

    cards.push({
      front: clozeSentence.trim(),
      backHint: `Focus words: ${wordsFailed} | Context: ${passage.title} (${passage.domain || 'General'})`,
      tags: ['c-test', 'cloze', (passage.domain || 'general').toLowerCase().replace(/\s+/g, '-')],
    });
  });

  return cards;
}

/**
 * Generates tab-separated text (TSV) ready to import into Anki as a Cloze deck.
 */
export function generateAnkiExportText(cards: AnkiCard[]): string {
  // Anki TSV format: Column 1 = Text (with {{c1::}}), Column 2 = Extra/Notes, Column 3 = Tags
  const header = '#separator:tab\n#html:true\n#notetype:Cloze\n#tags column:3\n';

  const rows = cards.map((card) => {
    const cleanFront = card.front.replace(/\t/g, ' ');
    const cleanBack = card.backHint.replace(/\t/g, ' ');
    const cleanTags = card.tags.join(' ');
    return `${cleanFront}\t${cleanBack}\t${cleanTags}`;
  });

  return header + rows.join('\n');
}

/**
 * Triggers a client-side file download for the Anki export file.
 */
export function downloadAnkiDeck(filename: string, content: string): void {
  const blob = new Blob([content], { type: 'text/tab-separated-values;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename.endsWith('.txt') ? filename : `${filename}.txt`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
