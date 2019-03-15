import { Level } from "./levels";
import { ISegment, Segment, Direction } from "./segments";
import { Dictionary } from "typescript-collections";

export interface IBlock {
    x: number;
    y: number;
    segments: ISegment[];
    color: [number, number, number];
    movable: boolean;
    direction: Direction,
}

export class Block {
    private minX: number = 0;
    private minY: number = 0;
    private maxX: number = 0;
    private maxY: number = 0;

    parent: Level;
    x: number;
    y: number;
    segments: Segment[];
    color: [number, number, number];
    movable: boolean;
    direction: Direction;

    constructor(parent: Level, data: IBlock) {
        this.parent = parent;
        this.x = data.x;
        this.y = data.y;
        this.minX = 0;
        this.minY = 0;
        this.maxX = 0;
        this.maxY = 0;
        this.color = data.color;
        this.movable = data.movable;
        this.direction = data.direction;

        this.segments = data.segments.map(data => new Segment(this, data));
        for (let segment of this.segments) {
            this.minX = Math.min(this.minX, segment.rx);
            this.minY = Math.min(this.minY, segment.ry);
            this.maxX = Math.max(this.maxX, segment.rx);
            this.maxY = Math.max(this.maxY, segment.ry);
        }
    }

    string(): string {
        let segments = this.segments.map(segment => segment.string()).join(",");
        return `Block<${this.x},${this.y},[${segments}]>`;
    }

    canMove(direction: Direction, byPlayer: boolean = false, ignore): Dictionary<Block, Direction> | null {
        if ((this.direction == Direction.Horizontal && (direction == Direction.Up || direction == Direction.Down)) ||
            (this.direction == Direction.Vertical && (direction == Direction.Left || direction == Direction.Right))) {
            return null;
        }

        let result = new Dictionary<Block, Direction>();
        let failed = false;
        for (let segment of this.segments) {
            let res = segment.canMove(direction);
            if (res == null)
                failed = true;
            else {
                for (let key of res.keys())
                    result.setValue(key, res.getValue(key));
            }
        }
        if (failed) return null;
        result.setValue(this, direction);
        return result;
    }

    renderBlock(cellSize: number, padding: number = 1): [HTMLCanvasElement, HTMLCanvasElement, number, number] {
        let left = <HTMLCanvasElement> document.createElement("canvas");
        left.width = (this.maxX - this.minX + 1) * cellSize;
        left.height = (this.maxY - this.minY + 1) * cellSize;
        let right = <HTMLCanvasElement> document.createElement("canvas");
        right.width = (this.maxX - this.minX + 1) * cellSize;
        right.height = (this.maxY - this.minY + 1) * cellSize;

        let leftctx: CanvasRenderingContext2D = left.getContext("2d");
        let rightctx: CanvasRenderingContext2D = right.getContext("2d");
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
