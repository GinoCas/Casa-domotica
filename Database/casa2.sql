CREATE DATABASE CasaDB;

USE CasaDB;

CREATE TABLE device(
	devi_id INT NOT NULL IDENTITY(1,1),
	devi_pin INT NOT NULL, 
	devi_state BIT DEFAULT(0) NOT NULL,
	devi_type VARCHAR(50),
	devi_name VARCHAR(100),
	devi_description VARCHAR(100),
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
	aude_automationId INT NOT NULL,
	aude_deviceId INT NOT NULL,
	FOREIGN KEY(aude_automationId) REFERENCES automation(auto_id),
	FOREIGN KEY(aude_deviceId) REFERENCES device(devi_id),
	PRIMARY KEY(aude_id)
);

CREATE TABLE dimmable(
	dimm_id INT NOT NULL IDENTITY(1,1),
	dimm_deviceId INT NOT NULL,
	dimm_brightness INT NOT NULL,
	FOREIGN KEY(dimm_deviceId) REFERENCES device(devi_id),
	PRIMARY KEY(dimm_id)
);

CREATE TABLE velocity(
	velo_id INT NOT NULL IDENTITY(1,1),
	velo_speed INT NOT NULL,
	velo_deviceId INT NOT NULL,
	FOREIGN KEY(velo_deviceId) REFERENCES device(devi_id),
	PRIMARY KEY(velo_id)
);

INSERT INTO device (devi_pin, devi_state, devi_type, devi_name, devi_description)
VALUES 
(2, 1, 'Led', 'Luz LED 2', 'Dispositivo LED en pin 2'),
(3, 0, 'Led', 'Luz LED 3', 'Dispositivo LED en pin 3'),
(4, 1, 'Led', 'Luz LED 4', 'Dispositivo LED en pin 4'),
(5, 0, 'Led', 'Luz LED 5', 'Dispositivo LED en pin 5'),
(6, 1, 'Led', 'Luz LED 6', 'Dispositivo LED en pin 6'),
(7, 0, 'Led', 'Luz LED 7', 'Dispositivo LED en pin 7'),
(8, 1, 'Led', 'Luz LED 8', 'Dispositivo LED en pin 8'),
(9, 0, 'Led', 'Luz LED 9', 'Dispositivo LED en pin 9'),
(10, 1, 'Led', 'Luz LED 10', 'Dispositivo LED en pin 10'),
(11, 0, 'Led', 'Luz LED 11', 'Dispositivo LED en pin 11'),
(12, 1, 'Led', 'Luz LED 12', 'Dispositivo LED en pin 12'),
(13, 0, 'Led', 'Luz LED 13', 'Dispositivo LED en pin 13');


INSERT INTO dimmable(dimm_deviceId, dimm_brightness)
VALUES
(2, 100),
(6, 100),
(10, 100);


CREATE PROCEDURE sp_get_dimmable_devices_from_type
	@devi_type VARCHAR(50)
AS BEGIN
	SELECT device.* FROM device
	JOIN dimmable ON devi_id = dimm_deviceId
	WHERE devi_type = @devi_type
END;

EXEC sp_get_dimmable_devices_from_type 'LED';