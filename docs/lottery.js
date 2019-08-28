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


function querystring2obj(url) {
    var queryArr = (url && url.substr(url.indexOf('?') + 1).split('&')) ||
        location.search.substr(1).split('&'),
        query = {};
    for (var i = 0, len = queryArr.length; i < len; i++) {
        var key = queryArr[i].split('=')[0],
            val = queryArr[i].split('=')[1];
        if (query.hasOwnProperty(key)) {
            if (!Array.isArray(query[key])) {
                query[key] = [query[key]]
                query[key].push(val)
            } else {
                query[key].push(val)
            }
            continue
        }
        query[key] = val
    }
    return query
}

var PRIZE_COUNT = 6;
var enabledDraw = true;

var prizesEl = null;

var lStart = document.getElementById("lStart");
var lEnd = document.getElementById("lEnd");
var lTiming = document.getElementById("lTiming");

var startT, endT;

// 如下是切换旋转方式逻辑
var rtype =  querystring2obj(location.href).rtype; //"1"; //new URL(location).searchParams.get("rtype");
if (rtype === "1") {
    radio1.checked = true;
    prizesEl = document.querySelector(".draw-prizes");
} else {
    prizesEl = document.querySelector(".draw-btn");
}
typeSelect.addEventListener("change", function (ev) {
    var val = ev.target.value;
    location.href = location.href.split("?")[0] + "?rtype=" + val;
});

var defaultOptions = {
    pits: PRIZE_COUNT
};

var lottery = new Lottery(prizesEl, defaultOptions);

lottery.onEnded = function (ins, index, prizeIndexes) {
    enabledDraw = true;
    endT = Date.now();
    lEnd.innerHTML = endT;
    lTiming.innerHTML = endT - startT + "ms";
};

var btnDraw = document.querySelector(".draw-btn");
var eventName = browser().isPc ? "click" : "touchstart";
var timing = 5000;
btnDraw.addEventListener(eventName, function () {
    if (!enabledDraw) {
        return;
    }
    enabledDraw = false;
    // 设置奖项
    var indexes = [0, 2, 4];
    lottery.setPrize(indexes);
    startT = Date.now();
    lStart.innerHTML = startT;
    lEnd.innerHTML = "";
    lTiming.innerHTML = "";
    lottery.start({
        pits: PRIZE_COUNT,
        timing: timing
    });
});

document.getElementById("timing").addEventListener("change", function (ev) {
    var val = ev.target.value;
    timing = +val;
});