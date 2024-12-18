import * as XLSX from 'xlsx';
import { Question, QuizState } from '../types/quiz';

export const exportData = (questions: Question[], quizStates: QuizState[], format: 'xlsx' | 'json'): void => {
  if (!Array.isArray(questions) || questions.length === 0) {
    throw new Error('No questions provided for export');
  }

  if (!Array.isArray(quizStates) || quizStates.length === 0) {
    throw new Error('No quiz states available for export');
  }

  if (format === 'xlsx') {
    exportToExcel(questions, quizStates);
  } else if (format === 'json') {
    exportToJSON(quizStates);
  } else {
    throw new Error('Invalid export format');
  }
};

const exportToExcel = (questions: Question[], quizStates: QuizState[]): void => {
  const workbook = XLSX.utils.book_new();

  // Create headers array with all questions
  const headers = [
    'Attempt ID',
    'Attempt Number', 
    'Start Time',
    ...questions.map(q => q.text)
  ];

  // Create data rows for each completed attempt
  const rows = quizStates.map(state => {
    return [
      state.attemptId,
      state.attemptNumber,
      new Date(state.startTime).toISOString(),
      ...questions.map(q => {
        const answer = state.answers[q.id];
        if (Array.isArray(answer?.value)) {
          return answer.value.join(', ');
        } else if (typeof answer?.value === 'object' && answer?.value !== null) {
          return JSON.stringify(answer.value);
        } else {
          return answer?.value?.toString() || '';
        }
      })
    ];
  });

  // Combine headers and rows
  const wsData = [headers, ...rows];

  // Create worksheet and append to workbook
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  XLSX.utils.book_append_sheet(workbook, ws, 'Quiz Results');

  // Generate a Blob containing the Excel file
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

  // Create a download link and trigger the download
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'quiz_results.xlsx';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const exportToJSON = (quizStates: QuizState[]): void => {
  const jsonString = JSON.stringify(quizStates, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'quiz_results.json';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

