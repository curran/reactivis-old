
define('reactivis/reactivis',[''], function(){
  return {
    test: function () {
      return 'A';
    }
  };
});

define('reactivis', ['reactivis/reactivis'], function (main) { return main; });
