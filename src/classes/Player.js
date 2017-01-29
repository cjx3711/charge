var MODE = {
  FIZZ: -1,
  CHARGE: 0,
  ATTACK: 1,
  DEFEND: 2
}
var Player = function(game) {
  var canvas = game.game.add.graphics(0, 0);
  var style = { font: "5px Arial", fill: "#fff" };
  var modeText = game.game.add.text(2, 2, "Text", style);
  var charge_tower = game.game.add.sprite(0, 0, 'charge_tower');
  var sprites = {
    charge_tower: charge_tower,
    charge_0: [
      charge_tower.addChild(game.game.make.sprite(9, 17, 'charge')),
      charge_tower.addChild(game.game.make.sprite(9, 17-6, 'charge')),
      charge_tower.addChild(game.game.make.sprite(9, 17-12, 'charge'))
    ]
  }
  return {
    overcharge: 0,
    charge: 0,
    health: 6,
    mode: 0,
    lastMode: 0,
    winCount: 0,
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
          switch (enemy.mode) {
            case MODE.FIZZ:
            case MODE.CHARGE:
              enemy.health -= this.charge;
            break;
            case MODE.ATTACK:
              var chargeDiff = this.charge - enemy.charge;
              if ( chargeDiff > 0 ) {
                enemy.health -= chargeDiff;
              }
            break;
            case MODE.DEFEND:
              if ( enemy.charge <= 0 ) {
                enemy.health -= this.charge;
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
          this.charge -= 1;
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
    },
    render: function(x, y) {
      canvas.clear();
      // Old stuff
      var chargeColour = 0xFFFF00;
      var overchargeColour = 0xFF0000;
      var overchargePerc = this.overcharge / 3;
      var chargeColour = chargeColour * (1-overchargePerc) + overchargeColour * overchargePerc;
      for ( var i = 0 ; i < this.charge; i++ ) {
        canvas.beginFill(chargeColour, 1);
        canvas.drawCircle(x + 4 + i * 10, y , 8);
      }

      var i = 0;
      var healthCountdown = this.health;
      while ( this.health > 0 ) {
        canvas.beginFill(0x22FF44, 0.4);
        canvas.lineStyle(1, 0x22FF44, 1);

        if ( healthCountdown == 1 ) {
          canvas.beginFill(0x000000, 0);
        }
        canvas.drawCircle(x + 4 + i * 10, y + 10, 8);
        healthCountdown -= 2;

        if ( healthCountdown <= 0 ) {
          break;
        }
        i++;
      }

      modeText.x = x;
      modeText.y = y + 20;

      switch ( this.lastMode ) {
        case -1:
          modeText.text = "Miss";
          break;
        case 0:
          modeText.text = "Charge";
          break;
        case 1:
          modeText.text = "Attack";
          break;
        case 2:
          modeText.text = "Defend";
          break;
      }
      modeText.text += "\nWins: " + this.winCount;

      sprites.charge_tower.x = x + 15;
      sprites.charge_tower.y = y + 20;


      for ( var i = 0 ; i < 3; i++ ) {
        sprites.charge_0[i].visible = this.charge > i;
        sprites.charge_0[i].frame = this.overcharge;
      }


    }
  }
}
