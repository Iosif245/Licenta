// import i18n from '@app/translations';
// import chatTranslations from '@app/translations/lang/chat/constants';

// /**
//  * Format a date string to a localized format
//  */
// export const formatDate = (dateString: string): string => {
//   const date = new Date(dateString);
//   const language = i18n.language || 'en'; // Get current language or default to English
//   const locale = language === 'ro' ? 'ro-RO' : 'en-US';
//   return date.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' });
// };

// /**
//  * Format time distance to now with translations
//  */
// export const formatDistanceToNow = (dateString: string): string => {
//   const date = new Date(dateString);
//   const now = new Date();
//   const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

//   if (diffInSeconds < 60) {
//     return i18n.t(chatTranslations.CHAT__TIME_NOW);
//   }

//   const diffInMinutes = Math.floor(diffInSeconds / 60);
//   if (diffInMinutes < 60) {
//     return i18n.t(chatTranslations.CHAT__TIME_MINUTES_AGO, { count: diffInMinutes });
//   }

//   const diffInHours = Math.floor(diffInMinutes / 60);
//   if (diffInHours < 24) {
//     return i18n.t(chatTranslations.CHAT__TIME_HOURS_AGO, { count: diffInHours });
//   }

//   const diffInDays = Math.floor(diffInHours / 24);
//   if (diffInDays < 7) {
//     return i18n.t(chatTranslations.CHAT__TIME_DAYS_AGO, { count: diffInDays });
//   }

//   const diffInWeeks = Math.floor(diffInDays / 7);
//   if (diffInWeeks < 4) {
//     return i18n.t(chatTranslations.CHAT__TIME_WEEKS_AGO, { count: diffInWeeks });
//   }

//   const diffInMonths = Math.floor(diffInDays / 30);
//   if (diffInMonths < 12) {
//     return i18n.t(chatTranslations.CHAT__TIME_MONTHS_AGO, { count: diffInMonths });
//   }

//   const diffInYears = Math.floor(diffInDays / 365);
//   return i18n.t(chatTranslations.CHAT__TIME_YEARS_AGO, { count: diffInYears });
// };
