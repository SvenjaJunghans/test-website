let sound;
let fft;
let lines = [];
let colors;

let isRunning = false;
let sessionType = 'Work';
let timer = 25 * 60;
let lastUpdate = 0;

function preload() {
  sound = loadSound('Groove.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  noFill();

  // UI
  let ui = createDiv().id('ui');
  ui.style('position', 'absolute');
  ui.style('top', '20px');
  ui.style('left', '20px');
  ui.style('z-index', '10');

  let box = createDiv().parent(ui);
  box.style('background', 'rgba(255,255,255,0.6)');
  box.style('padding', '12px 18px');
  box.style('border-radius', '12px');
  box.style('font-family', 'monospace');

  let sessionText = createDiv('Session: ').parent(box);
  createSpan('Work').id('session').parent(sessionText);

  createDiv().parent(box);
  let timeText = createDiv('Time Left: ').parent(box);
  createSpan('25:00').id('time').parent(timeText);

  createDiv().parent(box);
  let startStopBtn = createButton('Start/Stop').parent(box);
  startStopBtn.mousePressed(toggleTimer);

  let resetBtn = createButton('Reset').parent(box);
  resetBtn.mousePressed(resetTimer);

  // Farben
  colors = [
    color('#A8E6CF'), color('#DCEBF9'), color('#E0BBE4'), color('#FFDAB9'), color('#FFB6B9'),
    color('#B5EAD7'), color('#C7CEEA'), color('#FFDAC1'), color('#E2F0CB'), color('#FFB7B2')
  ];

  fft = new p5.FFT();
  fft.setInput(sound);

  createLines();
}

function createLines() {
  lines = [];
  let numLines = 10;
  let numPoints = floor(width / 20);
  for (let j = 0; j < numLines; j++) {
    let line = [];
    for (let i = 0; i < numPoints; i++) {
      let x = i * 20;
      let y = height / 2 + j * 20 - 100;
      line.push({ x, y });
    }
    lines.push(line);
  }
}

function draw() {
  background(255);
  updatePomodoro();

  let spectrum = fft.analyze();
  let bandsPerLine = floor(spectrum.length / lines.length);
  let waveSpeed = 0.01;
  let baseFreq = 0.01;

  for (let j = 0; j < lines.length; j++) {
    stroke(colors[j % colors.length]);
    strokeWeight(2);
    noFill();
    beginShape();

    // Energie im zugeordneten Bereich berechnen
    let startBand = j * bandsPerLine;
    let endBand = startBand + bandsPerLine;
    let energy = 0;
    for (let b = startBand; b < endBand; b++) {
      energy += spectrum[b];
    }
    energy /= bandsPerLine;

    let amp = map(energy, 0, 100, 10, 100);
    amp = constrain(amp, 5, 120);

    for (let i = 0; i < lines[j].length; i++) {
      let p = lines[j][i];
      let wave = sin(frameCount * waveSpeed + i * baseFreq * 100 + j * 10);
      let offsetY = wave * amp;
      curveVertex(p.x, p.y + offsetY);
    }

    endShape();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  createLines();
}

function toggleTimer() {
  isRunning = !isRunning;
  lastUpdate = millis();

  if (sound.isPlaying()) {
    sound.pause();
  } else {
    sound.loop();
  }
}

function resetTimer() {
  isRunning = false;
  sessionType = 'Work';
  timer = 25 * 60;
  if (sound.isPlaying()) {
    sound.pause();
  }
}

function updatePomodoro() {
  if (isRunning) {
    const currentMillis = millis();
    if (currentMillis - lastUpdate >= 1000) {
      timer--;
      lastUpdate = currentMillis;
      if (timer <= 0) {
        if (sessionType === 'Work') {
          sessionType = 'Break';
          timer = 5 * 60;
        } else {
          sessionType = 'Work';
          timer = 25 * 60;
        }
      }
    }
  }

  const minutes = nf(floor(timer / 60), 2);
  const seconds = nf(timer % 60, 2);
  document.getElementById('session').textContent = sessionType;
  document.getElementById('time').textContent = `${minutes}:${seconds}`;
}
