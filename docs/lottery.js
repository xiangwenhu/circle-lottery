function browser() {
  var ua = navigator.userAgent,
    isWindowsPhone = /(?:Windows Phone)/.test(ua),
    isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone,
    isAndroid = /(?:Android)/.test(ua),
    isFireFox = /(?:Firefox)/.test(ua),
    isChrome = /(?:Chrome|CriOS)/.test(ua),
    isTablet =
      /(?:iPad|PlayBook)/.test(ua) ||
      (isAndroid && !/(?:Mobile)/.test(ua)) ||
      (isFireFox && /(?:Tablet)/.test(ua)),
    isPhone = /(?:iPhone)/.test(ua) && !isTablet,
    isPc = !isPhone && !isAndroid && !isSymbian;
  return {
    isTablet: isTablet,
    isPhone: isPhone,
    isAndroid: isAndroid,
    isPc: isPc
  };
}

var PRIZE_COUNT = 6;
var enabledDraw = true;

var prizesEl = null;

// 如下是切换旋转方式逻辑
var rtype = new URL(location).searchParams.get("rtype");
if (rtype === "1") {
  radio1.checked = true;
  prizesEl = document.querySelector(".draw-prizes");
} else {
  prizesEl = document.querySelector(".draw-btn");
}
typeSelect.addEventListener("change", function(ev) {
  var val = ev.target.value;
  location.href = location.href.split("?")[0] + "?rtype=" + val;
});

var lottery = new Lottery(prizesEl, {
  pits: PRIZE_COUNT,
  angles: [60, 60, 60, 60, 60, 60]
});

lottery.onEnded = function(ins, index, prizeIndexes) {
  enabledDraw = true;
};

var btnDraw = document.querySelector(".draw-btn");
var eventName = browser().isPc ? "click" : "touchstart";

btnDraw.addEventListener(eventName, function() {
  if (!enabledDraw) {
    return;
  }
  // 设置奖项
  const indexes = [0, 2, 4];
  lottery.setPrize(indexes);
  lottery.start();
});
