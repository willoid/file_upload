import { useState, useEffect } from 'react';

function FilePreview({ file }) {
    const [preview, setPreview] = useState(null);
    const isImage = file.type.startsWith('image/');

    useEffect(() => {
        if (!isImage) return;

        // TODO: YOU IMPLEMENT THIS
        // If file.size < 2MB (2 * 1024 * 1024):
        //   - Use FileReader
        //   - Call readAsDataURL
        //   - Set preview to the result
        // Else:
        //   - Use URL.createObjectURL(file)
        //   - IMPORTANT: Return cleanup function that calls URL.revokeObjectURL

    }, [file]);

    const formatSize = (bytes) => {
        // TODO: YOU IMPLEMENT THIS
        // Return formatted string:
        // < 1024: "X B"
        // < 1024*1024: "X.X KB"
        // else: "X.X MB"
    };

    return (
        <div style={{
            padding: '10px',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            marginBottom: '10px',
            display: 'flex',
            alignItems: 'center'
        }}>
            {isImage && preview && (
                <img
                    src={preview}
                    alt={file.name}
                    style={{
                        width: '50px',
                        height: '50px',
                        objectFit: 'cover',
                        marginRight: '10px'
                    }}
                />
            )}
            <div>
                <div>{file.name}</div>
                <div style={{ fontSize: '12px', color: '#666' }}>
                    {formatSize(file.size)}
                </div>
            </div>
        </div>
    );
}

export default FilePreview;
