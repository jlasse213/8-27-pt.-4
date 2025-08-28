// Utility to render LaTeX
function renderMath() { MathJax.typesetPromise(); }

// Generate random integer in [min, max]
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate a random line: y = mx + b
function randomLine() {
  let m = randInt(-5, 5);
  if (m === 0) m = 1;
  let b = randInt(-10, 10);
  return { m, b };
}

// Generate a random point, sometimes on the line, sometimes not
function randomPoint(line) {
  const onLine = Math.random() < 0.5;
  let x = randInt(-5, 5);
  let y;
  if (onLine) {
    y = line.m * x + line.b;
  } else {
    y = line.m * x + line.b + randInt(1, 5) * (Math.random() < 0.5 ? 1 : -1);
  }
  return { x, y, onLine };
}

// State
let currentLine, currentPoint, answeredCorrectly;

function newQuestion() {
  currentLine = randomLine();
  currentPoint = randomPoint(currentLine);
  answeredCorrectly = false;
  document.getElementById('expander').classList.remove('open');
  document.getElementById('tryAgain').textContent = '';
  showQuestion();
}

function showQuestion() {
  const eqLatex = `y = ${currentLine.m === 1 ? '' : currentLine.m === -1 ? '-' : currentLine.m}x ${currentLine.b >= 0 ? '+' : ''} ${currentLine.b}`;
    const ptLatex = `(${currentPoint.x}, ${currentPoint.y})`;
    // Remove $...$ for plain text, use for MathJax only
    document.getElementById('question').innerHTML = `Does the point ${ptLatex} lie on the line ${eqLatex}?`;
    // If you want to keep LaTeX, wrap in \( ... \) instead of $...$
    // document.getElementById('question').innerHTML = `Does the point \\(${ptLatex}\\) lie on the line \\(${eqLatex}\\)?`;
    // renderMath();
}

function checkAnswer(isYes) {
  if (answeredCorrectly) return;
  const correct = (currentPoint.onLine && isYes) || (!currentPoint.onLine && !isYes);
  if (correct) {
    answeredCorrectly = true;
    showSolution();
  } else {
    document.getElementById('tryAgain').textContent = 'Incorrect. Please try again!';
  }
}

function showSolution() {
  document.getElementById('tryAgain').textContent = '';
  document.getElementById('expander').classList.add('open');
  // Solution in plain text (no LaTeX)
  const eqText = `y = ${currentLine.m === 1 ? '' : currentLine.m === -1 ? '-' : currentLine.m}x ${currentLine.b >= 0 ? '+' : ''} ${currentLine.b}`;
  const ptText = `(${currentPoint.x}, ${currentPoint.y})`;
  const yCalc = currentLine.m * currentPoint.x + currentLine.b;
  const isTrue = yCalc === currentPoint.y;
  const solutionText = `To check if ${ptText} is on ${eqText}, substitute x = ${currentPoint.x} into the equation:<br>
  y = ${currentLine.m} × ${currentPoint.x} ${currentLine.b >= 0 ? '+' : ''} ${currentLine.b} = ${yCalc}<br>
  Since y = ${currentPoint.y}, this is ${isTrue ? 'true' : 'false'}!`;
  document.getElementById('solution').innerHTML = solutionText;
  drawGraph();
}

function drawGraph() {
  // SVG graph: axes, line, point
  const w = 300, h = 300, pad = 30;
  const xMin = -6, xMax = 6, yMin = -12, yMax = 12;
  function xMap(x) { return pad + (x - xMin) * (w - 2 * pad) / (xMax - xMin); }
  function yMap(y) { return h - pad - (y - yMin) * (h - 2 * pad) / (yMax - yMin); }
  // Line endpoints
  const x1 = xMin, y1 = currentLine.m * x1 + currentLine.b;
  const x2 = xMax, y2 = currentLine.m * x2 + currentLine.b;
  // SVG
  const svg = `
    <svg width="${w}" height="${h}">
      <rect x="0" y="0" width="${w}" height="${h}" fill="#f6f6ff" stroke="#ccc"/>
      <!-- Axes -->
      <line x1="${xMap(xMin)}" y1="${yMap(0)}" x2="${xMap(xMax)}" y2="${yMap(0)}" stroke="#888" stroke-width="1"/>
      <line x1="${xMap(0)}" y1="${yMap(yMin)}" x2="${xMap(0)}" y2="${yMap(yMax)}" stroke="#888" stroke-width="1"/>
      <!-- Line -->
      <line x1="${xMap(x1)}" y1="${yMap(y1)}" x2="${xMap(x2)}" y2="${yMap(y2)}" stroke="#06c" stroke-width="2"/>
      <!-- Point -->
      <circle cx="${xMap(currentPoint.x)}" cy="${yMap(currentPoint.y)}" r="6" fill="#c00" stroke="#000" stroke-width="1"/>
    </svg>
  `;
  document.getElementById('graph').innerHTML = svg;
}

document.getElementById('yesBtn').onclick = () => checkAnswer(true);
document.getElementById('noBtn').onclick = () => checkAnswer(false);
document.getElementById('newBtn').onclick = newQuestion;

// Initial question
newQuestion();
