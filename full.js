/* script/utils.js */

var utils = {

  array2d: function(w, h, value) {
    var result = [];

    for (var x = 0; x < w; x++) {
      result[x] = [];
      for (var y = 0; y < h; y++) {
        result[x][y] = value;
      }
    }

    return result;
  },

  removeElement: function(array, what) {
    array.splice(array.indexOf(what), 1);
  },

  sinmod: function(period, max, offset) {
    offset = offset || 0;

    if (!max) max = Math.PI;
    return Math.sin(max * ((offset + Date.now() / 1000) % period / period));
  },

  dangeroll: function(value, items) {

    var current = 0;
    var result = [];

    while (current < value) {
      var possibilities = [];

      for (var i = 0; i < items.length; i++) {
        if (items[i].value <= value - current) possibilities.push(items[i]);
      }

      if (possibilities.length) {
        var randomItem = utils.random(possibilities);
        result.push(randomItem.result);
        current += randomItem.value;

      } else {
        current = value;
      }
    }

    return result;
  },

  copy: function(from, what) {
    var result = {};

    for (var i = 0; i < what.length; i++) {
      result[what[i]] = from[what[i]];
    }

    return result;
  },

  extend: function() {
    for (var i = 1; i < arguments.length; i++) {
      for (var j in arguments[i]) {
        arguments[0][j] = arguments[i][j];
      }
    }

    return arguments[0];
  },
  deepExtend: function(destination, source) {
    for (var property in source) {
      if (typeof source[property] === "object") {
        destination[property] = destination[property] || {};
        utils.deepExtend(destination[property], source[property]);
      } else {
        destination[property] = source[property];
      }
    }
    return destination;
  },
  deepExtend2: function() {
    for (var i = 1; i < arguments.length; i++) {
      for (var key in arguments[i]) {
        if (typeof arguments[i][key] === "object") {

          arguments[0][key] = this.deepExtend(arguments[i][key] instanceof Array ? [] : {}, arguments[i][key]);

        } else
          arguments[0][key] = arguments[i][key];
      }
    }

    return arguments[0];
  },

  defaults: function() {
    for (var i = 1; i < arguments.length; i++) {
      for (var j in arguments[i]) {
        if (typeof arguments[0][j] === "undefined") arguments[0][j] = arguments[i][j];
      }
    }

    return arguments[0];
  },

  first: function(object) {
    return object[Object.keys(object)[0]];
  },

  last: function(object) {

    if (object instanceof Array) {
      return object[object.length - 1];
    } else {
      var keys = Object.keys(object);
      return object[utils.last(keys)];
    }
  },

  saw: function(t) {
    if (t < 0.5) {
      return t / 0.5;
    } else {
      return 1 - (t - 0.5) / 0.5;
    }
  },

  cossin: function(angle, radius) {
    return [Math.cos(angle) * radius, Math.sin(angle) * radius];
  },

  sincos: function(angle, radius) {

    if (arguments.length === 1) {
      radius = angle;
      angle = Math.random() * 6.28;
    }

    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius
    };
  },


  spawn: function(callback, interval, duration) {
    var delta = 0;
    var timer = setInterval(function() {
      callback();

      if ((delta += interval) > duration) clearInterval(timer);
    }, interval);

    return timer;
  },

  mid: function(a, b) {
    return a + (b - a) / 2;
  },

  closest: function(o, a) {
    var min = -1;
    var result = null;

    for (var i = 0; i < a.length; i++) {

      if (o === a[i]) continue;

      var distance = utils.distance(a[i].x, a[i].y, o.x, o.y);

      if (distance < min || min < 0) {
        min = distance;
        result = a[i];
      }
    }

    return result;
  },

  distance: function(x1, y1, x2, y2) {
    if (arguments.length > 2) {
      var dx = x1 - x2;
      var dy = y1 - y2;

      return Math.sqrt(dx * dx + dy * dy);
    } else {
      var dx = x1.x - y1.x;
      var dy = x1.y - y1.y;

      return Math.sqrt(dx * dx + dy * dy);
    }
  },

  circDistance: function(a, b) {
    var max = Math.PI * 2;

    if (a === b) return 0;
    else if (a < b) {
      var l = -a - max + b;
      var r = b - a;
    } else {
      var l = b - a;
      var r = max - a + b;
    }

    if (Math.abs(l) > Math.abs(r)) return r;
    else return l;
  },

  random: function(a, b) {

    if (a === undefined) {
      return Math.random();
    } else if (b !== undefined) {
      return Math.floor(a + Math.random() * Math.abs(b - a + 1));
    } else {
      if (a instanceof Array) return a[(a.length + 1) * Math.random() - 1 | 0];
      else {
        return a[this.randomElement(Object.keys(a))];
      }
    }

  },

  randomElement: function(a) {
    if (a instanceof Array) return a[(a.length + 1) * Math.random() - 1 | 0];
    else {
      return a[this.randomElement(Object.keys(a))];
    }
  },

  shuffle: function(array) {
    var counter = array.length,
      temp, index;

    // While there are elements in the array
    while (counter > 0) {
      // Pick a random index
      index = Math.floor(Math.random() * counter);

      // Decrease counter by 1
      counter--;

      // And swap the last element with it
      temp = array[counter];
      array[counter] = array[index];
      array[index] = temp;
    }

    return array;
  },

  cleanArray: function(array, property) {

    var lastArgument = arguments[arguments.length - 1];
    var isLastArgumentFunction = typeof lastArgument === "function";

    for (var i = 0, len = array.length; i < len; i++) {
      if (array[i] === null || (property && array[i][property])) {
        if (isLastArgumentFunction) {
          lastArgument(array[i]);
        }
        array.splice(i--, 1);
        len--;
      }
    }
  },

  moveTo: function(value, target, step) {
    if (value < target) {
      value += step;
      if (value > target) value = target;
    }
    if (value > target) {
      value -= step;
      if (value < target) value = target;
    }

    return value;
  },

  /* (c) GSGD - http://gsgd.co.uk/sandbox/jquery/easing */

  ease: {
    inSine: function(t, b, c, d) {
      if (t > d) return b + c;

      return -c * Math.cos(t / d * (Math.PI / 2)) + c + b;
    },

    outSine: function(t, b, c, d) {
      if (t > d) return b + c;

      return c * Math.sin(t / d * (Math.PI / 2)) + b;
    },

    inElastic: function(t, b, c, d) {
      var s = 1.70158;
      var p = 0;
      var a = c;
      if (t == 0) return b;
      if ((t /= d) == 1) return b + c;
      if (!p) p = d * .3;
      if (a < Math.abs(c)) {
        a = c;
        var s = p / 4;
      } else var s = p / (2 * Math.PI) * Math.asin(c / a);
      return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
    },

    outElastic: function(t, b, c, d) {
      var s = 1.70158;
      var p = 0;
      var a = c;
      if (t == 0) return b;
      if ((t /= d) == 1) return b + c;
      if (!p) p = d * .3;
      if (a < Math.abs(c)) {
        a = c;
        var s = p / 4;
      } else var s = p / (2 * Math.PI) * Math.asin(c / a);
      return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
    }
  },

  easeOutElastic: function(t, b, c, d) {
    var s = 1.70158;
    var p = 0;
    var a = c;
    if (t == 0) return b;
    if ((t /= d) == 1) return b + c;
    if (!p) p = d * .3;
    if (a < Math.abs(c)) {
      a = c;
      var s = p / 4;
    } else var s = p / (2 * Math.PI) * Math.asin(c / a);
    return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
  },

  easeInQuint: function(t, b, c, d) {
    return c * (t /= d) * t * t * t * t + b;
  },

  multiplyProperties: function(object, m) {
    for (var i in object) object[i] = object[i] * m | 0;
  },

  lookAt: function(a, b) {
    var angle = Math.atan2(b.y - a.y, b.x - a.x);
    if (angle < 0) angle = Math.PI * 2 + angle;
    return angle;
  },

  atanxy: function(x, y) {
    var angle = Math.atan2(y, x);
    if (angle < 0) angle = Math.PI * 2 + angle;
    return angle;
  },

  circWrappedDistance: function(a, b) {
    return this.wrappedDistance(a, b, Math.PI * 2)
  },

  wrappedDistance: function(a, b, max) {
    if (a === b) return 0;
    else if (a < b) {
      var l = -a - max + b;
      var r = b - a;
    } else {
      var l = b - a;
      var r = max - a + b;
    }

    if (Math.abs(l) > Math.abs(r)) return r;
    else return l;
  },

  circWrap: function(val) {
    return this.wrap(val, 0, Math.PI * 2);
  },

  wrap: function(val, min, max) {
    if (val < min) return max + val;
    if (val >= max) return val - max;
    return val;
  },

  wrapTo: function(value, target, max, step) {
    if (value === target) return target;

    var result = value;

    var d = this.wrappedDistance(value, target, max);

    if (Math.abs(d) < step) return target;

    result += (d < 0 ? -1 : 1) * step;

    if (result > max) {
      result = result - max;
    } else if (result < 0) {
      result = max + result;
    }

    return result;
  },


  circWrapTo: function(value, target, step) {
    return this.wrapTo(value, target, Math.PI * 2, step);
  },

  pointInRect: function(x, y, rx, ry, rw, rh) {
    return !(x < rx || y < ry || x > rx + rw || y > ry + rh);
  },

  rectInRect: function(r1x, r1y, r1w, r1h, r2x, r2y, r2w, r2h) {
    return !(r2x > r1x + r1w ||
      r2x + r2w < r1x ||
      r2y > r1y + r1h ||
      r2y + r2h < r1y);
  },

  ortToCirc: function(x, y, width) {
    var angle = (x / width) * Math.PI * 2;
    return [Math.cos(angle) * y, Math.sin(angle) * y, angle];
  },

  post: function(url, object, callback) {

    var request = new XMLHttpRequest();

    request.open("POST", url, true);

    request.onreadystatechange = function() {
      if (request.readyState != 4 || request.status != 200) return;

      callback(false, request.responseText);
    };

    request.onerror = function() {
      callback(true);
    };

    request.timeout = 2000;
    request.ontimeout = function() {
      callback(true);
    }

    request.send(JSON.stringify(object));
  },

  limit: function(value, min, max) {
    return value < min ? min : value > max ? max : value;
  },

  easeInBounce: function(t, b, c, d) {
    return c - utils.easeOutBounce(d - t, 0, c, d) + b;
  },

  easeOutBounce: function(t, b, c, d) {
    if ((t /= d) < (1 / 2.75)) {
      return c * (7.5625 * t * t) + b;
    } else if (t < (2 / 2.75)) {
      return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
    } else if (t < (2.5 / 2.75)) {
      return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
    } else {
      return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
    }
  },

  easeOutElastic: function(t, b, c, d) {
    var s = 1.70158;
    var p = 0;
    var a = c;
    if (t == 0) return b;
    if ((t /= d) == 1) return b + c;
    if (!p) p = d * .3;
    if (a < Math.abs(c)) {
      a = c;
      var s = p / 4;
    } else var s = p / (2 * Math.PI) * Math.asin(c / a);
    return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
  },

  easeInOutBounce: function(t, b, c, d) {
    if (t < d / 2) return utils.easeInBounce(t * 2, 0, c, d) * .5 + b;
    return utils.easeOutBounce(t * 2 - d, 0, c, d) * .5 + c * .5 + b;
  },

  loremIpsum: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum".replace(",", "").replace(".", "").split(" "),

  randomWords: function(count) {
    var result = "";
    for (var i = 0; i < count; i++) {
      result += this.random(this.loremIpsum) + " ";
    }

    return result;
  },

  randomAround: function(x, y, s, e) {

    var a = Math.random() * Math.PI * 2;

    return {
      x: x + Math.cos(a) * (s + (e - s) * Math.random()),
      y: y + Math.sin(a) * (s + (e - s) * Math.random())
    };

  },


  rectRectIntersection: function(a, b) {
    var x = Math.max(a[0], b[0]);
    var num1 = Math.min(a[0] + a[2], b[0] + b[2]);
    var y = Math.max(a[1], b[1]);
    var num2 = Math.min(a[1] + a[3], b[1] + b[3]);

    if (num1 >= x && num2 >= y)
      return [x, y, num1 - x, num2 - y];
    else
      return false;
  },

  lineRectIntersection: function(lx1, ly1, lx2, ly2, x, y, w, h) {

    if (this.lineLineIntersection(lx1, ly1, lx2, ly2, x, y, x + w, y)) return 0;
    if (this.lineLineIntersection(lx1, ly1, lx2, ly2, x + w, y, x + w, y + h)) return 1;
    if (this.lineLineIntersection(lx1, ly1, lx2, ly2, x, y + h, x + w, y + h)) return 2;
    if (this.lineLineIntersection(lx1, ly1, lx2, ly2, x, y, x, y + h)) return 3;

    return false;
  },

  lineLineIntersection: function(ax1, ay1, ax2, ay2, bx1, by1, bx2, by2) {
    var denominator = ((ax2 - ax1) * (by2 - by1)) - ((ay2 - ay1) * (bx2 - bx1));
    var numerator1 = ((ay1 - by1) * (bx2 - bx1)) - ((ax1 - bx1) * (by2 - by1));
    var numerator2 = ((ay1 - by1) * (ax2 - ax1)) - ((ax1 - bx1) * (ay2 - ay1));

    // Detect coincident lines (has a problem, read below)
    if (denominator == 0) return numerator1 == 0 && numerator2 == 0;

    var r = numerator1 / denominator;
    var s = numerator2 / denominator;

    return (r >= 0 && r <= 1) && (s >= 0 && s <= 1);
  },

  /* http://keith-hair.net/blog/2008/08/05/line-to-circle-intersection-data/ */

  interpolatePoints: function(ax, ay, bx, by, f) {

    return [f * ax + (1 - f) * bx, f * ay + (1 - f) * by];
  },

  rectCircleIntersection: function(rx, ry, rw, rh, cx, cy, r) {
    var result = false;
    if (result = this.lineCircleIntersection(rx, ry, rx + rw, ry, cx, cy, r)) return result;
    if (result = this.lineCircleIntersection(rx + rw, ry, rx + rw, ry + rh, cx, cy, r)) return result;
    if (result = this.lineCircleIntersection(rx, ry + rh, rx + rw, ry + rh, cx, cy, r)) return result;
    if (result = this.lineCircleIntersection(rx, ry, rx, ry + rh, cx, cy, r)) return result;

    return result;
  },

  lineCircleCollision: function(ax, ay, bx, by, cx, cy, r) {

    var result = false;

    var a = (bx - ax) * (bx - ax) + (by - ay) * (by - ay);
    var b = 2 * ((bx - ax) * (ax - cx) + (by - ay) * (ay - cy));
    var cc = cx * cx + cy * cy + ax * ax + ay * ay - 2 * (cx * ax + cy * ay) - r * r;
    var deter = b * b - 4 * a * cc;

    if (deter <= 0) {

    } else {
      var e = Math.sqrt(deter);
      var u1 = (-b + e) / (2 * a);
      var u2 = (-b - e) / (2 * a);

      if ((u1 < 0 || u1 > 1) && (u2 < 0 || u2 > 1)) {

      } else {
        result = true;
      }
    }
    return result;
  },

  lineCircleIntersection: function(ax, ay, bx, by, cx, cy, r) {

    var result = {
      inside: false,
      tangent: false,
      intersects: false,
      enter: null,
      exit: null
    };
    var a = (bx - ax) * (bx - ax) + (by - ay) * (by - ay);
    var b = 2 * ((bx - ax) * (ax - cx) + (by - ay) * (ay - cy));
    var cc = cx * cx + cy * cy + ax * ax + ay * ay - 2 * (cx * ax + cy * ay) - r * r;
    var deter = b * b - 4 * a * cc;

    result.distance = Math.sqrt(a);

    if (deter <= 0) {
      result.inside = false;
    } else {
      var e = Math.sqrt(deter);
      var u1 = (-b + e) / (2 * a);
      var u2 = (-b - e) / (2 * a);
      if ((u1 < 0 || u1 > 1) && (u2 < 0 || u2 > 1)) {
        if ((u1 < 0 && u2 < 0) || (u1 > 1 && u2 > 1)) {
          result.inside = false;
        } else {
          result.inside = true;
        }
      } else {

        if (0 <= u2 && u2 <= 1) {
          result.enter = this.interpolatePoints(ax, ay, bx, by, 1 - u2);
        }
        if (0 <= u1 && u1 <= 1) {
          result.exit = this.interpolatePoints(ax, ay, bx, by, 1 - u1);
        }
        result.intersects = true;
        if (result.exit != null && result.enter != null && result.exit[0] == result.enter[0] && result.exit[1] == result.enter[1]) {
          result.tangent = true;
        }
      }
    }
    return result.intersects ? result : false;
  },

  rotate: function(ax, ay, bx, by, a) {

    return [
      bx + (ax - bx) * Math.cos(a) - (ay - by) * Math.sin(a),
      by + (ax - bx) * Math.sin(a) + (ay - by) * Math.cos(a)
    ];

  },

  template: function(string, replace) {
    var key;
    for (key in replace) {
      string = string.replace(new RegExp('\\{' + key + '%\\}', 'gm'), (replace[key] * 100 | 0) + "%");
      string = string.replace(new RegExp('\\{' + key + '\\}', 'gm'), replace[key]);
    }
    return string
  },

  /* vectors */

  vectorLength: function(v) {
    return Math.sqrt(v[0] * v[0] + v[1] * v[1]);
  },

  normalizeVector: function(v) {
    var d = utils.vectorLength(v[0], v[1]);
    return [v[0] / d, v[1] / d];
  },

  vectorAngle: function(v) {
    return utils.atanxy(v[0], v[1]);
  },

  constrain: function(o, x, y, w, h) {
    if (o.x < x) o.x = x;
    if (o.y < y) o.y = y;
    if (o.x >= x + w) o.x = x + w - 1;
    if (o.y >= y + h) o.y = y + h - 1;
  },

  constrainRect: function(o, x, y, w, h) {
    if (o.x < x) o.x = x;
    if (o.y < y) o.y = y;
    if (o.x + o.width >= x + w) o.x = x + w - o.width;
    if (o.y + o.height >= y + h) o.y = y + h - o.height;
  },

  impulse: function(o, a, v) {
    o.x += Math.cos(a) * v;
    o.y += Math.sin(a) * v;
  },

  align: function(boundX, boundY, boundW, boundH, objectW, objectH, boundAlignX, boundAlignY, objectAlignX, objectAlignY) {

    var result = [];

    if (typeof objectAlignX === "undefined") {
      if (boundAlignX === 'left') objectAlignX = 0;
      if (boundAlignX === 'right') objectAlignX = objectW;
      if (boundAlignX === 'center') objectAlignX = objectW / 2;
    }

    if (objectAlignX === 'left') objectAlignX = 0;
    else if (objectAlignX === 'right') objectAlignX = objectW;
    else if (objectAlignX === 'center') objectAlignX = objectW / 2;

    if (typeof objectAlignY === "undefined") {
      if (boundAlignY === 'top') objectAlignY = 0;
      if (boundAlignY === 'bottom') objectAlignY = objectH;
      if (boundAlignY === 'center') objectAlignY = objectH / 2;
    }

    if (objectAlignY === 'top') objectAlignY = 0;
    else if (objectAlignY === 'bottom') objectAlignY = objectH;
    else if (objectAlignY === 'center') objectAlignY = objectH / 2;

    if (boundAlignX === 'left') result[0] = boundX - objectAlignX;
    else if (boundAlignX === 'right') result[0] = boundX + boundW - objectAlignX;
    else if (boundAlignX === 'center') result[0] = boundX + boundW / 2 - objectAlignX;
    else result[0] = boundX + boundAlignX - objectAlignX;

    if (boundAlignY === 'top') result[1] = boundY - objectAlignY;
    else if (boundAlignY === 'bottom') result[1] = boundY + boundH - objectAlignY;
    else if (boundAlignY === 'center') result[1] = boundY + boundH / 2 - objectAlignY;
    else result[1] = boundY + boundAlignY - objectAlignY;

    return {
      x: result[0],
      y: result[1]
    };
  },


  throttle: function(fn, threshold) {
    threshold || (threshold = 250);
    var last,
      deferTimer;
    return function() {
      var context = this;

      var now = +new Date,
        args = arguments;
      if (last && now < last + threshold) {
        // hold on to it
        clearTimeout(deferTimer);
        deferTimer = setTimeout(function() {
          last = now;
          fn.apply(context, args);
        }, threshold);
      } else {
        last = now;
        fn.apply(context, args);
      }
    };
  },

  ucfirst: function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  },

  repulse: function(a, b) {
    var angle = this.lookAt(b, a);

    a.x = b.x + Math.cos(angle) * (a.radius + b.radius);
    a.y = b.y + Math.sin(angle) * (a.radius + b.radius);
  },

  sum: function(array) {
    var count = 0;
    for (var i = array.length; i--;) {
      count += array[i];
    }

    return count;
  },

  checkRequirements: function(data, requirements) {

    for (var key in requirements) {
      if (data[key] !== requirements[key]) return false;
    }

    return true;

  },

  unfold: function(object) {
    var array = [];

    for (var key in object) {
      for (var i = 0; i < object[key]; i++) {
        array.push(key);
      }
    }

    return array;
  },

  threshold: function(value, threshold) {
    var result = -1;

    for (var i = 0; i < threshold.length; i++) {
      if (value >= threshold[i]) result = i;
      else break;
    }

    return result;
  },

  seeds: {

  },
  
  resetSeed: function(id, value) {
    this.seeds[id] = value;    
  },

  seed: function(id) {
    this.seeds[id] = (this.seeds[id] * 9301 + 49297) % 233280;
    return this.seeds[id] / 233280;
  }



};
/* script/3rd/canvasquery.js */

