const video = document.getElementById("video");
const captureBtn = document.getElementById("capture");
const canvas = document.getElementById("canvas");
const result = document.getElementById("result");

let processing = false; // Prevent multiple simultaneous requests
let detectedStudent = null; // Track last detected status

// Access webcam
navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => { video.srcObject = stream; })
    .catch(error => { console.error("Error accessing webcam:", error); });

// Function to check if a face is detected (without marking attendance)
async function checkFace() {
    if (processing) return; // Skip if already processing
    processing = true;

    const context = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(async (blob) => {
        const formData = new FormData();
        formData.append("image", blob, "frame.jpg");

        try {
            const response = await fetch("http://127.0.0.1:5000/recognize", {
                method: "POST",
                body: formData
            });

            const data = await response.json();
            const isRecognized = data.status === "success";

            // Only update message if status has changed (Prevents screen flicker)
            if (isRecognized !== detectedStudent) {
                detectedStudent = isRecognized;

                if (isRecognized) {
                    result.innerHTML = "✅ Face Recognized! Click 'Mark Attendance'";
                    result.classList.add("identified");
                    result.classList.remove("not-identified");
                } else {
                    result.innerHTML = "⚠️ Student Not Identified!";
                    result.classList.add("not-identified");
                    result.classList.remove("identified");
                }
            }

        } catch (error) {
            console.error("Error recognizing face:", error);
        } finally {
            processing = false; // Allow next request
        }
    }, "image/jpeg");
}

// Check for a face every 2 seconds (but do NOT mark attendance)
setInterval(checkFace, 10000);

// Capture and mark attendance when button is clicked
captureBtn.addEventListener("click", async () => {
    if (!detectedStudent) {
        result.innerHTML = "❌ No recognized student to mark attendance!";
        result.classList.add("not-identified");
        return; // Stop execution if no recognized face
    }

    captureBtn.disabled = true; // Disable button while processing

    const context = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(async (blob) => {
        const formData = new FormData();
        formData.append("image", blob, "capture.jpg");

        try {
            const response = await fetch("http://127.0.0.1:5000/recognize", {
                method: "POST",
                body: formData
            });

            const data = await response.json();

            if (data.status === "success") {
                result.innerHTML = `✅ Attendance marked for ${data.name}`;
                result.classList.add("marked");
            } else {
                result.innerHTML = "⚠️ Student Not Identified! Attendance not marked.";
                result.classList.add("not-identified");
            }
        } catch (error) {
            console.error("Error marking attendance:", error);
        } finally {
            captureBtn.disabled = false; // Re-enable button after processing
        }
    }, "image/jpeg");
});
