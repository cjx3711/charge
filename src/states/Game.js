
BasicGame.Game = function (game) {

	//	When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:

    this.game;		//	a reference to the currently running game
    this.add;		//	used to add sprites, text, groups, etc
    this.camera;	//	a reference to the game camera
    this.cache;		//	the game cache
    this.input;		//	the global input manager (you can access this.input.keyboard, this.input.mouse, as well from it)
    this.load;		//	for preloading assets
    this.math;		//	lots of useful common math operations
    this.sound;		//	the sound manager - add a sound, play one, set-up markers, etc
    this.stage;		//	the game stage
    this.time;		//	the clock
    this.tweens;    //  the tween manager
    this.state;	    //	the state manager
    this.world;		//	the game world
    this.particles;	//	the particle manager
    this.physics;	//	the physics manager
    this.rnd;		//	the repeatable random number generator

    //	You can use any of these from any function within this State.
    //	But do consider them as being 'reserved words', i.e. don't create a property for your own game called "world" or you'll over-write the world reference.
		this.roundTime = 1000;
		this.timeThreshold = 0.15;
		this.roundTimer = this.roundTime;
		this.gameObj = {
			screenText: null,
			player1Stats: null,
			player2Stats: null,

		}




};

BasicGame.Game.prototype = {

	create: function () {
		console.log("Game create function");

		this.game.stage.backgroundColor = '#000000';
		//	Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
		this.cursors = this.game.input.keyboard.createCursorKeys();
		var style = { font: "bold 32px Arial", fill: "#fff" };
		this.gameObj.screenText = this.game.add.text(10, 10, "Hello", style);
		this.gameObj.player1Stats = this.game.add.text(10, 100, "Hello", style);
		this.gameObj.player2Stats = this.game.add.text(10, 200, "Hello", style);
		// this.spriteTopLeft = this.game.add.sprite(0, 0, 'tetris3');

		this.player1 = Player(this);
		this.player2 = Player(this);

		this.roundRenderer = RoundRenderer(this, 300, 0)
	},

	update: function () {

		this.roundTimer -= this.time.elapsed;
		if ( this.roundTimer <= 0 ) {
			this.roundTimer += this.roundTime;
			this.roundUpdate();
		}
		//
		var displayTime = parseInt(this.roundTimer / 100) / 10;
		this.gameObj.screenText.text = "Time: " + displayTime;

		this.gameObj.player1Stats.text = this.player1.getStats();
		this.gameObj.player2Stats.text = this.player2.getStats();

		this.player1.buttonHandler(this.cursors.left.isDown, this.cursors.up.isDown, this.roundTimer);
		//	Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!
		// if ( this.cursors.left.isDown ) {
		// 	this.gameObj.screenText.text = "Pressed " + this.time.elapsed;
		//
		this.roundRenderer.render();
	},

	roundUpdate: function() {
		this.player1.roundUpdate(this.player2);
		this.player2.roundUpdate(this.player1);
	},

	quitGame: function (pointer) {

		//	Here you should destroy anything you no longer need.
		//	Stop music, delete sprites, purge caches, free resources, all that good stuff.

		//	Then let's go back to the main menu.
		this.state.start('MainMenu');

	}

};
