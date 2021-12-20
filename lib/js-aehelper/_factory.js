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

