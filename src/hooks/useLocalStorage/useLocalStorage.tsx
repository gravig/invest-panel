import React from "react";

type Updater<T> = (value: T) => T;

export const useLocalStorage = <T,>(
  key: string,
  initialValue?: T,
): [T, (value: T | Updater<T>) => void] => {
  const [storedValue, setStoredValue] = React.useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error("Error reading localStorage key:", key, error);
      return initialValue;
    }
  });

  const setValue = (value: T | Updater<T>): void => {
    setStoredValue((prevValue) => {
      const nextValue = typeof value === "function" ? (value as Updater<T>)(prevValue) : value;
      try {
        window.localStorage.setItem(key, JSON.stringify(nextValue));
      } catch (error) {
        console.error("Error setting localStorage key:", key, error);
      }
      return nextValue;
    });
  };

  return [storedValue, setValue];
};
