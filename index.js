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

            case 'Add Employee':
                addEmployee();
                break;

            case 'Add Department':
                addDepartment();
                break;

            case 'Add Role':
                addRole();
                break;

            case 'Update Employee Role':
                updateRole();
                break;

            // case 'Remove Employee': // bonus
            //     removeEmployee();
            //     break;

            // case 'Update Employee Manager':
            //     updateManager();
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

const viewByDepartment = () => {
    //TODO inquirer which department they want to view
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

// Query to get list of roles from DB for viewByRole and addEmployee functions
var roleArray = [];
function selectRole() {
    const query = `SELECT title FROM role`;
    connection.query(query, function (err, res) {
        if (err) throw err
        for (var i = 0; i < res.length; i++) {
            roleArray.push(res[i].value);
        };
    });
    return roleArray;
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
        // Return data for role chosen above
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

// * Add departments, roles, employees
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
        {
            type: 'list',
            name: 'role',
            message: 'What is the employees role?',
            choices: ['Sales Lead', 'Salesperson', 'Lead Engineer', 'Software Accountant', 'Legal Team Lead', 'Lawyer']
        },
        {
            type: 'list',
            name: 'manager',
            message: 'Who is the employees manager?',
            choices: selectManager()
        }
        // Post Function
    ]).then((answer) => {
        // when finished prompting, insert a new item into the db with that info
        connection.query(
            'INSERT INTO employees SET ?',
            {
                first_name: answer.firstName,
                last_name: answer.lastName,
                role_id: answer.role,
                manager_id: answer.manager,
            },
            (err) => {
                if (err) throw err;
                console.log(`${answer.firstName} ${answer.lastName} was added successfully.`);
                start();
            }
        );
    });
}

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
                    console.log(`Success`);
                    start();
                }
            );
        })
}

//   * Update employee roles
const updateRole = () => {
    inquirer.prompt(
        {
            type: 'list',
            name: 'employee',
            message: 'Select an employee.',
            choices: []
            // // TODO: figure out how to include list of employees from DB
        },
        {
            type: 'list',
            name: 'role',
            message: 'What is the employees role?',
            choices: ['Sales Lead', 'Salesperson', 'Lead Engineer', 'Software Accountant', 'Legal Team Lead', 'Lawyer']
            // select role
        }
    ) // TODO Update function
}

//   * Update employee managers
const updateManager = () => {
    inquirer.prompt(
        {
            type: 'list',
            name: 'employee',
            message: 'Select an employee.',
            choices: []
            // // TODO: figure out how to include list of employees from DB        
        },
        {
            type: 'list',
            name: 'role',
            message: 'Who is the employees manager?',
            choices: []
            // TODO: figure out how to include list of managers from DB
        }
    ) // TODO Update function
}


//BONUS
// * View employees by manager

// const viewByManager = () => { // bonus
//     //TODO inquirer which manager they want to view
//     // inner join
//     const query = 'SELECT * FROM employees';
//     connection.query(query, (err, res) => {
//         if (err) throw err;
//         console.table(res);
//     })
// };

// * Delete departments, roles, and employees
// const removeEmployee = () => { // bonus

// }

// * View the total utilized budget of a department -- ie the combined salaries of all employees in that department

// const viewAllDepartments = () => {
//     const query = "SELECT department.department, employees.first_name, employees.last_name FROM employees INNER JOIN role on role.id = employees.role_id INNER JOIN department on department.id = role.department_id ORDER BY department.department ASC";
//     connection.query(query, (err, res) => {
//         if (err) throw err;
//         console.table(res);
//         start();
//     })
// };