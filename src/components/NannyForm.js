import React, { useState } from 'react';
import { db, storage } from '../firebase.js';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import './styles/NannyForm.css';

const NannyForm = () => {
  const [formData, setFormData] = useState({
    address1: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
    profilePhoto: null,
    mobilePhoneNumber: '',
    headline: '',
    petCareExperience: '',
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'file' ? files[0] : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let profilePhotoUrl = '';
      if (formData.profilePhoto) {
        const photoRef = ref(storage, `profilePhotos/${formData.profilePhoto.name}`);
        await uploadBytes(photoRef, formData.profilePhoto);
        profilePhotoUrl = await getDownloadURL(photoRef);
      }

      const dataToSubmit = {
        ...formData,
        profilePhoto: profilePhotoUrl
      };

      await addDoc(collection(db, 'nanny'), dataToSubmit);
      alert('Form submitted successfully!');
      // Reset form if needed
      setFormData({
        address1: '',
        address2: '',
        city: '',
        state: '',
        zip: '',
        profilePhoto: null,
        mobilePhoneNumber: '',
        headline: '',
        petCareExperience: '',
      });
    } catch (error) {
      console.error('Error adding document: ', error);
      alert('Error submitting form, please try again.');
    }
  };

  return (
    <div>
      <h1>Nanny Form</h1>
      <div className="nanny-form-container">
        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Address Line 1:</label>
            <input type="text" name="address1" value={formData.address1} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Address Line 2:</label>
            <input type="text" name="address2" value={formData.address2} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>City:</label>
            <input type="text" name="city" value={formData.city} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>State or Province:</label>
            <input type="text" name="state" value={formData.state} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>ZIP/Postal Code:</label>
            <input type="text" name="zip" value={formData.zip} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Profile Photo:</label>
            <input type="file" name="profilePhoto" onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Mobile phone number:</label>
            <input type="text" name="mobilePhoneNumber" value={formData.mobilePhoneNumber} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Write an eye-catching headline:</label>
            <input type="text" name="headline" value={formData.headline} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Pet care experience:</label>
            <input type="text" name="petCareExperience" value={formData.petCareExperience} onChange={handleChange} minLength="25"/>
          </div>

          
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default NannyForm;
