const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = new AudioContext()

const audioElement = document.querySelector('audio')
const track = audioContext.createMediaElementSource(audioElement)

const analyser = audioContext.createAnalyser()
const gainNode = audioContext.createGain()

track.connect(analyser).connect(gainNode).connect(audioContext.destination)
track.loop = true;

// powers of 2 - frequency components over time
analyser.fftSize = 16384;
const bufferLength = analyser.frequencyBinCount;

// visualization
const canvas = document.querySelector('canvas')
const canvasContext = canvas.getContext("2d")
const dataArray = new Uint8Array(bufferLength)

const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const barWidth = (WIDTH / bufferLength) * 13

let barHeight;
let x = 0;

function renderFrame() {
  requestAnimationFrame(renderFrame); // callback function to invoke before render

  x = 0;

  analyser.getByteFrequencyData(dataArray);

  canvasContext.fillStyle = "rgb(245, 245, 245, 1)" // clear canvas before rendering bars
  canvasContext.fillRect(0, 0, WIDTH, HEIGHT) // fade effect, set opacity to 1 for sharper rendering

  let bars = 118;

  for (let i = 0; i < bars; i++) {
    barHeight = (dataArray[i] + 2.5)
    canvasContext.fillStyle = '#121212'
    canvasContext.fillRect(x, (HEIGHT - barHeight), barWidth, barHeight)
    x += barWidth + 10
  }
}
// end visualization


const playButton = document.querySelector('button')
playButton.addEventListener('click', function() {
  // check if context is suspended (autoplay policy)
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }

  // play or pause track depending on state
  if (this.dataset.playing === 'false') {
    audioElement.play();
    renderFrame();

    this.dataset.playing = 'true'
    playButton.firstElementChild.innerHTML = 'pause';

  } else if (this.dataset.playing == 'true') {
    audioElement.pause();
    this.dataset.playing = 'false'
    playButton.firstElementChild.innerHTML = 'play_arrow';
  }
}, false);

audioElement.addEventListener('ended', () => {
  audioElement.play();
  playButton.dataset.playing = 'true'
})

const volumeControl = document.querySelector('#volume')

volumeControl.addEventListener('input', function() {
  gainNode.gain.value = this.value
}, false)



