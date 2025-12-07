import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';
import { TitleScene } from './scenes/TitleScene';
import { MenuScene } from './scenes/MenuScene';
import { TelekinesisScene } from './scenes/TelekinesisScene';
import { ClairvoyanceScene } from './scenes/ClairvoyanceScene';
import { PrecognitionScene } from './scenes/PrecognitionScene';
import { ResultScene } from './scenes/ResultScene';

export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    parent: 'app',
    width: 800,
    height: 700,
    min: {
      width: 360,
      height: 640,
    },
    max: {
      width: 1200,
      height: 1050,
    },
  },
  backgroundColor: '#000000',
  physics: {
    default: 'arcade',
  },
  scene: [
    BootScene,
    TitleScene,
    MenuScene,
    TelekinesisScene,
    ClairvoyanceScene,
    PrecognitionScene,
    ResultScene,
  ],
};
