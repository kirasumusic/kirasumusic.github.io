
function MusicPlayer(x, y, w, isBig) {

  this.x = x;
  this.y = y;
  this.w = w;
  this.h = 50;
  this.songL = len;
  this.isBig = isBig;
  this.buttonPlay = createButton('');
  this.buttonPlay.position(19, 19);
  this.buttonPlay.id("playButton");
  this.playSpot = 0;

  this.draggingPlayBar = false;
  this.draggingVolBar = false;

  this.playBarX = 50;
  this.paddingPlayBarX = 10;

  this.spacingVolBar = 5;
  this.paddingVolBarX = 10;
  this.paddingVolBarY = 4;
  this.volX = 10;

  this.display = function(vol, current) {
    if (this.isBig) displayBig(vol, current);
    else displaySmall(vol, current);
  }
  this.displayBig = function(vol, current) {
    stroke(255);
    strokeWeight(1);
    line(this.x, this.y, this.x + this.w, this.y);
    this.displayVol(vol, 50);
    this.displayPlayBar(current, 100, 400);
  }
  this.displayVol(vol) {
    strokeWeight(2);
    var startX = this.x + this.volX + this.paddingVolBarX;
    for (var i = 0; i < 12; i++) {
      if (this.draggingVolBar) {
        var end = startX + 12 * this.spacingVolBar;
        var v = floor(constrain(map(mouseX, startX, end, 0, 11), 0, 11));
        if (v > i) stroke(255);
        else stroke(155);
      }
      else {
        if (vol/100 * 12 > i) stroke(255);
        else stroke(155);
      }
      var lx = this.x + this.volX + i * this.spacingVolBar + this.paddingVolBarX;
      line(lx, this.y + this.paddingVolBarY, lx, this.y + this.h - this.paddingVolBarY);
    }
  }
  this.getVol() {
    var startX = this.x + this.volX + this.paddingVolBarX;
    var end = startX + 12 * this.spacingVolBar;
    var v = floor(constrain(map(mouseX, startX, end, 0, 11), 0, 11));
    return v;
  }
  this.displayPlayBar(current, x, w) {
    stroke(255);
    fill(255);
    strokeWeight(1);
    var lx = this.x + this.playBarX + this.paddingPlayBarX;
    line(lx, this.y + this.h /2, this.x + this.playBarX + this.playBarW -this.paddingPlayBarX, this.y + this.h/2);

    if (this.draggingPlayBar) {
      this.playSpot = mouseX;
      var lx1 = this.x + this.playBarX + this.paddingPlayBarX;
      var lx2 = this.x + this.playBarX + this.playBarW-this.paddingPlayBarX;
      if (this.playSpot < lx1) this.playSpot = lx1;
      else if (this.playSpot > lx2) this.playSpot = lx2;
      ellipse(this.playSpot, this.y + this.h/2, 15, 15);
    }
    else {
      this.playSpot = map(current, 0, this.songL, lx, this.x + this.playBarX + this.playBarW-this.paddingPlayBarX);
      ellipse(this.playSpot, this.y + this.h/2, 15, 15);
    }
  }
  this.getNewVol = funtion() {

  }

  this.getNewPlayDuration = function() {
    var lx1 = this.x + this.playBarX + this.paddingPlayBarX;
    var lx2 = this.x + this.playBarX + this.playBarW-this.paddingPlayBarX;
    return map(this.playSpot, lx1, lx2, 0, this.songL);
  }
  this.checkPlayBarClick() {
    var x = this.playSpot;
    var y = this.h/2;
    var dx = (mouseX - x)*(mouseX - x);
    var dy = (mouseY - y)*(mouseY - y);
    var d = sqrt(dx + dy);
    if (d < r) this.dragging = true;
    else this.dragging = false;
    return this.dragging;
  }
  this.updatePlayBar(x) {
    if (this)
  }

  this.displaySmall(vol, current) {

  }
}
