CREATE DATABASE CasaDB;

USE CasaDB;

CREATE TABLE device(
	devi_id INT NOT NULL IDENTITY(1,1),
	devi_arduinoId INT NOT NULL,
	devi_state BIT DEFAULT(0) NOT NULL,
	devi_type VARCHAR(50),
	devi_name VARCHAR(100),
	devi_description VARCHAR(100),
	PRIMARY KEY(devi_id)
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


UPDATE device
SET devi_name = 'Ventilador', devi_description = 'Dispositivo FAN en pin 6'
WHERE devi_id = 6;

INSERT INTO dimmable(dimm_deviceId, dimm_brightness)
VALUES
(2, 100),
(4, 100),
(10, 100);

INSERT INTO velocity(velo_deviceId, velo_speed)
VALUES
(6, 5);


CREATE PROCEDURE sp_get_dimmable_devices_from_type
	@devi_type VARCHAR(50)
AS BEGIN
	SELECT device.* FROM device
	JOIN dimmable ON devi_id = dimm_deviceId
	WHERE devi_type = @devi_type
END;

SELECT * FROM velocity;

EXEC sp_get_dimmable_devices_from_type 'LED';

INSERT INTO room (room_name) VALUES
('Todas'),
('Sala'),
('Habitacion Azul'),
('Habitacion Marron'),
('Patio'),
('Garage'),
('Baño'),
('Cocina'),
('Comedor');

-- Relacionar habitaciones con dispositivos
-- Habitación 1 (Todas) con sus dispositivos
INSERT INTO room_device (rode_roomId, rode_deviceId) VALUES
(1, 2),
(1, 3),
(1, 4),
(1, 5),
(1, 6),
(1, 7),
(1, 8),
(1, 12),
(1, 13);

-- Habitación 2 (Sala) con sus dispositivos
INSERT INTO room_device (rode_roomId, rode_deviceId) VALUES
(2, 6),
(2, 8);

-- Habitación 3 (Habitacion Azul) con sus dispositivos
INSERT INTO room_device (rode_roomId, rode_deviceId) VALUES
(3, 2);

-- Habitación 4 (Habitacion Marron) con sus dispositivos
INSERT INTO room_device (rode_roomId, rode_deviceId) VALUES
(4, 5);

-- Habitación 5 (Patio) con sus dispositivos
INSERT INTO room_device (rode_roomId, rode_deviceId) VALUES
(5, 7);

-- Habitación 6 (Garage) con sus dispositivos
INSERT INTO room_device (rode_roomId, rode_deviceId) VALUES
(6, 12);

-- Habitación 7 (Baño) con sus dispositivos
INSERT INTO room_device (rode_roomId, rode_deviceId) VALUES
(7, 13);

-- Habitación 8 (Cocina) con sus dispositivos
INSERT INTO room_device (rode_roomId, rode_deviceId) VALUES
(8, 3);

-- Habitación 9 (Comedor) con sus dispositivos
INSERT INTO room_device (rode_roomId, rode_deviceId) VALUES
(9, 4);

-- Automatizacion 1
INSERT INTO automation (auto_state, auto_name, auto_description, auto_initTime, auto_endTime)
VALUES (1, 'Luces Nocturnas', 'Encender luces exteriores', '19:00', '23:59');

INSERT INTO automation_device(aude_state, aude_automationId, aude_deviceId)
VALUES (1, 1, 5);


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

-- Opcional: eliminar habitaciones
-- DELETE FROM room;

-- Reiniciar los contadores IDENTITY
DBCC CHECKIDENT ('device', RESEED, 0);
DBCC CHECKIDENT ('dimmable', RESEED, 0);
DBCC CHECKIDENT ('velocity', RESEED, 0);
DBCC CHECKIDENT ('automation', RESEED, 0);
DBCC CHECKIDENT ('automation_device', RESEED, 0);
DBCC CHECKIDENT ('room_device', RESEED, 0);

SELECT * FROM device;
SELECT * FROM dimmable;