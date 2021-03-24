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
    ).then((answer) =>
        // TODO switch statement to call functions based on answer
        
    )
};


// TODO: CRUD requests
//   * View departments, roles, employees
const viewAllEmployees = (data) => {
    // inner join
    const query = ''
    connection.query(query, data, (err, res) => {
        if (err) throw err;
        res.forEach(({ id, first_name, last_name, title, department, salary, manager }) => {
            console.log(`id: ${id} || first_name: ${first_name} || last_name: ${last_name} || title: ${title} || department: ${department} || salary: ${salary} || manager: ${manager}`);
        })
    })
};
// Add departments, roles, employees
const addEmployee = () => {
    inquirer.prompt(
        {
            // what is the employees first name (input)
        },
        {
            // what is the employees last name (input)
        },
        {
            // what is the employees role (list)
        },
        {
            // who is the employees manager? (list)
        }
    )
}

//   * Update employee roles
const updateRole = () => {
    inquirer.prompt(
        {
            // select employee
        },
        {
            // select role
        }
    )
}

const updateManager = () => {
    inquirer.prompt(
        {
            // select employee
        },
        {
            // select manager
        }
    )
}

// Bonus points if you're able to:

//   * Update employee managers

//   * View employees by manager

//   * Delete departments, roles, and employees

//   * View the total utilized budget of a department -- ie the combined salaries of all employees in that department