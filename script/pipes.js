/*
 *	PIPES JS
 *	Author: Ritesh Kukreja
 *	Blog: riteshkukreja.wordpress.com
 *	Starting Point: init
 *	Description: This is simple canvas application to show slideshows of pipes running around all over the place.
 *
 *
 *	And yeah I know they cross each other and they shouldn't. Sue me!
 */


/* Holder for Globals */
var canvas, mainContext;

/* Set the number of pipes to show */
var limit = 3; 

/* Arrays to hold the pipes and colors */
var pipes = new Array();
var colors = ['green', 'red', 'blue', 'yellow', 'purple', 'gold'];

/* No of frames per second */
var frames = 1;

/* Time in milliseconds to be given for a single pipe to flow */
var timeForLine = 200;


var Pipe = function(color, width) {
	this.color = color;
	this.width = width;

	// decide initial position
	this.currentX = 0;
	this.currentY = getRandom(0, canvas.height);
}

Pipe.prototype.update = function() {
	// New coordinates to traverse
	this.nextX = getRandom(0, canvas.width);
	this.nextY = getRandom(0, canvas.height);

	// check the sign of the new coordinates
	if(this.nextX < this.currentX) this.signX = -1;
	else this.signX = 1;
	
	if(this.nextY < this.currentY) this.signY = -1;
	else this.signY = 1;

	// set increments to reach destination in timeForLine milliseconds
	this.incrementX = (this.signX) * Math.abs((this.nextX - this.currentX) / timeForLine);
	this.incrementY = (this.signY) * Math.abs((this.nextY - this.currentY) / timeForLine);
}

Pipe.prototype.build = function() {

	// Check for exit condition
	if(this.currentX < 0 || (this.currentX  <= this.nextX && this.signX < 0) || (this.currentX  >= this.nextX && this.signX > 0) || this.currentX > canvas.width) return;
	if(this.currentY < 0 || (this.currentY  <= this.nextY && this.signY < 0) || (this.currentY  >= this.nextY && this.signY > 0) || this.currentY > canvas.height) return;

	// draw on canvas
	mainContext.beginPath();
	mainContext.moveTo(this.currentX, this.currentY);
    mainContext.lineTo(this.currentX + this.incrementX, this.currentY + this.incrementY);
    mainContext.strokeStyle = this.color;
    mainContext.lineWidth = this.width;
    mainContext.lineCap = 'round';
    mainContext.shadowBlur = 2;
    mainContext.shadowColor = 'rgba(180, 180, 180, .6)';
    mainContext.stroke();

    // update current position
    this.currentX = this.currentX + this.incrementX;
    this.currentY = this.currentY + this.incrementY;

    // call itself...don't know how this works but it does!
	var self = this;
    setTimeout(function () {
    	requestAnimationFrame(function() {
    		self.build();
    	});
    }, 0);
}


var getRandom = function(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

var init = function() {

	// Clear the canvas and fill it with gooey color
    mainContext.clearRect(0, 0, canvas.width, canvas.height);
    mainContext.fillStyle = '#444';
    mainContext.fillRect(0, 0, canvas.width, canvas.height);

    // Initialize all the pipes
	for(i = 0 ; i < limit; i++) {
		var line = new Pipe(colors[getRandom(0, colors.length)], getRandom(5, 30));
		pipes.push(line);
	}

	// The magic begins now
	requestAnimationFrame(draw);
}

function draw() {
     
    // Let's draw everything 
    for (var i = 0; i < pipes.length; i++) {
        var line = pipes[i];
        line.update();
        line.build();
    }

    setTimeout(function() {
	    // call the draw function again!
	    requestAnimationFrame(draw);
    }, 1000 / frames);
}

window.onload = function() {

	// Same old ... same old
	canvas = document.getElementById('myCanvas');
	mainContext = canvas.getContext('2d');

	// And here we go...
	init();
}