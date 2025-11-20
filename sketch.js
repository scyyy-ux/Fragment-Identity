// 声音驱动碎片文字 + 自定义字体版本

let mic;              // 麦克风
let started = false;  // 是否已经开启音频
let smoothLevel = 0;  // 平滑音量

let txt = "CHUNYUE";  // 想换成别的字可以改这里
const THRESHOLD = 0.01; // 声音门槛

// 自定义字体
let myFont;

// preload 在 setup 之前执行，用来加载字体、图片、声音等
function preload() {
  // 这里的文件名要和左侧文件列表里的名字一模一样
  // 比如你上传的是 "MyFont.otf"，这里也要写 "MyFont.otf"
  myFont = loadFont("myfont.otf");
}

function setup() {
   createCanvas(1000, 800);
  textAlign(CENTER, CENTER);
  textFont(myFont);  // 使用你自己的字体
  textSize(90);
}

function draw() {
  background(255);

  // 还没开麦克风：只画静态字 + 提示
  if (!started) {
    drawStaticText();
    drawHint("点击画布一次以开启麦克风");
    return;
  }

  // 已经开麦：读麦克风音量
  let level = mic ? mic.getLevel() : 0;
  smoothLevel = lerp(smoothLevel, level, 0.3);

  // 声音小于门槛：保持静止
  if (smoothLevel < THRESHOLD) {
    drawStaticText();
  } else {
    // 声音足够大：开始碎、抖动
    drawJitterText(smoothLevel);
  }
}

// 点击画布开启麦克风
function mousePressed() {
  if (!started) {
    userStartAudio(); // 浏览器音频解锁

    mic = new p5.AudioIn();
    mic.start();

    started = true;
  }
}

// 静态文字
function drawStaticText() {
  fill(0);
  noStroke();
  textSize(90);
  text(txt, width / 2, height / 2);
}

// 抖动 / 碎片化文字
function drawJitterText(level) {
  let letters = txt.split("");
  let step = width / (letters.length + 1);

  let baseSize = 80;
  let sizeBoost = map(level, THRESHOLD, 0.1, 0, 200, true);
  let fontSize = baseSize + sizeBoost;

  let globalYShift = map(level, THRESHOLD, 0.1, 0, -60, true);
  let jitterMax = map(level, THRESHOLD, 0.1, 0, 150, true);

  for (let i = 0; i < letters.length; i++) {
    let ch = letters[i];

    let baseX = step * (i + 1);
    let baseY = height / 2 + globalYShift;

    let jx = random(-jitterMax, jitterMax);
    let jy = random(-jitterMax, jitterMax);

    let angleMax = map(level, THRESHOLD, 0.1, 0, PI / 2, true);

    push();
    translate(baseX + jx, baseY + jy);
    rotate(random(-angleMax, angleMax));

    let charSize = fontSize * random(0.8, 1.2);
    textSize(charSize);
    fill(0);
    noStroke();
    text(ch, 0, 0);
    pop();
  }
}

// 提示文字（只在没开启麦克风时出现）
function drawHint(msg) {
  fill(150);
  noStroke();
  textSize(14);
  text(msg, width / 2, height - 30);
}
