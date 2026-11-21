/**
 * samples.js - Ground Truth Benchmarks & Procedural Video Generator
 * Provides offline-capable realistic sample video generation via HTML5 Canvas + Web Audio API
 */

const BENCHMARK_SAMPLES = {
    sora: {
        id: "sora",
        title: "Sora Synthetic Tokyo Street Scene",
        category: "Latent Diffusion Model (Sora / Gen-3)",
        duration: "00:05",
        fps: 30,
        resolution: "1280x720",
        groundTruth: "AI_GENERATED",
        aiProbability: 95.4,
        confidenceText: "Very High Confidence (95.4%)",
        headline: "High Likelihood of Generative Latent Diffusion Synthesis",
        explanation: "Spectral spatial analysis revealed non-physical diffusion noise distributions, lack of optical sensor Bayer pattern, and inter-frame temporal warping across background geometry (frames #05 to #18).",
        metrics: {
            temporal: 92,
            noise: 97,
            facial: 85,
            fourier: 94,
            audio: 78
        },
        models: {
            sora: 94,
            runway: 86,
            deepfake: 28,
            lipsync: 22
        },
        findings: [
            { icon: "fa-triangle-exclamation", text: "<strong>Diffusion Denoising Footprint:</strong> Absence of Gaussian/Poisson optical sensor shot noise in dark gradients.", type: "crimson" },
            { icon: "fa-triangle-exclamation", text: "<strong>Temporal Morphing:</strong> High optical flow vector jitter on reflective road surfaces.", type: "crimson" },
            { icon: "fa-circle-check", text: "<strong>Container Analysis:</strong> Synthetic 60fps presentation timestamp alignment.", type: "emerald" }
        ],
        drawFrame: (ctx, width, height, progress, frameIndex) => {
            // Generates a futuristic neon cityscape with diffusion glow and synthetic warping
            const grad = ctx.createLinearGradient(0, 0, width, height);
            grad.addColorStop(0, '#0a0520');
            grad.addColorStop(0.5, '#250942');
            grad.addColorStop(1, '#051838');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, width, height);

            // Procedural neon city buildings
            const buildingCount = 9;
            for (let i = 0; i < buildingCount; i++) {
                const bWidth = width / buildingCount;
                const bHeight = 220 + Math.sin(i * 1.5) * 80 + Math.cos(progress * 4 + i) * 12; // synthetic morphing!
                const bx = i * bWidth;
                const by = height - bHeight;

                ctx.fillStyle = i % 2 === 0 ? '#120d2d' : '#1c1543';
                ctx.fillRect(bx, by, bWidth - 4, bHeight);

                // Neon windows with subtle generative flickering
                ctx.fillStyle = (i + Math.floor(progress * 10)) % 3 === 0 ? '#00f2fe' : '#ff3366';
                for (let w = bx + 6; w < bx + bWidth - 10; w += 14) {
                    for (let h = by + 12; h < height - 20; h += 24) {
                        ctx.globalAlpha = 0.6 + 0.3 * Math.sin(w + progress * 6);
                        ctx.fillRect(w, h, 6, 12);
                    }
                }
                ctx.globalAlpha = 1.0;
            }

            // Cyber wet asphalt reflection with temporal morphing ripples
            const roadY = height - 70;
            const roadGrad = ctx.createLinearGradient(0, roadY, 0, height);
            roadGrad.addColorStop(0, 'rgba(0, 242, 254, 0.25)');
            roadGrad.addColorStop(1, '#040711');
            ctx.fillStyle = roadGrad;
            ctx.fillRect(0, roadY, width, 70);

            // Synthetic floating text / Sora watermark indicator
            ctx.font = 'bold 22px Space Grotesk, sans-serif';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.fillText("DeepDetect • Test Benchmark: Sora AI Diffusion", 24, 42);
            ctx.font = '14px JetBrains Mono, monospace';
            ctx.fillStyle = '#00f2fe';
            ctx.fillText(`Frame #${String(frameIndex).padStart(3, '0')} | Timestamp: ${(progress * 5).toFixed(2)}s | Latent Jitter: 0.88`, 24, 68);
        }
    },

    deepfake: {
        id: "deepfake",
        title: "Deepfake Facial Identity Swap",
        category: "GAN Autoencoder (DeepFaceLab / RoOP)",
        duration: "00:04",
        fps: 30,
        resolution: "1280x720",
        groundTruth: "AI_GENERATED",
        aiProbability: 92.1,
        confidenceText: "High Confidence (92.1%)",
        headline: "Detected Facial Identity Replacement & Boundary Blending Seams",
        explanation: "Automated landmark analysis identified unnatural boundary blurring along the jawline/neck junction, low-frequency eye blink cadence, and chromatic aberration discontinuity between face crop and source body.",
        metrics: {
            temporal: 86,
            noise: 84,
            facial: 98,
            fourier: 91,
            audio: 65
        },
        models: {
            sora: 31,
            runway: 24,
            deepfake: 95,
            lipsync: 58
        },
        findings: [
            { icon: "fa-triangle-exclamation", text: "<strong>Facial Boundary Seam:</strong> Detected 12px Gaussian alpha-blend margin around outer jawline.", type: "crimson" },
            { icon: "fa-triangle-exclamation", text: "<strong>Eye-Blink Cadence:</strong> Zero spontaneous micro-saccades and irregular pupil reflection geometry.", type: "crimson" },
            { icon: "fa-circle-check", text: "<strong>Lighting Inconsistency:</strong> Face key-light angle contradicts ambient shoulder shadow angle.", type: "crimson" }
        ],
        drawFrame: (ctx, width, height, progress, frameIndex) => {
            // Real body background
            ctx.fillStyle = '#1e2433';
            ctx.fillRect(0, 0, width, height);

            // Studio backdrop
            const bgGrad = ctx.createRadialGradient(width/2, height/2, 40, width/2, height/2, 400);
            bgGrad.addColorStop(0, '#2e3852');
            bgGrad.addColorStop(1, '#0e121c');
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, width, height);

            // Human silhouette & suit
            ctx.fillStyle = '#0d131f';
            ctx.beginPath();
            ctx.ellipse(width / 2, height + 80, 240, 200, 0, 0, Math.PI * 2);
            ctx.fill();

            // Head shape
            const headX = width / 2;
            const headY = height / 2 - 20;

            // Deepfake mask boundary halo (intentionally visible for forensic demo)
            ctx.save();
            ctx.beginPath();
            ctx.ellipse(headX, headY, 115, 145, 0, 0, Math.PI * 2);
            ctx.fillStyle = '#dfaa8a';
            ctx.fill();

            // Blend border seam visualization
            ctx.strokeStyle = 'rgba(255, 51, 102, 0.4)';
            ctx.lineWidth = 3;
            ctx.setLineDash([6, 4]);
            ctx.stroke();
            ctx.restore();

            // Eyes with artificial reflection
            ctx.fillStyle = '#1a1a1a';
            const eyeBlink = Math.abs(Math.sin(progress * 7)) < 0.15 ? 1 : 12; // irregular blink
            ctx.beginPath();
            ctx.ellipse(headX - 42, headY - 18, 16, eyeBlink, 0, 0, Math.PI * 2);
            ctx.ellipse(headX + 42, headY - 18, 16, eyeBlink, 0, 0, Math.PI * 2);
            ctx.fill();

            // Mouth
            ctx.strokeStyle = '#994433';
            ctx.lineWidth = 4;
            ctx.beginPath();
            const mouthOpen = 4 + Math.sin(progress * 12) * 6;
            ctx.ellipse(headX, headY + 54, 26, mouthOpen, 0, 0, Math.PI);
            ctx.stroke();

            // Overlay label
            ctx.font = 'bold 22px Space Grotesk, sans-serif';
            ctx.fillStyle = '#ffffff';
            ctx.fillText("DeepDetect • Test Benchmark: Deepfake Face-Swap", 24, 42);
            ctx.font = '14px JetBrains Mono, monospace';
            ctx.fillStyle = '#ff3366';
            ctx.fillText(`Frame #${String(frameIndex).padStart(3, '0')} | Landmark Seam Residual: 0.94 | Warp Delta: 14.2px`, 24, 68);
        }
    },

    authentic: {
        id: "authentic",
        title: "Genuine Studio 4K Camera Footage",
        category: "Authentic Optical Sensor (Sony Alpha / Canon EOS)",
        duration: "00:06",
        fps: 30,
        resolution: "1920x1080",
        groundTruth: "AUTHENTIC",
        aiProbability: 3.2,
        confidenceText: "Extremely High Confidence (96.8% Authentic)",
        headline: "Verified Authentic Optical Recording",
        explanation: "Passed all sensor noise tests. Exhibits natural Poisson-Gaussian Bayer pattern sensor noise, continuous chromatic dispersion, genuine optical depth-of-field bokeh, and coherent physical motion.",
        metrics: {
            temporal: 4,
            noise: 2,
            facial: 5,
            fourier: 3,
            audio: 2
        },
        models: {
            sora: 2,
            runway: 3,
            deepfake: 1,
            lipsync: 2
        },
        findings: [
            { icon: "fa-circle-check", text: "<strong>PRNU & Sensor Noise:</strong> Authentic camera sensor noise profile matches hardware CMOS Bayer matrix.", type: "emerald" },
            { icon: "fa-circle-check", text: "<strong>Optical Physics:</strong> Consistent focal length, lens chromatic aberration, and physical specular reflections.", type: "emerald" },
            { icon: "fa-circle-check", text: "<strong>Audio Integrity:</strong> Full-spectrum natural microphone frequency response above 20kHz with room acoustics.", type: "emerald" }
        ],
        drawFrame: (ctx, width, height, progress, frameIndex) => {
            // Warm studio lighting gradient
            const bgGrad = ctx.createLinearGradient(0, 0, width, height);
            bgGrad.addColorStop(0, '#1a1f2c');
            bgGrad.addColorStop(0.5, '#222938');
            bgGrad.addColorStop(1, '#11151e');
            ctx.fillStyle = bgGrad;
            ctx.fillRect(0, 0, width, height);

            // Natural photographic bokeh circles (optical lens blur)
            const bokehCount = 14;
            for (let i = 0; i < bokehCount; i++) {
                const bx = (i * 137.5) % width;
                const by = 80 + ((i * 93.2) % (height - 160));
                const radius = 24 + (i % 5) * 14;
                const bGrad = ctx.createRadialGradient(bx, by, 0, bx, by, radius);
                bGrad.addColorStop(0, 'rgba(255, 200, 150, 0.22)');
                bGrad.addColorStop(0.8, 'rgba(100, 180, 255, 0.08)');
                bGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
                ctx.fillStyle = bGrad;
                ctx.beginPath();
                ctx.arc(bx, by, radius, 0, Math.PI * 2);
                ctx.fill();
            }

            // Authentic subject silhouette with sharp optical edge
            ctx.fillStyle = '#0f141f';
            ctx.beginPath();
            ctx.ellipse(width / 2, height / 2, 130, 160, 0, 0, Math.PI * 2);
            ctx.fill();

            // Real physical camera sensor noise simulation (Gaussian grain)
            const imgData = ctx.getImageData(0, 0, width, height);
            const data = imgData.data;
            // Apply slight physical grain to simulate optical sensor
            for (let p = 0; p < data.length; p += 32) {
                const grain = (Math.random() - 0.5) * 8;
                data[p] = Math.min(255, Math.max(0, data[p] + grain));
                data[p+1] = Math.min(255, Math.max(0, data[p+1] + grain));
                data[p+2] = Math.min(255, Math.max(0, data[p+2] + grain));
            }
            ctx.putImageData(imgData, 0, 0);

            // Authentic badge
            ctx.font = 'bold 22px Space Grotesk, sans-serif';
            ctx.fillStyle = '#ffffff';
            ctx.fillText("DeepDetect • Test Benchmark: Authentic Sony Alpha 4K", 24, 42);
            ctx.font = '14px JetBrains Mono, monospace';
            ctx.fillStyle = '#00e676';
            ctx.fillText(`Frame #${String(frameIndex).padStart(3, '0')} | Sensor Bayer SNR: 44.2 dB | Optical Coherence: 0.99`, 24, 68);
        }
    },

    lipsync: {
        id: "lipsync",
        title: "Synthesized Talking Avatar & Voice Clone",
        category: "Voice Clone + Talking Head (ElevenLabs / SadTalker)",
        duration: "00:05",
        fps: 30,
        resolution: "1280x720",
        groundTruth: "AI_GENERATED",
        aiProbability: 89.6,
        confidenceText: "High Confidence (89.6%)",
        headline: "Detected Synthetic Voice Profile & Lip-Sync Desynchronization",
        explanation: "Web Audio FFT analysis detected an unnatural sharp frequency roll-off above 16kHz characteristic of neural vocoders, combined with an average 82ms phonetic desynchronization between speech audio energy and lip geometry.",
        metrics: {
            temporal: 75,
            noise: 82,
            facial: 91,
            fourier: 87,
            audio: 95
        },
        models: {
            sora: 18,
            runway: 25,
            deepfake: 62,
            lipsync: 96
        },
        findings: [
            { icon: "fa-triangle-exclamation", text: "<strong>Spectral Audio Cutoff:</strong> Neural vocoder brick-wall frequency cutoff at 16,000 Hz.", type: "crimson" },
            { icon: "fa-triangle-exclamation", text: "<strong>Phonetic Lag:</strong> Viseme lip position delays speech formant plosives by 84 milliseconds.", type: "crimson" },
            { icon: "fa-triangle-exclamation", text: "<strong>Static Neck Artifact:</strong> Torso and collar remain rigid while facial geometry moves independently.", type: "crimson" }
        ],
        drawFrame: (ctx, width, height, progress, frameIndex) => {
            // Corporate office background
            ctx.fillStyle = '#171f2d';
            ctx.fillRect(0, 0, width, height);

            // Office windows
            ctx.fillStyle = '#222d3d';
            ctx.fillRect(80, 80, width - 160, 200);

            // Avatar body (rigid and motionless)
            ctx.fillStyle = '#090d14';
            ctx.beginPath();
            ctx.ellipse(width / 2, height + 40, 220, 180, 0, 0, Math.PI * 2);
            ctx.fill();

            // Head
            const headX = width / 2;
            const headY = height / 2 - 10;
            ctx.fillStyle = '#e8bc9e';
            ctx.beginPath();
            ctx.ellipse(headX, headY, 95, 125, 0, 0, Math.PI * 2);
            ctx.fill();

            // Synthetic mouth movement
            const mouthH = 3 + Math.abs(Math.sin(progress * 18)) * 14;
            ctx.fillStyle = '#7a2222';
            ctx.beginPath();
            ctx.ellipse(headX, headY + 50, 20, mouthH, 0, 0, Math.PI * 2);
            ctx.fill();

            // Soundwave visualizer overlay
            ctx.strokeStyle = '#00f2fe';
            ctx.lineWidth = 2;
            ctx.beginPath();
            for (let x = 24; x < width - 24; x += 10) {
                const waveY = height - 40 + Math.sin(x * 0.05 + progress * 20) * 16 * (x < width/2 ? 1 : 0.2); // cutoff!
                if (x === 24) ctx.moveTo(x, waveY);
                else ctx.lineTo(x, waveY);
            }
            ctx.stroke();

            // Title
            ctx.font = 'bold 22px Space Grotesk, sans-serif';
            ctx.fillStyle = '#ffffff';
            ctx.fillText("DeepDetect • Test Benchmark: AI Voice & Lip-Sync Avatar", 24, 42);
            ctx.font = '14px JetBrains Mono, monospace';
            ctx.fillStyle = '#ff3366';
            ctx.fillText(`Frame #${String(frameIndex).padStart(3, '0')} | Audio Spectral Cutoff: 16.0 kHz | Phoneme Sync Lag: +84ms`, 24, 68);
        }
    }
};

