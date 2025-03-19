const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const canvasContext = canvas.getContext('2d');
const voucher = document.getElementById('voucher');
const scanCount = document.getElementById('scanCount');
const scannedCodes = new Set();

navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } }).then(stream => {
    video.srcObject = stream;
    video.play();
    requestAnimationFrame(scan);
});

function scan() {
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.height = video.videoHeight;
        canvas.width = video.videoWidth;
        canvasContext.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvasContext.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: "dontInvert" });

        if (code) {
            if (!scannedCodes.has(code.data)) {
                scannedCodes.add(code.data);
                scanCount.textContent = `Scans: ${scannedCodes.size}/6`;
                if (scannedCodes.size === 6) {
                    video.style.display = 'none';
                    voucher.style.display = 'block';
                    video.srcObject.getTracks().forEach(track => track.stop());
                }
            }
        }
    }
    requestAnimationFrame(scan);
}
