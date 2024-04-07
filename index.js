const inquirer = require('inquirer');
const db = require('./config/connection');
const exit = false;

const init = async () => {
    await inquirer.prompt(
        {
            type: 'rawlist',
            name: 'choice',
            message: 'What would you like to do?',
            choices: [
                'view all departments',
                'view all roles',
                'view all employees',
                'add a department',
                'add a role',
                'add an employee',
                'update an employee role',
                'exit'
            ]
        }
    )
    .then((answer => {
        switch(answer.choice) {
            case 'view all departments':
                viewDepartments();
                break;
            case 'view all roles': 
                viewRoles();
                break;
            case 'view all employees':
                viewEmployees();
                break;
            case 'add a department':
                createDepartment();
                break;
            case 'add a role':
                createRole();
                break;
            case 'add an employee':
                createEmployee();
                break;
            case 'update an employee role':
                updateRole();
                break;
            default:
                process.exit(0);

        }
    }));
}

function viewDepartments () {
    db.promise().query('SELECT id, name FROM departments')
    .then((results) => {
        console.table(results[0]);
        init();
    });
}

function viewRoles () {
    db.promise().query(`SELECT roles.id, roles.title AS title, roles.salary AS salary,
                     departments.name AS department FROM roles
              JOIN departments ON roles.department_id = departments.id`)
    .then((results) => {
        console.table(results[0]);
        init();
    });
}

function viewEmployees () {
    db.promise().query(`SELECT e.id, e.first_name, e.last_name, CONCAT(m.first_name, ' ', m.last_name) as manager,
                               roles.title AS title, roles.salary AS salary,
                               departments.name AS department
              FROM employees e
              LEFT JOIN employees m ON e.manager_id = m.id
              JOIN roles ON e.role_id = roles.id
              JOIN departments ON roles.department_id = departments.id`)
    .then((results) => {
        console.table(results[0]);
        init();
    })
}

function createDepartment () {
    inquirer
        .prompt(
            {
                type: 'input',
                name: 'department_name',
                message: 'What is the name of the department?'
            }
        )
        .then((answers) => {
            db.promise().query(`INSERT INTO departments (name) VALUES(?)`, answers.department_name)
            .then((results) => {
                console.table(results[0]);
                init();
            });
        });
}

function createRole () {
    db.promise().query('SELECT * FROM departments').then((results) => {
        inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'role_name',
                    message: 'What is the name of the role?'
                },
                {
                    type: 'input',
                    name: 'salary',
                    massage: 'What is the salary of this role?'
                },
                {
                    type: 'rawlist',
                    name: 'department',
                    message: 'What department does this role belong to?',
                    choices: results[0]
                }
            ])
            .then((answers) => {
                let match = results[0].find(val => val.name === answers.department);
                db.promise().query(`INSERT INTO roles (title, salary, department_id)
                                    VALUES (?, ?, ?)`, [answers.role_name, answers.salary, match.id])
                .then((res) => {
                    init();
                })
            });
    });
}

function createEmployee () {
    db.promise().query(`SELECT * FROM roles`)
    .then((rolesResults) => {
        db.promise().query(`SELECT id, CONCAT(first_name, ' ', last_name) as name, manager_id FROM employees`)
        .then((employeesResults) => {
            let managers = employeesResults[0].filter(element => element.manager_id === null);
            let roles = rolesResults[0].map(element => element.title)
            inquirer
                .prompt([
                    {
                        type: 'input',
                        name: 'first_name',
                        message: `What is the employees' first name?`
                    },
                    {
                        type: 'input',
                        name: 'last_name',
                        message: `What is the employees' last name?`,
                    },
                    {
                        type: 'rawlist',
                        name: 'role',
                        message: `What is the employees role`,
                        choices: roles
                    },
                    {
                        type: 'rawlist',
                        name: 'manager',
                        message: `Who is the manager of this employee?`,
                        choices: managers
                    }
                ])
                .then((answers) => {
                    let roleMatch = rolesResults[0].find(val => val.title === answers.role)
                    let managerMatch = managers.find(val => val.name === answers.manager);
                    db.promise().query(`INSERT INTO employees (first_name, last_name, role_id, manager_id)
                                        VALUES (?, ?, ?, ?)`, [answers.first_name, answers.last_name, roleMatch.id, managerMatch.id]);
                    init();
                });
        })
    });
}

function updateRole () {
    db.promise().query(`SELECT * FROM roles`)
    .then((rolesResults) => {
        db.promise().query(`SELECT first_name, last_name FROM employees`)
        .then((employeesResults) => {
            let roles = rolesResults[0].map(element => element.title);
            let employees = employeesResults[0].map(element => `${element.first_name} ${element.last_name}`)
            inquirer
                .prompt([
                    {
                        type: 'rawlist',
                        name: 'employee',
                        message: 'Which employee do you want to change the role of?',
                        choices: employees
                    },
                    {
                        type: 'rawlist',
                        name: 'role',
                        message: 'Which role do you want to change their to?',
                        choices: roles
                    }
                ])
                .then((answers) => {
                    let roleMatch = rolesResults[0].find(val => val.title === answers.role);
                    let employeeMatch = employeesResults[0].find(val => val.first_name === answers.employee.split(' ')[0]);
                    db.promise().query(`UPDATE employees SET role_id = ? WHERE first_name = ?`, [roleMatch.id, employeeMatch.first_name]);
                    init();
                })
        })
    })
}

init();