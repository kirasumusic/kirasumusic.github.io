var handImgs = [];
var handMode = {open: 0, closed: 1, opening: 2, closing: 3};
var status = handMode.open;
var previousStatus = handMode.opening;
var numOpens = 0;
var currentImage = 1;
var handTime = 0;
var apple;
var handShadow, handSansShadow;
var currentItem = 0;
var items = [];
var itemsScale = [.15, .15, .15, .15, .15, .13];
var starImgs = [];
var stars = [];
var boxesFull = false;
var wentThroughBox = false;
var currentBox = 0;
var currSelected = false;

var lastTouched = "top";

function preload() {
  for (var i = 0; i < 5; i++ ) {
    handImgs[i] = loadImage("assets/hand/hand" + i + ".jpg");
  }
  for (var i = 0; i < 6; i++ ) {
    items[i] = loadImage("assets/hand/const" + i + "_blk.svg");
    starImgs[i] = loadImage("assets/hand/const" + i + "_w.svg");
  }
  // items[0] = loadImage("assets/hand/apple.png");
  // items[1] = loadImage("assets/hand/worm.png");
  // items[2] = loadImage("assets/hand/orchid.png");
  handShadow = loadImage("assets/hand/hand2_shadow.png");
  handSansShadow = loadImage("assets/hand/hand2_sans_shadow.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);

  for (var i = 0; i < 50; i++ ) {
    stars[i] = new Star(i%6);
  }
}

function draw() {
  background(0);

  if (!boxesFull || wentThroughBox) rotateOnMouse();
  else rotateBoxes(3, 1000);
  //else autoRotate(3, 1000);

  for (var i = 0; i < 4; i++) {
    var rs = items[0].height*itemsScale[0];
    noFill();
    strokeWeight(3);
    stroke(255);
    rect(width/2 +i*rs - rs*2, 150, rs, rs);
  }

  for (var i = 0; i < stars.length; i++ ) {
    stars[i].display();
    stars[i].mouseOver();
    stars[i].move();
  }
}

function rotateOnMouse() {
  if (lastTouched == "top" && getHandQuadrant() == 4) {
    lastTouched == "bottom";
    changeItem();
  }
  else if (lastTouched == "bottom" &&  getHandQuadrant() == 0) {
    lastTouched == "top";
  }
  drawHand(getHandQuadrant(), currentItem);
}

function rotateBoxes(speed, delay) {
  openClose(speed, delay, currentBox);
  if (status == handMode.closed && previousStatus == handMode.closing) {
    getNextBox();
    numOpens++;
  }
  previousStatus = status;
}

function autoRotate(speed, delay) {
  openClose(speed, delay, currentItem);
  if (status == handMode.closed && previousStatus == handMode.closing) {
    //if (numOpens > 0) {
      changeItem();
    //}
    numOpens++;
  }
  previousStatus = status;
}

function openClose(speed, delay, objNum) {
  if (status == handMode.open) {
    currentImage = 0;
    if (millis() - handTime > delay) status = handMode.closing;
  }
  else if (status == handMode.closed) {
    currentImage = handImgs.length-1;
    if (millis() - handTime > delay) status = handMode.opening;
  }
  else if (status == handMode.opening) openHand(speed);
  else if (status == handMode.closing) closeHand(speed);
  drawHand(currentImage, objNum);
}

function closeHand(speed) {
  if(frameCount%speed === 0) {
    currentImage++;
    if(currentImage === handImgs.length-1) {
      status = handMode.closed;
      handTime = millis();
    }
  }
}

function openHand(speed) {
  if(frameCount%speed === 0) {
    currentImage--;
    if(currentImage === 0) {
      status = handMode.open;
      handTime = millis();
    }
  }
}

function getHandQuadrant() {
  var m = floor(map(mouseY, 0, windowHeight, 0, 5));
  if (m > 4) m = 4;
  else if (m < 0) m = 0;
  return m;
}

function drawHand(num, objNum) {
  if (num == 2 ) {
    image(handImgs[2], width/2, height/2);
    drawItem(objNum);
    image(handSansShadow, width/2, height/2);
    image(handShadow, width/2, height/2);
  }
  else if (num == 1) {
    image(handImgs[num], width/2, height/2);
    push();
    translate(-1, 0);
    drawItem(objNum);
    pop();
  }
  else if (num == 0) {
    image(handImgs[num], width/2, height/2);
    push();
    translate(-2, 0);
    drawItem(objNum);
    pop();
  }
  else if (num == 3) {
    image(handImgs[num], width/2, height/2);
  }
  else {
    image(handImgs[num], width/2-5, height/2);
  }
}

function getNextBox() {
  currentBox++;
  if (currentBox == boxes.length) {
    currentBox = 0;
    wentThroughBox = true;
  }
}

function changeItem() {
  currentItem++;
  if (currentItem == items.length) currentItem = 0;
}

function drawItem(num) {
  push();
  translate(width/2, height/2+20);
  scale(itemsScale[num]);
  image(items[num], 0,0);
  pop();
}

function Star(pic) {
  this.pic = pic;
  this.isSelected = false;
  this.hasSnapped = false;
  this.show = true;
  this.dragStart = {x: 0, y: 0};
  //this.pic = floor(random(6));
  if (floor(random(2)) == 0) {
    this.x = random(width/2-150);
  }
  else {
    this.x = random(width/2 + 100, width);
  }
  this.y = random(height/10, height*9/10);
  this.angle = random(2 * PI);

  this.display = function() {
    image(starImgs[this.pic], this.x, this.y);
  }
  this.mouseOver = function() {
    var w = starImgs[this.pic].width;
    var h = starImgs[this.pic].height;
    if (mouseX > this.x-w/2 && mouseX < this.x + w/2 && mouseY > this.y - h/2 && mouseY < this.y + h/2) {

      noStroke();
      fill(255, 30);
      ellipse(this.x , this.y, w);
      fill(255, 50);
      ellipse(this.x, this.y, w*.75);
      fill(255, 70);
      ellipse(this.x, this.y, w*.5);
      return true;
    }
    return false;
  }
  this.move = function() {
    if (this.isSelected) {
      this.x = mouseX-this.dragStart.x;
      this.y = mouseY-this.dragStart.y;
    }
  }
  this.reset = function () {
    if (this.isSelected) {
      this.isSelected = false;
      this.dragStart.x = 0;
      this.dragStart.y = 0;
    }
    this.isSelected = false;
    this.dragStart.x = 0;
    this.dragStart.y = 0;
  }
  this.checkSelected = function () {
    if (this.mouseOver()) {
      if (!currSelected && !this.hasSnapped) {
        this.dragStart.x = mouseX - this.x;
        this.dragStart.y = mouseY - this.y;
        this.isSelected = true;
        currSelected = true;
      }
    }
  }
}

function mousePressed() {
  for (var i = 0; i < stars.length; i++) {
    stars[i].checkSelected();
  }
}

function mouseReleased() {
  currSelected = false;
  for (var i = 0; i < stars.length; i++) {
    stars[i].reset();
  }
}


function keyPressed() {
  if (keyCode == LEFT_ARROW) {
    window.location.href='rite-of-spring.html';
  }
  else if (keyCode == RIGHT_ARROW) {
    window.location.href='cycles.html';
  }
}
