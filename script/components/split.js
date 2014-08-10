COMPONENTS.split = {

  mousedown: function(entity, event) {

    for (var i = 0; i < entity.eaten; i++) {

      /* clone bubble - worst way hey hey */

      var bubble = utils.extend({}, entity);

      /* remove ... things */

      bubble.player = false;
      bubble.radius = 4;
      bubble.food = true;
      bubble.chasePlayer = true;

      delete bubble.split;
      delete bubble.followMouse;

      /* spread the bubbles around */

      var angle = Math.random() * 6;
      var pos = utils.sincos(angle, entity.radius * 1.5);

      bubble.x += pos.x;
      bubble.y += pos.y;

      entity.collection.add(bubble);

      COMPONENTS.forces.add(bubble, angle, 200, 200);
    }

    entity.radius -= entity.eaten;
    entity.eaten = 0;

  }

};