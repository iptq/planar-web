export interface KeyDown {
    kind: "keydown";
    code: number;
}

export interface KeyUp {
    kind: "keyup";
    code: number;
}

export type Event = KeyDown | KeyUp;
