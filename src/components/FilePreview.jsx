import { useState, useEffect } from 'react';

function FilePreview({ file }) {
    const [preview, setPreview] = useState(null);
    const isImage = file.type.startsWith('image/');

    useEffect(() => {
        if (!isImage) return;

        if (file.size < 2 * 1024 * 1024) {
            // Use FileReader for files smaller than 2MB
            const reader = new FileReader();

            reader.readAsDataURL(file);

            reader.onloadend = () => setPreview(reader.result)
        } else {
            // Use URL.createObjectURL for larger files
            const objectUrl = URL.createObjectURL(file);
            setPreview(objectUrl);

            // Cleanup function to revoke the object URL
            return () => {
                URL.revokeObjectURL(objectUrl);
            };
        }
    }, [file, isImage]);

    const formatSize = (bytes) => {
        if (bytes < 1024) {
            return `${bytes} B`;
        } else if (bytes < 1024 * 1024) {
            return `${(bytes / 1024).toFixed(1)} KB`;
        } else {
            return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
        }
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
