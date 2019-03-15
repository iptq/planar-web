import { IBlock, Block } from "./blocks";
import { Game } from "./game";
import { IPlayer, Player } from "./player";
import { IGoal, Goal } from "./goals";
import { Direction, directionCoords } from "./segments";
import { Dictionary } from "typescript-collections";
import { enumerate } from "./util";

export interface ILevel {
    blocks: IBlock[];
    dimensions: [number, number];
    players: [IPlayer, IPlayer];
    goals: [IGoal, IGoal];
}

export class Level {
    cellMap = new Dictionary<[number, number, number], [Block, number][]>();
    moveStack: [Block, Direction][][] = [];
    parent: Game;

    blocks: Block[];
    dimensions: [number, number];
    players: [Player, Player];
    goals: [Goal, Goal];

    static load(parent: Game, contents: string): Level {
        let data: ILevel = JSON.parse(contents);
        return new Level(parent, data);
    }

    constructor(parent: Game, data: ILevel) {
        this.players = [new Player(this, data.players[0]), new Player(this, data.players[1])];
        this.parent = parent;
        this.blocks = data.blocks.map(data => new Block(this, data));
        this.dimensions = data.dimensions;
        this.goals = [new Goal(data.goals[0]), new Goal(data.goals[1])];
    }

    moveBlock(block: Block, direction: Direction) {
        for (let [i, segment] of enumerate(block.segments)) {
            // TODO:
        }
        let [dx, dy] = directionCoords(direction);
        block.x += dx;
        block.y += dy;
    }

    render(cellSize: number, padding: number = 1): [HTMLCanvasElement, HTMLCanvasElement] {
        let defaultTile = <HTMLCanvasElement> document.createElement("canvas");
        defaultTile.width = cellSize;
        defaultTile.height = cellSize;
        let tilectx = defaultTile.getContext("2d");
        tilectx.fillStyle = "rgba(200, 200, 200)";
        tilectx.fillRect(0, 0, cellSize, cellSize);

        let [cols, rows] = this.dimensions;
        let left = <HTMLCanvasElement> document.createElement("canvas");
        left.width = cellSize * cols + 1;
        left.height = cellSize * rows + 1;
        let right = <HTMLCanvasElement> document.createElement("canvas");
        right.width = cellSize * cols + 1;
        right.height = cellSize * rows + 1;

        let leftctx = left.getContext("2d");
        let rightctx = right.getContext("2d");
        let layers = [leftctx, rightctx];

        for (let layer of layers) {
            layer.fillRect(0, 0, cellSize * cols + 1, cellSize * rows + 1);
            for (let x = 0; x < cols; ++x) {
                for (let y = 0; y < rows; ++y) {
                    layer.drawImage(defaultTile, x * cellSize, y * cellSize);
                }
            }
        }

        for (let block of this.blocks) {
            let [left, right, xOff, yOff] = block.renderBlock(cellSize, padding);
            leftctx.drawImage(left, xOff, yOff);
            rightctx.drawImage(right, xOff, yOff);
        }

        for (let goal of this.goals) {
        }

        this.players.forEach((player, index) => {
            layers[index].drawImage(player.render(cellSize), cellSize * player.x, cellSize * player.y);
        });

        return [left, right];
    }
}
