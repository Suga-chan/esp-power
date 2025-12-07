import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    // 必要なアセットの読み込みをここで行う
    // 例: this.load.image('logo', 'assets/logo.png');
  }

  create() {
    this.scene.start('TitleScene');
  }
}
