import axios from "axios";
import React, { useState, useEffect } from "react";

const Card = props => {
  const { imgSource, imgDesc, className, onClick } = props;
  const [sprite, setSprite] = useState('');

  useEffect(() => {
    if(imgSource) {
      axios.get(imgSource).then(response => {
        setSprite(response.data.sprites.front_default)
      }).catch(error => console.log(error))
    }

  }, [imgSource])

  return (
    <div className={`grid-card ${className}`} onClick={onClick}>
      <img
        className={`img-thumbnail img-fluid grid-img`}
        src={sprite}
        alt={imgDesc}
      />
    </div>
  );
};

export default Card;
