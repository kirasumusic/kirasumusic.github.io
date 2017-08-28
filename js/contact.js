var handImgs = [];

function preload() {
  for (var i = 0; i < 11; i++ ) {
    handImgs[i] = loadImage("assets/theremin/" + i + ".jpg");
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(10);

  var currentHand = int(map(mouseX, 0, windowWidth, 0, 11));
  if (currentHand > 10) currentHand = 10;
  else if (currentHand < 0) currentHand = 0;
  var scaleFactor = height/handImgs[currentHand].height;
  var h = height;
  var w = handImgs[currentHand].width * scaleFactor;
  image(handImgs[currentHand], width-w, 0, w, h);
}
