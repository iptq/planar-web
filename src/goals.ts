export interface IGoal {
    x: number;
    y: number;
}

export class Goal {
    x: number;
    y: number;

    static from(data: IGoal): Goal {
        let goal = new Goal();
        goal.x = data.x;
        goal.y = data.y;
        return goal;
    }
}
