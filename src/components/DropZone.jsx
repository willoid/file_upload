import {useState} from 'react'

function DropZone({onFilesSelected}) {
    const [isDragging, setIsDragging] = useState(false);
    const [dragCounter, setDragCounter] = useState(0);

    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragCounter(prev => prev + 1);
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragCounter(prev => {
            const newCounter = prev - 1;
            if (newCounter === 0) {
                setIsDragging(false);
            }
            return newCounter;
        });
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        setDragCounter(0);

        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            onFilesSelected(files);
        }
    };

    return (
        <div
            onDragEnter={handleDragEnter}  // ← Changed from onDragStart
            onDragLeave={handleDragLeave}  // ← Changed from onDragEnd
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            style={{
                border: isDragging ? '2px solid green' : '2px solid #ccc',
                borderRadius: '12px',
                padding: '20px',
                textAlign: 'center',
                cursor: 'pointer',
                backgroundColor: isDragging ? '#f0f8ff' : '#fff',
                transition: 'all 300ms',
            }}
            onClick={() => document.getElementById('fileInput').click()}
        >
            <input
                id="fileInput"
                type="file"
                multiple
                onChange={(e) => {
                    const files = Array.from(e.target.files);
                    onFilesSelected(files);
                }}
                style={{display: 'none'}}
            />
            <p style={{fontSize: '18px', color: '#666'}}>
                {isDragging ? 'Drop files here' : 'Drag files here or click to browse'}
            </p>
            <p style={{fontSize:'14px', color:'#718094'}}>
                support for images, documents and videos up to 100MB
            </p>
        </div>
    );
}

export default DropZone;