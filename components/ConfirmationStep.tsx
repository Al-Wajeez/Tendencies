import React from 'react';
import { Button } from 'react-bootstrap';
import { Question } from '../types/quiz';

interface ConfirmationStepProps {
  onNewAttempt: () => void;
  questions: Question[];
  onAnalyze: () => void;
  onExport: () => void;
}

export const ConfirmationStep: React.FC<ConfirmationStepProps> = ({ onNewAttempt, questions, onAnalyze, onExport }) => {
  return (
    <div className="container mt-5">
      <div className="quiz-card p-4 text-center animate-fade-in">
        <h2 className="h3 mb-4 text-primary">تم إكمال الاستبيان</h2>
        <p className="lead mb-4">ماذا تريد أن تفعل الآن؟</p>
        <div className="d-flex justify-content-center">
          <Button 
            variant="primary" 
            className="me-3 quiz-button" 
            onClick={onNewAttempt}
            style={{ backgroundColor: '#1ab69d', borderColor: '#1ab69d' }}
          >
            محاولة جديدة
          </Button>
          <Button 
            variant="primary" 
            className="me-3 quiz-button" 
            onClick={onExport}
            style={{ backgroundColor: '#1ab69d', borderColor: '#1ab69d' }}
          >
            تصدير النتائج
          </Button>
          <Button 
            variant="primary" 
            className="quiz-button" 
            onClick={onAnalyze}
            style={{ backgroundColor: '#1ab69d', borderColor: '#1ab69d' }}
          >
            تحليل البيانات
          </Button>
        </div>
      </div>
    </div>
  );
};

