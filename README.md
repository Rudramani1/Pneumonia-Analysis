# Pneumonia Analysis

## Overview
This project is a web-based application designed to raise awareness about pneumonia and provide an AI-powered tool for analyzing chest X-ray images. The tool uses a Teachable Machine model to predict potential pneumonia indicators from uploaded images or live webcam input.

## Features
- **Pneumonia Information**: Learn about pneumonia, its symptoms, risk factors, and prevention methods.
- **Image Analysis**: Upload a chest X-ray or CT scan image or use your webcam to analyze the image for potential pneumonia indicators.
- **AI-Powered Predictions**: The application uses a pre-trained Teachable Machine model to provide predictions.
- **User-Friendly Interface**: Simple and intuitive interface for easy navigation and usage.

## Technologies Used
- **Frontend**: HTML, CSS, JavaScript
- **AI Model**: Teachable Machine (TensorFlow.js)
- **Libraries**:
  - [Teachable Machine Image Library](https://teachablemachine.withgoogle.com/)
  - [TensorFlow.js](https://www.tensorflow.org/js)

## How It Works
1. The user navigates to the Image Analysis section.
2. The user can either:
   - Upload a chest X-ray or CT scan image.
   - Use their webcam to capture a live image of a chest X-ray or CT scan.
3. The application processes the image using the Teachable Machine model.
4. The results are displayed, showing the likelihood of pneumonia indicators.

## Setup Instructions
### Prerequisites
- A modern web browser (e.g., Chrome, Firefox, Edge).
- A working webcam (optional, for live analysis).

### Steps to Run the Project
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Rudramani1/pneumonia-analysis.git
   cd pneumonia-analysis
