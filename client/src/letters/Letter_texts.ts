
export const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.split('');

export const LETTER_TEXTS = {
    LOADING: 'טוען נתונים... ⏳',
    ERROR: 'אופס! לא הצלחנו לטעון את האות.',
    SUCCESS: '🎉 כל הכבוד! סיימת את היחידה! 🎉',
    TRY_AGAIN: 'אופס, נסה שוב!',
    FIND_UPPERCASE: 'לחץ על האות הגדולה המתאימה',
    FIND_LOWERCASE: 'לחץ על האות הקטנה המתאימה',
    AUDIO_BUTTON: '🔊 שמע',
    CONTINUE: 'המשך',

    SERVER_ERROR: 'השרת החזיר שגיאה: ',
    RETRIEVING_DATA_ERROR: 'שגיאה בשליפת הנתונים:',

    PROGRESS_BAR: (currentLetterNum: number, totalLettersNum: number, stepNum: number) => 
      `אות ${currentLetterNum} מתוך ${totalLettersNum} | שלב ${stepNum}/3`,
};
