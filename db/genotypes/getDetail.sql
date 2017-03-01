SELECT * FROM details
WHERE detailobject ->> $1 = $2;