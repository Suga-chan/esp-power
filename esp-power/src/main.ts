import Phaser from "phaser";
import { BootScene } from "./scenes/BootScene";
import { TitleScene } from "./scenes/TitleScene";
import { MenuScene } from "./scenes/MenuScene";
import { TelekinesisScene } from "./scenes/TelekinesisScene";
import { ClairvoyanceScene } from "./scenes/ClairvoyanceScene";
import { PrecognitionScene } from "./scenes/PrecognitionScene";
import { ResultScene } from "./scenes/ResultScene";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: "app", // index.html側のdiv id="app" に描画
  backgroundColor: "#000000",
  physics: {
    default: "arcade",
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

new Phaser.Game(config);
