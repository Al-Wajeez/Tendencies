import React, { useState, useEffect } from 'react';
import { Question, QuizState } from '../types/quiz';
import { Modal, Button, Toast } from 'react-bootstrap';
import Plot from 'react-plotly.js';
import { FaPrint, FaFileExport, FaChartBar } from 'react-icons/fa';

interface DataAnalysisProps {
  questions: Question[];
  quizStates: QuizState[];
  onBack: () => void;
  loadQuizStates: () => Promise<QuizState[]>;
}

interface AnalysisResult {
  [key: string]: {
    counts: { [key: string]: number };
    percentages: { [key: string]: number };
    total: number;
  };
}

const DataAnalysis: React.FC<DataAnalysisProps> = ({ questions, quizStates: initialQuizStates, onBack, loadQuizStates }) => {
  const [quizStates, setQuizStates] = useState<QuizState[]>(initialQuizStates);
  const [showModal, setShowModal] = useState(false);
  const [currentChart, setCurrentChart] = useState<{ question: string; data: any } | null>(null);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'warning' | 'error' }>({
    show: false,
    message: '',
    type: 'success',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuizStates = async () => {
      try {
        const states = await loadQuizStates();
        setQuizStates(states);
      } catch (error) {
        console.error('Error loading quiz states:', error);
        setError('Failed to load quiz states. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuizStates();
  }, [loadQuizStates]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const analyzeData = (): AnalysisResult => {
    const result: AnalysisResult = {};

    questions.forEach(question => {
      if (['text', 'date'].includes(question.type)) return;

      result[question.id] = { counts: {}, percentages: {}, total: 0 };

      quizStates.forEach(state => {
        const answer = state.answers[question.id]?.value;
        if (Array.isArray(answer)) {
          answer.forEach(value => {
            result[question.id].counts[value] = (result[question.id].counts[value] || 0) + 1;
            result[question.id].total += 1;
          });
        } else if (answer) {
          result[question.id].counts[answer] = (result[question.id].counts[answer] || 0) + 1;
          result[question.id].total += 1;
        }
      });

      Object.keys(result[question.id].counts).forEach(key => {
        result[question.id].percentages[key] = (result[question.id].counts[key] / result[question.id].total) * 100;
      });
    });

    return result;
  };

  const analysisResult = analyzeData();

  const handlePrint = (questionId: string) => {
    const printContent = document.getElementById(`table-${questionId}`);
    if (printContent) {
      const winPrint = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');
      if (winPrint) {
        winPrint.document.write(printContent.innerHTML);
        winPrint.document.close();
        winPrint.focus();
        winPrint.print();
        winPrint.close();
        showToast('Print successful', 'success');
      } else {
        showToast('Unable to open print window', 'error');
      }
    } else {
      showToast('Print content not found', 'error');
    }
  };

  const handleExport = (questionId: string) => {
    const data = analysisResult[questionId];
    const csvContent = `Option,Count,Percentage\n${Object.keys(data.counts)
      .map(key => `${key},${data.counts[key]},${data.percentages[key].toFixed(2)}%`)
      .join('\n')}`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${questionId}_analysis.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('Export successful', 'success');
    } else {
      showToast('Export failed: Browser does not support download', 'error');
    }
  };

  const handleShowChart = (questionId: string) => {
    const data = analysisResult[questionId];
    const chartData = {
      labels: Object.keys(data.counts),
      values: Object.values(data.counts),
    };
    setCurrentChart({ question: questions.find(q => q.id === questionId)?.text || '', data: chartData });
    setShowModal(true);
  };

  const showToast = (message: string, type: 'success' | 'warning' | 'error') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const excludedQuestions = ['student_name', 'birth_place', 'address'];

  return (
    <div className="container mt-5 animate-fade-in">
      <h2 className="text-center mb-4">تحليل البيانات</h2>
      {Object.keys(analysisResult).map(questionId => {
        const question = questions.find(q => q.id === questionId);
        if (!question || excludedQuestions.includes(questionId)) return null;

        return (
          <div key={questionId} className="card mb-4 shadow-sm">
            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
              <h3 className="h5 mb-0">{question.text}</h3>
              <div>
                <button
                  className="btn btn-link text-white p-0 me-2"
                  onClick={() => handlePrint(questionId)}
                  title="طباعة"
                >
                  <FaPrint />
                </button>
                <button
                  className="btn btn-link text-white p-0 me-2"
                  onClick={() => handleExport(questionId)}
                  title="تصدير"
                >
                  <FaFileExport />
                </button>
                <button
                  className="btn btn-link text-white p-0"
                  onClick={() => handleShowChart(questionId)}
                  title="عرض الرسم البياني"
                >
                  <FaChartBar />
                </button>
              </div>
            </div>
            <div className="card-body">
              <div className="table-responsive" id={`table-${questionId}`}>
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>الخيار</th>
                      <th>العدد</th>
                      <th>النسبة المئوية</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.keys(analysisResult[questionId].counts).map(key => (
                      <tr key={key}>
                        <td>{key}</td>
                        <td>{analysisResult[questionId].counts[key]}</td>
                        <td>{analysisResult[questionId].percentages[key].toFixed(2)}%</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <th>المجموع</th>
                      <th>{analysisResult[questionId].total}</th>
                      <th>100%</th>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        );
      })}
      <Button variant="primary" className="mt-4" onClick={onBack}>
        <i className="bi bi-arrow-left"></i> رجوع
      </Button>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>{currentChart?.question}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentChart && (
            <Plot
              data={[
                {
                  type: 'pie',
                  labels: currentChart.data.labels,
                  values: currentChart.data.values,
                  textinfo: 'label+percent',
                  insidetextorientation: 'radial',
                },
              ]}
              layout={{ width: '100%', height: 500, title: currentChart.question }}
              config={{ responsive: true }}
            />
          )}
        </Modal.Body>
      </Modal>

      <Toast
        show={toast.show}
        onClose={() => setToast({ ...toast, show: false })}
        style={{
          position: 'fixed',
          top: 20,
          right: 20,
          minWidth: 200,
        }}
        className={`bg-${toast.type === 'success' ? 'success' : toast.type === 'warning' ? 'warning' : 'danger'} text-white`}
      >
        <Toast.Header>
          <strong className="me-auto">{toast.type.charAt(0).toUpperCase() + toast.type.slice(1)}</strong>
        </Toast.Header>
        <Toast.Body>{toast.message}</Toast.Body>
      </Toast>
      <style jsx>{`
        .btn-link {
          transition: opacity 0.2s ease-in-out;
        }
        .btn-link:hover {
          opacity: 0.7;
        }
      `}</style>
    </div>
  );
};

export default DataAnalysis;

