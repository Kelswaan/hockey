function CreateViz (url, vizDivSelector, toolbar, onFirstFunction){
    var viz, workbook, vizDiv, iframe;
    if(typeof(toolbar)==='undefined' || toolbar == '') toolbar = 'none';
	vizDiv = $(vizDivSelector);
    
	$hideToolbar = toolbar=='none'?true:false;
	$ToolbarPosition = toolbar.toLowerCase()=='top'?tableauSoftware.ToolbarPosition.TOP:tableauSoftware.ToolbarPosition.BOTTOM;
	$toolbarHeight = toolbar=='none'?0:65;
	
	var options = {
		width: window.innerWidth+'px',
		height: '350px',
		hideToolbar: $hideToolbar,
		hideTabs: false,
		toolbarPosition: $ToolbarPosition,
		onFirstInteractive: TabAnomCompleteLoad
	}
	viz = new tableauSoftware.Viz(vizDiv, url, options);
	
	setTimeout(function(){
		iframe = $('iframe');
		TabAnomScrollbars(iframe);
	}, 1000);
	
	function TabAnomScrollbars (iframez){
		iframez.attr("scrolling", "no").css("overflow","hidden").parent().css("overflow","");
	}
	
	
	function TabAnomGetSize(e){
		TabAnomScrollbars(iframe);
		var height = workbook.getActiveSheet().getSize().maxSize.height;
		var width = workbook.getActiveSheet().getSize().maxSize.width;
		viz.setFrameSize(width, height+$toolbarHeight);
	}
	function TabAnomCompleteLoad(e) {
		iframe = vizDiv.next().find('iframe');
		workbook = viz.getWorkbook();
		TabAnomGetSize(e);
		viz.addEventListener(tableauSoftware.TableauEventName.TAB_SWITCH,  function(e) {
			TabAnomGetSize(e);
		});
		if (typeof onFirstFunction !== 'undefined' && $.isFunction(onFirstFunction)) {
			onFirstFunction(viz, workbook);
		}
	}
}