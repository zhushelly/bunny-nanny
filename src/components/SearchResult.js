import React from 'react';
import './styles/SearchResult.css';

const SearchResult = () => {
    return (
        <div className="container">
            <div className="search-filters">
                <h2>How many pets?</h2>
                <div>1 dog, 0 puppies, 0 cats</div>

                <h2>Service type</h2>
                <div>Boarding in the sitter's home</div>

                <h2>Boarding near</h2>
                <div>1041 Bentoak Lane, San Jose, CA, USA</div>

                <h2>Dates</h2>
                <div>07/24/2024 - 07/29/2024</div>

                <h2>Dog size (lbs)</h2>
                <div>0-15</div>
            </div>
            <div className="sitters-list">
                <div className="sitter">
                    <img src="einat.jpg" alt="Einat A." className="sitter-image" />
                    <div className="sitter-details">
                        <h3>Einat A.</h3>
                        <p>Saratoga, CA, 95070</p>
                        <p>$84/night including fees</p>
                        <p>★ 5.0 • 4 reviews • 1 repeat client</p>
                        <p>"Einat took great care of Nugget for a week when we travelled to Alaska. She kept sending us regular updates with pictures; it gave us peace of mind and we could enjoy..."</p>
                    </div>
                </div>
                <div className="sitter">
                    <img src="diana.jpg" alt="Diana M." className="sitter-image" />
                    <div className="sitter-details">
                        <h3>Diana M.</h3>
                        <p>West San Jose, San Jose, CA, 95117</p>
                        <p>$84/night including fees</p>
                        <p>★ 5.0 • 7 reviews • 1 repeat client</p>
                        <p>"Thank you for tirelessly taking care of Bokhee. Your family really treated her like family. Also thank you so much for accepting the last minute request to take care of..."</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SearchResult;
