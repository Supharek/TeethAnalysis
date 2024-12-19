const modelPath = 'teeth_modelnew.tflite';  // Path to the model file

// แสดงข้อความการโหลดโมเดล
async function loadModel() {
    console.log("Loading model...");
    try {
        // สมมุติว่าโมเดลนี้ใช้ TensorFlow.js
        const model = await tf.loadGraphModel(modelPath, { fromTFHub: false });
        console.log("Model loaded successfully");

        alert("Model loaded successfully!");  // แสดงป๊อปอัพเมื่อโหลดสำเร็จ
        return model;
    } catch (error) {
        console.error("Error loading the model: ", error);
        alert("Error loading model! Please check your model path and try again.");  // แสดงป๊อปอัพเมื่อเกิดข้อผิดพลาด
        return null;
    }
}

// ฟังก์ชันในการประมวลผลภาพ
function preprocessImage(image, targetSize = [224, 224]) {
    const tensor = tf.browser.fromPixels(image)
        .resizeNearestNeighbor(targetSize)  // ขยายภาพให้ตรงตามขนาดที่ต้องการ
        .toFloat()
        .expandDims(0);  // เพิ่มมิติของ batch
    return tensor;
}

// ฟังก์ชันในการวิเคราะห์ภาพ
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
        // ตั้งขนาดของ canvas และวาดภาพที่อัปโหลด
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0);

        // โหลดโมเดล
        const model = await loadModel();

        // ตรวจสอบว่าโมเดลโหลดสำเร็จหรือไม่
        if (!model) {
            resultDiv.innerText = "Model failed to load!";
            return;
        }

        // ประมวลผลภาพและทำการทำนายผล
        const inputTensor = preprocessImage(image);
        const prediction = await model.predict(inputTensor);
        console.log("Prediction result:", prediction);

        // แสดงผลการทำนาย
        const output = prediction.dataSync();  // รับผลจาก TensorFlow.js
        resultDiv.innerText = `Prediction Result: ${output}`;
    };

    reader.readAsDataURL(file);
}

// ฟังก์ชันในการเพิ่ม event listener
document.getElementById('analyzeButton').addEventListener('click', analyzeImage);
