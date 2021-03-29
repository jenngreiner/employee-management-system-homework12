// TODO: require()
const inquirer = require('inquirer');
const mysql = require('mysql');

// TODO: set up server / DB tables
const connection = mysql.createConnection({
    host: 'localhost',

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: 'root',

    // Be sure to update with your own MySQL password!
    password: 'rootbeer',
    database: 'employeeTrackerDB',
});

connection.connect((err) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}`);
    start();
});

// TODO: Inquirer prompt
const start = () => {
    inquirer.prompt(
        {
            type: 'list',
            name: 'task',
            message: "What would you like to do?",
            choices: ['View all Employees', 'View Employees by Department', 'View Employees by Role', 'Add Employee', 'Add Department', 'Add Role', 'Update Employee Role', 'Update Employee Manager', 'Remove Employee', 'Exit']
        }
    ).then((answer) => {
        switch (answer.task) {
            case 'View all Employees':
                viewAllEmployees();
                break;

            case 'View Employees by Department':
                viewByDepartment();
                break;

            case 'View Employees by Role':
                viewByRole();
                break;

            case 'Add Department':
                addDepartment();
                break;

            case 'Add Employee':
                addEmployee();
                break;

            case 'Add Role':
                addRole();
                break;

            // case 'Update Employee Role':
            //     updateRole();
            //     break;

            case 'Exit':
                connection.end();
                break;

            default:
                console.log(`Invalid action: ${answer.action}`);
                break;
        }
    }
    )
};

// View all Employees
const viewAllEmployees = () => {
    // Query to return ID, first name, last name, role, salary, department, and manager name for all employees in the database
    const query = "SELECT employees.id, employees.first_name, employees.last_name, role.title, role.salary, department.department, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager FROM employees INNER JOIN role on role.id = employees.role_id INNER JOIN department on department.id = role.department_id left join employees e on employees.manager_id = e.id ORDER BY employees.id ASC";
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        start();
    })
};

const viewAllRoles = () => {
    // Query to return list of roles in the database
    const query = "SELECT * FROM role";
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        start();
    })
};

// Query to list of departments in the database
const viewAllDepartments = () => {
    const query = "SELECT * FROM department";
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        start();
    })
};

// View all employees in a department
const viewByDepartment = () => {
    // prompt for which department they want to view
    inquirer.prompt(
        {
            type: 'list',
            name: 'department',
            message: 'Select a department.',
            choices: ['Sales', 'Engineering', 'Finance', 'Legal']
        }
    ).then((answer) => {
        // Return data for department chosen above
        const query = `SELECT  employees.id, employees.first_name, employees.last_name, department.department, role.title, role.salary, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager 
        FROM employees 
        INNER JOIN role on role.id = employees.role_id 
        INNER JOIN department on department.id = role.department_id 
        left join employees e on employees.manager_id = e.id
        WHERE department.department = '${answer.department}'`;
        connection.query(query, (err, res) => {
            if (err) throw err;
            console.table(res);
            start();
        })
    })
};

// View employees in a specific role
const viewByRole = () => {
    // Inquirer which role they want to view
    inquirer.prompt(
        {
            type: 'list',
            name: 'role',
            message: 'Select a Role.',
            choices: ['Sales Lead', 'Salesperson', 'Lead Engineer', 'Software Accountant', 'Legal Team Lead', 'Lawyer']
        }
    ).then((answer) => {
        // Return list of employee data for role chosen above
        const query = `SELECT employees.id, employees.first_name, employees.last_name, department.department, role.title, role.salary, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager 
        FROM employees 
        INNER JOIN role on role.id = employees.role_id 
        INNER JOIN department on department.id = role.department_id
        left join employees e on employees.manager_id = e.id 
        WHERE role.title = '${answer.role}'`;
        connection.query(query, (err, res) => {
            if (err) throw err;
            console.table(res);
            start();
        })
    })
};

// Query to get list of managers from DB for addEmployee function
var managerArray = [];
function selectManager() {
    const query = `SELECT CONCAT(e.first_name, ' ' ,e.last_name) AS Manager
    FROM employees
    left join employees e on employees.manager_id = e.id
    WHERE employees.manager_id IS NOT NULL`
    connection.query(query, function (err, res) {
        if (err) throw err
        for (var i = 0; i < res.length; i++) {
            managerArray.push(res[i].Manager);
        };
    });
    return managerArray;
};

// Add a new employee to the DB
const addEmployee = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: 'What is the employees first name?'
        },
        {
            type: 'input',
            name: 'lastName',
            message: 'What is the employees last name?'
        },
    ]).then((answer) => {
        // when finished prompting, insert a new item into the db with that info
        connection.query(`INSERT INTO employees (first_name, last_name) VALUES ("${answer.firstName}", "${answer.lastName}")`, (err, res) => {
            if (err) throw err;
            console.log(`${answer.firstName} ${answer.lastName} was added successfully.`);
            start();
        }
        );
    });
};

// Create array of departments
let departmentArr = [];
// Query all departments
const selectDept = () => {
    connection.query('SELECT * FROM department', (err, res) => {
        if (err) throw err
        // Place all departments in array
        for (i = 0; i < res.length; i++) {
            departmentArr.push(res[i].department);
        }
        return departmentArr;
    });
};

const addRole = () => {
    inquirer.prompt([
        {// name of new role
            type: 'input',
            name: 'newRole',
            message: 'What role would you like to add?'
        },
        {// salary for new role
            type: 'input',
            name: 'roleSalary',
            message: 'Enter the salary for the role.'
        }
    ]).then((answer) => {
        const query = `INSERT INTO role (title, salary) VALUES ("${answer.newRole}", ${answer.roleSalary})`;
        connection.query(query, (err, res) => {
            if (err) throw err;
            console.log(`ROLE ${answer.newRole} successfully added\n`);
            viewAllRoles();
        })
    });
};

// Add a new department to the DB
const addDepartment = () => {
    inquirer.prompt(
        {
            type: 'input',
            name: 'department',
            message: 'Enter the Department name'
        }).then((answer) => {
            connection.query(
                'INSERT INTO department SET ?',
                {
                    department: answer.department,
                },
                (err) => {
                    if (err) throw err;
                    // query and console table the list of departments
                    viewAllDepartments();
                }
            );
        })
}


// // Update an employee's role
// const updateRole = () => {
//     viewAllEmployees();
//     inquirer.prompt(
//         {
//             type: 'list',
//             name: 'employee',
//             message: 'Select an employee.',
//             choices: [1, 2, 3, 4, 5, 6, 7, 8]
//         },
//         {
//             type: 'list',
//             name: 'role',
//             message: 'What is the employees role?',
//             choices: selectRole()
//         }
//     ) // TODO Update function
// };