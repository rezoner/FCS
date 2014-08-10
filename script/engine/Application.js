ENGINE.Application = function(args) {

  utils.extend(this, args);

  /* assets */

  this.assets = new ENGINE.Assets;

  this.assets.events.on("ready", this.ready.bind(this));

  /* add states */

  this.states = new ENGINE.States;

  var app = this;

  /* postpone execution so everything can load */

  setTimeout(function() {
    app.load();
    app.resize();
  }, 1);

  /* layer (canvas) for drawing things */

  /* disable smoothing */

  cq.smoothing = false;

  this.screen = cq();
  this.screen.appendTo("body");

  if (this.scaling) {
    this.layer = cq();
  } else {
    this.layer = this.screen;
  }

  window.addEventListener("resize", this.resize.bind(this));

  /* input devices */

  this.keyboard = new ENGINE.Keyboard();

  this.keyboard.events.on("keydown", this.keydown.bind(this));
  this.keyboard.events.on("keyup", this.keyup.bind(this));

  this.mouse = new ENGINE.Mouse(this.screen.canvas);

  this.mouse.events.on("mousemove", this.mousemove.bind(this));
  this.mouse.events.on("mousedown", this.mousedown.bind(this));
  this.mouse.events.on("mouseup", this.mouseup.bind(this));

  document.addEventListener("contextmenu", function(e) {
    e.preventDefault();
  });

  this.resize();

  /* attach main loop */

  var lastTick = Date.now();

  function step() {
    requestAnimationFrame(step);

    var delta = Date.now() - lastTick;

    // if (delta < 100) return;

    lastTick = Date.now();

    if (delta > 1000) return;

    app.step(delta / 1000);

    app.screen.save();
    app.screen.translate(app.offsetX, app.offsetY);
    app.screen.scale(app.scale, app.scale);
    app.screen.drawImage(app.layer.canvas, 0, 0);
    app.screen.restore();

    app.videoRecorder.step(delta);

  };

  requestAnimationFrame(step);

  /* fancy thing to record game videos */

  this.videoRecorder = new ENGINE.VideoRecorder(this);

};

ENGINE.Application.prototype = {

  step: function(delta) {
    this.states.call("step", delta);
    this.states.call("render", delta);
  },

  keydown: function(data) {

    if (this.keyboard.keys["ctrl"]) {
      switch (data.key) {
        case "f8":
          this.videoRecorder.toggle();
          break;
      }
    }

    this.states.call("keydown", data);
  },

  keyup: function(data) {
    this.states.call("keyup", data);
  },

  mousemove: function(data) {
    this.states.call("mousemove", data);
  },

  mousedown: function(data) {
    this.states.call("mousedown", data);
  },

  mouseup: function(data) {
    this.states.call("mouseup", data);
  },

  resize: function() {

    this.screen.width = window.innerWidth;
    this.screen.height = window.innerHeight;

    if (!this.scaling) {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
    }

    this.layer.width = this.width;
    this.layer.height = this.height;

    if (this.scaling) {

      this.scale = Math.min(window.innerWidth / this.width, window.innerHeight / this.height);
      this.offsetX = (window.innerWidth / 2 - this.scale * (this.width / 2) | 0);
      this.offsetY = (window.innerHeight / 2 - this.scale * (this.height / 2) | 0);

      this.mouse.scale = this.scale;
      this.mouse.offsetX = this.offsetX;
      this.mouse.offsetY = this.offsetY;

    } else {
      this.offsetX = 0;
      this.offsetY = 0;
    }

    this.center = {
      x: this.width / 2 | 0,
      y: this.height / 2 | 0
    };

  },

  playSound: function(key, loop) {
    var audio = this.assets.audio[key];

    audio.currentTime = 0;
    audio.play();
    audio.loop = loop;

    if (loop) audio.volume = 0.5;

    return audio;
  }
};