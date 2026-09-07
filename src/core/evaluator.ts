import type { CTestPassage, GapToken } from './cTestEngine';

export interface GapEvaluation {
  gapId: string;
  gapIndex: number;
  userAnswer: string;
  expectedSuffix: string;
  fullWord: string;
  prefix: string;
  isCorrect: boolean;
  sentenceIndex: number;
}

export interface PassageScore {
  passageId: string;
  totalGaps: number;
  correctGaps: number;
  percentage: number;
  evaluations: GapEvaluation[];
}

export interface BatteryScore {
  totalGaps: number;
  correctGaps: number;
  percentage: number;
  cefrLevel: 'C2' | 'C1' | 'B2' | 'B1' | 'Below B1';
  cefrTitle: string;
  passageScores: PassageScore[];
}

export function evaluateGap(userAnswer: string, gap: GapToken): boolean {
  const cleanUser = userAnswer.trim().toLowerCase();
  const cleanExpected = gap.suffix.trim().toLowerCase();
  return cleanUser === cleanExpected;
}

export function evaluatePassage(
  passage: CTestPassage,
  userAnswers: Record<string, string>
): PassageScore {
  const evaluations: GapEvaluation[] = passage.gaps.map((gap) => {
    const userVal = userAnswers[gap.id] || '';
    const isCorrect = evaluateGap(userVal, gap);

    return {
      gapId: gap.id,
      gapIndex: gap.gapIndex,
      userAnswer: userVal,
      expectedSuffix: gap.suffix,
      fullWord: gap.fullWord,
      prefix: gap.prefix,
      isCorrect,
      sentenceIndex: gap.sentenceIndex,
    };
  });

  const correctGaps = evaluations.filter((e) => e.isCorrect).length;
  const totalGaps = evaluations.length;
  const percentage = totalGaps > 0 ? Math.round((correctGaps / totalGaps) * 100) : 0;

  return {
    passageId: passage.id,
    totalGaps,
    correctGaps,
    percentage,
    evaluations,
  };
}

export function evaluateBattery(
  passages: CTestPassage[],
  allAnswers: Record<string, Record<string, string>>
): BatteryScore {
  const passageScores = passages.map((passage) =>
    evaluatePassage(passage, allAnswers[passage.id] || {})
  );

  const totalGaps = passageScores.reduce((acc, p) => acc + p.totalGaps, 0);
  const correctGaps = passageScores.reduce((acc, p) => acc + p.correctGaps, 0);
  const percentage = totalGaps > 0 ? Math.round((correctGaps / totalGaps) * 100) : 0;

  let cefrLevel: BatteryScore['cefrLevel'] = 'Below B1';
  let cefrTitle = 'Foundational English';

  if (percentage >= 85) {
    cefrLevel = 'C2';
    cefrTitle = 'C2 Mastery (Proficient Academic/Native Level)';
  } else if (percentage >= 70) {
    cefrLevel = 'C1';
    cefrTitle = 'C1 Advanced (Effective Operational Proficiency)';
  } else if (percentage >= 55) {
    cefrLevel = 'B2';
    cefrTitle = 'B2 Vantage (Upper Intermediate)';
  } else if (percentage >= 40) {
    cefrLevel = 'B1';
    cefrTitle = 'B1 Threshold (Intermediate)';
  }

  return {
    totalGaps,
    correctGaps,
    percentage,
    cefrLevel,
    cefrTitle,
    passageScores,
  };
}
