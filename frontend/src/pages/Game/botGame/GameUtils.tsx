export function setRandomDirection(ballDirection : any) : void {
	let randomAngleToRight1 = giveRandomNumberBetween(Math.PI / 6, Math.PI / 4);
	let randomAngleToRight2 = giveRandomNumberBetween(11 * Math.PI / 6, 7 * Math.PI / 4);
	let randomAngleToLeft1 = giveRandomNumberBetween(5 * Math.PI / 6, 3 * Math.PI / 4);
	let randomAngleToLeft2 = giveRandomNumberBetween(7 * Math.PI / 6, 5 * Math.PI / 4);
	let leftRandom = (Math.ceil(Math.random() * 10) % 2 == 1) ? randomAngleToLeft1 : randomAngleToLeft2;
	let rightRandom = (Math.ceil(Math.random() * 10) % 2 == 1) ? randomAngleToRight1 : randomAngleToRight2;
	let randomAngle = (Math.ceil(Math.random() * 10) % 2 == 1) ? leftRandom : rightRandom;

	ballDirection.current.x = Math.cos(randomAngle);
	ballDirection.current.y = Math.sin(randomAngle);
}

export function setBallPercentage(ballPercentage : any, parentRef : any, ballRef : any) : void {
	let parentWidth = parentRef.current.getBoundingClientRect().width;
	let parentHeight = parentRef.current.getBoundingClientRect().height;

	ballPercentage.current.x = ballRef.current.getBoundingClientRect().width * 100 / parentWidth;
	ballPercentage.current.y = ballRef.current.getBoundingClientRect().height * 100 / parentHeight;
}

export function setPaddlePercentage(paddlePercentage : any, parentRef : any, paddleRef : any) {
	let parentHeight = parentRef.current.getBoundingClientRect().height;
	let parentWidth = parentRef.current.getBoundingClientRect().width;

	paddlePercentage.current.y = paddleRef.current.getBoundingClientRect().height * 100 / parentHeight;
	paddlePercentage.current.x = paddleRef.current.getBoundingClientRect().width * 100 / parentWidth;
}

function giveRandomNumberBetween(min : number, max : number) : number {
	return (Math.random() * (max - min) + min);
}