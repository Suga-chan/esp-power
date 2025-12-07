import Phaser from "phaser";

export class MenuScene extends Phaser.Scene {
  constructor() {
    super("MenuScene");
  }

  create() {
    const { width, height } = this.scale;

    // タイトル
    this.add.text(width / 2, 40, 'メニュー', {
      fontSize: '32px',
      color: '#ffffff',
    }).setOrigin(0.5);

    const menuItems = [
      { label: "念力テスト", scene: "TelekinesisScene" },
      { label: "透視テスト", scene: "ClairvoyanceScene" },
      { label: "予知テスト", scene: "PrecognitionScene" },
      { label: "エスパー診断", scene: "ResultScene" },
    ];

    menuItems.forEach((item, index) => {
      const text = this.add
        .text(width / 2, 110 + index * 70, item.label, {
          fontSize: "24px",
          color: "#ffffff",
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true });

      text.on("pointerdown", () => {
        this.scene.start(item.scene);
      });

      text.on("pointerover", () => (text.style.setColor("#ffff00")));
      text.on("pointerout", () => (text.style.setColor("#ffffff")));
    });

    // リロード案内
    this.add.text(
      width / 2,
      height - 80,
      "もう一度診断したいときはリロードしてね",
      {
        fontSize: "16px",
        color: "#888888",
        align: "center",
      }
    ).setOrigin(0.5);
  }
}
