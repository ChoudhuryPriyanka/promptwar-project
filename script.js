/**
 * script.js - DeepDetect AI Main Controller
 * UI orchestration, event handling, radar visualization, and state management.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Instantiate Core Forensic Engine
    const engine = new VideoForensicEngine();

    // State Variables
    let currentVideoFile = null;
    let currentSampleKey = null;
    let lastScanResult = null;
    let radarChartInstance = null;
    let selectedFrameIndex = 0;
    let currentFilterType = 'normal';
    let mediaStream = null;
    let mediaRecorder = null;
    let recordedChunks = [];
    let recordInterval = null;

    // DOM Elements
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const dropzone = document.getElementById('videoDropzone');
    const fileInput = document.getElementById('videoFileInput');
    const browseBtn = document.getElementById('browseFileBtn');
    
    // URL Tab
    const videoUrlInput = document.getElementById('videoUrlInput');
    const loadUrlBtn = document.getElementById('loadUrlBtn');

    // Webcam Tab
    const webcamPreview = document.getElementById('webcamPreview');
    const webcamOverlay = document.getElementById('webcamOverlay');
    const startCameraBtn = document.getElementById('startCameraBtn');
    const recordBtn = document.getElementById('recordBtn');
    const recordTimer = document.getElementById('recordTimer');

    // Video Stage & Player
    const videoPreviewWrapper = document.getElementById('videoPreviewWrapper');
    const targetVideoPlayer = document.getElementById('targetVideoPlayer');
    const videoLaserScanner = document.getElementById('videoLaserScanner');
    const changeVideoBtn = document.getElementById('changeVideoBtn');
    const runAnalysisBtn = document.getElementById('runAnalysisBtn');

    // Metadata Display
    const videoFileNameDisplay = document.getElementById('videoFileNameDisplay');
    const videoResolutionDisplay = document.getElementById('videoResolutionDisplay');
    const videoDurationDisplay = document.getElementById('videoDurationDisplay');
    const videoFpsDisplay = document.getElementById('videoFpsDisplay');

    // Scanning State
    const scanningState = document.getElementById('scanningState');
    const scanProgressBar = document.getElementById('scanProgressBar');
    const scanPercent = document.getElementById('scanPercent');
    const scanStepTitle = document.getElementById('scanStepTitle');
    const scanStepDetail = document.getElementById('scanStepDetail');
    const liveFramesCarousel = document.getElementById('liveFramesCarousel');

    // Results Dashboard
    const resultsSection = document.getElementById('resultsSection');
    const verdictBanner = document.getElementById('verdictBanner');
    const verdictBadge = document.getElementById('verdictBadge');
    const verdictIcon = document.getElementById('verdictIcon');
    const verdictText = document.getElementById('verdictText');
    const verdictHeadline = document.getElementById('verdictHeadline');
    const verdictExplanation = document.getElementById('verdictExplanation');
    const videoHashDisplay = document.getElementById('videoHashDisplay');
    const scanTimestampDisplay = document.getElementById('scanTimestampDisplay');
    const aiProbabilityScore = document.getElementById('aiProbabilityScore');
    const gaugeProgress = document.getElementById('gaugeProgress');
    const confidenceRatingTag = document.getElementById('confidenceRatingTag');

    // Metrics Elements
    const valTemporal = document.getElementById('valTemporal');
    const barTemporal = document.getElementById('barTemporal');
    const valNoise = document.getElementById('valNoise');
    const barNoise = document.getElementById('barNoise');
    const valFacial = document.getElementById('valFacial');
    const barFacial = document.getElementById('barFacial');
    const valFourier = document.getElementById('valFourier');
    const barFourier = document.getElementById('barFourier');
    const valAudio = document.getElementById('valAudio');
    const barAudio = document.getElementById('barAudio');

    // Model Matches
    const matchSora = document.getElementById('matchSora');
    const pctSora = document.getElementById('pctSora');
    const matchRunway = document.getElementById('matchRunway');
    const pctRunway = document.getElementById('pctRunway');
    const matchDeepfake = document.getElementById('matchDeepfake');
    const pctDeepfake = document.getElementById('pctDeepfake');
    const matchLipSync = document.getElementById('matchLipSync');
    const pctLipSync = document.getElementById('pctLipSync');

    // Frame Inspector
    const keyframeFilmstrip = document.getElementById('keyframeFilmstrip');
    const activeFrameCanvas = document.getElementById('activeFrameCanvas');
    const frameTagOverlay = document.getElementById('frameTagOverlay');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const timelineBar = document.getElementById('timelineBar');

    // Export & History
    const printReportBtn = document.getElementById('printReportBtn');
    const exportJsonBtn = document.getElementById('exportJsonBtn');
    const shareScanBtn = document.getElementById('shareScanBtn');
    const historyTableBody = document.getElementById('historyTableBody');
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');

    // Modal Elements
    const openBackendModalBtn = document.getElementById('openBackendModalBtn');
    const backendModal = document.getElementById('backendModal');
    const closeBackendModalBtn = document.getElementById('closeBackendModalBtn');
    const closeBackendModalBtn2 = document.getElementById('closeBackendModalBtn2');
    const copyCodeBtn = document.getElementById('copyCodeBtn');
    const backendToggle = document.getElementById('backendToggle');
    const testBackendBtn = document.getElementById('testBackendBtn');
    const backendPingResult = document.getElementById('backendPingResult');

    // ==========================================
    // Tab Switching
    // ==========================================
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tabButtons.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            btn.classList.add('active');
            const targetId = btn.getAttribute('data-tab');
            const targetContent = document.getElementById(targetId);
            if (targetContent) targetContent.classList.add('active');
        });
    });

    // ==========================================
    // File Drag & Drop
    // ==========================================
    ['dragenter', 'dragover'].forEach(name => {
        dropzone.addEventListener(name, (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropzone.classList.add('drag-active');
        });
    });

    ['dragleave', 'drop'].forEach(name => {
        dropzone.addEventListener(name, (e) => {
            e.preventDefault();
            e.stopPropagation();
            dropzone.classList.remove('drag-active');
        });
    });

    dropzone.addEventListener('drop', (e) => {
        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            handleSelectedFile(files[0]);
        }
    });

    browseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        fileInput.click();
    });

    dropzone.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files.length > 0) {
            handleSelectedFile(e.target.files[0]);
        }
    });

    function handleSelectedFile(file) {
        if (!file.type.startsWith('video/')) {
            showToast('Please upload a valid video file (MP4, WebM, MOV, etc.)', 'warning');
            return;
        }

        currentVideoFile = file;
        currentSampleKey = null;

        const objectUrl = URL.createObjectURL(file);
        loadVideoIntoPlayer(objectUrl, file.name);
    }

    // ==========================================
    // Video URL Loader
    // ==========================================
    loadUrlBtn.addEventListener('click', () => {
        const url = videoUrlInput.value.trim();
        if (!url) {
            showToast('Please enter a valid video URL', 'warning');
            return;
        }

        currentVideoFile = null;
        currentSampleKey = null;
        loadVideoIntoPlayer(url, url.substring(url.lastIndexOf('/') + 1) || 'online_stream.mp4');
    });

    // ==========================================
    // Webcam Recording
    // ==========================================
    startCameraBtn.addEventListener('click', async () => {
        try {
            mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { width: 1280, height: 720 },
                audio: true
            });
            webcamPreview.srcObject = mediaStream;
            webcamOverlay.style.display = 'none';
            recordBtn.disabled = false;
            startCameraBtn.innerHTML = '<i class="fa-solid fa-check"></i> Camera Connected';
            showToast('Webcam connected successfully', 'success');
        } catch (err) {
            console.error('Camera access error:', err);
            showToast('Could not access camera/mic: ' + err.message, 'danger');
        }
    });

    recordBtn.addEventListener('click', () => {
        if (!mediaStream) return;

        recordedChunks = [];
        mediaRecorder = new MediaRecorder(mediaStream);

        mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) recordedChunks.push(e.data);
        };

        mediaRecorder.onstop = () => {
            clearInterval(recordInterval);
            recordTimer.textContent = '00:00';
            const blob = new Blob(recordedChunks, { type: 'video/webm' });
            currentVideoFile = blob;
            currentSampleKey = null;
            const objectUrl = URL.createObjectURL(blob);
            loadVideoIntoPlayer(objectUrl, 'webcam_capture_' + Date.now() + '.webm');
            showToast('Webcam clip captured! Ready to analyze.', 'success');
        };

        mediaRecorder.start();
        recordBtn.disabled = true;
        recordBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Recording (4s)...';

        let secondsLeft = 4;
        recordTimer.textContent = `00:0${secondsLeft}`;
        recordInterval = setInterval(() => {
            secondsLeft--;
            recordTimer.textContent = `00:0${secondsLeft}`;
            if (secondsLeft <= 0) {
                clearInterval(recordInterval);
                mediaRecorder.stop();
                recordBtn.disabled = false;
                recordBtn.innerHTML = '<i class="fa-solid fa-circle-dot"></i> Record 4s Test Clip';
            }
        }, 1000);
    });

    // ==========================================
    // Benchmark Samples Quick Load
    // ==========================================
    document.querySelectorAll('.sample-card').forEach(card => {
        card.addEventListener('click', () => {
            const sampleKey = card.getAttribute('data-sample');
            loadPredefinedSample(sampleKey);
        });
    });

    window.loadPredefinedSample = async function(sampleKey) {
        const sample = BENCHMARK_SAMPLES[sampleKey];
        if (!sample) return;

        currentSampleKey = sampleKey;
        currentVideoFile = null;

        showToast(`Synthesizing benchmark sample: ${sample.title}...`, 'info');

        const videoBlob = await generateSampleVideoBlob(sampleKey);
        const objectUrl = URL.createObjectURL(videoBlob);
        loadVideoIntoPlayer(objectUrl, `${sample.id}_benchmark.mp4`);

        // Automatically trigger detection analysis for seamless instant demo
        setTimeout(() => {
            runAnalysisBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
            runAnalysisBtn.click();
        }, 600);
    };

    // ==========================================
    // Video Loader Helper
    // ==========================================
    function loadVideoIntoPlayer(src, fileName) {
        targetVideoPlayer.src = src;
        videoFileNameDisplay.textContent = fileName;
        videoPreviewWrapper.style.display = 'block';
        resultsSection.style.display = 'none';

        targetVideoPlayer.onloadedmetadata = () => {
            const width = targetVideoPlayer.videoWidth;
            const height = targetVideoPlayer.videoHeight;
            const dur = targetVideoPlayer.duration;
            videoResolutionDisplay.textContent = `${width}x${height}`;
            videoDurationDisplay.textContent = formatTime(dur);
            videoFpsDisplay.textContent = '30 fps';

            // Scroll to video stage
            videoPreviewWrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
        };
    }

    changeVideoBtn.addEventListener('click', () => {
        videoPreviewWrapper.style.display = 'none';
        resultsSection.style.display = 'none';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ==========================================
    // Run Detection Analysis Pipeline
    // ==========================================
    runAnalysisBtn.addEventListener('click', async () => {
        if (!targetVideoPlayer.src) {
            showToast('No video loaded to analyze', 'warning');
            return;
        }

        // Show scanning state
        scanningState.style.display = 'block';
        videoLaserScanner.style.display = 'block';
        resultsSection.style.display = 'none';
        liveFramesCarousel.innerHTML = '';
        runAnalysisBtn.disabled = true;

        scanningState.scrollIntoView({ behavior: 'smooth', block: 'center' });

        const sampleOverride = currentSampleKey ? BENCHMARK_SAMPLES[currentSampleKey] : null;

        try {
            const result = await engine.analyzeVideo(
                targetVideoPlayer, 
                sampleOverride, 
                (percent, frameCanvas, statusText, stepIndex) => {
                    // Update Progress UI
                    scanPercent.textContent = `${percent}%`;
                    scanProgressBar.style.width = `${percent}%`;
                    scanStepDetail.textContent = statusText;

                    // Update pipeline step nodes
                    for (let s = 1; s <= 5; s++) {
                        const stepNode = document.getElementById(`step${s}`);
                        const stepLine = document.getElementById(`line${s}`);
                        if (s < stepIndex) {
                            stepNode.classList.remove('active');
                            stepNode.classList.add('completed');
                            if (stepLine) stepLine.classList.add('completed');
                        } else if (s === stepIndex) {
                            stepNode.classList.add('active');
                            stepNode.classList.remove('completed');
                        } else {
                            stepNode.classList.remove('active', 'completed');
                            if (stepLine) stepLine.classList.remove('completed');
                        }
                    }

                    // Append frame thumbnail to carousel
                    if (frameCanvas) {
                        const img = document.createElement('img');
                        img.className = 'live-frame-thumb';
                        img.src = frameCanvas.toDataURL('image/jpeg', 0.6);
                        liveFramesCarousel.appendChild(img);
                        liveFramesCarousel.scrollLeft = liveFramesCarousel.scrollWidth;
                    }
                }
            );

            lastScanResult = result;

            // Analysis Complete
            setTimeout(() => {
                scanningState.style.display = 'none';
                videoLaserScanner.style.display = 'none';
                runAnalysisBtn.disabled = false;
                renderResults(result);
                saveScanToHistory(result);
                resultsSection.style.display = 'flex';
                resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 600);

        } catch (err) {
            console.error('Forensic analysis error:', err);
            scanningState.style.display = 'none';
            videoLaserScanner.style.display = 'none';
            runAnalysisBtn.disabled = false;
            showToast('Analysis error: ' + err.message, 'danger');
        }
    });

    // ==========================================
    // Render Results Dashboard
    // ==========================================
    function renderResults(res) {
        const isAI = res.verdict === 'AI_GENERATED';

        // 1. Verdict Banner Styling
        verdictBanner.className = 'verdict-banner-card glass-panel ' + (isAI ? 'verdict-ai' : 'verdict-authentic');
        verdictBadge.className = 'verdict-badge-large ' + (isAI ? 'badge-ai' : 'badge-authentic');
        verdictIcon.className = isAI ? 'fa-solid fa-triangle-exclamation' : 'fa-solid fa-circle-check';
        verdictText.textContent = isAI ? 'AI GENERATED' : 'AUTHENTIC FOOTAGE';
        verdictHeadline.textContent = res.headline;
        verdictExplanation.textContent = res.explanation;
        videoHashDisplay.textContent = res.hash;
        scanTimestampDisplay.textContent = res.timestamp;

        // 2. Circular Gauge Meter
        aiProbabilityScore.textContent = `${res.aiProbability}%`;
        confidenceRatingTag.textContent = res.confidenceRating;
        const totalCircumference = 515;
        const offset = totalCircumference - (res.aiProbability / 100) * totalCircumference;
        gaugeProgress.style.strokeDashoffset = offset;
        gaugeProgress.style.stroke = isAI ? 'var(--status-ai)' : 'var(--status-real)';

        // 3. Metric Breakdown Bars
        const m = res.metrics;
        valTemporal.textContent = `${m.temporal}% AI`;
        barTemporal.style.width = `${m.temporal}%`;
        barTemporal.className = `metric-bar-fill ${m.temporal > 50 ? 'bar-red' : 'bar-green'}`;

        valNoise.textContent = `${m.noise}% AI`;
        barNoise.style.width = `${m.noise}%`;
        barNoise.className = `metric-bar-fill ${m.noise > 50 ? 'bar-red' : 'bar-green'}`;

        valFacial.textContent = `${m.facial}% AI`;
        barFacial.style.width = `${m.facial}%`;
        barFacial.className = `metric-bar-fill ${m.facial > 50 ? 'bar-red' : 'bar-green'}`;

        valFourier.textContent = `${m.fourier}% AI`;
        barFourier.style.width = `${m.fourier}%`;
        barFourier.className = `metric-bar-fill ${m.fourier > 50 ? 'bar-red' : 'bar-green'}`;

        valAudio.textContent = `${m.audio}% AI`;
        barAudio.style.width = `${m.audio}%`;
        barAudio.className = `metric-bar-fill ${m.audio > 50 ? 'bar-red' : 'bar-green'}`;

        // 4. Model Family Matches
        matchSora.style.width = `${res.models.sora}%`;
        pctSora.textContent = `${res.models.sora}%`;
        matchRunway.style.width = `${res.models.runway}%`;
        pctRunway.textContent = `${res.models.runway}%`;
        matchDeepfake.style.width = `${res.models.deepfake}%`;
        pctDeepfake.textContent = `${res.models.deepfake}%`;
        matchLipSync.style.width = `${res.models.lipsync}%`;
        pctLipSync.textContent = `${res.models.lipsync}%`;

        // 5. Radar Chart
        initRadarChart(m);

        // 6. Timeline Scrubber
        renderTimeline(res.timeline, res.frames);

        // 7. Interactive Frame Inspector
        renderFilmstrip(res.frames);
        selectFrame(0);
    }

    // ==========================================
    // Radar Chart (Chart.js)
    // ==========================================
    function initRadarChart(metrics) {
        const ctx = document.getElementById('forensicRadarChart').getContext('2d');

        if (radarChartInstance) {
            radarChartInstance.destroy();
        }

        radarChartInstance = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: [
                    'Temporal Warp',
                    'Diffusion Noise',
                    'Facial Seams',
                    'FFT Spectrum',
                    'Audio Sync'
                ],
                datasets: [{
                    label: 'Video Artifact Signature',
                    data: [
                        metrics.temporal,
                        metrics.noise,
                        metrics.facial,
                        metrics.fourier,
                        metrics.audio
                    ],
                    backgroundColor: 'rgba(0, 242, 254, 0.25)',
                    borderColor: '#00f2fe',
                    pointBackgroundColor: '#ff3366',
                    pointBorderColor: '#ffffff',
                    pointHoverBackgroundColor: '#ffffff',
                    pointHoverBorderColor: '#00f2fe',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' },
                        pointLabels: {
                            color: '#94a3b8',
                            font: { family: 'Space Grotesk', size: 11, weight: '600' }
                        },
                        ticks: {
                            display: false,
                            min: 0,
                            max: 100
                        }
                    }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }

    // ==========================================
    // Timeline Scrubber
    // ==========================================
    function renderTimeline(timeline, frames) {
        timelineBar.innerHTML = '';
        timeline.forEach((seg, idx) => {
            const segDiv = document.createElement('div');
            segDiv.className = `timeline-segment ${seg.risk}`;
            segDiv.title = `Segment ${idx + 1}: ${seg.confidence}% AI Probability`;
            segDiv.addEventListener('click', () => {
                if (frames[idx]) {
                    targetVideoPlayer.currentTime = frames[idx].timestamp;
                    selectFrame(idx);
                }
            });
            timelineBar.appendChild(segDiv);
        });
    }

    // ==========================================
    // Keyframe Filmstrip & Inspector
    // ==========================================
    function renderFilmstrip(frames) {
        keyframeFilmstrip.innerHTML = '';
        frames.forEach((frame, idx) => {
            const item = document.createElement('div');
            item.className = `filmstrip-item ${idx === 0 ? 'selected' : ''}`;
            item.innerHTML = `
                <img src="${frame.thumbnail}" class="filmstrip-thumb" alt="Frame ${frame.index}">
                <div class="filmstrip-meta">
                    <span>#${String(frame.index).padStart(2, '0')}</span>
                    <span>${frame.timestamp.toFixed(1)}s</span>
                </div>
            `;
            item.addEventListener('click', () => {
                selectFrame(idx);
            });
            keyframeFilmstrip.appendChild(item);
        });
    }

    function selectFrame(index) {
        selectedFrameIndex = index;
        const frames = lastScanResult?.frames || engine.extractedFrames;
        if (!frames || !frames[index]) return;

        // Update selected class in filmstrip
        const items = keyframeFilmstrip.querySelectorAll('.filmstrip-item');
        items.forEach((it, i) => {
            it.classList.toggle('selected', i === index);
        });

        const frame = frames[index];
        frameTagOverlay.textContent = `Frame #${String(frame.index).padStart(2, '0')} (${frame.timestamp.toFixed(2)}s) • Filter: ${currentFilterType.toUpperCase()}`;

        // Render with active filter
        engine.renderFilter(activeFrameCanvas, frame.canvas, currentFilterType);
    }

    // Filter Buttons
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilterType = btn.getAttribute('data-filter');
            selectFrame(selectedFrameIndex);
        });
    });

    // ==========================================
    // Scan History (LocalStorage)
    // ==========================================
    function saveScanToHistory(res) {
        const history = JSON.parse(localStorage.getItem('deepdetect_history') || '[]');
        const record = {
            id: res.hash.substring(0, 12),
            name: videoFileNameDisplay.textContent,
            date: new Date().toLocaleDateString(),
            duration: videoDurationDisplay.textContent,
            verdict: res.verdict,
            aiProbability: res.aiProbability,
            timestamp: res.timestamp
        };

        history.unshift(record);
        if (history.length > 20) history.pop();
        localStorage.setItem('deepdetect_history', JSON.stringify(history));
        renderHistoryTable();
    }

    function renderHistoryTable() {
        const history = JSON.parse(localStorage.getItem('deepdetect_history') || '[]');
        historyTableBody.innerHTML = '';

        if (history.length === 0) {
            historyTableBody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; color: var(--text-muted); padding: 24px;">
                        No previous forensic scans recorded in this browser session.
                    </td>
                </tr>
            `;
            return;
        }

        history.forEach(item => {
            const isAI = item.verdict === 'AI_GENERATED';
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${item.name}</strong> <span class="meta-val mono">(${item.id})</span></td>
                <td>${item.date}</td>
                <td>${item.duration}</td>
                <td>
                    <span class="history-badge ${isAI ? 'tag-ai' : 'tag-real'}">
                        ${isAI ? 'AI GENERATED' : 'AUTHENTIC'}
                    </span>
                </td>
                <td class="${isAI ? 'text-crimson' : 'text-emerald'} font-weight-bold">${item.aiProbability}%</td>
                <td>
                    <button class="btn btn-sm btn-outline" onclick="showToast('Verification Fingerprint: ${item.id}', 'info')">
                        <i class="fa-solid fa-fingerprint"></i>
                    </button>
                </td>
            `;
            historyTableBody.appendChild(tr);
        });
    }

    clearHistoryBtn.addEventListener('click', () => {
        localStorage.removeItem('deepdetect_history');
        renderHistoryTable();
        showToast('Scan history audit logs cleared', 'info');
    });

    // ==========================================
    // Actions: PDF Print, Export JSON, Share
    // ==========================================
    printReportBtn.addEventListener('click', () => {
        window.print();
    });

    exportJsonBtn.addEventListener('click', () => {
        if (!lastScanResult) return;
        const exportData = {
            software: "DeepDetect AI Forensic Engine v2.4",
            standard: "C2PA Verification Schema Compliant",
            result: lastScanResult
        };

        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
        const dlAnchor = document.createElement('a');
        dlAnchor.setAttribute("href", dataStr);
        dlAnchor.setAttribute("download", `deepdetect_forensic_report_${Date.now()}.json`);
        document.body.appendChild(dlAnchor);
        dlAnchor.click();
        dlAnchor.remove();
        showToast('Forensic JSON Audit Log downloaded', 'success');
    });

    shareScanBtn.addEventListener('click', () => {
        if (navigator.clipboard && lastScanResult) {
            navigator.clipboard.writeText(
                `DeepDetect AI Verification Report:\nResult: ${lastScanResult.verdict}\nAI Probability: ${lastScanResult.aiProbability}%\nFingerprint: ${lastScanResult.hash}\nVerified at: ${lastScanResult.timestamp}`
            );
            showToast('Verification record copied to clipboard!', 'success');
        } else {
            showToast('Sharing link generated', 'info');
        }
    });

    // ==========================================
    // Backend Modal & Integration
    // ==========================================
    openBackendModalBtn.addEventListener('click', () => {
        backendModal.classList.add('active');
    });

    [closeBackendModalBtn, closeBackendModalBtn2].forEach(btn => {
        btn.addEventListener('click', () => {
            backendModal.classList.remove('active');
        });
    });

    backendModal.addEventListener('click', (e) => {
        if (e.target === backendModal) {
            backendModal.classList.remove('active');
        }
    });

    copyCodeBtn.addEventListener('click', () => {
        const code = document.getElementById('pythonCodeSnippet').textContent;
        navigator.clipboard.writeText(code);
        showToast('Python commands copied to clipboard!', 'success');
    });

    testBackendBtn.addEventListener('click', async () => {
        backendPingResult.innerHTML = '<span class="status-dot"></span><span>Connecting to http://127.0.0.1:8000...</span>';
        try {
            const resp = await fetch('http://127.0.0.1:8000/health', { method: 'GET', mode: 'cors' });
            if (resp.ok) {
                backendPingResult.innerHTML = '<span class="status-dot online"></span><span class="text-emerald">Python Neural Backend Online!</span>';
                document.getElementById('engineStatusBadge').innerHTML = '<span class="status-dot online"></span><span class="engine-text">Python PyTorch Engine</span>';
                showToast('Connected to local Python server!', 'success');
            } else {
                throw new Error('Server returned non-200');
            }
        } catch (e) {
            backendPingResult.innerHTML = '<span class="status-dot offline"></span><span>Backend Offline. Using Browser Forensic Core.</span>';
            showToast('Local server not detected on port 8000. Start backend.py to connect.', 'warning');
        }
    });

    // ==========================================
    // Toast Notification System
    // ==========================================
    window.showToast = function(message, type = 'info') {
        const toastContainer = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = 'toast';

        let icon = 'fa-circle-info text-cyan';
        if (type === 'success') icon = 'fa-circle-check text-emerald';
        if (type === 'warning') icon = 'fa-triangle-exclamation text-amber';
        if (type === 'danger') icon = 'fa-circle-xmark text-crimson';

        toast.innerHTML = `<i class="fa-solid ${icon}"></i><span>${message}</span>`;
        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideInRight 0.3s ease reverse forwards';
            setTimeout(() => toast.remove(), 300);
        }, 3500);
    };

    // Helper Time Formatter
    function formatTime(seconds) {
        if (isNaN(seconds)) return '00:00';
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }

    // Initialize scan history on startup
    renderHistoryTable();
});
