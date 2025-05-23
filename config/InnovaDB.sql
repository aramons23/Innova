
CREATE DATABASE InnovaDB;
USE InnovaDB;

CREATE TABLE Users(
	IdUser INT PRIMARY KEY NOT NULL,
	NameUser VARCHAR(50),
	LastNameUser VARCHAR(50),
	EmailUser VARCHAR(25),
	PasswordUser VARCHAR(255)
);

CREATE TABLE Favorites(
IdVideo INT PRIMARY KEY NOT NULL,
TitleVideo VARCHAR(100),
URLVideo VARCHAR(255),
IdUser INT,
FOREIGN KEY (IdUser) REFERENCES Users(IdUser)
);

ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root2310'; 

SELECT * FROM Users;
