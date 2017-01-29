var RoundRenderer = function(game) {
  var canvas = game.game.add.graphics(0, 0);
  var size = 65;
  var minSize = 15;
  return {
    render: function(x, y) {
      canvas.clear();
      // Small circle
      canvas.lineStyle(2, 0x033bbb, 1);
      canvas.beginFill(0x00ffb1, 0);
      canvas.drawCircle(0 + x, size/2 + y, (size-minSize) * (game.roundTime * game.timeThreshold / 2) / game.roundTime + minSize);

      //Big circle
      canvas.lineStyle(1, 0x4adeb6, 1);
      canvas.beginFill(0x4adeb6, 0.1 + 0.6 *  (1 - (game.roundTimer / game.roundTime)));
      canvas.drawCircle(0 + x, size/2 + y, (size-minSize) * game.roundTimer / game.roundTime + minSize);


    }
  }
}
