USE master;
GO

ALTER DATABASE CasaDB SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
GO

DROP DATABASE CasaDB;
GO

CREATE DATABASE CasaDB;
GO

USE CasaDB;
GO

CREATE TABLE device(
	devi_id INT NOT NULL,
	devi_state BIT DEFAULT(0) NOT NULL,
	devi_type VARCHAR(50),
	devi_name VARCHAR(100),
	devi_description VARCHAR(100),
	PRIMARY KEY(devi_id),
);

CREATE TABLE room(
	room_id INT NOT NULL IDENTITY(1,1),
	room_name VARCHAR(100), 
	PRIMARY KEY(room_id)
);

CREATE TABLE room_device(
	rode_id INT NOT NULL IDENTITY(1,1),
	rode_roomId INT NOT NULL,
	rode_deviceId INT NOT NULL,
	FOREIGN KEY(rode_roomId) REFERENCES room(room_id),
	FOREIGN KEY(rode_deviceId) REFERENCES device(devi_id),
	PRIMARY KEY(rode_id)
);

CREATE TABLE automation(
	auto_id INT NOT NULL IDENTITY(1,1),
	auto_state BIT DEFAULT(0) NOT NULL,
	auto_name VARCHAR(100) DEFAULT('New Automation'),
	auto_description VARCHAR(100) DEFAULT('Description'),
	auto_initTime TIME NOT NULL,
	auto_endTime TIME NOT NULL,
	PRIMARY KEY(auto_id)
);

CREATE TABLE automation_device(
	aude_id INT NOT NULL IDENTITY(1,1), 
	aude_state BIT DEFAULT(0) NOT NULL,
	aude_automationId INT NOT NULL,
	aude_deviceId INT NOT NULL,
	PRIMARY KEY(aude_id),
	CONSTRAINT FK_aude_automationId FOREIGN KEY (aude_automationId)
        REFERENCES automation(auto_id)
        ON DELETE CASCADE,
    CONSTRAINT FK_aude_deviceId FOREIGN KEY (aude_deviceId)
        REFERENCES device(devi_id)
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
	velo_deviceId INT NOT NULL,
	velo_speed INT NOT NULL,
	FOREIGN KEY(velo_deviceId) REFERENCES device(devi_id),
	PRIMARY KEY(velo_id)
);

INSERT INTO room (room_name) VALUES
('Todas'),
('Sala'),
('Habitacion Azul'),
('Habitacion Marron'),
('Patio'),
('Garage'),
('Ba�o'),
('Cocina'),
('Comedor');

INSERT INTO automation (auto_state, auto_name, auto_description, auto_initTime, auto_endTime)
VALUES (1, 'Luces Nocturnas', 'Encender luces exteriores', '19:00', '23:59');


-- Eliminar relaciones que dependen de otras tablas
DELETE FROM automation_device;
DELETE FROM room_device;

-- Eliminar capacidades
DELETE FROM dimmable;
DELETE FROM velocity;

-- Eliminar automatizaciones
DELETE FROM automation;

-- Eliminar dispositivos
DELETE FROM device;

SELECT * FROM device;
SELECT * FROM velocity;
SELECT * FROM dimmable;