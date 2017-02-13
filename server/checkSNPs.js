exports.forGenotype = (genoset, userJSON) => {
  const query = require(`./queries/${genoset}`)
  const dna = require(userJSON);

  return matches = query(dna);
}