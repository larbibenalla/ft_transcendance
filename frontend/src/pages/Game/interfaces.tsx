export interface Paddle {
    x: number;
    y: number;
    widthe: number;
    height: number;
    color: string;
    score: number;
}


export interface canvaState {
    width: number;
    height: number;
}

export interface Ball {
    x: number;
    y: number;
    radius: number;
    speed: number;
    velocityX: number;
    velocityY: number;
    color: string;
}


export interface Gol {
    num: string;
    x: number;
    y: number;
    color: string;
}
