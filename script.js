$(document).ready(function() {

let music = document.getElementById('Music');
let volumeSlider = document.getElementById('volume');
music.volume = volumeSlider.value / 100;
volumeSlider.addEventListener('input', function() {
    music.volume = volumeSlider.value / 100;
});
// document.getElementById('Music').volume = 0.05;

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let startButton = document.getElementById('start');

let game_difficulty_container = document.getElementById("game-difficulty");

game_difficulty_container.style.display = "none"; 

startButton.addEventListener("click", event => {
    startButton.disabled = true;
    $("label").animate({opacity: "0"}, 300);
    $("#game-difficulty").animate({opacity: "1"}, 500);
    $("#settingsBtn").animate({opacity: "0"}, 300);
    $("#start").animate({opacity: "0"}, 500);
    $("#shopButton").animate({opacity: "0"}, 500);
    $("#canvas").animate({opacity: "0"}, 500, function(){
             $("label").css("display", "none")
             $("#start").css("display", "none")
             $("#shopButton").css("display", "none")
             $("#settingsBtn").css("display", "none")
             $("#shopMenu").css("display", "none");
    });
    if (game_difficulty_container.style.display === "none" || game_difficulty_container.style.display === "") {
        game_difficulty_container.style.display = "block";

        if (settMenu.style.display === "block") {
            settMenu.style.display = "none";
        }

        if (shopMenu.style.display === "block") {
            shopMenu.style.display = "none";
        }

        let buttons = game_difficulty_container.querySelectorAll("button");

        buttons.forEach(button => {
            button.addEventListener("click", () => {
                game_difficulty_container.style.display = "none";
                startGame();
            });
        });
    }
    else {
        game_difficulty_container.style.display = "none";
    }
});


let canvas_bgi = new Image();
canvas_bgi.src = 'background-day.png';

let canvas_bgi_dark = new Image();
canvas_bgi_dark.src = 'background-night.png';

let birdFrames = [
    new Image(),
    new Image(),
    new Image()
];
birdFrames[0].src = 'yellowbird-downflap.png'; 
birdFrames[1].src = 'yellowbird-midflap.png'; 
birdFrames[2].src = 'yellowbird-upflap.png'; 

let bird = {
    x: 225,
    y: 250,
    width: 68,
    height: 52,
    speed: 0.3,
    directionUp: false,
    gravity: 0.25,
    velocity: 0,
    lift: -8,
    maxFallSpeed: 1.5,
    angle: 0
};

function updateBirdPosition() {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;

    if (bird.velocity > bird.maxFallSpeed) {
        bird.velocity = bird.maxFallSpeed;
    }

    if (bird.velocity < 0) {
        bird.angle += (-45 - bird.angle) * 0.1; 
    } else {
        bird.angle += (45 - bird.angle) * 0.05;
    }

    if (bird.y > canvas.height - baseImg.height - bird.height) {
        bird.y = canvas.height - baseImg.height - bird.height;
        bird.velocity = 0;
        // stopAnimation();
    }
}


let currentFrame = 0;
let frameInterval = 10; 
let frameCount = 0;

let flappy_bird = new Image();
flappy_bird.src = 'Flappy_Bird_Logo_1.png';

let flappyBird = {
    x: 125,
    y: 125,
    width: 300,
    height: 80,
    pulseSpeed: 0.001,  
    pulseMinScale: 0.95, 
    pulseMaxScale: 1.05, 
    scale: 1,          
    pulseDirection: 1
};

let baseFrames = [
    new Image(),
    new Image()
];
baseFrames[0].src = 'g0.png'; 
baseFrames[1].src = 'g1.png'; 

let baseImg = {
    x: 0,
    y: 570,
    width: 550,
    height: 80
};

let currentBackground = canvas_bgi;

let currentBaseFrame = 0; 
let baseFrameInterval = 20; 
let baseFrameCount = 0; 

let score = 0;

let pipeSpeed = 1;

document.getElementById('difficulty-button-easy').addEventListener('click', function() {
    difficulty_easy();
    localStorage.setItem('difficulty', 'easy');
});

document.getElementById('difficulty-button-medium').addEventListener('click', function() {
    difficulty_medium();
    localStorage.setItem('difficulty', 'medium');
});

document.getElementById('difficulty-button-hard').addEventListener('click', function() {
    difficulty_hard();
    localStorage.setItem('difficulty', 'hard');
});

let value = 150;

function speed_zero() {
    pipeSpeed = 0;
}

function difficulty_easy() {
    value = 149.5;
    pipeSpeed = 1.5;
}

function difficulty_medium() {
    value = 150;
    pipeSpeed = 2;
    bird.maxFallSpeed = 2;
}

function difficulty_hard() {
    value = 150;
    pipeSpeed = 2.5;
    bird.maxFallSpeed = 2.5;
}

function drawGame() {
    ctx.fillStyle = "white";
    ctx.font = "32px 'Press Start 2P', cursive";
    ctx.lineWidth = 6;
    ctx.strokeStyle = "black";

    for (let i = 0; i < pipe.length; i++) {

        ctx.drawImage(topPipe, pipe[i].x, pipe[i].y);
        ctx.drawImage(botPipe, pipe[i].x, pipe[i].y + topPipe.height + gap);
        ctx.drawImage(baseFrames[currentBaseFrame], baseImg.x, baseImg.y, baseImg.width, baseImg.height);
        ctx.drawImage(baseFrames[currentBaseFrame], baseImg.x + baseImg.width, baseImg.y, baseImg.width, baseImg.height);
        ctx.strokeText(score, 250, 60);
        ctx.fillText(score, 250, 60);


        pipe[i].x -=pipeSpeed;

        if (pipe[i].x == value) {
            pipe.push({
                x : canvas.width,
                y : Math.floor(Math.random() * topPipe.height) - topPipe.height
            });
        }

        if (bird.x + bird.width >= pipe[i].x
        && bird.x <= pipe[i].x + topPipe.width
        && (bird.y <= pipe[i].y + topPipe.height
            || bird.y + bird.height >= pipe[i].y + topPipe.height + gap) || bird.y + bird.height >= canvas.height - baseImg.height) 
            {speed_zero(), stopAnimation()}

        if (pipe[i].x == value) {
            score++;
            score_audio.play();
        }
}
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(currentBackground, 0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(bird.x + bird.width / 2, bird.y + bird.height / 2); 
    ctx.rotate(bird.angle * Math.PI / 240); 
    ctx.drawImage(birdFrames[currentFrame], -bird.width / 2, -bird.height / 2, bird.width, bird.height); 
    ctx.restore();

    let birdCenterX = flappyBird.x + flappyBird.width / 2;
    let birdCenterY = flappyBird.y + flappyBird.height / 2;

    let newWidth = flappyBird.width * flappyBird.scale;
    let newHeight = flappyBird.height * flappyBird.scale;

    
    let newX = birdCenterX - newWidth / 2;
    let newY = birdCenterY - newHeight / 2;

    ctx.drawImage(flappy_bird, newX, newY, newWidth, newHeight);
    // ctx.drawImage(birdFrames[currentFrame], bird.x, bird.y, bird.width, bird.height);
    ctx.drawImage(baseFrames[currentBaseFrame], baseImg.x, baseImg.y, baseImg.width, baseImg.height);
    ctx.drawImage(baseFrames[currentBaseFrame], baseImg.x + baseImg.width, baseImg.y, baseImg.width, baseImg.height);
    ctx.drawImage(getready, getReady.x, getReady.y, getReady.width, getReady.height);
    ctx.drawImage(gameover, gameOver.x, gameOver.y, gameOver.width, gameOver.height);
    // bird.y += bird.gravity;
}

// function showScore() {
//     console.log(score);
//     ctx.fillStyle = "white";
//     ctx.font = "32px 'Press Start 2P', cursive";
//     ctx.lineWidth = 8;
//     ctx.strokeStyle = "black";
//     ctx.strokeText(score, 150, 60);
//     ctx.fillText(score, 150, 60);
// }

let tranparent_bg = new Image();
tranparent_bg.src = 'transparent-bg.png'

function stopAnimation() {
    hit.play();
    die.play();
    gameStarted = false;
    bird = {
        x: 1000,
        y: 1000,
    };
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(currentBackground, 0, 0, canvas.width, canvas.height);
    topPipe.src = tranparent_bg.src;
    gap = 1500;
    gameOverShow();
    ctx.drawImage(gameover, gameOver.x, gameOver.y, gameOver.width, gameOver.height);
    ctx.drawImage(baseFrames[currentBaseFrame], baseImg.x, baseImg.y, baseImg.width, baseImg.height);
    ctx.drawImage(baseFrames[currentBaseFrame], baseImg.x + baseImg.width, baseImg.y, baseImg.width, baseImg.height);
    $("#back_to_menu").css("display", "block");
    $("#restart").css("display", "block");
    score_audio.volume = 0;
    fly.volume = 0;
    showScore();
}
document.getElementById('back_to_menu').addEventListener('click', function() {
        location.reload(); 
});

document.getElementById('restart').addEventListener('click', function() {
    location.reload();
    localStorage.setItem('startGameOnReload', 'true');
});

window.addEventListener('load', function() {
    if (localStorage.getItem('startGameOnReload') === 'true') {
        localStorage.removeItem('startGameOnReload');
        startGame();
    }

    const difficulty = localStorage.getItem('difficulty');
    if (difficulty) {
        if (difficulty === 'easy') {
            difficulty_easy();
        } else if (difficulty === 'medium') {
            difficulty_medium();
        } else if (difficulty === 'hard') {
            difficulty_hard();
        }
    }
});


function animateBird() {
    if (bird.directionUp) {
        bird.y -= bird.speed;
        if (bird.y <= 250) {
            bird.directionUp = false;
        }
    } else {
        bird.y += bird.speed;
        if (bird.y >= 275) {
            bird.directionUp = true;
        }
    }

    frameCount++;
    if (frameCount >= frameInterval) {
        currentFrame = (currentFrame + 1) % birdFrames.length;
        frameCount = 0;
    }

    baseFrameCount++;
    if (baseFrameCount >= baseFrameInterval) {
        currentBaseFrame = (currentBaseFrame + 1) % baseFrames.length;
        baseFrameCount = 0;
    }

    draw();
    requestAnimationFrame(animateBird);
}

function animateFlappyBird() {
    if (flappyBird.pulseDirection === 1) {
        flappyBird.scale += flappyBird.pulseSpeed;
        if (flappyBird.scale >= flappyBird.pulseMaxScale) {
            flappyBird.pulseDirection = -1;
        }
    } else {
        flappyBird.scale -= flappyBird.pulseSpeed;
        if (flappyBird.scale <= flappyBird.pulseMinScale) {
            flappyBird.pulseDirection = 1;
        }
    }

    draw();
    requestAnimationFrame(animateFlappyBird);
}

canvas_bgi.onload = function() {
    draw();
    animateBird();
    animateFlappyBird();
};

let toggleTheme = document.getElementById('toggleTheme');
toggleTheme.addEventListener('change', function() {
    if (toggleTheme.checked) {
        currentBackground = canvas_bgi_dark;
    } else {
        currentBackground = canvas_bgi;
    }
    draw();
});


function toggleAudio() {
    let audio = document.getElementById("Music");
    let checkbox = document.getElementById("checkboxInput");

    if (checkbox.checked) {
        if (audio.paused) {
            audio.play();
        }
    } else {
        if (!audio.paused) {
            audio.pause();
        }
    }
}

let checkboxInput = document.getElementById('checkboxInput');
checkboxInput.addEventListener('change', toggleAudio);

/*====================================================================*/
let getready = new Image();
getready.src = 'getreadyTap.png';

let getReady = {
  x: 128,
  y: 125,
  width: 0,
  height: 0,
};

function getReadyNone() {
    getReady.width = 0;
    getReady.height = 0;
}

function getReadyShow() {
    getReady.width = 294;
    getReady.height = 267;
}

function birdGameStart() {
    bird.x = -100;
    bird.y = 250;
    bird.width = 51;
    bird.height = 39;

    let birdAnimationInterval = setInterval(function() {
      bird.x += 5;
      if (bird.x >= 150) {
        clearInterval(birdAnimationInterval);
      }
      draw();
    }, 16);
  };

function birdNone() {
    bird.speed = 0;
}

function flappyBirdNone() {
    flappyBird.width = 0;
    flappyBird.height = 0;
}

let gameStarted = false;

function startGame() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        $("label").animate({opacity: "0"}, 500);
        $("#start").animate({opacity: "0"}, 500);
        $("#shopButton").animate({opacity: "0"}, 500);
        $("#canvas").animate({opacity: "0"}, 500, function(){
             $("label").css("display", "none")
             $("button").css("display", "none")
             $("#settingsMenu").css("display", "none")
             $("#shopMenu").css("display", "none")
             flappyBirdNone();
             birdNone();
             birdGameStart();
             getReadyShow();
             draw(); 
        });  
        $("#canvas").animate({opacity: "1"}, 500);
        gameStarted = true;    
}
/*====================================================================*/

function gameLoop() {
    draw();   
    drawGame();
    updateBirdPosition();   
    requestAnimationFrame(gameLoop);  
}

let isGameLoopRunning = false;
let isSpacePressed = false; 

document.addEventListener('keydown', moveUp);

function moveUp() {
    if (gameStarted && !isSpacePressed) { 
        bird.velocity = bird.lift;
        bird.angle = -45;
        fly.play();
        isSpacePressed = true;
    }
}

$(document).keydown(function(event) {
    getReadyNone();
    if (event.code === 'Space' && gameStarted) {
        bird.gravity = 0.5;
        moveUp();
        if (!isGameLoopRunning) {  
            isGameLoopRunning = true;
            gameLoop();  
        }
    }
});

$(document).keyup(function(event) {
    if (event.code === 'Space') {
        isSpacePressed = false;
    }
});

let topPipe = new Image();
let botPipe = new Image();

topPipe.src = 'topPipe.png';
botPipe.src = 'botPipe.png';

let gap = 150;

let pipe = [];

pipe[0] = {
    x : canvas.width,
    y : 0,
    height : 2000
}

pipe[1] = {
    height: 2000
};

let fly = new Audio();
fly.src = "audio_swoosh.ogg";
fly.volume = 0.1;

let score_audio = new Audio();
score_audio.src = "audio_point.ogg";
score_audio.volume = 0.1;

let die = new Audio();
die.src = "audio_die.ogg";
die.volume = 0.1;

let hit = new Audio();
hit.src = "audio_hit.ogg";
hit.volume = 0.1;

let gameover = new Image();
gameover.src = 'gameOver.png'

let gameOver = {
    width: 0,
    height: 0,
    x: 115,
    y: 65
}

function gameOverShow() {
    gameOver.width = 320;
    gameOver.height = 320;
}
/*====================================================================*/
let settBtn = document.getElementById("settingsBtn");
let settMenu = document.getElementById("settingsMenu");

let shopBtn = document.getElementById("shopButton");
let shopMenu = document.getElementById("shopMenu");

settMenu.style.display = "none";
shopMenu.style.display = "none";

settBtn.addEventListener("click", event => {
    if (settMenu.style.display === "none" || settMenu.style.display === "") {
        if (shopMenu.style.display === "block") {
            shopMenu.style.display = "none";
        }
        if (game_difficulty_container.style.display === "block") {
            game_difficulty_container.style.display = "none";
        }
        settMenu.style.display = "block";
    } else {
        settMenu.style.display = "none";
    }
});

shopBtn.addEventListener("click", event => {
    if (shopMenu.style.display === "none" || shopMenu.style.display === "") {
        if (settMenu.style.display === "block") {
            settMenu.style.display = "none";
        }
        if (game_difficulty_container.style.display === "block") {
            game_difficulty_container.style.display = "none";
        }
        shopMenu.style.display = "block";
    } else {
        shopMenu.style.display = "none";
    }
});
/*====================================================================*/
let close_btn = document.getElementById("btn-close");

close_btn.addEventListener("click", event => {
    shopMenu.style.display = "none";
});
/*====================================================================*/
let close_btn_settings = document.getElementById("btn-close-settings");

close_btn_settings.addEventListener("click", event => {
    settMenu.style.display = "none";
})
/*====================================================================*/

let bird_skins_btn = document.getElementById("bird-skins-button");
let bird_skins_container = document.getElementById("bird-skins-container");

bird_skins_container.style.display = "none"; 

bird_skins_btn.addEventListener("click", event => {
    bg_skins_container.style.display = "none";
    pipe_skins_container.style.display = "none";   
    if (bird_skins_container.style.display === "none" || bird_skins_container.style.display === "") {
        bird_skins_container.style.display = "block";
    } else {
        bird_skins_container.style.display = "none";
    }
});

/*====================================================================*/
function changeBirdSkin(skin) {
    birdFrames[0].src = `${skin}-downflap.png`;
    birdFrames[1].src = `${skin}-midflap.png`;
    birdFrames[2].src = `${skin}-upflap.png`;
    
    let birdImage = document.getElementById(skin);
    if (birdImage) {
        birdImage.src = birdFrames[0].src;
    }

    localStorage.setItem('birdSkin', skin);
}

let bluebirdImage = document.getElementById('bluebird');
bluebirdImage.addEventListener('click', function() {
    changeBirdSkin('bluebird');
});

let redbirdImage = document.getElementById('redbird');
redbirdImage.addEventListener('click', function() {
    changeBirdSkin('redbird');
});

let yellowbirdImage = document.getElementById('yellowbird');
yellowbirdImage.addEventListener('click', function() {
    changeBirdSkin('yellowbird');
});

window.addEventListener('load', function() {
    const savedBirdSkin = localStorage.getItem('birdSkin');
    
    if (savedBirdSkin) {
        changeBirdSkin(savedBirdSkin);
        
        const birdImages = document.querySelectorAll('#bird-skins-container img');
        birdImages.forEach(img => {
            img.classList.remove('active-skin');
            if (img.id === savedBirdSkin) {
                img.classList.add('active-skin');
            }
        });
    }
});

/*====================================================================*/
let bg_skins_button = document.getElementById("bg-skins-button");
let bg_skins_container = document.getElementById("bg-skins-container");

bg_skins_container.style.display = "none"; 

bg_skins_button.addEventListener("click", event => {
    bird_skins_container.style.display = "none";
    pipe_skins_container.style.display = "none"; 

    if (bg_skins_container.style.display === "none" || bg_skins_container.style.display === "") {
        bg_skins_container.style.display = "block";
    } else {
        bg_skins_container.style.display = "none";
    }
});

let bg1 = document.getElementById('background-dusk-sea');
let bg2 = document.getElementById('background-day');
let bg3 = document.getElementById('background-sea');

function setBackground(skin) {
    currentBackground = skin;
    localStorage.setItem('backgroundSkin', skin.id);
    draw();
}

bg1.addEventListener('click', function() {
    setBackground(bg1);
});

bg2.addEventListener('click', function() {
    setBackground(bg2);
});

bg3.addEventListener('click', function() {
    setBackground(bg3);
});

window.addEventListener('load', function() {
    const savedBackgroundSkin = localStorage.getItem('backgroundSkin');
    
    if (savedBackgroundSkin) {
        let backgroundElement = document.getElementById(savedBackgroundSkin);
        if (backgroundElement) {
            setBackground(backgroundElement);
        }
    }
});
/*====================================================================*/
let pipe_skins_button = document.getElementById("pipe-skins-button");
let pipe_skins_container = document.getElementById("pipe-skins-container");

pipe_skins_container.style.display = "none"; 

pipe_skins_button.addEventListener("click", event => {
    bird_skins_container.style.display = "none";
    bg_skins_container.style.display = "none"; 

    if (pipe_skins_container.style.display === "none" || pipe_skins_container.style.display === "") {
        pipe_skins_container.style.display = "block";
    } else {
        pipe_skins_container.style.display = "none";
    }
});
/*====================================================================*/
let bot_pipe_red = document.getElementById('bot-pipe-red');
let top_pipe_red = document.getElementById('top-pipe-red');
let bot_pipe_green = document.getElementById('bot-pipe-green');
let top_pipe_green = document.getElementById('top-pipe-green');
let bot_pipe_blue = document.getElementById('bot-pipe-blue');
let top_pipe_blue = document.getElementById('top-pipe-blue');

function setPipeSkin(topPipeImage, botPipeImage) {
    topPipe = new Image();
    botPipe = new Image();
    topPipe.src = topPipeImage.src;
    botPipe.src = botPipeImage.src;

    localStorage.setItem('topPipeSkin', topPipeImage.id);
    localStorage.setItem('botPipeSkin', botPipeImage.id);

    draw();
}

bot_pipe_red.addEventListener('click', function() {
    setPipeSkin(top_pipe_red, bot_pipe_red);
});

bot_pipe_green.addEventListener('click', function() {
    setPipeSkin(top_pipe_green, bot_pipe_green);
});

bot_pipe_blue.addEventListener('click', function() {
    setPipeSkin(top_pipe_blue, bot_pipe_blue);
});

window.addEventListener('load', function() {
    const savedTopPipeSkin = localStorage.getItem('topPipeSkin');
    const savedBotPipeSkin = localStorage.getItem('botPipeSkin');
    
    if (savedTopPipeSkin && savedBotPipeSkin) {
        let topPipeImage = document.getElementById(savedTopPipeSkin);
        let botPipeImage = document.getElementById(savedBotPipeSkin);
        
        if (topPipeImage && botPipeImage) {
            setPipeSkin(topPipeImage, botPipeImage);
        }
    }
});

/*====================================================================*/
$(document).ready(function() {
    function setActiveSkin(containerId, storageKey) {
        const savedSkin = localStorage.getItem(storageKey);
        if (savedSkin) {
            $(`#${containerId} img`).removeClass('active-skin');
            $(`#${containerId} img[id="${savedSkin}"]`).addClass('active-skin');
        }

        $(`#${containerId} img`).on('click', function() {
            $(`#${containerId} img`).removeClass('active-skin');
            $(this).addClass('active-skin');
            localStorage.setItem(storageKey, $(this).attr('id'));
        });
    }

    setActiveSkin('bird-skins-container', 'birdSkin');
    setActiveSkin('bg-skins-container', 'backgroundSkin');
    setActiveSkin('pipe-skins-container', 'pipeSkin');
});

























});