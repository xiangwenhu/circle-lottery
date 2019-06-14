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

var lStart = document.getElementById("lStart");
var lEnd = document.getElementById("lEnd");
var lTiming = document.getElementById("lTiming");

var startT, endT;

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

var defaultOptions = {
    pits: PRIZE_COUNT
};

var lottery = new Lottery(prizesEl, defaultOptions);

lottery.onEnded = function(ins, index, prizeIndexes) {
    enabledDraw = true;
    endT = Date.now();
    lEnd.innerHTML = endT;
    lTiming.innerHTML = endT - startT + "ms";
};

var btnDraw = document.querySelector(".draw-btn");
var eventName = browser().isPc ? "click" : "touchstart";
var timing = 5000;
btnDraw.addEventListener(eventName, function() {
    if (!enabledDraw) {
        return;
    }
    // 设置奖项
    const indexes = [0, 2, 4];
    lottery.setPrize(indexes);
    startT = Date.now();
    lStart.innerHTML = startT;
    lEnd.innerHTML = "";
    lTiming.innerHTML = "";
    lottery.start({
        ...defaultOptions,
        timing
    });
});

document.getElementById("timing").addEventListener("change", function(ev) {
    var val = ev.target.value;
    timing = +val;
});
