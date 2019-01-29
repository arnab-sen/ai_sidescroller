class Character {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height= 50;
    this.colour = "rgb(255, 255, 255)";
    this.distance = 10;
    this.moving = false;
    this.direction = null;
  }
  
  draw(canvas) {
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = this.colour;
    if (this.moving) {
      this.move(this.direction);
    }
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
  
  move() {
    if (this.direction == null) return;
    
    if (this.direction == "r") {
      this.x += this.distance;
    } else if (this.direction == "l") {
      this.x -= this.distance;
    } else if (this.direction == "u") {
      this.y -= this.distance;
    } else if (this.direction == "d") {
      this.y += this.distance;
    }
  }
  
  moveRandom() {
    var dirs = ["u", "d", "l", "r"];
    this.move(dirs[randomInt(0, 4)]);
  }
  
  stopMoving() {
    this.moving = false;
    this.direction = null;
  }
}

class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.width = 500;
    this.height = 500;
    this.backgroundColour = "rgb(0, 15, 50)";
    this.imageData = null;
    this.snapshotCanvas();
  }
  
  snapshotCanvas() {
    this.imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
  }
  
  redrawCanvas() {
    this.ctx.putImageData(this.imageData, 0, 0);
  }
}

var REFRESH_RATE = 1000 / 60;

var elements = {
  "mainCanvas" : getElement("#mainCanvas")
};

var assets = {
};

function getElement(name) {
  return document.querySelector(name);
}

function setup() {
  window.onload = () => {
    setInterval(runGame, REFRESH_RATE);
  }
  
  document.addEventListener("keydown", keyPress);
  document.addEventListener("keyup", () => assets["mainCharacter"].stopMoving());
  
  
  assets["game"] = new Game(elements["mainCanvas"]);
  assets["mainCharacter"] = new Character(300, 300);
}


function drawChar(x, y, colour = "rgb(255, 255, 255)") {
  var canvas = elements["mainCanvas"];
  var ctx = canvas.getContext("2d");
  
  ctx.fillStyle = colour;
  ctx.fillRect(x, y, 50, 50);
}

function randomInt(low, high) {
  /* Returns a random number in the range [low, high) */
  return Math.floor((Math.random() * high) + low);
}

function keyPress(e) {
  var key = e.keyCode;
  var keys = {"w" : 87,
              "a" : 65,
              "s" : 83,
              "d" : 68
              };
              
  var mc = assets["mainCharacter"];
  mc.moving = true;
  
  if (key == keys["w"]) {
    mc.direction = "u";
  } else if (key == keys["a"]) {
    mc.direction = "l";
  } else if (key == keys["s"]) {
    mc.direction = "d";
  } else if (key == keys["d"]) {
    mc.direction = "r";
  }
}

function runGame() {
  var game = assets["game"];
  var canvas = elements["mainCanvas"];
  var ctx = canvas.getContext("2d");
  var mc = assets["mainCharacter"];
  game.redrawCanvas();
  mc.draw(canvas);
}

function main() {
  setup();
  runGame();
}

main();
