
BasicGame.Preloader = function (game) {

	this.background = null;
	this.preloadBar = null;

	this.ready = false;

};

BasicGame.Preloader.prototype = {

	preload: function () {
		console.log("Preloader preload function");
		//	These are the assets we loaded in Boot.js
		//	A nice sparkly background and a loading progress bar

		// this.background = this.add.sprite(0, 0, 'preloaderBackground');
		// this.preloadBar = this.add.sprite(300, 400, 'preloaderBar');

		//	This sets the preloadBar sprite as a loader sprite.
		//	What that does is automatically crop the sprite from 0 to full-width
		//	as the files below are loaded in.

		// this.load.setPreloadSprite(this.preloadBar);

		//	Here we load the rest of the assets our game needs.
		//	You can find all of these assets in the Phaser Examples repository

		this.load.image('charge_tower', 'assets/sprites/charge_tower.png');
		this.load.image('shield_base', 'assets/sprites/shield_base.png');
		this.load.image('shield', 'assets/sprites/shield.png');
		this.load.image('turret', 'assets/sprites/turret.png');
		this.load.image('wins_text', 'assets/sprites/wins.png');
		this.load.image('fizzle', 'assets/sprites/fizzle.png');
    this.load.image('dissipate', 'assets/sprites/dissipate.png');
		this.load.spritesheet('shot', 'assets/sprites/shot_sprite.png', 104, 5, 3);
		this.load.spritesheet('charge', 'assets/sprites/charge_sprite.png', 8, 4, 4);
		this.load.spritesheet('heart', 'assets/sprites/heart_sprite.png', 5, 5, 2);
    this.load.image('background', 'assets/background.jpg');

	},

	create: function () {

		this.state.start('Game');

	}

};
