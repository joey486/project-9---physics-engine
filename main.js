import { canvas, ctx, clear, shapes } from "./canvasSetup.js";
import { Ball } from "./shapes/ball.js";
import { Square } from "./shapes/square.js";

export let selectedShape = null;

let isDragging = false;
let prevMouseX = 0;
let prevMouseY = 0;

function init() {
    shapes.push(new Ball(200, 200, 30, 'red'));
    shapes.push(new Ball(400, 100, 20, 'blue'));
    shapes.push(new Ball(600, 300, 40, 'green'));
    shapes.push(new Square(600, 600, 40, 'black'));
    shapes.push(new Square(400,200, 23, 'gold'));
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    shapes.forEach(shape => shape.update(shapes));
    requestAnimationFrame(animate);
}

// Clear screen function
clear.addEventListener('click', () => {
    shapes.length = 0; // Empty the array
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
});

// Mouse event listeners
canvas.addEventListener('mousedown', (event) => {
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    // Check if any shape is under the cursor
    for (let shape of shapes) {
        if (shape.isUnderCursor(mouseX, mouseY)) {
            selectedShape = shape;
            isDragging = true;
            prevMouseX = mouseX;
            prevMouseY = mouseY;
            break;
        }
    }
});

canvas.addEventListener('mousemove', (event) => {
    if (isDragging && selectedShape) {
        const mouseX = event.clientX;
        const mouseY = event.clientY;

        // Calculate velocity based on mouse movement
        let deltaX = mouseX - prevMouseX;
        let deltaY = mouseY - prevMouseY;

        // Update ball position
        selectedShape.x = mouseX;
        selectedShape.y = mouseY;

        // Set velocity of the ball based on mouse movement
        selectedShape.dx = deltaX/2;
        selectedShape.dy = deltaY/2;

        // Store the current mouse position for the next movement
        prevMouseX = mouseX;
        prevMouseY = mouseY;
    }
});

canvas.addEventListener('mouseup', () => {
    isDragging = false;
    selectedShape = null;
});

// execute 

init();
animate();



//Cursor code
const cursorDot = document.querySelector("[data-cursor-dot]");
const cursorOutline = document.querySelector("[data-cursor-outline]");

window.addEventListener("mousemove", function (e){
    const posX = e.clientX;
    const posY = e.clientY;

    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;

    //cursorOutline.style.left = `${posX}px`;
    //cursorOutline.style.top = `${posY}px`;

    cursorOutline.animate({
        left: `${posX}px`,
        top: `${posY}px`
    }, {duration: 250, fill: "forwards"});
});
