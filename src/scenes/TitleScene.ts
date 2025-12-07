import Phaser from "phaser";

export class TitleScene extends Phaser.Scene {
  constructor() {
    super("TitleScene");
  }

  create() {
    const { width, height } = this.scale;

    this.add
      .text(width / 2, height / 3, "ESPパワー", {
        fontSize: "48px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, height / 3 + 60, "超能力開発ソフト", {
        fontSize: "24px",
        color: "#aaaaaa",
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, height / 3 + 100, "あなたの潜在能力を測ります", {
        fontSize: "20px",
        color: "#aaaaaa",
      })
      .setOrigin(0.5);

    const startText = this.add
      .text(width / 2, (height / 3) * 2, "クリックして開始", {
        fontSize: "24px",
        color: "#ffff00",
      })
      .setOrigin(0.5);

    // 点滅演出
    this.tweens.add({
      targets: startText,
      alpha: 0,
      duration: 700,
      yoyo: true,
      repeat: -1,
    });

    this.input.once("pointerdown", () => {
      this.scene.start("MenuScene");
    });
  }
}
