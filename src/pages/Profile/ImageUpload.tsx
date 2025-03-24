import React, { useState, useEffect } from "react";
import styles from "./Profile.module.scss";

interface ImageUploaderProps {
    setImage: (files: FileList | null) => void;
    image: FileList | null;
    imageUrl: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ setImage, image, imageUrl }) => {
    const [uniqueKey, setUniqueKey] = useState(Date.now());
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [error, setError] = useState<boolean>(false);

    const getCacheBustedUrl = (url: string) => {
        if (url && !url.startsWith('./images/')) {
            const hasQueryParams = url.includes('?');
            const separator = hasQueryParams ? '&' : '?';
            return `${url}${separator}t=${uniqueKey}`;
        }
        return url;
    };

    useEffect(() => {
        setImagePreview(null);
        setUniqueKey(Date.now());
    }, [imageUrl]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const file = files[0];

            if (file.size > 10 * 1024 * 1024) {
                setError(true);
                setImage(null);
                setImagePreview(null);
                return;
            }

            setError(false);

            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setImagePreview(result);
                setImage(files);

                setUniqueKey(Date.now());
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className={styles.imageUploadBlock}>
            <div className={styles.imageUpload}>
                <img
                    src={imagePreview ? imagePreview : getCacheBustedUrl(imageUrl)}
                    alt="Preview"
                    style={{ maxWidth: "100%", maxHeight: "400px" }}
                    key={`preview-${uniqueKey}`}
                    onError={(e) => {
                        if (e.currentTarget.src !== './images/avatar.png') {
                            e.currentTarget.src = './images/avatar.png';
                        }
                    }}
                />

                <label>
                    <div className={styles.fon}>
                        <img src="./images/upload.png" alt="upload" />
                    </div>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        onClick={(e) => (e.target as HTMLInputElement).value = ''}
                    />
                </label>
            </div>
            {error && <p className={styles.errorText}>Размер файла не должен превышать 10 МБ.</p>}
        </div>
    );
};

export default ImageUploader;