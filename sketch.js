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

let blobs = [];

function setup() {
  createCanvas(800, 600);
  noFill();
  for (let i = 0; i < 6; i++) {
    blobs.push(new Blob(random(width), random(height), random(60, 150)));
  }
}

function draw() {
  background(250, 248, 245); // warm white tone

  for (let blob of blobs) {
    blob.update();
    blob.display();
  }
}

class Blob {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.offset = random(1000);
  }

  update() {
    this.offset += 0.01;
  }

  display() {
    stroke(150, 120, 200, 80);
    strokeWeight(2);
    beginShape();
    for (let a = 0; a < TWO_PI; a += 0.1) {
      let off = this.offset + cos(a) * 0.5;
      let r = this.r + noise(off) * 40;
      let x = this.x + cos(a) * r;
      let y = this.y + sin(a) * r;
      curveVertex(x, y);
    }
    endShape(CLOSE);
  }
}

