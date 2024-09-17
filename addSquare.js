import { canvas, shapes} from './canvasSetup.js';
import { Square } from './shapes/square.js';

function addNewSquare() {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const length = Math.random() * 40 + 10; // Random length between 10 and 50
    const color = `hsl(${Math.random() * 360}, 100%, 50%)`; // Random color
    shapes.push(new Square(x, y, length, color));
}

// Add an event listener to the button
document.getElementById('addSquareBtn').addEventListener('click', function() {
    addNewSquare();
});
