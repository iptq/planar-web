import { Block } from "./blocks";
import { Direction } from "./segments";
import { Level } from "./levels";
import { ISegment, Segment, SegmentType } from "./segments";

export interface IPlayer {
    x: number;
    y: number;
    z: number;
}

export class Player {
    parent: Level;
    block: Block;

    get x(): number {
        return this.block.x;
    }

    get y(): number {
        return this.block.y;
    }

    constructor(parent: Level, data: IPlayer) {
        this.parent = parent;

        this.block = new Block(parent, {
            x: data.x,
            y: data.y,
            movable: true,
            color: [0, 102, 204],
            direction: Direction.Both,
            segments: [{
                rx: 0,
                ry: 0,
                z: data.z,
                t: SegmentType.Rectangle,
            }],
        });
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

    tryMove(direction: Direction): [Block, Direction][] | null {
        let result = this.block.canMove(direction, true, this);
        if (result == null) return null;

        let moves: [Block, Direction][] = [];
        result.forEach((block, d) => {
            this.parent.moveBlock(block, d);
            moves.push([block, d]);
        });

        this.parent.moveStack.push(moves);

        // undo if invalid

        return moves;
    }
}
