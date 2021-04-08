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
                      if(string){
                        string.trim()
                        string = string.replace(new RegExp("<a ", 'g'), "<a target=\"_blank\" ");
                        string = string.replace(new RegExp("href=\"/", 'g'), "href=\"https://wol.jw.org/");
                      }
                      return string;

                    }
                    if($("#section2").length == 0 && $(".itemData").html().indexOf("Commemorazione") !== -1){
                      console.log("commemorazione");
                      result = {
                        memorial: true
                      }
                      return result;
                    }

                    var teasureOfGodsWord = $("#section2 .pGroup>ul>li")
                    var result = {
                      talk: null,
                      gems: null,
                      bibleReading: null
                    }
                    if(teasureOfGodsWord.length > 0){
                      if(teasureOfGodsWord[0]) result.talk = r($(teasureOfGodsWord[0]).find("p").first().html())
                      if(teasureOfGodsWord[1]) result.gems = r($(teasureOfGodsWord[1]).find("p").first().html())
                      if(teasureOfGodsWord[2]) result.bibleReading = r($(teasureOfGodsWord[2]).find("p").first().html())
                    }

                    result.weeklyBibleReading = r($("#p2>a>strong").html());
                    result.initialSong = $("#section1 #p3").html();

                    // AFTER 2019
                    var parts = $('#section3 .pGroup>ul>li').map(function(val) {
                      return $(this).html();
                    }).get();
                    result.ministryPart = [];
                    for(var i=0; i<parts.length; i++){
                      var forStudent = true, isTalk = false;
                      var partHtml = r(parts[i]);
                      var partHtmlTitle = partHtml.split("(")[0].toLowerCase();
                      if(partHtmlTitle.indexOf("video") != -1 || partHtmlTitle.indexOf("applicati") != -1 || partHtml.indexOf("Trattazione") != -1 )
                        forStudent = false;

                      if(partHtmlTitle.indexOf("discorso") != -1 || partHtml.indexOf("Trattazione") != -1 )
                        isTalk = true;

                      result.ministryPart.push({html: partHtml, forStudent: forStudent, isTalk: isTalk});
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
