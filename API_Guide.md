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

### **2. Swipe and Connect with Other Developers - Fetch Developer Cards**

**HTTP Method:** `GET`  
**URL:** `/api/developer/connect`  
**Description:**  
This API fetches a list of developers that the logged-in user can swipe on. It excludes developers who:
- Are the logged-in user themselves.
- Have been rejected by the logged-in user.
- Have received a connection request from the logged-in user.
- Have already matched with the logged-in user.
- Have rejected the logged-in user.

---

### **Request:**

**Headers:**
- `Authorization: Bearer <JWT_TOKEN>`

---

### **Response:**

**Status Code:** `200 OK`

**Response Body (JSON):**

```json
[
  {
    "id": "64bfc0e7c9f8392c7a1e1e7a",
    "fullName": "Rohit Sharma",
    "profilePhoto": "https://example.com/photos/rohit.jpg",
    "bio": "Passionate full-stack developer with a knack for building scalable applications.",
    "location": "Mumbai, Maharashtra",
    "linkedIn": "https://linkedin.com/in/rohitsharma",
    "github": "https://github.com/rohitsharma",
    "portfolio": "https://rohitportfolio.com",
    "professionalDetails": {
      "currentJob": "Frontend Developer",
      "company": "Infosys",
      "lookingFor": "Full-stack roles",
      "skills": ["React", "Node.js", "MongoDB"],
      "yearsOfExperience": 3
    },
    "education": {
      "degree": "B.Tech in Computer Science",
      "college": "IIT Bombay",
      "graduationYear": 2020
    },
    "workExperience": [
      {
        "companyName": "Infosys",
        "jobTitle": "Frontend Developer",
        "duration": "2021-2024",
        "responsibilities": [
          "Developed scalable front-end interfaces using React.",
          "Collaborated with backend teams for API integration."
        ]
      }
    ],
    "additionalInfo": {
      "certifications": ["AWS Certified Developer", "Google Cloud Architect"],
      "achievements": ["Winner at Hackathon India 2022"],
      "languages": ["JavaScript", "TypeScript", "Python"]
    }
  },
  {
    "id": "64bfd0e7c9f8392c7a1e1f8b",
    "fullName": "Priya Singh",
    "profilePhoto": "https://example.com/photos/priya.jpg",
    "bio": "Backend engineer with a passion for microservices and distributed systems.",
    "location": "Bengaluru, Karnataka",
    "linkedIn": "https://linkedin.com/in/priyasingh",
    "github": "https://github.com/priyasingh",
    "portfolio": null,
    "professionalDetails": {
      "currentJob": "Backend Engineer",
      "company": "TCS",
      "lookingFor": "Backend roles in fintech",
      "skills": ["Node.js", "Express.js", "Docker"],
      "yearsOfExperience": 4
    },
    "education": {
      "degree": "B.Sc in Computer Science",
      "college": "Delhi University",
      "graduationYear": 2019
    },
    "workExperience": [
      {
        "companyName": "TCS",
        "jobTitle": "Backend Engineer",
        "duration": "2019-2023",
        "responsibilities": [
          "Developed REST APIs and optimized performance.",
          "Implemented CI/CD pipelines using Jenkins."
        ]
      }
    ],
    "additionalInfo": {
      "certifications": ["Coursera Microservices Architect"],
      "achievements": ["Runner-up at Bangalore Tech Fest"],
      "languages": ["Java", "JavaScript", "Go"]
    }
  }
]
```

---

### **Error Responses:**

1. **Status Code:** `500 Internal Server Error`  
   **Response:**
   ```json
   {
     "message": "Error fetching developers",
     "error": "Detailed error message here"
   }
   ```

---


### **3. Swipe Action - Record Swipe (Right/Left)**

**HTTP Method:** `POST`  
**URL:** `/api/developer/connect`  
**Description:**  
This API records swipe actions (right or left) when a developer interacts with another developer's profile. It manages connection requests, rejections, and matches between developers.

---

### **Request:**

**Headers:**
- `Authorization: Bearer <JWT_TOKEN>`
- `Content-Type: application/json`

**Body Parameters:**

| Parameter    | Type   | Description                                              |
|--------------|--------|----------------------------------------------------------|
| `developerId`| String | The ID of the target developer (whom the swipe is for).   |
| `action`     | String | The swipe action: either `'swipeRight'` or `'swipeLeft'`. |

**Example Request (Swipe Right):**
```json
{
  "developerId": "64bfd0e7c9f8392c7a1e1f8b",
  "action": "swipeRight"
}
```

**Example Request (Swipe Left):**
```json
{
  "developerId": "64bfc0e7c9f8392c7a1e1e7a",
  "action": "swipeLeft"
}
```

---

### **Response:**

**Status Code:** `200 OK`

**Response Body (JSON):**
```json
{
  "message": "Action recorded successfully"
}
```

---

### **Swipe Action Logic:**

