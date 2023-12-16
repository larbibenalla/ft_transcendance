import { Ball } from "./interfaces";

export function drawRect(ctx, rec) {
	ctx.fillStyle = rec?.color;
	ctx.fillRect(rec?.x, rec?.y, rec?.widthe, rec?.height);
}

export function drawEnd(canvas) {
	const ctx = canvas.current.getContext("2d");
	if (!ctx) return;
	ctx.clearRect(0, 0, 600, 400);

	ctx.fillStyle = 'red';
	ctx.font = '30px Arial';
	ctx.fillText('Game Over', canvas.width / 2 - 80, canvas.height / 2);

}

export function drawCircle(ctx, cir: Ball) {
	ctx.fillStyle = cir?.color;
	ctx.beginPath();
	ctx.arc(cir?.x, cir?.y, cir?.radius, 0, Math.PI * 2, false);
	ctx.closePath();
	ctx.fill();
}

export function drawtext(ctx, num, x, y, color) {
	ctx.fillStyle = color;
	ctx.font = "40px fantasy";
	ctx.fillText(num, x, y);
}

export function drawLine(ctx, a, b, c, d, e, f, color) {
	ctx.setLineDash([a, b]);
	ctx.strokeStyle = color;
	ctx.strokeRect(c, d, e, f);
}

export function draw(canvas, ball, mPaddle, hPaddle, canvaS) {


	const ctx = canvas.current.getContext("2d");
	if (!ctx) return;
	ctx.clearRect(0, 0, 600, 400);
	drawCircle(ctx, ball);
	drawRect(ctx, mPaddle);
	drawRect(ctx, hPaddle);
	drawLine(ctx, 4, 8, canvaS?.width / 2, 0, 0, 576, "white");

}
