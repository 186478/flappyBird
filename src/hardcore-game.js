import kaboom from "kaboom"

const FLOOR_HEIGHT = 0;
const ROOF_HEIGHT = -250;
const JUMP_FORCE = 700;
const PIPE_SPEED = 200;
const SPEED = 500; 

// initialize context
kaboom();

// load assets
loadSprite("bird", "sprites/bird.png");
loadSprite("pipe", "sprites/pipe1.png");

let bgImage;
async function init() {
  bgImage = await loadSprite("bakgrunn1", "/sprites/bakgrunn1.png");
}

init();

scene("game", () => {

  // define gravity
  gravity(2400);

  let background = add([
    sprite("bakgrunn1"),
    pos(width() / 2, height() / 2),
    origin("center"),
    scale(1),
    fixed(),
  ]);

  background.scaleTo(
    Math.max(width() / bgImage.tex.width,
      height() / bgImage.tex.height)
  );

  // add a game object to screen
  const player = add([
    // list of components
    sprite("bird"),
    pos(80, 40),
    area(),
    body(),
    "bird",
    scale(0.1),
  ]);



  // floor
  const floor = add([
    rect(width(), FLOOR_HEIGHT),
    outline(4),
    pos(0, height()),
    origin("botleft"),
    area(),
    solid(),
    "floor",
    color(127, 200, 255),
  ]);

  //roof
  const roof = add([
    rect(width(), ROOF_HEIGHT),
    pos(0, 0),
    area(),
    solid(),
    "roof",
    color(127, 200, 255),
  ]);

  //pipes
  const PIPE_GAP = 120;

  function producePipes() {
    const offset = rand(-50, 50);

    add([
      sprite("pipe"),
      pos(width(), height() / 2 + offset + PIPE_GAP),
      "pipe",
      area(),
      move(LEFT, SPEED)
    ]);

    add([
      sprite("pipe", { flipY: true }),
      pos(width(), height() / 2 + offset - PIPE_GAP),
      origin("botleft"),
      "pipe",
      area(),
      move(LEFT, SPEED)
    ]);

    wait(1.5, producePipes);

  }

  producePipes();

  function jump() {
    if (!player.isGrounded()) {
      player.jump(JUMP_FORCE);
    }
  }

  // jump when user press space
  onKeyPress("space", jump);
  onClick(jump);

  function addPipe(xPos, yPos) {
    const pipe = add([
      sprite("pipe"),
      pos(xPos, yPos),
      "pipe",
      area(),
      solid(),
      "pipe"
    ]);
    pipe.move(-PIPE_SPEED, 0);
  }

  // check for collisions with pipes
  player.collides("pipe", () => {
    go("lose", { score: score });
  });
  player.collides("floor", () => {
    go("lose", { score: score });
  });
  player.collides("roof", () => {
    go("lose", { score: score });
  });



  // update score
  let score = 0;
  const scoreLabel = add([
    text(score),
    pos(width() / 2, 50),
    scale(2),
  ]);

  action("pipe", (pipe) => {
    if (pipe.pos.x + pipe.width < 0) {
      score++;
      scoreLabel.text = (score / 2);
      destroy(pipe);
    }
  });

  // lose if player collides with any game obj with tag "tree"
  player.onCollide("pipe", () => {
    // go to "lose" scene and pass the score
    const highscore = Number(localStorage.getItem("highscore")) || 0;
    const currentScore = score / 2;
    if (currentScore > highscore) {
      localStorage.setItem("highscore", currentScore,);
    }
    go("lose", currentScore);
    burp();
    addKaboom(player.pos);
  });
  player.onCollide("floor", () => {
    // go to "lose" scene and pass the score
    const highscore = Number(localStorage.getItem("highscore")) || 0;
    const currentScore = score / 2;
    if (currentScore > highscore) {
      localStorage.setItem("highscore", currentScore);
    }
    go("lose", currentScore);
    burp();
    addKaboom(player.pos);
  });
  player.onCollide("roof", () => {
    // go to "lose" scene and pass the score
    const highscore = Number(localStorage.getItem("highscore")) || 0;
    const currentScore = score / 2;
    if (currentScore > highscore) {
      localStorage.setItem("highscore", currentScore);
    }
    go("lose", currentScore);
    burp();
    addKaboom(player.pos);
  });


});

scene("lose", (score) => {

  let background = add([
    sprite("bakgrunn1"),
    pos(width() / 2, height() / 2),
    origin("center"),
    scale(1),
    fixed(),
  ]);

  background.scaleTo(
    Math.max(width() / bgImage.tex.width,
      height() / bgImage.tex.height)
  );

  const highscore = Number(localStorage.getItem("highscore")) || 0;
  // display score and highscore
  add([
    text(`Score: ${score}\nHighscore: ${highscore}`),
    pos(width() / 2, height() / 2 + 80),
    scale(2),
    origin("center"),
  ]);

  add([
    sprite("bird"),
    pos(width() / 2, height() / 2 - 120),
    scale(0.3),
    origin("center"),
  ]);

  // display score


  // go back to game with space is pressed
  onKeyPress("space", () => go("game"));
  onClick(() => go("game"));

});

go("game");