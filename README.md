# 转盘抽奖逻辑
该库适用指针转动或者转盘转动的转盘抽奖。不负责UI。

## 使用
演示效果：  
![xx](./docs/cLottery.gif)   
演示地址： https://xiangwenhu.github.io/circle-lottery/  
html
```html
<div class="draw-container">
    <img src="./images/prizes-3.jpg" class="draw-prizes" class="">
    <img src="./images/btn-draw.png" class="draw-btn" alt="">   
</div>
<script src="./index.js"></script>
<script src="./lottery.js"></script>

```
js
```js
const PRIZE_COUNT = 9;
let enabledDraw = true;

const prizesEl = document.querySelector(".draw-prizes");

let lottery = new Lottery(prizesEl, {
  pits: PRIZE_COUNT
});

lottery.onEnded = function(ins, index, prizeIndexes) {
  enabledDraw = true;
};

document.querySelector(".draw-btn").addEventListener("click", function() {
  if (!enabledDraw) {
    return;
  }
  // 设置奖项
  const indexes = [1];
  lottery.setPrize(indexes);
  lottery.start();
});

```
##参数
* beziers: Array   
自定义贝塞尔
* minCycles: number  
最小圈数
* maxCycles：number   
最大圈数   
* pits: number  
奖品数
* timing: number  
旋转时间



## 特点
1. 代码少
2. 接入简单
3. 内置贝塞尔timing function
4. 支持转盘本身有rotate角度
5. 支持转盘每个奖项占用角度不相同
6. 适用指针转动或者转盘转动



## 思路：
1. css3的transition与transform
2. js的transitionend事件
3. 角度累加



## 待解决
