//planet object
function Planet(x,y, big, human) {
	this.x = x;
	this.y = y;
	this.monsters = new Array();
	this.isBig = big;
	this.isHuman = human;
	this.produceMonster = function() {
			
		//calculate random radius of monster position
		var hyp = 30 - 15 * Math.random();
		var sine = 1 - 2 * Math.random();				
		var x =  hyp * sine;
		var y = Math.sqrt(hyp*hyp - x*x);
		
		if (1 - 2 * Math.random() < 0) {
			x = x * -1;
			y = y * -1;
		};
		
		//add monster
		this.monsters.push(new Monster(this.x + x, this.y + y, false));
		
		console.log("monster produced");
	};
}

//monster object
function Monster(x, y, selected) {
	this.x = x;
	this.y = y;
	this.selected = selected;
}

var main = {
	dom : {
		canvas : null
	},
	context : null,
	planets : null,	
	init : function() {
		
		//initialize dom		
		this.dom.canvas = document.createElement("canvas");
		this.context = this.dom.canvas.getContext("2d");
		this.dom.canvas.width = 768;
		this.dom.canvas.height = 480;
		document.body.appendChild(this.dom.canvas);
		
		this.planets = new Array(
			new Planet(100, 150, true, true),
			new Planet(100, 350, false, false)
		);
		console.log("planets initialized");
	},
	produceMonsters : function() {
		//draw planet
		for (i in main.planets) {
			main.planets[i].produceMonster();
		}
	},
	drawPlanet : function(Planet) {
	      
		var radiusSmall = 40;
		var radiusBig = 70;
		
		//set radius
		var radius = radiusSmall;
		if (Planet.isBig) {
			radius = radiusBig;
		}
		
		//set color
		var strokeColor = "#003300";
		var fillColor = "magenta";
		if (Planet.isHuman) {
			strokeColor = "#000033";
			fillColor = "green";
		}

		this.context.beginPath();
		this.context.arc(Planet.x, Planet.y, radius, 0, 2 * Math.PI, false);
		this.context.fillStyle = fillColor;
		this.context.fill();
		this.context.lineWidth = 5;
		this.context.strokeStyle = strokeColor;
		this.context.stroke();
	},
	drawSelection : function() {
		
		if (mouseDown.initX == undefined ||
				mouseDown.initY == undefined) {
				return;
		}
	
		this.context.beginPath();
		this.context.arc(
			(mouseDown.finalX + mouseDown.initX) / 2, 
			(mouseDown.finalY + mouseDown.initY) / 2, 
			mouseDown.radius/2, 0, 2 * Math.PI, false);
		this.context.lineWidth = 3;
		this.context.strokeStyle = '#770000';
		this.context.stroke();
	}, 
	render : function() {
		if (bgReady) {
			this.context.drawImage(bgImage, 0, 0);
		}

		if (humanReady) {		
			//draw planet
			for (i in this.planets) {
				this.context.drawImage(humanImage, this.planets[i].x, this.planets[i].y);
				this.drawPlanet(this.planets[i]);
			}
		}

		if (monsterReady && humanReady) {
			
			//draw monsters
			for (i in this.planets) {
				for (k in this.planets[i].monsters) {				    
					this.context.drawImage(monsterImage, 
						this.planets[i].monsters[k].x, 
						this.planets[i].monsters[k].y 
					);
				}
			}
		}
		
		//draw selection
		this.drawSelection();

		// Score
		this.context.fillStyle = "rgb(250, 250, 250)";
		this.context.font = "24px Helvetica";
		this.context.textAlign = "left";
		this.context.textBaseline = "top";
		this.context.fillText("Goblins caught: " + monstersCaught, 32, 32);
	},
	markSeleted : function() {
		
	}
};

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/space-background.jpg";

//Human image
var humanReady = false;
var humanImage = new Image();
humanImage.onload = function () {
	humanReady = true;
};
humanImage.src = "images/human.png";

// Monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
	monsterReady = true;
};
monsterImage.src = "images/monster.png";

// Game objects
var hero = {
	speed: 256 // movement in pixels per second
};
var monster = {};
var monstersCaught = 0;

// Handle mouse controls

var mouseDown = {
		initX : undefined,
		initY : undefined,
		finalX : undefined,
		finalY : undefined,
		radius : undefined
};

addEventListener("mouseup", function (e) {
	mouseDown.initX = undefined;
	mouseDown.initY = undefined;
	mouseDown.finalX = undefined;
	mouseDown.finalY = undefined;
	mouseDown.radius = undefined;
	
	//calculate selected monsters;
	main.markSelected();
	
	main.render();
}, false);

addEventListener("mousemove", function (e) {
	
	if (mouseDown.initX == undefined ||
		mouseDown.initY == undefined) {
		return;
	} else {
		mouseDown.finalX = e.x;
		mouseDown.finalY = e.y;
		
		var diffX = mouseDown.finalX - mouseDown.initX;
		var diffY = mouseDown.finalY - mouseDown.initY;
		
		mouseDown.radius = Math.sqrt(
				diffX * diffX + 
				diffY * diffY);
	}
	
	main.render();
	
	console.log("mouse move captured");
}, false);


addEventListener("mousedown", function (e) {
	mouseDown.initX = e.x;
	mouseDown.initY = e.y;
}, false);

// Reset the game when the player catches a monster
var reset = function () {
	hero.x = main.canvas.width / 2;
	hero.y = main.dom.canvas.height / 2;

	// Throw the monster somewhere on the screen randomly
	monster.x = 32 + (Math.random() * (canvas.width - 64));
	monster.y = 32 + (Math.random() * (canvas.height - 64));
};

// Update game objects
var update = function (modifier) {

	// Are they touching?
	if (
		hero.x <= (monster.x + 32)
		&& monster.x <= (hero.x + 32)
		&& hero.y <= (monster.y + 32)
		&& monster.y <= (hero.y + 32)
	) {
		++monstersCaught;
		reset();
	}
};

// The main game loop
var loop = function () {
	
	main.produceMonsters();
	
	var now = Date.now();
	var delta = now - then;

	update(delta / 1000);
	main.render();

	then = now;
};

// Let's play this game!
var then = Date.now();
main.init();

setInterval(loop, 1000); // Execute as fast as possible
