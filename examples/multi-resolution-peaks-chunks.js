// Multi-resolution peaks with chunk-based loading example
// Simulates loading peaks progressively as chunks become available

import WaveSurfer from 'wavesurfer.js'

// Utility function to merge peak arrays at different positions
function mergePeaks(basePeaks, newPeaks, startIndex) {
  const merged = [...basePeaks]
  for (let i = 0; i < newPeaks.length; i++) {
    if (startIndex + i < merged.length) {
      merged[startIndex + i] = newPeaks[i]
    }
  }
  return merged
}

// Create the waveform instance
const wavesurfer = WaveSurfer.create({
  container: document.body,
  waveColor: 'rgb(100, 150, 200)',
  progressColor: 'rgb(50, 100, 150)',
  barWidth: 3,
  barGap: 2,
  barRadius: 2,
  height: 150,
})

// Simulate a large audio file with low-res initial peaks
const initialLowResPeaks = new Array(100).fill(0).map(() => Math.random() * 0.8 - 0.4)
const duration = 300 // 5 minutes

// Simulate high-res peak chunks (10 chunks of 100 samples each = 1000 samples total)
const highResChunks = []
for (let chunk = 0; chunk < 10; chunk++) {
  const chunkData = new Array(100).fill(0).map(() => Math.random() * 0.9 - 0.45)
  highResChunks.push(chunkData)
}

// Current peaks being displayed
let currentPeaks = [...initialLowResPeaks]

// Info display
const info = document.createElement('div')
info.style.cssText = `
  position: fixed;
  top: 10px;
  right: 10px;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.9), rgba(40, 40, 60, 0.9));
  color: white;
  padding: 20px;
  border-radius: 10px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 13px;
  z-index: 1000;
  min-width: 300px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
`
info.innerHTML = `
  <h3 style="margin: 0 0 15px 0; font-size: 16px; border-bottom: 1px solid rgba(255,255,255,0.2); padding-bottom: 10px;">Chunk-Based Progressive Loading</h3>
  <div style="margin: 5px 0;">
    <strong>Status:</strong> <span id="status" style="color: #ffa500;">Initializing...</span>
  </div>
  <div style="margin: 5px 0;">
    <strong>Resolution:</strong> <span id="resolution">Low</span>
  </div>
  <div style="margin: 5px 0;">
    <strong>Data points:</strong> <span id="dataPoints">-</span>
  </div>
  <div style="margin: 5px 0;">
    <strong>Chunks loaded:</strong> <span id="chunksLoaded">0/10</span>
  </div>
  <div style="margin: 15px 0 5px 0;">
    <div style="background: rgba(255,255,255,0.1); height: 10px; border-radius: 5px; overflow: hidden;">
      <div id="progressBar" style="background: linear-gradient(90deg, #4CAF50, #8BC34A); height: 100%; width: 0%; transition: width 0.3s ease;"></div>
    </div>
  </div>
`
document.body.appendChild(info)

const statusEl = document.getElementById('status')
const resolutionEl = document.getElementById('resolution')
const dataPointsEl = document.getElementById('dataPoints')
const chunksLoadedEl = document.getElementById('chunksLoaded')
const progressBar = document.getElementById('progressBar')

// Step 1: Load with low-resolution peaks
wavesurfer.load('/examples/audio/demo.wav', [initialLowResPeaks], duration)

let chunksLoaded = 0

wavesurfer.on('ready', () => {
  statusEl.textContent = 'Ready - Loading high-res chunks...'
  statusEl.style.color = '#4CAF50'
  resolutionEl.textContent = 'Low (initial)'
  dataPointsEl.textContent = currentPeaks.length

  // Simulate progressive chunk loading with delays
  let chunkIndex = 0

  const loadNextChunk = () => {
    if (chunkIndex >= highResChunks.length) {
      statusEl.textContent = 'Complete - All chunks loaded!'
      statusEl.style.color = '#4CAF50'
      resolutionEl.textContent = 'High (full resolution)'
      return
    }

    // Simulate network delay
    setTimeout(() => {
      // Merge the new chunk into current peaks
      const chunk = highResChunks[chunkIndex]
      const startIndex = chunkIndex * chunk.length
      currentPeaks = mergePeaks(currentPeaks, chunk, startIndex)

      // Pad the array if needed to reach target length
      while (currentPeaks.length < 1000) {
        currentPeaks.push(0)
      }

      // Update the waveform
      wavesurfer.updatePeaks([currentPeaks], duration)

      chunksLoaded++
      chunksLoadedEl.textContent = `${chunksLoaded}/10`
      progressBar.style.width = `${(chunksLoaded / 10) * 100}%`
      dataPointsEl.textContent = currentPeaks.length
      resolutionEl.textContent = `Mixed (${chunksLoaded}/10 chunks)`
      statusEl.textContent = `Loading chunk ${chunksLoaded + 1}/10...`

      chunkIndex++
      loadNextChunk()
    }, 300 + Math.random() * 400) // Random delay between 300-700ms
  }

  // Start loading chunks after initial render
  setTimeout(loadNextChunk, 1000)
})

// Track peaks updates
let updateCount = 0
wavesurfer.on('peaks', () => {
  updateCount++
  console.log(`Peaks updated (${updateCount} times)`)
})

// Play controls
wavesurfer.on('interaction', () => {
  wavesurfer.play()
})

wavesurfer.on('finish', () => {
  wavesurfer.setTime(0)
})

// Instructions panel
const instructions = document.createElement('div')
instructions.style.cssText = `
  position: fixed;
  bottom: 10px;
  left: 10px;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.9), rgba(40, 40, 60, 0.9));
  color: white;
  padding: 20px;
  border-radius: 10px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 13px;
  max-width: 450px;
  z-index: 1000;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
`
instructions.innerHTML = `
  <h4 style="margin: 0 0 10px 0; font-size: 15px;">📊 How Chunk-Based Loading Works:</h4>
  <ol style="margin: 5px 0; padding-left: 20px;">
    <li style="margin: 8px 0;">Waveform loads with <strong>low resolution</strong> (100 samples) for instant display</li>
    <li style="margin: 8px 0;">High-resolution chunks load progressively in the background</li>
    <li style="margin: 8px 0;">Each chunk adds 100 samples, building up to 1000 samples total</li>
    <li style="margin: 8px 0;">Waveform updates smoothly without interrupting playback</li>
  </ol>
  <div style="margin-top: 15px; padding: 10px; background: rgba(76, 175, 80, 0.15); border-left: 3px solid #4CAF50; border-radius: 4px;">
    <strong>💡 Real-world use case:</strong> Perfect for streaming services or large audio files where you can load overview peaks first, then fetch detailed peaks for the visible region.
  </div>
`
document.body.appendChild(instructions)

// Log to console
console.log('Multi-resolution peaks demo initialized')
console.log('Initial peaks:', initialLowResPeaks.length, 'samples')
console.log('Target resolution:', highResChunks.length * highResChunks[0].length, 'samples')
