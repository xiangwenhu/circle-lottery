(function() {
  var proto = Object.prototype;
  var _ = {
    isFunction: function isFunction(fn) {
      return typeof fn === "function" || fn instanceof Function;
    },
    isArray: function(obj) {
      return proto.toString.call(obj) === "[object Array]";
    },
    extend: function extend(target) {
      if (arguments.length < 2) {
        return arguments[0];
      }
      var params = Array.prototype.slice.call(arguments);
      for (var i = 0; i < params.length; i++) {
        var obj = params[i];
        for (var key in obj) {
          target[key] = obj[key];
        }
      }
      return target;
    },
    getRatoteAngle: function getRatoteAngle(el) {
      var reg = /rotate\((\d{0,})deg\)/g;
      var r = reg.exec(el.style.transform);
      if (r !== null) {
        return +r[1];
      }
      // TODO:: getComputedStyle后补
      return 0;
    },
    getRotate: function(el) {
      try {
        var styles = window.getComputedStyle(el, null);
        var tr = styles.getPropertyValue("transform");

        if (tr === "none" || !tr) {
          return 0;
        }

        var values = tr
          .split("(")[1]
          .split(")")[0]
          .split(",");
        var a = values[0];
        var b = values[1];
        var c = values[2];
        var d = values[3];

        var scale = Math.sqrt(a * a + b * b);

        var sin = b / scale;
        var angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
        return angle;
      } catch (err) {
        return 0;
      }
    }
  };

  var CIRCLR_ANGLE = 360;
  var EPSILON = 1;

  var BUILTIN_BEZIER = [
    ".23,1,.32,1", // ease-out-quint
    ".19,1,.22,1", // ease-out-expo,
    ".08,.82,.17,1", // ease-out-circ
    ".22,.61,.36,1", // ease-out-cubic
    ".65,.05,.36,1" // ease-in-out-cubic
  ];

  var defaultOption = {
    timing: 5000, // 单次抽奖转动时间
    pits: 8, // 总坑数
    beziers: BUILTIN_BEZIER, // 内置内赛尔
    minCycles: 5, // 最小圈数
    maxCycles: 10, // 最大圈数
    angles: undefined // 角度数组，当奖项占的角度一致时使用
    //onStart: null, // 当开始
    //onEnded: null,  // 结束
    //onError: null  // 异常
  };

  var slice = Array.prototype.slice;

  function Lottery(el, options) {
    this.el = el;
    this.originOptions = options;
    this.options = _.extend({}, defaultOption, options);
    // 奖项
    this.prizeIndexes = null;
    // 进行中
    this.processing = false;
    // 上次停留位置
    this.lastIndex = 0;
    // 初始角度
    this.initialAngle = -1;

    this.registerEvents();
  }

  Lottery.prototype.getRevisedAngle = function() {
    if (this.initialAngle < 0) {
      this.initialAngle = _.getRotate(this.el);
      return this.initialAngle;
    }
    return 0;
  };

  Lottery.prototype.registerEvents = function() {
    var that = this;
    var el = this.el;
    el.addEventListener("transitionend", function() {
      that.processing = false;
      that.emit("Ended", this);
    });
  };

  Lottery.prototype.start = function(options) {
    if (this.processing) {
      return;
    }
    if (typeof options === "object") {
      this.options = _.extend({}, defaultOption, options);
    }
    this.processing = true;
    this.startAnimate();
    this.emit("Start", this);
  };

  Lottery.prototype.startAnimate = function() {
    var el = this.el;
    var angle = this.getAngle() + this.getRevisedAngle();
    var bezier = this.getBezier();
    var timing = this.options.timing;
    el.style.transform = "rotate(" + angle + "deg)";
    el.style.transition = `transform ${timing}ms cubic-bezier(` + bezier + ")";
  };

  Lottery.prototype.getAngle = function() {
    var options = this.options;
    var prizeIndex = this.prizeIndexes[0];
    var baseDeg = _.getRatoteAngle(this.el);
    var deviationAngle = this.getDeviation();
    var deg = CIRCLR_ANGLE * this.getCycles() + deviationAngle; // 命令目标的偏差角度

    this.lastIndex = prizeIndex;
    return baseDeg + deg;
  };

  Lottery.prototype.getCycles = function() {
    var options = this.options;
    var maxCycles = options.maxCycles;
    var randomCycles =
      options.minCycles + Math.trunc(options.pits * Math.random());
    return Math.min(maxCycles, randomCycles);
  };

  Lottery.prototype.getDeviation = function() {
    var options = this.options;
    var angles = options.angles;
    var prizeIndex = this.prizeIndexes[0];

    var extra =
      prizeIndex >= this.lastIndex
        ? prizeIndex - this.lastIndex
        : options.pits + prizeIndex - this.lastIndex;

    if (extra === 0) {
      return 0;
    }

    // 角度一致
    if (!_.isArray(options.angles)) {
      return (extra * CIRCLR_ANGLE) / options.pits;
    }

    // 角度不一致 ， 开始/2 + 途径 +  结束/2
    var angle = angles[this.lastIndex] / 2;
    var index;
    for (var i = 1; i <= extra; i++) {
      index = (this.lastIndex + i) % options.pits;
      angle += i === extra ? angles[index] / 2 : angles[index];
    }
    return angle;
  };

  Lottery.prototype.getBezier = function() {
    var options = this.options;
    var len = options.beziers.length;
    var beziers = options.beziers;
    return beziers[Math.round(Math.random() * len)] || beziers[0];
  };

  Lottery.prototype.getTiming = function() {
    return this.options.timing;
  };

  Lottery.prototype.emit = function(type) {
    var params = slice.call(arguments);
    var restParams = params.slice(1);
    var type = params[0];

    var method = this["on" + type];
    if (_.isFunction(method)) {
      method.apply(this, restParams);
    }
  };

  Lottery.prototype.stop = function() {
    this.prizeIndexes = null;
    this.processing = false;
  };

  Lottery.prototype.reset = function() {
    this.stop();
    this.options = _.extend({}, defaultOption, this.originOptions);
    this.index = 0;
  };

  Lottery.prototype.setPrize = function(prizeIndexes) {
    if (this.processing) {
      return;
    }
    this.prizeIndexes = prizeIndexes;
  };

  Lottery.prototype.printInfo = function() {
    var now = Date.now();
    this.lastTime = now;
  };

  window.Lottery = Lottery;
})();
