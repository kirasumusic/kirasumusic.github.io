
var isPlayingSong = false;
var isMuted = false;
var lastVol = 1;
var buttonPlay, buttonMute, sound, arrowLeft, arrowRight, nextS, previousS, songTitleDiv, songPlayingDiv, songPlayingStart;
var hasLoaded = false;

var isHidden = false;

var released = true;
var lastCalled = 0;
var hasBegun = false;

function startMusic() {
  var s = select('#startPlaying');
  s.style('visibility: hidden;');
  // var playerShow = select(".showOnPlay");
  // playerShow.style('visibility: visible;')
  isHidden = false;

  hasBegun = true;

  playSound2();
}

function MusicPlayer(songTitle, songFile, ps, ns) {
  this.x = -1000;
  this.y = -1000;
  this.h = 35;
  this.myFont = loadFont("../../fonts/Moon Light.otf");
  this.songTitle = songTitle;
  this.songFile = songFile;
  nextS = ns;
  previousS = ps;
  this.isBig = true;
  this.playSpot = 0;
  this.draggingPlayBar = false;
  this.draggingVolBar = false;

  this.muteButtonPadding = 10;
  buttonMute = createButton('');
  buttonMute.id("muteButton");
  buttonMute.parent("#songPlayerBox");
  buttonMute.class("hidden glyphicon glyphicon-volume-up musicplayer");
  buttonMute.mousePressed(mutePressed);

  this.spacingVolBar = 10;
  this.paddingVolBarX = 20;
  this.paddingVolBarY = 10;
  this.volW = this.paddingVolBarX * 2 + 12 * this.spacingVolBar;

  this.paddingPlayBarX = 10;
  this.playBarW = 400;

  this.playButtonPadding = 10;
  this.playButtonW = this.playButtonPadding + 36;
  buttonPlay = createButton('');
  buttonPlay.parent("#songPlayerBox");
  buttonPlay.id("playButton");
  buttonPlay.class("glyphicon glyphicon-play musicplayer");
  buttonPlay.touchEnded(playPressed);

  this.playCountPadding = 10;
  this.playCountW = 130;

  arrowLeft = createButton('');
  arrowLeft.id("arrowLeft");
  arrowLeft.parent("#songPlayerBox");
  arrowLeft.class("fa fa-angle-left arrow");
  arrowLeft.mousePressed(previousSong);

  arrowRight = createButton('');
  arrowRight.id("arrowRight");
  arrowRight.parent("#songPlayerBox");
  arrowRight.class("fa fa-angle-right arrow");
  arrowRight.mousePressed(nextSong);

  songPlayingDiv = createDiv("Now Playing");
  songPlayingDiv.parent("#songPlayerBox");
  songPlayingDiv.class("songNowPlaying");

  songTitleDiv = createDiv(this.songTitle);
  songTitleDiv.parent("#songPlayerBox");
  songTitleDiv.class("songTitle");

  this.sDur = 0;

  sound = loadSound('assets/' + this.songFile + '.mp3');

  this.update = function(x, y) {
    // init to get this.w
    if (windowWidth > 1200) {
      this.y = windowHeight - 75;
      this.initBig();
    }
    else {
      this.y = windowHeight - 60;
      this.initSmall();
    }

    // do it again b/c new this.x
    if (windowWidth > 1200) {
      var s1 = songTitleDiv.size().width;
      var s2 = songPlayingDiv.size().width;
      var sp = max(s1, s2);
      this.x = songTitleDiv.position().x + sp + 50;
      this.initBig();
    }
    else {
      this.x = (windowWidth - this.w)/2;
      this.initSmall();
    }
  }
  this.initBig = function() {
    this.isBig = true;
    this.muteButtonX = this.x + this.muteButtonPadding;
    this.muteButtonW = this.muteButtonPadding * 2 + 36;
    buttonMute.position(this.muteButtonX, this.y+10);

    this.volX = this.muteButtonX + this.muteButtonPadding*2;

    this.playButtonX = this.volX + this.volW - 15;
    buttonPlay.position(this.playButtonX+this.playButtonPadding, this.y+10);

    this.playBarX = this.playButtonX + this.playButtonW;

    var wmus = (windowWidth*.9 - this.x);
    var wEverythingButPlayBar = 416;
    this.playBarW = wmus - wEverythingButPlayBar;

    this.playCountPadding = 10;
    this.playCountW = 130;

    this.playCountX = this.playBarX + this.playBarW + this.playCountPadding + 15;

    this.endX = this.playCountX + this.playCountW;
    this.w = this.endX - this.x;

    arrowLeft.position(50, this.y);
    arrowRight.position(windowWidth-50 - 25, this.y);

    // var startPlay = select(".startPlayButton");
    // textSize(30);
    // startPlay.position(songTitleDiv.position().x + textWidth(this.songTitle)*1.8, songTitleDiv.position().y);
  }
  this.initSmall = function() {
    this.isBig = false;
    var padding = 8;
    this.playButtonX = this.x;
    this.playButtonPadding = padding;
    this.playButtonW = this.playButtonPadding * 2 + 28;
    buttonPlay.position(this.playButtonX + this.playButtonPadding, this.y+10);

    this.paddingPlayBarX = padding;
    this.playBarX = this.playButtonX + this.playButtonW;

    var wbar = (windowWidth - 2 * 50);
    var ratio = wbar / 212;
    this.playBarW = 120 * ratio;

    this.playCountPadding = padding;
    this.playCountX = this.playBarX + this.playBarW + this.playCountPadding;
    this.playCountW = 40;

    this.endX = this.playCountX + this.playCountW;
    this.w = this.endX - this.x;

    // arrowLeft.position((windowWidth - this.w)/2 + 10, this.y - 43);
    // arrowRight.position((windowWidth + this.w)/2 - 24 - 10, this.y - 43);
    arrowLeft.position(10, this.y - this.h/2 + 20);
    arrowRight.position(windowWidth- 10 - 25, this.y - this.h/2 + 20);
  }
  this.display = function() {
    if (!isHidden) {
      colorMode(RGB, 255);
      if (this.isBig) this.displayBig();
      else this.displaySmall();
    }

  }
  this.displayTitle = function() {
    textFont(this.myFont);
    noStroke();
    fill(255);
    if (this.isBig) {
      //textSize(20);
      var x = this.x - textWidth(this.songTitle) - 50;
      this.drawText(this.songTitle, 20, 1, x, this.y);
    }
    else {
      textSize(15);
      var x = (windowWidth - textWidth(this.songTitle)-this.songTitle.length)/2;
      this.drawText(this.songTitle, 15, 1, x, this.y - 24);
    }
  }

  this.displayBig = function() {
    stroke(255);
    fill(255);
    strokeWeight(1);
    line(windowWidth*.05, this.y - 40, windowWidth*.95, this.y - 40);
    if (hasLoaded == false) {
      this.initBig();
      hasLoaded = true;
      buttonMute.class("glyphicon glyphicon-volume-up musicplayer");
      buttonPlay.class("glyphicon glyphicon-play musicplayer");
      // if (!sound.isPlaying()) sound.play();
      sound.setVolume(lastVol);
    }
    stroke(255);
    strokeWeight(2);
    line(this.x, this.y, this.endX, this.y);
    line(this.x, this.y+this.h, this.endX, this.y+this.h);
    this.displayVol();
    this.displayPlayBar(sound.currentTime());
    this.displayTime(sound.currentTime(), 18, true);
    //this.displayTitle();
    this.displayEndCaps();
  }
  this.displaySmall = function() {
    fill(255);
    stroke(255);
    line(windowWidth*.05, this.y - 50, windowWidth*.95, this.y - 50);
    if (hasLoaded == false) {
      this.initSmall();
      hasLoaded = true;
      // if (!sound.isPlaying()) sound.play();
      sound.setVolume(lastVol);
    }
    stroke(255);
    strokeWeight(2);
    line(this.x, this.y, this.endX, this.y);
    line(this.x, this.y+this.h, this.endX, this.y+this.h);
    this.displayPlayBar(sound.currentTime());
    this.displayTime(sound.currentTime(), 13, false);
    this.displayEndCaps();
    //this.displayTitle();
  }
  this.displayTime = function(current, fsize, showEnd) {
    textFont(this.myFont);
    textSize(fsize);
    noStroke();
    var h = this.y + this.h/2 + fsize/2-3;
    var s = this.getTimeString(current);
    if (showEnd) s += "  |  " +  this.getTimeString(sound.duration());
    text(s, this.playCountX, h);
  }
  this.getTimeString = function(t) {
    var roundS = floor(t);
    var minutes = floor(roundS/60);
    minutes = "0" + minutes;
    var seconds = roundS - minutes * 60;
    if (seconds < 10) seconds = "0" + seconds;
    return minutes + ":" + seconds;
  }
  this.drawText = function(word, fsize, fspacing, x, y) {
    textFont(this.myFont);
    textSize(fsize);
    var sp = 0;
    for (var i=0; i < word.length; i++) {
      text(word.charAt(i), x + (fsize + fspacing)*i - textWidth(word)/2, y);
    }
  }
  this.displayEndCaps = function() {
    noFill();
    strokeWeight(2);
    stroke(255);
    var rad = 8;
    // front cap
    line(this.x-rad/2, this.y+rad/2, this.x-rad/2, this.y+this.h-rad/2);
    arc(this.x, this.y+rad/2, rad, rad, PI, -HALF_PI);
    arc(this.x, this.y+this.h-rad/2, rad, rad, HALF_PI, PI);
    // end cap
    line(this.endX+rad/2, this.y+rad/2, this.endX+rad/2, this.y+this.h-rad/2);
    arc(this.endX, this.y+rad/2, rad, rad, -HALF_PI, 0);
    arc(this.endX, this.y+this.h-rad/2, rad, rad, 0, HALF_PI);
  }
  this.displayVol = function() {
    strokeWeight(3);
    var startX = this.volX + this.paddingVolBarX;
    var end = startX + 12 * this.spacingVolBar;
    var v;
    if (this.draggingVolBar) {
      v = floor(constrain(map(mouseX, startX, end, 0, 12), 0, 12));
      lastVol = v/12.0*1.0;
      sound.setVolume(lastVol);
      for (var i = 0; i < 12; i++) {
        if (v > i) stroke(255);
        else stroke(100);
        var lx = this.volX + i * this.spacingVolBar + this.paddingVolBarX;
        line(lx, this.y + this.paddingVolBarY, lx, this.y + this.h - this.paddingVolBarY);
      }
    }
    else {
      for (var i = 0; i < 12; i++) {
        if (lastVol * 12 > i) stroke(255);
        else stroke(100);
        var lx = this.volX + i * this.spacingVolBar + this.paddingVolBarX;
        line(lx, this.y + this.paddingVolBarY, lx, this.y + this.h - this.paddingVolBarY);
      }
    }
  }
  this.getVol = function() {
    var startX = this.volX + this.paddingVolBarX;
    var end = startX + 12 * this.spacingVolBar;
    var v = floor(constrain(map(mouseX, startX, end, 0, 11), 0, 11));
    return v;
  }
  this.displayPlayBar = function(current) {
    stroke(255);
    fill(255);
    strokeWeight(2);
    var lx = this.playBarX + this.paddingPlayBarX;
    var end = this.playBarX + this.playBarW-this.paddingPlayBarX;
    line(lx, this.y + this.h /2, end, this.y+this.h/2);

    if (this.draggingPlayBar) this.jumpPlaySpot(mouseX);
    else this.playSpot = map(current, 0, sound.duration(), lx, end);

    ellipse(this.playSpot, this.y + this.h/2, 10, 10);
  }

  this.getNewVol = function() {
    // lala
  }

  this.getNewPlayDuration = function() {
    var lx1 = this.playBarX + this.paddingPlayBarX;
    var lx2 = this.playBarX + this.playBarW-this.paddingPlayBarX;
    return map(this.playSpot, lx1, lx2, 0, sound.duration());
  }
  this.checkPlayBarDrag = function() {
    var x = this.playSpot;
    var y = this.y+this.h/2;
    var dx = (mouseX - x)*(mouseX - x);
    var dy = (mouseY - y)*(mouseY - y);
    var d = dist(x, y, mouseX, mouseY);
    if (d < 15) {
      this.draggingPlayBar = true;
    }
  }
  this.checkPlayBarClick = function() {
    var lx1 = this.playBarX + this.paddingPlayBarX;
    var lx2 = this.playBarX + this.playBarW-this.paddingPlayBarX;
    if (mouseX > lx1 && mouseX < lx2 && mouseY > this.y && this.y < this.y + this.h) return true;
    return false;
  }
  this.jumpPlaySpot = function(x) {
    // new mouse position
    // get duration @ that point
    // jump to that point
    var lx1 = this.playBarX + this.paddingPlayBarX;
    var lx2 = this.playBarX + this.playBarW-this.paddingPlayBarX;
    if (x < lx1) x = lx1;
    else if (x > lx2) x = lx2;
    this.playSpot = x;
    this.sDur = map(this.playSpot, lx1, lx2, 0, sound.duration());
    sound.jump(this.sDur);
  }
  this.checkVolBarClick = function() {
    if (mouseX > this.volX+this.paddingVolBarX && mouseX < this.volX + this.volW - this.paddingVolBarX && mouseY > this.y && this.y < this.y + this.h) {
      this.draggingVolBar = true;
    }
  }
  this.mouseClick = function() {
    this.checkPlayBarDrag();
    this.checkVolBarClick();
  }
  this.mouseRelease = function() {
    if (this.draggingPlayBar) {
      sound.jump(this.sDur);
      this.draggingPlayBar = false;
    }
    else if (this.checkPlayBarClick()) {
      this.jumpPlaySpot(mouseX);
    }
    else if (this.draggingVolBar) this.draggingVolBar = false;

  }

}

