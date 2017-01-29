var MODE = {
  FIZZ: -1,
  CHARGE: 0,
  ATTACK: 1,
  DEFEND: 2
}
var Player = function(game) {
  var style = { font: "5px Arial", fill: "#bbb" };
  var modeText = game.game.add.text(2, 2, "Text", style);
  modeText.lineSpacing = -5;

  var charge_tower = game.game.add.sprite(0, 0, 'charge_tower');
  var sprites = {
    charge_tower: charge_tower,
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
      charge_tower.addChild(game.game.make.sprite(-103 - 16, 8 - 2, 'shot')),
      charge_tower.addChild(game.game.make.sprite(-103 - 17, 8, 'shot')),
      charge_tower.addChild(game.game.make.sprite(-103 - 16, 8 + 2, 'shot')),
    ],
    shield: charge_tower.addChild(game.game.make.sprite(-37, -12, 'shield')),
    shield_base: charge_tower.addChild(game.game.make.sprite(-37, 17, 'shield_base')),
  };
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
      console.log("Fizzled");
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
      switch(this.mode) {
        case MODE.ATTACK: // Attack
          this.attackStrength = this.charge;
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
                this.attackDissipate = enemy.charge;
              }
            break;
            case MODE.DEFEND:
              if ( enemy.charge <= 0 ) {
                enemy.health -= this.charge;
              } else {
                this.attackType = 'blocked';
              }
            break;
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
        break;
        case 'dissipated':
          sprites.shot[0].frame = 2;
          sprites.shot[1].frame = 2;
          sprites.shot[2].frame = 2;
        break;
      }
      switch ( charge ) {
        case 1:
          sprites.shot[0].visible = true;
        break;
        case 2:
          sprites.shot[2].visible = true;
          sprites.shot[0].visible = true;
        break;
        case 3:
          sprites.shot[0].visible = true;
          sprites.shot[1].visible = true;
          sprites.shot[2].visible = true;
        break;
      }
    },
    render: function(x, y) {
      modeText.x = x;
      modeText.y = y + 30;

      sprites.shield.visible = false;
      sprites.shot[0].visible = false;
      sprites.shot[1].visible = false;
      sprites.shot[2].visible = false;

      for ( var i = 0; i < 3; i++ ) {
        sprites.heart[i].visible = i < Math.ceil(this.health / 2);
        sprites.heart[i].frame = i < Math.floor(this.health / 2) ? 0 : 1;
      }




      switch ( this.lastMode ) {
        case -1:
          modeText.text = "Miss";
          break;
        case 0:
          modeText.text = "Charge";
          break;
        case 1:
          modeText.text = "Attack";
          this.setShotSprites(this.attackStrength);
          break;
        case 2:
          modeText.text = "Defend";
          sprites.shield.visible = !this.defendFailed;
          break;
      }
      modeText.text += "\nWins: " + this.winCount;

      sprites.charge_tower.x = x;
      sprites.charge_tower.y = y;


      for ( var i = 0 ; i < 3; i++ ) {
        sprites.charge[i].visible = this.charge > i;
        sprites.charge[i].frame = this.overcharge;
      }


    }
  }
}
