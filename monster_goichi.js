
// 09_Goichi_Akiba //

// TDD用 test 関数 

function test(actual, expected) {
  if (JSON.stringify(actual) === JSON.stringify(expected)) {
    console.log("OK! Test PASSED.");
  } else {
    console.error("Test FAILED. Try again!");
    console.group("Result:");
    console.log("  actual:", actual);
    console.log("expected:", expected);
    console.trace();
    console.groupEnd();
  }
}

// クロージャ部分 //

/**
 * モンスターの数と、必要な勇者の数の対比比較 (equal, high, low)
 * @param {number} userNumber
 * @param {number} requiredHeroes
 * @returns {"equal"|"high"|"low"}
 */


function judgeGuess(userNumber, requiredHeroes) {
  if (Number.isNaN(userNumber) || Number.isNaN(requiredHeroes)) {
    throw new Error("judgeGuess: 引数は数値である必要があります");
  }
  if (userNumber === requiredHeroes) return "equal";
  if (userNumber > requiredHeroes) return "high";
  return "low";
}

// クロージャ：絵文字を n 回繰り返す関数を作りました

const createEmojiRepeater = (emoji) => {
  return (times) => {
    const safeTimes = Math.max(0, times);
    const arr = Array.from({ length: safeTimes }, () => emoji);
    return arr.join(" ");
  };
};


/**
 * モンスターデータ
 * 👾: weak → 勇者1人として退治可能として設定
 * 🧟: strong → 勇者2人で退治可能として設定
 */

const MONSTER_TYPES = {
  weak: { emoji: "👾", heroCost: 1 },
  strong: { emoji: "🧟", heroCost: 2 },
};


// 範囲的に3〜8 体のモンスター配列をランダム生成出来るように設定

function generateMonsters() {
  const minMonsters = 3;
  const maxMonsters = 8;
  const count =
    Math.floor(Math.random() * (maxMonsters - minMonsters + 1)) + minMonsters;

  const monsters = [];
  for (let i = 0; i < count; i++) {
    const type = Math.random() < 0.5 ? "weak" : "strong";
    monsters.push(type);
  }
  return monsters;
}



// モンスターを全部倒すのに必要な勇者人数を計算

function calculateRequiredHeroes(monsters) {
  let total = 0;
  for (const m of monsters) {
    const info = MONSTER_TYPES[m];
    if (info) {
      total += info.heroCost;
    }
  }
  return total;
}


/**
 * ターゲット表示用のモンスター絵文字文字列
 * @param {Array<"weak"|"strong">} monsters
 * @returns {string}
 */


function renderMonsterIconsText(monsters) {
  return monsters
    .map((m) => {
      const info = MONSTER_TYPES[m];
      return info ? info.emoji : "?";
    })
    .join(" ");
}


// ゲーム状態の設定
  
let monsters = [];
let requiredHeroes = 0;

// DOM 要素取得

const targetTextEl = document.getElementById("targetText");
const inputEl = document.getElementById("monsterCountInput");
const summonBtn = document.getElementById("summonButton");
const statusEl = document.getElementById("statusMessage");


//ステータスメッセージを表示

function showStatus(message) {
  statusEl.textContent = message;
}

// 現在のモンスター情報をターゲットとして表示コード

function showMonstersInfo() {
  const monsterCount = monsters.length;
  const icons = renderMonsterIconsText(monsters);
  targetTextEl.textContent = `ターゲット：${monsterCount}体のモンスターを倒せ！ ${icons}`;
}


// 新しいモンスターたちを作成して画面リセットを表示

function setupMonsters() {
  monsters = generateMonsters();
  requiredHeroes = calculateRequiredHeroes(monsters);
  showMonstersInfo();
  inputEl.value = "";
}


// 「召喚！」ボタンが押されたときの全体的な処理

function handleSummonClick() {
  const value = inputEl.value.trim();

  if (value === "") {
    showStatus("まずは勇者の人数を入力してください。");
    return;
  }

  const parsed = Number(value);

  // 最低値の勇者の数を1人以上にします。
  if (!Number.isInteger(parsed) || parsed <= 0) {
    showStatus("1以上の整数で勇者の人数を入力してください。");
    return;
  }

  // 一応最大値の勇者の数は40人以内にします。

  if (parsed > 40) {
    showStatus("40人以下の勇者にしてください。");
    return;
  }

  const result = judgeGuess(parsed, requiredHeroes);

  if (result === "equal") {
  // 先に正解メッセージを表示してから新しいモンスターを出す(リセットさせます)

    showStatus(`クリア！！勇者 ${parsed} 人で倒した！ でも次のモンスターが現れたよ！`);
    setupMonsters();
  } else if (result === "high") {
    showStatus("勇者が多すぎます！ もう少し人数を減らしてみませんか？");
  } else {
    showStatus("勇者が足りません！ もう少し増やしてみませんか？");
  }
}

// ゲーム開始の初期画面の設置

// ボタンクリックでゲーム処理を実行
summonBtn.onclick = handleSummonClick;

// 最初のモンスター表示と説明メッセージ
setupMonsters();
showStatus("👾 は勇者1人、🧟 は勇者2人で倒せます。必要な人数を即座に考えて、勇者の数を入力しようぜ！");
