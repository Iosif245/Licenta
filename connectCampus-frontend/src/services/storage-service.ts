export const localStorageSetItem = (key: string, value: string): void => {
  localStorage.setItem(key, value);
};

export const localStorageGetItem = (key: string): string | null => {
  return localStorage.getItem(key);
};

export const localStorageClearItem = (key: string): void => {
  localStorage.removeItem(key);
};

export const localStorageClearStorage = (): void => {
  localStorage.clear();
};
