var Player = function(game) {
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
