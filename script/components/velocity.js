COMPONENTS.velocity = {

  create: function(entity) {

    entity.velocity = {
      value: 0,
      direction: 0,
      rotationSpeed: 1,
      desiredDirection: 0
    };

  },

  step: function(entity, delta) {

    entity.x += Math.cos(entity.velocity.direction) * entity.velocity.value * delta;
    entity.y += Math.sin(entity.velocity.direction) * entity.velocity.value * delta;

  }

};