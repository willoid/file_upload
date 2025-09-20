import { useState } from 'react';
import DropZone from './components/DropZone';
import FilePreview from './components/FilePreview';
import UploadManager from './utils/UploadManager';

function App() {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploadStatus, setUploadStatus] = useState({});

    const handleFilesSelected = (files) => {
        // TODO: Add files to selectedFiles array

        // TODO: For each file:
        // 1. Create new UploadManager with callbacks:
        //    - onProgress: Update uploadStatus with progress/loaded/total
        //    - onComplete: Update uploadStatus with status: 'complete'
        //    - onError: Update uploadStatus with status: 'error'
        // 2. Call manager.upload('http://localhost:5000/upload')
    };

    return (
        <div style={{ maxWidth: '600px', margin: '20px auto' }}>
            <h1>File Upload System</h1>

            <DropZone onFilesSelected={handleFilesSelected} />

            {selectedFiles.length > 0 && (
                <div style={{ marginTop: '20px' }}>
                    <h2>Files ({selectedFiles.length})</h2>
                    {selectedFiles.map((file, index) => (
                        <FilePreview key={index} file={file} />
                    ))}
                </div>
            )}

            {Object.keys(uploadStatus).length > 0 && (
                <div style={{ marginTop: '20px' }}>
                    <h2>Upload Status</h2>
                    {Object.entries(uploadStatus).map(([fileName, status]) => (
                        <div key={fileName} style={{
                            padding: '10px',
                            marginBottom: '5px',
                            background: '#f0f0f0',
                            borderRadius: '4px'
                        }}>
                            <div>{fileName}</div>
                            <div style={{
                                width: '100%',
                                height: '20px',
                                background: '#ddd',
                                borderRadius: '10px',
                                overflow: 'hidden',
                                marginTop: '5px'
                            }}>
                                <div style={{
                                    width: `${status.progress || 0}%`,
                                    height: '100%',
                                    background: status.status === 'error' ? 'red' :
                                        status.status === 'complete' ? 'green' : 'blue',
                                    transition: 'width 0.3s'
                                }}/>
                            </div>
                            <div style={{ fontSize: '12px', marginTop: '5px' }}>
                                {status.status === 'complete' && '✓ Complete'}
                                {status.status === 'error' && '✗ Failed'}
                                {!status.status && `${(status.progress || 0).toFixed(1)}%`}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default App;
