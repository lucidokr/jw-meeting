module.exports = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    const speechText = 'Mi dispiace, non sono riuscito a capire il comando. Prova a chiedermi nuovamente!';
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  }
}
