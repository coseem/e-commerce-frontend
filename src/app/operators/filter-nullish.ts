import { map, Observable } from 'rxjs';
import { OperatorFunction } from 'rxjs';

export function filterNullish<T extends Record<string, any>>(): OperatorFunction<T, T> {
  return (source: Observable<T>) =>
    source.pipe(
      map((obj) => {
        const result = {} as T;
        for (const key in obj) {
          if (obj[key] !== null && obj[key] !== undefined) {
            result[key] = obj[key];
          }
        }
        return result;
      })
    );
}