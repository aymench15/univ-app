import React, { useEffect, useState } from 'react';
import axios from 'axios';
import noPhoto from '../assets/images/noPhoto'

const ImageLoader = ({ url }) => {
    console.log(url)
    const [imageBlob, setImageBlob] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadImage = async () => {
            try {
                const response = await axios.get(url, { responseType: 'blob' });
                const blob = new Blob([response.data]);
                setImageBlob(URL.createObjectURL(blob));
            } catch (error) {
                setError('Error fetching image.');
                console.error('Error fetching image:', error);
            }
        };

        if (url) loadImage();
    }, [url]);

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <img
            src={imageBlob} // Fallback image
            alt="Fetched from URL"
            style={{ width: '100%', height: 'auto' }}
        />
    );
};

export default ImageLoader;
