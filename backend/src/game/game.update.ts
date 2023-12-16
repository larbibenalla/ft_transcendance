import { Paddle, Ball, canvaState } from "./game.interface";

export function movePaddle(myp: Paddle, mouseY, canva: canvaState) {
	myp.y = mouseY - myp.height / 2
	if (myp.y + myp.height > canva.height)
		myp.y = canva.height - myp.height
	if (myp.y < 0)
		myp.y = 0
	return myp;
}

export function botPaddle(paddle: Paddle, canva: canvaState, ball: Ball, mode: string) {
	paddle.y += ball.y - (paddle.y + paddle.height / 2);
	if (paddle.y + paddle.height > canva.height)
		paddle.y = canva.height - paddle.height
	if (paddle.y < 0)
		paddle.y = 0
	return paddle
}

export function restBall(ball: Ball, canva: canvaState) {
	ball.x = canva.width / 2,
	ball.y = canva.height / 2,
	ball.radius = 10,
	ball.speed = 2.5,
	ball.velocityX = 0,
	ball.velocityY = 0,
	ball.score_my = ball.score_my,
	ball.score_her = ball.score_her,
	ball.color = "white",
	ball.angle = setRandomDirection(),
	ball.isSet = false
	return ball;
}

export function update(ball: Ball, canva: canvaState, myp: Paddle, herp: Paddle, mode: string) {

	if (ball.velocityX == 0 && ball.velocityY == 0) {
		ball.velocityX = Math.cos(ball.angle);
		ball.velocityY = Math.sin(ball.angle);
	}
	ball.x += ball.velocityX * ball.speed;
	ball.y += ball.velocityY * ball.speed;

	if (mode && !ball.isSet)
	{
		ball.speed = 6;
		ball.isSet = true;
	}
	else if (!mode)
		ball.speed += 0.0005;

	let player = (ball.x < canva.width / 2) ? myp : herp;

	if (ball.y + ball.radius > canva.height || ball.y - ball.radius < 0)
		ball.velocityY *= -1;
	else if ((ball.x - ball.radius < (myp.x + myp.widthe)) && ((ball.y + ball.radius) < myp.y || (ball.y - ball.radius) > (myp.y + myp.height))) {
		ball.score_her++;
		ball = restBall(ball, canva);
		myp.height = 100;
	}
	else if ((ball.x + ball.radius > herp.x) && ((ball.y + ball.radius) < herp.y || (ball.y - ball.radius) > (herp.y + herp.height))) {
		ball.score_my++;
		ball = restBall(ball, canva);
		myp.height = 100;
	}
	else if ((player == herp) && (ball.x + ball.radius > player.x)) {
		let center = ((ball.y - (player.y + player.height / 2)) / (player.height / 2));
		let angle = center * (Math.PI / 3);
		if (angle > Math.PI / 3)
			angle = Math.PI / 3;
		ball.velocityX = Math.cos(angle) * -1;
		ball.velocityY = Math.sin(angle) * -1;
		botCustomization(ball, mode, myp);
	}
	else if ((player == myp) && (ball.x - ball.radius < player.x + player.widthe)) {
		let center = ((ball.y - (player.y + player.height / 2)) / (player.height / 2));
		let angle = center * (Math.PI / 3);
		ball.velocityX = Math.cos(angle);
		ball.velocityY = Math.sin(angle);
		botCustomization(ball, mode, myp);
	}

	return ball;
}

export function setRandomDirection() {
	let randomAngleToRight1 = giveRandomNumberBetween(0.17453277559, 0.43633216339);
	let randomAngleToRight2 = giveRandomNumberBetween(5.84685314378, 6.10865253158);
	let randomAngleToLeft1 = giveRandomNumberBetween(2.70526049019, 2.96705987799);
	let randomAngleToLeft2 = giveRandomNumberBetween(3.31612542919, 2.79252665359);
	let leftRandom = (Math.ceil(Math.random() * 10) % 2 == 1) ? randomAngleToLeft1 : randomAngleToLeft2;
	let rightRandom = (Math.ceil(Math.random() * 10) % 2 == 1) ? randomAngleToRight1 : randomAngleToRight2;

	return ((Math.ceil(Math.random() * 10) % 2 == 1) ? leftRandom : rightRandom);
}

function giveRandomNumberBetween(min: number, max: number): number {
	return (Math.random() * (max - min) + min);
}

function botCustomization(ball, mode, myp) {
	if (mode === "normal" || mode === "hard")
		ball.speed += 0.2;
	if (mode === "hard" && myp.height > 30)
			myp.height -= 3;
}