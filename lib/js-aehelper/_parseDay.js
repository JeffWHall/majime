////////////////////////////////////////////////////////////////////////////////
// parse day module
////////////////////////////////////////////////////////////////////////////////
var parseDay = (function() {
  var day_dictionary  = {
    sunday: ["sunday", "sun"],
    monday: ["monday", "mon"],
    tuesday: ["tuesday", "tues", "tue"],
    wednesday: ["wednesday", "wed"],
    thursday: ["thursday", "thur", "thu"],
    friday: ["friday", "fri"],
    saturday: ["saturday", "sat"],
    today: ["today", "tod"],
    tonight: ["tonight", "ton"],
    tomorrow: ["tomorrow", "tom"]
  };

  var date_dictionary = {
    january: ["january", "jan"],
    february: ["february", "feb"],
    march: ["march", "mar"],
    april: ["april", "apr"],
    may: ["may", "may"],
    june: ["june", "jun"],
    july: ["july", "jul"],
    august: ["august", "aug"],
    september: ["september", "sep", "sept"],
    october: ["october", "oct"],
    november: ["november", "nov"],
    december: ["december", "dec"]
  };

  function getDay(msg) { 
    var day = "";

    // Attempt to find weekday
    for (var key in day_dictionary) {
      for (var i = 0; i < day_dictionary[key].length; i++) {
        var rgx = new RegExp(day_dictionary[key][i]);

        if (day_dictionary.hasOwnProperty(key) && rgx.test(msg)) {
          day = key.toUpperCase();
        }
      }
    }

    // If weekday, look for Next qualifier
    if (day) {
      if (/(?:next|nex|nxt)/.test(msg)) {
        day = "NEXT " + day;
      }
    }

    // If no weekday, look for Next or Continues Next
    if (!day) {
      if (/(?:next|nex|nxt)/.test(msg)) day = "NEXT";
      if (/continues/.test(msg)) day = "CONTINUES " + "NEXT";
    }

    // If no weekday, and no Next, look for date
    if (!day) {
      for (var key in date_dictionary) {
        for (var i = 0; i < date_dictionary[key].length; i++) {
          var rgx = new RegExp(date_dictionary[key][i]);

          if (date_dictionary.hasOwnProperty(key) && rgx.test(msg)) {
            day = key.toUpperCase();
          }
        }
      }
      if (day) {
        day += " " + /(\d{1,2})/.exec(msg)[0].toString();
      }
    }
    return day;
  }

  return {
    getDay: getDay,
  }
})();

////////////////////////////////////////////////////////////////////////////////
// parse day module -- end
////////////////////////////////////////////////////////////////////////////////


