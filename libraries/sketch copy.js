let sound;
let fft;
let lines = [];
let noiseLayer;

let colors;
let currentIndex = 0;
let nextIndex = 1;
let lerpAmt = 0;

function preload() {
  sound = loadSound('Groove.mp3');
}

function setup() {
    fft = new p5.FFT();
    // sound.loop();  ← entfernen!
// sound.setvolume(0.5); ← Schreibfehler (richtig wäre sound.setVolume)
    fft.setInput(sound);
    
  //Canvas erstellen
  createCanvas(windowWidth, windowHeight);
  noFill();

  // Linien vorbereiten flex option einbauen
  for (let j = 0; j < 20; j++) {
    let line = [];
    for (let i = 0; i < windowWidth/10; i++) {
      let x = i * 10;
      let y = noise(i * 0.05, j * 1) * height;
      line.push({ x, y });
    }
    lines.push(line);
  }

  // Farben definieren (Pastelltöne) statt hntergrund die Linien vielleicht in farben
  // und den Hintergrund in weiß
  colors = [
    color('#A8E6CF'), // Mintgrün
    color('#DCEBF9'), // Himmelblau
    color('#E0BBE4'), // Flieder
    color('#FFDAB9'), // Pfirsich
    color('#FFB6B9')  // Zartes Rosa
  ];

  // Körniger Lichtstaub als Overlay
  noiseLayer = createGraphics(width, height);
  noiseLayer.noStroke();
  noiseLayer.clear();

  for (let i = 0; i < 10000; i++) {
    let x = random(width);
    let y = random(height);
    let brightness = random(150, 255);
    noiseLayer.fill(brightness, 10); // fast weiß, sehr transparent
    noiseLayer.ellipse(x, y, 1, 1);
  }
}

function draw() {
  // Hintergrundfarbe interpolieren
  let bgColor = lerpColor(colors[currentIndex], colors[nextIndex], lerpAmt);
  background(bgColor);

  // Übergang langsam steuern
  lerpAmt += 0.001;
  if (lerpAmt >= 1) {
    lerpAmt = 0;
    currentIndex = nextIndex;
    nextIndex = (nextIndex + 1) % colors.length;
  }

  // Körniger Overlay
  blendMode(ADD);
  image(noiseLayer, 0, 0);
  blendMode(BLEND);

  // Wellenlinien
  stroke(0);
  strokeWeight(1.2);
  push();
  //translate(-frameCount * 0.5 % width, 0); // scrollend

  for (let j = 0; j < lines.length; j++) {
    beginShape();
    for (let i = 0; i < lines[j].length; i++) {
      let p = lines[j][i];
      let amp = fft.getEnergy('bass'); // oder 'mid' oder 'high'
let offsetY = sin(frameCount * 0.03 + i * 0.05 + j * 0.1) * (10 + amp * 0.1);

      curveVertex(p.x, p.y + offsetY);
    }
    endShape();
  }

  pop();
}

function mousePressed() {
  if (!sound.isPlaying()) {
    sound.loop();
    fft.setInput(sound);
  }
}

