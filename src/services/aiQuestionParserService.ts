import * as XLSX from 'xlsx';
import type { MockQuestion } from './mockTestService';

export interface ParseResult {
  questions: MockQuestion[];
  warnings: string[];
  totalDetected: number;
}

export const GEMINI_PROMPT_TEMPLATE = `Please create 10 high-yield multiple-choice questions (MCQs) for UGC NET Paper 1 / Research Methodology for Dr. Ankita Bisht Academy in the EXACT format shown below:

Q1. [Full Question Text]
A) [First Option]
B) [Second Option]
C) [Third Option]
D) [Fourth Option]
Correct Answer: [A, B, C, or D]
Step-by-Step Solution & Conceptual Rationale: [Detailed concept explanation, why the option is correct, and key takeaway by Dr. Ankita Bisht]
Subject: [e.g. Teaching Aptitude / Research Methodology / ICT / Higher Education]
Topic: [Specific syllabus topic]

---

Ensure each question has exactly 4 options, a clearly marked correct answer (A, B, C, or D), and an in-depth step-by-step solution.`;

/**
 * Parses raw text copied from Gemini, ChatGPT, Claude, Word, or PDF.
 */
export function parseQuestionsFromText(rawText: string): ParseResult {
  const warnings: string[] = [];
  const questions: MockQuestion[] = [];

  const text = rawText.trim();
  if (!text) {
    return { questions: [], warnings: ['Input text is empty.'], totalDetected: 0 };
  }

  // 1. Try parsing as JSON first
  if (text.startsWith('[') || text.startsWith('{')) {
    try {
      const parsed = JSON.parse(text);
      const items = Array.isArray(parsed) ? parsed : (parsed.questions || parsed.data || [parsed]);
      
      items.forEach((item: any, idx: number) => {
        const qText = item.question || item.questionText || item.q || item.title || '';
        if (!qText) return;

        let options: string[] = [];
        if (Array.isArray(item.options)) {
          options = item.options.map(String);
        } else {
          options = [
            item.optionA || item.option_a || item.a || item.A || '',
            item.optionB || item.option_b || item.b || item.B || '',
            item.optionC || item.option_c || item.c || item.C || '',
            item.optionD || item.option_d || item.d || item.D || ''
          ].filter(Boolean);
        }

        let correctIndex = 0;
        const rawAns = String(item.correctAnswer || item.answer || item.correctIndex || item.correct || 'A').toUpperCase().trim();
        if (['A', '0'].includes(rawAns)) correctIndex = 0;
        else if (['B', '1'].includes(rawAns)) correctIndex = 1;
        else if (['C', '2'].includes(rawAns)) correctIndex = 2;
        else if (['D', '3'].includes(rawAns)) correctIndex = 3;

        const explanation = item.explanation || item.solution || item.rationale || item['Step-by-Step Solution & Conceptual Rationale'] || '';
        const subject = item.subject || 'UGC NET Paper 1';
        const topic = item.topic || 'General Aptitude';

        questions.push({
          id: `q-ai-${Date.now()}-${idx + 1}`,
          question: qText.trim(),
          options: options.length >= 2 ? options.slice(0, 4) : ['Option A', 'Option B', 'Option C', 'Option D'],
          correctIndex,
          explanation: explanation.trim() || 'Conceptual rationale provided by Dr. Ankita Bisht Academy.',
          subject,
          topic,
          marks: 2
        });
      });

      if (questions.length > 0) {
        return { questions, warnings, totalDetected: questions.length };
      }
    } catch {
      // If JSON parse fails, fall through to text regex parser
    }
  }

  // 2. Intelligent Regex & Chunk Parser for Conversational Text (Gemini / Claude / ChatGPT)
  const normalized = text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n');

  // Split into question blocks based on question numbering patterns:
  const questionSplitRegex = /(?:^|\n+)(?=(?:Q(?:uestion)?\s*\d+[:.)\-]|(?:\*\*)?(?:Q(?:uestion)?\s*)?\d+[:.)\-](?:\*\*)?))\s*/i;
  const rawBlocks = normalized.split(questionSplitRegex).map(b => b.trim()).filter(Boolean);

  rawBlocks.forEach((block, bIdx) => {
    if (block.length < 15) return;

    const lines = block.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length === 0) return;

    let questionText = '';
    const options: string[] = [];
    let correctIndex = 0;
    let explanation = '';
    let subject = 'UGC NET Paper 1';
    let topic = 'General Aptitude';

    let foundOptions = false;
    let foundExplanation = false;
    const explanationLines: string[] = [];

    // Parse line by line
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Check for Correct Answer line
      const ansMatch = line.match(/(?:Correct(?:\s*Answer|\s*Option)?|Ans(?:wer)?|Key)\s*[:=\-]\s*(?:\*\*)?\(?([A-D1-4])\)?(?:\*\*)?/i);
      if (ansMatch) {
        const val = ansMatch[1].toUpperCase();
        if (val === 'A' || val === '1') correctIndex = 0;
        else if (val === 'B' || val === '2') correctIndex = 1;
        else if (val === 'C' || val === '3') correctIndex = 2;
        else if (val === 'D' || val === '4') correctIndex = 3;
        continue;
      }

      // Check for Explanation / Rationale line
      const expMatch = line.match(/(?:Step-by-Step\s*Solution\s*&?\s*Conceptual\s*Rationale|Explanation|Solution|Rationale|Concept\s*Breakdown|Vyakhya)\s*[:=\-]\s*(.*)/i);
      if (expMatch) {
        foundExplanation = true;
        if (expMatch[1] && expMatch[1].trim()) {
          explanationLines.push(expMatch[1].trim());
        }
        continue;
      }

      // Check for Subject / Topic line
      const subjMatch = line.match(/^Subject\s*[:=\-]\s*(.*)/i);
      if (subjMatch) {
        subject = subjMatch[1].trim();
        continue;
      }
      const topicMatch = line.match(/^Topic\s*[:=\-]\s*(.*)/i);
      if (topicMatch) {
        topic = topicMatch[1].trim();
        continue;
      }

      if (foundExplanation) {
        explanationLines.push(line);
        continue;
      }

      // Check for Option line
      const optMatch = line.match(/^(?:(?:\*|-)\s*)?(?:\*\*)?\(?([A-D1-4])\)?(?:\.|\)|:|-)?(?:\*\*)?\s+(.*)/i);
      if (optMatch && (!foundOptions || options.length < 4)) {
        foundOptions = true;
        const optText = optMatch[2].replace(/^\*\*/, '').replace(/\*\*$/, '').trim();
        options.push(optText);
        continue;
      }

      // If options not found yet, it's question text
      if (!foundOptions) {
        if (questionText) questionText += ' ' + line;
        else questionText = line;
      }
    }

    explanation = explanationLines.join(' ').replace(/^[*_]+|[*_]+$/g, '').trim();

    // Clean leading question numbering
    const cleanedQuestion = questionText
      .replace(/^(?:\*\*)?Q(?:uestion)?\s*\d+[:.)\-]?\s*(?:\*\*)?/i, '')
      .replace(/^(?:\*\*)?\d+[:.)\-]\s*(?:\*\*)?/, '')
      .trim();

    if (!cleanedQuestion) return;

    if (options.length < 4) {
      warnings.push(`Question #${bIdx + 1} has only ${options.length} options. Default placeholders filled.`);
      while (options.length < 4) {
        options.push(`Option ${String.fromCharCode(65 + options.length)}`);
      }
    }

    questions.push({
      id: `q-ai-${Date.now().toString().slice(-6)}-${bIdx + 1}`,
      question: cleanedQuestion,
      options: options.slice(0, 4),
      correctIndex: Math.min(Math.max(correctIndex, 0), 3),
      explanation: explanation || 'Step-by-step conceptual rationale and logic verified by Dr. Ankita Bisht.',
      subject,
      topic,
      marks: 2
    });
  });

  return {
    questions,
    warnings,
    totalDetected: questions.length
  };
}

