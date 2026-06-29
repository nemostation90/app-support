// Sound effects synthesized live with the Web Audio API.
// No audio files are used — every sound is generated from oscillators
// and noise, so there is nothing to download and nothing external.

let ctx = null;
let muted = localStorage.getItem("swiftkeys.muted") === "1";

function ac() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

function tone(freq, start, dur, { type = "sine", gain = 0.18, slideTo = null } = {}) {
  const a = ac();
  const t0 = a.currentTime + start;
  const osc = a.createOscillator();
  const g = a.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(g).connect(a.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

function noiseBurst(start, dur, gain = 0.25) {
  const a = ac();
  const t0 = a.currentTime + start;
  const buf = a.createBuffer(1, Math.floor(a.sampleRate * dur), a.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1);
  const src = a.createBufferSource();
  src.buffer = buf;
  const g = a.createGain();
  g.gain.setValueAtTime(gain, t0);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  const filt = a.createBiquadFilter();
  filt.type = "bandpass";
  filt.frequency.value = 1200;
  src.connect(filt).connect(g).connect(a.destination);
  src.start(t0);
  src.stop(t0 + dur);
}

export const sfx = {
  isMuted() { return muted; },
  setMuted(v) { muted = v; localStorage.setItem("swiftkeys.muted", v ? "1" : "0"); },
  toggle() { this.setMuted(!muted); return muted; },
  // Soft click for a correct keystroke.
  key() {
    if (muted) return;
    try { tone(660, 0, 0.05, { type: "triangle", gain: 0.05 }); } catch {}
  },
  // Low buzz for a wrong key.
  error() {
    if (muted) return;
    try { tone(150, 0, 0.12, { type: "sawtooth", gain: 0.07, slideTo: 90 }); } catch {}
  },
  // Punchy "pow" when a stage/enemy is hit.
  hit() {
    if (muted) return;
    try {
      noiseBurst(0, 0.14, 0.22);
      tone(420, 0, 0.16, { type: "square", gain: 0.12, slideTo: 180 });
    } catch {}
  },
  // Happy ascending fanfare on quest win.
  win() {
    if (muted) return;
    try {
      const notes = [523, 659, 784, 1047]; // C E G C
      notes.forEach((f, i) => tone(f, i * 0.12, 0.22, { type: "triangle", gain: 0.16 }));
      tone(1568, 0.48, 0.3, { type: "triangle", gain: 0.14 });
    } catch {}
  },
};
