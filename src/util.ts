export function zip<A, B>(a: A[], b: B[]): [A, B][] {
    let maxIndex = Math.max(a.length, b.length);
    let result = [];
    for (let i = 0; i < maxIndex; ++i) {
        if (i < a.length && i < b.length) {
            let item: [A, B] = [a[i], b[i]];
            result.push(item);
        } else
            return result;
    }
    return result;
}

export function enumerate<T>(arr: T[]): [number, T][] {
    let result: [number, T][] = [];
    for (let i = 0; i < arr.length; ++i) {
        result.push([i, arr[i]]);
    }
    return result;
}
