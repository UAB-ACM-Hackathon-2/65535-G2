function Game(game){

}

violence = false;
Game.prototype.preload = function (){
    this.game.load.image('background1', 'assets/bg1.jpg');
    this.game.load.image('block1', 'assets/platform-small.png');
    this.game.load.image('badperson', 'assets/badperson.png');
    this.game.load.image('standing', 'assets/sprite-standing.png');
    this.game.load.spritesheet('positions', 'assets/spritesheet.png', 75, 150);
    this.game.load.image('scarf', 'assets/shittyscarf.png');
    this.game.load.image('spike', 'assets/spike-one.png');
    this.game.load.image('ground', 'assets/bottom-platform.png');
    this.game.load.image('bloodlet', 'assets/bloodlet.png');
    this.game.load.audio('music', 'assets/Carefree.mp3');
};

Game.prototype.create = function (){
    game.world.setBounds(0,0,500000, 1000);
    this.score = 0;
    this.DEFAULT_SPEED = 800;
    this.speed = this.DEFAULT_SPEED;;
    this.jumpSpeed = -850;
    this.GROUND_LEVEL = this.game.height - 100;
    this.GRAVITY = 3000;
    this.GEN_DISTANCE = 100;
    this.jumping = false;
    this.lastCreatePosition = -100000;
    game.physics.arcade.gravity.y = this.GRAVITY;

    //var background = game.add.tileSprite(0,0,game.world.width,game.world.height, 'background1');
    //background.scale = new Phaser.Point(0.2, 0.2);
    
    this.person = this.game.add.sprite(this.game.width/2, this.game.height/2, 'positions');
    this.game.physics.enable(this.person, Phaser.Physics.ARCADE);
    this.person.animations.add('run', [1, 2], 1, true);
    this.person.animations.add('jump', [3], 1, true);
    this.person.play('run', 5, true);
    //game.camera.follow(this.person, Phaser.Camera.FOLLOW_LOCKON);

    var ground = this.game.add.tileSprite(0, this.GROUND_LEVEL, this.world.width, 500, 'ground');
    ground.magic = true;
    
    this.grounds = this.game.add.group();
    this.grounds.add(ground);
    this.game.physics.enable(ground, Phaser.Physics.ARCADE);
    ground.body.immovable = true;
    ground.body.allowGravity = false;


    this.killers = this.game.add.group();

    this.scoreText = game.add.text(200, 20, "Score: 0", {fill: "#ffffff", size: "100px"});
    this.scoreText.fixedToCamera = true;
    this.scoreText.cameraOffset.setTo(20,20);
    this.game.input.keyboard.addKeyCapture([
        Phaser.Keyboard.LEFT,
        Phaser.Keyboard.RIGHT,
        Phaser.Keyboard.UP,
        Phaser.Keyboard.DOWN
    ]);

    this.cursors = game.input.keyboard.createCursorKeys();

    this.scarves = this.game.add.group();

    this.game.stage.backgroundColor = "#000033";

    this.backgroundMusic = this.game.add.audio('music');
    this.backgroundMusic.volume = 0.3;
    this.backgroundMusic.loop = true;
    this.backgroundMusic.play();
    
};

// Game.prototype.genLevel = function (){
//     var LEVEL_HEIGHT = 200;
//     for (var i = 0; i < 100; i++){
//         var x = Math.random() * game.world.width;
//         var y = (this.GROUND_LEVEL - 100) - LEVEL_HEIGHT * Math.round(Math.random() * 10);
//         console.log("AT: ", x, y);
        
//     }

//     for (var i = 0; i < 200; i++){
//         var x = Math.random() * game.world.width;
//         var y = (this.GROUND_LEVEL - 50);
//         var killer = this.game.add.sprite(x, y, 'badperson');
        
//         this.game.physics.enable(killer, Phaser.Physics.ARCADE);
//         killer.body.immovable = true;
//         killer.body.allowGravity = false;
//         this.killers.add(killer);
//     }
// };

