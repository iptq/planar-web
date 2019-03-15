import { Level } from "./levels";

let data = `
{
    "version": 1,
    "dimensions": [3, 7],
    "goals": [[1, 1], [1, 1]],
    "blocks": [
        {
            "x": 1, "y": 3,
            "segments": [
                {
                    "rx": 0, "ry": 0, "z": 0,
                    "t": 0
                },
                {
                    "rx": 1, "ry": 0, "z": 0,
                    "t": 4
                }
            ],
            "movable": true, "direction": 0, "color": [255, 10, 100]
        },
        {
            "x": 2, "y": 4,
            "segments": [
                {
                    "rx": 0, "ry": 0, "z": 0,
                    "t": 2
                },
                {
                    "rx": 0, "ry": 1, "z": 0,
                    "t": 0
                }
            ],
            "movable": true, "direction": 1, "color": [105, 210, 50]
        },
        {
            "x": 0, "y": 3,
            "segments": [
                {
                    "rx": 0, "ry": 0, "z": 1,
                    "t": 3
                },
                {
                    "rx": 1, "ry": 0, "z": 1,
                    "t": 0
                }
            ],
            "movable": true, "direction": 0, "color": [25, 120, 10]
        },
        {
            "x": 0, "y": 4,
            "segments": [
                {
                    "rx": 0, "ry": 0, "z": 1,
                    "t": 1
                },
                {
                    "rx": 0, "ry": 1, "z": 1,
                    "t": 0
                }
            ],
            "movable": true, "direction": 1, "color": [35, 150, 100]
        },
        {
            "x": 0, "y": 2,
            "segments": [
                {
                    "rx": 0, "ry": 0, "z": 0,
                    "t": 0
                }
            ],
            "movable": false, "direction": 1, "color": [0, 0, 0]
        },
        {
            "x": 2, "y": 2,
            "segments": [
                {
                    "rx": 0, "ry": 0, "z": 1,
                    "t": 0
                }
            ],
            "movable": false, "direction": 1, "color": [0, 0, 0]
        }
    ],
    "players": [
        { "x": 1, "y": 6, "z": 0 },
        { "x": 1, "y": 6, "z": 1 }
    ]
}
`;
let Tutorial = (game) => Level.load(game, data);

export { Tutorial };
