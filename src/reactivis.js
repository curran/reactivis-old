define([], function(){
  return {

    // (box, margin) -> (width, height)
    margin: function (model) {
      model.when(['box', 'margin'], function (box, margin) {
        model.set('width', box.width - margin.left - margin.right);
        model.set('height', box.height - margin.top - margin.bottom);
      });
    }
  };
});
