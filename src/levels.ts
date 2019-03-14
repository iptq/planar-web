import { IBlock, Block } from "./blocks";
import { Game } from "./game";
import { IPlayer, Player } from "./player";
import { IGoal, Goal } from "./goals";
import { Direction } from "./segments";
import { enumerate } from "./util";

export class ILevel {
    blocks: IBlock[];
    dimensions: [number, number];
    players: [IPlayer, IPlayer];
    goals: [IGoal, IGoal];
}

export class Level {
    parent: Game;
    blocks: Block[];
    dimensions: [number, number];
    players: [Player, Player];
    goals: [Goal, Goal];

    static load(parent: Game, contents: string): Level {
        let data: ILevel = JSON.parse(contents);
        return Level.from(parent, data);
    }

    static from(parent: Game, data: ILevel): Level {
        let level = new Level();
        level.players = [Player.from(level, data.players[0]), Player.from(level, data.players[1])];
        level.parent = parent;
        level.blocks = data.blocks.map(data => Block.from(level, data));
        level.dimensions = data.dimensions;
        level.goals = [Goal.from(data.goals[0]), Goal.from(data.goals[1])];
        return level;
    }

    moveBlock(block: Block, direction: Direction) {
        for (let [i, segment] of enumerate(block.segments)) {

        }
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
            let [left, right, xOff, yOff] = block.render(cellSize, padding);
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
