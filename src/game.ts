import { GameState } from "./states/game";
import { State } from "./states/index";
import { Tutorial } from "./tutorial";
import { Event } from "./events";
import { Keyboard } from "./keyboard";

export class Game {
    private running: boolean = true;
    private states: State[] = [];
    private lastUpdate: number = Date.now();

    events: Event[] = [];
    dimensions = [854, 480];

    constructor() {
        let tutorial = Tutorial(this);
        this.states.push(new GameState(this, tutorial));
    }

    update(dt: number) {
        Keyboard.update(this.events);
        if (this.states.length > 0)
            this.states[this.states.length - 1].update(dt, this.events);
        this.events = [];
    }

    draw(dt: number, ctx: CanvasRenderingContext2D) {
        if (this.states.length > 0)
            this.states[this.states.length - 1].draw(dt, ctx);
    }

    loop(ctx: CanvasRenderingContext2D) {
        let now = Date.now();
        let elapsed = now - this.lastUpdate;

        this.update(elapsed);
        this.draw(elapsed, ctx);

        this.lastUpdate = now;
    }
}
