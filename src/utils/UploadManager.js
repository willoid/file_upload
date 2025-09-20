import FileChunker from './FileChunker.js';

class UploadManager {
    constructor(file, onProgress, onComplete, onError) {
        this.file = file;
        this.onProgress = onProgress;
        this.onComplete = onComplete;
        this.onError = onError;
        this.chunker = new FileChunker(file, 1024 * 1024); // 1MB chunks
        this.uploadedChunks = 0;
        this.uploadedBytes = 0;
        this.aborted = false;
        this.currentXhr = null;

        console.log('🚀 Upload Manager Initialized');
        console.log(`📁 File: ${file.name}`);
        console.log(`📊 Total size: ${(file.size / (1024 * 1024)).toFixed(2)} MB`);
        console.log(`🔪 Chunk size: 1 MB`);
        console.log(`📦 Total chunks: ${this.chunker.totalChunks}`);
        console.log('═══════════════════════════════════════');
    }

    async upload(url) {
        const metadata = this.chunker.getMetadata();

        for (let i = 0; i < this.chunker.totalChunks; i++) {
            if (this.aborted) {
                console.log('❌ Upload aborted');
                break;
            }

            try {
                console.log(`\n📤 Uploading chunk ${i + 1}/${this.chunker.totalChunks}...`);

                const chunk = this.chunker.getChunk(i);
                const chunkStart = i * this.chunker.chunkSize;
                const chunkEnd = Math.min(chunkStart + this.chunker.chunkSize, this.file.size);

                console.log(`   Range: [${chunkStart.toLocaleString()} - ${chunkEnd.toLocaleString()}]`);
                console.log(`   Size: ${(chunk.size / 1024).toFixed(2)} KB`);

                await this.uploadChunk(chunk, i, metadata, url);

                this.uploadedChunks++;
                this.uploadedBytes += chunk.size;

                // Calculate overall progress
                const overallProgress = ((i + 1) / this.chunker.totalChunks) * 100;

                console.log(`✅ Chunk ${i + 1} uploaded successfully`);
                console.log(`   Progress: ${overallProgress.toFixed(1)}%`);
                console.log(`   Uploaded: ${(this.uploadedBytes / (1024 * 1024)).toFixed(2)} MB / ${(this.file.size / (1024 * 1024)).toFixed(2)} MB`);

                // Call progress callback with overall progress
                this.onProgress(overallProgress, this.uploadedBytes, this.file.size);

            } catch (error) {
                console.error(`❌ Failed to upload chunk ${i + 1}:`, error);
                this.onError(`Failed to upload chunk ${i + 1}: ${error}`);
                return;
            }
        }

        if (!this.aborted) {
            console.log('\n🎉 All chunks uploaded successfully!');
            console.log('═══════════════════════════════════════\n');
            this.onComplete({
                message: 'Upload successful',
                filename: this.file.name,
                size: this.file.size,
                chunks: this.chunker.totalChunks
            });
        }
    }

    uploadChunk(chunk, chunkIndex, metadata, url) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            this.currentXhr = xhr;

            const startTime = Date.now();

            // Track chunk upload progress
            xhr.upload.addEventListener('progress', (e) => {
                if (e.lengthComputable) {
                    const chunkProgress = (e.loaded / e.total) * 100;
                    const totalProgress = ((chunkIndex + (e.loaded / e.total)) / this.chunker.totalChunks) * 100;

                    console.log(`   Chunk ${chunkIndex + 1} progress: ${chunkProgress.toFixed(1)}% (${(e.loaded / 1024).toFixed(0)} KB / ${(e.total / 1024).toFixed(0)} KB)`);

                    // Update overall progress including partial chunk progress
                    const overallBytes = (chunkIndex * this.chunker.chunkSize) + e.loaded;
                    this.onProgress(totalProgress, overallBytes, this.file.size);
                }
            });

            // Handle completion
            xhr.addEventListener('load', () => {
                const uploadTime = ((Date.now() - startTime) / 1000).toFixed(2);

                if (xhr.status === 200) {
                    console.log(`   Upload time: ${uploadTime}s`);
                    console.log(`   Server response:`, JSON.parse(xhr.responseText));
                    resolve(JSON.parse(xhr.responseText));
                } else {
                    reject(`HTTP ${xhr.status}: ${xhr.statusText}`);
                }
            });

            // Handle errors
            xhr.addEventListener('error', () => {
                reject('Network error');
            });

            // Handle abort
            xhr.addEventListener('abort', () => {
                reject('Upload cancelled');
            });

            // Prepare chunk data
            const formData = new FormData();
            formData.append('file', chunk, `${metadata.fileName}.part${chunkIndex}`);
            formData.append('chunkIndex', chunkIndex);
            formData.append('totalChunks', metadata.totalChunks);
            formData.append('fileName', metadata.fileName);
            formData.append('fileType', metadata.fileType);
            formData.append('fileSize', metadata.fileSize);
            formData.append('timestamp', Date.now());

            xhr.open('POST', url);

            // Optional: Add custom headers for chunk info
            xhr.setRequestHeader('X-Chunk-Index', chunkIndex);
            xhr.setRequestHeader('X-Total-Chunks', metadata.totalChunks);
            xhr.setRequestHeader('X-File-Name', metadata.fileName);

            xhr.send(formData);
        });
    }

    cancel() {
        this.aborted = true;
        if (this.currentXhr) {
            this.currentXhr.abort();
            console.log('🛑 Upload cancelled by user');
            this.onError('Upload cancelled');
        }
    }
}

export default UploadManager;