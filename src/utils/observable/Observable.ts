export class Observable<T> {
  private value: T;
  private subscriptions: Subscription<T>[] = [];

  public constructor(value: T) {
    this.value = value;
  }

  public subscribe(subscription: Subscription<T>): void {
    this.subscriptions.push(subscription);
  }

  public unsubscribe(subscription: Subscription<T>): void {
    this.subscriptions = this.subscriptions.filter(
      (item) => item !== subscription,
    );
  }

  public set(next: T): void {
    this.value = next;
    this.notify(next);
  }

  public get(): T {
    return this.value;
  }

  public update(updater: Updater<T>): void {
    this.set(updater(this.value));
  }

  private notify(next: T): void {
    this.subscriptions.forEach((subscription) => {
      subscription(next);
    });
  }
}

export type Updater<T> = (prev: T) => T;
export type Subscription<T> = (next: T) => void;
