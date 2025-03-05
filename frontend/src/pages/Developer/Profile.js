import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaCheck, FaTimes, FaPlus, FaTrash, FaUpload, FaUserCircle } from "react-icons/fa";
import "../../assets/css/Developer/Profile.css"; // Import styles
import Header from "../../components/Header";
const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState("");
  const [activeSection, setActiveSection] = useState("profile");
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
      console.log("Fetched Profile:", response.data);
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
        let updatedData = {};

        if (editingField.includes(".")) {
            const fieldParts = editingField.split(".");
            const parentField = fieldParts[0]; 
            const childField = fieldParts[1]; 

            if (parentField === "education") {
              updatedData[parentField] = [...(profile.education || [])]; 
              updatedData[parentField][0] = { 
                  ...updatedData[parentField][0],
                  [childField]: tempValue
              };
            }
            else if (parentField === "professionalDetails" || parentField === "additionalInfo") {
                updatedData[parentField] = {
                    ...profile[parentField], 
                    [childField]: tempValue
                };
            }
        } else {
          if (editingField.includes(".")) {
            const [parentField, childField] = editingField.split(".");
            updatedData[parentField] = {
                ...profile[parentField],
                [childField]: tempValue
            };
          } else {
              updatedData[editingField] = tempValue;
          }
        
        }

        console.log("Sending to backend:", updatedData);

        const response = await axios.put("http://localhost:5000/api/developer/profile", updatedData, {
            headers: { "developer-id": developerId },
        });

        console.log("Profile updated successfully - Updated profile received from the backend is  :", response.data);

        // Instead of merging manually, fetch latest profile from backend
        await fetchProfile();

        setEditingField(null);
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
        let updateData = {};

        // Ensure the correct array format
        if (field === "preferredLocations" || field === "languagesPreferred") {
            updateData[field] = profile[field] ? [...profile[field], newValue] : [newValue];
        } else {
            // Handle nested fields properly
            const fieldPath = field.split(".");
            let listRef = profile;

            for (let i = 0; i < fieldPath.length - 1; i++) {
                listRef = listRef[fieldPath[i]];
                if (!listRef) {
                    console.error(` Error: Field ${field} does not exist.`);
                    return;
                }
            }

            const arrayKey = fieldPath[fieldPath.length - 1];

            if (!Array.isArray(listRef[arrayKey])) {
                console.error(` Error: ${field} is not an array.`);
                return;
            }

            listRef[arrayKey] = [...listRef[arrayKey], newValue];

            updateData[fieldPath[0]] = {
                ...profile[fieldPath[0]],
                [arrayKey]: listRef[arrayKey],
            };
        }

        console.log("Sending update request with:", updateData);

        const response = await axios.put("http://localhost:5000/api/developer/profile", updateData, {
            headers: { "developer-id": developerId },
        });

        console.log("✅ Profile updated successfully:", response.data);

        await fetchProfile();
    } catch (error) {
        console.error("Error updating profile:", error);
    }
};


  // Handle array updates (removing items)
  const handleRemoveFromList = async (field, index) => {
    try {
        let updateData = {};

        if (field === "preferredLocations" || field === "languagesPreferred") {
            updateData[field] = profile[field]?.filter((_, i) => i !== index) || [];
        } else {
            const fieldPath = field.split(".");
            let listRef = profile;

            for (let i = 0; i < fieldPath.length - 1; i++) {
                listRef = listRef[fieldPath[i]];
                if (!listRef) {
                    console.error(` Error: Field ${field} does not exist.`);
                    return;
                }
            }

            const arrayKey = fieldPath[fieldPath.length - 1];

            if (!Array.isArray(listRef[arrayKey])) {
                console.error(` Error: ${field} is not an array.`);
                return;
            }

            listRef[arrayKey] = listRef[arrayKey].filter((_, i) => i !== index);

            updateData[fieldPath[0]] = {
                ...profile[fieldPath[0]],
                [arrayKey]: listRef[arrayKey],
            };
        }

        console.log(" Sending update request with:", JSON.stringify(updateData, null, 2));

        const response = await axios.put("http://localhost:5000/api/developer/profile", updateData, {
            headers: { "developer-id": developerId },
        });

        console.log("✅ Profile updated successfully:", response.data);

        await fetchProfile();
    } catch (error) {
        console.error(" Error updating profile:", error);
    }
};