/*     
  Canvas Query 1.0.0
  http://canvasquery.org
  (c) 2012-2014 http://rezoner.net
  Canvas Query may be freely distributed under the MIT license.
*/

(function() {

  var COCOONJS = false;
  var NODEJS = !(typeof exports === "undefined");



  if (NODEJS) {
    var Canvas = require('canvas');
    var Image = Canvas.Image;
    var fs = require("fs");
  } else {
    var Canvas = window.HTMLCanvasElement;
    var Image = window.HTMLImageElement;
    var COCOONJS = window.CocoonJS && window.CocoonJS.App;
  }


  var $ = function(selector) {
    if (arguments.length === 0) {
      var canvas = $.createCanvas(window.innerWidth, window.innerHeight);
      window.addEventListener("resize", function() {
        // canvas.width = window.innerWidth;
        // canvas.height = window.innerHeight;
      });
    } else if (typeof selector === "string") {
      var canvas = document.querySelector(selector);
    } else if (typeof selector === "number") {
      var canvas = $.createCanvas(arguments[0], arguments[1]);
    } else if (selector instanceof Image) {
      var canvas = $.createCanvas(selector);
    } else if (selector instanceof $.Wrapper) {
      return selector;
    } else {
      var canvas = selector;
    }

    return new $.Wrapper(canvas);
  };

  $.lineSpacing = 1.0;

  $.cocoon = function(selector) {
    if (arguments.length === 0) {
      var canvas = $.createCocoonCanvas(window.innerWidth, window.innerHeight);
      window.addEventListener("resize", function() {});
    } else if (typeof selector === "string") {
      var canvas = document.querySelector(selector);
    } else if (typeof selector === "number") {
      var canvas = $.createCocoonCanvas(arguments[0], arguments[1]);
    } else if (selector instanceof Image) {
      var canvas = $.createCocoonCanvas(selector);
    } else if (selector instanceof $.Wrapper) {
      return selector;
    } else {
      var canvas = selector;
    }

    return new $.Wrapper(canvas);
  }


  $.extend = function() {
    for (var i = 1; i < arguments.length; i++) {
      for (var j in arguments[i]) {
        arguments[0][j] = arguments[i][j];
      }
    }

    return arguments[0];
  };

  $.augment = function() {
    for (var i = 1; i < arguments.length; i++) {
      _.extend(arguments[0], arguments[i]);
      arguments[i](arguments[0]);
    }
  };

  $.distance = function(x1, y1, x2, y2) {
    if (arguments.length > 2) {
      var dx = x1 - x2;
      var dy = y1 - y2;

      return Math.sqrt(dx * dx + dy * dy);
    } else {
      return Math.abs(x1 - y1);
    }
  };

  $.extend($, {

    smoothing: true,


    blend: function(below, above, mode, mix) {

      if (typeof mix === "undefined") mix = 1;

      var below = $(below);
      var mask = below.clone();
      var above = $(above);

      below.save();
      below.globalAlpha(mix);
      below.globalCompositeOperation(mode);
      below.drawImage(above.canvas, 0, 0);
      below.restore();

      mask.save();
      mask.globalCompositeOperation("source-in");
      mask.drawImage(below.canvas, 0, 0);
      mask.restore();

      return mask;
    },

    matchColor: function(color, palette) {
      var rgbPalette = [];

      for (var i = 0; i < palette.length; i++) {
        rgbPalette.push($.color(palette[i]));
      }

      var imgData = cq.color(color);

      var difList = [];
      for (var j = 0; j < rgbPalette.length; j++) {
        var rgbVal = rgbPalette[j];
        var rDif = Math.abs(imgData[0] - rgbVal[0]),
          gDif = Math.abs(imgData[1] - rgbVal[1]),
          bDif = Math.abs(imgData[2] - rgbVal[2]);
        difList.push(rDif + gDif + bDif);
      }

      var closestMatch = 0;
      for (var j = 0; j < palette.length; j++) {
        if (difList[j] < difList[closestMatch]) {
          closestMatch = j;
        }
      }

      return palette[closestMatch];
    },

    temp: function(width, height) {
      if (!this.tempWrapper) {
        this.tempWrapper = cq(1, 1);
      }

      if (width instanceof Image) {
        this.tempWrapper.width = width.width;
        this.tempWrapper.height = width.height;
        this.tempWrapper.context.drawImage(width, 0, 0);
      } else if (width instanceof Canvas) {
        this.tempWrapper.width = width.width;
        this.tempWrapper.height = width.height;
        this.tempWrapper.context.drawImage(width, 0, 0);
      } else if (width instanceof CanvasQuery.Wrapper) {
        this.tempWrapper.width = width.width;
        this.tempWrapper.height = width.height;
        this.tempWrapper.context.drawImage(width.canvas, 0, 0);
      } else {
        this.tempWrapper.width = width;
        this.tempWrapper.height = height;
      }

      return this.tempWrapper;
    },

    wrapValue: function(value, min, max) {
      var d = Math.abs(max - min);
      return min + (value - min) % d;
    },

    limitValue: function(value, min, max) {
      return value < min ? min : value > max ? max : value;
    },

    mix: function(a, b, ammount) {
      return a + (b - a) * ammount;
    },

    hexToRgb: function(hex) {
      if (hex.length === 7) return ['0x' + hex[1] + hex[2] | 0, '0x' + hex[3] + hex[4] | 0, '0x' + hex[5] + hex[6] | 0];
      else return ['0x' + hex[1] + hex[1] | 0, '0x' + hex[2] + hex[2] | 0, '0x' + hex[3] + hex[3] | 0];
    },

    rgbToHex: function(r, g, b) {
      return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1, 7);
    },

    /* author: http://mjijackson.com/ */

    rgbToHsl: function(r, g, b) {

      if (r instanceof Array) {
        b = r[2];
        g = r[1];
        r = r[0];
      }

      r /= 255, g /= 255, b /= 255;
      var max = Math.max(r, g, b),
        min = Math.min(r, g, b);
      var h, s, l = (max + min) / 2;

      if (max == min) {
        h = s = 0; // achromatic
      } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r:
            h = (g - b) / d + (g < b ? 6 : 0);
            break;
          case g:
            h = (b - r) / d + 2;
            break;
          case b:
            h = (r - g) / d + 4;
            break;
        }
        h /= 6;
      }

      return [h, s, l];
    },

    /* author: http://mjijackson.com/ */

    hslToRgb: function(h, s, l) {
      var r, g, b;

      if (s == 0) {
        r = g = b = l; // achromatic
      } else {
        function hue2rgb(p, q, t) {
          if (t < 0) t += 1;
          if (t > 1) t -= 1;
          if (t < 1 / 6) return p + (q - p) * 6 * t;
          if (t < 1 / 2) return q;
          if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
          return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
      }

      return [r * 255 | 0, g * 255 | 0, b * 255 | 0];
    },

    rgbToHsv: function(r, g, b) {
      if (r instanceof Array) {
        b = r[2];
        g = r[1];
        r = r[0];
      }

      r = r / 255, g = g / 255, b = b / 255;
      var max = Math.max(r, g, b),
        min = Math.min(r, g, b);
      var h, s, v = max;

      var d = max - min;
      s = max == 0 ? 0 : d / max;

      if (max == min) {
        h = 0; // achromatic
      } else {
        switch (max) {
          case r:
            h = (g - b) / d + (g < b ? 6 : 0);
            break;
          case g:
            h = (b - r) / d + 2;
            break;
          case b:
            h = (r - g) / d + 4;
            break;
        }
        h /= 6;
      }

      return [h, s, v];
    },

    hsvToRgb: function(h, s, v) {
      var r, g, b;

      var i = Math.floor(h * 6);
      var f = h * 6 - i;
      var p = v * (1 - s);
      var q = v * (1 - f * s);
      var t = v * (1 - (1 - f) * s);

      switch (i % 6) {
        case 0:
          r = v, g = t, b = p;
          break;
        case 1:
          r = q, g = v, b = p;
          break;
        case 2:
          r = p, g = v, b = t;
          break;
        case 3:
          r = p, g = q, b = v;
          break;
        case 4:
          r = t, g = p, b = v;
          break;
        case 5:
          r = v, g = p, b = q;
          break;
      }

      return [r * 255, g * 255, b * 255];
    },

    color: function() {
      var result = new $.Color();
      result.parse(arguments[0], arguments[1]);
      return result;
    },

    createCanvas: function(width, height) {
      if (NODEJS) {
        var result = new Canvas;
      } else {
        var result = document.createElement("canvas");
      }

      if (arguments[0] instanceof Image || arguments[0] instanceof Canvas) {
        var image = arguments[0];
        result.width = image.width;
        result.height = image.height;


        result.getContext("2d").drawImage(image, 0, 0);
      } else {
        result.width = width;
        result.height = height;
      }


      return result;
    },

    createCocoonCanvas: function(width, height) {
      var result = document.createElement("screencanvas");

      if (arguments[0] instanceof Image) {
        var image = arguments[0];
        result.width = image.width;
        result.height = image.height;
        result.getContext("2d").drawImage(image, 0, 0);
      } else {
        result.width = width;
        result.height = height;
      }


      return result;
    },

    createImageData: function(width, height) {
      return $.createCanvas(width, height).getContext("2d").createImageData(width, height);
    }

  });

  $.Wrapper = function(canvas) {
    this.context = canvas.getContext("2d");
    this.canvas = canvas;
    this.update();
  }

  $.Wrapper.prototype = {

    update: function() {
      this.context.webkitImageSmoothingEnabled = cq.smoothing;
      this.context.mozImageSmoothingEnabled = cq.smoothing;
      this.context.msImageSmoothingEnabled = cq.smoothing;
      this.context.imageSmoothingEnabled = cq.smoothing;

      if (COCOONJS) CocoonJS.App.setAntialias(cq.smoothing);
    },

    appendTo: function(selector) {
      if (typeof selector === "object") {
        var element = selector;
      } else {
        var element = document.querySelector(selector);
      }

      element.appendChild(this.canvas);

      return this;
    },

    drawSprite: function(image, sprite, x, y, scale) {
      scale = scale || 1;

      return this.drawImage(
        image, sprite[0], sprite[1], sprite[2], sprite[3],
        x | 0, y | 0, sprite[2] * scale | 0, sprite[3] * scale | 0
      );
    },

    cache: function() {
      return this.clone().canvas;

      /* FFS .... image.src is no longer synchronous when assigning dataURL */

      var image = new Image;
      image.src = this.canvas.toDataURL();
      return image;
    },

    blendOn: function(what, mode, mix) {
      $.blend(what, this, mode, mix);

      return this;
    },

    posterize: function(pc, inc) {
      pc = pc || 32;
      inc = inc || 4;
      var imgdata = this.getImageData(0, 0, this.width, this.height);
      var data = imgdata.data;

      for (var i = 0; i < data.length; i += inc) {
        data[i] -= data[i] % pc; // set value to nearest of 8 possibilities
        data[i + 1] -= data[i + 1] % pc; // set value to nearest of 8 possibilities
        data[i + 2] -= data[i + 2] % pc; // set value to nearest of 8 possibilities
      }

      this.putImageData(imgdata, 0, 0); // put image data to canvas
    },


    bw: function(pc) {
      pc = 128;
      var imgdata = this.getImageData(0, 0, this.width, this.height);
      var data = imgdata.data;
      // 8-bit: rrr ggg bb
      for (var i = 0; i < data.length; i += 4) {
        var v = ((data[i] + data[i + 1] + data[i + 2]) / 3);

        v = (v / 128 | 0) * 128;
        //data[i] = v; // set value to nearest of 8 possibilities
        //data[i + 1] = v; // set value to nearest of 8 possibilities
        data[i + 2] = (v / 255) * data[i]; // set value to nearest of 8 possibilities

      }

      this.putImageData(imgdata, 0, 0); // put image data to canvas
    },

    blend: function(what, mode, mix) {
      if (typeof what === "string") {
        var color = what;
        what = $(this.canvas.width, this.canvas.height);
        what.fillStyle(color).fillRect(0, 0, this.canvas.width, this.canvas.height);
      }

      var result = $.blend(this, what, mode, mix);

      this.canvas = result.canvas;
      this.context = result.context;

      return this;
    },

    fontHeight: function() {
      return this.lineHeight();
    },

    textWithBackground: function(text, x, y, background, padding) {
      var w = this.measureText(text).width;
      var h = this.fontHeight() * 0.8;
      var f = this.fillStyle();

      this.fillStyle(background).fillRect(x - w / 2 - padding * 2, y - padding, w + padding * 4, h + padding * 2)
      this.fillStyle(f).textAlign("center").textBaseline("top").fillText(text, x, y);
    },

    fillCircle: function(x, y, r) {
      this.context.beginPath();
      this.context.arc(x, y, r, 0, Math.PI * 2);
      this.context.fill();
      return this;
    },

    strokeCircle: function(x, y, r) {
      this.context.beginPath();
      this.context.arc(x, y, r, 0, Math.PI * 2);
      this.context.stroke();
      return this;
    },

    circle: function(x, y, r) {
      this.context.arc(x, y, r, 0, Math.PI * 2);
      return this;
    },

    crop: function(x, y, w, h) {

      if (arguments.length === 1) {

        var y = arguments[0][1];
        var w = arguments[0][2];
        var h = arguments[0][3];
        var x = arguments[0][0];
      }

      var canvas = $.createCanvas(w, h);
      var context = canvas.getContext("2d");

      context.drawImage(this.canvas, x, y, w, h, 0, 0, w, h);
      this.canvas.width = w;
      this.canvas.height = h;
      this.clear();
      this.context.drawImage(canvas, 0, 0);

      return this;
    },

    set: function(properties) {
      $.extend(this.context, properties);
    },

    resize: function(width, height) {
      var w = width,
        h = height;

      if (arguments.length === 1) {
        w = arguments[0] * this.canvas.width | 0;
        h = arguments[0] * this.canvas.height | 0;
      } else {

        if (height === false) {
          if (this.canvas.width > width) {
            h = this.canvas.height * (width / this.canvas.width) | 0;
            w = width;
          } else {
            w = this.canvas.width;
            h = this.canvas.height;
          }
        } else if (width === false) {
          if (this.canvas.width > width) {
            w = this.canvas.width * (height / this.canvas.height) | 0;
            h = height;
          } else {
            w = this.canvas.width;
            h = this.canvas.height;
          }
        }
      }

      var $resized = $(w, h).drawImage(this.canvas, 0, 0, this.canvas.width, this.canvas.height, 0, 0, w, h);
      this.canvas = $resized.canvas;
      this.context = $resized.context;

      return this;
    },

    imageLine: function(image, region, x, y, ex, ey, width, mod) {

      var count = cq.distance(x, y, ex, ey) / region[3] + 0.5 | 0;
      var angle = Math.atan2(ey - y, ex - x) + Math.PI / 2;

      this.save();

      this.translate(x, y);
      this.rotate(angle);
      if (width) this.scale(width, 1.0);

      for (var i = 0; i < count; i++) {
        this.drawSprite(image, region, -region[2] / 2 | 0, -region[3] * (i + 1));
      }

      this.restore();

      return this;
    },

    trim: function(color, changes) {
      var transparent;

      if (color) {
        color = $.color(color).toArray();
        transparent = !color[3];
      } else transparent = true;

      var sourceData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
      var sourcePixels = sourceData.data;

      var bound = [this.canvas.width, this.canvas.height, 0, 0];

      var width = this.canvas.width;
      var height = this.canvas.height;

      for (var i = 0, len = sourcePixels.length; i < len; i += 4) {
        if (transparent) {
          if (!sourcePixels[i + 3]) continue;
        } else if (sourcePixels[i + 0] === color[0] && sourcePixels[i + 1] === color[1] && sourcePixels[i + 2] === color[2]) continue;

        var x = (i / 4 | 0) % this.canvas.width | 0;
        var y = (i / 4 | 0) / this.canvas.width | 0;

        if (x < bound[0]) bound[0] = x;
        if (x > bound[2]) bound[2] = x;

        if (y < bound[1]) bound[1] = y;
        if (y > bound[3]) bound[3] = y;
      }


      if (bound[2] === 0 && bound[3] === 0) {} else {
        if (changes) {
          changes.left = bound[0];
          changes.top = bound[1];

          changes.bottom = height - bound[3];
          changes.right = width - bound[2] - bound[0];

          changes.width = bound[2] - bound[0];
          changes.height = bound[3] - bound[1];
        }

        this.crop(bound[0], bound[1], bound[2] - bound[0] + 1, bound[3] - bound[1] + 1);
      }

      return this;
    },
    matchPalette: function(palette) {
      var imgData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);

      var rgbPalette = [];

      for (var i = 0; i < palette.length; i++) {
        rgbPalette.push($.color(palette[i]));
      }


      for (var i = 0; i < imgData.data.length; i += 4) {
        var difList = [];
        if (!imgData.data[i + 3]) continue;

        for (var j = 0; j < rgbPalette.length; j++) {
          var rgbVal = rgbPalette[j];
          var rDif = Math.abs(imgData.data[i] - rgbVal[0]),
            gDif = Math.abs(imgData.data[i + 1] - rgbVal[1]),
            bDif = Math.abs(imgData.data[i + 2] - rgbVal[2]);
          difList.push(rDif + gDif + bDif);
        }

        var closestMatch = 0;

        for (var j = 0; j < palette.length; j++) {
          if (difList[j] < difList[closestMatch]) {
            closestMatch = j;
          }
        }

        var paletteRgb = cq.hexToRgb(palette[closestMatch]);
        imgData.data[i] = paletteRgb[0];
        imgData.data[i + 1] = paletteRgb[1];
        imgData.data[i + 2] = paletteRgb[2];

        /* dithering */
        //imgData.data[i + 3] = (255 * Math.random() < imgData.data[i + 3]) ? 255 : 0;

        //imgData.data[i + 3] = imgData.data[i + 3] > 128 ? 255 : 0;
        /*
        if (i % 3 === 0) {
          imgData.data[i] -= $.limitValue(imgData.data[i] - 50, 0, 255);
          imgData.data[i + 1] -= $.limitValue(imgData.data[i + 1] - 50, 0, 255);
          imgData.data[i + 2] -= $.limitValue(imgData.data[i + 2] - 50, 0, 255);
        }
        */

      }

      this.context.putImageData(imgData, 0, 0);

      return this;
    },

    getPalette: function() {
      var palette = [];
      var sourceData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
      var sourcePixels = sourceData.data;

      for (var i = 0, len = sourcePixels.length; i < len; i += 4) {
        if (sourcePixels[i + 3]) {
          var hex = $.rgbToHex(sourcePixels[i + 0], sourcePixels[i + 1], sourcePixels[i + 2]);
          if (palette.indexOf(hex) === -1) palette.push(hex);
        }
      }

      return palette;
    },

    colorToMask: function(color, inverted) {
      color = $.color(color).toArray();
      var sourceData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
      var sourcePixels = sourceData.data;

      var mask = [];

      for (var i = 0, len = sourcePixels.length; i < len; i += 4) {
        if (sourcePixels[i + 0] == color[0] && sourcePixels[i + 1] == color[1] && sourcePixels[i + 2] == color[2]) mask.push(inverted || false);
        else mask.push(!inverted);
      }

      return mask;
    },

    grayscaleToMask: function() {

      var sourceData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
      var sourcePixels = sourceData.data;

      var mask = [];

      for (var i = 0, len = sourcePixels.length; i < len; i += 4) {
        mask.push(((sourcePixels[i + 0] + sourcePixels[i + 1] + sourcePixels[i + 2]) / 3) / 255 | 0);
      }

      return mask;
    },

    applyMask: function(mask) {
      var sourceData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
      var sourcePixels = sourceData.data;

      var mode = typeof mask[0] === "boolean" ? "bool" : "byte";

      for (var i = 0, len = sourcePixels.length; i < len; i += 4) {
        var value = mask[i / 4];
        sourcePixels[i + 3] = value * 255 | 0;
      }

      this.context.putImageData(sourceData, 0, 0);
      return this;
    },

    fillMask: function(mask) {

      var sourceData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
      var sourcePixels = sourceData.data;

      var maskType = typeof mask[0] === "boolean" ? "bool" : "byte";
      var colorMode = arguments.length === 2 ? "normal" : "gradient";

      var color = $.color(arguments[1]);
      if (colorMode === "gradient") colorB = $.color(arguments[2]);

      for (var i = 0, len = sourcePixels.length; i < len; i += 4) {
        var value = mask[i / 4];

        if (maskType === "byte") value /= 255;

        if (colorMode === "normal") {
          if (value) {
            sourcePixels[i + 0] = color[0] | 0;
            sourcePixels[i + 1] = color[1] | 0;
            sourcePixels[i + 2] = color[2] | 0;
            sourcePixels[i + 3] = value * 255 | 0;
          }
        } else {
          sourcePixels[i + 0] = color[0] + (colorB[0] - color[0]) * value | 0;
          sourcePixels[i + 1] = color[1] + (colorB[1] - color[1]) * value | 0;
          sourcePixels[i + 2] = color[2] + (colorB[2] - color[2]) * value | 0;
          sourcePixels[i + 3] = 255;
        }
      }

      this.context.putImageData(sourceData, 0, 0);
      return this;
    },

    clear: function(color) {
      if (color) {
        this.context.fillStyle = color;
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
      } else {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }

      return this;
    },

    clone: function() {
      var result = $.createCanvas(this.canvas);
      // result.getContext("2d").drawImage(this.canvas, 0, 0);
      return $(result);
    },

    gradientText: function(text, x, y, maxWidth, gradient) {

      var words = text.split(" ");

      var h = this.lineHeight() * 2;

      var ox = 0;
      var oy = 0;

      if (maxWidth) {
        var line = 0;
        var lines = [""];

        for (var i = 0; i < words.length; i++) {
          var word = words[i] + " ";
          var wordWidth = this.context.measureText(word).width;

          if (ox + wordWidth > maxWidth) {
            lines[++line] = "";
            ox = 0;
          }

          lines[line] += word;

          ox += wordWidth;
        }
      } else var lines = [text];

      for (var i = 0; i < lines.length; i++) {
        var oy = y + i * h * 0.6 | 0;
        var lingrad = this.context.createLinearGradient(0, oy, 0, oy + h * 0.6 | 0);

        for (var j = 0; j < gradient.length; j += 2) {
          lingrad.addColorStop(gradient[j], gradient[j + 1]);
        }

        var text = lines[i];

        this.fillStyle(lingrad).fillText(text, x, oy);
      }

      return this;
    },

    outline: function() {
      var data = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
      var pixels = data.data;

      var newData = this.createImageData(this.canvas.width, this.canvas.height);
      var newPixels = newData.data;

      var canvas = this.canvas;

      function check(x, y) {

        if (x < 0) return 0;
        if (x >= canvas.width) return 0;
        if (y < 0) return 0;
        if (y >= canvas.height) return 0;

        var i = (x + y * canvas.width) * 4;

        return pixels[i + 3] > 0;

      }

      for (var x = 0; x < this.canvas.width; x++) {
        for (var y = 0; y < this.canvas.height; y++) {

          var full = 0;
          var i = (y * canvas.width + x) * 4;

          if (!pixels[i + 3]) continue;

          full += check(x - 1, y);
          full += check(x + 1, y);
          full += check(x, y - 1);
          full += check(x, y + 1);

          if (full !== 4) {

            newPixels[i] = 255;
            newPixels[i + 1] = 255;
            newPixels[i + 2] = 255;
            newPixels[i + 3] = 255;
          }

        }
      }

      this.context.putImageData(newData, 0, 0);

      return this;
    },

    setHsl: function() {

      if (arguments.length === 1) {
        var args = arguments[0];
      } else {
        var args = arguments;
      }

      var data = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
      var pixels = data.data;
      var r, g, b, a, h, s, l, hsl = [],
        newPixel = [];

      for (var i = 0, len = pixels.length; i < len; i += 4) {
        hsl = $.rgbToHsl(pixels[i + 0], pixels[i + 1], pixels[i + 2]);

        h = args[0] === null ? hsl[0] : $.limitValue(args[0], 0, 1);
        s = args[1] === null ? hsl[1] : $.limitValue(args[1], 0, 1);
        l = args[2] === null ? hsl[2] : $.limitValue(args[2], 0, 1);

        newPixel = $.hslToRgb(h, s, l);

        pixels[i + 0] = newPixel[0];
        pixels[i + 1] = newPixel[1];
        pixels[i + 2] = newPixel[2];
      }

      this.context.putImageData(data, 0, 0);

      return this;
    },

    shiftHsl: function() {

      if (arguments.length === 1) {
        var args = arguments[0];
      } else {
        var args = arguments;
      }

      var data = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
      var pixels = data.data;
      var r, g, b, a, h, s, l, hsl = [],
        newPixel = [];

      for (var i = 0, len = pixels.length; i < len; i += 4) {
        hsl = $.rgbToHsl(pixels[i + 0], pixels[i + 1], pixels[i + 2]);

        if (pixels[i + 0] !== pixels[i + 1] || pixels[i + 1] !== pixels[i + 2]) {
          h = args[0] === null ? hsl[0] : $.wrapValue(hsl[0] + args[0], 0, 1);
          s = args[1] === null ? hsl[1] : $.limitValue(hsl[1] + args[1], 0, 1);
        } else {
          h = hsl[0];
          s = hsl[1];
        }

        l = args[2] === null ? hsl[2] : $.limitValue(hsl[2] + args[2], 0, 1);

        newPixel = $.hslToRgb(h, s, l);

        pixels[i + 0] = newPixel[0];
        pixels[i + 1] = newPixel[1];
        pixels[i + 2] = newPixel[2];
      }


      this.context.putImageData(data, 0, 0);

      return this;
    },

    invert: function(src, dst) {

      var data = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
      var pixels = data.data;
      var r, g, b, a, h, s, l, hsl = [],
        newPixel = [];

      for (var i = 0, len = pixels.length; i < len; i += 4) {
        pixels[i + 0] = 255 - pixels[i + 0];
        pixels[i + 1] = 255 - pixels[i + 1];
        pixels[i + 2] = 255 - pixels[i + 2];
      }

      this.context.putImageData(data, 0, 0);

      return this;
    },

    roundRect: function(x, y, width, height, radius) {

      this.beginPath();
      this.moveTo(x + radius, y);
      this.lineTo(x + width - radius, y);
      this.quadraticCurveTo(x + width, y, x + width, y + radius);
      this.lineTo(x + width, y + height - radius);
      this.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
      this.lineTo(x + radius, y + height);
      this.quadraticCurveTo(x, y + height, x, y + height - radius);
      this.lineTo(x, y + radius);
      this.quadraticCurveTo(x, y, x + radius, y);
      this.closePath();

      return this;
    },


    wrappedText: function(text, x, y, maxWidth, newlineCallback) {

      var words = text.split(" ");

      var lineHeight = this.lineHeight();

      var ox = 0;
      var oy = 0;

      if (maxWidth) {
        var line = 0;
        var lines = [""];

        for (var i = 0; i < words.length; i++) {
          var word = words[i] + " ";
          var wordWidth = this.context.measureText(word).width;

          if (ox + wordWidth > maxWidth || words[i] === "\n") {
            lines[++line] = "";
            ox = 0;
          }
          if (words[i] !== "\n") {
            lines[line] += word;

            ox += wordWidth;
          }


        }
      } else {
        var lines = [text];
      }

      for (var i = 0; i < lines.length; i++) {
        var oy = y + i * lineHeight | 0;

        var text = lines[i];

        if (newlineCallback) newlineCallback.call(this, x, y + oy);

        this.fillText(text, x, oy);
      }

      return this;
    },

    lineHeights: {},

    lineHeight: function() {
      var font = this.font();

      if (!this.lineHeights[font]) {
        var temp = $(100, 100);
        var height = 0;
        var changes = {};
        temp.font(font).fillStyle("#fff");
        temp.textBaseline("bottom").fillText("gM", 25, 100);
        temp.trim(false, changes);
        height += changes.bottom;

        var temp = $(100, 100);
        var changes = {};
        temp.font(font).fillStyle("#fff");
        temp.textBaseline("top").fillText("gM", 25, 0);
        temp.trim(false, changes);
        height += changes.top;

        var temp = $(100, 100);
        var changes = {};
        temp.font(font).fillStyle("#fff");
        temp.textBaseline("alphabetic").fillText("gM", 50, 50);
        temp.trim(false, changes);
        height += temp.height;

        this.lineHeights[font] = height;
      }

      return this.lineHeights[font];
    },

    textBoundaries: function(text, maxWidth) {
      var words = text.split(" ");

      var h = this.lineHeight();

      var ox = 0;
      var oy = 0;

      if (maxWidth) {
        var line = 0;
        var lines = [""];

        for (var i = 0; i < words.length; i++) {
          var word = words[i] + " ";
          var wordWidth = this.context.measureText(word).width;

          if (ox + wordWidth > maxWidth || words[i] === "\n") {
            lines[++line] = "";
            ox = 0;
          }

          if (words[i] !== "\n") {
            lines[line] += word;
            ox += wordWidth;
          }
        }
      } else {
        var lines = [text];
        maxWidth = this.measureText(text).width;
      }

      return {
        height: lines.length * h,
        width: maxWidth,
        lines: lines.length,
        lineHeight: h
      }
    },

    repeatImageRegion: function(image, sx, sy, sw, sh, dx, dy, dw, dh) {
      this.save();
      this.rect(dx, dy, dw, dh);
      this.clip();

      for (var x = 0, len = Math.ceil(dw / sw); x < len; x++) {
        for (var y = 0, leny = Math.ceil(dh / sh); y < leny; y++) {
          this.drawImage(image, sx, sy, sw, sh, dx + x * sw, dy + y * sh, sw, sh);
        }
      }

      this.restore();

      return this;
    },

    repeatImage: function(image, x, y, w, h) {
      if (arguments.length < 9) {
        this.repeatImageRegion(image, 0, 0, image.width, image.height, x, y, w, h);
      } else {
        this.repeatImageRegion.apply(this, arguments);
      }

      return this;
    },

    borderImage: function(image, x, y, w, h, t, r, b, l, fill) {

      if (typeof t === "object") {

        var bottomLeft = t.bottomLeft || [0, 0, 0, 0];
        var bottomRight = t.bottomRight || [0, 0, 0, 0];
        var topLeft = t.topLeft || [0, 0, 0, 0];
        var topRight = t.topRight || [0, 0, 0, 0];

        var clh = bottomLeft[3] + topLeft[3];
        var crh = bottomRight[3] + topRight[3];
        var ctw = topLeft[2] + topRight[2];
        var cbw = bottomLeft[2] + bottomRight[2];

        t.fillPadding = [0, 0, 0, 0];

        if (t.left) t.fillPadding[0] = t.left[2];
        if (t.top) t.fillPadding[1] = t.top[3];
        if (t.right) t.fillPadding[2] = t.right[2];
        if (t.bottom) t.fillPadding[3] = t.bottom[3];

        // if (!t.fillPadding) t.fillPadding = [0, 0, 0, 0];

        if (t.fill) {
          this.drawImage(image, t.fill[0], t.fill[1], t.fill[2], t.fill[3], x + t.fillPadding[0], y + t.fillPadding[1], w - t.fillPadding[2] - t.fillPadding[0], h - t.fillPadding[3] - t.fillPadding[1]);
        } else {
          // this.fillRect(x + t.fillPadding[0], y + t.fillPadding[1], w - t.fillPadding[2] - t.fillPadding[0], h - t.fillPadding[3] - t.fillPadding[1]);
        }

        if (t.left) this[t.left[4] === "stretch" ? "drawImage" : "repeatImage"](image, t.left[0], t.left[1], t.left[2], t.left[3], x, y + topLeft[3], t.left[2], h - clh);
        if (t.right) this[t.right[4] === "stretch" ? "drawImage" : "repeatImage"](image, t.right[0], t.right[1], t.right[2], t.right[3], x + w - t.right[2], y + topLeft[3], t.right[2], h - crh);
        if (t.top) this[t.top[4] === "stretch" ? "drawImage" : "repeatImage"](image, t.top[0], t.top[1], t.top[2], t.top[3], x + topLeft[2], y, w - ctw, t.top[3]);
        if (t.bottom) this[t.bottom[4] === "stretch" ? "drawImage" : "repeatImage"](image, t.bottom[0], t.bottom[1], t.bottom[2], t.bottom[3], x + bottomLeft[2], y + h - t.bottom[3], w - cbw, t.bottom[3]);

        if (t.bottomLeft) this.drawImage(image, t.bottomLeft[0], t.bottomLeft[1], t.bottomLeft[2], t.bottomLeft[3], x, y + h - t.bottomLeft[3], t.bottomLeft[2], t.bottomLeft[3]);
        if (t.topLeft) this.drawImage(image, t.topLeft[0], t.topLeft[1], t.topLeft[2], t.topLeft[3], x, y, t.topLeft[2], t.topLeft[3]);
        if (t.topRight) this.drawImage(image, t.topRight[0], t.topRight[1], t.topRight[2], t.topRight[3], x + w - t.topRight[2], y, t.topRight[2], t.topRight[3]);
        if (t.bottomRight) this.drawImage(image, t.bottomRight[0], t.bottomRight[1], t.bottomRight[2], t.bottomRight[3], x + w - t.bottomRight[2], y + h - t.bottomRight[3], t.bottomRight[2], t.bottomRight[3]);


      } else {


        /* top */
        if (t > 0 && w - l - r > 0) this.drawImage(image, l, 0, image.width - l - r, t, x + l, y, w - l - r, t);

        /* bottom */
        if (b > 0 && w - l - r > 0) this.drawImage(image, l, image.height - b, image.width - l - r, b, x + l, y + h - b, w - l - r, b);
        //      console.log(x, y, w, h, t, r, b, l);
        //      console.log(image, 0, t, l, image.height - b - t, x, y + t, l, h - b - t);
        /* left */
        if (l > 0 && h - b - t > 0) this.drawImage(image, 0, t, l, image.height - b - t, x, y + t, l, h - b - t);


        /* right */
        if (r > 0 && h - b - t > 0) this.drawImage(image, image.width - r, t, r, image.height - b - t, x + w - r, y + t, r, h - b - t);

        /* top-left */
        if (l > 0 && t > 0) this.drawImage(image, 0, 0, l, t, x, y, l, t);

        /* top-right */
        if (r > 0 && t > 0) this.drawImage(image, image.width - r, 0, r, t, x + w - r, y, r, t);

        /* bottom-right */
        if (r > 0 && b > 0) this.drawImage(image, image.width - r, image.height - b, r, b, x + w - r, y + h - b, r, b);

        /* bottom-left */
        if (l > 0 && b > 0) this.drawImage(image, 0, image.height - b, l, b, x, y + h - b, l, b);

        if (fill) {
          if (typeof fill === "string") {
            this.fillStyle(fill).fillRect(x + l, y + t, w - l - r, h - t - b);
          } else {
            if (w - l - r > 0 && h - t - b > 0)
              this.drawImage(image, l, t, image.width - r - l, image.height - b - t, x + l, y + t, w - l - r, h - t - b);
          }
        }
      }
    },

    createImageData: function(width, height) {
      if (false && this.context.createImageData) {
        return this.context.createImageData.apply(this.context, arguments);
      } else {
        if (!this.emptyCanvas) {
          this.emptyCanvas = $.createCanvas(width, height);
          this.emptyCanvasContext = this.emptyCanvas.getContext("2d");
        }

        this.emptyCanvas.width = width;
        this.emptyCanvas.height = height;
        return this.emptyCanvasContext.getImageData(0, 0, width, height);
      }
    },

    setLineDash: function(dash) {
      if (this.context.setLineDash) {
        this.context.setLineDash(dash);
        return this;
      } else return this;
    },

    measureText: function() {
      return this.context.measureText.apply(this.context, arguments);
    },

    getLineDash: function() {
      return this.context.getLineDash();
    },

    createRadialGradient: function() {
      return this.context.createRadialGradient.apply(this.context, arguments);
    },

    createLinearGradient: function() {
      return this.context.createLinearGradient.apply(this.context, arguments);
    },

    createPattern: function() {
      return this.context.createPattern.apply(this.context, arguments);
    },

    getImageData: function() {
      return this.context.getImageData.apply(this.context, arguments);
    },

    get width() {
      return this.canvas.width;
    },

    get height() {
      return this.canvas.height;
    },

    set width(w) {
      this.canvas.width = w;
      this.update();
      return this.canvas.width;
    },

    set height(h) {
      this.canvas.height = h;
      this.update();
      return this.canvas.height;
    }


  };


  /* extend wrapper with drawing context methods */

  var methods = ["arc", "arcTo", "beginPath", "bezierCurveTo", "clearRect", "clip", "closePath", "createLinearGradient", "createRadialGradient", "createPattern", "drawFocusRing", "drawImage", "fill", "fillRect", "fillText", "getImageData", "isPointInPath", "lineTo", "measureText", "moveTo", "putImageData", "quadraticCurveTo", "rect", "restore", "rotate", "save", "scale", "setTransform", "stroke", "strokeRect", "strokeText", "transform", "translate", "setLineDash"];

  for (var i = 0; i < methods.length; i++) {
    var name = methods[i];

    // this.debug = true;

    if ($.Wrapper.prototype[name]) continue;

    if (!this.debug) {
      // if (!$.Wrapper.prototype[name]) $.Wrapper.prototype[name] = Function("this.context." + name + ".apply(this.context, arguments); return this;");

      var self = this;

      (function(name) {

        $.Wrapper.prototype[name] = function() {
          this.context[name].apply(this.context, arguments);
          return this;
        }

      })(name);

    } else {


      var self = this;

      (function(name) {

        $.Wrapper.prototype[name] = function() {
          try {
            this.context[name].apply(this.context, arguments);
            return this;
          } catch (e) {
            var err = new Error();
            console.log(err.stack);
            throw (e + err.stack);

            console.log(e, name, arguments);
          }
        }

      })(name);

    }


  };

  /* create setters and getters */

  var properties = ["canvas", "fillStyle", "font", "globalAlpha", "globalCompositeOperation", "lineCap", "lineJoin", "lineWidth", "miterLimit", "shadowOffsetX", "shadowOffsetY", "shadowBlur", "shadowColor", "strokeStyle", "textAlign", "textBaseline", "lineDashOffset"];
  for (var i = 0; i < properties.length; i++) {
    var name = properties[i];
    if (!$.Wrapper.prototype[name]) $.Wrapper.prototype[name] = Function("if(arguments.length) { this.context." + name + " = arguments[0]; return this; } else { return this.context." + name + "; }");
  };

  /* color */

  $.Color = function(data, type) {

    if (arguments.length) this.parse(data, type);
  }

  $.Color.prototype = {
    parse: function(args, type) {
      if (args[0] instanceof $.Color) {
        this[0] = args[0][0];
        this[1] = args[0][1];
        this[2] = args[0][2];
        this[3] = args[0][3];
        return;
      }

      if (typeof args === "string") {
        var match = null;

        if (args[0] === "#") {
          var rgb = $.hexToRgb(args);
          this[0] = rgb[0];
          this[1] = rgb[1];
          this[2] = rgb[2];
          this[3] = 1.0;
        } else if (match = args.match(/rgb\((.*),(.*),(.*)\)/)) {
          this[0] = match[1] | 0;
          this[1] = match[2] | 0;
          this[2] = match[3] | 0;
          this[3] = 1.0;
        } else if (match = args.match(/rgba\((.*),(.*),(.*)\)/)) {
          this[0] = match[1] | 0;
          this[1] = match[2] | 0;
          this[2] = match[3] | 0;
          this[3] = match[4] | 0;
        } else if (match = args.match(/hsl\((.*),(.*),(.*)\)/)) {
          this.fromHsl(match[1], match[2], match[3]);
        } else if (match = args.match(/hsv\((.*),(.*),(.*)\)/)) {
          this.fromHsv(match[1], match[2], match[3]);
        }
      } else {
        switch (type) {
          case "hsl":
          case "hsla":

            this.fromHsl(args[0], args[1], args[2], args[3]);
            break;

          case "hsv":
          case "hsva":

            this.fromHsv(args[0], args[1], args[2], args[3]);
            break;

          default:
            this[0] = args[0];
            this[1] = args[1];
            this[2] = args[2];
            this[3] = typeof args[3] === "undefined" ? 1.0 : args[3];
            break;
        }
      }
    },

    a: function(a) {
      return this.alpha(a);
    },

    alpha: function(a) {
      this[3] = a;
      return this;
    },

    fromHsl: function() {
      var components = arguments[0] instanceof Array ? arguments[0] : arguments;
      var color = $.hslToRgb(components[0], components[1], components[2]);

      this[0] = color[0];
      this[1] = color[1];
      this[2] = color[2];
      this[3] = typeof arguments[3] === "undefined" ? 1.0 : arguments[3];
    },

    fromHsv: function() {
      var components = arguments[0] instanceof Array ? arguments[0] : arguments;
      var color = $.hsvToRgb(components[0], components[1], components[2]);

      this[0] = color[0];
      this[1] = color[1];
      this[2] = color[2];
      this[3] = typeof arguments[3] === "undefined" ? 1.0 : arguments[3];
    },

    toArray: function() {
      return [this[0], this[1], this[2], this[3]];
    },

    toRgb: function() {
      return "rgb(" + this[0] + ", " + this[1] + ", " + this[2] + ")";
    },

    toRgba: function() {
      return "rgba(" + this[0] + ", " + this[1] + ", " + this[2] + ", " + this[3] + ")";
    },

    toHex: function() {
      return $.rgbToHex(this[0], this[1], this[2]);
    },

    toHsl: function() {
      var c = $.rgbToHsl(this[0], this[1], this[2]);
      c[3] = this[3];
      return c;
    },

    toHsv: function() {
      var c = $.rgbToHsv(this[0], this[1], this[2]);
      c[3] = this[3];
      return c;
    },

    gradient: function(target, steps) {
      var targetColor = $.color(target);
    },

    shiftHsl: function() {
      var hsl = this.toHsl();

      if (this[0] !== this[1] || this[1] !== this[2]) {
        var h = arguments[0] === null ? hsl[0] : $.wrapValue(hsl[0] + arguments[0], 0, 1);
        var s = arguments[1] === null ? hsl[1] : $.limitValue(hsl[1] + arguments[1], 0, 1);
      } else {
        var h = hsl[0];
        var s = hsl[1];
      }

      var l = arguments[2] === null ? hsl[2] : $.limitValue(hsl[2] + arguments[2], 0, 1);

      this.fromHsl(h, s, l);

      return this;
    },

    setHsl: function() {
      var hsl = this.toHsl();

      var h = arguments[0] === null ? hsl[0] : $.limitValue(arguments[0], 0, 1);
      var s = arguments[1] === null ? hsl[1] : $.limitValue(arguments[1], 0, 1);
      var l = arguments[2] === null ? hsl[2] : $.limitValue(arguments[2], 0, 1);

      this.fromHsl(h, s, l);

      return this;
    }

  };

  if (NODEJS)
    global["cq"] = global["CanvasQuery"] = $;
  else
    window["cq"] = window["CanvasQuery"] = $;


  /* nodejs specific stuff */

  cq.Wrapper.prototype.saveAsPNG = function(path) {
    fs.writeFileSync(path, this.canvas.toBuffer());
  }

  cq.loadFromFile = function(path) {
    var buffer = fs.readFileSync(path);
    var img = new Image;
    img.src = buffer;
    return cq(img);
  }


})();
/* script/3rd/canvasquery.extensions.js */

