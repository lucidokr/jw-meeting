var wtj = require('website-to-json');
var express = require('express');
var router = express.Router();
const NodeCache = require( "node-cache" );
const cache = new NodeCache();



router.route('/:year/:month/:day')

  .get(function(req, res) {
    var value = cache.get("WOL_"+req.params.year+'_'+req.params.month+'_'+req.params.day);
    if(value !== undefined){
      console.log("cached value WOL");
      res.json(value);
    }else{
      wtj.extractUrl('https://wol.jw.org/it/wol/dt/r6/lp-i/'+req.params.year+'/'+req.params.month+'/'+req.params.day, {
        fields: ['data'],
        parse: function($) {
          var r = function(string){
            return string.replace("href=\"", "target=\"_blank\" href=\"https://wol.jw.org")
          }
          var result = {
            talk: r($("#section2 #p6").html()),
            gems: r($("#section2 #p10").html()),
            bibleReading : r($("#section2 #p15").html())
          }
          result.initialSong = $("#section1 #p3").html();
          if($("#section3 #p18").length == 0){
            result.presentationExercise = r($("#section3 #p17").html());
            result.initialCall = null;
            result.returnVisit = null;
            result.bibleStudy = null;
          }else{
            result.presentationExercise = null;
            result.initialCall = r($("#section3 #p17").html());
            result.returnVisit = r($("#section3 #p18").html());
            result.bibleStudy = r($("#section3 #p19").html());
            if(result.bibleStudy.indexOf("Discorso:") != -1){
              result.isTalk = true;
            }else{
              result.isTalk = false;
            }
          }
          var christianLivingPart = $("#section4 .pGroup li");
          //cantico intermedio
          result.intervalSong = $(christianLivingPart[0]).find("p").html();
          christianLivingPart.splice(0,1)

          //cantico finale
          result.finalSong = $(christianLivingPart[christianLivingPart.length-1]).find("p").html();
          christianLivingPart.splice(christianLivingPart.length-2,2);

          //studio biblico
          result.congregationBibleStudy = $(christianLivingPart[christianLivingPart.length-1]).find("p").html();
          christianLivingPart.splice(christianLivingPart.length-1,1);

          //parti vita cristiana
          result.christianLivingPart = [];
          for(var i=0; i<christianLivingPart.length; i++){
            result.christianLivingPart.push($(christianLivingPart[i]).find("p").html());
          }

          return result
        }
      })
        .then(function(result) {
          cache.set("WOL_"+req.params.year+'_'+req.params.month+'_'+req.params.day, result)
          res.json(result);
        },function(error) {
          res.json({
            talk: '',
            gems: '',
            presentationExercise : null,
            bibleReading: '',
            initialCall: '',
            returnVisit: '',
            bibleStudy: ''
          });
        })
    }

  });


module.exports = router;







