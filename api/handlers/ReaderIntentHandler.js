
const Week = require('../models/weekMeeting');

module.exports = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'ReaderIntent';
  },
  async handle(handlerInput) {
    try{
      var week = await Week
      .findOne({
        date:{
          $gte: new Date(new Date().getTime()-((new Date().getDay()-1)*24*60*60*1000)),
          $lte: new Date(new Date().getTime()-((new Date().getDay()-7)*24*60*60*1000))
        }
      }).populate('congregationBibleStudy.reader')
    }catch(e){
      console.log("Error on find weeks", e)
      return;
    }

    const speechText = 'Il lettore dello studio biblico di questa settimana è: ' +week.congregationBibleStudy.reader.name + ' ' + week.congregationBibleStudy.reader.surname;

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('Lettore studio biblico di questa settimana', week.congregationBibleStudy.reader.name + ' ' + week.congregationBibleStudy.reader.surname)
      .getResponse();
  }
};
