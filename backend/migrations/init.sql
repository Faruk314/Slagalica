CREATE USER 'slagalica'@'localhost' IDENTIFIED BY 'ispitivac';

GRANT CREATE, ALTER, DROP,
INSERT,
UPDATE,
DELETE,
SELECT
,
    REFERENCES,
    RELOAD on *.* TO 'slagalica' @'localhost'
WITH
GRANT OPTION;

CREATE DATABASE Slagalica;

USE Slagalica;

CREATE TABLE
    games (
        id INT AUTO_INCREMENT PRIMARY KEY,
        gameId VARCHAR(250) NOT NULL,
        senderId INT NOT NULL,
        receiverId INT NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (senderId) REFERENCES users(userId),
        FOREIGN KEY (receiverId) REFERENCES users(userId)
    );

CREATE TABLE
    leaderboard (
        userId int NOT NULL,
        score int DEFAULT NULL,
        PRIMARY KEY (userId),
        CONSTRAINT scoreboard_ibfk_1 FOREIGN KEY (userId) REFERENCES users (userId)
    );

CREATE TABLE
    users (
        userId INT AUTO_INCREMENT,
        userName VARCHAR(50) NOT NULL,
        image VARCHAR(100),
        password VARCHAR(255) NOT NULL,
        email VARCHAR(100) NOT NULL,
        PRIMARY KEY (userId)
    );

CREATE TABLE
    spojnice (
        id INT PRIMARY KEY AUTO_INCREMENT,
        question VARCHAR(255) NOT NULL,
        answer VARCHAR(255) NOT NULL,
        category VARCHAR(255) NOT NULL
    );

CREATE TABLE
    associations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        first VARCHAR(255) NOT NULL,
        second VARCHAR(255) NOT NULL,
        third VARCHAR(255) NOT NULL,
        fourth VARCHAR(255) NOT NULL,
        answer VARCHAR(255) NOT NULL,
        finalAnswer VARCHAR(255) NOT NULL
    );

CREATE TABLE
    questions (
        id INT PRIMARY KEY AUTO_INCREMENT,
        question VARCHAR(255) NOT NULL,
        answerOne VARCHAR(255) NOT NULL,
        answerTwo VARCHAR(255) NOT NULL,
        answerThree VARCHAR(255) NOT NULL,
        correctAnswer VARCHAR(255) NOT NULL
    );

INSERT INTO
    questions (
        question,
        answerOne,
        answerTwo,
        answerThree,
        correctAnswer
    )
VALUES (
        "Who formulated the theory of relativity?",
        "Isaac Newton",
        "Nikola Tesla",
        "Marie Curie",
        "Albert Einstein"
    ), (
        "Which country is the largest by area?",
        "Canada",
        "Australia",
        "Brazil",
        "Russia"
    ), (
        "In which year did the French Revolution take place?",
        "1804",
        "1776",
        "1799",
        "1789"
    ), (
        "What is the longest river in the world?",
        "Amazon",
        "Yangtze",
        "Mississippi",
        "Nile"
    ), (
        "What is the tallest mountain on Earth?",
        "K2",
        "Mount Kilimanjaro",
        "Mount Denali",
        "Mount Everest"
    ), (
        "Who wrote the novel 'War and Peace'?",
        "Fyodor Dostoevsky",
        "Charles Dickens",
        "Victor Hugo",
        "Leo Tolstoy"
    ), (
        "What is the largest living animal on Earth?",
        "Killer Whale",
        "Shark",
        "Elephant",
        "Blue Whale"
    ), (
        "Which is the largest city in the United States?",
        "Los Angeles",
        "Chicago",
        "Houston",
        "New York City"
    ), (
        "Which planet in the Solar System has the most moons?",
        "Saturn",
        "Venus",
        "Mars",
        "Jupiter"
    ), (
        "In which year did humans first step on the Moon?",
        "1972",
        "1961",
        "1975",
        "1969"
    ), (
        "What is the chemical symbol for gold?",
        "Ag",
        "Fe",
        "Cu",
        "Au"
    ), (
        "Who painted the Mona Lisa?",
        "Vincent van Gogh",
        "Pablo Picasso",
        "Louis Rossman",
        "Leonardo da Vinci"
    ), (
        "What is the largest ocean on Earth?",
        "Atlantic Ocean",
        "Indian Ocean",
        "Arctic Ocean",
        "Pacific Ocean"
    ), (
        "Which instrument is used to measure atmospheric pressure?",
        "Thermometer",
        "Barometer",
        "Hydrometer",
        "Barometer"
    ), (
        "Who wrote the play 'Romeo and Juliet'?",
        "William Flam",
        "George Bernard Shaw",
        "Arthur Miller",
        "William Shakespeare"
    ), (
        "What is the chemical formula for water?",
        "CO2",
        "NaCl",
        "H2O2",
        "H2O"
    ), (
        "Who is the author of 'To Kill a Mockingbird'?",
        "Bruce Jenkins",
        "J.D. Salinger",
        "Mark Twain",
        "Harper Lee"
    ), (
        "What is the capital city of France?",
        "Berlin",
        "London",
        "Rome",
        "Paris"
    ), (
        "What is the largest desert in the world?",
        "Ruanda",
        "Gobi",
        "Atacama",
        "Sahara"
    ), (
        "Who discovered penicillin?",
        "Alexander Billing",
        "Albert Einstein",
        "Isaac Newton",
        "Alexander Fleming"
    );

INSERT INTO
    associations (
        first,
        second,
        third,
        fourth,
        answer,
        finalAnswer
    )
VALUES (
        'TRANSMITTER',
        'BROADCAST',
        'WAVE',
        'ANNOUNCER',
        'RADIO',
        'MILEVA'
    ), (
        'RELATIVITY',
        'SCIENTIST',
        'SPEED',
        'GENIUS',
        'EINSTEIN',
        'MILEVA'
    ), (
        'CHESS',
        'ALEX',
        'BASKETBALL',
        'ALICE',
        'CHAMPION',
        'MILEVA'
    ), (
        'MADAME BUTTERFLY',
        'WILLIAM TELL',
        'MAGIC FLUTE',
        'LA TRAVIATA',
        'OPERA',
        'MILEVA'
    );