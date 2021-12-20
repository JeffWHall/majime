//************************************************************************************
//************************************************************************************
//
// App Name:  AE-Helper
// Release:  v. 0.5
// Author:  J.W. Hall
//
// Created:  December 3, 2021
// Last Updated:  December 6, 2021
//
// Description:
// Assists in the creation and rendering of MPK movie files using the dataset
// generated by the Majime app.
//
//************************************************************************************
//************************************************************************************

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

////////////////////////////////////////////////////////////////////////////////
// data module
////////////////////////////////////////////////////////////////////////////////
var data = (function() {
  // Import manifest
  var f = File.openDialog("Import CSV Data");
  f.open("r");
  var table = f.read().split("\n");
  f.close();

  var fileData = [];
  var uiData = [];

  // Create separte lists of job descriptions,
  // one for the UI, and one with file system safe names.
  for (var line = 0; line < table.length; line++) {
    if (table[line] != "") {
      uiData.push(table[line].split(',')[0]);
      //fileData.push(table[line].replace(/\/\dc/, "").replace(":", "").split(",")[0]);
      fileData.push(table[line].split(',')[0].replace(/\/\d{1,2}c/, "").replace(':', ''));
    };
  }

  return {
    ui: uiData,
    file: fileData,
  };
})();

////////////////////////////////////////////////////////////////////////////////
// data module -- end
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
// ui module
////////////////////////////////////////////////////////////////////////////////
var ui = (function(data) {
  var appWin = new Window("palette", "Majime AE", undefined, {resizeable: false});
  appWin.orientation = "column";

  { // Group 1
    var groupOne = appWin.add("group", undefined, "GroupOne");
    groupOne.orientation = "column";
    groupOne.size = [400, 40];
    groupOne.alignChildren = "fill";

    var dataList = groupOne.add("dropdownlist", undefined, data);
    dataList.size = [400, 26];
    dataList.alignment = ["center", "center"];
    dataList.selection = 0;
    dataList.active = true;
  }


  { // Group 2
    var groupFour = appWin.add("group", undefined, "GroupFour");
    groupFour.orientation = "column";
    groupFour.alignChildren = "fill";

    var queue_grp = groupFour.add("group", undefined, "QueueGrp");
    queue_grp.minimumSize.height = 50;
    queue_grp.minimumSize.width = 400;

    var queue_btn = queue_grp.add("button", undefined, "\uD83C\uDF7A to Queue");
    queue_btn.alignment = ["right", "center"];
    queue_btn.enabled = true;
  }

  appWin.center();
  appWin.show();

  return {
    ui_win: appWin,
    getJobItemNum: function() { return dataList.selection.index; },
    dataList: dataList,
    addToQueue: queue_btn,
  };
})(data.ui);
////////////////////////////////////////////////////////////////////////////////
// ui module -- end
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
// parseTime module
////////////////////////////////////////////////////////////////////////////////
var parseTime = (function(jobBuilder) {
  function getTime(msg) {
    var theTime = null;
    if ((theTime = /(\d{1,2})\/\d{1,2}c/.exec(msg)) !== null) { // Timezone format
      return theTime[1];
    } else if ((theTime = /(\d{1,2})[ap]/.exec(msg)) !== null) { // Straight time format
      return theTime[1];
    }
    return 0; // Hide time
  }

  return {
    getTime: getTime,
  }
})(jobBuilder);
////////////////////////////////////////////////////////////////////////////////
// parseTime module -- end
////////////////////////////////////////////////////////////////////////////////

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


////////////////////////////////////////////////////////////////////////////////
// queue module
////////////////////////////////////////////////////////////////////////////////
var queue = (function() {
  var q = app.project.renderQueue;
  var qItem = 1;

  function set_queueItem() {
    qItem = (q.numItems == 0) ? 1 : q.numItems + 1;
  }

  function create_file(job_name) {
    var job_path = "~/Desktop/MPK drop/Dailies/";
    var job_folder = Folder (job_path);
    var job_file = File (job_path + "/" + job_name);
    job_folder.create();
    return job_file;
  }

  function render_job() {
    var renderStatus = true;
    q.render();

    while (renderStatus) {
      if (q.rendering == true) {
        renderStatus = true;
      } else renderStatus = false;
    }
  }

  function create_job(payload, theComp) {
    set_queueItem();

    q.items.add(theComp);
    q.item(qItem).outputModule(1).applyTemplate("Scripps MPK");
    q.item(qItem).outputModule(1).file = create_file(payload);

    render_job();
  }

  return {
    createJob: create_job,
  };
})(); 
////////////////////////////////////////////////////////////////////////////////
// queue module -- end
////////////////////////////////////////////////////////////////////////////////



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

////////////////////////////////////////////////////////////////////////////////
// event manager module
////////////////////////////////////////////////////////////////////////////////
ui.addToQueue.onClick = function() { queue.createJob(data.file[ui.getJobItemNum()], app.project.activeItem); };
ui.dataList.addEventListener("change", function(evt) { jobBuilder.build(evt.target.selection.text.toLowerCase()); });

////////////////////////////////////////////////////////////////////////////////
// event manager module -- end
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
// factory module
////////////////////////////////////////////////////////////////////////////////
var Factory = (function(data, jobBuilder, queue, dom) {
  function populateRenderQueue() {
    for(var i = 0; i < data.ui.length; i++) {
      queue.createJob(
        data.file[i],
        dom.masters[jobBuilder.getShow(data.ui[i].toLowerCase())]
      );
    }
  }
  
  function render_each_job() {
    for(var i = 0; i < data.ui.length; i++) {
      jobBuilder.build(data.ui[i].toLowerCase());
      queue.createJob(
        data.file[i],
        dom.masters[jobBuilder.getShow(data.ui[i].toLowerCase())]
      );
    }
  }

  return {
    populateRenderQueue: populateRenderQueue,
    render_each_job: render_each_job,
  }
})(data, jobBuilder, queue, dom);

////////////////////////////////////////////////////////////////////////////////
// factory module -- end
////////////////////////////////////////////////////////////////////////////////



//Factory.populateRenderQueue();
Factory.render_each_job();


////////////////////////////////////////////////////////////////////////////////
// app module
////////////////////////////////////////////////////////////////////////////////
var AppController = (function(data, jobBuilder, queue, dom) {
  function populateRenderQueue() {
    for(var i = 0; i < data.ui.length; i++) {
      queue.createJob(
        data.file[i],
        dom.masters[jobBuilder.getShow(data.ui[i].toLowerCase())]
      );
    }
  }

  return {
    populateRenderQueue: populateRenderQueue,
  }
})(data, jobBuilder, queue, dom);

////////////////////////////////////////////////////////////////////////////////
// app module -- end
////////////////////////////////////////////////////////////////////////////////
