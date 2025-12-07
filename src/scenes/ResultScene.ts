import Phaser from 'phaser';

export class ResultScene extends Phaser.Scene {
  constructor() {
    super('ResultScene');
  }

  create() {
    const { width, height } = this.scale;

    // タイトル
    this.add.text(width / 2, 60, 'エスパー診断結果', {
      fontSize: '36px',
      color: '#ffffff',
    }).setOrigin(0.5);

    // レジストリからスコアを取得
    const telekinesisScore = this.registry.get('telekinesisScore') || 0;
    const clairvoyanceCorrect = this.registry.get('clairvoyanceCorrect') || 0;
    const clairvoyanceTrials = this.registry.get('clairvoyanceTrials') || 1;
    const precognitionCorrect = this.registry.get('precognitionCorrect') || 0;
    const precognitionTrials = this.registry.get('precognitionTrials') || 1;

    // 正解率を計算
    const clairvoyanceAccuracy = Math.round((clairvoyanceCorrect / clairvoyanceTrials) * 100);
    const precognitionAccuracy = Math.round((precognitionCorrect / precognitionTrials) * 100);

    // 各テストの結果を表示
    const resultY = 120;
    const lineHeight = 40;

    this.add.text(width / 2, resultY, '【各テストの結果】', {
      fontSize: '24px',
      color: '#ffff00',
    }).setOrigin(0.5);

    this.add.text(width / 2, resultY + lineHeight * 1.5, `念力テスト: ${telekinesisScore} 点`, {
      fontSize: '20px',
      color: '#ffffff',
    }).setOrigin(0.5);

    this.add.text(
      width / 2,
      resultY + lineHeight * 2.5,
      `透視テスト: ${clairvoyanceCorrect} / ${clairvoyanceTrials} (${clairvoyanceAccuracy}%)`,
      {
        fontSize: '20px',
        color: '#ffffff',
      }
    ).setOrigin(0.5);

    this.add.text(
      width / 2,
      resultY + lineHeight * 3.5,
      `予知テスト: ${precognitionCorrect} / ${precognitionTrials} (${precognitionAccuracy}%)`,
      {
        fontSize: '20px',
        color: '#ffffff',
      }
    ).setOrigin(0.5);

    // 総合スコアを計算
    // 各テストを100点満点に正規化して平均を取る
    const telekinesisNormalized = telekinesisScore; // すでに0-100
    const clairvoyanceNormalized = clairvoyanceAccuracy; // すでに0-100
    const precognitionNormalized = precognitionAccuracy; // すでに0-100

    const totalScore = Math.round(
      (telekinesisNormalized + clairvoyanceNormalized + precognitionNormalized) / 3
    );

    // 診断文を決定
    let diagnosis = '';
    let rankColor = '#ffffff';

    if (totalScore >= 80) {
      diagnosis = '超エスパー級\n（研究所送りレベル）';
      rankColor = '#ff00ff';
    } else if (totalScore >= 60) {
      diagnosis = '上級エスパー候補\n（かなり高い能力）';
      rankColor = '#00ffff';
    } else if (totalScore >= 40) {
      diagnosis = '中級エスパー\n（一般人よりちょっと鋭い）';
      rankColor = '#00ff00';
    } else if (totalScore >= 20) {
      diagnosis = '初級エスパー\n（潜在能力あり）';
      rankColor = '#ffff00';
    } else {
      diagnosis = '一般人レベル\n（今のところ特殊能力なし）';
      rankColor = '#aaaaaa';
    }

    // 総合スコアと診断を表示
    this.add.text(width / 2, resultY + lineHeight * 5.5, '【総合評価】', {
      fontSize: '24px',
      color: '#ffff00',
    }).setOrigin(0.5);

    this.add.text(width / 2, resultY + lineHeight * 7, `総合スコア: ${totalScore} 点`, {
      fontSize: '22px',
      color: '#ffffff',
    }).setOrigin(0.5);

    this.add.text(width / 2, resultY + lineHeight * 8.5, diagnosis, {
      fontSize: '26px',
      color: rankColor,
      align: 'center',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    // リロード案内テキスト（診断文のすぐ下）
    const reloadText = this.add.text(
      width / 2,
      resultY + lineHeight * 9.5,
      'もう一度診断したいときはリロードしてね',
      {
        fontSize: '16px',
        color: '#ffff00',
      }
    ).setOrigin(0.5);

    // リロード案内テキストのほのかに光るアニメーション
    this.tweens.add({
      targets: reloadText,
      alpha: 0.6,
      duration: 1200,
      yoyo: true,
      repeat: -1,
    });

    // メニューに戻るテキスト
    const backText = this.add.text(
      width / 2,
      height - 60,
      'クリックでメニューへ戻る',
      {
        fontSize: '20px',
        color: '#888888',
      }
    ).setOrigin(0.5);

    // 点滅アニメーション
    this.tweens.add({
      targets: backText,
      alpha: 0.3,
      duration: 800,
      yoyo: true,
      repeat: -1,
    });

    // クリックでメニューに戻る
    this.input.once('pointerdown', () => {
      this.scene.start('MenuScene');
    });
  }
}
