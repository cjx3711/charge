
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
		this.roundTimer = 3000;
		this.gameObj = {
			screenText: null,
			player1Stats: null,
			player2Stats: null
		}

		this.createPlayerObject = function() {
			return {
				charge : 0,
				health: 3,
				mode: 0,
				fizzled: false,
				_attackDown: false,
				_defendDown: false,
				getStats: function() {
					return "Charge: " + this.charge + "\nHealth: " + this.health;
				},
				buttonHandler: function(attack, defend, roundTimer) {
					if ( this.fizzled ) {
						return;
					}
					if ( !this._attackDown && attack) {
						console.log("Pressed attack");
						if ( roundTimer < 400 ) {
							this.attackCallback();
						} else {
							this.fizzle();
						}
					}
					this._attackDown = attack;
					if ( !this._defendDown && defend) {
						console.log("Pressed defend");
						if ( roundTimer < 400 ) {
							this.defendCallback();
						} else {
							this.fizzle();
						}
					}
					this._defendDown = defend;
				},
				attackCallback: function() {
					if( this.mode == 0 ) {
						this.mode = 1;
						console.log("Attack Fired");
					} else {
						this.fizzle();
					}
					this.mode = 1;
				},
				defendCallback: function() {
					if ( this.mode == 0 ) {
						this.mode = 2;
						console.log("Defend Fired");
					} else {
						this.fizzle();
					}
				},
				fizzle: function() {
					console.log("Fizzled");
					this.fizzled = true;
					this.mode = 0;
				},
				/**
				 * Updates the player each round.
				 * @method roundUpdate
				 * @param  Player    enemy Enemy player object
				 */
				roundUpdate: function(enemy) {
					switch(this.mode) {
						case 0: // Charge
							this.charge += 1;
							if ( this.charge > 3 ) {
								this.charge = 1;
							}
						break;
						case 1: // Attack
							enemy.health -= this.charge;
							this.charge = 0;
						break;
						case 2: // Defend

						break;
					}

					this.mode = 0;
					this.fizzled = false;
				}

			}
		}

		this.player1 = this.createPlayerObject();
		this.player2 = this.createPlayerObject();
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

	},

	update: function () {

		this.roundTimer -= this.time.elapsed;
		if ( this.roundTimer <= 0 ) {
			this.roundTimer += 3000;
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
		// }
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
