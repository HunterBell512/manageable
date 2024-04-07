INSERT INTO departments (name)
    VALUES  ('Sales'),
            ('Engineering'),
            ('Finance'),
            ('Legal');

INSERT INTO roles (title, department_id, salary)
    VALUES  ('Sales Lead', 1, 100000),
            ('Salesperson', 1, 75000),
            ('Lead Engineer', 2, 150000),
            ('Software Engineer', 2, 120000),
            ('Account Manager', 3, 125000),
            ('Accountant', 3, 100000),
            ('Legal Team Lead', 4, 250000),
            ('Lawyer', 4, 190000);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
    VALUES  ('Bonnie', 'Kirk', 1, null),
            ('Ronald', 'Osborne', 2, 1),
            ('Leonardo', 'Alvarez', 3, null),
            ('Jessica', 'Haley', 4, 3),
            ('Lincoln', 'Arias', 5, null),
            ('Felix', 'Maxwell', 6, 5),
            ('Adeline', 'Pierce', 7, null),
            ('Aaron', 'Knox', 8, 7);