/**
 * Parses an Excel (.xlsx/.xls) or CSV (.csv) ArrayBuffer or file.
 */
export function parseQuestionsFromSpreadsheet(data: ArrayBuffer | Uint8Array): ParseResult {
  const warnings: string[] = [];
  const questions: MockQuestion[] = [];

  try {
    const workbook = XLSX.read(data, { type: 'array' });
    if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
      return { questions: [], warnings: ['Spreadsheet contains no sheets.'], totalDetected: 0 };
    }

    const firstSheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[firstSheetName];
    const rows: any[] = XLSX.utils.sheet_to_json(sheet, { defval: '' });

    if (!rows || rows.length === 0) {
      return { questions: [], warnings: ['Spreadsheet contains no data rows.'], totalDetected: 0 };
    }

    rows.forEach((row, idx) => {
      const keys = Object.keys(row);
      
      const findVal = (regex: RegExp): string => {
        const matchKey = keys.find(k => regex.test(k.trim()));
        return matchKey ? String(row[matchKey]).trim() : '';
      };

      const qText = findVal(/question|sawal|prashna|q_text|^q$/i);
      if (!qText) return;

      const optA = findVal(/opt(?:ion)?\s*a|^a$/i);
      const optB = findVal(/opt(?:ion)?\s*b|^b$/i);
      const optC = findVal(/opt(?:ion)?\s*c|^c$/i);
      const optD = findVal(/opt(?:ion)?\s*d|^d$/i);

      const options = [optA, optB, optC, optD].filter(Boolean);
      while (options.length < 4) {
        options.push(`Option ${String.fromCharCode(65 + options.length)}`);
      }

      // Parse correct answer
      let correctIndex = 0;
      const rawAns = findVal(/correct|answer|ans|key|right/i).toUpperCase();
      if (rawAns.includes('A') || rawAns === '1' || rawAns === '0') correctIndex = 0;
      else if (rawAns.includes('B') || rawAns === '2') correctIndex = 1;
      else if (rawAns.includes('C') || rawAns === '3') correctIndex = 2;
      else if (rawAns.includes('D') || rawAns === '4') correctIndex = 3;

      const explanation = findVal(/explanation|solution|rationale|detail|vyakhya|concept/i);
      const subject = findVal(/subject|stream|category/i) || 'UGC NET Paper 1';
      const topic = findVal(/topic|unit|chapter/i) || 'General Aptitude';

      questions.push({
        id: `q-xl-${Date.now().toString().slice(-6)}-${idx + 1}`,
        question: qText,
        options: options.slice(0, 4),
        correctIndex,
        explanation: explanation || 'Step-by-step conceptual rationale by Dr. Ankita Bisht.',
        subject,
        topic,
        marks: 2
      });
    });

  } catch (err: any) {
    warnings.push(`Spreadsheet parse error: ${err?.message || 'Invalid file format'}`);
  }

  return {
    questions,
    warnings,
    totalDetected: questions.length
  };
}

