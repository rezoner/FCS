var app = new ENGINE.Application({

  scaling: true,

  width: 400,
  height: 320,

  load: function() {
    this.assets.addFoo(0.25);
  },

  ready: function() {

    this.states.add("game", app.game);
    this.states.set("game");

  }

});
