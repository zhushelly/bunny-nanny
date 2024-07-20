import React, { useState, useRef } from 'react';
import { db, storage } from '../firebase.js';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import './styles/NannyForm.css';
import Header from './Header.js';
import { useLoadScript, StandaloneSearchBox } from '@react-google-maps/api';

const libraries = ['places'];
const googleMapsApiKey = 'AIzaSyAtLs_X-NwhA_vTacF-oaf0DQM_RiPRirE'; // Replace with your Google Maps API key

const NannyForm = () => {
  const [formData, setFormData] = useState({
    nannyName: '',
    location: '',
    profilePhoto: null,
    mobilePhoneNumber: '',
    petCareExperience: '',
    headline: '',
  });

  const searchBoxRef = useRef(null);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'file' ? files[0] : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting form with data:', formData);

    try {
      let profilePhotoUrl = '';
      if (formData.profilePhoto) {
        const photoRef = ref(storage, `profilePhotos/${formData.profilePhoto.name}`);
        console.log('Uploading profile photo:', formData.profilePhoto.name);
        await uploadBytes(photoRef, formData.profilePhoto);
        profilePhotoUrl = await getDownloadURL(photoRef);
        console.log('Profile photo uploaded, URL:', profilePhotoUrl);
      }

      const dataToSubmit = {
        ...formData,
        profilePhoto: profilePhotoUrl
      };
      console.log('Data to submit:', dataToSubmit);

      await addDoc(collection(db, 'nanny'), dataToSubmit);
      alert('Form submitted successfully!');
      // Reset form if needed
      setFormData({
        nannyName: '',
        location: '',
        profilePhoto: null,
        mobilePhoneNumber: '',
        petCareExperience: '',
        headline: '',
      });
    } catch (error) {
      console.error('Error adding document:', error);
      alert('Error submitting form, please try again.');
    }
  };

  const { isLoaded } = useLoadScript({
    googleMapsApiKey,
    libraries,
  });

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Header />
      <h1>Become a Bunny Nanny Application Form</h1>
      <div className="nanny-form-container">
        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Your name:</label>
            <input type="text" name="nannyName" value={formData.nannyName} placeholder="Enter your name" onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Location:</label>
            <StandaloneSearchBox
              onLoad={(ref) => {
                searchBoxRef.current = ref;
              }}
              onPlacesChanged={() => {
                const places = searchBoxRef.current.getPlaces();
                if (places.length > 0) {
                  setFormData({ ...formData, location: places[0].formatted_address });
                }
              }}
            >
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter your zip code or address"
                required
              />
            </StandaloneSearchBox>
          </div>

          <div className="form-group">
            <label>Profile photo:</label>
            <input type="file" name="profilePhoto" onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Mobile phone number:</label>
            <input type="text" name="mobilePhoneNumber" value={formData.mobilePhoneNumber} placeholder="Enter your phone number" onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Pet care experience:</label>
            <input type="text" name="petCareExperience" value={formData.petCareExperience} placeholder="Please briefly describe your relevant experience" onChange={handleChange} minLength="25" required />
          </div>

          <div className="form-group">
            <label>Write an eye-catching headline:</label>
            <input type="text" name="headline" value={formData.headline} placeholder="Enter a headline that you want to show on your profile" onChange={handleChange} required />
          </div>

          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default NannyForm;
