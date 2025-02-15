import React, { useState } from "react";
import axios from "axios";
import  CompanyHeader from "../../components/CompanyHeader";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import "../../assets/css/Company/Settings.css";
import { FaEnvelope, FaLock, FaTrash, FaSignOutAlt, FaBuilding } from "react-icons/fa";

Modal.setAppElement("#root"); 


const CompanySettings = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const companyId = localStorage.getItem("companyId");

  const handleUpdateEmail = async () => {
    try {
      setLoading(true);
      const response = await axios.put(
        "http://localhost:5000/api/company/settings/update-email",
        { newEmail: email },
        {
          headers: { companyid: companyId },
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
      const response = await axios.put(
        "http://localhost:5000/api/company/settings/update-password",
        { currentPassword, newPassword },
        {
          headers: { companyid: companyId },
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

  const handleUpdateCompanyName = async () => {
    try {
      setLoading(true);
      const response = await axios.put(
        "http://localhost:5000/api/company/settings/change-name",
        { newName: companyName },
        {
          headers: { companyid: companyId },
        }
      );
      setMessage(response.data.message);
      setMessageType("success");
    } catch (error) {
      setMessage(error.response?.data?.message || "Error updating company name");
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
      const response = await axios.delete("http://localhost:5000/api/company/settings/delete-account", {
        headers: { companyid: companyId },
      });
      setMessage(response.data.message);
      localStorage.removeItem("companyId");
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
    localStorage.removeItem("companyId");
    navigate("/");
  };

  return (
    <div>
      <CompanyHeader />
      <div className="settings-container">
        <h2>Company Settings</h2>

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
          <h3><FaBuilding /> Update Company Name</h3>
          <input type="text" placeholder="Enter new company name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
          <button onClick={handleUpdateCompanyName} disabled={loading}>Update Name</button>
        </div>

        <div className="settings-section delete">
          <h3><FaTrash /> Delete Account</h3>
          <button onClick={openModal} className="delete-button">Delete Account</button>
        </div>

        {/* Modal for account deletion confirmation */}
        <Modal isOpen={modalIsOpen} onRequestClose={closeModal} className="modal-content" overlayClassName="modal-overlay">
          <h3>Are you sure?</h3>
          <p>This action is irreversible. Your company account along with all job descriptions and corresponding applications will be permanently deleted.</p>
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

export default CompanySettings;
