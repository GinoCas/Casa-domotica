CREATE DATABASE CasaDB;
USE CasaDB;

DROP TABLE IF EXISTS automation_device;
DROP TABLE IF EXISTS device;
DROP TABLE IF EXISTS automation;

CREATE TABLE device(
	devi_id INT NOT NULL IDENTITY(1,1),
	devi_pin INT NOT NULL, 
	devi_state BIT DEFAULT(0) NOT NULL,
	PRIMARY KEY(devi_id)
);

CREATE TABLE automation(
	auto_id INT NOT NULL IDENTITY(1,1),
	auto_state BIT DEFAULT(0) NOT NULL,
	auto_initTime TIME NOT NULL,
	auto_endTime TIME NOT NULL,
	PRIMARY KEY(auto_id)
);

CREATE TABLE automation_device(
	aude_id INT NOT NULL IDENTITY(1,1), 
	aude_state BIT DEFAULT(0) NOT NULL,
	auto_id INT NOT NULL,
	devi_id INT NOT NULL,
	FOREIGN KEY(auto_id) REFERENCES automation(auto_id),
	FOREIGN KEY(devi_id) REFERENCES device(devi_id),
	PRIMARY KEY(aude_id)
);

INSERT INTO device(devi_pin, devi_state)
VALUES 
(2, 0),
(3, 0),
(4, 0),
(5, 0),
(6, 0),
(7, 0),
(8, 0),
(9, 0),
(12, 0),
(13, 0);