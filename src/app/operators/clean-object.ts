export function cleanObject<T extends Record<string, any>>(obj: T): T {
    const result = {} as T;
    for (const key in obj) {
        if (obj[key] !== null && obj[key] !== undefined) {
            result[key] = obj[key];
        }
    }
    return result;
}
