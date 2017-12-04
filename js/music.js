var stars = [];
var fontReg;
var backgroundImg;
var constellationImgs = [];
var orchid, moth, whale;
var constellations = [];
var selected = -1;
var mobileView = {x:0, y:0};
var dragStart = {x:0, y:0};
var view = {x:0, y:0};
var viewTemp = {x:0, y:0};
var minWidth = 1300;
var minHeight = 800;
var maxTransX = 1300;
var maxTransY = 800;
var dragging = false;
var isMobile = false;

var song;
var audio;
var audioReady = false;

var constID = {
  orchid: {
    id: 0, song: "Cycles", url: "cycles.html"
  },
  moth: {
    id:4, song: "Rite of Spring", url: "rite-of-spring.html"
  },
  whale: {
    id: 3, song: "When the Moon Comes", url: "kirasu.html"
  },
  handeye: {
    id:1, song: "Delta Waves", url: "delta-waves.html"
  },
  owl: {
    id:2, song: "Song for M", url:"song-for-m.html"
  }
};

window.onload = function() {
  audio = document.getElementById('myAudio');
  audio.src="assets/constellation.mp3";
  audio.setAttribute('preload', "none");
  audio.volume = .07;
  audio.loop = true;
  audioReady = true;
  audio.play();
};

function preload() {
  backgroundImg = loadImage("assets/concrete.jpg");
  constellationImgs[constID.orchid.id] = loadImage("assets/constellations/orchid.png");
  constellationImgs[constID.moth.id] = loadImage("assets/constellations/moth.png");
  constellationImgs[constID.whale.id] = loadImage("assets/constellations/whale.png");
  constellationImgs[constID.handeye.id] = loadImage("assets/constellations/handeye.png");
  constellationImgs[constID.owl.id] = loadImage("assets/constellations/owl.png");
  fontReg = loadFont("../fonts/Moon Light.otf");

}

function setup() {
  var w = windowWidth;
  var h = windowHeight;
  if (windowWidth < minWidth) {
    zoom = true;
    w = minWidth;
  }
  if (windowHeight < minHeight) h = minHeight;
  createCanvas(w, h);
  view.x = width/2;
  if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    // is mobile..
    isMobile = true;
  }

  colorMode(HSB, width);
  angleMode(DEGREES);
  ellipseMode(CENTER);

  stars = new Flock();
  // Add an initial set of boids into the system
  for (var i = 0; i < 300; i++) {
    var b = new Boid(random(-2000,2200),random(height), i);
    stars.addBoid(b);
  }
  // textFont();
  // ---------------------- id, name, x, y, tx, ty, trot, rot, rad, sc
  setupConstellations();
}

function draw() {
  imageMode(CORNER);
  background(backgroundImg);
  imageMode(CENTER);
  // if (!dragging) translate(view.x, view.y);
  // else translate(viewTemp.x, viewTemp.y);

  if (!isMobile) {
    getMouseMove();
    translate(view.x, view.y);
  }
  else {
    if (dragging) translate(viewTemp.x, viewTemp.y);
    else translate(view.x, view.y)
  }
  stars.star();

  for (var i = 0; i < constellations.length; i++) {
    constellations[i].display();
  }

  if (dragging) {
    viewTemp.x = mouseX - dragStart.x + view.x;
    if (viewTemp.x > 2000) viewTemp.x = 2000;
    else if (viewTemp.x < -800) viewTemp.x = -800;
  }
}

function getMouseMove() {
  if (mouseX > windowWidth*3/4) {
    var speed = map(mouseX, windowWidth*3/4, windowWidth, 1, 35);
    view.x-= speed;
    if (view.x < -800) view.x = -800;
  }
  else if (mouseX < windowWidth/4) {
    var speed = map(mouseX, windowWidth/4, 0, 1, 35);
    view.x+= speed;
    if (view.x > 2000) view.x = 2000;
  }
}

function mousePressed() {
  dragStart.x = mouseX;
  dragStart.y = mouseY;
  dragging = true;
}

function mouseReleased() {
  dragging = false;
  if (isMobile) {
    view.x = viewTemp.x;
    view.y = viewTemp.y;
  }
}

// function mouseDragged() {
//   if (isMobile) {
//     dragging = true;
//     viewTemp.x = mouseX - dragStart.x + view.x;
//     if (viewTemp.x > 2000) viewTemp.x = 2000;
//     else if (viewTemp.x < -800) viewTemp.x = -800;
//     //viewTemp.y = mouseY - dragStart.y+ view.y;
//   }
// }



