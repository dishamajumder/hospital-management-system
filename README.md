# 🏥 Hospital Management System
### Full Stack Application | React + Spring Boot + MySQL
**21CSC205P Database Management Systems Mini Project**
Srilekha Kramadhati | Disha Majumder | SRM IST

---

## 📁 PROJECT STRUCTURE

```
hospital-management/
│
├── backend/                        ← Spring Boot (Java)
│   ├── pom.xml                     ← Maven dependencies
│   └── src/main/java/com/hospital/
│       ├── HospitalManagementApplication.java   ← Main entry point
│       ├── WebConfig.java                       ← CORS config
│       ├── model/                  ← Entity classes (map to DB tables)
│       │   ├── Patient.java
│       │   ├── Doctor.java
│       │   ├── Appointment.java
│       │   ├── MedicalRecord.java
│       │   └── Billing.java
│       ├── repository/             ← Spring Data JPA (DB queries)
│       │   ├── PatientRepository.java
│       │   ├── DoctorRepository.java
│       │   ├── AppointmentRepository.java
│       │   ├── MedicalRecordRepository.java
│       │   └── BillingRepository.java
│       ├── service/                ← Business logic layer
│       │   ├── PatientService.java
│       │   ├── DoctorService.java
│       │   ├── AppointmentService.java
│       │   ├── MedicalRecordService.java
│       │   └── BillingService.java
│       └── controller/             ← REST API endpoints
│           ├── PatientController.java
│           ├── DoctorController.java
│           ├── AppointmentController.java
│           ├── MedicalRecordController.java
│           └── BillingController.java
│
├── frontend/                       ← React (JavaScript)
│   ├── package.json
│   └── src/
│       ├── App.js                  ← Main app + routing
│       ├── App.css                 ← Global styles
│       ├── index.js                ← React entry point
│       ├── services/
│       │   └── api.js              ← All Axios API calls
│       └── pages/
│           ├── PatientsPage.jsx    ← Patient CRUD
│           ├── DoctorsPage.jsx     ← Doctor CRUD
│           ├── AppointmentsPage.jsx← Book & manage appointments
│           ├── MedicalRecordsPage.jsx ← Add medical records
│           └── BillingPage.jsx     ← Generate & pay bills
```

---

## ⚙️ SETUP INSTRUCTIONS

### STEP 1: Prerequisites
Install these before starting:
- ✅ Java 17+ (`java -version`)
- ✅ Maven 3.8+ (`mvn -version`)
- ✅ Node.js 18+ (`node -v`)
- ✅ MySQL 8+ (running on port 3306)
- ✅ MySQL Workbench (optional, to view data)

---

### STEP 2: Set Up the MySQL Database
1. Open MySQL Workbench or MySQL CLI
2. Run your existing project SQL scripts to create the database:
   ```sql
   CREATE DATABASE Hospital_Management_System;
   -- Then run all your CREATE TABLE statements from Chapter 2
   ```
3. Insert sample data from Chapter 2 of your report

---

### STEP 3: Configure Backend Database Password

Open this file:
```
backend/src/main/resources/application.properties
```

Change these lines to match YOUR MySQL credentials:
```properties
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD_HERE
```

---

### STEP 4: Run the Spring Boot Backend

Open a terminal in the `backend/` folder:

```bash
# Navigate to backend folder
cd hospital-management/backend

# Build and run (first run may take 2-3 minutes to download dependencies)
mvn spring-boot:run
```

✅ **Success message:**
```
✅ Hospital Management System Backend Started!
📡 API running at: http://localhost:8080/api
```

**Test the API:** Open browser → `http://localhost:8080/api/patients`
- If you see `[]` (empty array) → Backend is working!
- If you see your patient data → Even better!

---

### STEP 5: Run the React Frontend

Open a **NEW terminal** in the `frontend/` folder:

```bash
# Navigate to frontend folder
cd hospital-management/frontend

# Install npm packages (first time only)
npm install

# Start the React development server
npm start
```

✅ **Success:** Browser opens automatically at `http://localhost:3000`

---

## 🌐 API ENDPOINTS REFERENCE

All APIs return JSON. Base URL: `http://localhost:8080/api`

### Patients
| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/patients` | Get all patients |
| GET | `/api/patients/{id}` | Get patient by ID |
| POST | `/api/patients` | Add new patient |
| PUT | `/api/patients/{id}` | Update patient |
| DELETE | `/api/patients/{id}` | Delete patient |

### Doctors
| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/doctors` | Get all doctors |
| POST | `/api/doctors` | Add new doctor |
| DELETE | `/api/doctors/{id}` | Delete doctor |

### Appointments
| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/appointments` | Get all appointments |
| POST | `/api/appointments` | Book appointment |
| PUT | `/api/appointments/{id}/status` | Update status |

### Medical Records
| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/medical-records` | Get all records |
| POST | `/api/medical-records` | Add record |

### Billing
| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/billing` | Get all bills |
| GET | `/api/billing/pending` | Get pending bills |
| POST | `/api/billing` | Generate bill |
| PUT | `/api/billing/{id}/pay` | Mark as paid |

---

## 🔁 HOW DATA FLOWS (For Viva)

```
User fills form in React
       ↓
React calls Axios (api.js)
       ↓
HTTP Request → Spring Boot Controller (port 8080)
       ↓
Controller calls Service (business logic)
       ↓
Service calls Repository (Spring Data JPA)
       ↓
JPA executes SQL → MySQL Database
       ↓
Result travels back up the same chain
       ↓
React receives JSON → displays in table
```

---

## 🏗️ ARCHITECTURE (For Viva)

**Backend Layers:**
1. **Controller** → Receives HTTP requests, returns JSON responses
2. **Service** → Business logic, validation rules
3. **Repository** → Database operations (JPA handles SQL automatically)
4. **Model** → Java classes that map to MySQL tables

**Key Concepts:**
- `@RestController` → Marks class as REST API controller
- `@Service` → Business logic component
- `@Repository` → Data access layer
- `@Entity` → Maps Java class to DB table
- `@Autowired` → Spring injects dependencies automatically (IoC)
- `JpaRepository` → Provides CRUD methods without writing SQL

---

## ⚠️ TROUBLESHOOTING

**Backend won't start:**
- Check MySQL is running: `sudo service mysql start`
- Check password in `application.properties`
- Check database `Hospital_Management_System` exists

**Frontend can't connect to backend:**
- Make sure backend is running on port 8080
- Check browser console (F12) for CORS errors
- Verify `api.js` has `baseURL: 'http://localhost:8080/api'`

**`validate` error on startup:**
- This means JPA can't find your tables
- Make sure you've run the CREATE TABLE SQL scripts first
- Change `spring.jpa.hibernate.ddl-auto=validate` to `update` temporarily

---

## 📚 TECHNOLOGIES USED

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Database | MySQL 8 | Store all hospital data |
| ORM | Spring Data JPA + Hibernate | Java ↔ SQL mapping |
| Backend | Spring Boot 3.2 | REST API server |
| Build Tool | Maven | Java dependency management |
| Frontend | React 18 | UI components |
| HTTP Client | Axios | API calls from React |
| Routing | React Router v6 | Page navigation |
| Styling | Custom CSS | UI design |
