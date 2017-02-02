var RoundRenderer = function(game) {
  //Zone colour = 04abe5;
  //Opacity = 0.32
  var size = 65;
  var minSize = 15;
  var spriteContainer = game.game.add.sprite(0,0,'');
  var power_pipe_1 = spriteContainer.addChild(game.game.make.sprite(8 - 7, 1, 'power_pipe'));
  var power_pipe_2 = spriteContainer.addChild(game.game.make.sprite(10 - 7, 1, 'power_pipe'));
  power_pipe_1.scale.x=-1;
  var generator = spriteContainer.addChild(game.game.make.sprite(-17, 0, 'generator'));
  var generator_energy = spriteContainer.addChild(game.game.make.sprite(-2, 6, 'generator_energy'));
  var generator_glow = spriteContainer.addChild(game.game.make.sprite(-8, 2, 'generator_glow'));

  var canvas = game.game.add.graphics(0, 0);
  var underground_crystals = spriteContainer.addChild(game.game.make.sprite(-85, 41, 'underground_crystals'));
  var underground_crystals_glow = spriteContainer.addChild(game.game.make.sprite(-98, 24, 'underground_crystals_glow'));

  var power_1 = power_pipe_1.addChild(game.game.make.sprite(0,1, 'power'));
  var power_2 = power_pipe_2.addChild(game.game.make.sprite(-1,1, 'power'));

  return {
    render: function(x, y) {
      var invRoundPerc = game.roundTimer / game.roundTime;
      var roundPerc = 1 - invRoundPerc;
      spriteContainer.x = x;
      spriteContainer.y = y;

      var rand = Math.random() * 0.1;
      generator_glow.alpha = 0.9 + rand;
      generator_energy.alpha = 0.9 + rand;
      underground_crystals_glow.alpha = Math.min(1, 0.89 + Math.random() * 0.5 );

      var left_length
      var size = 100 * game.timeThreshold - 4;

      canvas.clear();
      canvas.beginFill(0x04abe5, 0.32);
      canvas.drawRect(x + 100 - size, y + 3, size, 3);
      canvas.drawRect(x - 100, y + 3, size, 3);

      power_1.x = roundPerc * 100;
      power_2.x = roundPerc * 100;


      // var rectWidth = 20;
      // var rectHeight = 7;
      // canvas.clear();
      // canvas.beginFill(0x56ddff, 0.47);
      //
      // canvas.drawRect(- parseInt(rectWidth / 2) + x, - parseInt(rectHeight / 2) + y, rectWidth, rectHeight);
      //
      // canvas.beginFill(0x56ddff, 0.9);
      //
      // var positionOnBar = 77 * 2 * (game.roundTimer / game.roundTime);
      // canvas.drawRect(-77 + positionOnBar + x, -6 + y, 2, 13);
      // canvas.drawRect(-77 + 154-positionOnBar + x, -6 + y, 2, 13);
      //
      // // canvas.clear();
      // // Small circle
      // canvas.lineStyle(2, 0x033bbb, 1);
      // canvas.beginFill(0x00ffb1, 0);
      // canvas.drawCircle(0 + x, size/2 + y, (size-minSize) * (game.roundTime * game.timeThreshold / 2) / game.roundTime + minSize);
      //
      // //Big circle
      // canvas.lineStyle(1, 0x4adeb6, 1);
      // canvas.beginFill(0x4adeb6, 0.1 + 0.6 *  (1 - (game.roundTimer / game.roundTime)));
      // canvas.drawCircle(0 + x, size/2 + y, (size-minSize) * game.roundTimer / game.roundTime + minSize);
    }
  }
}
