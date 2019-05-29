const PRIZE_COUNT = 6;
let enabledDraw = true;

const prizesEl = document.querySelector(".draw-prizes");

let lottery = new Lottery(prizesEl, {
  pits: PRIZE_COUNT,
  angles: [60, 60, 60, 60, 60, 60]
});

lottery.onEnded = function(ins, index, prizeIndexes) {
  enabledDraw = true;
};

document.querySelector(".draw-btn").addEventListener("click", function() {
  if (!enabledDraw) {
    return;
  }
  // 设置奖项
  const indexes = [2];
  lottery.setPrize(indexes);
  lottery.start();
});
