import './game.css'
import { coordinates } from './types';
import { useEffect, useRef, useState } from 'react';
import { setBallPercentage, setPaddlePercentage, setRandomDirection } from './GameUtils';

const SPEED_INCREASE = 0.00002;
let COMPUTER_SPEED = 0.05; 

function BotGame({botMode}) {

	const [ballPosition, setBallPosition] = useState<coordinates>({x : 50, y : 50});
	const [playerPaddlePosition, setPlayerPaddlePosition] = useState<number>(50);
	const [computerPaddlePosition, setComputerPaddlePosition] = useState<number>(50);
	const [playerScore, setPlayerScore] = useState<number>(0);
	const [computerScore, setComputerScore] = useState<number>(0);
	const [paddleHeight, setPaddleHeight] = useState<number>(13);

	const gameIsOn = useRef<boolean>(false);
	const ballDirection = useRef<coordinates>({x : 0, y : 0});
	const ballPercentage = useRef<coordinates>({x : 0, y : 0});
	const paddlePercentage = useRef<coordinates>({x : 0, y :0});
	const velocity = useRef<number>(0.05);
	const animationId = useRef<number>(-1);
	const previousFrame = useRef<number>(0);
	const delta = useRef<number>(0);

	// Calculation ref
	const parentRef = useRef<HTMLDivElement>(null);
	const ballRef = useRef<HTMLDivElement>(null);
	const paddleRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
			const handleVisibilityChange = () => {
			// console.log(botMode);
			  if (!document.hasFocus()) {
				stopTheGame();
			  }
			};
			document.addEventListener('visibilitychange', handleVisibilityChange);
		
			return () => {
			  document.removeEventListener('visibilitychange', handleVisibilityChange);
			};
	}, [])


	// ComputerPaddleUpdate
	function updateComputerPaddle() {
		setComputerPaddlePosition(old => {
			let newPosition = old + (COMPUTER_SPEED * delta.current * (ballPosition.y - old));
	
			if (newPosition <= 0 + (paddlePercentage.current.y / 2))
				newPosition = paddlePercentage.current.y / 2;
			else if (newPosition >= 100 - (paddlePercentage.current.y / 2))
				newPosition = 100 - (paddlePercentage.current.y / 2);
			return (newPosition);
		});
	}

	function updatePlayerPaddle(event : any) {
		if (!gameIsOn.current)
			return ;
		let parentY : number = parentRef.current ? parentRef.current.getBoundingClientRect().top : 0;
		let mouseY : number = event.clientY - parentY;
		let parentHeight : number = parentRef.current ? parentRef.current.getBoundingClientRect().height : 0;
		let positionInPercentage : number = mouseY * 100 / parentHeight;

		if (positionInPercentage <= 0 + (paddlePercentage.current.y / 2))
			positionInPercentage = paddlePercentage.current.y / 2;
		else if (positionInPercentage >= 100 - (paddlePercentage.current.y / 2))
			positionInPercentage = 100 - (paddlePercentage.current.y / 2);
		setPlayerPaddlePosition(positionInPercentage);
	}

	// Ball collisions check
	function checkCollision() {
		// Ball collision with paddles
		let didTouchPlayerPaddle : boolean = ballPosition.y >= (playerPaddlePosition - (paddlePercentage.current.y / 2))
			&& ballPosition.y <= (playerPaddlePosition + (paddlePercentage.current.y / 2))
			&& ballPosition.x <= (1.5 + paddlePercentage.current.x + (ballPercentage.current.x / 2));
		let didTouchComputerPaddle : boolean = ballPosition.y >= (computerPaddlePosition - (paddlePercentage.current.y / 2))
			&& ballPosition.y <= (computerPaddlePosition + (paddlePercentage.current.y / 2))
			&& ballPosition.x >= ((100 - 1.5) - paddlePercentage.current.x - (ballPercentage.current.x / 2));

		if (didTouchPlayerPaddle)
		{
			if (botMode == "hard" && paddleHeight >= 8)
				setPaddleHeight(old => (old - 0.3));
			ballDirection.current.x *= -1;
			return ;
		}
		else if (didTouchComputerPaddle)
		{
			ballDirection.current.x *= -1;
			return ;
		}

		if (ballPosition.x <= (1.5 + paddlePercentage.current.x + (ballPercentage.current.x / 2)))
		{
			setComputerScore(old => old + 1);
			stopTheGame();
		}
		else if (ballPosition.x >= ((100 - 1.5) - paddlePercentage.current.x - (ballPercentage.current.x / 2)))
		{
			setPlayerScore(old => old + 1);
			stopTheGame();
		}

		// Collision with top and bottom of the board
		if (ballPosition.y >= 100 - (ballPercentage.current.y / 2) || ballPosition.y <= 0 + (ballPercentage.current.y / 2))
			ballDirection.current.y *= -1;
	}

	// Start the game
	function startTheGame() {
		// console.log("bot mode : " + botMode);
		if (botMode == "hard")
			COMPUTER_SPEED = 0.06;
		else
			COMPUTER_SPEED = (botMode == "normal" ? 0.0070 : 0.0040);
		// console.log("Computer speed : " + COMPUTER_SPEED);
		gameIsOn.current = true;
		if (animationId.current == -1)
		{
			setRandomDirection(ballDirection);
			animationId.current = window.requestAnimationFrame(animate);
		}
	}

	// Update the ball's coordinates
	function updateBallCoordinates() {
			setBallPosition((old) => {

			let newX = old.x + (ballDirection.current.x * velocity.current * delta.current);
			let newY = old.y + (ballDirection.current.y * velocity.current * delta.current);

			if (newX <= ((1.5 + (ballPercentage.current.x / 2) + paddlePercentage.current.x)))
				newX = 1.5 + (ballPercentage.current.x / 2) + paddlePercentage.current.x;
			else if (newX >= 100 - 1.5 - (paddlePercentage.current.x))
				newX = 100 - 1.5 - (paddlePercentage.current.x);

			if (botMode == "easy" && velocity.current <= 0.1)
				velocity.current += SPEED_INCREASE;
			else
				velocity.current += SPEED_INCREASE;
			
			// console.log("Velocity : " + velocity.current);
			if (newY > 100 - (ballPercentage.current.y / 2))
				newY = 100 - (ballPercentage.current.y / 2);
			else if (newY < 0 + (ballPercentage.current.y / 2))
				newY = ballPercentage.current.y / 2;
			return ({
				x : newX,
				y : newY,
			})});
	}

	// Animate the ball
	function animate(time : number) {
		if (previousFrame.current != 0)
		{
			delta.current = time - previousFrame.current;

			updateBallCoordinates();
		}
		previousFrame.current = time;
		animationId.current = window.requestAnimationFrame(animate);
	}

	// Stop the game
	function stopTheGame() {
		setBallPosition({x : 50, y : 50});
		setComputerPaddlePosition(50);
		setPlayerPaddlePosition(50);
		setPaddleHeight(12);
		previousFrame.current = 0;
		window.cancelAnimationFrame(animationId.current);
		animationId.current = -1;
		ballDirection.current.x  = 0;
		ballDirection.current.y  = 0;
		velocity.current = 0.05;
		gameIsOn.current = false;
	}

	useEffect(() => {
			setBallPercentage(ballPercentage, parentRef, ballRef);
			setPaddlePercentage(paddlePercentage, parentRef, paddleRef);
	}, []);

	useEffect(() => {
		checkCollision();
		updateComputerPaddle();
	}, [ballPosition]);

	return (
		<>
			<button id="game-starter" onClick={startTheGame}>Start</button>
			<div id="game-board" style={{
				backgroundColor: (botMode === "easy") ? "#FF8707" : "#FF6D00"
			}} ref={parentRef} onMouseMove={updatePlayerPaddle}>
			<span className='score player'>{playerScore}</span>
			<span className='score computer'>{computerScore}</span>
				<div id="ball" ref={ballRef} style={{
					top : `${ballPosition.y}%`,
					left : `${ballPosition.x}%`,
				}}></div>

				<div className="vertical-line"></div>
				<div className="circle"></div>
				<div className="player-paddle" ref={paddleRef} style={{
					top : `${playerPaddlePosition}%`,
					height : `${paddleHeight}vh`
				}}> </div>
				<div className="computer-paddle" style={{
					top : `${computerPaddlePosition}%`,
					height : `12vh`
				}}> </div>
			</div>
			<button id="game-starter" onClick={stopTheGame}>Stop</button>
		</>
	)
}

export default BotGame;