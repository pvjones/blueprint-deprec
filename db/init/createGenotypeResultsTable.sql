CREATE TABLE IF NOT EXISTS genotypeResults(
  id SERIAL PRIMARY KEY,
  userId INTEGER NOT NULL,
  genomeId INTEGER NOT NULL,
  genosetName VARCHAR(50),
  genosetDesc TEXT,
  genosetLongDesc TEXT,
  resultType VARCHAR(50),
  resultName VARCHAR(50),
  resultDescTrue VARCHAR(50),
  resultDescFalse VARCHAR(50),
  resultBool BOOLEAN
);