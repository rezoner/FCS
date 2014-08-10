CanvasQuery.Wrapper.prototype.pfont = function(size) {
  size = 12 * (size / 10 | 0);
  return this.font(Math.max(1, size) + "px 'BM germar'");
  return this.font(Math.max(1, size) + "px 'Alterebro Pixel Font'");
};

CanvasQuery.Wrapper.prototype.a = function(a) {
  return this.globalAlpha(a);
};

CanvasQuery.Wrapper.prototype.drawImageScaled = function() {

  // (i, x, y, s)
  // (i, cx, cy, cw, ch, dx, dy, s)

  if (arguments.length === 4) {
    return this.drawImage(arguments[0], 0, 0, arguments[0].width, arguments[0].height, arguments[1], arguments[2], arguments[0].width * arguments[3], arguments[0].width * arguments[3]);
  }
};

CanvasQuery.Wrapper.prototype.drawAnimation = function(key, x, y, delta, duration) {

  var animation = defs.animations[key];

  if (animation.reverse)
    var frame = animation.frames - (animation.frames) * (delta % duration) / duration | 0;
  else
    var frame = (animation.frames) * (delta % duration) / duration | 0;
  var image = app.assets.images[animation.image];

  this.drawImage(image, animation.x + animation.frameWidth * frame, animation.y, animation.frameWidth, animation.frameHeight, x - animation.alignX, y - animation.alignY, animation.frameWidth, animation.frameHeight);
};