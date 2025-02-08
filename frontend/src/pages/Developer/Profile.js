import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaCheck, FaTimes, FaPlus, FaTrash, FaUpload } from "react-icons/fa";
import "../../assets/css/Developer/Profile.css"; // Import styles
import Header from "../../components/Header";
const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState("");
  const developerId = localStorage.getItem("developerId"); 

  // Fetch developer profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/developer/profile", {
          headers: { "developer-id": developerId },
        });
        setProfile(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, [developerId]);

  const fetchProfile = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/developer/profile", {
        headers: { "developer-id": developerId },
      });
      setProfile(response.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };


  // Handle edit button click (single field edit)
  const handleEdit = (field, value) => {
    setEditingField(field);
    setTempValue(value || "");
    fetchProfile();
  };

  // Handle save update
  const handleSave = async () => {
    try {
      const updatedData = { [editingField]: tempValue };
      console.log("Updating profile with:", updatedData);
      const response  = await axios.put("http://localhost:5000/api/developer/profile", updatedData, {
        headers: { "developer-id": developerId },
      });
      console.log("Profile updated successfully:", response.data);
      setProfile((prev) => ({ ...prev, [editingField]: tempValue }));
      setEditingField(null);
      fetchProfile();
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  // Handle cancel edit
  const handleCancel = () => {
    setEditingField(null);
    setTempValue("");
    fetchProfile();
  };

  // Handle array updates (adding items)
  const handleAddToList = async (field, newValue) => {
    if (!newValue.trim()) return;
    try {
      const updatedProfile = { ...profile };

      const fieldPath = field.split(".");
      let listRef = updatedProfile;

      for (let i = 0; i < fieldPath.length - 1; i++) {
        listRef = listRef[fieldPath[i]];
        if (!listRef) {
          console.error(`Error: Field ${field} does not exist.`);
          return;
        }
      }

      const arrayKey = fieldPath[fieldPath.length - 1];

      if (!Array.isArray(listRef[arrayKey])) {
        console.error(`Error: ${field} is not an array.`);
        return;
      }
  
      listRef[arrayKey] = [...listRef[arrayKey], newValue]; 

      const updateData = {};
      updateData[field] = listRef[arrayKey];
  
      await axios.put("http://localhost:5000/api/developer/profile", updateData, {
        headers: { "developer-id": developerId },
      });

      fetchProfile();
  
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };
  

  // Handle array updates (removing items)
  const handleRemoveFromList = async (field, index) => {
    try {
      const updatedProfile = { ...profile };

      const fieldPath = field.split(".");
      let listRef = updatedProfile; 

      for (let i = 0; i < fieldPath.length - 1; i++) {
        listRef = listRef[fieldPath[i]];
        if (!listRef) {
          console.error(`Error: Field ${field} does not exist.`);
          return;
        }
      }

      const arrayKey = fieldPath[fieldPath.length - 1];
  
      if (!Array.isArray(listRef[arrayKey])) {
        console.error(`Error: ${field} is not an array.`);
        return;
      }
  
      listRef[arrayKey] = listRef[arrayKey].filter((_, i) => i !== index);

      const updateData = {};
      updateData[field] = listRef[arrayKey]; 

      await axios.put("http://localhost:5000/api/developer/profile", updateData, {
        headers: { "developer-id": developerId },
      });

      fetchProfile();
  
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };
  
// Handle Profile Photo Upload
const handleProfilePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profilePhoto", file);

    try {
      const response = await axios.put("http://localhost:5000/api/developer/profile", formData, {
        headers: { "developer-id": developerId, "Content-Type": "multipart/form-data" },
      });
      setProfile((prev) => ({ ...prev, profilePhoto: response.data.profilePhoto }));
      fetchProfile();
    } catch (error) {
      console.error("Error uploading profile photo:", error);
    }
  };
  
  if (!profile) return(
    <div>
        <div>
            <Header/>
        </div>
        <div className="loading">Loading Profile...</div>
    </div>
  );

  // Add a new work experience
  const handleAddExperience = async (newExperience) => {
    try {
      const updatedData = {
        workExperience: [...(profile.workExperience || []), newExperience],
      };
      await axios.put("http://localhost:5000/api/developer/profile", updatedData, {
        headers: { "developer-id": developerId },
      });
      fetchProfile();
    } catch (error) {
      console.error("Error adding experience:", error);
    }
  };

  // Remove work experience
  const handleRemoveExperience = async (index) => {
    try {
      const updatedData = {
        workExperience: profile.workExperience.filter((_, i) => i !== index),
      };
      await axios.put("http://localhost:5000/api/developer/profile", updatedData, {
        headers: { "developer-id": developerId },
      });
      fetchProfile();
    } catch (error) {
      console.error("Error removing experience:", error);
    }
  };
   

  return (
    <div>
        <div>
            <Header/>
        </div>
        <div className="profile-container">
          <h2 className="profile-heading">My Profile</h2>

            {/* 🔹 Profile Photo */}
            <div className="profile-photo-container">
              <strong>Profile Photo:</strong>
              <input type="file" accept="image/*" onChange={handleProfilePhotoUpload} />
              {profile.profilePhoto && <img src={profile.profilePhoto} alt="Profile" className="profile-photo" />}
              <FaUpload className="upload-icon" />
            </div>
          <div className="profile-section">


            <ProfileField
              label="Full Name"
              value={profile.fullName}
              field="fullName"
              editingField={editingField}
              tempValue={tempValue}
              onEdit={handleEdit}
              onChange={(e) => setTempValue(e.target.value)}
              onSave={handleSave}
              onCancel={handleCancel}
            />
            <ProfileField
              label="Bio"
              value={profile.bio}
              field="bio"
              editingField={editingField}
              tempValue={tempValue}
              onEdit={handleEdit}
              onChange={(e) => setTempValue(e.target.value)}
              onSave={handleSave}
              onCancel={handleCancel}
            />
            <ProfileField
              label="Location"
              value={profile.location}
              field="location"
              editingField={editingField}
              tempValue={tempValue}
              onEdit={handleEdit}
              onChange={(e) => setTempValue(e.target.value)}
              onSave={handleSave}
              onCancel={handleCancel}
            />

            <ProfileField
                label="College"
                value={profile.education?.college}
                field="education.college"
                editingField={editingField}
                tempValue={tempValue}
                onEdit={handleEdit}
                onChange={(e) => setTempValue(e.target.value)}
                onSave={handleSave}
                onCancel={handleCancel}
            />

            <ProfileField
                label="Degree"
                value={profile.education?.degree}
                field="education.degree"
                editingField={editingField}
                tempValue={tempValue}
                onEdit={handleEdit}
                onChange={(e) => setTempValue(e.target.value)}
                onSave={handleSave}
                onCancel={handleCancel}
            />

            
            <ProfileField
                label="Graduation year"
                value={profile.education?.graduationYear}
                field="education.graduationYear"
                editingField={editingField}
                tempValue={tempValue}
                onEdit={handleEdit}
                onChange={(e) => setTempValue(e.target.value)}
                onSave={handleSave}
                onCancel={handleCancel}
            />  



            <ProfileField
              label="LinkedIn"
              value={profile.linkedIn}
              field="linkedIn"
              editingField={editingField}
              tempValue={tempValue}
              onEdit={handleEdit}
              onChange={(e) => setTempValue(e.target.value)}
              onSave={handleSave}
              onCancel={handleCancel}
            />
            <ProfileField
              label="GitHub"
              value={profile.github}
              field="github"
              editingField={editingField}
              tempValue={tempValue}
              onEdit={handleEdit}
              onChange={(e) => setTempValue(e.target.value)}
              onSave={handleSave}
              onCancel={handleCancel}
            />
            <ProfileField
                label="Portfolio"
                value={profile.portfolio}
                field="portfolio"
                editingField={editingField}
                tempValue={tempValue}
                onEdit={handleEdit}
                onChange={(e) => setTempValue(e.target.value)}
                onSave={handleSave}
                onCancel={handleCancel}
            />
            <ProfileField
                label="Current Job"
                value={profile.professionalDetails?.currentJob}
                field="professionalDetails.currentJob"
                editingField={editingField}
                tempValue={tempValue}
                onEdit={handleEdit}
                onChange={(e) => setTempValue(e.target.value)}
                onSave={handleSave}
                onCancel={handleCancel}
            />

            <ProfileField
                label="Years of Experience"
                value={profile.professionalDetails?.yearsOfExperience}
                field="professionalDetails.yearsOfExperience"
                editingField={editingField}
                tempValue={tempValue}
                onEdit={handleEdit}
                onChange={(e) => setTempValue(e.target.value)}
                onSave={handleSave}
                onCancel={handleCancel}
            />

            {profile.workExperience.length > 0 ? (
                profile.workExperience.map((exp, index) => (
                  <div key={index} className="work-experience">
                    <strong>{exp.company}</strong> - {exp.jobTitle}
                    <p>
                      {new Date(exp.startDate).toLocaleDateString()} -{" "}
                      {exp.endDate ? new Date(exp.endDate).toLocaleDateString() : "Present"}
                    </p>
                    <ul>
                      {exp.responsibilities.map((res, i) => (
                        <li key={i}>{res}</li>
                      ))}
                    </ul>
                    <FaTrash className="delete-icon" onClick={() => handleRemoveExperience(index)} />
                  </div>
                ))
                ) : (
                  <p>No work experience added yet.</p>
            )}

            {/* 🔹 Add Work Experience Form */}
            <AddExperienceForm onAddExperience={handleAddExperience} />
            
            <ProfileDropdown
                label="Work Mode"
                field="workMode"
                value={profile.workMode}
                options={["Remote", "Hybrid", "Onsite"]}
                editingField={editingField}
                tempValue={tempValue}
                onEdit={handleEdit}
                onChange={(e) => setTempValue(e.target.value)}
                onSave={handleSave}
                onCancel={handleCancel}
            />
            <ProfileList label="Preferred Work Locations" field="preferredLocations" values={profile.preferredLocations || []} onAdd={handleAddToList} onRemove={handleRemoveFromList} />
            <ProfileList label="Programming Languages I know" field="languagesPreferred" values={profile.languagesPreferred || []} onAdd={handleAddToList} onRemove={handleRemoveFromList} />
            <ProfileField
                label="Expected Stipend in LPA"
                field="expectedStipend"
                value={profile.expectedStipend}
                editingField={editingField}
                tempValue={tempValue}
                onEdit={handleEdit}
                onChange={(e) => setTempValue(e.target.value)}
                onSave={handleSave}
                onCancel={handleCancel}
            />
            {/* Multi-Value Fields */}
            <ProfileList label="Skills" field="professionalDetails.skills" values={profile.professionalDetails?.skills || []} onAdd={handleAddToList} onRemove={handleRemoveFromList} />
            <ProfileList label="Job Roles Interested" field="professionalDetails.jobRolesInterested" values={profile.professionalDetails?.jobRolesInterested || []} onAdd={handleAddToList} onRemove={handleRemoveFromList} />
            <ProfileList label="Certifications" field="additionalInfo.certifications" values={profile.additionalInfo?.certifications || []} onAdd={handleAddToList} onRemove={handleRemoveFromList} />
            <ProfileList label="Achievements" field="additionalInfo.achievements" values={profile.additionalInfo?.achievements || []} onAdd={handleAddToList} onRemove={handleRemoveFromList} />
            <ProfileList label="Languages" field="additionalInfo.languages" values={profile.additionalInfo?.languages || []} onAdd={handleAddToList} onRemove={handleRemoveFromList} />
          </div>
        </div>
    </div>
    
  );
};

// Reusable field component
const ProfileField = ({ label, value, field, editingField, tempValue, onEdit, onChange, onSave, onCancel }) => {
  return (
    <div className="profile-field">
      <strong>{label}:</strong>
      {editingField === field ? (
        <span className="edit-mode">
          <input type="text" value={tempValue} onChange={onChange} autoFocus />
          <FaCheck className="save-icon" onClick={onSave} />
          <FaTimes className="cancel-icon" onClick={onCancel} />
        </span>
      ) : (
        <span className="field-value">
          {value || "Not Provided"}
          <FaEdit className="edit-icon" onClick={() => onEdit(field, value)} />
        </span>
      )}
    </div>
  );
};

// Reusable dropdown component
const ProfileDropdown = ({ label, field, value, options, editingField, tempValue, onEdit, onChange, onSave, onCancel }) => {
    return (
      <div className="profile-field">
        <strong>{label}:</strong>
        {editingField === field ? (
          <span className="edit-mode">
            <select value={tempValue} onChange={onChange}>
                {options.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
                ))}
            </select>
            <FaCheck className="save-icon" onClick={onSave} />
            <FaTimes className="cancel-icon" onClick={onCancel} />
          </span>
        ) : (
          <span className="field-value">
            {value || "Not Provided"}
            <FaEdit className="edit-icon" onClick={() => onEdit(field, value)} />
          </span>
        )}
      </div>
    );
};

