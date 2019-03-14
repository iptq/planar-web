import { Block } from "./blocks";

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
    Up,
    Down,
    Left,
    Right,
}

export class Segment {
    static cache: { [key: string]: HTMLCanvasElement } = {};

    parent: Block;
    rx: number;
    ry: number;
    z: number;
    t: SegmentType;

    static from(parent: Block, data: ISegment) {
        let segment = new Segment();
        segment.parent = parent;
        segment.rx = data.rx;
        segment.ry = data.ry;
        segment.z = data.z;
        segment.t = data.t;
        return segment;
    }

    render(cellSize: number, padding: number = 1): HTMLCanvasElement {
        let [r, g, b] = this.parent.color;
        let color = `rgb(${r}, ${g}, ${b})`;
        let key = [cellSize, padding, this.t, color, this.parent.direction].toString();

        if (!(key in Segment.cache)) {
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

            Segment.cache[key] = tile;
        }

        return Segment.cache[key];
    }
}
