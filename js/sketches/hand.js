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
var currSelected = null;
var boxes = [];
var allMatched = false;

var lastTouched = "top";
var musicplayer;


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

  musicplayer = new MusicPlayer("Delta Waves", "deltaWaves", 'cycles', "song-for-m");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);
  rectMode(CENTER);

  for (var i = 0; i < 50; i++ ) {
    stars[i] = new Star(i%6);
  }

  for (var i = 0; i < 4; i++) {
    var rs = items[0].height*itemsScale[0];
    boxes[i] = new Box(width/2+rs*(-1.5+i), 150, rs, i);
  }
  musicplayer.update(50, height - 100);
  showOnLoad();
}

function draw() {
  background(0);

  //if (!boxesFull || wentThroughBox) rotateOnMouse();
  //else rotateBoxes(3, 1000);
  //else autoRotate(3, 1000);

  autoRotate(3, 1000);

  for (var i = 0; i < 4; i++) {
    boxes[i].display();
    boxes[i].mouseOver();
  }

  for (var i = 0; i < stars.length; i++ ) {
    stars[i].display();
    stars[i].mouseOver();
    stars[i].move();
  }
  musicplayer.display();
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
    changeBoxItem();
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

function changeBoxItem() {
  currentItem++;
  // 4 symbols, one empty
  if (currentItem == 5) currentItem = 0;
}

function changeItem() {
  currentItem++;
  if (currentItem == items.length) currentItem = 0;
}

function drawItem(num) {
  push();
  translate(width/2, height/2+20);
  scale(itemsScale[num]);

  if (num < 4) image(items[num], 0,0);
  pop();
}

function Star(pic) {
  this.pic = pic;
  this.isSelected = false;
  this.hasSnapped = false;
  this.show = true;
  this.dragStart = {x: 0, y: 0};
  this.boxNum = -1;
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
    if (allMatched) {
      var w = starImgs[this.pic].width;
      noStroke();
      fill(255, 30);
      ellipse(this.x , this.y, w*sin(millis()/100));
      fill(255, 50);
      ellipse(this.x, this.y, w*sin(millis()/100)*.75);
      fill(255, 70);
      ellipse(this.x, this.y, w*sin(millis()/100)*.5);
    }
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
    else if (!this.hasSnapped){
      this.x += 2.0*sin(this.angle);
      this.y += 2.0*cos(this.angle);
      if (this.x > width) this.x = 0;
      else if (this.x < 0) this.x = width;
      if (this.y > height) this.y = 0;
      else if (this.y < 0) this.y = height;
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
  this.set = function(x, y) {
    this.x = x;
    this.y = y;
  }
  this.checkSelected = function () {
    if (this.mouseOver()) {
      if (currSelected == null) {
        this.dragStart.x = mouseX - this.x;
        this.dragStart.y = mouseY - this.y;
        this.isSelected = true;
        currSelected = this;
        if (this.hasSnapped) {
          if (this.boxNum >=0 && this.boxNum < boxes.length) {
            allMatched = false;
            boxes[this.boxNum].reset();
          }
        }
      }
    }
  }
}

function Box(x, y, w, sym) {
  this.x = x;
  this.y = y;
  this.w = w;
  this.sym = sym;
  this.isFull = false;
  this.hasMatch = false;
  this.mouseOver = function() {
    if (mouseX > this.x-this.w/2 && mouseX < this.x + this.w/2 && mouseY > this.y - this.w/2 && mouseY < this.y + this.w/2){
      if (!this.isFull) {
        noStroke();
        fill(255, 30);
        ellipse(this.x , this.y, this.w, this.w);
        fill(255, 50);
        ellipse(this.x, this.y, this.w*.75,  this.w*.75);
        fill(255, 70);
        ellipse(this.x, this.y, this.w*.5,this.w*.5);
        fill(255, 90);
        ellipse(this.x, this.y, this.w*.25,this.w*.25);
      }
      return true;
    }
    return false;
  }
  this.display = function() {
    noFill();
    strokeWeight(2);
    stroke(180);
    rect(this.x, this.y, this.w, this.w);
  }
  this.reset = function() {
    this.isFull = false;
    this.isMatch = false;
  }
}

function mousePressed() {
  for (var i = 0; i < stars.length; i++) {
    stars[i].checkSelected();
  }
  musicplayer.mouseClick();
}

function mouseReleased() {
  if (currSelected != null) {
    currSelected.hasSnapped = false;
    for (var i = 0; i < boxes.length; i++) {
      if (!boxes[i].isFull && boxes[i].mouseOver()) {
        boxes[i].isFull = true;
        currSelected.hasSnapped = true;
        currSelected.boxNum = i;
        if (boxes[i].sym == currSelected.pic) {
          boxes[i].hasMatch = true;
          checkForMatches();
        }
        // now make shape fit nicely in box
        currSelected.set(boxes[i].x, boxes[i].y);
        currSelected = null;
        for (var i = 0; i < stars.length; i++) {
          stars[i].reset();
        }
        return;
      }
    }
  }
  currSelected = null;
  for (var i = 0; i < stars.length; i++) {
    stars[i].reset();
  }
  musicplayer.mouseRelease();
}

function checkForMatches() {
  var m = 0;
  for (var i = 0; i < boxes.length; i++) {
    if (boxes[i].hasMatch) m++;
  }
  if (m == boxes.length) {
    allMatched = true;
  }
  else allMatched = false;
}

function keyPressed() {
  if (keyCode == LEFT_ARROW) {
    window.location.href='cycles.html';
  }
  else if (keyCode == RIGHT_ARROW) {
    window.location.href='song-for-m.html';
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  for (var i = 0; i < 4; i++) {
    var rs = items[0].height*itemsScale[0];
    boxes[i].x = windowWidth/2+rs*(-1.5+i);
  }
  //stars.resize();
  musicplayer.update(50, height - 100);
}
