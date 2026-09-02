import { useEffect, useMemo, useState } from 'react';
import './LetterLesson.css';
import { LETTER_TEXTS } from './Letter_texts';

interface LetterData {
  id: number;
  uppercase: string;
  lowercase: string;
  audioUrl?: string;
}

interface QuizItem {
  id: string;
  text: string;
  type: 'UPPER' | 'LOWER';
  correctMatch: string;
}

interface UnitData {
  id: number;
  title: string;
}

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.split('');

export default function LetterLesson() {
  const [letters, setLetters] = useState<LetterData[]>([]);
  const [appPhase, setAppPhase] = useState<'LEARN' | 'QUIZ' | 'SUCCESS'>('LEARN');
  
  const [learnIndex, setLearnIndex] = useState(0);
  const [quizItems, setQuizItems] = useState<QuizItem[]>([]);
  const [quizIndex, setQuizIndex] = useState(0);
  
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUnit, setSelectedUnit] = useState<number | null>(null);
  const [availableUnits, setAvailableUnits] = useState<UnitData[]>([]);

  const apiUrl = import.meta.env.VITE_API_URL;

  // 1. Fetch Available Units
  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/units`);   
        if (!response.ok) throw new Error(LETTER_TEXTS.FETCH_UNITS_ERROR);
        
        const data = await response.json();
        setAvailableUnits(data);
      } catch (error) {
        console.error(LETTER_TEXTS.FETCH_UNITS_ERROR, error);
      }
    };
    fetchUnits();
  }, []);

  // 2. Fetch Letters for Selected Unit
  useEffect(() => {
    if (selectedUnit === null) return; 
    const fetchUnitLetters = async () => {
      setIsLoading(true);
      try {
         
        const response = await fetch(`${apiUrl}/api/letters/unit/${selectedUnit}`);    
        if (!response.ok) {
          throw new Error(LETTER_TEXTS.SERVER_ERROR + response.status);
        }
        
        const data = await response.json();
        setLetters(data);
      } catch (error) {
        console.error(LETTER_TEXTS.RETRIEVING_DATA_ERROR, error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUnitLetters();
  }, [selectedUnit]);

  const playAudio = (textToSpeak: string) => {
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'en-US'; 
    utterance.rate = 0.5; 
    window.speechSynthesis.speak(utterance);
  };

  const generateQuizItems = (lettersFromServer: LetterData[]) => {
    const items = lettersFromServer.flatMap<QuizItem>(letter => [
      { 
        id: `${letter.id}-UPPER`, 
        text: letter.uppercase, 
        type: 'UPPER', 
        correctMatch: letter.lowercase 
      },
      { 
        id: `${letter.id}-LOWER`, 
        text: letter.lowercase, 
        type: 'LOWER', 
        correctMatch: letter.uppercase 
      }
    ]);
    return items.sort(() => 0.5 - Math.random());
  };

  const handleUnitSelect = (unitId: number) => {
    setSelectedUnit(unitId);
    setIsLoading(true); 
    setAppPhase('LEARN'); 
    setLearnIndex(0); 
    setQuizIndex(0);
  };

  const handleNextLearn = () => {
    if (learnIndex < letters.length - 1) {
      setLearnIndex(learnIndex + 1);
    } else {
      setQuizItems(generateQuizItems(letters));
      setAppPhase('QUIZ');
    }
  };

  const currentQuizItem = quizItems[quizIndex];
  
  const currentOptions = useMemo(() => {
    if (!currentQuizItem) return [];

    const correct = currentQuizItem.correctMatch;
    const isLowerDistractors = currentQuizItem.type === 'UPPER'; 
    
    const availableLetters = ALPHABET.filter(c => c.toLowerCase() !== correct.toLowerCase());
    const distractors = [];
    
    for (let i = 0; i < 2; i++) {
      const randomIndex = Math.floor(Math.random() * availableLetters.length);
      const letter = availableLetters[randomIndex];
      distractors.push(isLowerDistractors ? letter.toLowerCase() : letter.toUpperCase());
      availableLetters.splice(randomIndex, 1); 
    }

    const allOptions = [correct, ...distractors];
    return allOptions.sort(() => Math.random() - 0.5);
  }, [currentQuizItem]);

  const handleOptionClick = (option: string) => {
    if (option === currentQuizItem.correctMatch) {
      if (quizIndex < quizItems.length - 1) {
        setQuizIndex(quizIndex + 1);
      } else {
        setAppPhase('SUCCESS');
      }
    } else {
      alert(LETTER_TEXTS.TRY_AGAIN);
    }
  };

  // --- RENDER --- //

  if (selectedUnit === null) {
    return (
      <div className="lesson-container">
        <h1>{LETTER_TEXTS.SELECT_UNIT_TITLE}</h1>
        <div className="unit-selector">
          {availableUnits.map(unit => (
            <button key={unit.id} onClick={() => handleUnitSelect(unit.id)}>
              {unit.title}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <div className="lesson-container"><h2>{LETTER_TEXTS.LOADING}</h2></div>;
  }

  if (appPhase === 'SUCCESS') {
    return (
      <div className="lesson-container">
        <h1>{LETTER_TEXTS.SUCCESS}</h1>
      </div>
    );
  }

  if (letters.length === 0 && !isLoading && selectedUnit !== null) {
    return (
      <div className="lesson-container">
        <h1>{LETTER_TEXTS.NO_LETTERS_FOUND}</h1>
      </div>
    );
  }

  return (
    <div className="lesson-container">
      <div className="progress-bar">
        {appPhase === 'LEARN' 
          ? LETTER_TEXTS.PROGRESS_BAR(learnIndex + 1, letters.length, 1)
          : LETTER_TEXTS.PROGRESS_BAR(quizIndex + 1, quizItems.length, 2)}
      </div>

      {appPhase === 'LEARN' && (
        <div className="intro-step">
          <button onClick={() => playAudio(letters[learnIndex].uppercase)}>
            {LETTER_TEXTS.AUDIO_BUTTON}
          </button>
          <h1>{letters[learnIndex].uppercase}</h1>
          <h1>{letters[learnIndex].lowercase}</h1>
          
          <button onClick={handleNextLearn}>{LETTER_TEXTS.CONTINUE}</button>
        </div>
      )}

      {appPhase === 'QUIZ' && currentQuizItem && (
        <div className="practice-step">
          <p>
            {currentQuizItem.type === 'UPPER' 
              ? LETTER_TEXTS.FIND_LOWERCASE 
              : LETTER_TEXTS.FIND_UPPERCASE}
          </p>
          <button onClick={() => playAudio(currentQuizItem.text)}>
            {LETTER_TEXTS.AUDIO_BUTTON}
          </button>
          <h1>{currentQuizItem.text}</h1>
          
          <div className="options">
            {currentOptions.map((option, index) => (
              <button key={index} onClick={() => handleOptionClick(option)}>
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}