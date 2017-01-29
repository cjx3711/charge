var RoundRenderer = function(game) {
  var canvas = game.game.add.graphics(0, 0);
  var size = 70;
  var minSize = 10;
  return {
    render: function(x, y) {
      canvas.clear();
      canvas.lineStyle(1, 0xFF0000, 1);

      canvas.beginFill(0xFF0000, 0.3);
      canvas.drawCircle(0 + x, size/2 + y, (size-minSize) * game.roundTimer / game.roundTime + minSize);

      canvas.lineStyle(0, 0xFF0000, 1);
      canvas.beginFill(0x00FF00, 0.4);

      canvas.drawCircle(0 + x, size/2 + y, (size-minSize) * (game.roundTime * game.timeThreshold / 2) / game.roundTime + minSize);

    }
  }
}
