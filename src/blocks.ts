import { Level } from "./levels";
import { ISegment, Segment, Direction } from "./segments";

export interface IBlock {
    x: number;
    y: number;
    segments: ISegment[];
    color: [number, number, number];
    movable: boolean;
    direction: Direction,
}

export class Block {
    private minX: number;
    private minY: number;
    private maxX: number;
    private maxY: number;

    parent: Level;
    x: number;
    y: number;
    segments: Segment[];
    color: [number, number, number];
    movable: boolean;
    direction: Direction;

    static from(parent: Level, data: IBlock): Block {
        let block = new Block();
        block.parent = parent;
        block.x = data.x;
        block.y = data.y;
        block.minX = 0;
        block.minY = 0;
        block.maxX = 0;
        block.maxY = 0;
        block.color = data.color;
        block.movable = data.movable;
        block.direction = data.direction;

        block.segments = data.segments.map(data => Segment.from(block, data));
        for (let segment of block.segments) {
            block.minX = Math.min(block.minX, segment.rx);
            block.minY = Math.min(block.minY, segment.ry);
            block.maxX = Math.max(block.maxX, segment.rx);
            block.maxY = Math.max(block.maxY, segment.ry);
        }

        return block;
    }

    render(cellSize: number, padding: number = 1): [HTMLCanvasElement, HTMLCanvasElement, number, number] {
        let left = <HTMLCanvasElement> document.createElement("canvas");
        left.width = (this.maxX - this.minX + 1) * cellSize;
        left.height = (this.maxY - this.minY + 1) * cellSize;
        let right = <HTMLCanvasElement> document.createElement("canvas");
        right.width = (this.maxX - this.minX + 1) * cellSize;
        right.height = (this.maxY - this.minY + 1) * cellSize;

        let leftctx = left.getContext("2d");
        let rightctx = right.getContext("2d");
        let layers = [leftctx, rightctx];

        for (let segment of this.segments) {
            let x = segment.rx - this.minX;
            let y = segment.ry - this.minY;

            let xOff = x * cellSize;
            let yOff = y * cellSize;

            let canvas = segment.render(cellSize, padding);
            layers[segment.z].drawImage(canvas, xOff, yOff);
        }

        let xOff = (this.x + this.minX) * cellSize;
        let yOff = (this.y + this.minY) * cellSize;
        return [left, right, xOff, yOff];
    }
}
