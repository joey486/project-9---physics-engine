import { canvas, shapes} from './canvasSetup.js';
import { Ball } from './shapes/ball.js';

function addNewBall() {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const radius = Math.random() * 40 + 10; // Random radius between 10 and 50
    const color = `hsl(${Math.random() * 360}, 100%, 50%)`; // Random color
    shapes.push(new Ball(x, y, radius, color));
}

// Add an event listener to the button
document.getElementById('addBallBtn').addEventListener('click', function() {
    addNewBall();
});
