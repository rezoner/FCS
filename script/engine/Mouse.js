ENGINE.Mouse = function(element) {

  this.events = new ENGINE.Events();

  this.buttons = {};

  this.mousemoveEvent = {};
  this.mousedownEvent = {};
  this.mouseupEvent = {};

  this.x = 0;
  this.y = 0;

  this.offsetX = 0;
  this.offsetY = 0;
  this.scale = 1;

  element.addEventListener("mousemove", this.mousemove.bind(this));
  element.addEventListener("mousedown", this.mousedown.bind(this));
  element.addEventListener("mouseup", this.mouseup.bind(this));
};

ENGINE.Mouse.prototype = {

  mousemove: function(e) {


    this.x = this.mousemoveEvent.x = (e.layerX - this.offsetX) / this.scale | 0;
    this.y = this.mousemoveEvent.y = (e.layerY - this.offsetY) / this.scale | 0;

    this.mousemoveEvent.original = e;

    this.events.trigger("mousemove", this.mousemoveEvent);
  },

  mousedown: function(e) {
    this.mousedownEvent.x = (e.layerX - this.offsetX) / this.scale | 0;
    this.mousedownEvent.y = (e.layerY - this.offsetY) / this.scale | 0;
    this.mousedownEvent.button = e.button;
    this.mousedownEvent.original = e;

    this.buttons[e.button] = true;

    this.events.trigger("mousedown", this.mousedownEvent);
  },

  mouseup: function(e) {
    this.mouseupEvent.x = (e.layerX - this.offsetX) / this.scale | 0;
    this.mouseupEvent.y = (e.layerY - this.offsetY) / this.scale | 0;
    this.mouseupEvent.button = e.button;
    this.mouseupEvent.original = e;

    this.buttons[e.button] = false;

    this.events.trigger("mouseup", this.mouseupEvent);
  },


};