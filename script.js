let model;

// ฟังก์ชันโหลดโมเดล
async function loadModel() {
    const modelPath = '/teeth_modelnew.tflite';
    const modelStatus = document.getElementById('model-status');

    try {
        // แสดงข้อความขณะโหลด
        modelStatus.innerHTML = '<p>Loading model...</p>';

        // โหลดโมเดล
        model = await tf.loadGraphModel(modelPath);

        // ถ้าโหลดสำเร็จ
        modelStatus.innerHTML = '<p>Model loaded successfully!</p>';
        alert('Model loaded successfully!');  // แสดงป๊อปอัพเมื่อโมเดลโหลดสำเร็จ
    } catch (error) {
        // ถ้าเกิดข้อผิดพลาดในการโหลด
        modelStatus.innerHTML = '<p>Error loading model! Please check your model path and try again.</p>';
        console.error('Error loading model:', error);
    }
}

// ฟังก์ชันสำหรับการประมวลผลภาพ
async function analyzeImage(image) {
    if (!model) {
        alert('Model is not loaded yet!');
        return;
    }

    // แปลงภาพที่อัพโหลดเป็น Tensor
    const tensorImage = tf.browser.fromPixels(image);

    // ประมวลผลภาพ
    const prediction = await model.predict(tensorImage.expandDims(0));
    
    // แสดงผลการทำนาย
    const predictionResult = document.getElementById('prediction-result');
    predictionResult.innerHTML = `Prediction result: ${prediction}`;
}

// เมื่อโหลดหน้าเว็บ, เริ่มต้นโหลดโมเดล
window.onload = () => {
    loadModel();

    // กำหนดให้สามารถอัพโหลดไฟล์ภาพ
    const imageUpload = document.getElementById('imageUpload');
    imageUpload.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => analyzeImage(img);
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
};
