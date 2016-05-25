

var FRAME_DATA={};

chrome.webRequest.onBeforeSendHeaders.addListener(
    function(details){
        if(details.type=="stylesheet")handle_css_url(details.tabId,details.url);
    },
    {
        urls: [
            "<all_urls>"
        ]
    },
    [
        "blocking",
        "requestHeaders"
    ]
);



//只处理空间的域名
var url_prefix=[
	"qzonestyle.gtimg.cn",
	"qzs.qq.com",
	"imgcache.qq.com"
]


//处理css文件
function handle_css_url(tabid,url){
	for(var i =0;i<url_prefix.length;i++){
		if(url.indexOf(url_prefix[i])>-1){
			get_css(tabid,url,0);
		}
	}
}

//获取样式文件内容
function get_css(tabid,url,direct_css_flag){
	//手动添加协议头
	if(url.indexOf("http://")==-1 && url.indexOf("https://")==-1 && url.indexOf("//")===0){
		url = "http:"+url;
	}
	getData(url,function(data){
		var css_data = handle_css_data(data);
		frame_insert_data(tabid,url,css_data,direct_css_flag);
	},function(){
		frame_insert_data(tabid,url,"",direct_css_flag);
	})
}


//处理css数据，拿到cssgaga、kaka数据
function handle_css_data(data){

	//获取gaga数据
	var gaga_match_data = data.match(/CssGaga\{(.*?)\}/);
	if(gaga_match_data){
		var gaga_data = gaga_match_data[1].replace("content:","").replace('"','').replace('"','');
		return gaga_data;
	}

	//处理kaka数据
	var kaka_match_data = data.match(/\/\* kaka:(.*?)\*\//);
	if(kaka_match_data){
		var kaka_data = kaka_match_data[1];
		return kaka_data;
	}

	//处理kaka2数据
	//#KAKA{content:"160525113302,markqin"}
	var kaka_match_data = data.match(/#KAKA\{(.*?)\}/);
	if(kaka_match_data){
		var kaka_data = kaka_match_data[1].replace("content:","").replace('"','').replace('"','');;
		return kaka_data;
	}

	return "";


}



//处理好的数据插入到FRAME_DATA中
function frame_insert_data(tabid,url,data,direct_css_flag){
	if(!FRAME_DATA[tabid])FRAME_DATA[tabid]=[];

	var frame_css_flag = false;
	for(var i =0;i<FRAME_DATA[tabid].length;i++){
		if(FRAME_DATA[tabid][i][0] == url){
			frame_css_flag=true;
			FRAME_DATA[tabid][i][1]=data;
			FRAME_DATA[tabid][i][2]=direct_css_flag;
		}
	}

	if(!frame_css_flag){
		FRAME_DATA[tabid].push([url,data,direct_css_flag]);
	}
	
}




//请求URL文本
function getData(url,succCb,failCb)
{
    $.ajax( {  
        url:url,  
        type:'get',  
        dataType:'text',  
        success:function(data) {  
            succCb(data);
        },  
        error : function() {  
            failCb(); 
        }  
    });
}


function check_direct_out_css(){
  	// chrome.tabs.executeScript(null,
   //  	{code:"document.querySelectorAll('link')"}
   //  );
}



//关闭标签时
chrome.tabs.onRemoved.addListener(function(tabid,removeInfo){
	removeTab(tabid);
});


function removeTab(tabid){
	if(FRAME_DATA[tabid]){
		delete FRAME_DATA[tabid];
	}
}


//切换标签页时，更新CURRENT_TAB_ID
var CURRENT_TAB_ID = -1;
chrome.tabs.onSelectionChanged.addListener(function(tabId, changeInfo) {   
    CURRENT_TAB_ID = tabId;
});   


//接收popup消息
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
    if(message == 'GET_FRAME_DATA'){
    	if(FRAME_DATA[CURRENT_TAB_ID])
    		sendResponse(FRAME_DATA[CURRENT_TAB_ID]);
    	else
    		sendResponse("");

        //检测页面是否有直出样式
        check_direct_out_css();
    }

});




//接收content-script消息
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
	//console.log(request);
    if(request.type=="CSS_VERSION_FIND_CSS"){
    	if(request.data){
    		get_css(sender.tab.id,request.data,1);
    	}
    }
    sendResponse("ok")

});