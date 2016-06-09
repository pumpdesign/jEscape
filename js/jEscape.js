var myObstacles = [];
var myGamePiece;
var myScore;
var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
var height = (window.innerHeight > 0) ? window.innerHeight : screen.height;
var ratio = height / width;
var res = ratio < 1 ? 'landscape' : 'portrait';
var xFix = res === 'landscape' ? width * 0.3 : width * 0.15;
var evils = [''];
console.log(ratio);
console.log(res);

function startGame() {
    myGameArea.start();
    myGamePiece = new component(30, 30, "red", (width - xFix) / 2,  height - height * 0.3, 'image', 'images/heroe/rocket-launch.svg');
    myScore = new component("1em", 'Russo One', "black", 20, 30, "text");
    //var myObstacle  = new component(10, 200, "green", 300, 120);

}

var myGameArea = {
    canvas : document.getElementById('board'),
    start : function() {
        //this.canvas.width = 480;width
        this.canvas.width = width - xFix;
        //this.canvas.height = 270;
        this.canvas.height = height - height * 0.4;
        this.context = this.canvas.getContext("2d");
        this.interval = setInterval(updateGameArea, 20);
        this.keys = false;
        this.frameNo = 0;
        window.addEventListener('keydown', function (e) {
            myGameArea.keys = (myGameArea.keys || []);
            myGameArea.keys[e.keyCode] = true;
            console.log('keydown');
        });
        window.addEventListener('keyup', function (e) {
            myGameArea.keys[e.keyCode] = false;
            console.log('keyup');
        });
    },
    clear: function(){
      this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
    },
    stop : function() {
        clearInterval(this.interval);
    }
};

function component(width, height, color, x, y, type, path) {
    this.type = type;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.gravity = 0.02;
    this.gravitySpeed = 0;
    this.update = function(){
      ctx = myGameArea.context;
      if (this.type == "text") {
           ctx.font = this.width + " " + this.height;
           ctx.fillStyle = color;
           ctx.fillText(this.text, this.x, this.y);
      } else if (this.type == "image") {
          var source = new Image();
          source.src = path;
          ctx.drawImage(source,this.x, this.y,this.width, this.height);
      } else {
           ctx.fillStyle = color;
           ctx.fillRect(this.x, this.y, this.width, this.height);
      }
    };
    this.newPos = function() {
        //this.gravitySpeed += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY;// + this.gravitySpeed;
        this.hitBottom();
    };
    this.hitBottom = function() {
        var rockbottom = myGameArea.canvas.height - this.height;
        if (this.y > rockbottom) {
            this.y = rockbottom;
            this.gravitySpeed = 0;
        }
    };
    this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    };
}

function updateGameArea() {
  var x, minGap, maxGap;
  for (i = 0; i < myObstacles.length; i += 1) {
      if (myGamePiece.crashWith(myObstacles[i])) {
          myGameArea.stop();
          return;
      }
  }
  myGameArea.clear();
  myGameArea.frameNo += 1;
  if (myGameArea.keys && myGameArea.keys[37]) {myGamePiece.speedX = -2; }
  if (myGameArea.keys && myGameArea.keys[39]) {myGamePiece.speedX = 2; }
  if (myGameArea.keys && myGameArea.keys[38]) {myGamePiece.speedY = -2; }
  if (myGameArea.keys && myGameArea.keys[40]) {myGamePiece.speedY = 2; }
  if (myGameArea.frameNo == 1 || everyinterval(50)) {
      x = myGameArea.canvas.width;
      console.log(x);
      rand = function (){
        return Math.floor(Math.random() * (x - 0)) + 0;
      };
      //myObstacles.push(new component(50, 50, "black", rand(), 0,'image','images/evils/ufo-0' + Math.floor(Math.random() * 8) + '.svg'));
      //myObstacles.push(new component(100, 50, "black", rand(), 0,'image','images/evils/ufo.svg'));
      myObstacles.push(new component(50, 40, "black", rand() - 50, 0,'image','images/evils/alien.svg'));

      //myObstacles.push(new component(30, 30, "black", rand(), 0));
      //myObstacles.push(new component(30, 30, "black", rand(), 0));

      myGamePiece.newPos();
      myGamePiece.update();
  }
  for (i = 0; i < myObstacles.length; i += 1) {
      myObstacles[i].y += 1;
      myObstacles[i].update();
  }
  myScore.text="SCORE: " + myGameArea.frameNo;
  myScore.update();
  myGamePiece.newPos();
  myGamePiece.update();
  myGamePiece.speedX = 0;
  myGamePiece.speedY = 0;
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 === 0) {return true;}
    return false;
}

function accelerate(n) {
    myGamePiece.gravity = n;
}

startGame();
