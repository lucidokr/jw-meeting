
const Week = require('../models/weekMeeting');

module.exports = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'PresidentIntent';
  },
  async handle(handlerInput) {
    try{
      var week = await Week
      .findOne({
        date:{
          $gte: new Date(new Date().getTime()-((new Date().getDay()-1)*24*60*60*1000)),
          $lte: new Date(new Date().getTime()-((new Date().getDay()-7)*24*60*60*1000))
        }
      }).populate('president')
    }catch(e){
      console.log("Error on find weeks", e)
      return;
    }

    const speechText = 'Il presidente di questa settimana è: ' +week.president.name + ' ' + week.president.surname;

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('Presidente di questa settimana', week.president.name + ' ' + week.president.surname)
      .getResponse();
  }
};
