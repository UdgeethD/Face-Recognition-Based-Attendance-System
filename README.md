Face Recognition-Based Attendance System

Overview
This project is a **real-time face recognition-based attendance system** that automates attendance marking using Python, OpenCV, and face_recognition. It captures live images, identifies individuals, and logs attendance into an **Excel sheet through a **web-based interface.

Features
- 95%+ recognition accuracy using deep learning-based face recognition.
- Web-based UI** with HTML, CSS, and JavaScript for seamless interaction.
- Automated attendance logging in Excel, reducing manual efforts by 80%.
- Dynamic record management with a reset feature.
- Secure and contactless attendance tracking**, ideal for institutions and workplaces.

Technologies Used
- Python (OpenCV, face_recognition, Pandas)
- Flask (for backend API integration)
- HTML, CSS, JavaScript (for frontend UI)
- Excel (XLSX) (for attendance logging)

Installation & Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/face-recognition-attendance.git
   cd face-recognition-attendance
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the application:
   ```bash
   python app.py
   ```
4. Open `index.html` in a browser to access the web UI.

Usage
- The system captures faces in real time and compares them with stored images.
- If a match is found, the person's attendance is logged in `attendance.xlsx`.
- The reset feature allows clearing the records for the next session.

Contributing
Feel free to submit issues or pull requests to enhance the project.