// Handle Profile Photo Upload
const handleProfilePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profilePhoto", file);

    try {
      const response = await axios.put("http://localhost:5000/api/developer/uploadProfilePhoto", formData, {
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
      <Header />
      <div className="profile-container">
        {/* 🔹 Sidebar Navigation */}
        <aside className="sidebar">
          <div className="profile-photo-profile">
            {profile.profilePhoto ? (
              <img src={`http://localhost:5000${profile.profilePhoto}`} alt="Profile" />
            ) : (
              <FaUserCircle className="default-profile-icon" />
            )}
            <label htmlFor="photo-upload" className="upload-icon">
              <FaUpload />
            </label>
            <input type="file" id="photo-upload" accept="image/*" onChange={handleProfilePhotoUpload} hidden />
          </div>
  
          <nav className="sidebar-nav">
            <button className={activeSection === "profile" ? "active" : ""} onClick={() => setActiveSection("profile")}>Profile</button>
            <button className={activeSection === "education" ? "active" : ""} onClick={() => setActiveSection("education")}>Education</button>
            <button className={activeSection === "socials" ? "active" : ""} onClick={() => setActiveSection("socials")}>Socials</button>
            <button className={activeSection === "experience" ? "active" : ""} onClick={() => setActiveSection("experience")}>Work Experience</button>
            <button className={activeSection === "preferences" ? "active" : ""} onClick={() => setActiveSection("preferences")}>Preferences</button>
            <button className={activeSection === "additional" ? "active" : ""} onClick={() => setActiveSection("additional")}>Additional Info</button>
          </nav>
        </aside>
  
        {/* 🔹 Profile Details Section */}
        <main className="profile-details">
          {activeSection === "profile" && (
            <>
              <h2>Profile</h2>
              <ProfileField label="Full Name" field="fullName" value={profile.fullName} editingField={editingField} tempValue={tempValue} onEdit={handleEdit} onChange={setTempValue} onSave={handleSave} onCancel={handleCancel} />
              <ProfileField label="Bio" field="bio" value={profile.bio} editingField={editingField} tempValue={tempValue} onEdit={handleEdit} onChange={setTempValue} onSave={handleSave} onCancel={handleCancel} />
              <ProfileField label="Location" field="location" value={profile.location} editingField={editingField} tempValue={tempValue} onEdit={handleEdit} onChange={setTempValue} onSave={handleSave} onCancel={handleCancel} />
            </>
          )}
  
          {activeSection === "education" && (
            <>
              <h2>Education</h2>
              <ProfileField label="College" field="education.college" value={profile.education?.[0]?.college} editingField={editingField} tempValue={tempValue} onEdit={handleEdit} onChange={setTempValue} onSave={handleSave} onCancel={handleCancel} />
              <ProfileField label="Degree" field="education.degree" value={profile.education?.[0]?.degree} editingField={editingField} tempValue={tempValue} onEdit={handleEdit} onChange={setTempValue} onSave={handleSave} onCancel={handleCancel} />
              <ProfileField label="Graduation Year" field="education.graduationYear" value={profile.education?.[0]?.graduationYear} editingField={editingField} tempValue={tempValue} onEdit={handleEdit} onChange={setTempValue} onSave={handleSave} onCancel={handleCancel} />
            </>
          )}
  
          {activeSection === "socials" && (
            <>
              <h2>Social Links</h2>
              <ProfileField label="LinkedIn" field="linkedIn" value={profile.linkedIn} editingField={editingField} tempValue={tempValue} onEdit={handleEdit} onChange={setTempValue} onSave={handleSave} onCancel={handleCancel} />
              <ProfileField label="GitHub" field="github" value={profile.github} editingField={editingField} tempValue={tempValue} onEdit={handleEdit} onChange={setTempValue} onSave={handleSave} onCancel={handleCancel} />
              <ProfileField label="Portfolio" field="portfolio" value={profile.portfolio} editingField={editingField} tempValue={tempValue} onEdit={handleEdit} onChange={setTempValue} onSave={handleSave} onCancel={handleCancel} />
            </>
          )}
  
          {activeSection === "experience" && (
            <>
              <h2>Work Experience</h2>
              <ProfileField label="Current Job" field="professionalDetails.currentJob" value={profile.professionalDetails?.currentJob} editingField={editingField} tempValue={tempValue} onEdit={handleEdit} onChange={setTempValue} onSave={handleSave} onCancel={handleCancel} />
              <ProfileField label="Years of Experience" field="professionalDetails.yearsOfExperience" value={profile.professionalDetails?.yearsOfExperience} editingField={editingField} tempValue={tempValue} onEdit={handleEdit} onChange={setTempValue} onSave={handleSave} onCancel={handleCancel} />
              {profile.workExperience?.map((exp, index) => (
                <div key={index} className="work-experience">
                  <strong>{exp.company}</strong> - {exp.jobTitle}
                  <p>{exp.startDate} - {exp.endDate || "Present"}</p>
                  <FaTrash className="delete-icon" onClick={() => handleRemoveExperience(index)} />
                </div>
              ))}
              <AddExperienceForm onAddExperience={handleAddExperience} />
            </>
          )}
  
          {activeSection === "preferences" && (
            <>
              <h2>Preferences</h2>
              <ProfileDropdown label="Work Mode" field="workMode" value={profile.workMode}  options={["Remote", "Hybrid", "Onsite"]} editingField={editingField} tempValue={tempValue} onEdit={handleEdit} onChange={(e) => setTempValue(e.target.value)} onSave={handleSave} onCancel={handleCancel} />
              <ProfileList label="Work Locations" field="preferredLocations" values={profile.preferredLocations || []} onAdd={handleAddToList} onRemove={handleRemoveFromList} />
              <ProfileList label="Programming Languages" field="languagesPreferred" values={profile.languagesPreferred || []} onAdd={handleAddToList} onRemove={handleRemoveFromList} />
              <ProfileField label="Expected Stipend (LPA)" field="expectedStipend" value={profile.expectedStipend} editingField={editingField} tempValue={tempValue} onEdit={handleEdit} onChange={setTempValue} onSave={handleSave} onCancel={handleCancel} />
              <ProfileList label="Job Roles Interested" field="professionalDetails.jobRolesInterested" values={profile.professionalDetails?.jobRolesInterested || []} onAdd={handleAddToList} onRemove={handleRemoveFromList} />
            </>
          )}
  
          {activeSection === "additional" && (
            <>
              <h2>Additional Information</h2>
              <ProfileList label="Achievements" field="additionalInfo.achievements" values={profile.additionalInfo?.achievements || []} onAdd={handleAddToList} onRemove={handleRemoveFromList} />
              <ProfileList label="Certifications" field="additionalInfo.certifications" values={profile.additionalInfo?.certifications || []} onAdd={handleAddToList} onRemove={handleRemoveFromList} />
              <ProfileList label="Skills" field="professionalDetails.skills" values={profile.professionalDetails?.skills || []} onAdd={handleAddToList} onRemove={handleRemoveFromList} />
              <ProfileList label="Languages I Speak" field="additionalInfo.languages" values={profile.additionalInfo?.languages || []} onAdd={handleAddToList} onRemove={handleRemoveFromList} />
            </>
          )}
        </main>
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
