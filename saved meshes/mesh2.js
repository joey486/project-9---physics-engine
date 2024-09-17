import { canvas, shapes, ctx } from "../canvasSetup.js";

import { Square } from "../shapes/square.js";

let sideLength = 30;
let squareColor = 'black';

function mesh1() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    shapes.length=0;

    shapes.push(new Square(1000,1000, sideLength, squareColor).setInPlace());
    shapes.push(new Square(1000,960, sideLength, squareColor).setInPlace());
    shapes.push(new Square(1000,920, sideLength, squareColor).setInPlace());
    shapes.push(new Square(1000,880, sideLength, squareColor).setInPlace());
    shapes.push(new Square(1000,840, sideLength, squareColor).setInPlace());
    shapes.push(new Square(1000,800, sideLength, squareColor).setInPlace());
    shapes.push(new Square(1000,760, sideLength, squareColor).setInPlace());
    shapes.push(new Square(1000,720, sideLength, squareColor).setInPlace());
    shapes.push(new Square(1000,680, sideLength, squareColor).setInPlace());
    shapes.push(new Square(1000,640, sideLength, squareColor).setInPlace());

    // shapes.push(new Square(950,1000, sideLength, squareColor).setRotation(0));
    // shapes.push(new Square(950,950, sideLength, squareColor).setRotation(0));
    // shapes.push(new Square(950,900, sideLength, squareColor).setRotation(0));
    // shapes.push(new Square(950,850, sideLength, squareColor).setRotation(0));
    // shapes.push(new Square(950,800, sideLength, squareColor).setRotation(0));
    // shapes.push(new Square(950,750, sideLength, squareColor).setRotation(0));


    shapes.forEach(shape => shape.update(shapes));
}

document.getElementById('mesh2').addEventListener('click', function() {
    mesh1();
});

