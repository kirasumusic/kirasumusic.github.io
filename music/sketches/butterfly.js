var backgroundImg, butterfly;
var butterflyParts = {body: [], left: [], right:[]};
var moveStep = 0;
var moveD = 1;
var mode = 0;
var currSelected = false;
var bScale = .5;

function preload() {
  backgroundImg = loadImage("assets/delta/background.jpg");
  bScale = map(windowWidth, 345, 1500, 345/1500*.5, .5);
  butterflyParts.body[0] = new ButterflyPart(loadImage("assets/delta/butterfly_body.png"), windowWidth/2, windowHeight/2, false);
  butterflyParts.left[0] = new ButterflyPart(loadImage("assets/delta/bottomLeft.png"), windowWidth/2-120*bScale*2, windowHeight/2+30*bScale*2, false);
  butterflyParts.left[1] = new ButterflyPart(loadImage("assets/delta/topLeft.png"), windowWidth/2-150*bScale*2, windowHeight/2-150*bScale*2, false);
  butterflyParts.left[2] = new ButterflyPart(loadImage("assets/delta/topLeft_0.png"), windowWidth/2-280*bScale*2, windowHeight/2-300*bScale*2, false);
  butterflyParts.left[3] = new ButterflyPart(loadImage("assets/delta/middleLeft.png"), windowWidth/2-190*bScale*2, windowHeight/2+100*bScale*2, false);

  butterflyParts.right[0] = new ButterflyPart(loadImage("assets/delta/bottomRight.png"), windowWidth/2+150*bScale*2, windowHeight/2+30*bScale*2, true);
  butterflyParts.right[1] = new ButterflyPart(loadImage("assets/delta/bottomRight_0.png"), windowWidth/2+190*bScale*2, windowHeight/2+100*bScale*2, true);
  butterflyParts.right[2] = new ButterflyPart(loadImage("assets/delta/topRight.png"), windowWidth/2+130*bScale*2, windowHeight/2-150*bScale*2, true);
  butterflyParts.right[3] = new ButterflyPart(loadImage("assets/delta/topRight_0.png"), windowWidth/2+210*bScale*2, windowHeight/2-280*bScale*2, true);
  butterflyParts.right[4] = new ButterflyPart(loadImage("assets/delta/topRight_1.png"), windowWidth/2+250*bScale*2, windowHeight/2-300*bScale*2, true);
  //butterflyParts.right[5] = new ButterflyPart(loadImage("assets/delta/middleRight.png"), windowWidth/2+280, windowHeight/2, true);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
}



function draw() {
  if (millis() > 10000) mode = 1;
  imageMode(CORNER);
  background(backgroundImg);
  imageMode(CENTER);

  // left wing
  moveStep+= 1 * moveD;

  if (moveStep > 200) moveD = -1;
  else if (moveStep < 0) moveD = 1;

  translate(0, 100);
  for (var i = 0; i < butterflyParts.left.length; i++) {
    butterflyParts.left[i].display();
    butterflyParts.left[i].move();
    //butterflyParts.left[i].update(moveStep);
  }

  for (var i = 0; i < butterflyParts.right.length; i++) {
    butterflyParts.right[i].display();
    butterflyParts.right[i].move();
    //butterflyParts.right[i].update(moveStep);
  }

  // body
  imageMode(CENTER);
  image(butterflyParts.body[0].img, butterflyParts.body[0].x, butterflyParts.body[0].y, butterflyParts.body[0].img.width*bScale, butterflyParts.body[0].img.height*bScale);
}



function ButterflyPart(img, x, y, dir) {
  this.img = img;
  this.x = x;
  this.y = y;
  this.startX = x;
  this.startY = y;
  this.dir = dir;
  this.origM = Math.sqrt((windowWidth/2 - this.x)*(windowWidth/2 - this.x)+(this.y - windowHeight/2)*(this.y - windowHeight/2));
  this.angle = atan((this.y - windowHeight/2)/(this.x-windowWidth/2));
  this.isSelected = false;
  this.dragStart = {x: 0, y: 0};
  //else this.angle = atan((this.y - windowHeight/2)/(windowWidth/2 - this.x));
  //this.angle = radians(random(360));
  this.display = function() {
    // if (mode == 0) {
    //   if (this.mouseOver()) {
    //     imageMode(CENTER);
    //     image(this.img, this.x, this.y, this.img.width/2, this.img.height/2);
    //   }
    // }
    // else {
      imageMode(CENTER);
      image(this.img, this.x, this.y, this.img.width*bScale, this.img.height*bScale);
      noFill();
      strokeWeight(2);
      stroke(0, width, width);
      rect(this.x-this.img.width/2*bScale, this.y-this.img.height/2*bScale, this.img.width*bScale, this.img.height*bScale);
    //}
  };
  this.mouseOver = function() {
    //imageMode(CORNER);
    return (mouseX > this.x-this.img.width/2*bScale && mouseX < this.x + this.img.width/2*bScale && mouseY > this.y-this.img.height/2*bScale && mouseY < this.y + this.img.height/2*bScale);
  }
  this.checkSelected = function () {
    if (this.mouseOver() && !currSelected) {
      this.dragStart.x = mouseX - this.x;
      this.dragStart.y = mouseY - this.y;
      this.isSelected = true;
      currSelected = true;
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
