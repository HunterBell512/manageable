SELECT 
    employees.first_name, employees.last_name,
    roles.name AS title, roles.salary AS salary,
    departments.name AS department
FROM employees
JOIN roles 
    ON employees.title = roles.id
JOIN departments
    ON roles.department = departments.id;