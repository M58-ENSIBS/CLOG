CREATE TABLE tickets(
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    title varchar(255) NOT NULL,
    content varchar(255) NOT NULL,
    author varchar(255) NOT NULL
);

INSERT INTO tickets (title, content, author) VALUES ('First ticket', 'This is the first ticket', 'John Doe');
INSERT INTO tickets (title, content, author) VALUES ('Second ticket', 'This is the second ticket', 'Jane Doe');
INSERT INTO tickets (title, content, author) VALUES ('Third ticket', 'This is the third ticket', 'John Doe');

REVOKE ALL PRIVILEGES ON tickets.* FROM 'MONKEY'@'%';
GRANT SELECT ON tickets.* TO 'MONKEY'@'%';

