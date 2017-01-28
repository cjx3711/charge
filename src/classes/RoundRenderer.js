var RoundRenderer = function(game, x, y) {
  var graphics = game.game.add.graphics(x, y);

  return {
    _game: game,
    _g: graphics,
    render: function() {
      this._g.clear();
      this._g.lineStyle(2, 0xFF0000, 1);

      this._g.beginFill(0xFF0000, 0.3);
      this._g.drawCircle(0, 50, 80 * game.roundTimer / game.roundTime + 20);

      this._g.lineStyle(0, 0xFF0000, 1);
      this._g.beginFill(0x00FF00, 0.4);

      this._g.drawCircle(0, 50, 80 * (game.roundTime * game.timeThreshold / 2) / game.roundTime + 20);

    }
  }
}
