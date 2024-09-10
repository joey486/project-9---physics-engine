// canvasSetup.js
export const canvas = document.getElementById('gameCanvas');
export const ctx = canvas.getContext('2d');

// Set canvas dimensions
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

export const balls = [];
