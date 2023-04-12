// ===================== Fall 2022 EECS 493 Assignment 3 =====================
// This starter code provides a structure and helper functions for implementing
// the game functionality. It is a suggestion meant to help you, and you are not
// required to use all parts of it. You can (and should) add additional functions
// as needed or change existing functions.

// ==================================================
// ============ Page Scoped Globals Here ============
// ==================================================


ENEMY_LEFT = "static/src/running-bull-left.png"
ENEMY_RIGHT = "static/src/running-bull-right.png"
PLAYER_LEFT = "static/src/player/cowboy_left.png"
PLAYER_RIGHT = "static/src/player/cowboy_right.png"
PLAYER_SHIELD_LEFT = "static/src/player/cowboy_left_cape.png"
PLAYER_SHIELD_RIGHT = "static/src/player/cowboy_right_cape.png"
AUDIO_COLLECT = "static/src/audio/collect.mp3"
AUDIO_DIE = "static/src/audio/die.mp3"
AUDIO_MUSIC = "static/src/audio/music.mp3"
AUDIO_SPAWN = ""

// Div Handlers
let game_window;
let game_screen;
let onScreenBull;
let players_first_game = true;
let players_first_game2 = true;
let playerAlive = true;
let bullInterval;
let scoreInterval;
let playerInterval;
let cowboy;
let gameVolume = 50;

// Difficulty Helpers'
let difficulty = "normal";  
let bullProjectileSpeed = 3;        // easy: 1, norm: 3, hard: 5
let bullSpawnRate = 800;            // default: 800 for normal

// Game Timing Rates
let cape_spawn_rate = 15000;
let sheep_spawn_rate = 20000;
let refresh_rate = 15;
let dissapear_rate = 5000;
let death_screen_rate = 2000;

// Game Object Helpers
let danger = 20;
let currentBull = 1;
let BULL_OBJECT_REFRESH_RATE = 15;
let maxPersonPosX = 1218;
let maxPersonPosY = 658;
let PERSON_SPEED = 5;                // Speed of the person 
let game_delay = 3000;    
let hasCape = false;           // Delay in miliseconds: 3000 = 3 seconds
let bull_speed_inc = 1.2;
let level_inc = 1;
let score_inc = 40;
let danger_inc = 2;
var music = new Audio(AUDIO_MUSIC);

// Movement Helpers
var LEFT = false;
var RIGHT = false;
var UP = false;
var DOWN = false;
var touched = false;


// ==============================================
// ============ Theme stuff =====================
// ==============================================


const themes = {
  waltuh: {
    '--main-color': '#fc7f03',
    '--background-color': '#f4f4f4',
    '--border-color': '#000',
    '--game-background-color': '#f4f4f4',
    '--game-background-image': 'url("../src/huell.jpg")',
    '--font-color': '#000',
    '--danger-color': '#e41749',
    '--level-color': '#d1197b',
    '--score-color': '#42b5dd',
    '--score-num-color': '#000',
    '--button-background-color': '#fc7f03',
    '--button-border-color': '#000',
    '--button-font-color': '#000',
    '--settings-background-color': '#fc7f03',
    '--settings-border-color': '#000',
    '--settings-font-color': '#000',
    '--slider-background-color': '#d3d3d3',
    '--slider-fill-color': 'opacity(0.7)',
    '--game-over-background-color': '#fc7f03',
    '--game-over-color': '#000',
    '--asteroid-left': 'url("../src/running-bull-right.png")',
    '--asteroid-right': 'url("../src/running-bull-right.png")',
    'ENEMY_LEFT': "static/src/waltuh.png",
    'ENEMY_RIGHT': "static/src/pinkman.webp",
    'PLAYER_LEFT': "static/src/player/saul.webp",
    'PLAYER_RIGHT': "static/src/player/saul.webp",
    'PLAYER_SHIELD_LEFT': "static/src/player/walter.png",
    'PLAYER_SHIELD_RIGHT': "static/src/player/walter.png",
    '--player-width': '50px',
    'AUDIO_COLLECT': "static/src/audio/collect.mp3",
    'AUDIO_DIE': "static/src/audio/die.mp3",
    'AUDIO_MUSIC': "static/src/audio/saul_theme.mp3",
    'AUDIO_SPAWN': "static/src/audio/waltuh.mp3",
  },
  default: {
    '--main-color': 'darkslateblue',
    '--background-color': '#eee',
    '--border-color': 'gainsboro',
    '--game-background-color': 'gainsboro',
    '--game-background-image': 'url("../src/grass.gif")',
    '--font-color': 'white',
    '--danger-color': 'red',
    '--level-color': 'red',
    '--score-color': 'red',
    '--score-num-color': 'red',
    '--button-background-color': 'darkslateblue',
    '--button-border-color': 'black',
    '--button-font-color': 'white',
    '--settings-background-color': 'darkslateblue',
    '--settings-border-color': 'white',
    '--settings-font-color': 'white',
    '--slider-background-color': '#d3d3d3',
    '--slider-fill-color': 'opacity(0.7)',
    '--game-over-background-color': 'darkslateblue',
    '--game-over-color': 'white',
    '--asteroid-left': 'url("../src/running-bull-left.png")',
    '--asteroid-right': 'url("../src/running-bull-right.png")',
    'ENEMY_LEFT': "static/src/running-bull-left.png",
    'ENEMY_RIGHT': "static/src/running-bull-right.png",
    'PLAYER_LEFT': "static/src/player/cowboy_left.png",
    'PLAYER_RIGHT': "static/src/player/cowboy_right.png",
    'PLAYER_SHIELD_LEFT': "static/src/player/cowboy_left_cape.png",
    'PLAYER_SHIELD_RIGHT': "static/src/player/cowboy_right_cape.png",
    'AUDIO_COLLECT': "static/src/audio/collect.mp3",
    'AUDIO_DIE': "static/src/audio/die.mp3",
    'AUDIO_MUSIC': "static/src/audio/music.mp3",
  }
}

