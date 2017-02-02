var RoundRenderer = function(game) {

  var size = 65;
  var minSize = 15;
  var spriteContainer = game.game.add.sprite(0,0,'');
  var timebar = spriteContainer.addChild(game.game.make.sprite(-77, -4, 'timerbar'));
  var canvas = game.game.add.graphics(0, 0);
  return {
    render: function(x, y) {
      spriteContainer.x = x;
      spriteContainer.y = y;

      var rectWidth = 20;
      var rectHeight = 7;
      canvas.clear();
      canvas.beginFill(0x56ddff, 0.47);

      canvas.drawRect(- parseInt(rectWidth / 2) + x, - parseInt(rectHeight / 2) + y, rectWidth, rectHeight);

      canvas.beginFill(0x56ddff, 0.9);

      var positionOnBar = 77 * 2 * (game.roundTimer / game.roundTime);
      canvas.drawRect(-77 + positionOnBar + x, -6 + y, 2, 13);
      canvas.drawRect(-77 + 154-positionOnBar + x, -6 + y, 2, 13);

      // canvas.clear();
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
