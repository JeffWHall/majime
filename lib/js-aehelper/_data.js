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

