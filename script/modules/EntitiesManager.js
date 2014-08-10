ENGINE.EntitiesManager = function(world) {

  this.world = world;

  this.index = 1;

  this.dirty = false;
  this.groups = [];

  this.delta = 0;

  this.indexes = {};
};

ENGINE.EntitiesManager.prototype = new Array;

utils.extend(ENGINE.EntitiesManager.prototype, {

  remove: function(object) {
    object._remove = true;
    this.dirty = true;
  },

  add: function() {
    var args = {};

    //    utils.deepExtend.apply(utils, arguments);

    for (var i = 0; i < arguments.length; i++) {
      utils.deepExtend(args, arguments[i]);
    }

    var entity = args;

    //    entity.collection = this;
    entity.index = this.index++;

    this.push(entity);

    this.dirty = true;

    for (var property in entity) {

      var prototype = ENGINE[property + "System"];
      if (prototype) {
        Object.setPrototypeOf(entity[property], prototype);
      }
    }


    Object.defineProperty(entity, "collection", {
      enumerable: false,
      value: this
    });

    this.callOne(entity, "create");

    return entity;
  },

  clean: function() {

    for (var i = 0, len = this.length; i < len; i++) {
      var entity = this[i];

      if (entity._remove) {

        this.splice(i--, 1);
        len--;
      }
    }


  },


  /* needs to be called in order to keep track on collection's garbage */

  step: function(delta) {

    this.delta += delta;

    if (this.dirty) {
      this.dirty = false;
      this.clean();
    }

    this.sort(function(a, b) {

      // if (typeof a.zIndex === "undefined") console.log(a);
      if (a.zIndex === b.zIndex) {
        if (a.y == b.y) {
          return a.index - b.index;
        } else
          return a.y - b.y;
      }

      return (a.zIndex | 0) - (b.zIndex | 0);
    });

  },

  callOne: function(entity, method) {
    var args = Array.prototype.slice.call(arguments, 2);
    
    args.unshift(entity);

    for (var property in entity) {

      if (!COMPONENTS[property]) continue;
      if (!COMPONENTS[property][method]) continue;


      COMPONENTS[property][method].apply(COMPONENTS[property], args);

    }

    this.updated = true;

  },

  callAll: function(method) {

    var args = Array.prototype.slice.call(arguments, 1);

    for (var i = 0, len = this.length; i < len; i++) {
      var entity = this[i];

      for (var property in entity) {

        if (!COMPONENTS[property]) continue;
        if (!COMPONENTS[property][method]) continue;

        COMPONENTS[property][method].apply(COMPONENTS[property], [entity].concat(args));
      }

    }

    this.updated = true;

  },

  /* call some method of every entitiy
       ex: enemies.apply("shoot", [32, 24]);
     the difference is that it takes an array - not list of arguments
  */

  apply: function(method, args) {

    for (var i = 0, len = this.length; i < len; i++) {
      if (this[i][method]) this[i][method].apply(this[i], args);
    }
  }

});