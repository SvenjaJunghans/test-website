// sketch.js
// Globale Variablen für Audio
let mic; // Mikrofon-Eingang
let fft; // p5.FFT-Objekt für Audioanalyse
let isRunning = false;

// Arrays für die Visualisierungspunkte
let lines = [];
const numLines = 60;

// Erstellt ein neues p5-Objekt, das den Sketch im Instanzmodus ausführt
const sketch = (p) => {
    // p5.js setup Funktion: Läuft einmal beim Start
    p.setup = function() {
        // Erstellt ein Canvas, das dem gesamten Fenster entspricht
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.noFill(); // Keine Füllung für Linien und Formen

        // Initialisiere die Linien für die Visualisierung
        for (let i = 0; i < numLines; i++) {
            lines.push({
                angle: p.map(i, 0, numLines, 0, 360),
                length: 0
            });
        }
        
        // Erstelle das Mikrofon-Objekt nur einmal
        mic = new p5.AudioIn();
        fft = new p5.FFT();
        fft.setInput(mic);
    }

    // p5.js draw Funktion: Die Haupt-Rendering-Schleife
    p.draw = function() {
        // Semi-transparenter Hintergrund für "Nachzieh-Effekt" auf dunklem Hintergrund
        p.background(18, 18, 18, 50);

        // Die Visualisierung wird nur gerendert, wenn der Visualizer läuft und FFT initialisiert ist
        if (isRunning) {
            let spectrum = fft.analyze();
            let energy = fft.getEnergy('mid');
            // Skaliere die Energie, um die Visualisierung größer zu machen
            let currentAmp = p.map(energy, 0, 255, 10, 200);

            let centerX = p.width / 2;
            let centerY = p.height / 2;

            // Visualisierung mit "Galaxy Trails"
            p.colorMode(p.HSB, 360, 100, 100);

            for (let i = 0; i < lines.length; i++) {
                let line = lines[i];
                
                // Skaliere die Länge der Linie basierend auf dem aktuellen Schalldruck
                let targetLength = p.map(spectrum[i], 0, 255, 20, 400) + currentAmp;
                line.length = p.lerp(line.length, targetLength, 0.2);

                let x = centerX + p.cos(p.radians(line.angle)) * line.length;
                let y = centerY + p.sin(p.radians(line.angle)) * line.length;

                // Zeichne die Linie
                let hue = p.map(i, 0, lines.length, 0, 360);
                p.stroke(hue, 80, 90, 100);
                p.strokeWeight(3);
                p.line(centerX, centerY, x, y);
            }
        }
    }

    // Passt die Canvas-Größe an, wenn das Fenster geändert wird
    p.windowResized = function() {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
    }
};

// Erstellt eine Instanz des p5-Sketches
new p5(sketch, 'main');

// Funktion zum Starten oder Stoppen des Mikrofons und der Visualisierung
function toggleVisualizer() {
    isRunning = !isRunning;
    const button = document.getElementById('start-stop-btn');
    if (isRunning) {
        // Versuche das Mikrofon zu starten
        mic.start();
        button.textContent = 'Stop Visualizer';
        button.classList.remove('bg-indigo-600', 'hover:bg-indigo-700');
        button.classList.add('bg-rose-600', 'hover:bg-rose-700');
    } else {
        // Stoppt das Mikrofon
        mic.stop();
        button.textContent = 'Start Visualizer';
        button.classList.remove('bg-rose-600', 'hover:bg-rose-700');
        button.classList.add('bg-indigo-600', 'hover:bg-indigo-700');
    }
}

// Fügt einen Event-Listener zum Button hinzu
document.getElementById('start-stop-btn').addEventListener('click', toggleVisualizer);