var wtj = require('website-to-json');
var express = require('express');
var router = express.Router();
const NodeCache = require("node-cache");
const cache = new NodeCache();



router.route('/:year/:month/:dayStart')

.get(function(req, res) {
    var value = cache.get("WOL_" + req.params.year + '_' + req.params.month + '_' + req.params.dayStart);
    if (value !== undefined) {
        console.log("cached value WOL");
        res.json(value);
    } else {

      // var url = 'https://www.jw.org/it/pubblicazioni/guida-attivita-adunanza/guida-adunanza-' + req.params.month + '-' + req.params.year + '/programma-adunanza-' + req.params.dayStart + '-' + req.params.dayEnd+'/';
    var url = 'https://wol.jw.org/it/wol/dt/r6/lp-i/' + req.params.year + '/' + req.params.month + '/' + req.params.dayStart;
      console.log(url);
        wtj.extractUrl(url, {
        // wtj.extractUrl(, {
                fields: ['data'],
                parse: function($) {
                    var r = function(string) {
                        string = string.replace(new RegExp("<a ", 'g'), "<a target=\"_blank\" ");
                        string = string.replace(new RegExp("href=\"/", 'g'), "href=\"https://wol.jw.org/");
                        return string;
                    }
                    var result = {
                        talk: r($("#section2 #p6").html()),
                        gems: r($("#section2 #p10").html()),
                        bibleReading: r($("#section2 #p15").html())
                    }
                    result.initialSong = $("#section1 #p3").html();
                    if ($("#section3 #p18").length == 0) {
                        result.presentationExercise = r($("#section3 #p17").html());
                        result.initialCall = null;
                        result.returnVisit = null;
                        result.bibleStudy = null;
                    } else {
                        result.presentationExercise = null;
                        result.initialCall = r($("#section3 #p17").html());
                        result.initialCallVideo = false;
                        if(result.initialCall.split("(")[0].toLowerCase().indexOf("video") != -1){
                          result.initialCallVideo = true;
                        }
                        result.returnVisit = r($("#section3 #p18").html());
                        result.returnVisitVideo = false;
                        if(result.returnVisit.split("(")[0].toLowerCase().indexOf("video") != -1){
                          result.returnVisitVideo = true;
                        }
                        result.bibleStudy = r($("#section3 #p19").html());
                        result.bibleStudyVideo = false;
                        if(result.bibleStudy.split("(")[0].toLowerCase().indexOf("video") != -1){
                          result.bibleStudyVideo = true;
                        }else{
                          if (result.bibleStudy.indexOf("Discorso:") != -1 || result.bibleStudy.indexOf("Talk:") != -1 ) {
                              result.isTalk = true;
                          } else {
                              result.isTalk = false;
                          }
                        }
                    }
                    var christianLivingPart = $("#section4 .pGroup>ul>li");
                    //cantico intermedio
                    result.intervalSong = r($(christianLivingPart[0]).find("p").html());
                    christianLivingPart.splice(0, 1)

                    //cantico finale
                    result.finalSong = r($(christianLivingPart[christianLivingPart.length - 1]).find("p").html());
                    christianLivingPart.splice(christianLivingPart.length - 2, 2);

                    //studio biblico
                    result.congregationBibleStudy = r($(christianLivingPart[christianLivingPart.length - 1]).find("p").html());
                    christianLivingPart.splice(christianLivingPart.length - 1, 1);

                    //parti vita cristiana
                    result.christianLivingPart = [];
                    for (var i = 0; i < christianLivingPart.length; i++) {
                        result.christianLivingPart.push(r($(christianLivingPart[i]).find("p").html()));
                    }

                    return result;
                }
            })
            .then(function(result) {
                cache.set("WOL_" + req.params.year + '_' + req.params.month + '_' + req.params.day, result)
                res.json(result);
            }, function(error) {
              console.log(error)
                res.json({
                    talk: '',
                    gems: '',
                    presentationExercise: null,
                    bibleReading: '',
                    initialCall: '',
                    returnVisit: '',
                    bibleStudy: ''
                });
            })
    }

});


module.exports = router;
