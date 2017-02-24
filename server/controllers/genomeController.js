const app = require('./../index');
const db = app.get('db');

const genomeService = require('./../genomeJS/genomeService')

module.exports = {

  getMaxGenomeId: (req, res, next) => {
    let userId = req.user[0].userid;
    let genomeId = 1;

    db.genotypes.checkMaxGenomeId([userId], (err, result) => {
      if (err) {
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
    let testResultsArray = req.body.genomeResults
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
          console.error(err);
          return res.status(404)
                    .json(err);
        } else {
          itemsProcessed++;
          if (itemsProcessed === testResultsArray.length) {
            console.log('insertGenotype')
            next();
          }
        }
      })
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
          let genomeResultsArray = result;
          genomeResultsArray.forEach((elem, index, array) => {
            allGenomeResults.push(elem)
          })

          itemsProcessed++;
          if (itemsProcessed === Math.max.apply(Math, userGenomeIds)) {
            //console.log(allGenomeResults)
            req.body.allGenomeResults = allGenomeResults
            next();
          }
        }
      })
    })
  },

  getResultsByUserIdGenomeId: (req, res, next) => {

  }

};
