# DeepDetect AI - AI Generated Video Detection Platform

A forensic web platform designed to analyze videos, detect synthetic and generative AI manipulations (e.g., OpenAI Sora, Runway Gen-3, Pika Labs, DeepFaceLab face-swaps, SadTalker lip-syncs, and voice clones), and provide transparent diagnostic reports.

---

## 🚀 Key Features

1. **Multimodal Forensic Analysis Engine**:
   - **Temporal Frame-to-Frame Deformation**: Detects unnatural warping, morphing, and optical flow anomalies.
   - **PRNU & Optical Sensor Noise**: Analyzes Gaussian/Poisson sensor noise vs smooth mathematical diffusion noise.
   - **Facial Landmark & Edge Gradient Fourier Transform (FFT)**: Identifies seam-blending artifacts along jawlines and GAN checkerboard patterns.
   - **Spectral Audio & Voice Analysis**: Detects sharp frequency roll-offs above 16kHz characteristic of neural vocoders (ElevenLabs, Bark) and phoneme desynchronization.

2. **Versatile Video Ingestion**:
   - Drag & drop local video files (`.mp4`, `.webm`, `.mov`, `.mkv`).
   - Direct online video URL stream testing.
   - Live Webcam Recording (capture a 4-second real-world clip to test genuine camera detection).
   - 4 Pre-loaded Benchmark Samples:
     - 🤖 **Sora AI Diffusion** (Tokyo Street Scene)
     - 👤 **Deepfake Face-Swap** (Politician Replacement)
     - 🎬 **Authentic 4K DSLR Camera** (Sony Alpha Sensor)
     - 🎙️ **Speech Avatar & Voice Clone** (SadTalker + ElevenLabs)

3. **Interactive Forensic Inspector**:
   - **Filmstrip Keyframe Browser**: Inspect extracted keyframes.
   - **Forensic Filters**:
     - *Original RGB Frame*
     - *AI Artifact Attention Heatmap*
     - *Laplacian Gradient / Edge Map*
     - *Sensor Noise Residual Map*
     - *Error Level Analysis (ELA)*
   - **Second-by-Second Risk Scrubber**: Clickable timeline indicating high-risk generative intervals.

4. **Forensic Audit & Export**:
   - Print-ready formatted PDF report generation (`Ctrl+P` or click "Print / PDF Report").
   - Export structured JSON audit log.
   - Cryptographic SHA-256 fingerprint verification.
   - Local scan history stored in browser `localStorage`.

5. **Optional Python Neural Engine (PyTorch / OpenCV)**:
   - Includes a standalone `backend.py` script using FastAPI & OpenCV.

---

## 🛠️ How to Run

### Method 1: Browser-Only (Instant, Zero Setup)
1. Open `index.html` in any modern web browser (Google Chrome, Microsoft Edge, Brave, Firefox, etc.).
2. You can directly drag and drop any video, or click one of the benchmark samples (e.g. *Sora Latent Diffusion* or *Authentic 4K DSLR*) to see the detection in action immediately!

### Method 2: Optional Python Backend (For Local Deep Learning Inference)
1. Open PowerShell or Command Prompt in the `ai-video-detector` directory:
   ```powershell
   cd c:\Users\HP\Desktop\HTML\ai-video-detector
   ```
2. Install the required Python packages:
   ```powershell
   pip install fastapi uvicorn opencv-python numpy
   ```
3. Start the backend:
   ```powershell
   python backend.py
   ```
4. In the website, click the **Python API** button in the header and toggle the connection to `http://127.0.0.1:8000`.

---

## 📁 Project Structure

```
ai-video-detector/
├── index.html       # Main Web Application & Dashboard UI
├── style.css        # Cyber-forensic dark theme, responsive layout & print styles
├── script.js       # Main orchestrator, UI interactions & Chart.js integration
├── detector.js     # Client-side Computer Vision & Forensic algorithms
├── samples.js      # Procedural sample video generators & benchmark data
├── backend.py      # Optional FastAPI/OpenCV neural backend server
└── README.md       # Documentation & usage guide
```
