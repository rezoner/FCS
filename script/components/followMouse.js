COMPONENTS.followMouse = {

  step: function(entity, delta) {
    entity.velocity.direction = utils.lookAt(entity, app.mouse);
    entity.velocity.value = utils.distance(entity, app.mouse);

  }

};