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