(function(){
	function trim(str){ //删除左右两端的空格
　　    return str.replace(/(^\s*)|(\s*$)/g, "");
　　}
	mySlider=function(id,config){
		//每个子页的class
		config.child=config.child||"slider";
		//当前页的class
		config.endClass=config.endClass||"slider_end";
		//换页时间
		config.interval=config.interval||200;
		//换页停顿时间,一个数组
		config.stopTime=config.stopTime||200;
		//1表示纵向，0表示横向，默认纵向
		config.direction=config.direction==null?1:config.direction;
		//开始换页时触发的函数，提供两个参数idx和pages
		config.startCallback=config.startCallback||"";
		//刚换完页之后触发的函数，提供两个参数idx和pages
		config.callback_1=config.callback_1||"";
		//换完页之后可以换下一页时触发的函数，提供两个参数idx和pages
		config.callback_2=config.callback_2||"";
		var target 	=document.getElementById(id),
		  	pages   =target.getElementsByClassName(config.child);
		var init={
			//窗口大小
			winSize: 	{width:window.screen.width,height:pages[0].offsetHeight},
			//总页数
			len: 		pages.length,
			//当前页idx
			curPage: 	0,
			//当前位置
			curPos: 	{top:0,left:0},
			//当前是否可以换页
			isCanChange:true,
			//窗口大小是否改变
			isResize: 	false,
			//计时器
			timer: 		null,
		};
		//定义定位的函数
		var translate=function(dom, dist) {
		    var style = dom && dom.style;
		    if (!style) return;
		    /*style.webkitTransform = 'translate(0,' + dist + 'px)';
		    style.msTransform =
		    style.MozTransform =
		    style.OTransform = 'translate(0,' + dist + 'px)';*/
		    if(config.direction)
		    	style.top=dist+"px";
		    else
		    	style.left=dist+"px";
		};
		//定义换页完成后执行的函数
		var changeDone=function(idx){
			var t=0;
			if(pages[init.curPage]&&pages[idx]){
				pages[init.curPage].className=trim(pages[init.curPage].className.replace(config.endClass,""));
				pages[idx].className=pages[idx].className+" "+config.endClass;
				if(init.isResize){
					var p;
					if(config.direction)
						init.curPos.top=p=idx*(-1)*init.winSize.height;
					else 
						init.curPos.left=p=idx*(-1)*init.winSize.width;
					translate(target,p),init.isResize=false;
				}
				if(typeof(config.stopTime)=="object")
					t=config.stopTime[idx]||200;
				else
					t=config.stopTime;
			}
			if(typeof(config.callback_1)=="function")
				config.callback_1(idx,pages);	
			setTimeout(function(){
				init.curPage=idx,init.isCanChange=true;
				if(typeof(config.callback_2)=="function")
					config.callback_2(idx,pages);
			},t);
		};
		//换页函数
		var changePage=function(idx){
			if(!init.isCanChange) return;
			init.isCanChange=false;
			if(typeof(config.startCallback)=="function")
				config.startCallback(idx,pages);
			var dd;
			if(config.direction)
				dd=(idx*(-1)*init.winSize.height-init.curPos.top)/10;
			else
				dd=(idx*(-1)*init.winSize.width-init.curPos.left)/10;
    		init.timer=setInterval(function(){
    			var endp,cp;
    			if(config.direction)
    				endp=idx*(-1)*init.winSize.height,cp=init.curPos.top;
    			else
    				endp=idx*(-1)*init.winSize.width,cp=init.curPos.left;
    			if((parseInt(cp)<=endp&&parseInt(cp+dd)>=endp)||(parseInt(cp)>=endp&&parseInt(cp+dd)<=endp)){
    				if(config.direction)
    					init.curPos.top=endp;
    				else
    					init.curPos.left=endp;
    				translate(target,endp);
					clearInterval(init.timer);
					changeDone(idx);	
    			}else{
    				var p;
    				if(config.direction)
    					p=init.curPos.top+=dd;
    				else
    					p=init.curPos.left+=dd;
    				translate(target,p);
    			}
    		},config.interval/10);
		};
		//事件函数
		var touchControler={
			mouseP:null,
			moveP:null,
			isMove:false,
			touchStart:function(event){
				event.preventDefault();
				if(init.isCanChange){
					touchControler.mouseP=config.direction?event.touches[0].pageY:event.touches[0].pageX;
					document.addEventListener("touchmove",touchControler.touchMove, false);
					document.addEventListener("touchend",touchControler.touchEnd, false);
				}
			},
			touchMove:function(event){
				if(event.targetTouches.length > 1 || event.scale && event.scale !== 1) return;
				if(init.isCanChange){
					touchControler.moveP=config.direction?event.touches[0].pageY:event.touches[0].pageX;
					if(Math.abs(touchControler.moveP-touchControler.mouseP)>100||touchControler.isMove){
						var p=config.direction?init.curPos.top:init.curPos.left;
						translate(target,p+touchControler.moveP-touchControler.mouseP);
						touchControler.isMove=true;
					}				
				}
			},
			touchEnd:function(event){
				if(init.isCanChange){
					var dd=touchControler.moveP-touchControler.mouseP
					if(touchControler.isMove){
						if(config.direction)
							init.curPos.top+=dd;
						else
							init.curPos.left+=dd;
						touchControler.isMove=false;
						if(touchControler.moveP!=touchControler.mouseP){
							var d=touchControler.moveP<touchControler.mouseP?1:-1;
							var idx=d==1?init.curPage+1:init.curPage-1;
							if(idx>=0&&idx<init.len)
								changePage(idx);
							else if(idx<0)
								init.curPage=-1,changePage(0);
							else
								init.curPage=init.len,changePage(init.len-1);
						}
					}
					document.removeEventListener('touchmove',touchControler.touchMove, false);
	      			document.removeEventListener('touchend',touchControler.touchEnd, false);
				}		
			}
		};
		document.addEventListener("touchstart",touchControler.touchStart, false);
		window.onresize=function(event){
			init.winSize={width:window.screen.width,height:pages[0].offsetHeight};
			init.isResize=true;
			if(init.isCanChange){
				var p;
				if(config.direction)
					init.curPos.top=p=init.curPage*(-1)*init.winSize.height;
				else 
					init.curPos.left=p=init.curPage*(-1)*init.winSize.width;
				translate(target,p),init.isResize=false;
			}
		}
		return {
			changePage:changePage
		};
	};

	window.onload=function(){
		var controlBox=document.getElementById("control_box");
		var mysl=mySlider("list_main",{
			child: 	    	"page",
			endClass:  		"show",
			interval: 		300,
			stopTime: 		300,
			direction: 		1,
			startCallback: 	function(idx,pages){
				controlBox.style.display="none";
			},
			callback_2: 	function(idx,pages){
				if(idx!=pages.length-1)
					controlBox.style.display="block";
				if(idx==0)
					controlBox.className="control_box color";
				else
					controlBox.className="control_box";
			}
		});
		var links=document.getElementById("list_main").getElementsByClassName("page")[6].getElementsByTagName("a");
		for(var i=0;i<links.length;i++){
			links[i].addEventListener("touchstart",function(event){
				event.stopPropagation();
			}, false);
		}
		var pop=document.getElementById("pop_area");
		var ua = navigator.userAgent.toLowerCase();
		if(ua.match(/iphone os/i) == "iphone os"){
			var a=document.getElementsByClassName("btn_ios")[1];
			a.style.display="block";
			a.style.top="19.27rem";
			document.getElementsByClassName("btn_android")[1].style.display="none";
		}else{
			var a=document.getElementsByClassName("btn_android")[1];
			a.style.display="block";
			a.style.top="19.27rem";
			document.getElementsByClassName("btn_ios")[1].style.display="none";
		}
		if(ua.match(/iphone os/i) == "iphone os"&&ua.match(/MicroMessenger/i)!="micromessenger"){
			var p=document.getElementById("list_main");
			var h=p.getElementsByClassName("page")[0].offsetHeight;
			p.style.top=h*6*-1+"px";
			p.getElementsByClassName("page")[6].className="page page7 wap show";
		}else{
			mysl.changePage(0);
		}
		pop.addEventListener("touchstart",function(event){
			event.stopPropagation();
		}, false);
		pop.style.display="none";
		document.getElementsByClassName("btn_ios")[1].addEventListener("touchstart",function(event){
			if(ua.match(/iphone os/i) == "iphone os"&&ua.match(/MicroMessenger/i)=="micromessenger"){
				pop.style.display="block";
			}
		}, false);
		pop.getElementsByTagName("a")[0].addEventListener("touchstart",function(event){
			pop.style.display="none";
			event.stopPropagation();
		}, false);
	}	
})();
