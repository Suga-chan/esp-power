import Phaser from 'phaser';

export class PrecognitionScene extends Phaser.Scene {
  private numberButtons: Phaser.GameObjects.Text[] = [];
  private feedbackText!: Phaser.GameObjects.Text;
  private statusText!: Phaser.GameObjects.Text;
  private instructionText!: Phaser.GameObjects.Text;
  private resultText!: Phaser.GameObjects.Text;
  private actualNumberText!: Phaser.GameObjects.Text;
  
  private readonly TOTAL_ROUNDS = 5;
  private currentRound: number = 0;
  private correctCount: number = 0;
  private isWaitingForInput: boolean = false;
  private isGameFinished: boolean = false;
  private thinkingPhase: boolean = false;

  constructor() {
    super('PrecognitionScene');
  }

  create() {
    const { width, height } = this.scale;

    // タイトル
    this.add.text(width / 2, 60, '予知テスト', {
      fontSize: '32px',
      color: '#ffffff',
    }).setOrigin(0.5);

    // ステータス表示
    this.statusText = this.add.text(width / 2, 100, '', {
      fontSize: '20px',
      color: '#ffff00',
    }).setOrigin(0.5);

    // 説明テキスト
    this.instructionText = this.add.text(
      width / 2,
      150,
      '',
      {
        fontSize: '20px',
        color: '#ffff00',
        align: 'center',
      }
    ).setOrigin(0.5);

    // 数字ボタン（0〜5）を1行に配置
    const buttonWidth = 60;
    const buttonHeight = 60;
    const buttonSpacing = 80;
    const startY = 280;

    for (let i = 0; i <= 5; i++) {
      const x = width / 2 - (buttonSpacing * 2.5) + i * buttonSpacing;
      const y = startY;

      const button = this.add.text(x, y, String(i), {
        fontSize: '32px',
        color: '#ffffff',
        backgroundColor: '#333333',
        padding: { x: 20, y: 10 },
      }).setOrigin(0.5);

      button.setInteractive({ useHandCursor: true });
      
      // クリックイベント
      button.on('pointerdown', () => this.onNumberSelect(i));
      
      // ホバー効果
      button.on('pointerover', () => {
        if (this.isWaitingForInput && !this.thinkingPhase) {
          button.setBackgroundColor('#555555');
        }
      });
      button.on('pointerout', () => {
        button.setBackgroundColor('#333333');
      });

      this.numberButtons.push(button);
    }

    // 実際の数字表示エリア
    this.actualNumberText = this.add.text(width / 2, 400, '', {
      fontSize: '48px',
      color: '#00ffff',
    }).setOrigin(0.5);

    // フィードバックテキスト
    this.feedbackText = this.add.text(width / 2, 460, '', {
      fontSize: '28px',
      color: '#00ff00',
    }).setOrigin(0.5);

    // 結果テキスト（初期は非表示）
    this.resultText = this.add.text(width / 2, height / 2, '', {
      fontSize: '24px',
      color: '#ffffff',
      align: 'center',
    }).setOrigin(0.5).setVisible(false);

    // 最初のラウンド開始
    this.startNextRound();
  }

  private startNextRound() {
    this.currentRound++;
    
    if (this.currentRound > this.TOTAL_ROUNDS) {
      this.showFinalResult();
      return;
    }

    // ステータス更新
    this.statusText.setText(
      `ラウンド ${this.currentRound} / ${this.TOTAL_ROUNDS}　　的中数: ${this.correctCount}`
    );

    // UIをリセット
    this.numberButtons.forEach(button => {
      button.setBackgroundColor('#333333');
      button.setAlpha(1);
    });

    this.actualNumberText.setText('');
    this.feedbackText.setText('');
    this.instructionText.setVisible(true).setText('これから出る数字を予知してください...\n\n集中してください');
    
    // 予知フェーズ（5秒間）
    this.thinkingPhase = true;
    this.isWaitingForInput = false;

    // ボタンを一時的に無効化（視覚的に暗くする）
    this.numberButtons.forEach(button => {
      button.setAlpha(0.3);
    });

    // 5秒後に入力フェーズへ
    this.time.delayedCall(5000, () => {
      this.thinkingPhase = false;
      this.isWaitingForInput = true;
      
      // ボタンを有効化
      this.numberButtons.forEach(button => {
        button.setAlpha(1);
      });
      
      this.instructionText.setText('予知した数字を選んでください');
    });
  }

  private onNumberSelect(selectedNumber: number) {
    if (!this.isWaitingForInput || this.isGameFinished || this.thinkingPhase) {
      return;
    }

    // 入力を無効化
    this.isWaitingForInput = false;

    // 説明テキストを非表示
    this.instructionText.setVisible(false);

    // 選択した数字をハイライト
    this.numberButtons[selectedNumber].setBackgroundColor('#0066ff');

    // 実際の数字をランダムに決定（0〜5）
    const actualNumber = Phaser.Math.Between(0, 5);

    // 少し待ってから実際の数字を表示
    this.time.delayedCall(500, () => {
      this.actualNumberText.setText(`出た数字: ${actualNumber}`);

      // 正解判定
      const isCorrect = selectedNumber === actualNumber;
      
      if (isCorrect) {
        this.correctCount++;
        this.feedbackText.setText('的中！').setColor('#00ff00');
        
        // 的中した数字を光らせる
        this.tweens.add({
          targets: this.numberButtons[actualNumber],
          alpha: 0.3,
          duration: 200,
          yoyo: true,
          repeat: 2,
        });
      } else {
        this.feedbackText.setText('はずれ').setColor('#ff0000');
        
        // 実際の数字を緑でハイライト
        this.numberButtons[actualNumber].setBackgroundColor('#00aa00');
      }

      // 2.5秒後に次のラウンドへ
      this.time.delayedCall(2500, () => {
        this.startNextRound();
      });
    });
  }

  private showFinalResult() {
    this.isGameFinished = true;
    
    // ボタンを非表示
    this.numberButtons.forEach(button => button.setVisible(false));
    
    // その他のテキストを非表示
    this.statusText.setVisible(false);
    this.feedbackText.setVisible(false);
    this.instructionText.setVisible(false);
    this.actualNumberText.setVisible(false);

    // 的中率を計算
    const accuracy = Math.round((this.correctCount / this.TOTAL_ROUNDS) * 100);

    // スコアを保存
    this.registry.set('precognitionCorrect', this.correctCount);
    this.registry.set('precognitionTrials', this.TOTAL_ROUNDS);

    // 結果を表示
    this.resultText.setText(
      `予知テスト完了！\n\n` +
      `的中数: ${this.correctCount} / ${this.TOTAL_ROUNDS}\n` +
      `的中率: ${accuracy}%\n\n` +
      `クリックでメニューに戻る`
    ).setVisible(true);

    // クリックでメニューに戻る
    this.input.once('pointerdown', () => {
      this.scene.start('MenuScene');
    });
  }
}
