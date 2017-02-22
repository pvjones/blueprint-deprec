const translateRaw = require('./translateRaw');
const checkSNPs = require('./checkSNPs');

const battery = [
  {
    id: 1,
    name: 'isFemale',
    description: 'likely female'
  }, 
  {
    id: 2,
    name: 'isMale',
    description: 'likely female'
  }, 
  {
    id: 3,
    name: 'gs228',
    description: 'likely affected by Sickle Cell Anemia'
  }, 
  {
    id: 4,
    name: 'gs291',
    description: 'likely lower than average risk of heart attack'
  }, 
  {
    id: 5,
    name: 'gs117',
    description: 'likely affected by Type 1 Diabetes'
  }, 
  {
    id: 6,
    name: 'gs101',
    description: 'likely to experience lactose intolerance'
  }, 
  {
    id: 7,
    name: 'gs122',
    description: 'up to 7x increased likelihood of male pattern baldness'
  }, 
  {
    id: 8,
    name: 'gs137',
    description: 'slightly increased likelihood for thyroid cancer'
  }, 
  {
    id: 9,
    name: 'gs191',
    description: 'likely difficulty metabolizing NSAIDs'
  }, 
  {
    id: 10,
    name: 'gs243',
    description: 'up to 50% increased risk of mortality in the event of prostate cancer'
  }, 
  {
    id: 11,
    name: 'gs211',
    description: 'likely reduced rate of ethanol metabolization'
  }, 
  {
    id: 12,
    name: 'gs209',
    description: 'up to 1.7x increased likelihood of anxiety disorder'
  }, 
  {
    id: 13,
    name: 'gs249',
    description: 'likely increased risk of developing Parkinsons Disease'
  }, 
  {
    id: 14,
    name: 'gs248',
    description: 'likely decreased risk of developing Parkinsons Disease'
  }, 
  {
    id: 15,
    name: 'gs116',
    description: '80% unlikely to possess bitter-tasting ability'
  }, 
  {
    id: 16,
    name: 'gs123',
    description: '2.7x increased risk for basal skin cell carcinoma'
  }, 
  {
    id: 17,
    name: 'gs216',
    description: '11x more likely to develop Alzheimers, increased risk (5-10%) of high cholesterol and 40-50% increased risk of cardiovascular disease. 40% less likely to contract Hepatitis C'
  }, 
  {
    id: 18,
    name: 'gs119',
    description: 'up to 6.5x increased risk for developing breast cancer'
  }, 
  {
    id: 19,
    name: 'gs159',
    description: 'likely fast caffeine metabolizer'
  }, 
  {
    id: 20,
    name: 'gs293',
    description: 'likely increased risk of late-onset Alzheimers Disease'
  }, 
  {
    id: 21,
    name: 'gs221',
    description: 'slightly increased risk for autoimmune disorders including Celiac Disease'
  }, 
  {
    id: 22,
    name: 'gs126',
    description: 'likely poor metabolizer of Warfarin'
  }, 
  {
    id: 23,
    name: 'gs102',
    description: '1.3x increased risk for ALS'
  }, 
  {
    id: 24,
    name: 'rs12333032T',
    description: 'increased risk for developing cocaine-induced paranoia'
  }, 
  {
    id: 25,
    name: 'rs5400TT',
    description: 'possible decreased sensitivity to glucose consumption'
  }, 
  {
    id: 26,
    name: 'rs11362AG',
    description: '2.4x increased risk of colonic Crohn\'s Disease'
  }, 
  {
    id: 27,
    name: 'gs128',
    description: 'likely Type O blood'
  }, 
  {
    id: 28,
    name: 'rs1815739TT',
    description: 'Likely reduced development of fast-twitch muscle fibers. Likely better endurance-based athletic performance.'
  },   
  {
    id: 29,
    name: 'rs1815739CC',
    description: 'likely better development of fast-twitch muscle fibers. Likely better sprint-based athletic performance.'
  }, 
  {
    id: 30,
    name: 'rs9939609AA',
    description: 'likely increased risk of obesity. 1.6x increased risk of developing Type 2 Diabetes'
  }, 
  {
    id: 31,
    name: 'rs9939609AT',
    description: 'slightly increased risk of obesity. 1.3x increased risk of developing Type 2 Diabetes.'
  }, 
];

exports.runBattery = function(userTXT, userJSON) {
  
  translateRaw.toJSON(userTXT, userJSON);

  let results = [];

  for (let i = 0; i < battery.length; i++) {
    let genoset = battery[i].name;
    let description = battery[i].description;

    let testResult = {
      name: genoset,
      result: checkSNPs.forGenotype(genoset, userJSON),
      description: description
    };
    results.push(testResult);
  }
  translateRaw.clear(userJSON);
  return results;
};

