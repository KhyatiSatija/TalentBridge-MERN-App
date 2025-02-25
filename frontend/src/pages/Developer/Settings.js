import React, { useState } from "react";
import api from './api';
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
        <Header/>
        <div className="settings-container">

          {message && <p className={`message-${messageType}`}>{message}</p>}


          <div className="settings-section">
            <h3><FaEnvelope /> Update Email</h3>
            <input type="email" placeholder="Enter new email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <button onClick={handleUpdateEmail} disabled={loading}>Update Email</button>
          </div>

          <div className="settings-section">
            <h3><FaLock /> Change Password</h3>
            <input type="password" placeholder="Current password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
            <input type="password" placeholder="New password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            <button onClick={handleChangePassword} disabled={loading}>Change Password</button>
          </div>

          <div className="settings-section">
            <h3><FaPhone /> Update Phone Number</h3>
            <input type="text" placeholder="Enter new phone number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
            <button onClick={handleUpdatePhoneNumber} disabled={loading}>Update Phone</button>
          </div>

          <div className="settings-section delete">
            <h3><FaTrash /> Delete Account</h3>
            <button onClick={openModal} className="delete-button">Delete Account</button>
          </div>

            {/* Popup Modal for Account Deletion Confirmation */}
            <Modal isOpen={modalIsOpen} onRequestClose={closeModal} className="modal-content" overlayClassName="modal-overlay">
              <h3>Are you sure?</h3>
              <p>This action is irreversible. Your account will be permanently deleted.</p>
              <div className="modal-buttons">
                <button onClick={handleDeleteAccount} disabled={loading} className="confirm-delete">Yes, Delete</button>
                <button onClick={closeModal} className="cancel-delete">Cancel</button>
              </div>
            </Modal>

          <div className="settings-section logout">
            <h3><FaSignOutAlt /> Logout</h3>
            <button onClick={handleLogout} className="logout-button">Logout</button>
          </div>
        </div>
    </div>

    
  );
};

export default Settings;
