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
    // call function to start
});

// TODO: Inquirer prompt
const addInfo = () => {
    // Add departments, roles, employees
    inquirer.prompt(
        {
            type: 'list',
            name: 'task',
            message: "What would you like to do?",
            choices: ['View all Employees', 'View all Employees by Department', 'View all employees by Manager', 'Add Employee', 'Remove Employee', 'Update Employee Role', 'Update Employee Manager']
        }
    ).then((answer) =>
        // TODO case statement to call functions based on answer
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
    }

//   * Update employee roles

// Bonus points if you're able to:

//   * Update employee managers

//   * View employees by manager

//   * Delete departments, roles, and employees

//   * View the total utilized budget of a department -- ie the combined salaries of all employees in that department