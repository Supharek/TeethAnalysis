const modelPath = 'teeth_modelnew.tflite';

async function loadModel() {
    console.log("Loading model...");
    const model = await tf.loadGraphModel(modelPath, { fromTFHub: false });
    console.log("Model loaded successfully");
    return model;
}

function preprocessImage(image, targetSize = [224, 224]) {
    const tensor = tf.browser.fromPixels(image)
        .resizeNearestNeighbor(targetSize)
        .toFloat()
        .expandDims(0);
    return tensor;
}

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
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0);

        const model = await loadModel();
        const inputTensor = preprocessImage(image);
        const prediction = model.predict(inputTensor);
        const output = prediction.dataSync();

        resultDiv.innerText = `Prediction: ${output}`;
    };

    reader.readAsDataURL(file);
}

document.getElementById('analyzeButton').addEventListener('click', analyzeImage);
