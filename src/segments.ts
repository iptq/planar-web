import { Block } from "./blocks";
import { Dictionary } from "typescript-collections";

export interface ISegment {
    rx: number;
    ry: number;
    z: number;
    t: SegmentType;
}

export enum SegmentType {
    Rectangle,
    BottomLeft,
    BottomRight,
    TopRight,
    TopLeft,
}

export enum Direction {
    Horizontal,
    Vertical,
    Both,

    Up,
    Down,
    Left,
    Right,
}

export function directionCoords(direction: Direction) {
    switch (direction) {
    case Direction.Up:
        return [0, -1];
    case Direction.Down:
        return [0, 1];
    case Direction.Left:
        return [-1, 0];
    case Direction.Right:
        return [1, 0];
    default:
        throw new Error("invalid direction");
    }
}

export class Segment {
    static cache = new Dictionary<string, HTMLCanvasElement>();

    parent: Block;
    rx: number;
    ry: number;
    z: number;
    t: SegmentType;

    constructor(parent: Block, data: ISegment) {
        this.parent = parent;
        this.rx = data.rx;
        this.ry = data.ry;
        this.z = data.z;
        this.t = data.t;
    }

    string(): string {
        return `Segment<${this.rx},${this.ry},${this.z},${this.t}>`;
    }

    canMove(direction: Direction, byPlayer: boolean): Dictionary<Block, Direction> | null {
        let [sx, sy] = [this.parent.x + this.rx, this.parent.y + this.ry];
        let curr: [number, number, number] = [sx, sy, this.z];

        let [dx, dy] = directionCoords(direction);
        let target = [sx + dx, sy + dy, this.z];

        let [cols, rows] = this.parent.parent.dimensions;
        if (target[0] < 0 || target[0] >= cols || target[1] < 0 || target[1] >= rows)
            return null;

        if (!this.parent.movable)
            return null;

        if (this.parent.isPlayer && !byPlayer)
            return null;

        let currOccupants: [Block, number][] = this.parent.parent.cellMap.getValue(curr);
        if (this.t != SegmentType.Rectangle && currOccupants.length == 2) {
        }

        return new Dictionary<Block, Direction>();
    }

    render(cellSize: number, padding: number = 1): HTMLCanvasElement {
        let [r, g, b] = this.parent.color;
        let color = `rgb(${r}, ${g}, ${b})`;
        let key = [cellSize, padding, this.t, color, this.parent.direction].toString();

        if (!Segment.cache.containsKey(key)) {
            let tile = <HTMLCanvasElement> document.createElement("canvas");
            tile.width = cellSize;
            tile.height = cellSize;

            let ctx = tile.getContext("2d");
            ctx.fillStyle = color;

            let a = padding;
            let b = cellSize - a - 1;
            let path;
            switch (this.t) {
            case SegmentType.Rectangle:
                path = ctx.rect(a, a, b - a + 1, b - a + 1);
                break;
            case SegmentType.BottomLeft:
                path = new Path2D();
                path.moveTo(a, a);
                path.lineTo(a, b);
                path.lineTo(b, b);
                path.closePath();
                break;
            case SegmentType.BottomRight:
                path = new Path2D();
                path.moveTo(a, b);
                path.lineTo(b, a);
                path.lineTo(b, b);
                path.closePath();
                break;
            case SegmentType.TopRight:
                path = new Path2D();
                path.moveTo(a, a);
                path.lineTo(b, a);
                path.lineTo(b, b);
                path.closePath();
                break;
            case SegmentType.TopLeft:
                path = new Path2D();
                path.moveTo(a, a);
                path.lineTo(b, a);
                path.lineTo(a, b);
                path.closePath();
                break;
            }
            ctx.fill(path);

            if (this.parent.movable) {
                ctx.beginPath();
                ctx.strokeStyle = "white";
                if (this.t == SegmentType.Rectangle && this.parent.direction == Direction.Horizontal) {
                    ctx.moveTo(a, (a + b) / 2);
                    ctx.lineTo(b, (a + b) / 2);
                } else if (this.t == SegmentType.Rectangle && this.parent.direction == Direction.Vertical) {
                    ctx.moveTo((a + b) / 2, a);
                    ctx.lineTo((a + b) / 2, b);
                } else if ((this.t == SegmentType.BottomRight || this.t == SegmentType.TopRight) && this.parent.direction == Direction.Horizontal) {
                    ctx.moveTo((a + b) / 2, (a + b) / 2);
                    ctx.lineTo(b, (a + b) / 2);
                } else if ((this.t == SegmentType.BottomLeft || this.t == SegmentType.TopLeft) && this.parent.direction == Direction.Horizontal) {
                    ctx.moveTo(a, (a + b) / 2);
                    ctx.lineTo((a + b) / 2, (a + b) / 2);
                } else if ((this.t == SegmentType.TopLeft || this.t == SegmentType.TopRight) && this.parent.direction == Direction.Vertical) {
                    ctx.moveTo((a + b) / 2, a);
                    ctx.lineTo((a + b) / 2, (a + b) / 2);
                } else if ((this.t == SegmentType.BottomLeft || this.t == SegmentType.BottomRight) && this.parent.direction == Direction.Vertical) {
                    ctx.moveTo((a + b) / 2, (a + b) / 2);
                    ctx.lineTo((a + b) / 2, b);
                }
                ctx.stroke();
            }

            Segment.cache.setValue(key, tile);
        }

        return Segment.cache.getValue(key);
    }
}