Game.prototype.genStep = function (xlimit){
    var PLATFORM_DIST = 250;
    if (Math.random() < 0.1){
        var prob = Math.random();
        var y = 0; // this.GROUND_LEVEL - Math.round(Math.random() * 10) * 250;
        if (prob < 0.5){
            y = this.GROUND_LEVEL - 1 * PLATFORM_DIST;
        } else if (prob < 0.80) {
            y = this.GROUND_LEVEL - 2 * PLATFORM_DIST;
        } else {
            y = this.GROUND_LEVEL - 3 * PLATFORM_DIST;
        }
        var length = Math.random() * 600;
        if (length < 50){
            length = 100;
        }
        var platform = this.game.add.tileSprite(xlimit + 1, y , length , 25, 'block1');
        //platform.scale = new Phaser.Point(Math.random() * 20, 1);
        this.game.physics.enable(platform, Phaser.Physics.ARCADE);
        platform.body.immovable = true;
        platform.body.allowGravity = false;
        this.grounds.add(platform);

        if (Math.random() < 0.1){
            var spike = this.game.add.sprite(xlimit + Math.random() * length, y - 30, 'spike');
            this.game.physics.enable(spike, Phaser.Physics.ARCADE);
            spike.body.immovable = true;
            spike.body.allowGravity = false;

            this.killers.add(spike);

        }
    }

    if (Math.random() < 0.01){
        var scarf = this.game.add.sprite(xlimit + 1, this.GROUND_LEVEL - Math.random() * ((4 * PLATFORM_DIST)), 'scarf');
        this.game.physics.enable(scarf, Phaser.Physics.ARCADE);
        scarf.body.immovable = true;
        scarf.body.allowGravity = false;
        
        this.scarves.add(scarf);

         if (Math.random() < 0.001){
            scarf.body.angularVelocity = 100;
        }

    }

    if (Math.random() < 0.01){
        var spike = this.game.add.sprite(xlimit + 1, this.GROUND_LEVEL - 30, 'spike');
        this.game.physics.enable(spike, Phaser.Physics.ARCADE);
        spike.body.immovable = true;
        spike.body.allowGravity = false;

        this.killers.add(spike);

    }
};

Game.prototype.cull = function (negxlimit){
    var mark_for_destroy = [];
    function _cull (sprite){
        if (sprite.x < negxlimit) {
            if (!sprite.magic){
                mark_for_destroy.push(sprite);
            }
            
        }
    }
    this.grounds.forEach(_cull, this);
    this.scarves.forEach(_cull, this);
    this.killers.forEach(_cull, this);

    for (var i = 0; i < mark_for_destroy.length; i++){
        mark_for_destroy[i].destroy();
    }

};

Game.prototype.gameOver = function (){
    var goverText = game.add.text(this.game.width/2, this.game.height/2, "Game Over!", {fill: "#FF0000"});
    goverText.fixedToCamera = true;
    goverText.cameraOffset.setTo(this.game.width/2, this.game.height/2 + 30);
    this.speed = 0;

    if (violence){
        var emitter = game.add.emitter(this.person.x + 25, this.person.y + 170, 100);
        emitter.makeParticles('bloodlet');

        emitter.start(false, 1000, 20);
    }

    game.time.events.add(1000, function (){
        window.location = window.location;
    }, this);
    
};

Game.prototype.update = function (){
    var self = this;
    this.score += 0.1;
    this.score += (this.GROUND_LEVEL - this.person.y )/ 4000;
    game.camera.focusOnXY(this.person.x + 500, this.person.y); // TODO: Change this to be responsive.
    
    
    if (this.person.x > this.lastCreatePosition + this.GEN_DISTANCE) {
        this.genStep(this.person.x + 2000);
        this.cull(this.person.x - 2000);
    }
    
    this.game.physics.arcade.collide(this.person, this.grounds);
    this.game.physics.arcade.collide(this.person, this.killers, function (person, killer){
        self.gameOver();
    });

    this.game.physics.arcade.collide(this.person, this.scarves, function (person, scarf){
        scarf.destroy();
        self.score += 100;
    });
    this.person.body.velocity.x = this.speed;
    if (this.cursors.up.isDown && this.person.body.touching.down){
        game.time.events.add(250, function (){
            this.jumping = false;
            this.person.play('run');
            //this.speed = this.DEFAULT_SPEED;
        }, this);
        this.person.play('jump');
        //this.speed = 300;
        this.jumping = true;
    }

    if (this.cursors.up.isUp && this.jumping){
        this.jumping = false;
        //this.speed = this.DEFAULT_SPEED;
        this.person.play('run');
    }

    if (this.jumping){
        this.person.body.velocity.y = this.jumpSpeed;
    }

    this.scoreText.text = "Score: " + Math.round(this.score);

    
};


function toRadians (degrees) {
  return degrees * (Math.PI / 180);
}

function toDegrees (radians) {
  return radians * (180 / Math.PI);
}

function getCenter(sprite){
    var x = sprite.x + sprite.width / 2;
    var y = sprite.y + sprite.height / 2;
    return new Phaser.Point(x, y);
}
var game = new Phaser.Game(
    $("#gamecanvas").width(),
    $("#gamecanvas").height(),
    Phaser.AUTO,
    'gamecanvas');

game.state.add('gamecanvas', Game, true);
