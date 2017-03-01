SELECT usergenomes.genomeid, usergenomes.genomename, usergenomes.genomedate, genotyperesults.genosetname, genotyperesults.genosetdesc, genotyperesults.descriptionid, genotyperesults.resulttype, genotyperesults.resultname, genotyperesults.resultdesctrue, genotyperesults.resultdescfalse, genotyperesults.resultbool, genotyperesults.resultqual FROM usergenomes
JOIN genotyperesults ON usergenomes.genomeid = genotyperesults.genomeid
WHERE usergenomes.userid = $1 AND usergenomes.genomeid = $2 AND genotyperesults.resultbool IS NOT NULL

ORDER BY usergenomes.userid;