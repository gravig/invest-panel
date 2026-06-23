import { useEffect, useState } from "react";
import type { Observable } from "./Observable";

type Updater<T> = (prev: T) => T;

export const useObservable = <T>(observable: Observable<T>) => {
  const [value, setValue] = useState<T>(observable.get());

  useEffect(() => {
    observable.subscribe(setValue);

    return () => {
      observable.unsubscribe(setValue);
    };
  }, [observable]);

  const _setValue = (next: T | Updater<T>) => {
    if (typeof next === "function") {
      observable.set((next as Updater<T>)(observable.get()));
    } else {
      observable.set(next);
    }
  };

  return [value, _setValue] as const;
};
