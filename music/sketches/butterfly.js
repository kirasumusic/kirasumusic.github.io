var backgroundImg, butterfly;
var butterflyParts = {body: [], left: [], right:[]};
var moveStep = 0;
var moveD = 1;
var mode = 0;
var currSelected = false;
var bScale = .4;
var movingApart = true;
var audio;

function preload() {
  backgroundImg = loadImage("assets/delta/background.jpg");
  bScale = map(windowWidth, 345, 1500, 345/1500*.5, .5);
  butterflyParts.body[0] = new ButterflyPart(loadImage("assets/delta/butterfly_body.png"), -150, -450, false);
  butterflyParts.left[0] = new ButterflyPart(loadImage("assets/delta/bottomLeft.png"), -420, -30, true);
  butterflyParts.left[1] = new ButterflyPart(loadImage("assets/delta/topLeft.png"), -730, -180*3, true);
  butterflyParts.left[2] = new ButterflyPart(loadImage("assets/delta/topLeft_0.png"),-700, -550, true);
  //butterflyParts.left[3] = new ButterflyPart(loadImage("assets/delta/middleLeft.png"), -190*bScale*2, 100*bScale*2, true);

  butterflyParts.right[0] = new ButterflyPart(loadImage("assets/delta/bottomRight.png"), 10, -20, true);
  butterflyParts.right[1] = new ButterflyPart(loadImage("assets/delta/bottomRight_0.png"), 250, 200, true);
  butterflyParts.right[2] = new ButterflyPart(loadImage("assets/delta/topRight.png"), 10, -175*3, true);
  butterflyParts.right[3] = new ButterflyPart(loadImage("assets/delta/topRight_0.png"), 300, -650, true);
  butterflyParts.right[4] = new ButterflyPart(loadImage("assets/delta/topRight_1.png"), 450, -580, true);
  //butterflyParts.right[5] = new ButterflyPart(loadImage("assets/delta/middleRight.png"), windowWidth/2+280, windowHeight/2, true);
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  butterflyParts.body[0].resizePart(bScale);
  for (var i = 0; i < butterflyParts.left.length; i++) {
    butterflyParts.left[i].resizePart(bScale);
  }

  for (var i = 0; i < butterflyParts.right.length; i++) {
    butterflyParts.right[i].resizePart(bScale);
  }
}



function draw() {
  //if (movingApart) {
  background(0);
  //background(backgroundImg);

  // left wing
  // moveStep+= 1 * moveD;
  //
  // if (moveStep > 200) moveD = -1;
  // else if (moveStep < 0) moveD = 1;

  //translate(0, 100);

  for (var i = 0; i < butterflyParts.left.length; i++) {
    butterflyParts.left[i].display();
    butterflyParts.left[i].mouseOver();
    butterflyParts.left[i].move();
    //butterflyParts.left[i].update(moveStep);
  }

  for (var i = 0; i < butterflyParts.right.length; i++) {
    butterflyParts.right[i].display();
    butterflyParts.right[i].mouseOver();
    butterflyParts.right[i].move();
    //butterflyParts.right[i].update(moveStep);
  }
  butterflyParts.body[0].display();
  // body
  // //imageMode(CENTER);
  // butterflyParts.body[0].display();
  //butterflyParts.body[0].move();
  //image(butterflyParts.body[0].img, butterflyParts.body[0].x, butterflyParts.body[0].y, butterflyParts.body[0].img.width*bScale, butterflyParts.body[0].img.height*bScale);
}



function ButterflyPart(img, x, y, dir) {
  this.img = img;
  this.finalX = windowWidth/2 + x*bScale;
  this.finalY = windowHeight/2 + y*bScale;
  this.dir = dir;
  this.x = this.finalX;
  this.y = this.finalY;
  this.alreadyChanged = false;
  this.isSelected = false;
  this.show = true;
  this.dragStart = {x: 0, y: 0};
  this.lastChecked = 0;
  this.resizePart = function(s) {
    this.img.resize(this.img.width*s, this.img.height*s);
  }
  this.randomize = function() {
    if (this.dir) {
      this.x = random(windowWidth/10, windowWidth*9/10);
      this.y = random(0, windowHeight/2);
    }
  }
  this.resetRandom = function() {
    this.alreadyChanged = false;
  }
  this.display = function() {
    var startT = 4;
    var endT = 8;
    var showT = 2;
    var hideT = 1;


    if (audio.currentTime > startT && (audio.currentTime < endT)) {
      if (this.show && (millis() - this.lastChecked > showT)) {
        console.log(3);
        this.show = false;
        this.lastChecked = millis();
      }
      else if (!this.show && (millis() - this.lastChecked > hideT)) {
        console.log(2);
        this.randomize();
        this.show = true;
        this.lastChecked = millis();
      }
    }
    else if (audio.currentTime > endT) {
      this.show = true;
    }

    if (this.show) image(this.img, this.x, this.y);
  }
  this.mouseOver = function() {

    if (mouseX > this.x && mouseX < this.x + this.img.width && mouseY > this.y && mouseY < this.y + this.img.height){
      noFill();
      stroke(0, 255, 255);
      ellipse(this.x + this.img.width/2, this.y+ this.img.height/2, this.img.width);
      return true;
    };
    return false;
  }
  this.checkSelected = function () {
    if (this.mouseOver()) {
      if (!currSelected) {
        this.dragStart.x = mouseX - this.x;
        this.dragStart.y = mouseY - this.y;
        this.isSelected = true;
        currSelected = true;
      }
    }
  }
  this.move = function() {
    if (this.isSelected) {
      this.x = mouseX-this.dragStart.x;
      this.y = mouseY-this.dragStart.y;
    }
  }
  this.reset = function () {
    this.isSelected = false;
    this.dragStart.x = 0;
    this.dragStart.y = 0;
  }
  this.update = function(ms) {
    if (mode == 1) {
      if (dir) {
        this.x = windowWidth/2 + (this.origM+ms) * cos(this.angle);
        this.y = windowHeight/2 + (this.origM+ms) * sin(this.angle);
      }
      else {
        this.x = windowWidth/2 - (this.origM+ms) * cos(this.angle);
        this.y = windowHeight/2 - (this.origM+ms) * sin(this.angle);
      }
    }
    else {
      this.x = this.startX;
      this.y = this.startY;
    }
  }
}

function mouseReleased() {
  currSelected = false;
  for (var i = 0; i < butterflyParts.left.length; i++) {
    butterflyParts.left[i].reset();
  }
  for (var i = 0; i < butterflyParts.right.length; i++) {
    butterflyParts.right[i].reset();
  }
}

function mousePressed() {
  for (var i = 0; i < butterflyParts.left.length; i++) {
    butterflyParts.left[i].checkSelected();
  }
  for (var i = 0; i < butterflyParts.right.length; i++) {
    butterflyParts.right[i].checkSelected();
  }
}

window.onload = function() {
  audio = document.getElementById('myAudio');
  audio.play();
}