CanvasQuery.Wrapper.prototype.pfont = function(size) {
  size = 12 * (size / 10 | 0);
  return this.font(Math.max(1, size) + "px 'BM germar'");
  return this.font(Math.max(1, size) + "px 'Alterebro Pixel Font'");
};

CanvasQuery.Wrapper.prototype.a = function(a) {
  return this.globalAlpha(a);
};

CanvasQuery.Wrapper.prototype.drawImageScaled = function() {

  // (i, x, y, s)
  // (i, cx, cy, cw, ch, dx, dy, s)

  if (arguments.length === 4) {
    return this.drawImage(arguments[0], 0, 0, arguments[0].width, arguments[0].height, arguments[1], arguments[2], arguments[0].width * arguments[3], arguments[0].width * arguments[3]);
  }
};

CanvasQuery.Wrapper.prototype.drawAnimation = function(key, x, y, delta, duration) {

  var animation = defs.animations[key];

  if (animation.reverse)
    var frame = animation.frames - (animation.frames) * (delta % duration) / duration | 0;
  else
    var frame = (animation.frames) * (delta % duration) / duration | 0;
  var image = app.assets.images[animation.image];

  this.drawImage(image, animation.x + animation.frameWidth * frame, animation.y, animation.frameWidth, animation.frameHeight, x - animation.alignX, y - animation.alignY, animation.frameWidth, animation.frameHeight);
};
/* script/ENGINE.js */

