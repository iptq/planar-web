export interface IGoal {
    x: number;
    y: number;
}

export class Goal {
    x: number;
    y: number;

    constructor(data: IGoal) {
        this.x = data.x;
        this.y = data.y;
    }
}
