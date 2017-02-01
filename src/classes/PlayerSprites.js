/**
 * File: PlayerSprites.js
 *
 * This file handles all the rendering and states of the player object sprites
 *
 */

 var MODE = {
   FIZZ: -1,
   CHARGE: 0,
   ATTACK: 1,
   DEFEND: 2
 }

var PlayerSprites = function(game, flip) {
  if (flip == undefined) {
    flip = false;
  }

  var baseSprites = {
    container: null,
    charge_tower: null,
    charge: null,
    turret: null,
    heart: null,
    shot: null,
    shield: null,
    shield_base: null
  };

  var effectSprites = {
    container: null,
    fizzle: null,
    shield_hit: null,
    turret_hit: null,
    waste: null
  }

  return {
    base: baseSprites,
    effects: effectSprites,
    initBaseSprites: function() {
      var container = game.add.sprite(0,0,'');
      baseSprites.container = container;
      baseSprites.charge_tower = container.addChild(game.make.sprite(0, 0, 'charge_tower'));
      baseSprites.charge = [
        container.addChild(game.make.sprite(9, 17, 'charge')),
        container.addChild(game.make.sprite(9, 17-6, 'charge')),
        container.addChild(game.make.sprite(9, 17-12, 'charge'))
      ];
      baseSprites.heart = [
        container.addChild(game.make.sprite(-20, 25, 'heart')),
        container.addChild(game.make.sprite(-20 + 7, 25, 'heart')),
        container.addChild(game.make.sprite(-20 + 7 * 2, 25, 'heart'))
      ];

      baseSprites.turret = container.addChild(game.make.sprite(-20, 5, 'turret'));

      baseSprites.shot = [
        container.addChild(game.make.sprite(-104 - 16, 8 - 2, 'shot')),
        container.addChild(game.make.sprite(-104 - 17, 8, 'shot')),
        container.addChild(game.make.sprite(-104 - 16, 8 + 2, 'shot'))
      ];

      baseSprites.shield = container.addChild(game.make.sprite(-37, -12, 'shield'));
      baseSprites.shield_base = container.addChild(game.make.sprite(-37, 17, 'shield_base'));

      if ( flip ) {
        container.scale.x = -1;
      }
    },
    initEffectSprites: function() {
      var container = game.add.sprite(0, 0 , '');
      effectSprites.container = container;

      effectSprites.fizzle = container.addChild(game.make.sprite(-6, -2, 'fizzle'));
      effectSprites.turret_hit = [
        container.addChild(game.make.sprite(-133, 2 , 'turret_hit')),
        container.addChild(game.make.sprite(-133, 2 + 2 , 'turret_hit')),
        container.addChild(game.make.sprite(-133, 2 + 4, 'turret_hit'))
      ];
      effectSprites.shield_hit = container.addChild(game.make.sprite(-107, 3, 'shield_hit'));
      effectSprites.waste = container.addChild(game.make.sprite(5, -26, 'waste'));

      var explodeAnim = effectSprites.waste.animations.add('explode');
      explodeAnim.onComplete.add( function(sprite, animation) {
        sprite.frame = 0;
      });

      if ( flip ) {
        container.scale.x = -1;
      }
    },
    playWasteEffect: function() {
      effectSprites.waste.frame = 1;
      effectSprites.waste.animations.play('explode', 10);
    },
    hideSprites: function(player) {
      baseSprites.shield.visible = false;
      baseSprites.shot[0].visible = false;
      baseSprites.shot[1].visible = false;
      baseSprites.shot[2].visible = false;
      effectSprites.turret_hit[0].visible = false;
      effectSprites.turret_hit[1].visible = false;
      effectSprites.turret_hit[2].visible = false;
      effectSprites.fizzle.visible = false;
      effectSprites.shield_hit.visible = false;
    },
    updateStateSprites: function(player) {
      switch ( player.lastMode ) {
        case MODE.FIZZ:
          effectSprites.fizzle.visible = true;
          break;
        case MODE.CHARGE:
          break;
        case MODE.ATTACK:
          this.updateShotSprites(player);
          break;
        case MODE.DEFEND:
          baseSprites.shield.visible = !player.defendFailed;
          break;
      }
    },
    updateHealthSprites: function(player) {
      for ( var i = 0; i < 3; i++ ) {
        baseSprites.heart[i].visible = i < Math.ceil(player.health / 2);
        baseSprites.heart[i].frame = i < Math.floor(player.health / 2) ? 0 : 1;
      }
    },
    updateChargeSprites: function(player) {
      for ( var i = 0 ; i < 3; i++ ) {
        baseSprites.charge[i].visible = player.charge > i;
        baseSprites.charge[i].frame = player.overcharge;
      }
    },
    updateShotSprites: function(player) {
      switch ( player.attackType ) {
        case 'hit':
          baseSprites.shot[0].frame = 0;
          baseSprites.shot[1].frame = 0;
          baseSprites.shot[2].frame = 0;
        break;
        case 'blocked':
          baseSprites.shot[0].frame = 1;
          baseSprites.shot[1].frame = 1;
          baseSprites.shot[2].frame = 1;
          effectSprites.shield_hit.visible = true;
        break;
        case 'dissipated':
          baseSprites.shot[2].frame = player.attackDissipate > 0 ? 2 : 0;
          baseSprites.shot[1].frame = player.attackDissipate > 1 ? 2 : 0;
          baseSprites.shot[0].frame = player.attackDissipate > 2 ? 2 : 0;
        break;
      }

      switch ( player.attackStrength ) {
        case 3:
          baseSprites.shot[0].visible = true;
        case 2:
          baseSprites.shot[1].visible = true;
        case 1:
          baseSprites.shot[2].visible = true;
        break;
      }

      effectSprites.turret_hit[0].visible = baseSprites.shot[0].visible && baseSprites.shot[0].frame == 0;
      effectSprites.turret_hit[1].visible = baseSprites.shot[1].visible && baseSprites.shot[1].frame == 0;
      effectSprites.turret_hit[2].visible = baseSprites.shot[2].visible && baseSprites.shot[2].frame == 0;
    },
    setPos: function(x, y) {
      baseSprites.container.x = x;
      baseSprites.container.y = y;
      effectSprites.container.x = x;
      effectSprites.container.y = y;
    }
  }
}
