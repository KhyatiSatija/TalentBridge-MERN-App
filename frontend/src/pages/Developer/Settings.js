import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEnvelope, FaLock, FaPhone, FaTrash, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../../assets/css/Developer/Settings.css"
import Header from "../../components/Header";
import Modal from "react-modal";

Modal.setAppElement("#root"); 

const Settings = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const developerId = localStorage.getItem("developerId");
  
  // Add validation states
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Clear message after 5 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
        setMessageType("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!email) {
      setEmailError("Email is required");
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError("Invalid email format");
      return false;
    }
    setEmailError("");
    return true;
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^\d{10}$/;
    if (!phone) {
      setPhoneError("Phone number is required");
      return false;
    }
    if (!phoneRegex.test(phone)) {
      setPhoneError("Phone number must be 10 digits");
      return false;
    }
    setPhoneError("");
    return true;
  };

  const validatePassword = () => {
    if (!currentPassword) {
      setPasswordError("Current password is required");
      return false;
    }
    if (!newPassword) {
      setPasswordError("New password is required");
      return false;
    }
    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleUpdateEmail = async () => {
    if (!validateEmail(email)) return;
    
    try {
      setLoading(true);
      const response = await axios.put(
        "http://localhost:5000/api/developer/settings/update-email",
        { newEmail: email },
        {
          headers: { "developer-id": developerId }
        }
      );
      setMessage(response.data.message);
      setMessageType("success");
      setEmail("");
    } catch (error) {
      console.error("Error details:", error);
      setMessage(error.response?.data?.message || "Error updating email");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!validatePassword()) return;
    
    try {
      setLoading(true);
      const response = await axios.put(
        "http://localhost:5000/api/developer/settings/change-password",
        { currentPassword, newPassword },
        {
          headers: { "developer-id": developerId }
        }
      );
      setMessage(response.data.message);
      setMessageType("success");
      setCurrentPassword("");
      setNewPassword("");
    } catch (error) {
      console.error("Error details:", error);
      setMessage(error.response?.data?.message || "Error changing password");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePhoneNumber = async () => {
    if (!validatePhone(phoneNumber)) return;
    
    try {
      setLoading(true);
      const response = await axios.put(
        "http://localhost:5000/api/developer/settings/update-phone",
        { newPhoneNumber: phoneNumber },
        {
          headers: { "developer-id": developerId }
        }
      );
      setMessage(response.data.message);
      setMessageType("success");
      setPhoneNumber("");
    } catch (error) {
      console.error("Error details:", error);
      setMessage(error.response?.data?.message || "Error updating phone number");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);
  
  const handleDeleteAccount = async () => {
    try {
      setLoading(true);
      const response = await axios.delete(
        "http://localhost:5000/api/developer/settings/delete-account", 
        {
          headers: { "developer-id": developerId }
        }
      );
      setMessage(response.data.message);
      localStorage.removeItem("developerId");
      navigate("/");
      setMessageType("success");
      closeModal();
    } catch (error) {
      console.error("Error details:", error);
      setMessage(error.response?.data?.message || "Error deleting account");
      setMessageType("error");
      closeModal();
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("developerId");
    navigate("/");
  };

  return (
    <div>
      <Header />
      <div className="settings-container">
        {/* Status Message */}
        {message && (
          <div className={`message ${messageType}`}>
            {message}
          </div>
        )}

        <div className="settings-grid">
          {/* Update Email */}
          <div className="settings-item">
            <div className="settings-left">
              <FaEnvelope className="settings-icon" />
              <h3>Update Email</h3>
            </div>
            <div className="settings-right">
              <input 
                type="email" 
                placeholder="Enter new email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
              />
              {emailError && <div className="error-message">{emailError}</div>}
              <button onClick={handleUpdateEmail} disabled={loading}>
                {loading ? "Processing..." : "Update Email"}
              </button>
            </div>
          </div>

          {/* Change Password */}
          <div className="settings-item">
            <div className="settings-left">
              <FaLock className="settings-icon" />
              <h3>Change Password</h3>
            </div>
            <div className="settings-right">
              <input 
                type="password" 
                placeholder="Current password" 
                value={currentPassword} 
                onChange={(e) => setCurrentPassword(e.target.value)} 
              />
              <input 
                type="password" 
                placeholder="New password" 
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)} 
              />
              {passwordError && <div className="error-message">{passwordError}</div>}
              <button onClick={handleChangePassword} disabled={loading}>
                {loading ? "Processing..." : "Change Password"}
              </button>
            </div>
          </div>

          {/* Update Phone Number */}
          <div className="settings-item">
            <div className="settings-left">
              <FaPhone className="settings-icon" />
              <h3>Update Phone Number</h3>
            </div>
            <div className="settings-right">
              <input 
                type="text" 
                placeholder="Enter new phone number (10 digits)" 
                value={phoneNumber} 
                onChange={(e) => setPhoneNumber(e.target.value)} 
              />
              {phoneError && <div className="error-message">{phoneError}</div>}
              <button onClick={handleUpdatePhoneNumber} disabled={loading}>
                {loading ? "Processing..." : "Update Phone"}
              </button>
            </div>
          </div>

          {/* Delete Account */}
          <div className="settings-item delete">
            <div className="settings-left">
              <FaTrash className="settings-icon" />
              <h3>Delete Account</h3>
            </div>
            <div className="settings-right">
              <button onClick={openModal} className="delete-button" disabled={loading}>
                Delete Account
              </button>
            </div>
          </div>

          {/* Logout */}
          <div className="settings-item logout">
            <div className="settings-left">
              <FaSignOutAlt className="settings-icon" />
              <h3>Logout</h3>
            </div>
            <div className="settings-right">
              <button onClick={handleLogout} className="logout-button">
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Popup Modal for Account Deletion Confirmation */}
        <Modal 
          isOpen={modalIsOpen} 
          onRequestClose={closeModal} 
          className="modal-content-settings" 
          overlayClassName="modal-overlay-settings"
        >
          <h3>Are you sure?</h3>
          <p>This action is irreversible. Your account will be permanently deleted.</p>
          <div className="modal-buttons">
            <button 
              onClick={handleDeleteAccount} 
              className="confirm-delete" 
              disabled={loading}
            >
              {loading ? "Processing..." : "Yes, Delete"}
            </button>
            <button 
              onClick={closeModal} 
              className="cancel-delete"
            >
              Cancel
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Settings;