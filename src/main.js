$(document).ready(function(){
	//toogle view/edit mode
	$("#change-mode").click(function(){
		var mode = $(this).data('mode');
		mode == 'view' ? changeToEditMode() : changeToViewMode();
	});

	//truncate account name
	var account = $(".name-account").text();
	truncateAccountName(account);

	//generate random details for metrics
	$(".metric").not(".new-metric").each(function(){
		$(this).append( generateRandomDetails() );
	})

	//binding deleteNodes and newMetric functions to buttons
	$(document).on('click','.js-delete-metric',deleteMetric );
	$(document).on('click','.new-metric',newMetric );


	function changeToViewMode(){
		$("#change-mode").data('mode', 'view');
		$(".metric").removeClass('edit-metric');
		toogleEditableMetrics(false);
	}

	function changeToEditMode(){
		$("#change-mode").data('mode', 'edit');
		$(".metric").not('.new-metric').addClass('edit-metric');
		toogleEditableMetrics(true);
	}

	function toogleEditableMetrics(editable){
		if(editable){
			$(document).on('click','.metric-title', changeTitle );
			$("#change-mode").addClass("active").html('EXIT EDITION MODE');
			$(".edit-metric").each(function(){
				$(this).append('<a class="js-delete-metric"><span class="fa fa-times"></span></a>');
				$(this).children('.metric-title').after('<span class="fa fa-pencil editable-name"></span>');
			});
		}else{
			$(document).off('click','.metric-title');
			$("#change-mode").removeClass("active").html('<span class="fa fa-pencil"></span>');
			$("a.js-delete-metric").remove();
			$(".editable-name").remove();
		}
		truncateAccountName(account);
	}

	function changeTitle(param){
		var element =  param.currentTarget || param;

		var placeholder = $(element).text();
		$(".editable-name").remove();
		
		//replace title by input
		$(element).replaceWith('<input class="metric-title input-metric-title">');
		$(".input-metric-title").val(placeholder).focus();

		//replace input with the result 
		$(".input-metric-title").focusout(function(){
			var title = $(this).val() == '' ? placeholder: $(this).val();
			$(this).replaceWith('<h3 class="metric-title">'+title+'</h3>');
			if( $("#change-mode").data('mode') != 'view'){
				$(".metric-title").after('<span class="fa fa-pencil editable-name"></span>');
			}
		});

		//bind esc and enter
		$(".input-metric-title").keyup(function(e) {
	    if(e.keyCode == 13) $(".input-metric-title").focusout();
	    if(e.keyCode == 27) $(".input-metric-title").val(placeholder).focusout();
	  });
	}

	function deleteMetric(){
		$(this).parent('.metric').remove();
	}

	function newMetric(){
		var metric = $('<article class="metric"></article>');
		var title = $('<h3 class="metric-title">Metric name</h3>');
		var details = generateRandomDetails();
		metric.append(title);
		$(".new-metric").before(metric);
		changeTitle(title);
		metric.append(details);
	}

	function generateRandomDetails(){
		var random = Math.floor(Math.random() * 3);
		var text = "";
		//special case, the strings are added, breaks no needed
		switch(random){
			case 0: text = text + "<span>Limit X reached</span>";
			case 1: text = text + "<span>162 updates</span>";
			case 2: text = text + "<span>Monthly resolution</span>";
		}
		return $('<div class="details">'+text+'</div>');
	}

	function truncateAccountName(name){	
		var width = $(".content").width() - $("#change-mode").width() - 90;
		$(".name-account").text(name).widthTruncate({width: width});
	}

}); //end ready

//plugin jquery widthTruncate
(function($){
 $.fn.extend({
 	widthTruncate: function(options) {
		var defaults = {
			width: 'auto',
			after: '...'
		};
	  var options = $.extend(defaults, options);
 
	  return this.each(function() {
		  if(options.width=='auto'){ 
		  	truncateWidth=$(this).width()-8; 
		  }else{ 
		  	truncateWidth = options.width
		  }
			if($(this).width() > truncateWidth ){		 
				var smaller_text = $(this).text();
				$(this).html('<span id="truncateWrapper" style="display:inline;">'+options.after+'</div>');
				i=1;
				while ($('#truncateWrapper').width() < truncateWidth) {
					$('#truncateWrapper').html(smaller_text.substr(0, i) + options.after);
					i++;
				}
				$(this).html($('#truncateWrapper').html());
			}
		});
	}
 });
})(jQuery);