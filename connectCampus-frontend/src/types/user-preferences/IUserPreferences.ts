export default interface IUserPreferences {
  isTwoFactorEnabled: boolean;
  eventRemindersEnabled: boolean;
  messageNotificationsEnabled: boolean;
  associationUpdatesEnabled: boolean;
  marketingEmailsEnabled: boolean;
  theme: string;
}

export interface IUpdateUserPreferences {
  isTwoFactorEnabled: boolean;
  eventRemindersEnabled: boolean;
  messageNotificationsEnabled: boolean;
  associationUpdatesEnabled: boolean;
  marketingEmailsEnabled: boolean;
  theme: string;
}
