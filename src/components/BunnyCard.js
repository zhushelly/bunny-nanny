import React from 'react';

const BunnyCard = ({ location, image }) => {
  return (
    <div className="bunny-card">
      <img src={image} alt="Bunny" />
      <p>{location}</p>
    </div>
  );
};

export default BunnyCard;
