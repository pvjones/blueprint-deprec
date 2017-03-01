CREATE TABLE IF NOT EXISTS genotypeResults(
  id SERIAL PRIMARY KEY,
  userid INTEGER NOT NULL,
  genomeid INTEGER NOT NULL,
  genosetname VARCHAR(50),
  genosetdesc TEXT,
  descriptionid TEXT,
  resulttype VARCHAR(50),
  resultname VARCHAR(50),
  resultdesctrue VARCHAR(50),
  resultdescfalse VARCHAR(50),
  resultbool BOOLEAN,
  resultqual VARCHAR(50)
);