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
    private left: HTMLCanvasElement;
    private right: HTMLCanvasElement;

    get leftctx(): CanvasRenderingContext2D {
        return this.left.getContext("2d");
    }
    get rightctx(): CanvasRenderingContext2D {
        return this.right.getContext("2d");
    }

    parent: Level;
    x: number;
    y: number;
    segments: Segment[];
    color: [number, number, number];
    movable: boolean;
    direction: Direction;
    isPlayer: boolean;

    constructor(parent: Level, data: IBlock) {
        this.left = document.createElement("canvas");
        this.right = document.createElement("canvas");

        this.parent = parent;
        this.x = data.x;
        this.y = data.y;
        this.color = data.color;
        this.movable = data.movable;
        this.direction = data.direction;
        this.segments = data.segments.map(data => new Segment(this, data));
        this.isPlayer = false;
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
            let res = segment.canMove(direction, byPlayer);
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

    renderBlock(cellSize: number, padding: number = 1): [HTMLCanvasElement, HTMLCanvasElement] {
        let [cols, rows] = this.parent.dimensions;
        this.left.width = cellSize * cols;
        this.left.height = cellSize * rows;
        this.leftctx.clearRect(0, 0, this.left.width, this.left.height);
        this.right.width = cellSize * cols;
        this.right.height = cellSize * rows;
        this.rightctx.clearRect(0, 0, this.right.width, this.right.height);
        let layers = [this.leftctx, this.rightctx];

        for (let segment of this.segments) {
            let x = this.x + segment.rx;
            let y = this.y + segment.ry;

            let xOff = x * cellSize;
            let yOff = y * cellSize;

            let canvas = segment.render(cellSize, padding);
            layers[segment.z].drawImage(canvas, xOff, yOff);
        }

        return [this.left, this.right];
    }
}