var ENTITIES = {};
var SYSTEMS = {};
var COMPONENTS = {};
var ENGINE = {

  entities: { },
  systems: { }

};
/* script/engine/Collection.js */

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

/* script/engine/Assets.js */

ENGINE.Assets = function() {

  this.images = {};
  this.audio = {};

  /* let's check does the browser prefers MP3 or OGG */

  var canPlayOgg = (new Audio).canPlayType('audio/ogg; codecs="vorbis"');

  this.audioFormat = canPlayOgg ? "ogg" : "mp3";

  /* i prefer COMPOSITION over INHERITANCE */

  this.events = new ENGINE.Events(this);

  /* loader stuff */

  this.reset();

};

ENGINE.Assets.prototype = {

  /* loader */

  add: function(id) {
    this.queue++;
    this.count++;
    this.events.trigger("add", id);
  },

  error: function(id) {
    console.log("unable to load " + id);
    this.events.trigger("error", id);
  },

  ready: function(id) {
    this.queue--;

    this.progress = 1 - this.queue / this.count;

    this.events.trigger("load", id);

    if (this.queue <= 0) {
      this.events.trigger("ready");
      this.reset();
    }
  },

  reset: function() {
    this.progress = 0;
    this.queue = 0;
    this.count = 0;
    this.foobar = 0;
  },

  /* foo 
  /* imaginary timeout to delay loading */

  addFoo: function(timeout) {

    var assets = this;

    this.add("foo " + timeout);

    this.foobar += timeout;

    setTimeout(function() {
      assets.ready("foo " + timeout);
    }, this.foobar * 1000);

  },

  /* images */

  addImage: function() {

    for (var i = 0; i < arguments.length; i++) {

      var arg = arguments[i];

      /* polymorphism at its finest */

      if (typeof arg === "object") {

        for (var key in arg) this.image(arg[key]);

      } else {

        /* if argument is not an object/array let's try to load it */

        var filename = arg;

        var assets = this;

        var fileinfo = filename.match(/(.*)\..*/);
        var key = fileinfo ? fileinfo[1] : filename;

        /* filename defaults to png */

        if (!fileinfo) filename += ".png";

        var path = "assets/images/" + filename;

        this.add(path);

        var image = this.images[key] = new Image;

        image.addEventListener("load", function() {
          assets.ready(path);
        });

        image.addEventListener("error", function() {
          assets.error(path);
        });

        image.src = path;
      }
    }
  },

  /* audio */

  addAudio: function() {

    for (var i = 0; i < arguments.length; i++) {

      var arg = arguments[i];

      /* polymorphism at its finest */

      if (typeof arg === "object") {

        for (var key in arg) this.image(arg[key]);

      } else {

        /* if argument is not an object/array let's try to load it */

        var filename = arg;

        var assets = this;

        var key = filename;

        filename += "." + this.audioFormat;

        var path = "assets/audio/" + filename;

        this.add(path);

        var audio = this.audio[key] = new Audio;

        audio.addEventListener("canplay", function() {
          assets.ready(path);
        });

        audio.addEventListener("error", function() {
          assets.error(path);
        });

        audio.src = path;
      }
    }

  },

  /* fonts */

  addFont: function(name) {
    var styleNode = document.createElement("style");

    console.log(styleNode)
    styleNode.type = "text/css";
    styleNode.textContent = "@font-face { font-family: '" + name + "'; src: url('fonts/" + name + ".ttf') format('truetype'); }";

    console.log(styleNode.textContent);

    document.head.appendChild(styleNode);

    var assets = this;

    this.add(name + ".ttf");

    var layer = cq(32, 32);

    layer.font("10px " + "'" + name + "'").fillText(16, 16, 16).trim();

    var width = layer.width;
    var height = layer.height;

    function check() {

      var layer = cq(32, 32);
      layer.font("10px " + "'" + name + "'").fillText(16, 16, 16);
      layer.trim();
      console.log(name)

      if (layer.width !== width || layer.height !== height) {
        assets.ready(name + ".ttf");
      } else {
        setTimeout(check, 250);
      }
    };

    check();

  }


}

