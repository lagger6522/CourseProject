USE QUEUEDB;

-- Удаление таблицы "Users"
IF OBJECT_ID('Users', 'U') IS NOT NULL
    DROP TABLE Users;
-- Удаление таблицы "Patients"
IF OBJECT_ID('Patients', 'U') IS NOT NULL
    DROP TABLE Patients;

IF OBJECT_ID('Hospitals', 'U') IS NOT NULL
    DROP TABLE Hospitals;

		

	INSERT INTO Users (FirstName, LastName, MiddleName, Email, Password, Role)
VALUES ('Admin', 'Admin', 'Admin', 'Admin@mail.ru', '123', 'Admin');
	
INSERT INTO Users (FirstName, LastName, MiddleName, Email, Password, Role)
VALUES ('Admin', 'Admin', 'Admin', 'Chief@mail.ru', '123', 'Chief Medical Officer');

	
INSERT INTO Users (FirstName, LastName, MiddleName, Email, Password, Role)
VALUES ('Admin', 'Admin', 'Admin', 'Chief@mail.ru', '123', 'Chief Medical Officer');
	
	
INSERT INTO Users (FirstName, LastName, MiddleName, Email, Password, Role) 
VALUES ('Doc', 'Doc', 'Doc', 'Doctor@mail.ru', '123', 'Doctor');
	
	select * from Users
	select * from Patients
	select * from Hospitals
	
CREATE TABLE Talon(
	TalonID INT PRIMARY KEY IDENTITY(1,1),
	PatientID INT NOT NULL FOREIGN KEY REFERENCES Patients(PatientID),
	OrderTime TIME NOT NULL,
	ScheduleDayID INT NOT NULL FOREIGN KEY REFERENCES Schedules(ScheduleID),
);

CREATE TABLE Users (
    UserID INT PRIMARY KEY IDENTITY(1,1),
    FirstName NVARCHAR(50) NOT NULL,
    LastName NVARCHAR(50) NOT NULL,
    MiddleName NVARCHAR(50) NOT NULL,
    Password NVARCHAR(256) UNIQUE NOT NULL,
    Email NVARCHAR(100) NOT NULL,
	Role NVARCHAR(50) NOT NULL DEFAULT 'User' CHECK(Role IN ('User', 'Doctor', 'Chief Medical Officer', 'Admin')),
	Specialization NVARCHAR(100) NULL,
);

CREATE TABLE Patients (
    PatientID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT NOT NULL FOREIGN KEY REFERENCES Users(UserID),
    FirstName NVARCHAR(50) NOT NULL,
    LastName NVARCHAR(50) NOT NULL,
    MiddleName NVARCHAR(50) NOT NULL,
    BirthDate DATE NOT NULL,
    Gender NVARCHAR(10) NOT NULL CHECK(Gender IN ('Male', 'Female')),
    CONSTRAINT FK_Patients_Users FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

CREATE TABLE Hospitals (
    HospitalID INT PRIMARY KEY IDENTITY(1,1),
    ClinicName NVARCHAR(100) NOT NULL,
    City NVARCHAR(50) NOT NULL,
    Street NVARCHAR(50) NOT NULL,
    HouseNumber NVARCHAR(10) NOT NULL,
    RegistrationNumber NVARCHAR(20) NOT NULL,
    WorkingHours NVARCHAR(100) NOT NULL,
    ClinicType NVARCHAR(20) CHECK(ClinicType IN ('Adult', 'Pediatric', 'Specialized')) NOT NULL
);

CREATE TABLE Schedules (
    ScheduleID INT PRIMARY KEY IDENTITY(1,1),
    DoctorID INT NOT NULL FOREIGN KEY REFERENCES Users(UserID),
    DayOfWeek NVARCHAR(20) NOT NULL CHECK(DayOfWeek IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')),
    StartTime TIME NOT NULL,
    EndTime TIME NOT NULL,
    LunchBreakStart TIME NULL,
    LunchBreakEnd TIME NULL,
    CONSTRAINT FK_Schedules_Users FOREIGN KEY (DoctorID) REFERENCES Users(UserID)
);
