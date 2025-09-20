class UploadManager {
    constructor(file, onProgress, onComplete, onError) {
        this.file = file;
        this.onProgress = onProgress;
        this.onComplete = onComplete;
        this.onError = onError;
        this.uploadedBytes = 0;
        this.xhr = null;
    }

    upload(url) {
        this.xhr = new XMLHttpRequest();

        // Track upload progress
        this.xhr.upload.addEventListener('progress', (e) => {
            if (e.lengthComputable) {
                const percentComplete = (e.loaded / e.total) * 100;
                this.uploadedBytes = e.loaded;
                this.onProgress(percentComplete, e.loaded, e.total);
            }
        });

        // Handle completion
        this.xhr.addEventListener('load', () => {
            if (this.xhr.status === 200) {
                this.onComplete(JSON.parse(this.xhr.responseText));
            } else {
                this.onError(`Upload failed: ${this.xhr.status}`);
            }
        });

        // Handle errors
        this.xhr.addEventListener('error', () => {
            this.onError('Network error during upload');
        });

        // Prepare and send
        const formData = new FormData();
        formData.append('file', this.file);
        formData.append('timestamp', Date.now());

        this.xhr.open('POST', url);
        this.xhr.send(formData);
    }

    cancel() {
        if (this.xhr) {
            this.xhr.abort();
            this.onError('Upload cancelled');
        }
    }
}

export default UploadManager;