// ==============================================
// ============ Functional Code Here ============
// ==============================================







// Main
$(document).ready(function () {
  // ====== Startup ====== 
  game_window = $('.game-window');
  game_screen = $("#actual_game");
  onScreenBull = $('.curBull');
  onScreenSheep = $("#curSheep");
  onScreenShield = $("#curCape");
  onScreenPlayer = $("#curPlayer");
  cowboy = $("#bull_img");

  // Event Listeners
  document.getElementById('play_button').addEventListener("click", beginGame);
  document.getElementById('settings_menu').addEventListener("click", function() { 
    gameSettings(true);
  });
  
  document.getElementById('settings_close_button').addEventListener("click", function() { 
    gameSettings(false);
  });
  document.getElementById('tutorial_button').addEventListener("click", beginGame);
  document.getElementById('game_over_button').addEventListener("click", gameRestart);

  
  
  // ##########################################################
  // Theme stuff
  const themeNames = Object.keys(themes);
  let currentThemeIndex = 0;

  function setTheme(theme) {
    const themeVars = themes[theme];
    if (themeVars) {
      Object.keys(themeVars).forEach(key => {
        document.documentElement.style.setProperty(key, themeVars[key]);
      });
    } else {
      // throw error and log it
      throw new Error(`Theme ${theme} not found`);
    }
  }
  
  function updateCurrentTheme() {
    const currentThemeSpan = document.getElementById('current_theme');
    currentThemeSpan.innerText = `Current Theme: ${themeNames[currentThemeIndex].charAt(0).toUpperCase() + themeNames[currentThemeIndex].slice(1)}`;
  }
  
  updateCurrentTheme();
  
  function toggleTheme() {
    currentThemeIndex = (currentThemeIndex + 1) % themeNames.length;
    setTheme(themeNames[currentThemeIndex]);
    updateCurrentTheme();
    setImages();
  }

  function setImages() {
    currentTheme = themeNames[currentThemeIndex];
    // Each dict from themes[currentTheme] has a key of:
    // ENEMY_LEFT, ENEMY_RIGHT, PLAYER_LEFT, PLAYER_RIGHT, PLAYER_SHIELD_LEFT, PLAYER_SHIELD_RIGHT
    ENEMY_LEFT = themes[currentTheme]['ENEMY_LEFT'] ?? ENEMY_LEFT;
    ENEMY_RIGHT = themes[currentTheme]['ENEMY_RIGHT'] ?? ENEMY_RIGHT;
    PLAYER_LEFT = themes[currentTheme]['PLAYER_LEFT'] ?? PLAYER_LEFT;
    PLAYER_RIGHT = themes[currentTheme]['PLAYER_RIGHT'] ?? PLAYER_RIGHT;
    PLAYER_SHIELD_LEFT = themes[currentTheme]['PLAYER_SHIELD_LEFT'] ?? PLAYER_SHIELD_LEFT;
    PLAYER_SHIELD_RIGHT = themes[currentTheme]['PLAYER_SHIELD_RIGHT'] ?? PLAYER_SHIELD_RIGHT;
    AUDIO_COLLECT = themes[currentTheme]['AUDIO_COLLECT'] ?? AUDIO_COLLECT;
    AUDIO_DIE = themes[currentTheme]['AUDIO_DIE'] ?? AUDIO_DIE;
    AUDIO_MUSIC = themes[currentTheme]['AUDIO_MUSIC'] ?? AUDIO_MUSIC;
    AUDIO_SPAWN = themes[currentTheme]['AUDIO_SPAWN'] ?? AUDIO_SPAWN;
    music = new Audio(AUDIO_MUSIC);
  }		  
  
  document.getElementById('toggle_theme').addEventListener('click', toggleTheme);

  toggleTheme();
  toggleTheme();

  // ##########################################################



  $("#slider").val(50); // set the default valume to 5
  $("#slider").on('input', function () {
    $(".vol_input").html("<b>Volume: </b>" + $(this).val()); 
    gameVolume = $(this).val();
  });

  // changes the selected difficulty level
  $(".difficulty").click(function() {
    let easy = $('#easy');
    let normal = $('#normal');
    let hard = $('#hard');
    easy.toggleClass('chosen_difficulty', $(this).is(easy));
    normal.toggleClass('chosen_difficulty', $(this).is(normal));
    hard.toggleClass('chosen_difficulty', $(this).is(hard));
    difficulty = $(this).attr('id'); // https://www.w3schools.com/jquery/html_attr.asp
  });
});

