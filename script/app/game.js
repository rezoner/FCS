  app.game = {

    create: function() {

      this.entities = new ENGINE.EntitiesManager(this);
      
      this.collisions = new ENGINE.CollisionsManager(this.entities);

      /* spawn blue bubbles */

      for (var i = 0; i < 30; i++) {
        var pos = utils.sincos(200);

        this.entities.add(ENTITIES.bubble, {
          x: pos.x + app.width / 2,
          y: pos.y + app.height / 2,
          color: "#0cf",
          followMouse: false,
          chasePlayer: true
        });
      }

      /* spawn red bubbles */      

      for (var i = 0; i < 10; i++) {
        var pos = utils.sincos(32);
        this.entities.add(ENTITIES.bubble, {
          radius: 4,
          x: pos.x + app.width / 2,
          y: pos.y + app.height / 2,
          color: "#c06",
          chasePlayer: true,
          food: true
        });

      }

      /* spawn player */

      this.player = this.entities.add(ENTITIES.bubble, {
        x: app.width / 2,
        y: app.height / 2,
        color: "#c06",
        followMouse: true,
        player: true
      });

      this.created = true;

    },

    tick: function(i, offset) {
      return (this.ticks + (offset || 0)) % i === 0;
    },

    enter: function() {
      if (!this.created) this.create();
    },

    add: function() {
      return this.entities.add.apply(this.entities, arguments);
    },

    leave: function() {

    },

    mousedown: function(e) {

    },

    mouseup: function(e) {},

    mousemove: function(e) {

    },

    step: function(delta) {

      this.ticks++;
      this.delta += delta;

      this.entities.callAll("step", delta);
      this.entities.step(delta);

      this.collisions.step(delta);

    },

    render: function(delta) {

      app.screen.clear("#000");
      app.layer.clear("#020e22");

      this.entities.callAll("render", delta, app.layer);
      this.entities.callAll("postrender", delta, app.layer);
    },

    keydown: function(e) {

    }

  };