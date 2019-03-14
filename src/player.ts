import { Level } from "./levels";
import { Direction } from "./segments";

export interface IPlayer {
    x: number;
    y: number;
}

export class Player {
    parent: Level;
    x: number;
    y: number;

    static from(parent: Level, data: IPlayer): Player {
        let player = new Player();
        player.parent = parent;
        player.x = data.x;
        player.y = data.y;
        return player;
    }

    render(cellSize: number): HTMLCanvasElement {
        let tile = <HTMLCanvasElement> document.createElement("canvas");
        tile.width = cellSize;
        tile.height = cellSize;
        let ctx = tile.getContext("2d");
        ctx.arc(cellSize / 2, cellSize / 2, cellSize * 2 / 5, 0, 2 * Math.PI);
        ctx.fillStyle = "rgb(0, 102, 204)";
        ctx.fill();
        return tile;
    }

    tryMove(direction: Direction) {

    }
}
