$(function (argument) {
	var $window = $(window)

	  // make code pretty
    window.prettyPrint && prettyPrint();

    // side bar
    setTimeout(function () {
      $('.docs-sidenav').affix({
        offset: {
          top: function () { return $window.width() <= 980 ? 290 : 210 }
        , bottom: 270
        }
      })
    }, 100);
});