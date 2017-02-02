

var Player = function(game, flip) {
  if (flip == undefined) {
    flip = false;
  }

  var spriteHandler = PlayerSprites(game.game, flip);

  var style = { font: "5px Arial", fill: "#bbb" };
  var winsText = game.game.add.text(2, 2, "Text", style);

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
    combo: 0,
    noPress: 0,
    defendFailed: false,
    fizzled: false,
    _attackDown: false,
    _defendDown: false,
    spriteHandler: spriteHandler,
    initBaseSprites: function() {
      spriteHandler.initBaseSprites();
    },
    initEffectSprites: function() {
      spriteHandler.initEffectSprites();
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
      if ( this.charge == 0 ) {
        this.mode = MODE.CHARGE;
      }
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
              this.spriteHandler.playWasteEffect();
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
      if ( this.mode == MODE.CHARGE && !this.fizzled ) {
        this.noPress += 1;
        if ( this.noPress >= 6 ) {
          this.combo = 0;
        }
      } else {
        this.noPress = 0;
      }
      if ( this.fizzled ) {
        if ( this.combo > 0 ) {
          this.combo = 0;
        }
        this.combo -= 1;
        this.fizzled = false;
      } else {
        if ( this.combo < 0 ) {
          this.combo = 0;
        }
        this.combo += 1;
      }

      if ( this.charge < 0 ) {
        this.charge = 0;
      }
      this.lastMode = this.mode;
      this.mode = MODE.CHARGE;
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
      this.combo = 0;
    },
    render: function(x, y) {
      winsText.x = x;
      winsText.y = y + 30;

      this.spriteHandler.setPos(x,y)
      this.spriteHandler.hideSprites(this);
      this.spriteHandler.updateHealthSprites(this);
      this.spriteHandler.updateStateSprites(this);
      this.spriteHandler.updateChargeSprites(this);
      winsText.text = "Wins: " + this.winCount;
    }
  }
}
