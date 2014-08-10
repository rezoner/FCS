ENGINE.VideoRecorder = function(app, args) {

  this.app = app;

  this.setup(utils.extend({
    followMouse: false,
    framerate: 12,
    playbackRate: 1.2,
    scale: 2
  }, args));

};

ENGINE.VideoRecorder.prototype = {


  setup: function(args) {
    utils.extend(this, args);

    if (!this.region) {
      this.region = [0, 0, this.app.layer.width, this.app.layer.height];
    }

    this.layer = cq(this.region[2] * this.scale | 0, this.region[3] * this.scale | 0);
  },

  start: function() {
    this.encoder = new Whammy.Video(this.framerate * this.playbackRate);
    this.captureTimeout = 0;
  },

  step: function(delta) {
    if (this.encoder) {

      this.captureTimeout -= delta;

      if (this.captureTimeout <= 0) {
        this.captureTimeout = 1000 / this.framerate + this.captureTimeout;

        this.layer.drawImage(this.app.layer.canvas, this.region[0], this.region[1], this.region[2], this.region[3], 0, 0, this.layer.width, this.layer.height);
        this.encoder.add(this.layer.canvas);
      }

      app.screen.save().lineWidth(8).strokeStyle("#c00").strokeRect(0, 0, app.screen.width, app.screen.height).restore();
    }
  },

  stop: function() {
    if (!this.encoder) return;
    var output = this.encoder.compile();
    var url = (window.webkitURL || window.URL).createObjectURL(output);
    window.open(url);

    delete this.encoder;
  },

  toggle: function() {
    if (this.encoder) this.stop();
    else this.start();
  },

};