/**
 * Generates and triggers download of a standardized Excel template for Dr. Ankita.
 */
export function downloadSampleExcelTemplate(): void {
  const sampleData = [
    {
      'Question': 'Which of the following levels of teaching emphasizes on understanding relations, seeing patterns, and grasping meaning rather than rote memorization?',
      'Option A': 'Memory Level (Herbartian Theory)',
      'Option B': 'Understanding Level (Morrison Theory)',
      'Option C': 'Reflective Level (Hunt Theory)',
      'Option D': 'Autonomous Development Level',
      'Correct Answer (A/B/C/D)': 'B',
      'Step-by-Step Solution & Conceptual Rationale': 'The Understanding Level of teaching propounded by H.C. Morrison focuses on the mastery of subject matter, exploring relationships, facts, and grasping generalizations rather than mere recall.',
      'Subject': 'Teaching Aptitude',
      'Topic': 'Levels of Teaching'
    },
    {
      'Question': 'In statistical research hypothesis testing, if the calculated p-value (Sig. 2-tailed) is 0.018 for an alpha level of 0.05, what is the appropriate research decision?',
      'Option A': 'Accept the Null Hypothesis (H0)',
      'Option B': 'Reject the Null Hypothesis (H0) and accept Alternate Hypothesis (H1)',
      'Option C': 'Increase the sample size and repeat calculation',
      'Option D': 'Data is insufficient for hypothesis decision',
      'Correct Answer (A/B/C/D)': 'B',
      'Step-by-Step Solution & Conceptual Rationale': 'Decision Rule: When p-value < 0.05 (here 0.018 < 0.05), we reject the Null Hypothesis (H0) and conclude a statistically significant difference exists between experimental groups.',
      'Subject': 'Research Methodology',
      'Topic': 'Hypothesis Testing & Data Analysis'
    },
    {
      'Question': 'According to the Classical Square of Opposition, if statement "All Philosophers are Thinkers" (A) is given as TRUE, what is the truth value of "Some Philosophers are not Thinkers" (O)?',
      'Option A': 'True',
      'Option B': 'False',
      'Option C': 'Undetermined / Doubtful',
      'Option D': 'Contrarily True',
      'Correct Answer (A/B/C/D)': 'B',
      'Step-by-Step Solution & Conceptual Rationale': 'A (Universal Affirmative) and O (Particular Negative) are Contradictory propositions. If A is True, then O must be definitively FALSE.',
      'Subject': 'Logical Reasoning',
      'Topic': 'Classical Square of Opposition'
    }
  ];

  const ws = XLSX.utils.json_to_sheet(sampleData);
  
  ws['!cols'] = [
    { wch: 45 },
    { wch: 25 },
    { wch: 25 },
    { wch: 25 },
    { wch: 25 },
    { wch: 15 },
    { wch: 50 },
    { wch: 20 },
    { wch: 25 }
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Mock_Test_Questions');
  XLSX.writeFile(wb, 'Dr_Ankita_Mock_Test_Questions_Template.xlsx');
}
