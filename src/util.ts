export function zip<A, B>(a: A[], b: B[]): [A, B][] {
    let maxIndex = Math.max(a.length, b.length);
    let result = [];
    for (let i = 0; i < maxIndex; ++i) {
        let curr = [];
        if (i < a.length)
            curr.push(a[i]);
        if (i < b.length)
            curr.push(b[i]);
        if (curr.length < 2)
            return result;
        result.push(curr);
    }
    return result;
}

export function enumerate<T>(arr: T[]): [number, T][] {
    let result = [];
    for (let i = 0; i < arr.length; ++i) {
        result.push([i, arr[i]]);
    }
    return result;
}
