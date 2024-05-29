import { useState } from "react";
import PropTypes from 'prop-types'

const ImageView = ({ imageUrl, defaultImageUrl }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
  
    const handleImageLoad = () => {
      setImageLoaded(true);
    };
  
    const handleImageError = () => {
      setImageLoaded(false);
    };
  
    return (
      <div>
        {imageLoaded ? (
          <img src={imageUrl} alt="Loaded" onLoad={handleImageLoad} onError={handleImageError} />
        ) : (
          <img src={defaultImageUrl} alt="Default" />
        )}
      </div>
    );
  };

  Image.propTypes = {
    imageUrl: PropTypes.string.isRequired,
    defaultImageUrl: PropTypes.string.isRequired
  }

  export default ImageView
  