function Constellation(id, song, url, tx, ty, trot, rot, rad, sc, scorig, points) {
  this.factor = windowHeight/900;
  this.id = id;
  this.song = song;
  this.url = url;

  this.x = map(this.id, 0, 4, -1600, 1600)*this.factor;
  this.y = height/2;
  this.origX = this.x;
  this.tx = tx;
  this.ty = ty;

  this.trot = trot;
  this.rot = rot;
  this.rad = rad;
  this.scorig = scorig;
  this.scStart = sc;
  this.sc = sc * this.factor;
  this.points = points;
  // this.brightStars = new Flock();
  // // Add an initial set of boids into the system
  // for (var i = 0; i < points.length; i++) {
  //   var b = new Boid(points[i].x,points[i].y, i);
  //   this.brightStars.addBoid(b);
  // }

  this.getTint = function () {
    var t = 0;
    var d = this.getDistance();
    if (d > this.rad*3) t = .08;
    else if (d < this.rad) {
      t = .8;
    }
    else t = map(d, this.rad, this.rad*3, .8, .08);
    tint(255, t*255);
    //ellipse(this.x, this.y, d);
    //fill(0, width, width);
  }
  this.mouseOver = function () {
    if (this.getDistance() < this.rad*3) return true;
    return false;
  }
  this.getDistance = function () {
    var x;
    if (dragging) {
      x =  mouseX - (this.x + viewTemp.x);
      y =  mouseY - (this.y + viewTemp.y);
    }
    else {
      x =  mouseX - (this.x + view.x);
      y =  mouseY - (this.y + view.y);
    }
    var d = sqrt(x*x + y*y);
    return d;
  }
  this.display = function() {

    //ellipse(this.x,this.y, this.rad*6);

    push();

    translate(this.x, this.y);

    push();
    rotate(this.rot);
    tint(255, 255);
    this.getTint();
    image(constellationImgs[this.id], 0, 0);
    pop();
    textFont(fontReg);
    textSize(30);
    if (this.mouseOver()) {
      fill(width);
      stroke(width);
    }
    else {
      fill(width, 50);
      stroke(width, 50);
    }

    push();
    this.drawText(this.song, 30, 1, 0, 0);
    pop();

    this.drawStars();
    pop();
  }
  this.drawText = function(word, fsize, fspacing, x, y) {
    textFont(fontReg);
    textSize(fsize);
    var sp = 0;
    for (var i=0; i < word.length; i++) {
      text(word.charAt(i), x + (fsize + fspacing)*i - textWidth(word)/2, y);
    }
  }
  this.drawStars = function() {
    //for(var j = 5; j > 0; j--) {
    // if (this.mouseOver()) {
    //   strokeWeight(j*1.5);
    //   stroke(width, 100-j*20);
    //   fill(width, 100-j*20);
    // }
    // else {
    // strokeWeight(2);
    // stroke(width, 50);
    // fill(width, 50);
    //}
    strokeWeight(2);
    stroke(width);
    fill(width);
    var j = 3;
    for(var i = 0; i < this.points.length-1; i++) {
      line(this.points[i].x, this.points[i].y, this.points[i+1].x, this.points[i+1].y);
      ellipse(this.points[i].x, this.points[i].y, j*3);
    }
    line(this.points[0].x, this.points[0].y, this.points[this.points.length-1].x, this.points[this.points.length-1].y);
    ellipse( this.points[this.points.length-1].x, this.points[this.points.length-1].y, j*3);
    //}
  }
  this.resizeImg = function() {
    constellationImgs[this.id].resize(constellationImgs[this.id].width*this.sc, constellationImgs[this.id].height*this.sc);
    var ptSc = this.sc / this.scorig;
    for (var i = 0; i < this.points.length; i++) {
      this.points[i].x *= ptSc;
      this.points[i].y *= ptSc;
    }
  }
  this.resize = function() {
    this.factor = windowHeight/900;
    this.x = this.factor*this.origX;
    this.sc = this.scStart * this.factor;
  }
}

function mouseClicked() {
  for (var i = 0; i < constellations.length; i++) {
    if (constellations[i].mouseOver()) {
      window.location.href='music/'+constellations[i].url;
    }
  }
}

function setupConstellations() {
  var x = width/2;
  var y = height/2;

  var points = [{x:-160, y:0},{x:0, y:-90}, {x:140, y:0}, {x:100, y:40}, {x:130, y:80}, {x:0, y:100}, {x:-110, y:80}, {x:-90, y:40}];
  // id,              song,               url,                x, y, tx, ty, trot, rot, rad, sc, scorig, points
  constellations[0] = new Constellation(constID.orchid.id, constID.orchid.song, constID.orchid.url, 220, 380, -5, 0, 50, .5, .3, points);

  points = [{x:-160, y:30}, {x:40, y:-110}, {x:150, y:120}, {x:10, y:60}, {x:-20, y:120}, {x:-50, y:30}];
  constellations[1] = new Constellation(constID.moth.id, constID.moth.song, constID.moth.url , -800,  300, -5, 15, 50, .5, .3, points);

  points = [{x:0, y:120},{x:-160, y:80}, {x:-260, y:-40}, {x:0, y:-10}, {x:160, y:60}, {x:260, y:10}, {x:280, y:-40}, {x:240, y:-60}, {x:160, y:60}];
  constellations[2] = new Constellation(constID.whale.id, constID.whale.song, constID.whale.url, 200, 270, -5, 0, 50, .5, .35, points);

  points = [{x:-160, y:40}, {x:-80, y:20}, {x:-220, y:-80}, {x:-110, y:-130}, {x:0, y:-90}, {x:140, y:50}, {x:0, y:90}];
  constellations[3] = new Constellation(constID.handeye.id, constID.handeye.song, constID.handeye.url, 200, 270, -5, -65, 50, .5, .3, points);

  points = [{x:-60, y:-40},{x:0, y:-100}, {x:50, y:-40}, {x:-10, y:120}];
  constellations[4] = new Constellation(constID.owl.id, constID.owl.song, constID.owl.url,  200, 270, -5, 0, 50, .8, .3, points);

  for (var i = 0; i < constellations.length; i++) {
    constellations[i].resizeImg();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

}

function checkMobile() {
  // rotation X
  // 90 upright
  // 0 flat on back

}
