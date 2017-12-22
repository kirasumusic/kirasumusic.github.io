var whale, ocean, moon;
var bubbles = [];
var whaleFactor = .6;
var waterWidth;
var origW;
var counter = 0;
var items = [];
var starImgs = [];
var stars = [];
var bubbleImg;

var musicplayer;

function preload() {
  whale = loadImage("assets/kirasu/whale.png");
  ocean = loadImage("assets/kirasu/bluewavesflat.png");
  //moon = loadImage("assets/kirasu/moons.jpg");
  moon = loadImage("assets/delta/background.jpg");
  //bubbleImg = loadImage("assets/bubble.svg");
  //bubbleImg.resize(bubbleImg.width*.2, bubbleImg.height*.2);

  for (var i = 0; i < 6; i++ ) {
    items[i] = loadImage("assets/hand/const" + i + "_blk.svg");
    starImgs[i] = loadImage("assets/hand/const" + i + "_w.svg");
  }

  musicplayer = new MusicPlayer("When the Moon Comes", "kirasu", 'song-for-m', "rite-of-spring");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  //colorMode(HSB, width);

  origW = whale.width*.6;

  waterWidth = width+40
  if (width < 768) {
    whaleFactor = width/1500;
    waterWidth = 768;
  }
  whale.resize(whale.width*whaleFactor, whale.height*whaleFactor);


  for(var i = 0; i < 10; i++) {
    bubbles[i] = new Bubble();
  }
  for (var i = 0; i < 20; i++ ) {
    stars[i] = new Star(i%6);
  }

  musicplayer.update(50, height - 100);
  showOnLoad();
}

function draw() {
  //settingSun();
  imageMode(CORNER);
  background(moon);
  imageMode(CENTER);
  //image(whale, width/2+50*(whale.width/origW), height/2+30+10*sin(millis()/600));
  //image(whale, mouseX + whale.width/3, height/2+30+10*sin(millis()/600));
  image(whale, width/2, height/2+30+10*sin(millis()/600));
  for(var i = 0; i < bubbles.length; i++) {
    bubbles[i].display();
    bubbles[i].mouseOver();
  }
  //imageMode(CORNER);
  //image(ocean, -20+15*sin(millis()/500), 100+15*sin(millis()/700), waterWidth, height);
  //image(ocean, 0, 50, waterWidth, height);
  textSize(50);
  text(counter, width/2-textWidth(counter)/2, 100);

  for (var i = 0; i < stars.length; i++ ) {
    stars[i].display();
    stars[i].move();
  }

  musicplayer.display();
}


function Star(pic) {
  this.pic = pic;
  this.isSelected = false;
  this.hasSnapped = false;
  this.show = true;
  this.dragStart = {x: 0, y: 0};
  this.boxNum = -1;
  this.hide = false;
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
    if (!this.hide) {
      if (counter == 113) {
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
  }
  this.inside = function(xb, yb, rad) {
    if (xb > this.x && xb < this.x + rad && yb > this.y && yb < this.y + rad) {
      this.hide = true;
      return true;
    }
    return false;
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


function settingSun() {
  for (var i = 0; i < width/2; i++) {
    stroke(i/5+50, width, width-millis()/10)
    line(0, i, width, i);
  }
  noStroke();
}


function Bubble() {
  this.hidden = true;
  this.startX = width/2 - 260;
  this.rX = random(10)+1;
  this.rad = 30;
  this.startY = 70;
  if (width < 768) {
    this.x = windowWidth/2- 400*((whale.width/origW)/2);
    this.rad = 15;
    this.startY = 50;
  }
  else this.x = windowWidth/2 - 260 + 50;

  this.update = function() {
    // if (width < 768) this.x = windowWidth/2- 260*(whale.width/origW)/2;
    // else this.x = windowWidth/2 - 260 + 50;
    //this.x = mouseX+ whale.width/3 - (windowWidth/2 - 260 - 40) ;
    //this.x = mouseX + whale.width/3 + whale.width*.1;
    //this.x = mouseX + whale.width*.082;
    this.x = width/2 - whale.width*.25;
    this.symbolOver();
  }
  this.y = height/2+30+10*sin(millis()/600)-70;
  this.display = function() {
    this.update();
    if (this.hidden) {
      if (floor(random(200)) == 0) {
        this.hidden = false;
        this.y = height/2+30+10*sin(millis()/600)-this.startY;
      }
    }
    else {
      stroke(255);
      fill(255, 255/4);
      if (counter == 113) {
        //fill(random(width), width, width, 200);
      }
      //image(bubbleImg, this.x, this.y);
      ellipse(this.x, this.y, this.rad);
      if (frameCount%2 == 0) this.x+= random(2) -1;
      if (this.y > 200) this.y--;
      else if (this.y > -300) this.y-= 3;
      else this.hidden = true;
    }

  }
  this.mouseOver = function() {
    if (!this.hidden) {
      var x = mouseX - this.x;
      var y = mouseY - this.y;
      var d = Math.sqrt(x*x + y*y);
      if (d < this.rad) this.pop();
    }
  }
  this.symbolOver = function() {
    if (counter < 113) {
      for (var i = 0; i < stars.length; i++) {
        if (stars[i].inside(this.x, this.y, this.rad*1.5)) this.pop();
      }
    }
  }
  this.pop = function() {
    if (!this.hidden) {
      counter += int(random(1,5));
      if (counter > 113) counter = 113;
      this.hidden = true;
    }
  }
}

// function mouseReleased() {
//   for(var i = 0; i < bubbles.length; i++) {
//     if (bubbles[i].mouseOver()) bubbles[i].pop();
//   }
// }

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  if (width > 768) waterWidth = width+40;

  for(var i = 0; i < 10; i++) {
    bubbles[i].update();
  }
}


function keyPressed() {
  if (keyCode == LEFT_ARROW) {
    window.location.href='song-for-m.html';
  }
  else if (keyCode == RIGHT_ARROW) {
    window.location.href='rite-of-spring.html';
  }
}
