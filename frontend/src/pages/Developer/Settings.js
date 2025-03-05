import React, { useState } from "react";
import api from '../../api';
import { FaEnvelope, FaLock, FaPhone, FaTrash, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../../assets/css/Developer/Settings.css"
import Header from "../../components/Header";
import Modal from "react-modal";

Modal.setAppElement("#root"); 

const Settings = () => {
  const navigate = useNavigate(); //initialize the use navigate hook
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState("");
  const developerId = localStorage.getItem("developerId");

  const handleUpdateEmail = async () => {
    try {
      setLoading(true);
      const response = await api.put(
        "/api/developer/settings/update-email",
        { newEmail: email },
        {
            headers: { "developer-id": developerId },
        }
      );
      setMessage(response.data.message);
      setMessageType("success");
    } catch (error) {
      setMessage(error.response?.data?.message || "Error updating email");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    try {
      setLoading(true);
      const response = await api.put(
        "/api/developer/settings/change-password",
        { currentPassword, newPassword },
        {
            headers: { "developer-id": developerId },
        }
      );
      setMessage(response.data.message);
      setMessageType("success");
    } catch (error) {
      setMessage(error.response?.data?.message || "Error changing password");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePhoneNumber = async () => {
    try {
      setLoading(true);
      const response = await api.put(
        "/api/developer/settings/update-phone",
        { newPhoneNumber: phoneNumber },
        {
            headers: { "developer-id": developerId },
        }
      );
      setMessage(response.data.message);
      setMessageType("success");
    } catch (error) {
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
      const response = await api.delete("/api/developer/settings/delete-account", 
        {
            headers: { "developer-id": developerId },
        }
      );
      setMessage(response.data.message);
      localStorage.removeItem("developerId");
      navigate("/");
      setMessageType("success");
      closeModal();
    } catch (error) {
      setMessage(error.response?.data?.message || "Error deleting account");
      setMessageType("error");
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
              <button onClick={handleUpdateEmail}>Update Email</button>
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
              <button onClick={handleChangePassword}>Change Password</button>
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
                placeholder="Enter new phone number" 
                value={phoneNumber} 
                onChange={(e) => setPhoneNumber(e.target.value)} 
              />
              <button onClick={handleUpdatePhoneNumber}>Update Phone</button>
            </div>
          </div>

          {/* Delete Account */}
          <div className="settings-item delete">
            <div className="settings-left">
              <FaTrash className="settings-icon" />
              <h3>Delete Account</h3>
            </div>
            <div className="settings-right">
              <button onClick={openModal} className="delete-button">Delete Account</button>
            </div>
          </div>

          {/* Logout */}
          <div className="settings-item logout">
            <div className="settings-left">
              <FaSignOutAlt className="settings-icon" />
              <h3>Logout</h3>
            </div>
            <div className="settings-right">
              <button onClick={handleLogout} className="logout-button">Logout</button>
            </div>
          </div>
        </div>

        {/* Popup Modal for Account Deletion Confirmation */}
        <Modal isOpen={modalIsOpen} onRequestClose={closeModal} className="modal-content-settings" overlayClassName="modal-overlay-settings">
          <h3>Are you sure?</h3>
          <p>This action is irreversible. Your account will be permanently deleted.</p>
          <div className="modal-buttons">
            <button onClick={handleDeleteAccount} className="confirm-delete">Yes, Delete</button>
            <button onClick={closeModal} className="cancel-delete">Cancel</button>
          </div>
        </Modal>
      </div>
    </div>

  );
};

export default Settings;