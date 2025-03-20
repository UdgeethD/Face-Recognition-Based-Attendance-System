import cv2
import face_recognition
import pandas as pd
import datetime
import os
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

KNOWN_FACES_DIR = "/Users/udgeethdeglurkar/Documents/face recog/known_faces"
ATTENDANCE_FILE = "/Users/udgeethdeglurkar/Documents/face recog/attendance.xlsx"

known_face_encodings = []
known_face_names = []

# Load known faces
def load_known_faces():
    global known_face_encodings, known_face_names
    known_face_encodings = []
    known_face_names = []

    for filename in os.listdir(KNOWN_FACES_DIR):
        if filename.startswith("."):  
            continue

        image_path = os.path.join(KNOWN_FACES_DIR, filename)
        
        try:
            image = face_recognition.load_image_file(image_path)
            encodings = face_recognition.face_encodings(image)
            
            if encodings:  # Ensure at least one face is detected
                known_face_encodings.append(encodings[0])
                known_face_names.append(os.path.splitext(filename)[0])  # Use filename as name

        except Exception as e:
            print(f"Error loading {filename}: {e}")

# Load known faces at startup
load_known_faces()

# Ensure attendance file exists
if not os.path.exists(ATTENDANCE_FILE):
    pd.DataFrame(columns=["Name", "PRN", "Timestamp"]).to_excel(ATTENDANCE_FILE, index=False)

@app.route('/recognize', methods=['POST'])
def recognize_face():
    file = request.files['image']
    image_path = "temp.jpg"
    file.save(image_path)

    # Load the captured image
    image = face_recognition.load_image_file(image_path)
    face_encodings = face_recognition.face_encodings(image)

    if not face_encodings:
        return jsonify({"status": "error", "message": "No face detected"}), 400

    face_encoding = face_encodings[0]  # Assume only one face is detected
    matches = face_recognition.compare_faces(known_face_encodings, face_encoding, tolerance=0.5)
    name = "Unknown"
    prn = "N/A"

    if True in matches:
        match_index = matches.index(True)
        name = known_face_names[match_index]

        # Extract PRN from filename if format is "Name_PRN.jpg"
        if "_" in name:
            name, prn = name.split("_")

        # Log attendance
        timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        df = pd.read_excel(ATTENDANCE_FILE)
        new_entry = pd.DataFrame([[name, prn, timestamp]], columns=["Name", "PRN", "Timestamp"])
        df = pd.concat([df, new_entry], ignore_index=True)
        df.to_excel(ATTENDANCE_FILE, index=False)

        return jsonify({"status": "success", "name": name, "prn": prn, "message": "Attendance marked"})

    return jsonify({"status": "error", "message": "Face not recognized"}), 400

if __name__ == '__main__':
    app.run(debug=True)
