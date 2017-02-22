CREATE TABLE IF NOT EXISTS users(
  userId SERIAL PRIMARY KEY,
  authId VARCHAR(100),
  username VARCHAR(50),
  firstName VARCHAR(50),
  lastName VARCHAR(50),
  email VARCHAR(50)
);