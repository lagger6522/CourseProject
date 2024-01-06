USE QUEUEDB;

-- Удаление таблицы "Users"
IF OBJECT_ID('Users', 'U') IS NOT NULL
    DROP TABLE Users;
-- Удаление таблицы "Patients"
IF OBJECT_ID('Patients', 'U') IS NOT NULL
    DROP TABLE Patients;

		

	INSERT INTO Users (Email, Password, Role)
VALUES ('Admin@mail.ru', '123', 'Admin');
	
	select * from Users
	select * from Patients
	select * from Hospitals
	

CREATE TABLE Users (
    UserID INT PRIMARY KEY IDENTITY(1,1),
    Password NVARCHAR(256) NOT NULL,
    Email NVARCHAR(100) NOT NULL,
	Role NVARCHAR(50) NOT NULL DEFAULT 'User' CHECK(Role IN ('User', 'Doctor', 'Chief Medical Officer', 'Admin'))
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