1. **Swipe Right (`swipeRight`):**
   - **If the target developer has already sent a connection request to the logged-in user:**
     - A **match** is created for both developers.
     - Both developers' connection records are updated to reflect the match.
   - **If no prior connection request exists:**
     - The logged-in user adds the target developer to their **requested** list.
     - The target developer receives the logged-in user in their **connectionRequests** list.

2. **Swipe Left (`swipeLeft`):**
   - **If the target developer has already sent a connection request:**
     - The logged-in user **rejects** the connection request.
     - The target developer's **requested** list is updated to remove the logged-in user.
   - **If no prior connection request exists:**
     - The logged-in user adds the target developer to their **rejected** list.

---

### **Error Responses:**

1. **Status Code:** `500 Internal Server Error`  
   **Response:**
   ```json
   {
     "message": "Error recording action",
     "error": "Detailed error message here"
   }
   ```


---

### **4. Job Applications - Fetch Job Cards**

**HTTP Method:** `GET`  
**URL:** `/api/developer/jobs`  
**Description:**  
This API fetches job listings that the logged-in developer can swipe on. It excludes jobs that the developer has:
- Rejected
- Already applied to
- Is under process for
- Been hired for
- Marked on hold
- Been rejected by the company

---

### **Request:**

**Headers:**
- `Authorization: Bearer <JWT_TOKEN>`

---

### **Response:**

**Status Code:** `200 OK`

**Response Body (JSON):**
```json
[
  {
    "_id": "64bfd0e7c9f8392c7a1e1f8b",
    "jobTitle": "MERN Stack Developer",
    "jobDescription": "Join our dynamic team to build scalable web applications.",
    "responsibilities": [
      "Develop and maintain front-end applications using React.js",
      "Design robust backend services using Node.js and Express.js",
      "Collaborate with product and design teams"
    ],
    "requiredSkills": ["React", "Node.js", "MongoDB", "Express.js"],
    "salaryRange": "₹6,00,000 - ₹10,00,000 per annum",
    "workMode": "Remote",
    "location": "Bengaluru, Karnataka",
    "lastDateToApply": "2025-03-01"
  },
  {
    "_id": "64bfc0e7c9f8392c7a1e1e7a",
    "jobTitle": "Frontend Developer",
    "jobDescription": "Work on modern front-end technologies to deliver high-quality UI/UX.",
    "responsibilities": [
      "Develop user interfaces using React.js",
      "Optimize application performance",
      "Work closely with backend teams for API integration"
    ],
    "requiredSkills": ["React", "JavaScript", "HTML", "CSS"],
    "salaryRange": "₹4,50,000 - ₹8,00,000 per annum",
    "workMode": "Hybrid",
    "location": "Mumbai, Maharashtra",
    "lastDateToApply": "2025-03-15"
  }
]
```

---

### **Error Responses:**

1. **Status Code:** `500 Internal Server Error`  
   **Response:**
   ```json
   {
     "message": "Error fetching job cards",
     "error": "Detailed error message here"
   }
   ```

---

### **5. Job Applications - Record Swipe Action**

**HTTP Method:** `POST`  
**URL:** `/api/developer/jobs`  
**Description:**  
This API records swipe actions when a developer interacts with job postings. Developers can:
- **Swipe Right:** Apply for the job.
- **Swipe Left:** Reject the job.
- **Swipe Top:** Mark the job as "on hold" for later consideration.

---

### **Request:**

**Headers:**
- `Authorization: Bearer <JWT_TOKEN>`
- `Content-Type: application/json`

**Body Parameters:**

| Parameter    | Type   | Description                                           |
|--------------|--------|-------------------------------------------------------|
| `jobId`      | String | The ID of the job being swiped on.                    |
| `action`     | String | The swipe action: `'swipeRight'`, `'swipeLeft'`, or `'swipeTop'`. |

---

**Example Request (Swipe Right - Apply for Job):**
```json
{
  "jobId": "64bfd0e7c9f8392c7a1e1f8b",
  "action": "swipeRight"
}
```

**Example Request (Swipe Left - Reject Job):**
```json
{
  "jobId": "64bfc0e7c9f8392c7a1e1e7a",
  "action": "swipeLeft"
}
```

**Example Request (Swipe Top - Mark Job on Hold):**
```json
{
  "jobId": "64bfc0e7c9f8392c7a1e1e7a",
  "action": "swipeTop"
}
```

---

### **Response:**

**Status Code:** `200 OK`

**Response Body (JSON):**
```json
{
  "message": "Swipe action recorded successfully"
}
```

---

### **Swipe Action Logic:**

1. **Swipe Right (`swipeRight`):**
   - The job ID is added to the developer's **applied** list.
   - The developer's ID is added to the job's **applied** list in the company’s job application data.

2. **Swipe Left (`swipeLeft`):**
   - The job ID is added to the developer's **rejected** list.

3. **Swipe Top (`swipeTop`):**
   - The job ID is added to the developer's **underHold** list (for jobs the developer wants to revisit later).

---

### **Error Responses:**

1. **Status Code:** `500 Internal Server Error`  
   **Response:**
   ```json
   {
     "message": "Error recording swipe action",
     "error": "Detailed error message here"
   }
   ```

