import { describe, it, expect } from 'vitest';
import { generateResultReport } from '../resultExporter';
import type { BatteryScore } from '../evaluator';
import type { CTestPassage } from '../cTestEngine';

describe('Result Exporter', () => {
  it('generates a well-formatted C-Test evaluation report', () => {
    const mockScore: BatteryScore = {
      totalGaps: 4,
      correctGaps: 3,
      percentage: 75,
      cefrLevel: 'C1',
      cefrTitle: 'Effective Operational Proficiency',
      passageScores: [
        {
          passageId: 'p1',
          totalGaps: 4,
          correctGaps: 3,
          percentage: 75,
          evaluations: [
            {
              gapId: 'gap-0',
              gapIndex: 0,
              userAnswer: 'ildhood',
              expectedSuffix: 'ildhood',
              fullWord: 'childhood',
              prefix: 'ch',
              isCorrect: true,
              sentenceIndex: 1,
            },
            {
              gapId: 'gap-1',
              gapIndex: 1,
              userAnswer: 'tre',
              expectedSuffix: 'tre',
              fullWord: 'centre',
              prefix: 'cen',
              isCorrect: true,
              sentenceIndex: 1,
            },
            {
              gapId: 'gap-2',
              gapIndex: 2,
              userAnswer: 'wrong',
              expectedSuffix: 'al',
              fullWord: 'parental',
              prefix: 'parent',
              isCorrect: false,
              sentenceIndex: 2,
            },
            {
              gapId: 'gap-3',
              gapIndex: 3,
              userAnswer: 'ces',
              expectedSuffix: 'ces',
              fullWord: 'resources',
              prefix: 'resour',
              isCorrect: true,
              sentenceIndex: 2,
            },
          ],
        },
      ],
    };

    const mockPassages: CTestPassage[] = [
      {
        id: 'p1',
        title: 'Only children',
        rawText: 'The prevalence of single-child families is a growing demographic trend.',
        sentences: [],
        gaps: [],
        totalGaps: 4,
      },
    ];

    const report = generateResultReport(
      mockScore,
      mockPassages,
      'Battery 10: UAB Set 3 — Family, Media & Festivals'
    );

    expect(report).toContain('C-TEST EVALUATION REPORT');
    expect(report).toContain('Battery 10: UAB Set 3 — Family, Media & Festivals');
    expect(report).toContain('Total Score:           3 / 4 (75%)');
    expect(report).toContain('CEFR Benchmark:        C1 (Effective Operational Proficiency)');
    expect(report).toContain('[1. Full Original Reading Text]');
    expect(report).toContain('The prevalence of single-child families');
    expect(report).toContain('[2. Passage with Your Answers & Annotations]');
    expect(report).toContain('[3. Itemized Gap Breakdown]');
    expect(report).toContain('[✓ CORRECT]');
    expect(report).toContain('[✗ MISSED ]');
    expect(report).toContain('Expected: "parental"');
  });
});
