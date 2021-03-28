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
    selectTask();
});

// TODO: Inquirer prompt
const selectTask = () => {
    inquirer.prompt(
        {
            type: 'list',
            name: 'task',
            message: "What would you like to do?",
            choices: ['View all Employees', 'View all Employees by Department', 'View all employees by Manager', 'Add Employee', 'Remove Employee', 'Update Employee Role', 'Update Employee Manager']
        }
    ).then((answer) => {
        switch (answer.action) {
            case 'View all Employees':
                viewAllEmployees();
                break;

            case 'View all Employees by Department':
                viewByDepartment();
                break;

            case 'View all employees by Manager':
                viewByManager();
                break;

            case 'Add Employee':
                addEmployee();
                break;

            case 'Remove Employee': // bonus
                removeEmployee();
                break;

            case 'Update Employee Role':
                updateRole();
                break;

            case 'Update Employee Manager':
                updateManager();
                break;

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


// TODO: CRUD requests
//   * View departments, roles, employees
const viewAllEmployees = (data) => {
    // inner join
    const query = 'SELECT * FROM employees'
    connection.query(query, data, (err, res) => {
        if (err) throw err;
        res.forEach(({ id, first_name, last_name, title, department, salary, manager }) => {
            console.table(`id: ${id} || first_name: ${first_name} || last_name: ${last_name} || title: ${title} || department: ${department} || salary: ${salary} || manager: ${manager}`);
        })
    })
};

const viewByManager = (data) => { // bonus
    //TODO inquirer which manager they want to view
    // inner join
    const query = 'SELECT * FROM employees'
    connection.query(query, data, (err, res) => {
        if (err) throw err;
        res.forEach(({ id, first_name, last_name, title, department, salary, manager }) => {
            console.table(`id: ${id} || first_name: ${first_name} || last_name: ${last_name} || title: ${title} || department: ${department} || salary: ${salary} || manager: ${manager}`);
        })
    })
};

const viewByDepartment = (data) => {
    //TODO inquirer which department they want to view

    // inner join
    const query = 'SELECT * FROM employees'
    connection.query(query, data, (err, res) => {
        if (err) throw err;
        res.forEach(({ id, first_name, last_name, title, department, salary, manager }) => {
            console.table(`id: ${id} || first_name: ${first_name} || last_name: ${last_name} || title: ${title} || department: ${department} || salary: ${salary} || manager: ${manager}`);
        })
    })
};

// * Add departments, roles, employees
const addEmployee = () => {
    inquirer.prompt(
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
            name: 'role',
            message: 'Who is the employees manager?',
            choices: []
            // TODO: figure out how to include list of managers from DB
        }
    ) // TODO: post function
}

const removeEmployee = () => { // bonus

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

// * Delete departments, roles, and employees

// * View the total utilized budget of a department -- ie the combined salaries of all employees in that department