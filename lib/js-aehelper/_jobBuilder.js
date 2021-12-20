

////////////////////////////////////////////////////////////////////////////////
// job builder module
////////////////////////////////////////////////////////////////////////////////
var jobBuilder = (function(dom, parseTime, parseDay, parseClassifier) {
  var showPatterns = {
    "HF0": "hawaii five",
    "SVU": "order: svu",
    "NCI": "ncis",
    "BBD": "blue bloods",
  };

  function showLookup(show) {
    var showKey = "";

    for (var key in showPatterns) {
      var rgx = new RegExp(showPatterns[key]);
      
      if (showPatterns.hasOwnProperty(key)) {
        if (rgx.test(show))
          showKey = key;
      }
    }

    return showKey;
  }

  function build(msg) {
    var current_show = showLookup(msg);

    //var timeStatus = parseTime.getTime(msg);
    dom.setTime(parseTime.getTime(msg));
    dom.setClassifier(parseClassifier.getClassifier(msg));
    dom.setDay(parseDay.getDay(msg));
  }

  return {
    getShow: showLookup,
    build: build,
  }
})(dom, parseTime, parseDay, parseClassifier);

////////////////////////////////////////////////////////////////////////////////
// job builder module -- end
////////////////////////////////////////////////////////////////////////////////

