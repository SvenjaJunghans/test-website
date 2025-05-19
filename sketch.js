let lines = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  noFill();

  // mehrere Linien anlegen
  for (let j = 0; j < 20; j++) {
    let line = [];
    for (let i = 0; i < 200; i++) {
      let x = i * 10;
      let y = noise(i * 0.05, j * 0.1) * height;
      line.push({ x, y });
    }
    lines.push(line);
  }
}

function draw() {
  background(30);
  stroke(255, 80);
  strokeWeight(1.2);

  translate(-frameCount * 0.5 % width, 0); // unendliches Scrollen nach links

  for (let j = 0; j < lines.length; j++) {
    beginShape();
    for (let i = 0; i < lines[j].length; i++) {
      let p = lines[j][i];
      let offsetY = sin(frameCount * 0.01 + i * 0.05 + j * 0.1) * 30;
      curveVertex(p.x, p.y + offsetY);
    }
    endShape();
  }
}