function beginGame() {
  $('#main_menu').hide();
  $('#tutorial').hide();
  $('.game-window').css({'background-image': 'unset'});

  if (players_first_game) {
    $('#tutorial').show();
    game_window.css({'background-color': 'gainsboro'});
    players_first_game = false;
  } else {
    splashScreen();
  }
}

function gameRestart() {
  // $('#main_menu').show();
  $('#main_buttons').show();
  $('#game_over_menu').hide();
}

function gameSettings(show) {
  if (show) {
    $('#settings').show();
  } 
  else $('#settings').hide();
}

function gameOver() {
  setTimeout(() => {
    cowboy.attr("src", "static/src/player/player.gif");
    $('#actual_game').hide();
    $('#main_menu').show(); // shows the same main menu background as in the start
    $('#main_buttons').hide(); // hides the beginning menu buttons 
    $('.game-window').css({'background-image': 'url("./src/grass-still.png'}); 
    $('#game_over_menu').show(); // will display the end game message
    $('#final_score').html(score);
    $('#final_level').html(level);
  }, death_screen_rate);
}

function splashScreen() {
  score = 0;
  level = 0;

  switch (difficulty) { // sets the values given a selected difficulty. 
	case "easy":
		bullProjectileSpeed = 1;
    bullSpawnRate = 1; // HERE
    danger = 10;
		break;
	case "normal":
		bullProjectileSpeed = 3;
    bullSpawnRate = 800;
    danger = 20;
		break;
	case "hard":
		bullProjectileSpeed = 5;
    bullSpawnRate = 600;
    danger = 30;
		break
	}

  // for the game sounds and their volume level
  $('audio')
		.each(function () {
			this.volume = $('#slider').val() / 100
		});

  $('#score_num').html(score);
	$('#danger_num').html(danger);
	$('#level_num').html(level);

  $('#actual_game').show(); // show actual_game HTML and CSS

  musicVol = parseFloat(gameVolume)/100;
  music.volume = musicVol;
  music.play();

  game_window.css({
		'background-color': 'white'
	});

  if (players_first_game2) {
    players_first_game2=false;
    setTimeout(() => {
      $('#splash_screen').hide();
      startGame();
    }, game_delay);
  } else {
    $('#splash_screen').hide();
      startGame();
  }
}

function startGame() {
  bullInterval = setInterval(spawn, bullSpawnRate);
  scoreInterval = setInterval(() => $('#score_num').html(score += 40), 500);
  playerInterval = setInterval(cowboyMove, 15);
  sheepInterval = setInterval(sheepSpawn, sheep_spawn_rate);
  capeInterval = setInterval(shieldSpawn, cape_spawn_rate);
  bullCollisionInterval = setInterval(bullCollision, refresh_rate);
  
}

