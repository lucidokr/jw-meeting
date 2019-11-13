module.exports = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    const speechText = 'Benvenuto nel programma adunanza Vita Cristiana e Ministero!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Benvenuto', speechText)
      .getResponse();
  }
}
