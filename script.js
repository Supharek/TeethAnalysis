let model;

// โหลดโมเดล
async function loadModel() {
  const modelPath = './teeth_modelnew.tflite'; // Path ของโมเดล
  try {
    model = await tflite.loadModel(modelPath); // โหลดโมเดล
    console.log('Model loaded successfully!');
  } catch (error) {
    console.error('Error loading model:', error);
    alert('Error loading model! Please check your model path and try again.');
  }
}

// โหลดโมเดลเมื่อหน้าเว็บโหลดเสร็จ
window.onload = () => {
  loadModel();
};

// ฟังก์ชันสำหรับพยากรณ์ภาพ
async function predictImage() {
  const fileInput = document.getElementById('image-input');
  const file = fileInput.files[0]; // รับไฟล์จากการเลือก

  if (!file) {
    alert("No file chosen");
    document.getElementById('prediction-result').textContent = 'No file chosen';
    return;
  }

  document.getElementById('prediction-result').textContent = 'Processing...';

  try {
    const image = await loadImage(file); // โหลดภาพจากไฟล์
    const result = await model.predict(image); // ใช้โมเดลพยากรณ์
    document.getElementById('prediction-result').textContent = 'Prediction: ' + result; // แสดงผลลัพธ์
  } catch (error) {
    console.error('Prediction error:', error);
    document.getElementById('prediction-result').textContent = 'Error during prediction';
  }
}

// ฟังก์ชันสำหรับโหลดภาพจากไฟล์
function loadImage(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();
    
    reader.onload = (event) => {
      img.src = event.target.result;
    };
    
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
    
    img.onload = () => resolve(img);
  });
}

// เมื่อกดปุ่ม "วิเคราะห์"
document.getElementById('analyze-btn').addEventListener('click', predictImage);