function sheepSpawn() {
  onScreenSheep.html("<img class='game_object' src='static/src/sheep.png'/>");
  onScreenSheep.css('left', getRandomNumber(0, 1218));
  onScreenSheep.css('top', getRandomNumber(0, 658));

  // check if the player comes in contact with the portal
  portalCollisionInterval = setInterval(portalCollision, refresh_rate);

  setTimeout(() => {
    onScreenSheep.empty();
    clearInterval(portalCollisionInterval)
  }, dissapear_rate)
}

function portalCollision() {
  if (isColliding(cowboy, onScreenSheep)) {
    var audio = new Audio(AUDIO_COLLECT);
    portalVol = parseFloat(gameVolume)/100;
    audio.volume  = portalVol;
    audio.play();
    clearInterval(portalCollisionInterval);
    onScreenSheep.empty();
    level += 1;
    bullProjectileSpeed *= 1.2;
    danger += 2;
    $('#danger_num').html(danger);
    $('#level_num').html(level)
  }
}

function shieldSpawn() {
  onScreenShield.html("<img class='game_object' src='static/src/red_cape.png'/>");
  onScreenShield.css('left', getRandomNumber(0, 1218));
  onScreenShield.css('top', getRandomNumber(0, 658));

  shieldCollisiontInterval = setInterval(shieldCollision, refresh_rate);

  setTimeout(() => {
    onScreenShield.empty();
    clearInterval(shieldCollisiontInterval)
  }, dissapear_rate)
}

function shieldCollision() {
  if (isColliding(cowboy, onScreenShield)) {
    var audio = new Audio(AUDIO_COLLECT);
    shieldVol = parseFloat(gameVolume)/100;
    audio.volume  = shieldVol;
    audio.play();
    clearInterval(shieldCollisiontInterval);
    onScreenShield.empty();
    hasCape = true
  }
}

function bullCollision() {
  // got the id from the bull class grabbing the bulls children
  $('[id^=a-]').each(function () {
      if (isColliding(cowboy, $(this))) {
        if (hasCape) {
          hasCape = false;
          $(this).remove()
        } else {
          endGame();
        }
      }
    })
}

// function is called when the player dies 
function endGame() {
  music.pause();
  music.currentTime = 0;
  cowboy.attr("src", "static/src/player/player_touched.gif");
  var audio = new Audio(AUDIO_DIE);
  deathVol = parseFloat(gameVolume)/100;
  audio.volume  = deathVol;
  audio.play();
  clearInterval(capeInterval);
  clearInterval(sheepInterval);
  clearInterval(playerInterval);
  clearInterval(bullInterval);
  clearInterval(scoreInterval)
  $('[id^=a-]').each(function () {
      $(this).remove()
    })
  gameOver();
}

function cowboyMove() {
  if (LEFT) {
    var newPosition = parseInt(cowboy.css("left")) - PERSON_SPEED;

    if (newPosition < 0) {
      newPosition = 0;
    } 
    cowboy.css("left", newPosition);

    if (hasCape) {
      cowboy.attr("src", PLAYER_SHIELD_LEFT);
      
    } 
    else {
      cowboy.attr("src", PLAYER_LEFT);
    }
  }
  if (UP) {
    var newPosition = parseInt(cowboy.css("top")) - PERSON_SPEED;

    if (newPosition < 0) {
      newPosition = 0;
    } 
    cowboy.css("top", newPosition);
  }
  if (RIGHT) {
    var newPosition = parseInt(cowboy.css("left")) + PERSON_SPEED;

    if (newPosition > 1218) {
      newPosition = 1218;
    } 
    cowboy.css("left", newPosition);

    if (hasCape) {
      cowboy.attr("src", PLAYER_SHIELD_RIGHT);
    } 
    else {
      cowboy.attr("src", PLAYER_RIGHT);
    }
  }
  if (DOWN) {
    var newPosition = parseInt(cowboy.css("top")) + PERSON_SPEED;

    if (newPosition > 658 ) {
      newPosition = 658;
    } 
    cowboy.css("top", newPosition);
  } 
}

// Keydown event handler
document.onkeydown = function (e) {
  if (e.key == 'ArrowLeft') LEFT = true;
  if (e.key == 'ArrowRight') RIGHT = true;
  if (e.key == 'ArrowUp') UP = true;
  if (e.key == 'ArrowDown') DOWN = true;
}