// ProfileList Component (Handles Skills, Certifications, etc.)
const ProfileList = ({ label, field, values, onAdd, onRemove }) => {
  const [newItem, setNewItem] = useState("");

  return (
    <div className="profile-field">
      <strong>{label}:</strong>
      <ul className="list-container">
        {values.length > 0 ? values.map((item, index) => (
          <li key={index} className="list-item">
            {item} <FaTrash className="delete-icon" onClick={() => onRemove(field, index)} />
          </li>
        )) : <span>Not Provided</span>}
      </ul>
      <div className="add-item">
        <input type="text" value={newItem} onChange={(e) => setNewItem(e.target.value)} placeholder="Add new item" />
        <FaPlus className="add-icon" onClick={() => { onAdd(field, newItem); setNewItem(""); }} />
      </div>
    </div>
  );
};


// Work Experience Form Component
const AddExperienceForm = ({ onAddExperience }) => {
    const [newExperience, setNewExperience] = useState({
      company: "",
      jobTitle: "",
      startDate: "",
      endDate: "",
      responsibilities: [],
    });
    const [newResponsibility, setNewResponsibility] = useState("");
  
    const handleChange = (e) => {
      setNewExperience({ ...newExperience, [e.target.name]: e.target.value });
    };
  
    const handleAddResponsibility = () => {
      if (newResponsibility.trim()) {
        setNewExperience((prev) => ({
          ...prev,
          responsibilities: [...prev.responsibilities, newResponsibility],
        }));
        setNewResponsibility("");
      }
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      if (newExperience.company && newExperience.jobTitle && newExperience.startDate) {
        onAddExperience(newExperience);
        setNewExperience({
          company: "",
          jobTitle: "",
          startDate: "",
          endDate: "",
          responsibilities: [],
        });
      }
    };
  
    return (
      <div className="add-experience">
        <h4>Add Work Experience</h4>
        <form onSubmit={handleSubmit}>
          <input type="text" name="company" placeholder="Company" value={newExperience.company} onChange={handleChange} required />
          <input type="text" name="jobTitle" placeholder="Job Title" value={newExperience.jobTitle} onChange={handleChange} required />
          <input type="date" name="startDate" placeholder="Start Date" value={newExperience.startDate} onChange={handleChange} required />
          <input type="date" name="endDate" placeholder="End Date (optional)" value={newExperience.endDate} onChange={handleChange} />
          
          {/* 🔹 Responsibilities Input */}
          <div className="responsibilities">
            <input type="text" placeholder="Add Responsibility" value={newResponsibility} onChange={(e) => setNewResponsibility(e.target.value)} />
            <FaPlus className="add-icon" onClick={handleAddResponsibility} />
          </div>
  
          <ul className="responsibility-list">
            {newExperience.responsibilities.map((res, i) => (
              <li key={i}>{res}</li>
            ))}
          </ul>
  
          <button type="submit">Add Experience</button>
        </form>
      </div>
    );
  };
  

export default Profile;
