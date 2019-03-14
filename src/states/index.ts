import { Event } from "../events";

export interface State {
    update(dt: number, events: Event[]);
    draw(dt: number, CanvasRenderingContext2D);
}