// Keyup event handler
document.onkeyup = function (e) {
  if (e.key == 'ArrowLeft') LEFT = false;
  if (e.key == 'ArrowRight') RIGHT = false;
  if (e.key == 'ArrowUp') UP = false;
  if (e.key == 'ArrowDown') DOWN = false;
}

// Starter Code for randomly generating and moving an bull on screenonScreenPlayer
// Feel free to use and add additional methods to this class
class Bull {
  // constructs an Bull object
  constructor() {
      /*------------------------Public Member Variables------------------------*/
      // create a new Bull div and append it to DOM so it can be modified later
      // let objectString = "<div id = 'a-" + currentBull + "' class = 'curBull' > <img src = 'src/bull.png'/></div>";
      // onScreenBull.append(objectString);

      let imageSource = Math.random() < 0.5 ? ENEMY_RIGHT : ENEMY_LEFT;
      let objectString = "<div id='a-" + currentBull + "'class = 'curBull' '><img src ='" + imageSource + "'/></div>";
      onScreenBull.append(objectString);

      // select id of this Bull
      this.id = $('#a-' + currentBull);
      currentBull++; // ensure each Bull has its own id
      // current x, y position of this Bull
      this.cur_x = 0; // number of pixels from right
      this.cur_y = 0; // number of pixels from top

      /*------------------------Private Member Variables------------------------*/
      // member variables for how to move the Bull
      this.x_dest = 0;
      this.y_dest = 0;
      // member variables indicating when the Bull has reached the boarder
      this.hide_axis = 'x';
      this.hide_after = 0;
      this.sign_of_switch = 'neg';
      // spawn an Bull at a random location on a random side of the board
      this.#spawnBull();
  }

  // Requires: called by the user
  // Modifies:
  // Effects: return true if current Bull has reached its destination, i.e., it should now disappear
  //          return false otherwise
  hasReachedEnd() {
      if(this.hide_axis == 'x'){
          if(this.sign_of_switch == 'pos'){
              if(this.cur_x > this.hide_after){
                  return true;
              }                    
          }
          else{
              if(this.cur_x < this.hide_after){
                  return true;
              }          
          }
      }
      else {
          if(this.sign_of_switch == 'pos'){
              if(this.cur_y > this.hide_after){
                  return true;
              }                    
          }
          else{
              if(this.cur_y < this.hide_after){
                  return true;
              }          
          }
      }
      return false;
  }

  // Requires: called by the user
  // Modifies: cur_y, cur_x
  // Effects: move this Bull 1 unit in its designated direction
  updatePosition() {
      // ensures all bulls travel at current level's speed
      this.cur_y += this.y_dest * bullProjectileSpeed;
      this.cur_x += this.x_dest * bullProjectileSpeed;
      // update bull's css position
      this.id.css('top', this.cur_y);
      this.id.css('right', this.cur_x);
  }

  // Requires: this method should ONLY be called by the constructor
  // Modifies: cur_x, cur_y, x_dest, y_dest, num_ticks, hide_axis, hide_after, sign_of_switch
  // Effects: randomly determines an appropriate starting/ending location for this Bull
  //          all bulls travel at the same speed
  #spawnBull() {
      // REMARK: YOU DO NOT NEED TO KNOW HOW THIS METHOD'S SOURCE CODE WORKS
      let x = getRandomNumber(0, 1280);
      let y = getRandomNumber(0, 720);
      let floor = 784;
      let ceiling = -64;
      let left = 1344;
      let right = -64;
      let major_axis = Math.floor(getRandomNumber(0, 2));
      let minor_aix =  Math.floor(getRandomNumber(0, 2));
      let num_ticks;

