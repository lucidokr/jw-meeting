// Alexa handlers
const handlers = {
  'PresidentIntent': function () {
    try{
      var week = await Week
      .findOne({
        date:{
          $gte: new Date(new Date().getTime()-((new Date().getDay()-1)*24*60*60*1000)),
          $lte: new Date(new Date().getTime()-((new Date().getDay()-7)*24*60*60*1000))
        }
      })
        .sort([
            ['date', 'descending']
        ])
        .populate('president')
    }catch(e){
      console.log("Error on find weeks", e)
      return;
    }
    this.emit(':tell', 'Il presidente è '+week.president.name + " " + week.president.surname);
  },
  'ReaderIntent': function () {
    try{
      var week = await Week
      .findOne({
        date:{
          $gte: new Date(new Date().getTime()-((new Date().getDay()-1)*24*60*60*1000)),
          $lte: new Date(new Date().getTime()-((new Date().getDay()-7)*24*60*60*1000))
        }
      })
        .sort([
            ['date', 'descending']
        ])
        .populate('congregationBibleStudy.reader')
    }catch(e){
      console.log("Error on find weeks", e)
      return;
    }
    this.emit(':tell', 'Il lettore è '+week.congregationBibleStudy.reader.name + " " + week.congregationBibleStudy.president.surname);
  },
  'StudentIntent': function () {
    this.emit(':tell', 'Gli studenti sono:');
  }
};

module.exports = { handlers };
