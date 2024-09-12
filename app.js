const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
// getContext() method會回傳一個canvas的drawing context
// drawing context可以用來在canvas內畫圖
// CanvasRenderingContext2D

const unit = 20;
const row = canvas.height / unit; // 320 / 20 = 16
const column = canvas.width / unit; // 320 / 20 = 16

let snake = []; // array中的每個元素，都是一個物件
function createSnake() {
  // 物件的工作室，儲存身體的x, y座標
  snake[0] = {
    x: 80,
    y: 0,
  };

  snake[1] = {
    x: 60,
    y: 0,
  };

  snake[2] = {
    x: 40,
    y: 0,
  };

  snake[3] = {
    x: 20,
    y: 0,
  };
}

// 設定果實座標
class Fruit {
  constructor() {
    this.x = Math.floor(Math.random() * column) * unit;
    this.y = Math.floor(Math.random() * row) * unit;
  }

  drawFruit() {
    ctx.fillStyle = "yellow";
    ctx.fillRect(this.x, this.y, unit, unit);
  }

  pickLocation() {
    let overlapping = false;
    let new_x;
    let new_y;

    function checkOverlap(new_x, new_y) {
      for (let i = 0; i < snake.length; i++) {
        if (new_x == snake[i].x && new_y == snake[i].y) {
          overlapping = true;
          return;
        } else {
          overlapping = false;
        }
      }
    }

    do {
      new_x = Math.floor(Math.random() * column) * unit;
      new_y = Math.floor(Math.random() * row) * unit;
      checkOverlap(new_x, new_y);
    } while (overlapping);

    this.x = new_x;
    this.y = new_y;
  }
}

// 初始設定
createSnake();
let myFruit = new Fruit();

window.addEventListener("keydown", changeDirection);
let d = "Right";
function changeDirection(e) {
  if (e.key == "ArrowLeft" && d != "Right") {
    d = "Left";
  } else if (e.key == "ArrowRight" && d != "Left") {
    d = "Right";
  } else if (e.key == "ArrowUp" && d != "Down") {
    d = "Up";
  } else if (e.key == "ArrowDown" && d != "Up") {
    d = "Down";
  }

  // 每次按完方向鍵後，在下一幀被畫出來之前
  // 不接受任何keydown事件
  //  這樣可以防止連續按鍵導致蛇在邏輯上自殺
  window.removeEventListener("keydown", changeDirection);
}

let score = 0;
let highestScore;
loadHighestScore();
document.getElementById("myScore").innerHTML = "遊戲分數: " + score;
document.getElementById("myScore2").innerHTML = "最高分數: " + highestScore;

function draw() {
  // 確認蛇有沒有咬到自己
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
      clearInterval(myGame);
      alert("遊戲結束");
      return;
    }
  }

  // 背景全設定為黑色
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 劃出果實
  myFruit.drawFruit();

  // 劃出蛇
  for (let i = 0; i < snake.length; i++) {
    if (i == 0) {
      ctx.fillStyle = "lightgreen";
    } else {
      ctx.fillStyle = "lightblue";
    }
    // 蛇穿牆
    if (snake[i].x >= canvas.width) {
      snake[i].x = 0;
    }
    if (snake[i].x < 0) {
      snake[i].x = canvas.width - unit;
    }
    if (snake[i].y >= canvas.height) {
      snake[i].y = 0;
    }
    if (snake[i].y < 0) {
      snake[i].y = canvas.height - unit;
    }

    ctx.strokeStyle = "white";
    // x, y, width, height
    ctx.fillRect(snake[i].x, snake[i].y, unit, unit);
    ctx.strokeRect(snake[i].x, snake[i].y, unit, unit);
  }

  // 以目前的d變數方向，來決定蛇的下一幀要放在哪個座標
  let snakeX = snake[0].x; // snake[0]是一個物件，但snake[0].x是個number
  let snakeY = snake[0].y;
  if (d == "Left") {
    snakeX -= unit;
  } else if (d == "Up") {
    snakeY -= unit;
  } else if (d == "Right") {
    snakeX += unit;
  } else if (d == "Down") {
    snakeY += unit;
  }

  let newHead = {
    x: snakeX,
    y: snakeY,
  };

  // 確認蛇是否吃到果實
  if (snake[0].x == myFruit.x && snake[0].y == myFruit.y) {
    // 重新選定一個新的隨機位置
    myFruit.pickLocation();
    //更新分數
    score++;
    setHighestScore(score);
    document.getElementById("myScore").innerHTML = "遊戲分數: " + score;
    document.getElementById("myScore2").innerHTML = "最高分數: " + highestScore;
  } else {
    snake.pop();
  }
  snake.unshift(newHead);
  window.addEventListener("keydown", changeDirection);
}

for (let i = 0; i < snake.length; i++) {
  if (i == 0) {
    ctx.fillStyle = "lightgreen";
  } else {
    ctx.fillStyle = "lightblue";
  }
  ctx.strokeStyle = "white";
  // x, y, width, height
  ctx.fillRect(snake[i].x, snake[i].y, unit, unit);
  ctx.strokeRect(snake[i].x, snake[i].y, unit, unit);
}

let myGame = setInterval(draw, 100); // 每0.1s執行一次

function loadHighestScore() {
  if (localStorage.getItem("highestScore") == null) {
    highestScore = 0;
  } else {
    highestScore = Number(localStorage.getItem("highestScore"));
  }
}

function setHighestScore(score) {
  if (score > highestScore) {
    localStorage.setItem("highestScore", score);
    highestScore = score;
  }
}
