import Phaser from 'phaser';

export class TelekinesisScene extends Phaser.Scene {
  private ball!: Phaser.GameObjects.Arc;
  private targetMarker!: Phaser.GameObjects.Arc;
  private gaugeBar!: Phaser.GameObjects.Rectangle;
  private gaugeFill!: Phaser.GameObjects.Rectangle;
  private instructionText!: Phaser.GameObjects.Text;
  private resultText!: Phaser.GameObjects.Text;
  
  private gaugeValue: number = 0;
  private maxGauge: number = 100;
  private isPlaying: boolean = false;
  private isFinished: boolean = false;
  private clickCount: number = 0;
  private readonly MAX_CLICKS = 5;

  constructor() {
    super('TelekinesisScene');
  }

  create() {
    const { width, height } = this.scale;

    // タイトル
    this.add.text(width / 2, 60, '念力テスト', {
      fontSize: '32px',
      color: '#ffffff',
    }).setOrigin(0.5);

    // スタートの玉（左側）
    this.ball = this.add.circle(150, height / 2, 20, 0xff6600);

    // ターゲット位置のマーカー（右側）
    const targetX = width - 150;
    this.targetMarker = this.add.circle(targetX, height / 2, 25, 0x00ff00, 0);
    this.targetMarker.setStrokeStyle(3, 0x00ff00);

    // ゲージの枠
    const gaugeWidth = 400;
    const gaugeHeight = 30;
    const gaugeX = width / 2 - gaugeWidth / 2;
    const gaugeY = height - 80;

    this.gaugeBar = this.add.rectangle(
      gaugeX,
      gaugeY,
      gaugeWidth,
      gaugeHeight,
      0x333333
    ).setOrigin(0);

    this.gaugeFill = this.add.rectangle(
      gaugeX,
      gaugeY,
      0,
      gaugeHeight,
      0x00ffff
    ).setOrigin(0);

    // 説明文
    this.instructionText = this.add.text(
      width / 2,
      height - 150,
      '5回クリックして玉をターゲットに移動させてください！',
      {
        fontSize: '20px',
        color: '#ffff00',
      }
    ).setOrigin(0.5);

    // 結果テキスト（初期は非表示）
    this.resultText = this.add.text(width / 2, height / 2 + 100, '', {
      fontSize: '24px',
      color: '#ffffff',
      align: 'center',
    }).setOrigin(0.5).setVisible(false);

    // スタートテキスト
    const startText = this.add.text(
      width / 2,
      height / 2 - 100,
      'クリックでスタート',
      {
        fontSize: '24px',
        color: '#ffffff',
      }
    ).setOrigin(0.5);

    // スタート待ち
    this.input.once('pointerdown', () => {
      startText.destroy();
      this.startGame();
    });
  }

  private startGame() {
    this.isPlaying = true;
    this.clickCount = 0;

    // クリックで玉を移動
    const clickHandler = () => {
      if (this.isPlaying && this.clickCount < this.MAX_CLICKS) {
        this.clickCount++;
        
        // ランダムな移動距離（画面幅の10%〜30%の範囲）
        const { width } = this.scale;
        const targetX = width - 150;
        const maxMoveDistance = (targetX - 150) / this.MAX_CLICKS;
        const randomMove = Phaser.Math.Between(
          Math.floor(maxMoveDistance * 0.3),
          Math.floor(maxMoveDistance * 1.7)
        );
        
        // 現在位置から移動
        const newX = Math.min(this.ball.x + randomMove, targetX + 100);
        
        // 玉を移動
        this.tweens.add({
          targets: this.ball,
          x: newX,
          duration: 300,
          ease: 'Cubic.easeOut',
        });
        
        // 説明文を更新
        const remainingClicks = this.MAX_CLICKS - this.clickCount;
        if (remainingClicks > 0) {
          this.instructionText.setText(`残り ${remainingClicks} 回クリック`);
        } else {
          this.instructionText.setText('念力を送っています...');
          this.isPlaying = false;
          this.input.off('pointerdown', clickHandler);
          
          // 少し待ってから結果を表示
          this.time.delayedCall(500, () => {
            this.calculateResult(this.ball.x, targetX);
          });
        }
      }
    };

    this.input.on('pointerdown', clickHandler);
  }

  private updateGauge() {
    // ゲージは使用しないため削除
  }

  private calculateResult(ballX: number, targetX: number) {
    const distance = Math.abs(ballX - targetX);
    const maxDistance = this.scale.width - 300; // 最大距離
    
    // 距離が近いほど高スコア（0-100点）
    const score = Math.max(0, Math.floor(100 - (distance / maxDistance) * 100));

    // スコアを保存
    this.registry.set('telekinesisScore', score);

    // 結果表示
    this.instructionText.setVisible(false);
    this.resultText.setText(
      `結果: ${score}点\n距離: ${Math.floor(distance)}px\n\nクリックでメニューに戻る`
    ).setVisible(true);

    this.isFinished = true;

    // クリックでメニューに戻る
    this.input.once('pointerdown', () => {
      this.scene.start('MenuScene');
    });
  }
}
