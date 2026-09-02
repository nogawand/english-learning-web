export const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.split('');

export const LETTER_TEXTS = {
  // statuses and errors
  LOADING: 'טוען...',
  SUCCESS: 'כל הכבוד! סיימת את היחידה בהצלחה 🎉',
  SERVER_ERROR: 'שגיאת שרת: ',
  RETRIEVING_DATA_ERROR: 'שגיאה בשליפת הנתונים מהשרת',
  FETCH_UNITS_ERROR: 'שגיאה בטעינת היחידות',
  NO_LETTERS_FOUND: 'לא נמצאו אותיות ליחידה זו במסד הנתונים',
  
  // buttons and interface
  AUDIO_BUTTON: '🔊 שמע',
  CONTINUE: 'המשך',
  TRY_AGAIN: 'נסה שוב!',
  SELECT_UNIT_TITLE: 'בחר יחידה לתרגול',
  
  // instructions for the lesson
  FIND_LOWERCASE: 'מצא את האות הקטנה',
  FIND_UPPERCASE: 'מצא את האות הגדולה',
  
  // helper function for the progress bar
  PROGRESS_BAR: (current: number, total: number, step: number) => 
    `שלב ${step}: אות ${current} מתוך ${total}`
};