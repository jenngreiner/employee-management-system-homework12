USE employeeTrackerDB;

INSERT INTO role(id, title, salary, department_id)
VALUES (1, "Sales Lead", 120000, 1),
    (2, "Salesperson", 75000, 1),
    (3, "Lead Engineer", 150000, 2),
    (4, "Software Engineer", 110000, 2),
    (5, "Accountant", 75000, 3),
    (6, "Legal Team lead", 120000, 4),
    (7, "Lawyer", 110000, 4);

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