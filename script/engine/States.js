ENGINE.States = function(context) {

  this.parent = parent;

  this.current = {};
  this.states = {};

  this.context = context;
};

ENGINE.States.prototype = {

  add: function(name, state) {

    return this.states[name] = state;

  },

  set: function(name) {

    if (!this.states[name]) throw ("there is no such state as " + name);

    this.stateName = name;

    if (this.current.leave) {
      this.current.leave.call(this.context || this.current);
    }

    this.current = this.states[name];

    if (this.current.enter) this.current.enter.call(this.context || this.current);
  },

  call: function(method, data) {
    if (this.current[method]) {
      var args = Array.prototype.slice.call(arguments, 1);
      this.current[method].apply(this.context || this.current, args);
    }
  }

};