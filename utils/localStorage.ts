import { QuizState } from '../types/quiz';

const STORAGE_KEY = 'quiz_states';

const simulateNetworkDelay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const saveQuizState = async (state: QuizState): Promise<void> => {
  try {
    await simulateNetworkDelay();
    const savedStates = await loadQuizStates();
    const existingStateIndex = savedStates.findIndex(s => s.attemptId === state.attemptId);

    if (existingStateIndex !== -1) {
      savedStates[existingStateIndex] = state;
    } else {
      savedStates.push(state);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedStates));
  } catch (error) {
    console.error('Failed to save quiz state:', error);
    throw new Error('Failed to save quiz state');
  }
};

export const loadQuizStates = async (): Promise<QuizState[]> => {
  try {
    await simulateNetworkDelay();
    const savedStates = localStorage.getItem(STORAGE_KEY);
    return savedStates ? JSON.parse(savedStates) : [];
  } catch (error) {
    console.error('Failed to load quiz states:', error);
    throw new Error('Failed to load quiz states');
  }
};

export const clearQuizStates = async (): Promise<void> => {
  try {
    await simulateNetworkDelay();
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear quiz states:', error);
    throw new Error('Failed to clear quiz states');
  }
};

export const deleteQuizState = async (attemptId: string): Promise<void> => {
  try {
    await simulateNetworkDelay();
    const savedStates = await loadQuizStates();
    const updatedStates = savedStates.filter(state => state.attemptId !== attemptId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedStates));
  } catch (error) {
    console.error('Failed to delete quiz state:', error);
    throw new Error('Failed to delete quiz state');
  }
};

export const importQuizStates = async (importedStates: QuizState[]): Promise<void> => {
  try {
    await simulateNetworkDelay();
    
    // Validate imported states
    if (!Array.isArray(importedStates) || importedStates.length === 0) {
      throw new Error('Invalid or empty import data');
    }
    
    for (const state of importedStates) {
      if (!state.attemptId || !state.attemptNumber || !state.startTime || !state.answers) {
        throw new Error('Invalid quiz state structure in import data');
      }
    }
    
    const existingStates = await loadQuizStates();
    const mergedStates = [...existingStates, ...importedStates];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedStates));
  } catch (error) {
    console.error('Failed to import quiz states:', error);
    throw new Error('Failed to import quiz states');
  }
};

