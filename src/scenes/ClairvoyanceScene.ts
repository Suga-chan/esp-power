import Phaser from 'phaser';

export class ClairvoyanceScene extends Phaser.Scene {
  private cards: Phaser.GameObjects.Rectangle[] = [];
  private cardSymbols: Phaser.GameObjects.Text[] = [];
  private feedbackText!: Phaser.GameObjects.Text;
  private statusText!: Phaser.GameObjects.Text;
  private resultText!: Phaser.GameObjects.Text;
  private targetSymbolText!: Phaser.GameObjects.Text;
  
  private readonly TOTAL_ROUNDS = 5;
  private readonly SYMBOLS = ['☆', '◇', '△', '○'];
  private currentRound: number = 0;
  private correctCount: number = 0;
  private correctCardIndex: number = -1;
  private targetSymbol: string = '';
  private cardSymbolValues: string[] = [];
  private isWaitingForInput: boolean = false;
  private isGameFinished: boolean = false;

  constructor() {
    super('ClairvoyanceScene');
  }

  create() {
    const { width, height } = this.scale;

    // タイトル
    this.add.text(width / 2, 60, '透視テスト', {
      fontSize: '32px',
      color: '#ffffff',
    }).setOrigin(0.5);

    // ステータス表示
    this.statusText = this.add.text(width / 2, 80, '', {
      fontSize: '20px',
      color: '#ffff00',
    }).setOrigin(0.5);

    // ターゲットシンボル表示エリア
    this.add.text(width / 2, 140, 'この模様はどれですか？', {
      fontSize: '22px',
      color: '#aaaaaa',
    }).setOrigin(0.5);

    this.targetSymbolText = this.add.text(width / 2, 190, '', {
      fontSize: '64px',
      color: '#00ffff',
    }).setOrigin(0.5);

    // カードを3枚作成
    const cardWidth = 120;
    const cardHeight = 160;
    const cardSpacing = 160;
    const startX = width / 2 - cardSpacing;
    const cardY = height / 2 + 50;

    for (let i = 0; i < 3; i++) {
      const cardX = startX + i * cardSpacing;
      const card = this.add.rectangle(
        cardX,
        cardY,
        cardWidth,
        cardHeight,
        0x4444ff
      );
      card.setStrokeStyle(3, 0xffffff);
      card.setInteractive({ useHandCursor: true });
      
      // カード内のシンボル（初期は非表示）
      const symbol = this.add.text(cardX, cardY, '?', {
        fontSize: '48px',
        color: '#ffffff',
      }).setOrigin(0.5);
      this.cardSymbols.push(symbol);
      
      // カード番号を表示
      this.add.text(cardX, cardY + cardHeight / 2 + 30, `カード ${i + 1}`, {
        fontSize: '18px',
        color: '#ffffff',
      }).setOrigin(0.5);

      // クリックイベント
      card.on('pointerdown', () => this.onCardClick(i));
      
      // ホバー効果
      card.on('pointerover', () => {
        if (this.isWaitingForInput) {
          card.setFillStyle(0x6666ff);
        }
      });
      card.on('pointerout', () => {
        card.setFillStyle(0x4444ff);
      });

      this.cards.push(card);
    }

    // フィードバックテキスト
    this.feedbackText = this.add.text(width / 2, height / 2 - 100, '', {
      fontSize: '28px',
      color: '#00ff00',
    }).setOrigin(0.5);

    // 結果テキスト（初期は非表示）
    this.resultText = this.add.text(width / 2, height / 2, '', {
      fontSize: '24px',
      color: '#ffffff',
      align: 'center',
    }).setOrigin(0.5).setVisible(false);

    // 説明テキスト
    const instructionText = this.add.text(
      width / 2,
      height - 80,
      '透視してカードを選んでください',
      {
        fontSize: '18px',
        color: '#aaaaaa',
      }
    ).setOrigin(0.5);

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
      `ラウンド ${this.currentRound} / ${this.TOTAL_ROUNDS}　　正解数: ${this.correctCount}`
    );

