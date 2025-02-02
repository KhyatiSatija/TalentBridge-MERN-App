## API Documentation - TalentBridge

### **Base URL:** `http://localhost:500`

---

# **Authentication APIs**

---

### **1. Developer Signup**

**HTTP URL:** `POST /api/auth/developer/signup`

**Description:** Registers a new developer on the TalentBridge platform.

**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "johndoe@example.com",
  "password": "SecurePass123!",
  "phoneNumber": "+1234567890"
}
```

**Response Body:**
- **Success:**
```json
{
  "message": "Developer registered successfully",
  "developerId": "<developer_id>"
}
```

- **Error:**
```json
{
  "message": "<Error message>"
}
```

---

### **2. Developer Login**

**HTTP URL:** `POST /api/auth/developer/login`

**Description:** Authenticates a developer and returns their ID upon successful login.

**Request Body:**
```json
{
  "email": "johndoe@example.com",
  "password": "SecurePass123!"
}
```

**Response Body:**
- **Success:**
```json
{
  "message": "Login successful",
  "developerId": "<developer_id>"
}
```

- **Error:**
```json
{
  "message": "<Error message>"
}
```

---

### **3. Company Signup**

**HTTP URL:** `POST /api/auth/company/signup`

**Description:** Registers a new company on the TalentBridge platform.

**Request Body:**
```json
{
  "name": "Tech Innovators Inc.",
  "email": "hr@techinnovators.com",
  "password": "SecurePass123!"
}
```

**Response Body:**
- **Success:**
```json
{
  "message": "Company registered successfully",
  "companyId": "<company_id>"
}
```

- **Error:**
```json
{
  "message": "<Error message>"
}
```

---

### **4. Company Login**

**HTTP URL:** `POST /api/auth/company/login`

**Description:** Authenticates a company and returns their ID upon successful login.

**Request Body:**
```json
{
  "email": "hr@techinnovators.com",
  "password": "SecurePass123!"
}
```

**Response Body:**
- **Success:**
```json
{
  "message": "Login successful",
  "companyId": "<company_id>"
}
```

- **Error:**
```json
{
  "message": "<Error message>"
}
```

---

### **5. Forgot Password**

**HTTP URL:** `POST /api/auth/forgot-password`

**Description:** Sends a password reset link to the registered email of a developer or company.

**Request Body:**
```json
{
  "email": "johndoe@example.com",
  "type": "developer" // or "company"
}
```

**Response Body:**
- **Success:**
```json
{
  "message": "Password reset email sent to the user"
}
```

- **Error:**
```json
{
  "message": "Failed to send email",
  "error": "<Error message>"
}
```

---

### **6. Reset Password**

**HTTP URL:** `POST /api/auth/reset-password`

**Description:** Resets the password for a developer or company using the reset token.

**Request Body:**
```json
{
  "resetToken": "<reset_token>",
  "newPassword": "NewSecurePass123!",
  "confirmPassword": "NewSecurePass123!",
  "type": "developer" // or "company"
}
```

**Response Body:**
- **Success:**
```json
{
  "message": "Password reset successfully"
}
```

- **Error:**
```json
{
  "message": "<Error message>"
}
```

---

# **Developer APIs**

---

### **1. Get Developer Dashboard**

**HTTP URL:** `GET /api/developer/dashboard`

**Description:** Retrieves the developer dashboard with the latest tech news.

**Request Body:**
_No request body required._

**Response Body:**
- **Success:**
```json
{
  "techNews": [
    { "title": "Tech Headline 1", "link": "https://example.com/1" },
    { "title": "Tech Headline 2", "link": "https://example.com/2" }
  ]
}
```

- **Error:**
```json
{
  "message": "Error loading tech news from API",
  "error": "<Error message>"
}
```

---

### **2. Get Developer Connections**

**HTTP URL:** `GET /api/developer/connections`

**Description:** Fetches the list of connection requests, requested developers, and matched developers.

**Request Body:**
_No request body required._

**Response Body:**
- **Success:**
```json
{
  "connectionRequests": [ { "fullName": "Alice", "bio": "Frontend Developer" } ],
  "requested": [ { "fullName": "Bob", "bio": "Backend Developer" } ],
  "matched": [ { "fullName": "Charlie", "email": "charlie@example.com", "phoneNumber": "+1234567890" } ]
}
```

- **Error:**
```json
{
  "message": "Error fetching connections",
  "error": "<Error message>"
}
```

---

### **3. Update Developer Connections**

**HTTP URL:** `PUT /api/developer/connections`

**Description:** Updates the developer connections based on actions like accept, reject, or cancel a request.

**Request Body:**
```json
{
  "targetDeveloperId": "<developer_id>",
  "action": "accept" // or "reject", "cancelRequest"
}
```

**Response Body:**
- **Success:**
```json
{
  "message": "Connection updated successfully"
}
```

- **Error:**
```json
{
  "message": "Error updating connection",
  "error": "<Error message>"
}
```

---

### **4. Get Developer Profile**

**HTTP URL:** `GET /api/developer/profile`

**Description:** Retrieves the profile details of the logged-in developer.

**Request Body:**
_No request body required._

**Response Body:**
- **Success:**
```json
{
  "fullName": "John Doe",
  "bio": "Add your bio here",
  "professionalDetails": {
    "skills": [],
    "jobRolesInterested": []
  },
  "education": [],
  "workExperience": [],
  "additionalInfo": {
    "certifications": [],
    "achievements": [],
    "languages": []
  }
}
```

- **Error:**
```json
{
  "message": "Error fetching profile",
  "error": "<Error message>"
}
```

---

### **5. Update Developer Profile**

**HTTP URL:** `PUT /api/developer/profile`

**Description:** Updates the profile information of the logged-in developer.

**Request Body:**
```json
{
  "bio": "Experienced MERN Stack Developer",
  "professionalDetails": {
    "skills": ["React", "Node.js"],
    "jobRolesInterested": ["Frontend Developer"]
  },
  "education": [
    {
      "degree": "B.Tech",
      "college": "ABC University",
      "graduationYear": "2022"
    }
  ]
}
```

**Response Body:**
- **Success:**
```json
{
  "message": "Profile updated successfully",
  "profile": { "bio": "Experienced MERN Stack Developer" }
}
```

- **Error:**
```json
{
  "message": "Error updating profile",
  "error": "<Error message>"
}
```

---

### **6. Update Developer Email**

**HTTP URL:** `PUT /api/developer/settings/update-email`

**Description:** Updates the email address of the logged-in developer.

**Request Body:**
```json
{
  "newEmail": "newemail@example.com"
}
```

**Response Body:**
- **Success:**
```json
{
  "message": "Email updated successfully",
  "email": "newemail@example.com"
}
```

- **Error:**
```json
{
  "message": "Error updating email",
  "error": "<Error message>"
}
```

---

### **7. Change Developer Password**

**HTTP URL:** `PUT /api/developer/settings/change-password`

**Description:** Changes the password of the logged-in developer.

**Request Body:**
```json
{
  "currentPassword": "OldPass123!",
  "newPassword": "NewPass456!"
}
```

**Response Body:**
- **Success:**
```json
{
  "message": "Password changed successfully"
}
```

- **Error:**
```json
{
  "message": "Error changing password",
  "error": "<Error message>"
}
```

---

### **8. Update Developer Phone Number**

**HTTP URL:** `PUT /api/developer/settings/update-phone`

**Description:** Updates the phone number of the logged-in developer.

**Request Body:**
```json
{
  "newPhoneNumber": "+9876543210"
}
```

**Response Body:**
- **Success:**
```json
{
  "message": "Phone number updated successfully",
  "phoneNumber": "+9876543210"
}
```

- **Error:**
```json
{
  "message": "Error updating phone number",
  "error": "<Error message>"
}
```

---

### **9. Delete Developer Account**

**HTTP URL:** `DELETE /api/developer/settings/delete-account`

**Description:** Deletes the account of the logged-in developer.

**Request Body:**
_No request body required._

**Response Body:**
- **Success:**
```json
{
  "message": "Account deleted successfully"
}
```

- **Error:**
```json
{
  "message": "Error deleting account",
  "error": "<Error message>"
}
```

### **Company API Documentation**

---

### **1. Create a New Job**

**HTTP URL:** `POST /api/company/jobs/create`  
**Description:** Creates a new job posting for the company.

**Request Body:**
```json
{
  "jobTitle": "MERN Stack Developer",
  "jobDescription": "Responsible for full-stack development.",
  "responsibilities": ["Develop web applications", "Collaborate with teams"],
  "requiredSkills": ["React", "Node.js", "MongoDB"],
  "salaryRange": "50,000-70,000",
  "workMode": "Remote",
  "location": "New York",
  "lastDateToApply": "2025-12-31"
}
```

**Response Body:**
- **Success:**
```json
{
  "message": "Job created successfully",
  "job": {
    "jobTitle": "MERN Stack Developer",
    "companyId": "<company_id>",
    "_id": "<job_id>"
  }
}
```
- **Error:**
```json
{
  "message": "Error creating job",
  "error": "<Error message>"
}
```

---

### **2. Get All Jobs**

**HTTP URL:** `GET /api/company/jobs`  
**Description:** Retrieves all jobs posted by the company.

**Request Body:**  
_No request body required._

**Response Body:**
- **Success:**
```json
[
  {
    "jobTitle": "MERN Stack Developer",
    "jobDescription": "Responsible for full-stack development.",
    "responsibilities": ["Develop web applications"],
    "requiredSkills": ["React", "Node.js"],
    "salaryRange": "50,000-70,000",
    "workMode": "Remote",
    "location": "New York",
    "lastDateToApply": "2025-12-31",
    "_id": "<job_id>"
  }
]
```
- **Error:**
```json
{
  "message": "Error fetching jobs",
  "error": "<Error message>"
}
```

---

### **3. Edit a Job Posting**

**HTTP URL:** `PUT /api/company/jobs/:jobId`  
**Description:** Updates the details of an existing job posting.

**Request Body:**
```json
{
  "jobTitle": "Updated Job Title",
  "salaryRange": "60,000-80,000"
}
```

**Response Body:**
- **Success:**
```json
{
  "message": "Job updated successfully",
  "job": {
    "jobTitle": "Updated Job Title",
    "salaryRange": "60,000-80,000",
    "_id": "<job_id>"
  }
}
```
- **Error:**
```json
{
  "message": "Error updating job",
  "error": "<Error message>"
}
```

---

### **4. Delete a Job Posting**

**HTTP URL:** `DELETE /api/company/jobs/:jobId`  
**Description:** Deletes a job posting created by the company.

**Request Body:**  
_No request body required._

**Response Body:**
- **Success:**
```json
{
  "message": "Job deleted successfully"
}
```
- **Error:**
```json
{
  "message": "Error deleting job",
  "error": "<Error message>"
}
```

---

### **5. Get Applications for a Job**

**HTTP URL:** `GET /api/company/jobs/:jobId/applications`  
**Description:** Retrieves all applications submitted for a specific job.

**Request Body:**  
_No request body required._

**Response Body:**
- **Success:**
```json
{
  "jobApplications": {
    "applied": [ { "developerId": "<developer_id>", "name": "John Doe" } ],
    "underProcess": [],
    "hired": [],
    "rejected": []
  }
}
```
- **Error:**
```json
{
  "message": "Error fetching applications",
  "error": "<Error message>"
}
```

---

### **6. Reject a Developer's Application**

**HTTP URL:** `PUT /api/company/applications/reject`  
**Description:** Rejects a developer's application for a job.

**Request Body:**
```json
{
  "jobId": "<job_id>",
  "developerId": "<developer_id>"
}
```

**Response Body:**
- **Success:**
```json
{
  "message": "Developer rejected successfully"
}
```
- **Error:**
```json
{
  "message": "Error rejecting developer application",
  "error": "<Error message>"
}
```

---

### **7. Move Application to Under Process**

**HTTP URL:** `PUT /api/company/applications/process`  
**Description:** Moves a developer's application status to \"under process.\"

**Request Body:**
```json
{
  "jobId": "<job_id>",
  "developerId": "<developer_id>"
}
```

**Response Body:**
- **Success:**
```json
{
  "message": "Developer Application moved to under process"
}
```
- **Error:**
```json
{
  "message": "Error processing developer application",
  "error": "<Error message>"
}
```

---

### **8. Hire a Developer**

**HTTP URL:** `PUT /api/company/applications/hire`  
**Description:** Hires a developer for a job.

**Request Body:**
```json
{
  "jobId": "<job_id>",
  "developerId": "<developer_id>"
}
```

**Response Body:**
- **Success:**
```json
{
  "message": "Under-Process Developer hired successfully"
}
```
- **Error:**
```json
{
  "message": "Error hiring developer under-process",
  "error": "<Error message>"
}
```

---

### **9. Reject an Under Process Developer**

**HTTP URL:** `PUT /api/company/applications/reject-under-process`  
**Description:** Rejects a developer whose application was \"under process.\"

**Request Body:**
```json
{
  "jobId": "<job_id>",
  "developerId": "<developer_id>"
}
```

**Response Body:**
- **Success:**
```json
{
  "message": "Under-Process Developer rejected successfully"
}
```
- **Error:**
```json
{
  "message": "Error rejecting under-process developer",
  "error": "<Error message>"
}
```
### **10. Move a Rejected Developer to Under Process**

**HTTP URL:** `PUT /api/company/applications/move-rejected-to-under-process`  
**Description:** Moves a rejected developer to the "under process" category, giving them a second chance.

**Request Body:**
```json
{
  "jobId": "<job_id>",
  "developerId": "<developer_id>"
}
```

**Response Body:**
- **Success:**
```json
{
  "message": "Rejected Developer moved to under-process successfully"
}
```
- **Error:**
```json
{
  "message": "Error moving to under-process a previously rejected developer",
  "error": "<Error message>"
}
```

---

### **11. View Developer Profile**

**HTTP URL:** `GET /api/company/applications/developer/:developerId?jobId=<job_id>`  
**Description:** Views the profile of a developer who applied for a job, with conditional visibility based on the application status.

**Request Body:**  
_No request body required._

**Response Body:**
- **Success (Under Process or Hired):**
```json
{
  "fullName": "John Doe",
  "email": "johndoe@example.com",
  "phoneNumber": "+1234567890",
  "profilePhoto": "profile.jpg",
  "linkedIn": "https://linkedin.com/in/johndoe",
  "bio": "Experienced MERN Stack Developer"
}
```

- **Success (Hidden Details for Other Statuses):**
```json
{
  "fullName": "Hidden",
  "email": "Hidden",
  "phoneNumber": "Hidden",
  "profilePhoto": "Hidden",
  "linkedIn": "Hidden",
  "bio": "Experienced MERN Stack Developer"
}
```

- **Error:**
```json
{
  "message": "Error fetching developer profile",
  "error": "<Error message>"
}
```
---

### **12. Update Company Email**

**HTTP URL:** `PUT /api/company/settings/update-email`  
**Description:** Updates the email address of the company.

**Request Body:**
```json
{
  "newEmail": "newemail@example.com"
}
```

**Response Body:**
- **Success:**
```json
{
  "message": "Email updated successfully",
  "email": "newemail@example.com"
}
```
- **Error:**
```json
{
  "message": "Error updating email",
  "error": "<Error message>"
}
```

---

### **13. Update Company Password**

**HTTP URL:** `PUT /api/company/settings/update-password`  
**Description:** Updates the password of the company after verifying the current password.

**Request Body:**
```json
{
  "currentPassword": "CurrentPassword123!",
  "newPassword": "NewSecurePassword456!"
}
```

**Response Body:**
- **Success:**
```json
{
  "message": "Password updated successfully"
}
```
- **Error:**
```json
{
  "message": "Error updating password",
  "error": "<Error message>"
}
```

---

### **14. Delete Company Account**

**HTTP URL:** `DELETE /api/company/settings/delete-account`  
**Description:** Deletes the company's account from the platform.

**Request Body:**  
_No request body required._

**Response Body:**
- **Success:**
```json
{
  "message": "Account deleted successfully"
}
```
- **Error:**
```json
{
  "message": "Error deleting account",
  "error": "<Error message>"
}
```

---

### **15. Change Company Name**

**HTTP URL:** `PUT /api/company/settings/change-name`  
**Description:** Changes the company's name.

**Request Body:**
```json
{
  "newName": "Innovative Tech Solutions"
}
```

**Response Body:**
- **Success:**
```json
{
  "message": "Company Name changed successfully",
  "name": "Innovative Tech Solutions"
}
```
- **Error:**
```json
{
  "message": "Error changing name",
  "error": "<Error message>"
}
```

---

