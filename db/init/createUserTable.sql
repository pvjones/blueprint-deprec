CREATE TABLE IF NOT EXISTS users(
  userid SERIAL PRIMARY KEY,
  authid VARCHAR(100),
  username VARCHAR(50),
  firstname VARCHAR(50),
  lastname VARCHAR(50),
  email VARCHAR(50)
);