    // カードをリセット
    this.cards.forEach(card => {
      card.setFillStyle(0x4444ff);
      card.setAlpha(1);
    });

    // カードのシンボルを「?」に戻す
    this.cardSymbols.forEach(symbol => {
      symbol.setText('?').setColor('#ffffff');
    });

    // ターゲットシンボルをランダムに選択
    this.targetSymbol = Phaser.Utils.Array.GetRandom(this.SYMBOLS);
    this.targetSymbolText.setText(this.targetSymbol);

    // 3枚のカードのシンボルを決定（1枚は必ずターゲットと同じ）
    this.correctCardIndex = Phaser.Math.Between(0, 2);
    this.cardSymbolValues = [];
    
    for (let i = 0; i < 3; i++) {
      if (i === this.correctCardIndex) {
        this.cardSymbolValues[i] = this.targetSymbol;
      } else {
        // ターゲット以外のシンボルをランダムに選択
        const otherSymbols = this.SYMBOLS.filter(s => s !== this.targetSymbol);
        this.cardSymbolValues[i] = Phaser.Utils.Array.GetRandom(otherSymbols);
      }
    }
    
    // フィードバックテキストをクリア
    this.feedbackText.setText('');
    
    // 入力待機状態にする
    this.isWaitingForInput = true;
  }

  private onCardClick(cardIndex: number) {
    if (!this.isWaitingForInput || this.isGameFinished) {
      return;
    }

    // 入力を無効化
    this.isWaitingForInput = false;

    // すべてのカードのシンボルを表示
    this.cardSymbols.forEach((symbol, index) => {
      symbol.setText(this.cardSymbolValues[index]);
    });

    // 正解判定
    const isCorrect = cardIndex === this.correctCardIndex;
    
    if (isCorrect) {
      this.correctCount++;
      this.feedbackText.setText('正解！').setColor('#00ff00');
      this.cardSymbols[cardIndex].setColor('#00ff00');
    } else {
      this.feedbackText.setText('はずれ').setColor('#ff0000');
      this.cardSymbols[cardIndex].setColor('#ff0000');
    }

    // 正解カードを明るく表示
    this.cards[this.correctCardIndex].setFillStyle(0x00ff00);
    this.cardSymbols[this.correctCardIndex].setColor('#00ff00');
    
    // 外れたカードを暗く
    this.cards.forEach((card, index) => {
      if (index !== this.correctCardIndex) {
        card.setAlpha(0.5);
      }
    });

    // 2秒後に次のラウンドへ
    this.time.delayedCall(2000, () => {
      this.startNextRound();
    });
  }

  private showFinalResult() {
    this.isGameFinished = true;
    
    // カードを非表示
    this.cards.forEach(card => card.setVisible(false));
    
    // カードのシンボルを非表示
    this.cardSymbols.forEach(symbol => symbol.setVisible(false));
    
    // ターゲットシンボルを非表示
    this.targetSymbolText.setVisible(false);
    
    // ステータステキストを非表示
    this.statusText.setVisible(false);
    this.feedbackText.setVisible(false);

    // 正解率を計算
    const accuracy = Math.round((this.correctCount / this.TOTAL_ROUNDS) * 100);

    // スコアを保存
    this.registry.set('clairvoyanceCorrect', this.correctCount);
    this.registry.set('clairvoyanceTrials', this.TOTAL_ROUNDS);

    const { width, height } = this.scale;

    // 結果を表示（間隔をあけて見やすく）
    this.resultText.setText(
      `透視テスト完了！\n\n\n` +
      `正解数: ${this.correctCount} / ${this.TOTAL_ROUNDS}\n\n` +
      `正解率: ${accuracy}%\n\n\n\n` +
      `クリックでメニューに戻る`
    ).setPosition(width / 2, height / 2 - 20).setVisible(true);

    // クリックでメニューに戻る
    this.input.once('pointerdown', () => {
      this.scene.start('MenuScene');
    });
  }
}
