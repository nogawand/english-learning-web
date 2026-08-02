import { useEffect, useMemo, useState } from 'react';
import './LetterLesson.css';
import { LETTER_TEXTS } from './Letter_texts';

interface LetterData {
  id: number;
  uppercase: string;
  lowercase: string;
  audioUrl?: string; // optional field
}

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.split('');

export default function LetterLesson() {
  const [step, setStep] = useState(0);
  const [letters, setLetters] = useState<LetterData[]>([]);
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUnitLetters = async () => {
      try {
        const response = await fetch('https://english-learning-web-jvww.onrender.com/');
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
  }, []);

  const playAudio = (textToSpeak: string) => {
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'en-US'; 
    utterance.rate = 0.5; 
    window.speechSynthesis.speak(utterance);
  };

  const nextStep = () => {
    if (step < 2) {
      setStep(step + 1); 
    } else {
      setStep(0);
      setCurrentLetterIndex(currentLetterIndex + 1);
    }
  }

  const currentLetter = letters[currentLetterIndex];

  const currentOptions = useMemo(() => {
    if (step === 0 || !currentLetter) return [];

    const isUpperCase = step === 1;
    const correctChar = isUpperCase ? currentLetter.uppercase : currentLetter.lowercase;

    const availableLetters = ALPHABET.filter(c => c !== currentLetter.lowercase);

    const distractors = [];
    for (let i = 0; i < 2; i++) {
      const randomIndex = Math.floor(Math.random() * availableLetters.length);
      distractors.push(availableLetters[randomIndex]);
      availableLetters.splice(randomIndex, 1); 
    }

    const formattedDistractors = distractors.map(c => 
      isUpperCase ? c.toUpperCase() : c.toLowerCase()
    );

    const allOptions = [correctChar, ...formattedDistractors];
    return allOptions.sort(() => Math.random() - 0.5);

  }, [currentLetter, step]);


  if (isLoading) {
    return <div className="lesson-container"><h2>{LETTER_TEXTS.LOADING}</h2></div>;
  }

  if (currentLetterIndex >= letters.length) {
    return (
      <div className="lesson-container">
        <h1>{LETTER_TEXTS.SUCCESS}</h1>
      </div>
    );
  }

  return (
    <div className="lesson-container">
      <div className="progress-bar">
      {LETTER_TEXTS.PROGRESS_BAR(currentLetterIndex + 1, letters.length, step + 1)}
      </div>

      {step === 0 && (
        <div className="intro-step">
          <button onClick={() => playAudio(currentLetter.uppercase)}>{LETTER_TEXTS.AUDIO_BUTTON}</button>
          <h1>{currentLetter.uppercase}</h1>
          <h1>{currentLetter.lowercase}</h1>
          
          <button onClick={nextStep}>{LETTER_TEXTS.CONTINUE}</button>
        </div>
      )}

      {step === 1 && (
        <div className="practice-step">
          <p>{LETTER_TEXTS.FIND_UPPERCASE}</p>
          <button onClick={() => playAudio(currentLetter.uppercase)}>{LETTER_TEXTS.AUDIO_BUTTON}</button>
          
          <div className="options">
            {currentOptions.map((option, index) => (
              <button 
                key={index} 
                onClick={() => {
                  if (option === currentLetter.uppercase) {
                    nextStep(); 
                  } else {
                    alert(LETTER_TEXTS.TRY_AGAIN); 
                  }
                }}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="practice-step">
          <p>{LETTER_TEXTS.FIND_LOWERCASE}</p>
          <button onClick={() => playAudio(currentLetter.lowercase)}>{LETTER_TEXTS.AUDIO_BUTTON}</button>
          <div className="options">
            {currentOptions.map((option, index) => (
              <button 
                key={index} 
                onClick={() => {
                  if (option === currentLetter.lowercase) {
                    nextStep(); 
                  } else {
                    alert(LETTER_TEXTS.TRY_AGAIN);
                  }
                }}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}