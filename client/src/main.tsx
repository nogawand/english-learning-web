import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import LetterLesson from './letters/LetterLesson.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LetterLesson />
  </StrictMode>
)
