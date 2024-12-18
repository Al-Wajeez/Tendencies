import React from 'react';
import Select from 'react-select';
import { Question as QuestionType } from '../types/quiz';

interface QuestionProps {
  question: QuestionType;
  answer: any;
  onAnswerChange: (answer: any) => void;
}

export const Question: React.FC<QuestionProps> = ({ question, answer, onAnswerChange }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onAnswerChange({ ...answer, value: e.target.value });
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onAnswerChange({ ...answer, value: Number(e.target.value) });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onAnswerChange({ ...answer, value: e.target.value });
  };

  const handleMultiselectChange = (selectedOptions: any) => {
    onAnswerChange({ ...answer, value: selectedOptions.map((option: any) => option.value) });
  };

  const handleSubQuestionChange = (subAnswer: any) => {
    onAnswerChange({ ...answer, subQuestion: subAnswer });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onAnswerChange({ ...answer, value: e.target.value });
  };

  const renderInput = () => {
    switch (question.type) {
      case 'text':
        return <input type="text" className="form-control" value={answer?.value || ''} onChange={handleInputChange} />;
      case 'date':
        return <input type="date" className="form-control" value={answer?.value || ''} onChange={handleDateChange} />;
      case 'number':
        return <input type="number" className="form-control" value={answer?.value || ''} onChange={handleNumberChange} />;
      case 'dropdown':
        return (
          <select className="form-select" value={answer?.value || ''} onChange={handleSelectChange}>
            <option value="">اختر إجابة</option>
            {question.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case 'multiselect':
        return (
          <Select
            isMulti
            options={question.options?.map(option => ({ value: option.value, label: option.label }))}
            value={(answer?.value || []).map((v: string) => ({ value: v, label: question.options?.find(o => o.value === v)?.label || v }))}
            onChange={handleMultiselectChange}
            className="basic-multi-select"
            classNamePrefix="select"
            placeholder="اختر إجابة أو أكثر"
          />
        );
      case 'group':
        return (
          <div className="mb-4">
            {question.subQuestions?.map((subQuestion: QuestionType) => (
              <div key={subQuestion.id} className="mb-3">
                <label className="form-label">{subQuestion.text}</label>
                <Question
                  question={subQuestion}
                  answer={answer?.[subQuestion.id]}
                  onAnswerChange={(subAnswer) => {
                    const updatedAnswer = { ...answer, [subQuestion.id]: subAnswer };
                    onAnswerChange(updatedAnswer);
                  }}
                />
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };


  return (
    <div className="mb-4 animate-slide-in">
      <h2 className="h5 mb-3 text-primary">{question.text}</h2>
      {renderInput()}
      {question.subQuestion && (
        <div className="mt-3 ps-4 border-start border-primary">
          <Question
            question={question.subQuestion}
            answer={answer?.subQuestion}
            onAnswerChange={handleSubQuestionChange}
          />
        </div>
      )}
    </div>
  );
};

