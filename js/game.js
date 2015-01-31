function Game(game){

}

Game.prototype.preload = function (){
    this.game.load.image('block1', 'assets/block1.png');
    this.game.load.image('badperson', 'assets/badperson.png');
};

Game.prototype.create = function (){
    game.world.setBounds(0,0,500000, 1000);
    this.speed = 800;
    this.jumpSpeed = -700;
    this.GROUND_LEVEL = this.game.height - 100;
    this.GRAVITY = 1000;
    game.physics.arcade.gravity.y = this.GRAVITY;

    //var background = game.add.tileSprite(0,0,game.world.width,game.world.height, 'badperson');
    
    this.person = this.game.add.sprite(this.game.width/2, this.game.height/2, 'badperson');
    this.game.physics.enable(this.person, Phaser.Physics.ARCADE);

    //game.camera.follow(this.person, Phaser.Camera.FOLLOW_LOCKON);

    var ground = this.game.add.sprite(0, this.GROUND_LEVEL, 'block1');
    
    ground.scale = new Phaser.Point(1000,1);
    this.grounds = this.game.add.group();
    this.grounds.add(ground);
    this.game.physics.enable(ground, Phaser.Physics.ARCADE);
    ground.body.immovable = true;
    ground.body.allowGravity = false;
    
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
    var LEVEL_HEIGHT = 100;
    for (var i = 0; i < 1000; i++){
        var x = Math.random() * game.world.width;
        var y = (this.GROUND_LEVEL - 100) - LEVEL_HEIGHT * Math.round(Math.random() * 10);
        console.log("AT: ", x, y);
        var platform = this.game.add.sprite(x, y, 'block1');
        platform.scale = new Phaser.Point(Math.random() * 10, 1);
        this.game.physics.enable(platform, Phaser.Physics.ARCADE);
        platform.body.immovable = true;
        platform.body.allowGravity = false;
        this.grounds.add(platform);
    }
};

Game.prototype.update = function (){
    game.camera.focusOnXY(this.person.x + 500, this.person.y); // TODO: Change this to be responsive.
    this.game.physics.arcade.collide(this.person, this.grounds);
    this.person.body.velocity.x = this.speed;
    if (this.cursors.up.isDown && this.person.body.touching.down){
        this.person.body.velocity.y += this.jumpSpeed;
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
