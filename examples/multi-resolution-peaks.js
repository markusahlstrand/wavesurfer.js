// Multi-resolution peaks example
// Load low-resolution peaks first, then progressively update with higher resolution

import WaveSurfer from 'wavesurfer.js'

// Create the waveform instance
const wavesurfer = WaveSurfer.create({
  container: document.body,
  waveColor: 'rgb(200, 100, 200)',
  progressColor: 'rgb(100, 50, 100)',
  barWidth: 2,
  barGap: 1,
  height: 128,
})

// Low resolution peaks (fewer data points for fast initial load)
const lowResolutionPeaks = [
  [
    0, 0.012107174843549728, -0.31324470043182373, 0.2473851442337036, -0.036057762801647186, -0.03033737652003765,
    0.23974689841270447, -0.12377244979143143, 0.10884027928113937, -0.17105795443058014, -0.10380347073078156,
    0.18730352818965912, -0.15030759572982788, 0.2749626338481903, 0.07571295648813248, 0.15336275100708008,
    -0.09044631570577621, -0.04906218498945236, 0.04520256072282791, 0.12266506254673004, -0.10895221680402756,
    -0.09187793731689453, 0.0829525887966156, 0.07634212076663971, -0.049201950430870056, 0.015354577451944351,
  ],
]

const duration = 22

// High resolution peaks (more data points for better detail)
const highResolutionPeaks = [
  [
    0, 0.0023595101665705442, 0.012107174843549728, 0.005919494666159153, -0.31324470043182373, 0.1511787623167038,
    0.2473851442337036, 0.11443428695201874, -0.036057762801647186, -0.0968964695930481, -0.03033737652003765,
    0.10682467371225357, 0.23974689841270447, 0.013210971839725971, -0.12377244979143143, 0.046145666390657425,
    -0.015757400542497635, 0.10884027928113937, 0.06681904196739197, 0.09432944655418396, -0.17105795443058014,
    -0.023439358919858932, -0.10380347073078156, 0.0034454423002898693, 0.08061369508504868, 0.026129156351089478,
    0.18730352818965912, 0.020447958260774612, -0.15030759572982788, 0.05689578503370285, -0.0009095853311009705,
    0.2749626338481903, 0.2565386891365051, 0.07571295648813248, 0.10791446268558502, -0.06575305759906769,
    0.15336275100708008, 0.07056761533021927, 0.03287476301193237, -0.09044631570577621, 0.01777501218020916,
    -0.04906218498945236, -0.04756792634725571, -0.006875281687825918, 0.04520256072282791, -0.02362387254834175,
    -0.0668797641992569, 0.12266506254673004, -0.10895221680402756, 0.03791835159063339, -0.0195105392485857,
    -0.031097881495952606, 0.04252675920724869, -0.09187793731689453, 0.0829525887966156, -0.003812957089394331,
    0.0431736595928669, 0.07634212076663971, -0.05335947126150131, 0.0345163568854332, -0.049201950430870056,
    0.02300390601158142, 0.007677287794649601, 0.015354577451944351, 0.007677287794649601, 0.007677288725972176,
  ],
]

// Info display
const info = document.createElement('div')
info.style.cssText = `
  position: fixed;
  top: 10px;
  left: 10px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 15px;
  border-radius: 8px;
  font-family: monospace;
  font-size: 14px;
  z-index: 1000;
`
info.innerHTML = `
  <h3 style="margin: 0 0 10px 0;">Multi-Resolution Peaks Demo</h3>
  <p style="margin: 5px 0;">Status: <span id="status">Loading low resolution...</span></p>
  <p style="margin: 5px 0;">Resolution: <span id="resolution">Low</span></p>
  <p style="margin: 5px 0;">Data points: <span id="dataPoints">-</span></p>
`
document.body.appendChild(info)

const statusEl = document.getElementById('status')
const resolutionEl = document.getElementById('resolution')
const dataPointsEl = document.getElementById('dataPoints')

// Step 1: Load with low-resolution peaks for fast initial render
wavesurfer.load('/examples/audio/demo.wav', lowResolutionPeaks, duration)

wavesurfer.on('ready', () => {
  statusEl.textContent = 'Ready (low resolution)'
  resolutionEl.textContent = 'Low'
  dataPointsEl.textContent = lowResolutionPeaks[0].length

  // Step 2: After a short delay, update with high-resolution peaks
  setTimeout(() => {
    statusEl.textContent = 'Updating to high resolution...'
    wavesurfer.updatePeaks(highResolutionPeaks, duration)
  }, 1500)
})

// Listen to the peaks event to know when high resolution is loaded
wavesurfer.on('peaks', () => {
  statusEl.textContent = 'Ready (high resolution)'
  resolutionEl.textContent = 'High'
  dataPointsEl.textContent = highResolutionPeaks[0].length
})

// Play on interaction
wavesurfer.on('interaction', () => {
  wavesurfer.play()
})

wavesurfer.on('finish', () => {
  wavesurfer.setTime(0)
})

// Add instructions
const instructions = document.createElement('div')
instructions.style.cssText = `
  position: fixed;
  bottom: 10px;
  left: 10px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 15px;
  border-radius: 8px;
  font-family: sans-serif;
  font-size: 14px;
  max-width: 400px;
  z-index: 1000;
`
instructions.innerHTML = `
  <strong>How it works:</strong><br>
  1. Waveform loads with <strong>low resolution peaks</strong> (26 data points) first for fast rendering<br>
  2. After 1.5 seconds, it updates to <strong>high resolution peaks</strong> (68 data points) for better detail<br>
  3. The audio playback is not affected during the peak update<br><br>
  <em>This is useful for large audio files where you can load chunks progressively.</em>
`
document.body.appendChild(instructions)