---


### **6. Get Developer Connections**

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

### **7. Update Developer Connections**

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

### **8. Job Applications - Get All Applications**

**HTTP Method:** `GET`  
**URL:** `/api/developer/applications`  
**Description:**  
This API fetches all job applications for the logged-in developer, categorized by their current status:
- On Hold
- Rejected
- Applied
- Under Process
- Hired

---

### **Request:**

**Headers:**
- `Authorization: Bearer <JWT_TOKEN>`

---

### **Response:**

**Status Code:** `200 OK`

**Response Body (JSON):**
```json
{
  "onHoldApplications": [
    {
      "companyName": "TCS",
      "jobId": "64bfd0e7c9f8392c7a1e1f8b",
      "jobTitle": "Backend Developer",
      "jobDescription": "Design and implement scalable backend services.",
      "responsibilities": [
        "Build RESTful APIs using Node.js",
        "Integrate with frontend using GraphQL"
      ],
      "requiredSkills": ["Node.js", "Express.js", "MongoDB"],
      "salaryRange": "₹5,00,000 - ₹8,00,000 per annum",
      "workMode": "Remote",
      "location": "Bengaluru, Karnataka",
      "lastDateToApply": "2025-03-01"
    }
  ],
  "rejectedApplications": [],
  "appliedApplications": [
    {
      "companyName": "Infosys",
      "jobId": "64bfc0e7c9f8392c7a1e1e7a",
      "jobTitle": "Frontend Developer",
      "jobDescription": "Develop modern and responsive user interfaces.",
      "responsibilities": [
        "Work with React.js and TypeScript",
        "Optimize UI performance for better UX"
      ],
      "requiredSkills": ["React.js", "JavaScript", "HTML/CSS"],
      "salaryRange": "₹4,50,000 - ₹7,50,000 per annum",
      "workMode": "Hybrid",
      "location": "Pune, Maharashtra",
      "lastDateToApply": "2025-03-15"
    }
  ],
  "underProcessApplications": [],
  "hiredApplications": []
}
```

---

### **Error Responses:**

1. **Status Code:** `500 Internal Server Error`  
   **Response:**
   ```json
   {
     "message": "Error fetching developer applications",
     "error": "Detailed error message here"
   }
   ```

---

### **9. Job Applications - Update Application Status**

**HTTP Method:** `PUT`  
**URL:** `/api/developer/applications`  
**Description:**  
This API updates the status of a developer's job application based on the action:
- **Reject:** Move the job to the rejected list.
- **Apply:** Move the job to the applied list.
- **Delete:** Remove the job from on-hold or rejected lists.

---

### **Request:**

**Headers:**
- `Authorization: Bearer <JWT_TOKEN>`
- `Content-Type: application/json`

**Body Parameters:**

| Parameter    | Type   | Description                                                                 |
|--------------|--------|-----------------------------------------------------------------------------|
| `jobId`      | String | The ID of the job whose status is being updated.                             |
| `action`     | String | The action to perform: `'reject'`, `'apply'`, or `'delete'`.                 |

---

**Example Request (Reject On-Hold Job):**
```json
{
  "jobId": "64bfd0e7c9f8392c7a1e1f8b",
  "action": "reject"
}
```

**Example Request (Apply to Rejected Job):**
```json
{
  "jobId": "64bfc0e7c9f8392c7a1e1e7a",
  "action": "apply"
}
```

**Example Request (Delete On-Hold Job):**
```json
{
  "jobId": "64bfc0e7c9f8392c7a1e1e7a",
  "action": "delete"
}
```

---

### **Response:**

**Status Code:** `200 OK`

**Response Body (JSON):**
```json
{
  "message": "Job application updated successfully"
}
```

---

### **Update Application Logic:**

1. **Reject (`reject`):**
   - Moves the job from **On Hold** to **Rejected** if the application deadline hasn't passed.

2. **Apply (`apply`):**
   - Moves the job from **On Hold** or **Rejected** to **Applied** if the application deadline hasn't passed.
   - Also updates the company's job applications to reflect the developer's application.

3. **Delete (`delete`):**
   - Removes the job from **On Hold** or **Rejected** lists.

---

### **Error Responses:**

1. **Status Code:** `400 Bad Request`  
   **Response:** (When the application deadline has passed)
   ```json
   {
     "message": "Cannot apply to the job. Application deadline has passed."
   }
   ```

2. **Status Code:** `404 Not Found`  
   **Response:** (When no application data is found)
   ```json
   {
     "message": "No application data found for the logged-in user"
   }
   ```

3. **Status Code:** `500 Internal Server Error`  
   **Response:** 
   ```json
   {
     "message": "Error updating developer applications",
     "error": "Detailed error message here"
   }
   ```

---


### **10. Get Developer Profile**

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

### *11. Update Developer Profile**

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

### **12. Update Developer Email**

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

### **13. Change Developer Password**

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

### **14. Update Developer Phone Number**

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

### **15. Delete Developer Account**

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

