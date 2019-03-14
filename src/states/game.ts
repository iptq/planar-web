import { Block } from "../blocks";
import { Event } from "../events";
import { Game } from "../game";
import { Level } from "../levels";
import { State } from "./index";
import { Direction } from "../segments";
import { zip } from "../util";

export class GameState implements State {
    private transitioning: boolean = false;
    private animationProgress: number = 0;
    private moveResult: [Block, Direction][] = [];
    private originalPositions: [number, number][] = [];

    constructor(private parent: Game, private level: Level) {
        this.parent = parent;
        this.level = level;
    }

    update(dt: number, events: Event[]) {
        if (this.transitioning) {
            if (this.animationProgress + dt > 1) {
                for (let [[block, d], [x, y]] of zip(this.moveResult, this.originalPositions)) {
                    block.x = x;
                    block.y = y;
                    this.level.moveBlock(block, d);
                }
            } else {
                this.animationProgress += dt;
                for (let [block, d] of this.moveResult) {
                    block.x += dt * d[0];
                    block.y += dt * d[1];
                }
            }
        }
    }

    draw(dt: number, ctx: CanvasRenderingContext2D) {
        let [sWidth, sHeight] = this.parent.dimensions;
        let screenRatio = sWidth / sHeight;

        ctx.fillStyle = "rgb(80, 100, 100)";
        ctx.fillRect(0, 0, sWidth, sHeight);

        let [cols, rows] = this.level.dimensions;
        let ratio = (2 * cols + 6) / (rows + 4);

        let scale, xOff, yOff;
        if (ratio > screenRatio) {
            scale = sWidth / (2 * cols + 6);
            xOff = 0;
            yOff = sHeight / 2 - (rows + 4) * scale / 2;
        } else {
            scale = sHeight / (rows + 4);
            xOff = sWidth / 2 - (2 * cols + 6) * scale / 2;
            yOff = 0;
        }

        let [left, right] = this.level.render(scale);
        ctx.drawImage(left, xOff + 2 * scale, yOff + 2 * scale);
        ctx.drawImage(right, xOff + (4 + cols) * scale, yOff + 2 * scale);
    }
}
