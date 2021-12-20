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

