import { Event, KeyDown, KeyUp } from "./events";

export class Keyboard {
    static downMap: { [key: number]: boolean } = {}

    static update(events: Event[]) {
        for (let event of events) {
            switch (event.kind) {
            case "keydown":
                this.downMap[event.code] = true;
                break;
            case "keyup":
                delete this.downMap[event.code];
                break;
            }
        }
    }

    static isDown(code: number) {
        return code in Keyboard.downMap;
    }
}
