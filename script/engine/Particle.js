ENGINE.Particle = function(args) {

  utils.extend(this, {
    lifespan: 1,
    color: "#c00"
  }, args);

};

ENGINE.Particle.prototype = {
  
  zIndex: 6,

  step: function(delta) {

    this.gravity += 50 * delta;

    this.x += this.velocity * delta;
    this.y += this.gravity * delta;

    if ((this.lifespan -= delta) <= 0) {
      this.collection.remove(this);
    }

  },

  render: function() {
    app.layer.fillStyle(this.color).fillRect(this.x | 0, this.y | 0, 1, 1);
  }
}