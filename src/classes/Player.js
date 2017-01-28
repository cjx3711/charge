var Player = function(game) {
  var canvas = game.game.add.graphics(0, 0);
  var style = { font: "18px Arial", fill: "#fff" };
  var modeText = game.game.add.text(10, 10, "Text", style);
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
        console.log("Pressed attack", roundTimer, game.roundTime * game.timeThreshold );
        if ( roundTimer < game.roundTime * game.timeThreshold ) {
          this.attackCallback();
        } else {
          this.fizzle();
        }
      }
      this._attackDown = attack;
      if ( !this._defendDown && defend) {
        console.log("Pressed defend");
        if ( roundTimer < game.roundTime * game.timeThreshold ) {
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
      this.mode = -1;
      this.lastMode = -1;
    },
    /**
     * Updates the player each round.
     * @method roundUpdate
     * @param  Player    enemy Enemy player object
     */
    roundUpdate: function(enemy) {
      switch(this.mode) {
        case 1: // Attack
          if ( enemy.mode == 0 ) {
            enemy.health -= this.charge;
          } else if ( enemy.mode == 1 ) {
            var chargeDiff = this.charge - enemy.charge;
            if ( chargeDiff > 0 ) {
              enemy.health -= chargeDiff;
            }
          }
        break;
      }


    },
    roundPostUpdate: function() {
      switch(this.mode) {
        case 0: // Charge
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
        case 1: // Attack
          this.charge = 0;
        break;
        case 2: // Defend
          this.charge -= 1;
        break;
      }

      this.lastMode = this.mode;
      this.mode = 0;
      this.fizzled = false;
    },
    reset: function() {
      this.overcharge = 0;
      this.charge = 0;
      this.health = 6;
      this.mode = 0;
      this.lastMode = 0;
    },
    render: function(x, y) {
      canvas.clear();

      var chargeColour = 0xFFFF00;
      var overchargeColour = 0xFF0000;
      var overchargePerc = this.overcharge / 3;
      var chargeColour = chargeColour * (1-overchargePerc) + overchargeColour * overchargePerc;
      for ( var i = 0 ; i < this.charge; i++ ) {
        canvas.beginFill(chargeColour, 1);
        canvas.drawCircle(x + 15 + i * 40, y , 30);
      }

      var i = 0;
      var healthCountdown = this.health;
      while ( this.health > 0 ) {
        canvas.beginFill(0x22FF44, 0.4);
        canvas.lineStyle(4, 0x22FF44, 1);

        if ( healthCountdown == 1 ) {
          canvas.beginFill(0x000000, 0);
        }
        canvas.drawCircle(x + 15 + i * 40, y + 40, 30);
        healthCountdown -= 2;

        if ( healthCountdown <= 0 ) {
          break;
        }
        i++;
      }

      modeText.x = x;
      modeText.y = y + 60;
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
    }
  }
}
