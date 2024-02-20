CREATE DATABASE IF NOT EXISTS to_do_list;

USE to_do_list;

ALTER TABLE todolists AUTO_INCREMENT = 1;


CREATE TABLE IF NOT EXISTS ToDoLists (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL
);

CREATE TABLE IF NOT EXISTS Tasks (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    description VARCHAR(50) NOT NULL,
    toDoListId INTEGER,
    completed BOOLEAN,
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL,
    FOREIGN KEY (toDoListId) REFERENCES ToDoLists(id) ON DELETE CASCADE
);

