DROP DATABASE IF EXISTS employeeTrackerDB;
CREATE database employeeTrackerDB;

USE employeeTrackerDB;

CREATE TABLE employees (
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
    manager_id INT,
    PRIMARY KEY (id)
);

CREATE TABLE role (
    id INT NOT NULL,
    title VARCHAR(30) NULL,
    salary DECIMAL(10,4) NULL,
    department_id INT NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT,
    department VARCHAR(30) NULL,
    PRIMARY KEY (id)
);

INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ('Jenn', 'Greiner', '2312', '3435');


