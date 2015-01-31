function Game(game){

}

Game.prototype.preload = function (){
    this.game.load.image('block1', 'assets/block1.png');
    this.game.load.image('badperson', 'assets/badperson.png');
};

Game.prototype.create = function (){
    this.rotationCenterX = this.game.width / 2;
    this.rotationCenterY = this.game.height / 2;
    this.rotationRadius = 450;
    
    this.GRAVITY = 1000;
    //game.physics.arcade.gravity.y = this.GRAVITY;
    game.physics.startSystem(Phaser.Physics.P2JS);
    this.playerCollisionGroup = game.physics.p2.createCollisionGroup();
    this.ringCollisionGroup = game.physics.p2.createCollisionGroup();
    
    this.person = this.game.add.sprite(this.game.width/2, this.game.height/2, 'badperson');
    this.game.physics.p2.enable(this.person, false);
    this.person.body.velocity.x = 10;
    this.person.body.fixedRotation = true;


    this.loop = this.game.add.group();
    var num_blocks = 90;
    for (var i = 0; i < num_blocks; i ++){
        var angle = (i / num_blocks) * 360;
        var radius = this.rotationRadius;
        
        var x = Math.cos(toRadians(angle)) * radius + this.rotationCenterX;
        var y = Math.sin(toRadians(angle)) * radius  + this.rotationCenterY;

        var blk = this.game.add.sprite(x, y, 'block1');
        this.game.physics.p2.enable(blk, false);
        blk.body.setCollisionGroup(this.ringCollisionGroup);
        blk.pivot.x = blk.width / 2;
        blk.pivot.y = blk.height / 2;

        //blk.anchor.x = blk.width / 2;
        //blk.anchor.y = blk.height / 2;
        blk.x = 0;
        blk.y = 0;
        //blk.body.kinematic = true;
        blk.angle = angle + 90;
        //blk.body.velocity.x = Math.sin(toRadians(angle)) * 100;
        //blk.body.velocity.y = - Math.cos(toRadians(angle)) * 100;
        blk.body.fixedRotation = true;
        this.loop.add(blk);
    }
    
    this.game.input.keyboard.addKeyCapture([
        Phaser.Keyboard.LEFT,
        Phaser.Keyboard.RIGHT,
        Phaser.Keyboard.UP,
        Phaser.Keyboard.DOWN
    ]);

    this.cursors = game.input.keyboard.createCursorKeys();

};


Game.prototype.update = function (){
    this.loop.forEach(function (sprite){
        var angle = this.getAngleFromCenter(sprite);
        sprite.angle = angle + 90;

        //sprite.x = Math.cos(toRadians(angle)) * this.rotationRadius;
        //sprite.y = Math.sin(toRadians(angle)) * this.rotationRadius;
        
        //sprite.body.velocity.y = -Math.cos(toRadians(angle)) * 1000;
        //sprite.body.velocity.x = Math.sin(toRadians(angle)) * 1000;
        
    }, this);
    if (this.cursors.left.isDown){
        this.person.body.force.x = -100;
    }
};

Game.prototype.getAngleFromCenter = function (sprite){
    var center = getCenter(sprite);
    return toDegrees(Math.atan2((center.y - this.rotationCenterY) , (center.x - this.rotationCenterX)));
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
