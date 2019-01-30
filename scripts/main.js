class Character {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height= 50;
    this.colour = "rgb(255, 255, 255)";
    this.distance = 5;
  }
  
  draw(canvas) {
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = this.colour;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
  
  move() {
    var keyStatus = assets["game"].keyStatus;  
    if (keyStatus["w"]) this.y -= this.distance;
    if (keyStatus["a"]) this.x -= this.distance;
    if (keyStatus["s"]) this.y += this.distance;
    if (keyStatus["d"]) this.x += this.distance;
  }
  
  moveRandom() {
    var dirs = ["u", "d", "l", "r"];
    this.move(dirs[randomInt(0, 4)]);
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
    this.keyStatus = {"w" : false,
                      "a" : false,
                      "s" : false,
                      "d" : false,
                      "space" : false
                      };
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
  
  document.addEventListener("keydown", e => keyPress(e, down = true));
  document.addEventListener("keyup", e => keyPress(e, down = false));
  
  
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

function keyPress(e, down = true) {
  var keys = {87 : "w",
              65 : "a",
              83 : "s",
              68 : "d"
              };
  var keyStatus = assets["game"].keyStatus;       
  keyStatus[keys[e.keyCode]] = down;
}

function runGame() {
  var game = assets["game"];
  var canvas = elements["mainCanvas"];
  var ctx = canvas.getContext("2d");
  var mc = assets["mainCharacter"];
  game.redrawCanvas();
  mc.move();
  mc.draw(canvas);
}

function main() {
  setup();
  runGame();
  
  /*
  TODO:
    * Add collision detection
    * Add canvas boundary
    * Add multi key support
    * Add jump
  */
}

main();
