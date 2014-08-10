ENGINE.Assets = function() {

  this.images = {};
  this.audio = {};

  /* let's check does the browser prefers MP3 or OGG */

  var canPlayOgg = (new Audio).canPlayType('audio/ogg; codecs="vorbis"');

  this.audioFormat = canPlayOgg ? "ogg" : "mp3";

  /* i prefer COMPOSITION over INHERITANCE */

  this.events = new ENGINE.Events(this);

  /* loader stuff */

  this.reset();

};

ENGINE.Assets.prototype = {

  /* loader */

  add: function(id) {
    this.queue++;
    this.count++;
    this.events.trigger("add", id);
  },

  error: function(id) {
    console.log("unable to load " + id);
    this.events.trigger("error", id);
  },

  ready: function(id) {
    this.queue--;

    this.progress = 1 - this.queue / this.count;

    this.events.trigger("load", id);

    if (this.queue <= 0) {
      this.events.trigger("ready");
      this.reset();
    }
  },

  reset: function() {
    this.progress = 0;
    this.queue = 0;
    this.count = 0;
    this.foobar = 0;
  },

  /* foo 
  /* imaginary timeout to delay loading */

  addFoo: function(timeout) {

    var assets = this;

    this.add("foo " + timeout);

    this.foobar += timeout;

    setTimeout(function() {
      assets.ready("foo " + timeout);
    }, this.foobar * 1000);

  },

  /* images */

  addImage: function() {

    for (var i = 0; i < arguments.length; i++) {

      var arg = arguments[i];

      /* polymorphism at its finest */

      if (typeof arg === "object") {

        for (var key in arg) this.image(arg[key]);

      } else {

        /* if argument is not an object/array let's try to load it */

        var filename = arg;

        var assets = this;

        var fileinfo = filename.match(/(.*)\..*/);
        var key = fileinfo ? fileinfo[1] : filename;

        /* filename defaults to png */

        if (!fileinfo) filename += ".png";

        var path = "assets/images/" + filename;

        this.add(path);

        var image = this.images[key] = new Image;

        image.addEventListener("load", function() {
          assets.ready(path);
        });

        image.addEventListener("error", function() {
          assets.error(path);
        });

        image.src = path;
      }
    }
  },

  /* audio */

  addAudio: function() {

    for (var i = 0; i < arguments.length; i++) {

      var arg = arguments[i];

      /* polymorphism at its finest */

      if (typeof arg === "object") {

        for (var key in arg) this.image(arg[key]);

      } else {

        /* if argument is not an object/array let's try to load it */

        var filename = arg;

        var assets = this;

        var key = filename;

        filename += "." + this.audioFormat;

        var path = "assets/audio/" + filename;

        this.add(path);

        var audio = this.audio[key] = new Audio;

        audio.addEventListener("canplay", function() {
          assets.ready(path);
        });

        audio.addEventListener("error", function() {
          assets.error(path);
        });

        audio.src = path;
      }
    }

  },

  /* fonts */

  addFont: function(name) {
    var styleNode = document.createElement("style");

    console.log(styleNode)
    styleNode.type = "text/css";
    styleNode.textContent = "@font-face { font-family: '" + name + "'; src: url('fonts/" + name + ".ttf') format('truetype'); }";

    console.log(styleNode.textContent);

    document.head.appendChild(styleNode);

    var assets = this;

    this.add(name + ".ttf");

    var layer = cq(32, 32);

    layer.font("10px " + "'" + name + "'").fillText(16, 16, 16).trim();

    var width = layer.width;
    var height = layer.height;

    function check() {

      var layer = cq(32, 32);
      layer.font("10px " + "'" + name + "'").fillText(16, 16, 16);
      layer.trim();
      console.log(name)

      if (layer.width !== width || layer.height !== height) {
        assets.ready(name + ".ttf");
      } else {
        setTimeout(check, 250);
      }
    };

    check();

  }


}