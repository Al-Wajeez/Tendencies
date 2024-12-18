import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Button, Modal, Alert } from 'react-bootstrap';
import { FaStop, FaFileImport, FaPlay, FaChartBar, FaList, FaTrashAlt, FaFileExport } from 'react-icons/fa';
import { Question } from './Question';
import { ConfirmationStep } from './ConfirmationStep';
import DataAnalysis from './DataAnalysis';
import ResponsesTable from './ResponsesTable';
import { QuizProps, QuizState } from '../types/quiz';
import { saveQuizState, loadQuizStates, deleteQuizState, clearQuizStates, importQuizStates } from '../utils/localStorage';
import { exportData } from '../utils/excelExport';

export const Quiz: React.FC<QuizProps> = ({ questions }) => {
  const [quizState, setQuizState] = useState<QuizState>(() => {
    const initialState = {
      currentQuestionIndex: 0,
      answers: {},
      attemptId: uuidv4(),
      attemptNumber: 1,
      startTime: Date.now(),
    };
    loadQuizStates()
      .then(savedStates => {
        if (savedStates.length > 0) {
          setQuizState({
            ...initialState,
            attemptNumber: savedStates[savedStates.length - 1].attemptNumber + 1,
          });
        }
      })
      .catch(error => {
        console.error('Failed to load initial quiz state:', error);
        setError('Failed to load initial quiz state. Please try again.');
      });
    return initialState;
  });

  const [isCompleted, setIsCompleted] = useState(false);
  const [fadeIn, setFadeIn] = useState(true);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showResponses, setShowResponses] = useState(false);
  const [showStartOptions, setShowStartOptions] = useState(true);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [importedData, setImportedData] = useState<QuizState[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentQuestion = questions[quizState.currentQuestionIndex];

  const handleAnswerChange = (questionId: string, answer: any) => {
    setQuizState(prevState => ({
      ...prevState,
      answers: {
        ...prevState.answers,
        [questionId]: answer,
      },
    }));
  };

  const handleNavigation = (direction: 'prev' | 'next') => {
    setFadeIn(false);
    setTimeout(() => {
      setQuizState(prevState => ({
        ...prevState,
        currentQuestionIndex: direction === 'next'
          ? Math.min(prevState.currentQuestionIndex + 1, questions.length - 1)
          : Math.max(prevState.currentQuestionIndex - 1, 0),
      }));
      setFadeIn(true);
    }, 300);
  };

  const handleNewAttempt = () => {
    setQuizState({
      currentQuestionIndex: 0,
      answers: {},
      attemptId: uuidv4(),
      attemptNumber: quizState.attemptNumber + 1,
      startTime: Date.now(),
    });
    setIsCompleted(false);
    setShowStartOptions(false);
    setShowResponses(false);
  };

  const handleOpenExportModal = () => {
    setShowExportModal(true);
  };

  const handleExport = async (format: 'xlsx' | 'json') => {
    setIsLoading(true);
    setError(null);
    try {
      const allStates = await loadQuizStates();
      if (allStates.length === 0) {
        setError('No quiz states available for export. Please complete at least one quiz attempt.');
      } else {
        exportData(questions, allStates, format);
        alert(`تم تصدير نتائج الاستبيان بنجاح بتنسيق ${format.toUpperCase()}.`);
      }
    } catch (error) {
      console.error('Error exporting data:', error);
      setError(`Failed to export results: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
      setShowExportModal(false);
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await saveQuizState(quizState);
      setIsCompleted(true);
    } catch (err) {
      setError('Failed to save quiz state. Please try again.');
      console.error('Error saving quiz state:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalyze = async () => {
    try {
      const savedStates = await loadQuizStates();
      setShowAnalysis(true);
      setShowStartOptions(false);
    } catch (error) {
      console.error('Error loading quiz states for analysis:', error);
      setError('Failed to load quiz states for analysis. Please try again.');
    }
  };

  const handleShowResponses = async () => {
    try {
      const savedStates = await loadQuizStates();
      setShowResponses(true);
      setShowStartOptions(false);
    } catch (error) {
      console.error('Error loading quiz states for responses:', error);
      setError('Failed to load quiz states for responses. Please try again.');
    }
  };

  const handleUpdateResponse = async (updatedState: QuizState) => {
    try {
      await saveQuizState(updatedState);
      const savedStates = await loadQuizStates();
      setQuizState(prevState => ({
        ...prevState,
        attemptNumber: savedStates.length + 1,
      }));
    } catch (error) {
      console.error('Error updating response:', error);
      setError('Failed to update response. Please try again.');
    }
  };

  const handleDeleteResponse = async (attemptId: string) => {
    try {
      await deleteQuizState(attemptId);
      const savedStates = await loadQuizStates();
      setQuizState(prevState => ({
        ...prevState,
        attemptNumber: savedStates.length + 1,
      }));
    } catch (error) {
      console.error('Error deleting response:', error);
      setError('Failed to delete response. Please try again.');
    }
  };

  const handleDeleteAll = () => {
    setShowDeleteConfirmation(true);
  };

  const confirmDeleteAll = async () => {
    try {
      await clearQuizStates();
      setQuizState({
        currentQuestionIndex: 0,
        answers: {},
        attemptId: uuidv4(),
        attemptNumber: 1,
        startTime: Date.now(),
      });
      setShowDeleteConfirmation(false);
      setShowStartOptions(true);
    } catch (error) {
      console.error('Error clearing all quiz states:', error);
      setError('Failed to clear all data. Please try again.');
    }
  };

  const handleCancelQuiz = () => {
    setQuizState({
      currentQuestionIndex: 0,
      answers: {},
      attemptId: uuidv4(),
      attemptNumber: quizState.attemptNumber,
      startTime: Date.now(),
    });
    setShowStartOptions(true);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const importedStates = JSON.parse(e.target?.result as string);
          await importQuizStates(importedStates);
          setImportedData(importedStates);
          setShowImportModal(true);
        } catch (error) {
          console.error('Error importing data:', error);
          setError('Failed to import data. Please check the file and try again.');
        }
      };
      reader.readAsText(file);
    }
  };

  const progress = ((quizState.currentQuestionIndex + 1) / questions.length) * 100;

  if (showAnalysis) {
    return (
      <DataAnalysis
        questions={questions}
        quizStates={[]}
        onBack={() => setShowAnalysis(false)}
        loadQuizStates={loadQuizStates}
      />
    );
  }

  if (showResponses) {
    return (
      <ResponsesTable
        questions={questions}
        quizStates={[]}
        onBack={() => {
          setShowResponses(false);
          setShowStartOptions(true);
        }}
        onUpdate={handleUpdateResponse}
        onDelete={handleDeleteResponse}
        onNewAttempt={handleNewAttempt}
        loadQuizStates={loadQuizStates}
      />
    );
  }

  if (isCompleted) {
    return (
      <ConfirmationStep
        onNewAttempt={handleNewAttempt}
        questions={questions}
        onAnalyze={handleAnalyze}
        onExport={handleOpenExportModal}
      />
    );
  }

  if (showStartOptions) {
    return (
      <div className="container mt-5 animate-fade-in">
        <h1 className="text-center mb-4">نظام الاستبيان</h1>
        <div className="d-flex justify-content-center flex-wrap">
          <Button 
            variant="primary" 
            className="btn me-3 mb-3" 
            onClick={handleNewAttempt} 
            disabled={isLoading}
          >
            {isLoading ? 'جاري التحميل...' : 'بدء استبيان جديد'}
            <FaPlay className="me-2" />
          </Button>
          <Button 
            variant="primary" 
            className="btn me-3 mb-3" 
            onClick={handleOpenExportModal}
            disabled={isLoading}
          >
            {isLoading ? 'جاري التصدير...' : 'تصدير البيانات'}
            <FaFileExport className="me-2" />
          </Button>
          <Button 
            variant="primary" 
            className="btn me-3 mb-3" 
            onClick={handleAnalyze}
          >
            تحليل البيانات
            <FaChartBar className="me-2" />
          </Button>
          <Button 
            variant="primary" 
            className="btn me-3 mb-3" 
            onClick={handleShowResponses}
          >
            عرض الاستجابات
            <FaList className="me-2" />
          </Button>
          <Button 
            variant="primary" 
            className="btn me-3 mb-3" 
            onClick={handleDeleteAll}
          >
            حذف البيانات
            <FaTrashAlt className="me-2" />
          </Button>
          <label htmlFor="import-file" className="btn btn-primary me-3 mb-3">
            استيراد البيانات
            <FaFileImport className="me-2" />
            <input
              type="file"
              id="import-file"
              className="d-none"
              accept=".json"
              onChange={handleImport}
            />
          </label>
        </div>

        {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

        <Modal show={showDeleteConfirmation} onHide={() => setShowDeleteConfirmation(false)}>
          <Modal.Header closeButton>
            <Modal.Title>تأكيد الحذف</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            هل أنت متأكد أنك تريد حذف جميع البيانات؟ هذا الإجراء لا يمكن التراجع عنه.
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDeleteConfirmation(false)}>
              إلغاء
            </Button>
            <Button variant="primary" onClick={confirmDeleteAll}>
              حذف الكل
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showImportModal} onHide={() => setShowImportModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>البيانات المستوردة</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>رقم المحاولة</th>
                  <th>وقت البدء</th>
                  <th>عدد الإجابات</th>
                </tr>
              </thead>
              <tbody>
                {importedData.map((state) => (
                  <tr key={state.attemptId}>
                    <td>{state.attemptNumber}</td>
                    <td>{new Date(state.startTime).toLocaleString()}</td>
                    <td>{Object.keys(state.answers).length}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowImportModal(false)}>
              إغلاق
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showExportModal} onHide={() => setShowExportModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>تصدير البيانات</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>اختر تنسيق التصدير:</p>
            <div className="d-flex justify-content-center">
              <Button
                variant="primary"
                className="me-3"
                onClick={() => handleExport('xlsx')}
                style={{ backgroundColor: '#1ab69d', borderColor: '#1ab69d' }}
              >
                تصدير كملف Excel
              </Button>
              <Button
                variant="primary"
                onClick={() => handleExport('json')}
                style={{ backgroundColor: '#1ab69d', borderColor: '#1ab69d' }}
              >
                تصدير كملف JSONتصدير كملف JSON
              </Button>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="quiz-card p-4 animate-fade-in">
        <h1 className="text-center mb-4">نظام الاستبيان</h1>
        <div className="progress mb-4" style={{ height: '5px' }}>
          <div
            className="progress-bar"
            role="progressbar"
            style={{ width: `${progress}%` }}
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          ></div>
        </div>
        <p className="text-center mb-4">
          السؤال {quizState.currentQuestionIndex + 1} من {questions.length}
        </p>
        <div className={`transition-opacity duration-300 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
          <Question
            question={currentQuestion}
            answer={quizState.answers[currentQuestion.id]}
            onAnswerChange={(answer) => handleAnswerChange(currentQuestion.id, answer)}
          />
        </div>
        <div className="d-flex justify-content-between mt-4">
          <Button
            variant="primary"
            onClick={() => handleNavigation('prev')}
            disabled={quizState.currentQuestionIndex === 0}
          >
            السابق
            <i className="bi bi-arrow-right me-2"></i>
          </Button>
          <Button
            variant="primary"
            onClick={() => handleNavigation('next')}
            disabled={quizState.currentQuestionIndex === questions.length - 1}
          >
            التالي
            <i className="bi bi-arrow-left ms-2"></i>
          </Button>
        </div>
        {quizState.currentQuestionIndex === questions.length - 1 && (
          <Button
            variant="primary"
            onClick={handleComplete}
            className="w-100 mt-4"
            disabled={isLoading}
          >
            {isLoading ? 'جاري الحفظ...' : 'تأكيد الإجابات'}
          </Button>
        )}
        <Button
          variant="secondary"
          onClick={handleCancelQuiz}
          className="w-100 mt-4"
        >
          إلغاء الاستبيان
          <FaStop className="me-2" />
        </Button>
        <p className="text-center mt-4">
          المحاولة رقم {quizState.attemptNumber} | الرقم التعريفي: {quizState.attemptId}
        </p>
        {isLoading && <div className="text-center mt-4">جاري التحميل...</div>}
        {error && <Alert variant="danger" className="mt-4">{error}</Alert>}
      </div>
    </div>
  );
};

export default Quiz;

