var express = require('express');
var router = express.Router();

const expressAdapter = require('ask-sdk-express-adapter')
const Alexa = require('alexa-sdk');
const handlers = require('./handlers/handlers').handlers;
const skillBuilder = Alexa.SkillBuilders.custom();
const skill = skillBuilder.create();
const adapter = new expressAdapter.ExpressAdapter(skill, true, true);

router.route('/')
  .get(async (req, res) => {

    const alexa = Alexa.handler(req.body, context);
    alexa.registerHandlers(handlers);
    alexa.execute();
  })
