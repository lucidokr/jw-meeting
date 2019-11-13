
const Week = require('../models/weekMeeting');
const Student = require('../models/student');
import * as he from 'he';

module.exports = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'StudentIntent';
  },
  async handle(handlerInput) {
    function getPartTitle(str){
      var html = he.decode(str);
      html = html.split("(")[0];
      var div = document.createElement("div");
      div.innerHTML = html;
      var newstr = div.textContent || div.innerText || "";
      newstr = newstr.substr(0, newstr.length-1);
      return newstr.trim();
    }

    try{
      var week = await Week
      .findOne({
        date:{
          $gte: new Date(new Date().getTime()-((new Date().getDay()-1)*24*60*60*1000)),
          $lte: new Date(new Date().getTime()-((new Date().getDay()-7)*24*60*60*1000))
        }
      })
      .populate({ path: 'bibleReading.primarySchool.student', populate: { path: 'student'} })
      .populate({ path: 'ministryPart.primarySchool.student', populate: { path: 'student'} })
      .populate('ministryPart.primarySchool.assistant')
    }catch(e){
      console.log("Error on find weeks", e)
      return;
    }
    let speechText = "Lettura biblica: "+ week.bibleReading.primarySchool.student.name +' '+ week.bibleReading.primarySchool.student.surname;
    console.log(week.ministryPart);
    console.log(week.ministryPart.length);

    week.ministryPart.forEach(function(part){
      if(part.forStudent){
        speechText += ', '+getPartTitle(part.html) + ": "+ part.primarySchool.student.name + part.primarySchool.student.surname
      }
    });

    console.log(speechText);

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('Studenti di questa settimana', speechText)
      .getResponse();
  }
};
