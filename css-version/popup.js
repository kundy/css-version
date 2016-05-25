/*
 * Copy Right: tonytony.club
 * Comments: 自动抢筹码
 * Author: kundy
 * Date: 2016-04-10
 */




(function(){



init();


var FRAME_DATA;
var TASK_DATA;
function init(){

 	dataUpdate();
 }


function dataUpdate(){
	msg_background("GET_FRAME_DATA",function(data){
		FRAME_DATA = data;
		pageRefresh();
	});

}



//页面刷新
function pageRefresh(){

	var html="";

	for(var i in FRAME_DATA){
		//console.log(CHIP_DATA[item]);

		html+='<li>';
		html+='<a href="'+FRAME_DATA[i][0]+'" target="_blank" class="name">'+FRAME_DATA[i][0]+'</a>'
		var version = FRAME_DATA[i][1];
		var version_data = version.split(",");
		html+='<span class="version">';

		if(version_data[0]=='')html+='<span class="fail">无版本信息</span>'

		if(version_data[0]!='')html+='<span class="date">'+version_data[0]+'</span>'
		if(version_data.length>1)html+='<span class="nick">'+version_data[1]+'</span>'
		if(version_data.length>2)html+='<span class="index">'+version_data[2]+'</span>';

		if(FRAME_DATA[i][2]==1)html+='<span class="direct">直出样式</span>'

		html+='</span>';
		html+='</li>';
	}

	$(".frame-list").html(html);

	if(FRAME_DATA.length==0){
		$(".frame-list").html("<span style='font-size:26px;'>未检测空间的样式文件！</span>");
	}



}



//与background通信
function msg_background(_cmd,_cb){

	chrome.runtime.sendMessage(_cmd, function(response){
	    _cb(response);
	});
}


//响应消息
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
	//console.log(message);
    if(message == 'DATA_UPDATE'){
    	dataUpdate();
    }

    else if(message == 'TASK_START'){
    	$('button.refresh').addClass("loading disabled");
    }

    else if(message == 'TASK_FINISH'){
    	$('button.refresh').removeClass("loading disabled");
    }
});



//与background通信
function msg_background(_cmd,_cb){

	chrome.runtime.sendMessage(_cmd, function(response){
	    _cb(response);
	});
}

})();












