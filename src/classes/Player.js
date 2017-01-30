var MODE = {
  FIZZ: -1,
  CHARGE: 0,
  ATTACK: 1,
  DEFEND: 2
}
var Player = function(game, flip) {
  if (flip == undefined) {
    flip = false;
  }
  var style = { font: "5px Arial", fill: "#bbb" };
  var modeText = game.game.add.text(2, 2, "Text", style);
  modeText.lineSpacing = -5;

  var charge_tower = game.game.add.sprite(0, 0, 'charge_tower');

  var sprites = {
    charge_tower: charge_tower,
    hit_sprites: null,
    charge: [
      charge_tower.addChild(game.game.make.sprite(9, 17, 'charge')),
      charge_tower.addChild(game.game.make.sprite(9, 17-6, 'charge')),
      charge_tower.addChild(game.game.make.sprite(9, 17-12, 'charge'))
    ],
    heart: [
      charge_tower.addChild(game.game.make.sprite(-20, 25, 'heart')),
      charge_tower.addChild(game.game.make.sprite(-20 + 7, 25, 'heart')),
      charge_tower.addChild(game.game.make.sprite(-20 + 7 * 2, 25, 'heart'))
    ],
    turret: charge_tower.addChild(game.game.make.sprite(-20, 5, 'turret')),
    shot: [
      charge_tower.addChild(game.game.make.sprite(-104 - 16, 8 - 2, 'shot')),
      charge_tower.addChild(game.game.make.sprite(-104 - 17, 8, 'shot')),
      charge_tower.addChild(game.game.make.sprite(-104 - 16, 8 + 2, 'shot')),
    ],
    shield: charge_tower.addChild(game.game.make.sprite(-37, -12, 'shield')),
    shield_base: charge_tower.addChild(game.game.make.sprite(-37, 17, 'shield_base')),
    shield_hit: null,
    turret_hit: null,
    fizzle: game.game.add.sprite(0, 0, 'fizzle')
  };
  if ( flip ) {
    charge_tower.scale.x = -1;
  }
  return {
    overcharge: 0,
    charge: 0,
    health: 6,
    mode: 0,
    lastMode: 0,
    winCount: 0,
    attackStrength: 0,
    attackType: '',
    attackDissipate: 0,
    defendFailed: false,
    fizzled: false,
    _attackDown: false,
    _defendDown: false,
    initHitSprites: function() {
      var hit_sprites = game.game.add.sprite(0, 0 , '');
      if ( flip ) {
        hit_sprites.scale.x = -1;
      }
      sprites.hit_sprites = hit_sprites;
      sprites.turret_hit = [
        hit_sprites.addChild(game.game.make.sprite(-133, 2 , 'turret_hit')),
        hit_sprites.addChild(game.game.make.sprite(-133, 2 + 2 , 'turret_hit')),
        hit_sprites.addChild(game.game.make.sprite(-133, 2 + 4, 'turret_hit'))
      ];
      sprites.shield_hit = hit_sprites.addChild(game.game.make.sprite(-107, 3, 'shield_hit'));
    },
    getStats: function() {
      return "Charge: " + this.charge + "\nHealth: " + this.health;
    },
    buttonHandler: function(attack, defend, roundTimer) {
      if ( this.fizzled ) {
        return;
      }
      if ( !this._attackDown && attack) {
        if ( roundTimer < game.roundTime * game.timeThreshold ) {
          this.attackCallback();
        } else {
          this.fizzle();
        }
      }
      this._attackDown = attack;
      if ( !this._defendDown && defend) {
        if ( roundTimer < game.roundTime * game.timeThreshold ) {
          this.defendCallback();
        } else {
          this.fizzle();
        }
      }
      this._defendDown = defend;
    },
    attackCallback: function() {
      if( this.mode == MODE.CHARGE ) {
        this.mode = MODE.ATTACK;
      } else {
        this.fizzle();
      }
    },
    defendCallback: function() {
      if ( this.mode == MODE.CHARGE ) {
        this.mode = MODE.DEFEND;
      } else {
        this.fizzle();
      }
    },
    fizzle: function() {
      this.fizzled = true;
      this.mode = MODE.FIZZ;
      this.lastMode = MODE.FIZZ;
    },
    /**
     * Updates the player each round.
     * @method roundUpdate
     * @param  Player    enemy Enemy player object
     */
    roundUpdate: function(enemy) {
      this.attackDissipate = 0;
      switch(this.mode) {
        case MODE.ATTACK: // Attack
          this.attackStrength = this.charge;
          if ( this.charge > 0 ) {
            switch (enemy.mode) {
              case MODE.FIZZ:
              case MODE.CHARGE:
                enemy.health -= this.charge;
                this.attackType = 'hit';
              break;
              case MODE.ATTACK:
                this.attackType = 'dissipated';
                var chargeDiff = this.charge - enemy.charge;
                if ( chargeDiff > 0 ) {
                  enemy.health -= chargeDiff;
                }
                this.attackDissipate = enemy.charge;
              break;
              case MODE.DEFEND:
                if ( enemy.charge <= 0 ) {
                  enemy.health -= this.charge;
                  this.attackType = 'hit';
                } else {
                  this.attackType = 'blocked';
                }
              break;
            }
          }
        break;
      }
    },
    roundPostUpdate: function() {
      switch(this.mode) {
        case MODE.CHARGE: // Charge
          if ( this.charge < 3 ) {
            this.charge += 1;
            this.overcharge = 0;
          } else {
            this.overcharge += 1;
            if ( this.overcharge > 3 ) {
              this.charge = 0;
              this.overcharge = 0;
            }
          }
        break;
        case MODE.ATTACK: // Attack
          this.charge = 0;
          this.overcharge = 0;
        break;
        case MODE.DEFEND: // Defend
          this.defendFailed = this.charge == 0;
          if ( this.charge > 0 ) {
            this.charge -= 1;
          }
          this.overcharge = 0;
        break;
      }

      this.lastMode = this.mode;
      this.mode = MODE.CHARGE;
      this.fizzled = false;
      if ( this.charge < 0 ) {
        this.charge = 0;
      }
    },
    reset: function() {
      this.overcharge = 0;
      this.charge = 0;
      this.health = 6;
      this.mode = MODE.CHARGE;
      this.lastMode = 0;
      this.attackStrength =  0;
      this.attackType =  '';
      this.attackDissipate =  0;
      this.defendFailed = false;
      this.fizzled = false;
    },
    setShotSprites: function( charge ) {
      switch ( this.attackType ) {
        case 'hit':
          sprites.shot[0].frame = 0;
          sprites.shot[1].frame = 0;
          sprites.shot[2].frame = 0;
        break;
        case 'blocked':
          sprites.shot[0].frame = 1;
          sprites.shot[1].frame = 1;
          sprites.shot[2].frame = 1;
          sprites.shield_hit.visible = true;
        break;
        case 'dissipated':
          sprites.shot[2].frame = this.attackDissipate > 0 ? 2 : 0;
          sprites.shot[1].frame = this.attackDissipate > 1 ? 2 : 0;
          sprites.shot[0].frame = this.attackDissipate > 2 ? 2 : 0;
        break;
      }

      switch ( charge ) {
        case 3:
          sprites.shot[0].visible = true;
        case 2:
          sprites.shot[1].visible = true;
        case 1:
          sprites.shot[2].visible = true;
        break;
      }

      sprites.turret_hit[0].visible = sprites.shot[0].visible && sprites.shot[0].frame == 0;
      sprites.turret_hit[1].visible = sprites.shot[1].visible && sprites.shot[1].frame == 0;
      sprites.turret_hit[2].visible = sprites.shot[2].visible && sprites.shot[2].frame == 0;
    },
    render: function(x, y) {
      modeText.x = x;
      modeText.y = y + 30;

      sprites.shield.visible = false;
      sprites.shot[0].visible = false;
      sprites.shot[1].visible = false;
      sprites.shot[2].visible = false;
      sprites.turret_hit[0].visible = false;
      sprites.turret_hit[1].visible = false;
      sprites.turret_hit[2].visible = false;
      sprites.fizzle.visible = false;
      sprites.shield_hit.visible = false;

      for ( var i = 0; i < 3; i++ ) {
        sprites.heart[i].visible = i < Math.ceil(this.health / 2);
        sprites.heart[i].frame = i < Math.floor(this.health / 2) ? 0 : 1;
      }




      switch ( this.lastMode ) {
        case MODE.FIZZ:
          sprites.fizzle.visible = true;
          break;
        case MODE.CHARGE:
          break;
        case MODE.ATTACK:
          this.setShotSprites(this.attackStrength);
          break;
        case MODE.DEFEND:
          sprites.shield.visible = !this.defendFailed;
          break;
      }
      modeText.text = "Wins: " + this.winCount;

      sprites.charge_tower.x = x;
      sprites.charge_tower.y = y;
      sprites.hit_sprites.x = x;
      sprites.hit_sprites.y = y;

      if ( flip ) {
        sprites.fizzle.x = x - 6;
        sprites.fizzle.y = y - 5;
      } else {
        sprites.fizzle.x = x - 6;
        sprites.fizzle.y = y - 5;
      }


      for ( var i = 0 ; i < 3; i++ ) {
        sprites.charge[i].visible = this.charge > i;
        sprites.charge[i].frame = this.overcharge;
      }


    }
  }
}