/* script/engine/Mouse.js */

ENGINE.Mouse = function(element) {

  this.events = new ENGINE.Events();

  this.buttons = {};

  this.mousemoveEvent = {};
  this.mousedownEvent = {};
  this.mouseupEvent = {};

  this.x = 0;
  this.y = 0;

  this.offsetX = 0;
  this.offsetY = 0;
  this.scale = 1;

  element.addEventListener("mousemove", this.mousemove.bind(this));
  element.addEventListener("mousedown", this.mousedown.bind(this));
  element.addEventListener("mouseup", this.mouseup.bind(this));
};

ENGINE.Mouse.prototype = {

  mousemove: function(e) {


    this.x = this.mousemoveEvent.x = (e.layerX - this.offsetX) / this.scale | 0;
    this.y = this.mousemoveEvent.y = (e.layerY - this.offsetY) / this.scale | 0;

    this.mousemoveEvent.original = e;

    this.events.trigger("mousemove", this.mousemoveEvent);
  },

  mousedown: function(e) {
    this.mousedownEvent.x = (e.layerX - this.offsetX) / this.scale | 0;
    this.mousedownEvent.y = (e.layerY - this.offsetY) / this.scale | 0;
    this.mousedownEvent.button = e.button;
    this.mousedownEvent.original = e;

    this.buttons[e.button] = true;

    this.events.trigger("mousedown", this.mousedownEvent);
  },

  mouseup: function(e) {
    this.mouseupEvent.x = (e.layerX - this.offsetX) / this.scale | 0;
    this.mouseupEvent.y = (e.layerY - this.offsetY) / this.scale | 0;
    this.mouseupEvent.button = e.button;
    this.mouseupEvent.original = e;

    this.buttons[e.button] = false;

    this.events.trigger("mouseup", this.mouseupEvent);
  },


};

