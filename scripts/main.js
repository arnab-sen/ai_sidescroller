class Character {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height= 50;
    this.colour = "rgb(255, 255, 255)";
    this.distance = 5;
    this.verticalVelocity = 0;
    this.airborne = false;
  }
  
  draw(canvas) {
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = this.colour;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
  
  move(keyStatus = assets["game"].keyStatus) {
    if (keyStatus["w"] || this.airborne) this.jump();
    if (keyStatus["a"] && (this.x - this.distance) >= 0) this.x -= this.distance;
    if (keyStatus["d"] && (this.x + this.width) < assets["game"].width) {
      this.x += this.distance;
    }
  }
  
  moveRandom() {
    var keys = ["w", "a", "s", "d"];
    var keyStatus = {"w" : false, "a" : false, "s" : false, "d" : false};
    var numKeys = randomInt(0, keys.length);
    for (var i = 0; i < numKeys; i++) {
      keyStatus[keys[randomInt(0, keys.length)]] = true;
    }
    this.move(keyStatus = keyStatus);
  }
  
  jump() {
    if (!this.airborne) this.verticalVelocity = 20;
    if (this.verticalVelocity < -20) {
      this.airborne = falwse;
      return;
    }
    this.airborne = true;
    this.y -= this.verticalVelocity;
    this.verticalVelocity -= assets["game"].gravity;
  }
}

class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.width = canvas.width;
    this.height = canvas.height;
    this.backgroundColour = "rgb(0, 15, 50)";
    this.imageData = null;
    this.snapshotCanvas();
    this.keyStatus = {"w" : false,
                      "a" : false,
                      "s" : false,
                      "d" : false,
                      "space" : false
                      };
                      
    this.gravity = 1;
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
    * Add jump
  */
}

main();
