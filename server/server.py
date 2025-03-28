from flask import Flask, request, jsonify  
from PIL import Image  
import numpy as np  
import tensorflow as tf  
import os  
import cv2  # OpenCV for image processing
from flask_cors import CORS  # 🚀 Import CORS

app = Flask(__name__)  
CORS(app)  # 🔥 Enable CORS for all routes

# Load the trained model
MODEL_PATH = "./models/skin_disease_model3.h5"  
model = tf.keras.models.load_model(MODEL_PATH)  

# List of disease classes
class_names = [
    "Eczema", "Melanoma", "Atopic Dermatitis",
    "Basal Cell Carcinoma (BCC)", "Melanocytic Nevi (NV)",
    "Benign Keratosis-like Lesions (BKL)",
    "Psoriasis pictures Lichen Planus and related diseases",
    "Seborrheic Keratoses and other Benign Tumors",
    "Tinea Ringworm Candidiasis and other Fungal Infections",
    "Warts Molluscum and other Viral Infections"
]  

# 🔥 Preprocessing Function
def preprocess_image(image):  
    """ Preprocess image to match Kaggle training steps """
    img = np.array(image)  # Convert PIL image to numpy array  
    img_gray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)  # Convert to grayscale  
    img_resized = cv2.resize(img_gray, (100, 100))  # Resize to match training size  
    img_normalized = img_resized / 255.0  # Normalize pixel values  
    img_array = np.expand_dims(img_normalized, axis=(0, -1))  # Expand dimensions  
    return img_array  


# 🔥 Prediction Route
@app.route('/predict', methods=['POST'])  
def predict():  
    try:
        # Validate if image is uploaded
        if 'image' not in request.files:  
            return jsonify({'error': 'No image uploaded'}), 400  

        # Load image
        file = request.files['image']  
        img = Image.open(file)  
        img_array = preprocess_image(img)  

        # 🔥 Model Prediction
        prediction = model.predict(img_array)[0]  # Extract first row

        # ✅ Ensure model output shape matches class count
        if len(prediction) != len(class_names):
            return jsonify({'error': 'Model output size does not match class count'}), 500

        # ✅ Create a list of all predictions with confidence scores
        predictions = [
            {
                'disease': class_names[i],
                'confidence': f"{prediction[i] * 100:.2f}%"
            }
            for i in range(len(class_names))
        ]

        # ✅ Sort by confidence (highest first)
        predictions.sort(key=lambda x: float(x['confidence'].replace('%', '')), reverse=True)

        # ✅ Get the top prediction
        top_prediction = predictions[0]

        # ✅ Format the Result
        result = {
            'top_prediction': top_prediction,
            'all_predictions': predictions
        }

        return jsonify(result)

    except Exception as e:
        return jsonify({'error': str(e)}), 500  


# 🔥 Start the Flask Server
if __name__ == '__main__':  
    app.run(debug=True)
