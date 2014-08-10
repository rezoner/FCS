ENGINE.Collection = function() {


  /* unique id for every entitiy */

  this.index = 1;

  /* if something inside dies - it needs to be removed,
     it is so tempting to call it *filthy* instead */

  this.dirty = false;
  this.groups = [];

  this.delta = 0;

  this.indexes = {};
};


/* copy array prototype */
ENGINE.Collection.prototype = new Array;

utils.extend(ENGINE.Collection.prototype, {

  addGroup: function(tag) {
    this.groups[tag] = [];
  },

  addTag: function(object, tag) {
    if (this.groups[tag].indexOf(object) == -1) {
      this.groups[tag].push(object);
    }
  },

  removeTag: function(object, tag) {
    var index = this.groups[tag].indexOf(object);

    if (index > -1) {
      this.groups[tag].splice(index, 1);
    }
  },

  addTags: function(object, tags) {
    for (var i = 0; i < tags.length; i++) {
      this.addTag(object, tags[i]);
    }
  },

  removeTags: function(object, tags) {
    for (var i = 0; i < tags.length; i++) {
      this.removeTag(object, tags[i]);
    }
  },

  remove: function(object) {
    object._remove = true;
    this.dirty = true;
  },

  /* creates new object instance with given args and pushes it to the collection*/
  add: function(constructor, args) {
    var args = args || {};

    for (var i = 1; i < arguments.length; i++) {
      utils.deepExtend(args, arguments[i]);
    }

    if (typeof constructor === "function") {

      if (args.index) {
        var index = args.index;
      } else {
        if (constructor.prototype.constructorName) {
          this.indexes[constructor.prototype.constructorName] = (this.indexes[constructor.prototype.constructorName] + 1) || 1;
          var index = constructor.prototype.constructorName + this.indexes[constructor.prototype.constructorName];
        } else {
          var index = ++this.index;
        }
      }

      var entity = new constructor(utils.extend({
        collection: this,
        index: index
      }, args));

    } else {
      var entity = constructor;
      entity.collection = this;
      entity.index = ++this.index;
    }

    this.push(entity);

    this.dirty = true;

    if (entity.tags) {
      this.addTags(entity, entity.tags);
    }

    return entity;
  },

  clean: function() {

    for (var i = 0, len = this.length; i < len; i++) {
      var entity = this[i];

      if (entity._remove) {

        if (entity.tags) {
          this.removeTags(entity, entity.tags);
        }

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

      if (typeof a.zIndex === "undefined") console.log(a);
      if (a.zIndex === b.zIndex) {
        if (a.y == b.y) {
          return a.index - b.index;
        } else
          return a.y - b.y;
      }

      return (a.zIndex | 0) - (b.zIndex | 0);
    });

  },

  /* call some method of every entitiy 
       ex: enemies.call("shoot", 32, 24);  
  */

  call: function(method) {

    var args = Array.prototype.slice.call(arguments, 1);

    for (var i = 0, len = this.length; i < len; i++) {
      var e = this[i];

      if (typeof e[method] !== "undefined") e[method].apply(e, args);

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