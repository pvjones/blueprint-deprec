CREATE TABLE IF NOT EXISTS results(
  id SERIAL PRIMARY KEY,
  userId INTEGER NOT NULL,
  genotypeName VARCHAR(50),
  resultType VARCHAR(50),
  resultName VARCHAR(50),
  result VARCHAR(50)
);