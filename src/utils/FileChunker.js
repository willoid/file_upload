class FileChunker {
    constructor(file, chunkSize = 1024 * 1024) {
        this.file = file,
        this.chunkSize = chunkSize;
        this.totalChunks = Math.ceil(file.size / chunkSize);
    }

    getChunk(index) {
        const start = index * this.chunkSize;
        const end = Math.min(start + this.chunkSize, this.file.size);
        return this.file.slice(start, end);
    }

    async getChunkAsBase64(index) {
        const chunk = this.getChunk(index);
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result.split(',')[1]);
            reader.readAsDataURL(chunk);
        });
    }

    getMetadata() {
        return {
            fileName: this.file.name,
            fileType: this.file.type,
            fileSize: this.file.size,
            totalChunks: this.totalChunks,
            chunkSize: this.chunkSize
        };
    }
}

export default FileChunker;