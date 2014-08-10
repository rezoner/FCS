COMPONENTS.bump = {

  collision: function(entity, collidable) {

    utils.repulse(entity, collidable);

    var force = collidable.velocity.value;

    if (force > 10) {
      COMPONENTS.forces.add(entity, utils.lookAt(collidable, entity), force, force)
    }
  }

};