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

