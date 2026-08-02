// import { UPPERCASE_LETTERS } from '../consts/const.letters';

// /**
//  * פונקציה שמייצרת מערך של אפשרויות לבחירה
//  * @param correctLetter האות הנכונה שאנחנו לומדים כרגע
//  * @param numberOfDistractors כמות המסיחים שנרצה (ברירת מחדל: 2)
//  */
// function generateOptions(correctLetter: string, numberOfDistractors: number = 2): string[] {
//   // filter out the correct letter
//   const availableOptions = UPPERCASE_LETTERS.filter(letter => letter !== correctLetter);
  
//   // shuffle the options
//   const shuffledOptions = availableOptions.sort(() => 0.5 - Math.random());
  
//   // slice the options to the number of distractors
//   const selectedDistractors = shuffledOptions.slice(0, numberOfDistractors);
  
//   // add the correct letter to the options
//   const finalOptions = [...selectedDistractors, correctLetter];
  
//   // shuffle the options again to ensure the correct letter is in a random position
//   return finalOptions.sort(() => 0.5 - Math.random());
// }