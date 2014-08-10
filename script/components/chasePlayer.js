COMPONENTS.chasePlayer = {

  step: function(entity, delta) {
    entity.velocity.direction = utils.lookAt(entity, app.game.player);
    entity.velocity.value = utils.distance(entity, app.game.player);

  }

};