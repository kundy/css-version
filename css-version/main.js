

(function(){

//console.log("[CONTENT-SCRIPT] START url:"+location.href);

setTimeout(init,200);
function init(){
	var styleList =document.querySelectorAll('style');
	for(var i=0;i<styleList.length;i++){
		if(styleList[i].getAttribute("data-url")){
			var msg = {type:"CSS_VERSION_FIND_CSS",name:"url",data:styleList[i].getAttribute("data-url")};
			posd_msg_background(msg);
		}

	}
}




//发送消息给扩展
function posd_msg_background(msg){
	chrome.extension.sendMessage(msg, function(response) {
	    //console.log(response);
	});
}


})()






