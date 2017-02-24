SELECT * FROM genotypeResults
WHERE userid = $1 AND genomeid = $2
ORDER BY id;