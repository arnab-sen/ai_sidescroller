class Character {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height= 50;
    this.colour = "rgb(255, 255, 255)";
    this.distance = 5;
    this.vY = 0;
    this.airborne = false;
    this.moves = [this.getRandomMove()];
    this.nextMove = this.moves[0];
    this.lastMoveIndex = 0;
    this.defaultGroundOffset = this.height;
  }
  
  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }
  
  getGroundOffset() {
    return assets["game"].height - this.y;
  }
  
  setGroundOffset(offset) {
    this.y = assets["game"].height - offset;
  }
  
  draw(canvas) {
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = this.colour;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
  
  isColliding() {
    var collision = false;
    
    for (var i = 0; i < assets["obstacles"].length; i++) {
      var obs = assets["obstacles"][i];
      
      collision = !(obs.x > (this.x + this.width) ||
                    (obs.x + obs.width) < this.x ||
                    obs.y > (this.y + this.height) ||
                    (obs.y + obs.height) < this.y)
                    
      if (collision) return true;
    }

    return collision;
  }

  collidingLeft(index = 0) {
    for (var i = index; i < assets["obstacles"].length; i++) {
      var obs = assets["obstacles"][i];

      if ((obs.x + obs.width) >= this.x && obs.x < (this.x + this.width) &&
        (this.y + this.height > obs.y)) return true;          
    }

    return false;
  }
  
  collidingRight(index = 0) {
    for (var i = index; i < assets["obstacles"].length; i++) {
      var obs = assets["obstacles"][i];

      if (obs.x <= (this.x + this.width) && (obs.x + obs.width) > this.x &&
        (this.y + this.height > obs.y)) return true;          
    }

    return false;
  }
  
  collidingBottom() {
    for (var i = 0; i < assets["obstacles"].length; i++) {
      var obs = assets["obstacles"][i];
      if ((this.y + this.height) > obs.y && 
        (this.collidingLeft() || this.collidingRight())) {
        return true;    
      }      
    }

    return false;
  }
    
  jump() {
    if (this.collidingBottom()) this.vY = 20; 
  }
  
  applyGravity() {    
    this.y -= this.vY;
    if (this.collidingBottom()) {
      this.y += this.vY;
      while (!this.collidingBottom()) {
        this.y += 1;
      }
      this.vY = 0;
    }
    
    this.vY -= assets["game"].gravity;
  }
  
  move(keyStatus = assets["game"].keyStatus) {
    
    if (keyStatus["w"]) {
      this.jump();
    }
    //console.log(this.collidingLeft(), this.collidingRight());
    this.applyGravity();
        
    if (keyStatus["a"] && (this.x - this.distance) >= 0 && 
      !this.collidingLeft(1)) 
      this.x -= this.distance;
    if (keyStatus["d"] && (this.x + this.width + this.distance) < assets["game"].width &&
      !this.collidingRight(1))
      this.x += this.distance;
  }
  
  moveRandom() {
    var nextMove = this.getNextMove();
    var keyStatus = assets["game"].keyStatus;
    keyStatus[nextMove["key"]] = nextMove["down"];
    this.move();
  }
  
  getRandomMove() {
    var nextMove = {"key" : null, "down" : null};
    var keys = ["a", "d"];
    var down = [true, false];
    
    nextMove["key"] = keys[randomInt(0, 2)];
    nextMove["down"] = down[randomInt(0, 2)];
    
    return nextMove;
  }
  
  getNextMove() {
    if (this.lastMoveIndex == this.moves.length) {
      this.moves.push(this.getRandomMove());
      return this.moves[this.lastMoveIndex];
    } else {
      var nextMove = this.moves[this.lastMoveIndex];
      this.lastMoveIndex++;
      return nextMove;
    }
  }
}

class Obstacle {
  constructor(x = 0, y = 0, width = 50, height = 50) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.rgb = [50, 100, 255];
  }
  
  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }
  
  setDimensions(width, height) {
    this.width = width;
    this.height = height;
  }
  
  setColour(r, g, b) {
    this.rgb = [r, g, b];
  }
  
  getRGBString(r = this.rgb[0], g = this.rgb[1], b = this.rgb[2]) {
    return `rgb(${r}, ${g}, ${b})`;
  }
  
  addToRender(canvas) {
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = this.getRGBString();
    assets["game"].addRender(this);
  }
  
  draw(canvas) {
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = this.getRGBString();
    ctx.fillRect(this.x, this.y, this.width, this.height);
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
    this.itemsToRender = [];
    this.snapshotCanvas();
    this.keyStatus = {"w" : false,
                      "a" : false,
                      "s" : false,
                      "d" : false,
                      "space" : false
                      };
                      
    this.gravity = 1;
  }
  
  addRender(item) {
    this.itemsToRender.push(item);
  }
  
  renderAll() {
    for (var i = 0; i < this.itemsToRender.length; i++) {
      this.itemsToRender[i].draw(this.canvas);
    }
  }
  
  snapshotCanvas() {
    this.imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
  }
  
  redrawCanvas() {
    this.ctx.putImageData(this.imageData, 0, 0);
    this.renderAll();
  }
}

var REFRESH_RATE = 1000 / 60;

var elements = {
  "mainCanvas" : getElement("#mainCanvas")
};

var assets = {
  "mainCharacter" : null,
  "obstacles" : []
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
  assets["mainCharacter"] = new Character();
  assets["mainCharacter"].setPosition(100, assets["game"].height - assets["mainCharacter"].height);
  var ground = new Obstacle(0, assets["game"].height)
  ground.setDimensions(assets["game"].width, 100);
  assets["obstacles"].push(ground);
  assets["ground"] = ground;
  assets["obstacles"].push(new Obstacle(400, 450)); 
  for (var i = 0; i < assets["obstacles"].length; i++) {
    assets["obstacles"][i].addToRender(elements["mainCanvas"]);
  }
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
  
  // Keep the mainCharacter render separate from the rest
  game.redrawCanvas();
  //mc.moveRandom();
  mc.move();
  mc.draw(canvas);
}

function main() {
  setup();
  runGame();
  
  /*
  TODO:
    * Add collision with other objects
    * Add movement tracker array
  */
}

main();
