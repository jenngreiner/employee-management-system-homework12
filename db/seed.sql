USE employeeTrackerDB;

INSERT INTO role(id, title, salary)
VALUES (1, "Sales Lead", 120000),
    (2, "Salesperson", 75000),
    (3, "Lead Engineer", 150000),
    (4, "Software Engineer", 110000),
    (5, "Accountant", 75000),
    (6, "Legal Team lead", 120000),
    (7, "Lawyer", 110000);

INSERT INTO department(department)
VALUES ("Sales"), ("Engineering"), ("Finance"), ("Legal");

INSERT INTO employees(first_name, last_name, role_id, manager_id)
VALUES ("Ben", "Barone", 3, NULL),
    ("Amy", "Lee", 4, 1),
    ("Mike", "O'Neil", 1, NULL),
    ("Kara", "Hardister", 2, 3),
    ("Holly", "Murphy", 5, NULL),
    ("Tom", "Bennett", 6, NULL),
    ("Tim", "Kern", 7, 4);