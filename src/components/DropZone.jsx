import {useState, useEffect} from 'react'
import FileChunker   from "../utils/FileChunker.js";


function DropZone({onFilesSelected}) {
    const [isDragging, setIsDragging] = useState(false);

    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };
    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }
    const handleDragOver = (e) => {
        e.preventDefault();

    }
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            onFilesSelected(files);
        }

    }
    return (
        <div
            onDragStart={handleDragEnter}
            onDragEnd={handleDragLeave}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            style={{
                border: isDragging ? '2px solid green' : '2px solid #ccc',
                borderRadius: '12px',
                padding: '20px',
                textAlign: 'center',
                cursor: 'pointer',
                backgroundColor: isDragging ? '#f0f8ff' : '#fff',
                transition: isDragging ? '300ms' : '200ms',

            }}
        onClick={()=> document.getElementById(fileInput).click()}
        >
            <input id="fileInput"
                   type="file"
                   multiple
                   onChange={(e) => {
                       const files = Array.from(e.target.files);
                       onFilesSelected(files);
                   }}
                   style={{display: 'none'}}/>
            <p style={{fontSize: '18px', color: '#666'}}
            >{isDragging ? 'Drop files here' : 'Drag files here or click to browse'}</p>
            <p style={{fontSize:'14px', color:'#718094'}}>
                support for images, documents and videos up to 100MB
            </p>
        </div>
    );
}
export default DropZone;