      if(major_axis == 0 && minor_aix == 0){
          this.cur_y = floor;
          this.cur_x = x;
          let bottomOfScreen = game_screen.height();
          num_ticks = Math.floor((bottomOfScreen + 64) / bullProjectileSpeed);

          this.x_dest = (game_screen.width() - x);
          this.x_dest = (this.x_dest - x)/num_ticks + getRandomNumber(-.5,.5);
          this.y_dest = -bullProjectileSpeed - getRandomNumber(0, .5);
          this.hide_axis = 'y';
          this.hide_after = -64;
          this.sign_of_switch = 'neg';
      }
      if(major_axis == 0 && minor_aix == 1){
          this.cur_y = ceiling;
          this.cur_x = x;
          let bottomOfScreen = game_screen.height();
          num_ticks = Math.floor((bottomOfScreen + 64) / bullProjectileSpeed);

          this.x_dest = (game_screen.width() - x);
          this.x_dest = (this.x_dest - x)/num_ticks + getRandomNumber(-.5,.5);
          this.y_dest = bullProjectileSpeed + getRandomNumber(0, .5);
          this.hide_axis = 'y';
          this.hide_after = 784;
          this.sign_of_switch = 'pos';
      }
      if(major_axis == 1 && minor_aix == 0) {
          this.cur_y = y;
          this.cur_x = left;
          let bottomOfScreen = game_screen.width();
          num_ticks = Math.floor((bottomOfScreen + 64) / bullProjectileSpeed);

          this.x_dest = -bullProjectileSpeed - getRandomNumber(0, .5);
          this.y_dest = (game_screen.height() - y);
          this.y_dest = (this.y_dest - y)/num_ticks + getRandomNumber(-.5,.5);
          this.hide_axis = 'x';
          this.hide_after = -64;
          this.sign_of_switch = 'neg';
      }
      if(major_axis == 1 && minor_aix == 1){
          this.cur_y = y;
          this.cur_x = right;
          let bottomOfScreen = game_screen.width();
          num_ticks = Math.floor((bottomOfScreen + 64) / bullProjectileSpeed);

          this.x_dest = bullProjectileSpeed + getRandomNumber(0, .5);
          this.y_dest = (game_screen.height() - y);
          this.y_dest = (this.y_dest - y)/num_ticks + getRandomNumber(-.5,.5);
          this.hide_axis = 'x';
          this.hide_after = 1344;
          this.sign_of_switch = 'pos';
      }
      // show this Bull's initial position on screen
      this.id.css("top", this.cur_y);
      this.id.css("right", this.cur_x);
      // normalize the speed s.t. all Bulls travel at the same speed
      let speed = Math.sqrt((this.x_dest)*(this.x_dest) + (this.y_dest)*(this.y_dest));
      this.x_dest = this.x_dest / speed;
      this.y_dest = this.y_dest / speed;
  }
}

// Spawns an Bull travelling from one border to another
function spawn() {
  let bull = new Bull();
  if (AUDIO_SPAWN != "") {
    var audio = new Audio(AUDIO_SPAWN);
    portalVol = parseFloat(gameVolume)/100;
    audio.volume  = portalVol;
    audio.play();
  }
  setTimeout(spawn_helper(bull), 0);
}

function spawn_helper(bull) {
  let bullMovement = setInterval(function () {
    // update bull position on screen
    bull.updatePosition();

    // determine whether Bull has reached its end position, i.e., outside the game border
    if (bull.hasReachedEnd()) {
      bull.id.remove();
      clearInterval(bullMovement);
    }
  }, BULL_OBJECT_REFRESH_RATE);
}

//===================================================

// ==============================================
// =========== Utility Functions Here ===========
// ==============================================

// Are two elements currently colliding?
function isColliding(o1, o2) {
  return isOrWillCollide(o1, o2, 0, 0);
}

// Will two elements collide soon?
// Input: Two elements, upcoming change in position for the moving element
function willCollide(o1, o2, o1_xChange, o1_yChange) {
  return isOrWillCollide(o1, o2, o1_xChange, o1_yChange);
}

// Are two elements colliding or will they collide soon?
// Input: Two elements, upcoming change in position for the moving element
// Use example: isOrWillCollide(paradeFloat2, person, FLOAT_SPEED, 0)
function isOrWillCollide(o1, o2, o1_xChange, o1_yChange) {
  const o1D = {
    'left': o1.offset().left + o1_xChange,
    'right': o1.offset().left + o1.width() + o1_xChange,
    'top': o1.offset().top + o1_yChange,
    'bottom': o1.offset().top + o1.height() + o1_yChange
  };
  const o2D = {
    'left': o2.offset().left,
    'right': o2.offset().left + o2.width(),
    'top': o2.offset().top,
    'bottom': o2.offset().top + o2.height()
  };
  // Adapted from https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
  if (o1D.left < o2D.right &&
    o1D.right > o2D.left &&
    o1D.top < o2D.bottom &&
    o1D.bottom > o2D.top) {
    // collision detected!
    return true;
  }
  return false;
}

// Get random number between min and max integer
function getRandomNumber(min, max) {
  return (Math.random() * (max - min)) + min;
}




