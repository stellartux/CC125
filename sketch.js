// Fourier Series
// Daniel Shiffman
// https://thecodingtrain.com/CodingChallenges/125-fourier-series.html
// https://youtu.be/Mm2eYfj0SgA
// https://editor.p5js.org/codingtrain/sketches/SJ02W1OgV

let time = 0;
let wave = [];
let sliderlist;
const ctx = new (window.AudioContext || window.webkitAudioContext)();
let osc;

function addSliderComponent () {
  sliderlist.appendChild(
    document.importNode(
      document.getElementById('slider-template').content, true
    )
  );
}

function setup () {
  createCanvas(600, 400);
  sliderlist = document.getElementById('sliders');
  for (let i = 0; i < document.getElementById('slider-count').value; i++) {
    addSliderComponent();
  }

  document.getElementById('slider-count').onchange = e => {
    const val = e.target.value | 0;
    while (sliderlist.childElementCount < val) {
      addSliderComponent();
    }
    while (sliderlist.childElementCount > val) {
      sliderlist.removeChild(sliderlist.lastChild);
    }
  };

  document.getElementById('play-button').onclick = playNote;
  document.getElementById('stop-button').onclick = () => { if (osc) osc.stop(); };
}

function playNote () {
  if (osc) osc.stop();
  len = sliderlist.childElementCount;
  let real = new Float32Array(len + 1);
  let imag = new Float32Array(len + 1);
  osc = ctx.createOscillator();

  real[0] = 0;
  imag[0] = 0;

  for (let i = 0; i < len; i++) {
    let el = sliderlist.children[i].getElementsByClassName('radius')[0];
    real[i + 1] = el.value / el.getAttribute('max');
    imag[i + 1] = 0;
  }

  osc.setPeriodicWave(ctx.createPeriodicWave(real, imag));
  osc.connect(ctx.destination);
  osc.start();
}

function draw () {
  background(0);
  translate(150, 200);

  let x = 0;
  let y = 0;

  for (let i = 0; i < sliderlist.childElementCount; i++) {
    let prevx = x;
    let prevy = y;
    let slider = sliderlist.children[i];
    let radius = slider.getElementsByClassName('radius')[0].value;

    x += radius * cos(time * (i + 1));
    y += radius * sin(time * (i + 1));

    stroke(255, 100);
    noFill();
    ellipse(prevx, prevy, 2 * radius);

    stroke(255);
    line(prevx, prevy, x, y);
    ellipse(x, y, 2);
  }
  wave.unshift(y);

  translate(200, 0);
  line(x - 200, y, 0, wave[0]);
  beginShape();
  noFill();
  for (let i = 0; i < wave.length; i++) {
    vertex(i, wave[i]);
  }
  endShape();

  time += 0.05;

  if (wave.length > 250) {
    wave.pop();
  }
}
