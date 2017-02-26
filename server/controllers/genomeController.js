const app = require('./../index');
const db = app.get('db');

const genomeService = require('./../genomeJS/genomeService')

module.exports = {

  getMaxGenomeId: (req, res, next) => {
    let userId = req.user[0].userid;
    let genomeId = 1;

    db.genotypes.checkMaxGenomeId([userId], (err, result) => {
      if (err) {
        genomeService.clearUserJSON()
        console.error('No user genomes found');
      } else {
        let tempId = result[0].max;
        newGenomeId = ++tempId;

        req.body.currentMaxGenomeId = tempId;
        req.body.userId = userId;
        req.body.newGenomeId = newGenomeId;
        next();
      }
    })
  },

  storeGenomeResults: (req, res, next) => {
    let testResultsArray = req.body.genomeResults;
    let userId = req.body.userId;
    let newGenomeId = req.body.newGenomeId;

    let itemsProcessed = 0;
      // Then store gql results in genotypeResultsTable
    testResultsArray.forEach((elem, index, array) => {

      db.genotypes.insertGenotype([
        userId,
        newGenomeId,
        elem.genosetName,
        elem.genosetDesc,
        elem.genosetLongDesc,
        elem.resultType,
        elem.resultName,
        elem.resultDescTrue,
        elem.resultDescFalse,
        elem.resultBool
      ], (err, result) => {
        if (err) {
          genomeService.clearUserJSON()
          console.error(err);
            // testResultsArray = null;
            // req.body.genomeResults = null;
        } else {

          itemsProcessed++;
          if (itemsProcessed === testResultsArray.length) {
            // testResultsArray = null;
            // req.body.genomeResults = null;
            next();
          }
        }
      })
    })
  },

  storeUserGenomeClassifiers: (req, res, next) => {
    let genomeId = req.body.newGenomeId
    let userId = req.body.userId;
    let genomeName = req.body.genomeName;
    let genomeDate = new Date();
    db.genotypes.insertGenotypeClassifiers([
        genomeId,
        userId,
        genomeName,
        genomeDate
      ], (err, result) => {
        if (err) {
          console.error(err)
          next();
        } else {
          next();
        }
      })
  },

  getAllGenomeResultsByUserId: (req, res, next) => {
    let userId = req.body.userId;
    let userGenomeIds = [];
    let i = 1;
    while (i < req.body.currentMaxGenomeId) {
      userGenomeIds.push(i++)
    };
    let allGenomeResults = [];
    let itemsProcessed = 0;

    userGenomeIds.forEach((elem, index, array) => {
       db.genotypes.getGenomeResultsByUserId([
        userId,
        elem
      ], (err, result) => {
        if (err) {
          console.error(err);
          return res.status(404)
                    .json(err);
        } else {


          let genomeResultsObj = {
            genomeid: result[0].genomeid,
            genomename: result[0].genomename,
            genomedate: result[0].genomedate,
            genomeresults: result
          }
          allGenomeResults.unshift(genomeResultsObj);

          itemsProcessed++;
          if (itemsProcessed === Math.max.apply(Math, userGenomeIds)) {
            req.body.allGenomeResults = allGenomeResults
            next();
          }


        }
      })
    })
  },

  getResultsByGenomeId: (req, res, next) => {

  }

};


