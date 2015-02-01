function Game(game){

}

Game.prototype.preload = function (){
    this.game.load.image('background1', 'assets/bg1.jpg');
    this.game.load.image('block1', 'assets/block1.png');
    this.game.load.image('badperson', 'assets/badperson.png');
    this.game.load.image('standing', 'assets/sprite-standing.png');
};

Game.prototype.create = function (){
    game.world.setBounds(0,0,500000, 1000);
    this.speed = 800;
    this.jumpSpeed = -500;
    this.GROUND_LEVEL = this.game.height - 100;
    this.GRAVITY = 2000;
    this.jumping = false;
    this.lastJumpTime = 
    game.physics.arcade.gravity.y = this.GRAVITY;

    //var background = game.add.tileSprite(0,0,game.world.width,game.world.height, 'background1');
    //background.scale = new Phaser.Point(0.2, 0.2);
    
    this.person = this.game.add.sprite(this.game.width/2, this.game.height/2, 'standing');
    this.game.physics.enable(this.person, Phaser.Physics.ARCADE);

    //game.camera.follow(this.person, Phaser.Camera.FOLLOW_LOCKON);

    var ground = this.game.add.tileSprite(0, this.GROUND_LEVEL, this.world.width, 50, 'block1');
    
    this.grounds = this.game.add.group();
    this.grounds.add(ground);
    this.game.physics.enable(ground, Phaser.Physics.ARCADE);
    ground.body.immovable = true;
    ground.body.allowGravity = false;


    this.killers = this.game.add.group();
    
    this.game.input.keyboard.addKeyCapture([
        Phaser.Keyboard.LEFT,
        Phaser.Keyboard.RIGHT,
        Phaser.Keyboard.UP,
        Phaser.Keyboard.DOWN
    ]);

    this.cursors = game.input.keyboard.createCursorKeys();
    this.genLevel();
};

Game.prototype.genLevel = function (){
    var LEVEL_HEIGHT = 200;
    for (var i = 0; i < 100; i++){
        var x = Math.random() * game.world.width;
        var y = (this.GROUND_LEVEL - 100) - LEVEL_HEIGHT * Math.round(Math.random() * 10);
        console.log("AT: ", x, y);
        
    }

    for (var i = 0; i < 200; i++){
        var x = Math.random() * game.world.width;
        var y = (this.GROUND_LEVEL - 50);
        var killer = this.game.add.sprite(x, y, 'badperson');
        
        this.game.physics.enable(killer, Phaser.Physics.ARCADE);
        killer.body.immovable = true;
        killer.body.allowGravity = false;
        this.killers.add(killer);
    }
};

Game.prototype.genStep = function (xlimit){
    var platform = this.game.add.tileSprite(xlimit + 1, Math.random() * 500, Math.random() * 6000, 25, 'block1');
        //platform.scale = new Phaser.Point(Math.random() * 20, 1);
        this.game.physics.enable(platform, Phaser.Physics.ARCADE);
        platform.body.immovable = true;
        platform.body.allowGravity = false;
        this.grounds.add(platform);
};

Game.prototype.update = function (){
    game.camera.focusOnXY(this.person.x + 500, this.person.y); // TODO: Change this to be responsive.

    this.genStep(this.person.x + 3000);
    
    this.game.physics.arcade.collide(this.person, this.grounds);
    this.game.physics.arcade.collide(this.person, this.killers, function (person, killer){
        var goverText = game.add.text(20, 20, "Game Over!", {fill: "#FF0000", size: "100px"});
        goverText.fixedToCamera = true;
        goverText.cameraOffset.setTo(20,20);
    });
    this.person.body.velocity.x = this.speed;
    if (this.cursors.up.isDown && this.person.body.touching.down){
        game.time.events.add(250, function (){
            this.jumping = false;
        }, this);
        this.jumping = true;
    }

    if (this.cursors.up.isUp && this.jumping){
        this.jumping = false;
    }

    if (this.jumping){
        this.person.body.velocity.y = this.jumpSpeed;
    }

    
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
