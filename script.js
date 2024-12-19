const uploadInput = document.getElementById('upload');
const previewImage = document.getElementById('preview');
const resultText = document.getElementById('result');
const checkButton = document.getElementById('check');

let model;

// โหลดโมเดล .tflite
(async () => {
    model = await tflite.loadTFLiteModel('model.tflite');
    console.log('โมเดลโหลดสำเร็จ!');
})();

// แสดงรูปที่อัพโหลดหรือถ่าย
uploadInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            previewImage.src = e.target.result;
            previewImage.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
});

// ตรวจสอบฟันด้วยโมเดล
checkButton.addEventListener('click', async () => {
    if (!previewImage.src) {
        alert('กรุณาอัพโหลดหรือถ่ายรูปก่อน!');
        return;
    }

    const img = new Image();
    img.src = previewImage.src;
    img.onload = async () => {
        const tensor = tf.browser.fromPixels(img).resizeNearestNeighbor([224, 224]).expandDims(0).toFloat();
        const prediction = model.predict(tensor);

        // แปลงผลลัพธ์โมเดล
        const isClean = prediction.dataSync()[0] > 0.5 ? 'ฟันสะอาด' : 'ฟันไม่สะอาด';
        resultText.textContent = `ผลการวิเคราะห์ฟัน: ${isClean}`;
    };
});
