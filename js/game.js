function Game(game){

}

Game.prototype.preload = function (){
    this.game.load.image('block1', 'assets/block1.png');
    this.game.load.image('badperson', 'assets/badperson.png');
};

Game.prototype.create = function (){
    this.GRAVITY = 10;
    game.physics.arcade.gravity.y = this.GRAVITY;
    
    this.person = this.game.add.sprite(this.game.width/2, this.game.height/2, 'badperson');
    this.game.physics.enable(this.person, Phaser.Physics.ARCADE);


    this.loop = this.game.add.group();

    for (var i = 0; i < 360; i += 4){
        var radius = 300;
        var xoffset = this.game.width /2;
        var yoffset = this.game.height /2;
        
        var x = Math.cos(toRadians(i)) * radius + xoffset;
        var y = Math.sin(toRadians(i))* radius  + yoffset;
        
        var blk = this.game.add.sprite(x, y, 'block1');
        this.game.physics.enable(blk, Phaser.Physics.ARCADE);
        //blk.immovable = true;
        blk.angle = i + 45;
        blk.body.velocity.x = 10;
    }
    this.game.input.keyboard.addKeyCapture([
        Phaser.Keyboard.LEFT,
        Phaser.Keyboard.RIGHT,
        Phaser.Keyboard.UP,
        Phaser.Keyboard.DOWN
    ]);
};

Game.prototype.update = function (){
    
};

function toRadians (degrees) {
  return degrees * (Math.PI / 180);
}

console.log("Width: ", $("#gamecanvas").width());
var game = new Phaser.Game(
    $("#gamecanvas").width(),
    $("#gamecanvas").height(),
    Phaser.AUTO,
    'gamecanvas');

game.state.add('gamecanvas', Game, true);
