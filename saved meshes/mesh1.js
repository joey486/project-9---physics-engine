import { canvas, shapes, ctx } from "../canvasSetup.js";

import { Square } from "../shapes/square.js";

function mesh1() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    shapes.length=0;

    for (var i=0; i<100; i++){
        var x = Math.random() * canvas.width;
        var y = Math.random() * canvas.height;
        var length = Math.random() * 20 + 10;
        shapes.push(new Square(x, y, length, 'hsl(' + Math.random() * 360 + ', 100%, 50%)'));
    }

    shapes.forEach(shape => shape.update(shapes));
}

document.getElementById('mesh1').addEventListener('click', function() {
    mesh1();
});

