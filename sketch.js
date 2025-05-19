let lines = [];
let numLines = 30;
let resolution = 300;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noFill();
  stroke(255, 60);
  strokeWeight(1.2);
  initLines();
}

function initLines() {
  lines = [];
  for (let j = 0; j < numLines; j++) {
    let line = [];
    for (let i = 0; i < resolution; i++) {
      let x = map(i, 0, resolution - 1, 0, width * 2); // doppelte Breite für Loop
      let y = noise(i * 0.05, j * 0.1) * height;
      line.push({ x, y });
    }
    lines.push(line);
  }
}

function draw() {
  background(30);
  let scroll = frameCount * 0.5 % width;

  push();
  translate(-scroll, 0); // endloser horizontaler Loop
  for (let j = 0; j < lines.length; j++) {
    beginShape();
    for (let i = 0; i < lines[j].length; i++) {
      let p = lines[j][i];
      let offsetY = sin(frameCount * 0.01 + i * 0.05 + j * 0.1) * 40;
      curveVertex(p.x, p.y + offsetY);
    }
    endShape();
  }
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  initLines(); // Linien neu berechnen bei Resize
}
