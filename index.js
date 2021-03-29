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
            choices: ['View all Employees', 'View all Employees by Department', 'View all Employees by Manager', 'Add Employee', 'Remove Employee', 'Update Employee Role', 'Update Employee Manager']
        }
    ).then((answer) => {
        switch (answer.task) {
            case 'View all Employees':
                viewAllEmployees();
                break;

            case 'View all Employees by Department':
                viewByDepartment();
                break;

            case 'View all Employees by Manager':
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
const viewAllEmployees = () => {
    // inner join
    const query = 'SELECT * FROM employees';
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
    })
};

const viewByManager = () => { // bonus
    //TODO inquirer which manager they want to view
    // inner join
    const query = 'SELECT * FROM employees';
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
    })
};

const viewByDepartment = () => {
    //TODO inquirer which department they want to view

    // inner join
    const query = 'SELECT * FROM employees';
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
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
        // {
        //     type: 'list',
        //     name: 'manager',
        //     message: 'Who is the employees manager?',
        //     choices: []
        //     // TODO: figure out how to include list of managers from DB
        // }
        // Post Function
    ]).then((answer) => {
        // when finished prompting, insert a new item into the db with that info
        connection.query(
            'INSERT INTO employees SET ?',
            {
                first_name: answer.firstName,
                last_name: answer.lastName,
                role_id: answer.role,
                // manager_id: answer.manager,
            },
            (err) => {
                if (err) throw err;
                console.log(`${answer.firstName} ${answer.lastName} was added successfully.`);
                selectTask();
            }
        );
    });
}

const postAuction = () => {
    // prompt for info about the item being put up for auction
    inquirer
        .prompt([
            {
                name: 'item',
                type: 'input',
                message: 'What is the item you would like to submit?',
            },
            {
                name: 'category',
                type: 'input',
                message: 'What category would you like to place your auction in?',
            },
            {
                name: 'startingBid',
                type: 'input',
                message: 'What would you like your starting bid to be?',
                validate(value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                },
            },
        ])
        .then((answer) => {
            // when finished prompting, insert a new item into the db with that info
            connection.query(
                'INSERT INTO auctions SET ?',
                // QUESTION: What does the || 0 do?
                {
                    item_name: answer.item,
                    category: answer.category,
                    starting_bid: answer.startingBid || 0,
                    highest_bid: answer.startingBid || 0,
                },
                (err) => {
                    if (err) throw err;
                    console.log('Your auction was created successfully!');
                    // re-prompt the user for if they want to bid or post
                    start();
                }
            );
        });
};
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