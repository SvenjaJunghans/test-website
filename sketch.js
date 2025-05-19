let audio;
let fft;
let amp;

function preload() {
  // Stelle sicher: Datei heißt genau "relaxing.mp3"
  audio = loadSound('relaxing.mp3');
}

function setup() {
  // ...existing code...
function setup() {
  createCanvas(800, 600);
  noStroke();

  amp = new p5.Amplitude();
  amp.setInput(audio); // <--- Diese Zeile ergänzen
  fft = new p5.FFT();
  fft.setInput(audio);
} 
}
// ...existing code...

function draw() {
  background(255);

  if (audio.isPlaying()) {
    let level = amp.getLevel();
    let size = map(level, 0, 1, 100, 400);

    fill(180, 120, 200, 150);
    ellipse(width / 2, height / 2, size);

    let waveform = fft.waveform();
    noFill();
    stroke(200, 150, 220, 80);
    beginShape();
    for (let i = 0; i < waveform.length; i++) {
      let x = map(i, 0, waveform.length, 0, width);
      let y = map(waveform[i], -1, 1, height * 0.25, height * 0.75);
      curveVertex(x, y);
    }
    endShape();
  }
}

// ← wichtig: Sound wird erst nach Klick gestartet!
function mousePressed() {
  if (audio && !audio.isPlaying()) {
    audio.loop();
  }
}