/**
 * Procedurally generates a lightweight MP4/WebM video in memory using HTML5 Canvas & MediaRecorder
 * Ensures sample benchmarks run instantly anywhere with 100% offline reliability.
 */
async function generateSampleVideoBlob(sampleKey) {
    const sample = BENCHMARK_SAMPLES[sampleKey];
    if (!sample) return null;

    const width = 640;
    const height = 360;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    const totalSeconds = 4.0;
    const fps = 25;
    const totalFrames = Math.floor(totalSeconds * fps);

    // Create stream from canvas
    const stream = canvas.captureStream(fps);

    // Create synthesized audio track using Web Audio API
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        const dest = audioCtx.createMediaStreamDestination();
        
        osc.type = sample.groundTruth === 'AUTHENTIC' ? 'triangle' : 'sawtooth';
        osc.frequency.setValueAtTime(220, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
        
        osc.connect(gain);
        gain.connect(dest);
        osc.start();

        // Add audio track to stream
        dest.stream.getAudioTracks().forEach(track => stream.addTrack(track));
    } catch (e) {
        console.warn("AudioContext not permitted before interaction; proceeding without synthetic audio track", e);
    }

    return new Promise((resolve) => {
        let recordedChunks = [];
        let mimeType = 'video/webm;codecs=vp9';
        if (!MediaRecorder.isTypeSupported(mimeType)) {
            mimeType = 'video/webm';
        }

        const recorder = new MediaRecorder(stream, { mimeType });

        recorder.ondataavailable = (e) => {
            if (e.data.size > 0) recordedChunks.push(e.data);
        };

        recorder.onstop = () => {
            const blob = new Blob(recordedChunks, { type: mimeType });
            resolve(blob);
        };

        recorder.start();

        let currentFrame = 0;
        const interval = setInterval(() => {
            if (currentFrame >= totalFrames) {
                clearInterval(interval);
                recorder.stop();
                return;
            }

            const progress = currentFrame / totalFrames;
            sample.drawFrame(ctx, width, height, progress, currentFrame);
            currentFrame++;
        }, 1000 / fps);
    });
}
