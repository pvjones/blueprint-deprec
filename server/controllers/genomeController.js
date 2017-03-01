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
        elem.resultBool,
        elem.resultQual
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
          let rawGenomeResults = result;
          let categoryContainer = [
            {
              categoryTitle: "Health Risks",
              reportTitle: "Condition",
              reportResultTitle: "Your Risk",
              resultsArray: []
            },
            {
              categoryTitle: "Traits",
              reportTitle: "Report",
              reportResultTitle: "Your Result",
              resultsArray: []
            },
            {
              categoryTitle: "Inherited Conditions",
              reportTitle: "Report",
              reportResultTitle: "Your Result",
              resultsArray: []
            },
            {
              categoryTitle: "Drug Response",
              reportTitle: "Report",
              reportResultTitle: "Your Result",
              resultsArray: []
            }
          ];
          rawGenomeResults.forEach(elem1 => {
            let resultType = elem1.resulttype;
            categoryContainer.forEach(elem2 => {
              if (resultType === elem2.categoryTitle) {
                elem2.resultsArray.push(elem1)
              }
            })
          });
          let genomeResultsObj = {
            genomeid: rawGenomeResults[0].genomeid,
            genomename: rawGenomeResults[0].genomename,
            genomedate: rawGenomeResults[0].genomedate,
            genomeresults: categoryContainer
          };
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

  },

  insertDetail: (req, res, next) => {
    let newDetail = req.body;
    db.genotypes.insertDetail([req.body], (err, result) => {
      if (err) {
        res.status(400).json(err)
      } else {
        res.status(200).json(result)
      }
    })
  },

  getDetail: (req, res, next) => {
    let genosetName = req.params.genosetName;
    db.genotypes.getDetail([
        'genosetName',
        genosetName
      ], (err, result) => {
        if (err) {
          console.log(err)
          res.status(400).json(err);
        } else {
          res.status(200).json(result);
        }
      });
  },

};


