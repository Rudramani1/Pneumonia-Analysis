// Teachable Machine model URL
const URL = "https://teachablemachine.withgoogle.com/models/PyCbkcAqM/";

let model, webcam, labelContainer, maxPredictions;

// Initialize the model
async function initModel() {
    try {
        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";
        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();
        labelContainer = document.getElementById("label-container");
        console.log("Model loaded successfully");
        
        // Enable the analyze button after model loads
        document.querySelector('.analyze-btn').disabled = false;
    } catch (error) {
        console.error("Error loading model:", error);
        alert("Error loading the analysis model. Please try again later.");
    }
}

// Initialize webcam
async function initWebcam() {
    if (!model) {
        await initModel();
    }
    
    try {
        if (webcam) {
            webcam.stop();
        }
        
        const webcamContainer = document.getElementById("webcam-container");
        webcamContainer.innerHTML = '';
        document.getElementById('webcam-section').classList.remove('hidden');
        document.getElementById('results-section').classList.remove('hidden');

        const flip = true;
        webcam = new tmImage.Webcam(400, 400, flip);
        await webcam.setup();
        await webcam.play();
        webcamContainer.appendChild(webcam.canvas);

        // Start prediction loop
        window.requestAnimationFrame(loop);
    } catch (error) {
        console.error("Error starting webcam:", error);
        alert("Error accessing webcam. Please ensure you have granted camera permissions.");
    }
}

// Webcam prediction loop
async function loop() {
    if (webcam && webcam.canvas && webcam.canvas.parentElement) {
        webcam.update();
        await predict(webcam.canvas);
        window.requestAnimationFrame(loop);
    }
}

// Show/Hide analysis section
document.getElementById('showAnalysisBtn').addEventListener('click', async function() {
    document.getElementById('analysisTools').classList.remove('hidden');
    if (!model) {
        try {
            this.textContent = "Loading...";
            this.disabled = true;
            await initModel();
            this.textContent = "Start Analysis";
            this.disabled = false;
        } catch (error) {
            this.textContent = "Error Loading";
            console.error(error);
        }
    }
});

// Handle file input
document.getElementById('fileInput').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (file) {
        if (!model) {
            await initModel();
        }
        
        const reader = new FileReader();
        reader.onload = (event) => {
            const previewImage = document.getElementById('previewImage');
            previewImage.src = event.target.result;
            previewImage.classList.remove('hidden');
            document.getElementById('results-section').classList.remove('hidden');
        };
        reader.readAsDataURL(file);
    }
});

// Handle drag and drop
const uploadArea = document.getElementById('uploadArea');

uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#3498DB';
    uploadArea.style.backgroundColor = '#f8f9fa';
});

uploadArea.addEventListener('dragleave', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#ccc';
    uploadArea.style.backgroundColor = 'transparent';
});

uploadArea.addEventListener('drop', async (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#ccc';
    uploadArea.style.backgroundColor = 'transparent';
    
    if (!model) {
        await initModel();
    }
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        document.getElementById('fileInput').files = e.dataTransfer.files;
        const reader = new FileReader();
        reader.onload = (event) => {
            const previewImage = document.getElementById('previewImage');
            previewImage.src = event.target.result;
            previewImage.classList.remove('hidden');
            document.getElementById('results-section').classList.remove('hidden');
        };
        reader.readAsDataURL(file);
    }
});

// Analyze uploaded image
async function analyzeUpload() {
    const image = document.getElementById('previewImage');
    if (!image.src) {
        alert('Please select an image first!');
        return;
    }

    if (!model) {
        await initModel();
    }

    try {
        const analyzeBtn = document.querySelector('.analyze-btn');
        analyzeBtn.textContent = 'Analyzing...';
        analyzeBtn.disabled = true;

        // Create a new image element for prediction
        const tempImage = new Image();
        tempImage.src = image.src;
        await tempImage.decode(); // Ensure image is loaded

        document.getElementById('results-section').classList.remove('hidden');
        await predict(tempImage);

        analyzeBtn.textContent = 'Analyze Image';
        analyzeBtn.disabled = false;
    } catch (error) {
        console.error('Analysis error:', error);
        alert('Error analyzing the image. Please try again.');
    }
}

// Unified predict function for both webcam and uploaded images
async function predict(imageElement) {
    try {
        if (!model) {
            throw new Error('Model not loaded');
        }

        const predictions = await model.predict(imageElement);
        displayResults(predictions);
        return predictions;
    } catch (error) {
        console.error('Prediction error:', error);
        throw error;
    }
}

// Display results with recommendations
function displayResults(predictions) {
    if (!labelContainer) return;
    
    labelContainer.innerHTML = '';
    const recommendationsDiv = document.getElementById('recommendations');
    
    predictions.sort((a, b) => b.probability - a.probability);
    
    predictions.forEach(p => {
        const resultDiv = document.createElement('div');
        resultDiv.className = 'result-card';
        
        const percentage = (p.probability * 100).toFixed(2);
        resultDiv.innerHTML = `
            <h3>${p.className}</h3>
            <div class="probability-bar">
                <div class="probability-fill" style="width: ${percentage}%"></div>
            </div>
            <p>Matching Percentage: ${percentage}%</p>
        `;
        
        labelContainer.appendChild(resultDiv);
    });

    // Add recommendations based on highest probability prediction
    const topPrediction = predictions[0];
    if (topPrediction.probability > 0.5) {
        recommendationsDiv.innerHTML = `
            <div class="recommendation">
                <h3 style="element {
  padding-bottom: 30px;
  font-size: 40px;" >Personalized Recommendations</h3>
                <div class="recommendation-grid">
                    <div class="recommendation-card">
                        <h4 style="
  padding-top: 25px;
  padding-bottom: 21px;
">🏥 Medical Consultation</h4>
                        <ul>
                            <li>Schedule an appointment with a pulmonologist</li>
                            <li>Bring your CT scan results and analysis</li>
                            <li>Prepare a list of symptoms and concerns</li>
                        </ul>
                    </div>
                    <div class="recommendation-card">
                        <h4 style="
  padding-top: 25px;
  padding-bottom: 21px;
">📋 Next Steps</h4>
                        <ul>
                            <li>Regular follow-up appointments</li>
                            <li>Additional screening tests if recommended</li>
                            <li>Join a support group</li>
                        </ul>
                    </div>
                    <div class="recommendation-card">
                        <h4 style="
  padding-top: 25px;
  padding-bottom: 21px;
">💪 Lifestyle Changes</h4>
                        <ul>
                            <li>Maintain a healthy diet rich in antioxidants</li>
                            <li>Regular moderate exercise</li>
                            <li>Stress management techniques</li>
                        </ul>
                    </div>
                </div>
            </div>
        `;
    }
}

// Stop webcam when switching to file upload
function stopWebcam() {
    if (webcam) {
        webcam.stop();
        document.getElementById('webcam-container').innerHTML = '';
    }
}

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Initialize the model when the page loads
window.addEventListener('load', initModel);