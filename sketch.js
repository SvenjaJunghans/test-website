function setup() {
function setup() {
  createCanvas(800, 600);
  noStroke();

  amp = new p5.Amplitude();
  amp.setInput(audio);
  fft = new p5.FFT();
  fft.setInput(audio);
} 
}

let lines = [];

function setup() {
  createCanvas(800, 600);
  stroke(255, 80);
  noFill();

  for (let i = 0; i < 60; i++) {
    lines.push(new FlowLine(i * 4));
  }
}

function draw() {
  background(40); // dunkelgrauer Hintergrund

  for (let l of lines) {
    l.update();
    l.display();
  }
}

class FlowLine {
  constructor(yOffset) {
    this.yOffset = yOffset;
    this.t = random(1000);
  }

  update() {
    this.t += 0.005;
  }

  display() {
    beginShape();
    for (let x = 0; x <= width; x += 10) {
      let y = this.yOffset + noise(x * 0.005, this.t) * 100;
      curveVertex(x, y);
    }
    endShape();
  }
}