/* script/engine/VideoRecorder.js */

ENGINE.VideoRecorder = function(app, args) {

  this.app = app;

  this.setup(utils.extend({
    followMouse: false,
    framerate: 12,
    playbackRate: 1.2,
    scale: 2
  }, args));

};

ENGINE.VideoRecorder.prototype = {


  setup: function(args) {
    utils.extend(this, args);

    if (!this.region) {
      this.region = [0, 0, this.app.layer.width, this.app.layer.height];
    }

    this.layer = cq(this.region[2] * this.scale | 0, this.region[3] * this.scale | 0);
  },

  start: function() {
    this.encoder = new Whammy.Video(this.framerate * this.playbackRate);
    this.captureTimeout = 0;
  },

  step: function(delta) {
    if (this.encoder) {

      this.captureTimeout -= delta;

      if (this.captureTimeout <= 0) {
        this.captureTimeout = 1000 / this.framerate + this.captureTimeout;

        this.layer.drawImage(this.app.layer.canvas, this.region[0], this.region[1], this.region[2], this.region[3], 0, 0, this.layer.width, this.layer.height);
        this.encoder.add(this.layer.canvas);
      }

      app.screen.save().lineWidth(8).strokeStyle("#c00").strokeRect(0, 0, app.screen.width, app.screen.height).restore();
    }
  },

  stop: function() {
    if (!this.encoder) return;
    var output = this.encoder.compile();
    var url = (window.webkitURL || window.URL).createObjectURL(output);
    window.open(url);

    delete this.encoder;
  },

  toggle: function() {
    if (this.encoder) this.stop();
    else this.start();
  },

};

