SELECT usergenomes.genomeid, usergenomes.genomename, usergenomes.genomedate, genotyperesults.genosetname, genotyperesults.genosetdesc, genotyperesults.genosetlongdesc, genotyperesults.resulttype, genotyperesults.resultname, genotyperesults.resultdesctrue, genotyperesults.resultdescfalse, genotyperesults.resultbool FROM usergenomes
JOIN genotyperesults ON usergenomes.genomeid = genotyperesults.genomeid
WHERE usergenomes.userid = $1 AND usergenomes.genomeid = $2
ORDER BY usergenomes.userid;