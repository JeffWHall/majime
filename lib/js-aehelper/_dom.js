////////////////////////////////////////////////////////////////////////////////
// dom module
////////////////////////////////////////////////////////////////////////////////
var dom = (function() {
  for (var i = 1; i <= app.project.items.length; i++) {
    if (app.project.items[i] instanceof CompItem && app.project.items[i].name == "HF0") {
      var hf0 = app.project.items[i];
    }
    if (app.project.items[i] instanceof CompItem && app.project.items[i].name == "NCI") {
      var nci = app.project.items[i];
    }
    if (app.project.items[i] instanceof CompItem && app.project.items[i].name == "SVU") {
      var svu = app.project.items[i];
    }
    if (app.project.items[i] instanceof CompItem && app.project.items[i].name == "Time DB") {
      var timeDB = app.project.items[i];
    }
    if (app.project.items[i] instanceof CompItem && app.project.items[i].name == "tunein day time") {
      var tunein = app.project.items[i];
    }
  }

  var CLASS_LIST = [];

  function setTime(msg) {
    for (var i = 1; i <= timeDB.numLayers; i++) {
      timeDB.layer(i).opacity.setValue(0);
    }

    if (msg === 0) return;
    timeDB.layer(msg).opacity.setValue(100);
  }

  function setDay(msg) {
    var day = "";
    if (CLASS_LIST.length > 1) {
      day = CLASS_LIST[1] + " " + msg;
    } else day = msg;
    
    tunein.layer("Day1").property("Source Text").setValue(day);
  }

  function setClassifier(msg) {
    CLASS_LIST = msg;
    tunein.layer("Classifier1").property("Source Text").setValue(CLASS_LIST[0]);
  }

  return {
    masters: {
      "HF0": hf0,
      "NCI": nci,
      "SVU": svu,
    },
    timeDB: timeDB,
    setTime: setTime,
    setDay: setDay,
    setClassifier: setClassifier,
  };
})();

////////////////////////////////////////////////////////////////////////////////
// dom module -- end
////////////////////////////////////////////////////////////////////////////////

