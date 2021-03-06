
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
		this.roundTime = 850;
		this.timeThreshold = 0.35;
		this.roundTimer = this.roundTime;
		this.win = 0;
		this.gameObj = {
			screenText: null,
			player1Stats: null,
			player2Stats: null,
		}



};

BasicGame.Game.prototype = {

	create: function () {
		console.log("Game create function");
		this.bg = this.add.sprite(0, -40,'background');

		this.tempbeep = this.add.audio('temp_beep');
		this.tempbeep.volume = 0.2;

		this.game.stage.backgroundColor = '#000000';
		this.player1 = Player(this, true);
		this.player2 = Player(this);
    this.player1.initBaseSprites();
    this.player2.initBaseSprites();
		this.player1.initEffectSprites();
		this.player2.initEffectSprites();
		this.roundRenderer = RoundRenderer(this);

		var style = { font: "6px Arial", fill: "#fff" };
		this.gameObj.player1Stats = this.game.add.sprite(6, 4, 'player1controls');
		this.gameObj.player2Stats = this.game.add.sprite(156, 4, 'player2controls');
		this.gameObj.player1Stats.lineSpacing = -5;
		this.gameObj.player2Stats.lineSpacing = -5;
		this.gameObj.winText = this.game.add.sprite(60, 22, 'win_text');

		this.gameObj.winText.visible = false;


		// var style = { font: "5px Arial", fill: "#fff" };

		// this.gameObj.screenText = this.game.add.text(2, 85, "", style);
		// this.gameObj.screenText.lineSpacing = -5;
		//
		// this.gameObj.screenText.text += "Charge v a0.2\n";
		// this.gameObj.screenText.text += "Instructions:\n";
		// this.gameObj.screenText.text += "Attack or Defend when the red circle touches the green one.\n";
		// this.gameObj.screenText.text += "   - If you miss, nothing happens for the round\n";
		// this.gameObj.screenText.text += "   - If you leave it, it will charge\n";
		// this.gameObj.screenText.text += "Attacking will deal damage based on the charge\n";
		// this.gameObj.screenText.text += "Defending requires 1 charge and will block all attacks\n";
		// this.gameObj.screenText.text += "If you overcharge, you will lose all the charges\n";

		this.gameObj.dissipate = [
			this.game.add.sprite(90, 10 + 43 + 4, 'dissipate'),
			this.game.add.sprite(90, 10 + 43 + 2, 'dissipate'),
			this.game.add.sprite(90, 10 + 43 , 'dissipate')
		]
		// sprite.scale.setTo(4,4);
	},

	update: function () {

		this.roundTimer -= this.time.elapsed;
		if ( this.roundTimer < this.roundTime * this.timeThreshold * 0.5 ) {
			if ( !this.audioPlayed ) {
				this.tempbeep.play();
				this.audioPlayed = true;
			}
		}
		if ( this.roundTimer <= 0 ) {
			if ( this.roundTimer <= - this.roundTime ) {
				this.roundTimer = 0;
			}
			this.roundTimer += this.roundTime;
			this.roundUpdate();
		}

		this.player2.buttonHandler(
			this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT),
			this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT),
			this.roundTimer);
		this.player1.buttonHandler(
			this.game.input.keyboard.isDown(Phaser.Keyboard.A),
			this.game.input.keyboard.isDown(Phaser.Keyboard.D),
			this.roundTimer);

		this.roundRenderer.render(100, 40 + 30);
		this.player1.render(30, 37 + 10);
		this.player2.render(170, 37 + 10);

		var dissipate = Math.min(this.player1.attackDissipate, this.player2.attackDissipate);
		this.gameObj.dissipate[0].visible = dissipate > 0;
		this.gameObj.dissipate[1].visible = dissipate > 1;
		this.gameObj.dissipate[2].visible = dissipate > 2;
	},

	roundUpdate: function() {
		this.player1.roundUpdate(this.player2);
		this.player2.roundUpdate(this.player1);

		this.player1.roundPostUpdate();
		this.player2.roundPostUpdate();

		this.audioPlayed = false;


		if ( this.win > 0 ) {
			this.win = 0;
			this.player1.reset();
			this.player2.reset();
			this.gameObj.winText.text = "";
			this.gameObj.winText.visible = false;
			this.roundTimer = this.roundTime;
		}

		if ( this.player1.health <= 0 ) {
			this.player2.winCount += 1;
			this.win = 2;
			this.gameObj.winText.visible = true;
			this.gameObj.winText.frame = 1;
		} else if ( this.player2.health <= 0 ) {
			this.player1.winCount += 1;
			this.win = 1;
			this.gameObj.winText.visible = true;
			this.gameObj.winText.frame = 0;
		}
	},

	quitGame: function (pointer) {

		//	Here you should destroy anything you no longer need.
		//	Stop music, delete sprites, purge caches, free resources, all that good stuff.

		//	Then let's go back to the main menu.
		this.state.start('MainMenu');

	}

};
