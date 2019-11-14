module.exports = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    const speechText = 'Benvenuto nel programma adunanza Vita Cristiana e Ministero! Puoi chiedermi l\'oratore di una parte dell\'adunanza di questa settimana. Quale parte ti interessa?';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Programma adunanza Vita Cristiana e Ministero', speechText)
      .getResponse();
  }
}
