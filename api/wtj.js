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


                    // AFTER 2019
                    var parts = $("#section3 .su");
                    var partsaaa = $('#section3 p').map(function(val) {
                      return $(this).html();
                    }).get();
                    result.ministryPart = [];
                    console.log("UUUU:"+partsaaa);
                    for(var i=0; i<partsaaa.length; i++){
                      var forStudent = true, isTalk = false;
                      var partHtml = r(partsaaa[i]);
                      var partHtmlTitle = partHtml.split("(")[0].toLowerCase();
                      if(partHtmlTitle.indexOf("video") != -1 || partHtmlTitle.indexOf("applicati") != -1)
                        forStudent = false;

                      if(partHtmlTitle.indexOf("discorso") != -1)
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
