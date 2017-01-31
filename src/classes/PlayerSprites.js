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

var PlayerSprites = function(flip) {
  if (flip == undefined) {
    flip = false;
  }

  var baseSprites = {
    base_parent: null,
    charge_tower: null,
    charge: [

    ],
    turret: null,
    heart: [

    ],
    shot: [

    ],
    shield: null,
    shield_base: null
  };

  var effectSprites = {
    effect_base: null,
    fizzle: null,
    shield_hit: null,
    turret_hit: null
  }
  return {
    base: baseSprites,
    effects: effectSprites,
    initBaseSprites: function() {
      
    },
    initEffectSprites: function() {

    }
  }
}
