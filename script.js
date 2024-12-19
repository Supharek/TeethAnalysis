const modelPath = 'teeth_modelnew.tflite';  // Path to the model file

// Load the model
async function loadModel() {
    console.log("Loading model...");
    try {
        // Assuming TensorFlow.js can load .tflite models
        const model = await tf.loadGraphModel(modelPath, { fromTFHub: false });
        console.log("Model loaded successfully");
        alert("Model loaded successfully!");  // Show a pop-up when model is loaded successfully
        return model;
    } catch (error) {
        console.error("Error loading the model: ", error);
        alert("Error loading model! Please check your model path and try again.");  // Show error pop-up
        return null;
    }
}

// Preprocess the image to match the input format for the model
function preprocessImage(image, targetSize = [224, 224]) {
    const tensor = tf.browser.fromPixels(image)
        .resizeNearestNeighbor(targetSize)  // Resize image to the required dimensions
        .toFloat()
        .expandDims(0);  // Add a batch dimension
    return tensor;
}

// Handle image file upload and analysis
async function analyzeImage() {
    const fileInput = document.getElementById('imageInput');
    const resultDiv = document.getElementById('result');

    if (!fileInput.files.length) {
        resultDiv.innerText = "Please upload an image!";
        return;
    }

    const file = fileInput.files[0];
    const image = new Image();
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const reader = new FileReader();

    reader.onload = () => {
        image.src = reader.result;
    };

    image.onload = async () => {
        // Set canvas size and draw the uploaded image
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0);

        // Load the model
        const model = await loadModel();

        // Check if model loaded
        if (!model) {
            resultDiv.innerText = "Model failed to load!";
            return;
        }

        // Preprocess image and make prediction
        const inputTensor = preprocessImage(image);
        const prediction = await model.predict(inputTensor);
        console.log("Prediction result:", prediction);

        // Get the output prediction result
        const output = prediction.dataSync();  // For TensorFlow.js
        resultDiv.innerText = `Prediction Result: ${output}`;
    };

    reader.readAsDataURL(file);
}

// Event listener for the "Analyze" button
document.getElementById('analyzeButton').addEventListener('click', analyzeImage);
