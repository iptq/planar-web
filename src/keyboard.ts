import { Event, KeyDown, KeyUp } from "./events";
import { Dictionary } from "typescript-collections";

export enum Key {
    W = 87,
    A = 65,
    S = 83,
    D = 68,

    I = 73,
    J = 74,
    K = 75,
    L = 76,
}

export class Keyboard {
    static downMap = new Dictionary<number, boolean>();

    static update(events: Event[]) {
        for (let event of events) {
            switch (event.kind) {
            case "keydown":
                this.downMap.setValue(event.code, true);
                break;
            case "keyup":
                this.downMap.remove(event.code);
                break;
            }
        }
    }

    static isDown(code: number): boolean {
        return this.downMap.containsKey(code) ? this.downMap.getValue(code) : false;
    }
}
