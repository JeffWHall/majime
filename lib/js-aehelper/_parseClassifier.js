////////////////////////////////////////////////////////////////////////////////
// parse classifier module
////////////////////////////////////////////////////////////////////////////////
var parseClassifier = (function() {
  var classifier_dictionary  = {
    "premieres": ["premieres"],
    "all day": ["all day"],
  };


  function getClassifier(msg) { 
    var classifiers = [];

    // Special case of the various New Episode permutations
    if (/(new\s+episode)/.test(msg)) {
      if (/(all-new\s+episode)/.exec(msg)) {
        classifiers.push("ALL-NEW EPISODE");
      } else if (/(new\s+episode(?!s))/.exec(msg)) {
        classifiers.push("NEW EPISODE");
      } else if (/(new\s+episodes)/.exec(msg)) {
        classifiers.push("NEW EPISODES");
      }
    }

    for (var key in classifier_dictionary) {
      for (var i = 0; i < classifier_dictionary[key].length; i++) {
        var rgx = new RegExp(classifier_dictionary[key][i]);

        if (classifier_dictionary.hasOwnProperty(key) && rgx.test(msg)) {
          classifiers.push(key.toUpperCase());
        }
      }
    }


    if (classifiers.length == 0) return [""];
    return classifiers;
  }

  return {
    getClassifier: getClassifier,
  }
})();

////////////////////////////////////////////////////////////////////////////////
// parse classifier module -- end
////////////////////////////////////////////////////////////////////////////////


