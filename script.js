const organData = {
  brain: {
    name: '大腦',
    description: '大腦是人體中樞神經系統的主要部分，負責思考、記憶、感覺與控制動作。',
    fact: '大腦雖然只佔體重約 2%，卻消耗全身約 20% 的氧氣。',
  },
  lungs: {
    name: '肺',
    description: '肺負責吸入空氣並將氧氣傳送到血液，同時排出二氧化碳。',
    fact: '肺泡是肺部負責氣體交換的細小結構，總面積約一個網球場大小。',
  },
  heart: {
    name: '心臟',
    description: '心臟是泵血器官，持續將血液輸送至全身，提供氧氣和養分。',
    fact: '心臟每分鐘約跳動 60~100 次，一天可跳動約 10 萬次。',
  },
  liver: {
    name: '肝臟',
    description: '肝臟參與代謝、解毒、製造膽汁與儲存能量。',
    fact: '肝臟是人體最大的內臟，可再生部分受損組織。',
  },
  stomach: {
    name: '胃',
    description: '胃負責暫時儲存食物，並通過胃酸與酵素分解食物。',
    fact: '胃壁有強大的保護層，幫助胃酸不會消化自己的組織。',
  },
  kidneys: {
    name: '腎臟',
    description: '腎臟過濾血液，排出代謝廢物並維持體內水分與電解質平衡。',
    fact: '腎臟每天可過濾約 180 公升血液。',
  },
};

const quizQuestions = [
  {
    question: '哪一個器官負責將氧氣輸送到血液並排出二氧化碳？',
    options: ['心臟', '肺', '肝臟', '腎臟'],
    answer: '肺',
  },
  {
    question: '哪一個器官是中樞神經系統的主要部分？',
    options: ['胃', '大腦', '腎臟', '肺'],
    answer: '大腦',
  },
  {
    question: '下列哪項不是肝臟的功能？',
    options: ['解毒', '製造膽汁', '泵血', '儲存能量'],
    answer: '泵血',
  },
  {
    question: '哪一個器官主要負責過濾血液和排泄廢物？',
    options: ['心臟', '胃', '腎臟', '肺'],
    answer: '腎臟',
  },
];

const introBox = document.getElementById('organIntro');
const choicesEl = document.getElementById('choices');
const questionText = document.getElementById('questionText');
const nextBtn = document.getElementById('nextBtn');
const resultBox = document.getElementById('result');
const knowledgeArea = document.getElementById('knowledgeArea');
const factBtn = document.getElementById('factBtn');

let currentIndex = 0;
let selectedAnswer = null;
let answered = false;
let score = 0;
let activeOrgan = null;

const knowledgeFacts = [
  '心臟一分鐘大約跳動 60 到 100 次，一天大約跳動 10 萬次。',
  '人體的肝臟是最大的內臟器官，能再生部分受損組織。',
  '大腦雖然只佔體重約 2%，卻消耗全身約 20% 的氧氣。',
  '腎臟每天可以過濾大約 180 公升的血液，產生約 1.5 公升尿液。',
  '胃壁有很強的黏膜保護，使胃酸不會消化自己的組織。',
];

function getRandomKnowledge() {
  return knowledgeFacts[Math.floor(Math.random() * knowledgeFacts.length)];
}

function renderKnowledge() {
  knowledgeArea.innerHTML = `<p>${getRandomKnowledge()}</p>`;
}

function showOrganInfo(organId) {
  const organ = organData[organId];
  if (!organ) return;

  if (activeOrgan) {
    activeOrgan.classList.remove('active');
  }
  activeOrgan = document.querySelector(`[data-organ="${organId}"]`);
  activeOrgan?.classList.add('active');

  introBox.innerHTML = `
    <h3>${organ.name}</h3>
    <p>${organ.description}</p>
    <p><strong>小知識：</strong>${organ.fact}</p>
  `;
}

function renderQuestion() {
  const current = quizQuestions[currentIndex];
  questionText.textContent = current.question;
  choicesEl.innerHTML = '';
  current.options.forEach(option => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'choice-button';
    btn.textContent = option;
    btn.addEventListener('click', () => selectChoice(option, btn));
    choicesEl.appendChild(btn);
  });
  resultBox.classList.add('hidden');
  selectedAnswer = null;
  answered = false;
  nextBtn.textContent = '提交答案';
  nextBtn.disabled = false;
}

function selectChoice(option, button) {
  if (answered) return;
  selectedAnswer = option;
  Array.from(choicesEl.children).forEach(child => child.classList.remove('selected'));
  button.classList.add('selected');
}

function showResult() {
  const current = quizQuestions[currentIndex];
  if (selectedAnswer === null) {
    resultBox.textContent = '請先選一個答案，再按提交答案。';
    resultBox.classList.remove('hidden');
    return false;
  }

  answered = true;
  Array.from(choicesEl.children).forEach(button => {
    if (button.textContent === current.answer) {
      button.classList.add('correct');
    }
    if (button.textContent === selectedAnswer && selectedAnswer !== current.answer) {
      button.classList.add('wrong');
    }
  });

  if (selectedAnswer === current.answer) {
    score += 1;
    resultBox.textContent = '答對了！很好。';
  } else {
    resultBox.textContent = `答錯了，正確答案是：${current.answer}。`;
  }
  resultBox.classList.remove('hidden');
  return true;
}

function nextQuestion() {
  if (!answered) {
    const valid = showResult();
    if (!valid) return;
    nextBtn.textContent = currentIndex === quizQuestions.length - 1 ? '查看成績' : '下一題';
    return;
  }

  currentIndex += 1;
  if (currentIndex < quizQuestions.length) {
    renderQuestion();
  } else {
    displayFinalScore();
  }
}

function displayFinalScore() {
  questionText.textContent = `測驗結束！你答對 ${score} / ${quizQuestions.length} 題。`;
  choicesEl.innerHTML = '';
  resultBox.textContent = '恭喜完成小測驗。你可以重新整理頁面再挑戰一次。';
  resultBox.classList.remove('hidden');
  nextBtn.disabled = true;
}

document.querySelectorAll('[data-organ]').forEach(item => {
  item.addEventListener('click', () => {
    showOrganInfo(item.dataset.organ);
  });
});

factBtn.addEventListener('click', renderKnowledge);
nextBtn.addEventListener('click', nextQuestion);

renderQuestion();
renderKnowledge();
