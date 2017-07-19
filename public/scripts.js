$(document).ready(function() {

  	$('#map').on('show.bs.modal', function () {
       $(this).find('.modal-body').css({
              // 'width':'auto', //probably not needed
              // 'height':'auto', //probably not needed 
              'max-width': '110%',
              'max-height': '110%',
              'padding':'24px',

       });
       console.log('map-resized');
	});

});