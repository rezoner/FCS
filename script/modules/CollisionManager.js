ENGINE.CollisionsManager = function(entities) {

  this.entities = entities;

};

ENGINE.CollisionsManager.prototype = {

  collision: function(a, b) {

    return utils.distance(a, b) < a.radius + b.radius;

    utils.rectInRect(a.x, a.y, a.width, a.height, b.x, b.y, b.width, b.height);

  },

  step: function(delta) {
    var collisions = [];

    for (var i = 0; i < this.entities.length; i++) {

      var a = this.entities[i];

      a.colliding = false;

      for (var j = i + 1; j < this.entities.length; j++) {

        var b = this.entities[j];

        if (this.collision(a, b)) {
          collisions.push([a, b]);
        }

      }
    }

    for (var i = 0; i < collisions.length; i++) {
      var a = collisions[i][0];
      var b = collisions[i][1];

      this.entities.callOne(a, "collision", b);
      this.entities.callOne(b, "collision", a);
    }

  }

};