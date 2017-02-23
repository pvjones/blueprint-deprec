INSERT INTO genotypeResults
(userId, genomeId, genosetName, genosetDesc, genosetLongDesc, resultType, resultName, resultDescTrue, resultDescFalse, resultBool)
VALUES
($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);