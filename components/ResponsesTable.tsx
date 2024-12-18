import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Pagination, Alert } from 'react-bootstrap';
import { Question, QuizState } from '../types/quiz';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import Select from 'react-select';
import { v4 as uuidv4 } from 'uuid';

interface ResponsesTableProps {
  questions: Question[];
  quizStates: QuizState[];
  onBack: () => void;
  onUpdate: (updatedState: QuizState) => void;
  onDelete: (attemptId: string) => void;
  loadQuizStates: () => Promise<QuizState[]>;
  onNewAttempt: () => void;
}

const ResponsesTable: React.FC<ResponsesTableProps> = ({ questions, quizStates: initialQuizStates, onBack, onUpdate, onDelete, loadQuizStates, onNewAttempt }) => {
  const [quizStates, setQuizStates] = useState<QuizState[]>(initialQuizStates);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingState, setEditingState] = useState<QuizState | null>(null);
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEntry, setNewEntry] = useState<Partial<QuizState>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const limitedQuestions = ['student_name', 'birth_date', 'repeat_year', 'preferred_branch', 'counselor_discussion'];

  const handleEdit = (state: QuizState) => {
    setEditingState(state);
    setShowEditModal(true);
  };

  const handleSave = () => {
    if (editingState) {
      const errors = validateData(editingState);
      if (Object.keys(errors).length === 0) {
        onUpdate(editingState);
        setShowEditModal(false);
      } else {
        setValidationErrors(errors);
      }
    }
  };

  const handleDelete = (attemptId: string) => {
    if (window.confirm('هل أنت متأكد أنك تريد حذف هذه الاستجابة؟')) {
      onDelete(attemptId);
    }
  };

  const handleInputChange = (questionId: string, value: any) => {
    if (editingState) {
      setEditingState({
        ...editingState,
        answers: {
          ...editingState.answers,
          [questionId]: { value },
        },
      });
    }
  };

  const validateData = (state: QuizState) => {
    const errors: { [key: string]: string } = {};
    limitedQuestions.forEach(questionId => {
      const question = questions.find(q => q.id === questionId);
      if (question) {
        const answer = state.answers[questionId]?.value;
        if (!answer) {
          errors[questionId] = 'هذا الحقل مطلوب';
        } else if (question.type === 'date' && isNaN(Date.parse(answer as string))) {
          errors[questionId] = 'تاريخ غير صالح';
        }
      }
    });
    return errors;
  };

  const renderEditControl = (question: Question, value: any) => {
    switch (question.type) {
      case 'text':
      case 'date':
        return (
          <Form.Control
            type={question.type}
            value={value || ''}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            isInvalid={!!validationErrors[question.id]}
          />
        );
      case 'dropdown':
        return (
          <Form.Select
            value={value || ''}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            isInvalid={!!validationErrors[question.id]}
          >
            <option value="">اختر إجابة</option>
            {question.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Form.Select>
        );
      case 'multiselect':
        return (
          <Select
            isMulti
            options={question.options?.map(option => ({ value: option.value, label: option.label }))}
            value={(value || []).map((v: string) => ({ value: v, label: question.options?.find(o => o.value === v)?.label || v }))}
            onChange={(selectedOptions) => handleInputChange(question.id, selectedOptions.map((option: any) => option.value))}
            className={validationErrors[question.id] ? 'is-invalid' : ''}
          />
        );
      default:
        return null;
    }
  };

  const totalResponses = quizStates.length;
  const preferredBranchStats = quizStates.reduce((acc, state) => {
    const branch = state.answers['preferred_branch']?.value as string;
    if (branch) {
      acc[branch] = (acc[branch] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const studyDifficultiesCount = quizStates.filter(state => state.answers['study_difficulties']?.value === 'yes').length;
  const counselorDiscussionCount = quizStates.filter(state => state.answers['counselor_discussion']?.value === 'yes').length;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = quizStates.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(quizStates.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleAddNew = () => {
    setShowAddModal(true);
  };

  const handleAddNewSubmit = () => {
    const newState: QuizState = {
      ...newEntry,
      attemptId: uuidv4(),
      attemptNumber: quizStates.length + 1,
      startTime: Date.now(),
    };
    onUpdate(newState);
    setShowAddModal(false);
    setNewEntry({});
  };

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

  return (
    <div className="container mt-5 animate-fade-in">
      <h2 className="text-center mb-4">جميع الاستجابات</h2>

      <div className="mb-3 button-group">
        <Button variant="primary" className="interactive-btn me-2" onClick={onNewAttempt}>
          <FaPlus className="me-2" /> إضافة جديدة
        </Button>
        <Button variant="secondary" className="interactive-btn" onClick={onBack}>
          رجوع
        </Button>
      </div>

      {quizStates.length > 0 ? (
        <Table responsive striped bordered hover>
          <thead>
            <tr>
              {limitedQuestions.map(questionId => (
                <th key={questionId}>{questions.find(q => q.id === questionId)?.text}</th>
              ))}
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map(state => (
              <tr key={state.attemptId}>
                {limitedQuestions.map(questionId => (
                  <td key={questionId}>
                    {Array.isArray(state.answers[questionId]?.value)
                      ? state.answers[questionId]?.value.join(', ')
                      : state.answers[questionId]?.value?.toString() || ''}
                  </td>
                ))}
                <td>
                  <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleEdit(state)}>
                    <FaEdit />
                  </Button>
                  <Button variant="outline-danger" size="sm" onClick={() => handleDelete(state.attemptId)}>
                    <FaTrash />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <Alert variant="info" className="text-center">
          لا توجد إجابات أو بيانات.
        </Alert>
      )}

      <div className="d-flex justify-content-between align-items-center mt-4">
        <Pagination>
          <Pagination.First onClick={() => paginate(1)} disabled={currentPage === 1} />
          <Pagination.Prev onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} />
          {Array.from({ length: totalPages }, (_, i) => (
            <Pagination.Item
              key={i + 1}
              active={i + 1 === currentPage}
              onClick={() => paginate(i + 1)}
            >
              {i + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} />
          <Pagination.Last onClick={() => paginate(totalPages)} disabled={currentPage === totalPages} />
        </Pagination>
        <span>الصفحة {currentPage} من {totalPages}</span>
      </div>


      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>إضافة استجابة جديدة</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {questions.map(question => (
              <Form.Group key={question.id} className="mb-3">
                <Form.Label>{question.text}</Form.Label>
                {renderEditControl(question, newEntry.answers?.[question.id]?.value)}
              </Form.Group>
            ))}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            إلغاء
          </Button>
          <Button variant="primary" onClick={handleAddNewSubmit}>
            إضافة
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>تعديل الاستجابة</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editingState && (
            <Form>
              {questions.map(question => (
                <Form.Group key={question.id} className="mb-3">
                  <Form.Label>{question.text}</Form.Label>
                  {renderEditControl(question, editingState.answers[question.id]?.value)}
                  {validationErrors[question.id] && (
                    <Form.Text className="text-danger">
                      {validationErrors[question.id]}
                    </Form.Text>
                  )}
                </Form.Group>
              ))}
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            إلغاء
          </Button>
          <Button variant="primary" onClick={handleSave}>
            حفظ التغييرات
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ResponsesTable;

