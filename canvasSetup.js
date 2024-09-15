// canvasSetup.js
export const canvas = document.getElementById('gameCanvas');
export const ctx = canvas.getContext('2d');
export const clear = document.getElementById('clearScreenBtn');

// Physics Engine Parameters
export const gravity = 0.5;
export const friction = 0.9;
export const groundFriction = 0.8; // Added ground friction to prevent squares from sliding infinitely

// Set canvas dimensions
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

export const shapes = [];
