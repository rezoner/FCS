COMPONENTS.forces = {

  create: function(entity) {

    entity.forces = [];

  },

  add: function(entity, direction, value, damping) {

    entity.forces.push({
      direction: direction,
      value: value,
      damping: damping
    });

  },

  step: function(entity, delta) {

    for (var i = 0; i < entity.forces.length; i++) {
      var force = entity.forces[i];

      force.value = Math.max(0, force.value - delta * force.damping);
      entity.x += Math.cos(force.direction) * force.value * delta;
      entity.y += Math.sin(force.direction) * force.value * delta;

      if (force.value <= 0) entity.forces.splice(i--, 1);
    }

  }

};