function mutePressed() {
  if (isMuted) {
    isMuted = false;
    sound.setVolume(lastVol);
    buttonMute.addClass("glyphicon-volume-up");
    buttonMute.removeClass("glyphicon-volume-off");
  }
  else {
    isMuted = true;
    sound.setVolume(0);
    buttonMute.removeClass("glyphicon-volume-up");
    buttonMute.addClass("glyphicon-volume-off");
  }
}

function playSound2() {
  if (!sound.isPlaying()) {
    buttonPlay.removeClass("glyphicon-play");
    buttonPlay.addClass("glyphicon-pause");
    sound.play();
  }
}

function pauseSound2() {
  if (sound.isPlaying()) {
    buttonPlay.removeClass("glyphicon-pause");
    buttonPlay.addClass("glyphicon-play");
    sound.pause();
  }
}

function playPressed() {
  if (hasBegun) {
    // hack for mobile because of https://github.com/processing/p5.js/issues/1815
    if(millis() - lastCalled > 500){
      if (sound.isPlaying()) {
        pauseSound2();
      }
      else {
        playSound2();
      }
  		lastCalled = millis();
  	}
  }
}

function previousSong() {
  var s = previousS + '.html';
  window.location.href= s;
}

function nextSong() {
  var s = nextS + '.html';
  window.location.href= s;
}
