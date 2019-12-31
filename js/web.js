(function(){
	var $pages=$("#list_main").find(".page").not(".wap"),
		$controlBox=$("#control_box"),
		$controls=$controlBox.find("a"),
		$bottom=$("#bottom_area"),
		$listTops=$("#list_top").find("li");
	var data={
		pLength:$pages.length,
		curP:0,
		isCan:true
	};
	var isCss3=function(){
		var style=document.createElement("div").style;
	    for(var k in style){
	     	if(k.toLowerCase().indexOf("animation")>0){
	     		return true;
	     	}
	     }
	     return false;
	}();
	var pageChange=function(idx){
		if(idx>=0&&idx<data.pLength&&idx!=data.curP&&data.isCan){
			var ct,nt;
			if(idx>data.curP)
				ct="-100%",nt="100%";
			else
				ct="100%",nt="-100%";
			data.isCan=false;
			if(idx!=data.pLength-1)
				$bottom.css("display","none");
			$controls.removeClass("on").eq(idx).addClass("on");
			$pages.eq(data.curP).stop().animate({top:ct},400);
			$pages.eq(idx).css("top",nt).animate({top:0},400,function(){
				data.isCan=true;
				$(this).addClass("show");
				$pages.eq(data.curP).removeClass("show");
				data.curP=idx;
				if(idx==data.pLength-1)
					$bottom.css("display","block");
			});
		}
	}
	$controls.click(function(){
		pageChange($controls.index(this));
	});
	$(document).on("mousewheel DOMMouseScroll",function(event){
		var sd=event.originalEvent.wheelDelta||event.originalEvent.detail*-1;
		if(sd>0)
			pageChange((data.curP-1)%data.pLength);
		else
			pageChange((data.curP+1)%data.pLength);
	});
	$(window).resize(function(){
		var w=$(window).width();
		if(isCss3){
			var cls;
			switch(true){
				case w>=1025:{cls="";break;}
				case w<1025&&w>=900:{cls="small9";break;}
				case w<900&&w>=800:{cls="small8";break;}
				case w<800&&w>=700:{cls="small7";break;}
				case w<700&&w>=600:{cls="small6";break;}
				case w<600&&w>=500:{cls="small5";break;}
				case w<500&&w>=400:{cls="small4";break;}
				case w<400&&w>=300:{cls="small3";break;}
				case w<300&&w>=200:{cls="small2";break;}
			}
			for(var i=0;i<data.pLength;i++){
				$pages.eq(i).find(".content").attr("class","content "+cls);
			}
		}
		if(w<1000)
			$controlBox.css("right",20);
		else
			$controlBox.css("right",100);
	});
	$(window).resize();
})();