/* script/engine/Particle.js */

ENGINE.Particle = function(args) {

  utils.extend(this, {
    lifespan: 1,
    color: "#c00"
  }, args);

};

ENGINE.Particle.prototype = {
  
  zIndex: 6,

  step: function(delta) {

    this.gravity += 50 * delta;

    this.x += this.velocity * delta;
    this.y += this.gravity * delta;

    if ((this.lifespan -= delta) <= 0) {
      this.collection.remove(this);
    }

  },

  render: function() {
    app.layer.fillStyle(this.color).fillRect(this.x | 0, this.y | 0, 1, 1);
  }
}

/* script/engine/Entities.js */

ENGINE.Entities = function() {

  this.index = 1;

  this.dirty = false;
  this.groups = [];

  this.delta = 0;

  this.indexes = {};
};

ENGINE.Entities.prototype = new Array;

utils.extend(ENGINE.Entities.prototype, {

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

    console.log(args.body);

    var entity = args;

    //    entity.collection = this;
    entity.index = this.index++;

    this.push(entity);

    this.dirty = true;

    for (var property in entity) {

      //var prototype = COMPONENTS[property];
      if (prototype) {
        //Object.setPrototypeOf(entity[property], prototype);
      }
    }

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

    for (var property in entity) {

      if (!COMPONENTS[property]) continue;
      if (!COMPONENTS[property][method]) continue;

      args.unshift(entity);

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

/* script/engine/States.js */

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

/* script/engine/Application.js */

ENGINE.Application = function(args) {

  utils.extend(this, args);

  /* assets */

  this.assets = new ENGINE.Assets;

  this.assets.events.on("ready", this.ready.bind(this));

  /* add states */

  this.states = new ENGINE.States;

  var app = this;

  /* postpone execution so everything can load */

  setTimeout(function() {
    app.load();
    app.resize();
  }, 1);

  /* layer (canvas) for drawing things */

  /* disable smoothing */

  cq.smoothing = false;

  this.screen = cq();
  this.screen.appendTo("body");

  if (this.scaling) {
    this.layer = cq();
  } else {
    this.layer = this.screen;
  }

  window.addEventListener("resize", this.resize.bind(this));

  /* input devices */

  this.keyboard = new ENGINE.Keyboard();

  this.keyboard.events.on("keydown", this.keydown.bind(this));
  this.keyboard.events.on("keyup", this.keyup.bind(this));

  this.mouse = new ENGINE.Mouse(this.screen.canvas);

  this.mouse.events.on("mousemove", this.mousemove.bind(this));
  this.mouse.events.on("mousedown", this.mousedown.bind(this));
  this.mouse.events.on("mouseup", this.mouseup.bind(this));

  document.addEventListener("contextmenu", function(e) {
    e.preventDefault();
  });

  this.resize();

  /* attach main loop */

  var lastTick = Date.now();

  function step() {
    requestAnimationFrame(step);

    var delta = Date.now() - lastTick;

    // if (delta < 100) return;

    lastTick = Date.now();

    if (delta > 1000) return;

    app.step(delta / 1000);

    app.screen.save();
    app.screen.translate(app.offsetX, app.offsetY);
    app.screen.scale(app.scale, app.scale);
    app.screen.drawImage(app.layer.canvas, 0, 0);
    app.screen.restore();

    app.videoRecorder.step(delta);

  };

  requestAnimationFrame(step);

  /* fancy thing to record game videos */

  this.videoRecorder = new ENGINE.VideoRecorder(this);

};

ENGINE.Application.prototype = {

  step: function(delta) {
    this.states.call("step", delta);
    this.states.call("render", delta);
  },

  keydown: function(data) {

    if (this.keyboard.keys["ctrl"]) {
      switch (data.key) {
        case "f8":
          this.videoRecorder.toggle();
          break;
      }
    }

    this.states.call("keydown", data);
  },

  keyup: function(data) {
    this.states.call("keyup", data);
  },

  mousemove: function(data) {
    this.states.call("mousemove", data);
  },

  mousedown: function(data) {
    this.states.call("mousedown", data);
  },

  mouseup: function(data) {
    this.states.call("mouseup", data);
  },

  resize: function() {

    this.screen.width = window.innerWidth;
    this.screen.height = window.innerHeight;

    if (!this.scaling) {
      this.width = window.innerWidth;
      this.height = window.innerHeight;
    }

    this.layer.width = this.width;
    this.layer.height = this.height;

    if (this.scaling) {

      this.scale = Math.min(window.innerWidth / this.width, window.innerHeight / this.height);
      this.offsetX = (window.innerWidth / 2 - this.scale * (this.width / 2) | 0);
      this.offsetY = (window.innerHeight / 2 - this.scale * (this.height / 2) | 0);

      this.mouse.scale = this.scale;
      this.mouse.offsetX = this.offsetX;
      this.mouse.offsetY = this.offsetY;

    } else {
      this.offsetX = 0;
      this.offsetY = 0;
    }

    this.center = {
      x: this.width / 2 | 0,
      y: this.height / 2 | 0
    };

  },

  playSound: function(key, loop) {
    var audio = this.assets.audio[key];

    audio.currentTime = 0;
    audio.play();
    audio.loop = loop;

    if (loop) audio.volume = 0.5;

    return audio;
  }
};

/* script/engine/Keyboard.js */

ENGINE.Keyboard = function() {

  this.events = new ENGINE.Events();

  this.keys = {};

  document.addEventListener("keydown", this.keydown.bind(this));
  document.addEventListener("keyup", this.keyup.bind(this));

  this.keydownEvent = {};
  this.keyupEvent = {};

};

ENGINE.Keyboard.prototype = {

  keycodes: {
    37: "left",
    38: "up",
    39: "right",
    40: "down",
    45: "insert",
    46: "delete",
    8: "backspace",
    9: "tab",
    13: "enter",
    16: "shift",
    17: "ctrl",
    18: "alt",
    19: "pause",
    20: "capslock",
    27: "escape",
    32: "space",
    33: "pageup",
    34: "pagedown",
    35: "end",
    112: "f1",
    113: "f2",
    114: "f3",
    115: "f4",
    116: "f5",
    117: "f6",
    118: "f7",
    119: "f8",
    120: "f9",
    121: "f10",
    122: "f11",
    123: "f12",
    144: "numlock",
    145: "scrolllock",
    186: "semicolon",
    187: "equal",
    188: "comma",
    189: "dash",
    190: "period",
    191: "slash",
    192: "graveaccent",
    219: "openbracket",
    220: "backslash",
    221: "closebraket",
    222: "singlequote"
  },

  keydown: function(e) {
    if (e.which >= 48 && e.which <= 90) var keyName = String.fromCharCode(e.which).toLowerCase();
    else var keyName = this.keycodes[e.which];

    if (this.keys[keyName]) return;

    this.keydownEvent.key = keyName;
    this.keydownEvent.original = e;

    this.keys[keyName] = true;

    this.events.trigger("keydown", this.keydownEvent);

    e.preventDefault();
  },

  keyup: function(e) {

    if (e.which >= 48 && e.which <= 90) var keyName = String.fromCharCode(e.which).toLowerCase();
    else var keyName = this.keycodes[e.which];

    this.keyupEvent.key = keyName;
    this.keyupEvent.original = e;

    this.keys[keyName] = false;

    this.events.trigger("keyup", this.keyupEvent);
  }

};

/* script/engine/Events.js */

ENGINE.Events = function() {

  this.listeners = {};

};

ENGINE.Events.prototype = {
  on: function(event, callback) {
    if (!this.listeners[event]) this.listeners[event] = [];

    this.listeners[event].push(callback);

    return callback;
  },

  once: function(event, callback) {
    callback.once = true;

    if (!this.listeners[event]) this.listeners[event] = [];

    this.listeners[event].push(callback);

    return callback;
  },

  off: function(event, callback) {
    for (var i = 0, len = this.listeners[event].length; i < len; i++) {
      if (this.listeners[event][i]._remove) {
        this.listeners[event].splice(i--, 1);
        len--;
      }
    }
  },

  trigger: function(event, data) {
  
    /* if you prefer events pipe */

    if (this.listeners["event"]) {
      for (var i = 0, len = this.listeners["event"].length; i < len; i++) {
        this.listeners["event"][i](event, data);
      }
    }

    /* or subscribed to single event */

    if (this.listeners[event]) {
      for (var i = 0, len = this.listeners[event].length; i < len; i++) {
        var listener = this.listeners[event][i];
        listener(data);

        if (listener.once) {
          this.listeners[event].splice(i--, 1);
        }
      }
    }
  }
};

/* script/modules/CollisionManager.js */

ENGINE.CollisionsManager = function(entities) {

  this.entities = entities;

};

ENGINE.CollisionsManager.prototype = {

  collision: function(a, b) {

    return utils.distance(a, b) < a.radius + b.radius;

    utils.rectInRect(a.x, a.y, a.width, a.height, b.x, b.y, b.width, b.height);

  },

  step: function(delta) {
    var collisions = [];

    for (var i = 0; i < this.entities.length; i++) {

      var a = this.entities[i];

      a.colliding = false;

      for (var j = i + 1; j < this.entities.length; j++) {

        var b = this.entities[j];

        if (this.collision(a, b)) {
          collisions.push([a, b]);
        }

      }
    }

    for (var i = 0; i < collisions.length; i++) {
      var a = collisions[i][0];
      var b = collisions[i][1];

      this.entities.callOne(a, "collision", b);
      this.entities.callOne(b, "collision", a);
    }

  }

};

/* script/modules/EntitiesManager.js */

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

    for (var property in entity) {

      if (!COMPONENTS[property]) continue;
      if (!COMPONENTS[property][method]) continue;

      args.unshift(entity);

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

/* script/components/forces.js */

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

/* script/components/renderBoundaries.js */

COMPONENTS.renderBoundaries = {

  render: function(entity, delta, layer) {
    switch (entity.shape) {
      case "rectangle":
        layer.strokeStyle(entity.color).strokeRect(entity.x | 0, entity.y | 0, entity.width, entity.height);
        break;
      case "circle":
        layer.lineWidth(2).strokeStyle(entity.color).strokeCircle(entity.x | 0, entity.y | 0, entity.radius);
        break;
    }
  }

};

/* script/components/bump.js */

COMPONENTS.bump = {

  collision: function(entity, collidable) {

    utils.repulse(entity, collidable);

    var force = collidable.velocity.value;

    if (force > 10) {
      COMPONENTS.forces.add(entity, utils.lookAt(collidable, entity), force, force)
    }
  }

};

/* script/components/followMouse.js */

COMPONENTS.followMouse = {

  step: function(entity, delta) {
    entity.velocity.direction = utils.lookAt(entity, app.mouse);
    entity.velocity.value = utils.distance(entity, app.mouse);

  }

};

/* script/components/velocity.js */

COMPONENTS.velocity = {

  create: function(entity) {

    entity.velocity = {
      value: 0,
      direction: 0,
      rotationSpeed: 1,
      desiredDirection: 0
    };

  },

  step: function(entity, delta) {

    entity.x += Math.cos(entity.velocity.direction) * entity.velocity.value * delta;
    entity.y += Math.sin(entity.velocity.direction) * entity.velocity.value * delta;

  }

};

/* script/components/chasePlayer.js */

COMPONENTS.chasePlayer = {

  step: function(entity, delta) {
    entity.velocity.direction = utils.lookAt(entity, app.game.player);
    entity.velocity.value = utils.distance(entity, app.game.player);

  }

};

/* script/entities/bubble.js */

ENTITIES.bubble = {

  x: 0,
  y: 0,
  
  radius: 8,

  shape: "circle",

  renderBoundaries: true,

  velocity: true,
  
  bump: true,
  
  forces: true

};

/* script/main.js */

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

/* script/app/loader.js */

app.loader = {

  enter: function() {
    
  },

  leave: function() {

  }

};

/* script/app/game.js */

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
          chasePlayer: true
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

