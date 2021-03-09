  if (typeof(window.ONTVdebug)=="undefined"){window.ONTVdebug = function( a , l ){ if (l<=0){ console.log( a ); }}}
  window.ONTVdebug("Onnetwork Player Loader",1);
      window.ONTVdebug( "SID websiteID:528 " , 1 );
    window.ONTVdebug( "SID videoID:0 " , 1 );
    window.ONTVdebug( "SID playlistID:254 " , 1 );
  if (typeof(window.ONTVPlayers)=="undefined"){window.ONTVPlayers=new Array();window.ONTVplayerNb=0;window.ONTVOts=new Array();}
  if (typeof(window.ONTVAddScript)=="undefined"){
    window.ONTVAddScript = function( url , async , loadfunc ){
      ns=document.createElement("script");fs=document.getElementsByTagName("script")[0];ns.src=url;ns.async=async;
      ns.onload=loadfunc;fs.parentNode.insertBefore(ns,fs);}
      window.ONTVAddScript("https://cdn.onnetwork.tv/js/intersection-observer.min.js",false,function(){
      var poped=window.ONTVOts.pop();while(typeof(poped)!="undefined"){window.ONTVstartObserver(poped);poped=window.ONTVOts.pop();}});
  }
  window.ONTVplayerNb++ ;
  window.ONTVPlayers.push( { containerId:"",
                     playerDelay:1,
                     miniaturePlayer: 2 ,
                     mMiniaturePlayer:0,
                     miniatureCloser:4,
                     miniatureCloserDelay:5,
                     miniatureTarget : "",
                     miniaturePos : 0,
                     miniatureLevel : 0.7,
                     miniatureAgain : 0,
                     miniatureMBlock : 0,
                     outstream : '',
                     newoutstream : 0,
                     ocloser : 0,
                     hmv : 0,
                     dsmv : 0,
                     dsmcv : 0,
                     baseId:"EXS1a7df2a4f1796b1440858acd6b905975",
                     divId: "EXS1a7df2a4f1796b1440858acd6b905975" + window.ONTVplayerNb,
                     frameId: "ffEXS1a7df2a4f1796b1440858acd6b905975" + window.ONTVplayerNb,
                     div2Id: "dffEXS1a7df2a4f1796b1440858acd6b905975" + window.ONTVplayerNb,
                     div : null,
                     frame : null,
                     div2 : null,
                     frameSrc : "https://video.onnetwork.tv/frame86.php?mid=MCw0eDMsMywwLDI1NCw1MjgsMiwwLDEsMCwwLDAsMiwwLDQsMSwwLDEsMSwyLDAsMCwwLDAsMCw1LDEsLTE7LTE7MjA7MjAsMCw3MCww&preview=0&iid=0&e=1&id=ffEXS1a7df2a4f1796b1440858acd6b905975"+window.ONTVplayerNb,
                     mid:"MCw0eDMsMywwLDI1NCw1MjgsMiwwLDEsMCwwLDAsMiwwLDQsMSwwLDEsMSwyLDAsMCwwLDAsMCw1LDEsLTE7LTE7MjA7MjAsMCw3MCww",
                     wid : 528,
                     widget : 0,
                     cid : 0,
                     ar : 75 ,
                     added : false ,
                     addcount : 0,
                     isfs :0,
                     number : window.ONTVplayerNb ,
                     preview : 0,
                     iid : "0",
                     ls : 0,
                     optout : 0,
                     ap : 0,
                     sfs : 0,
                     smfmo : 0,
                     map : 0,
                     mtitle : '',
                     vids : '',
                     ampsrc : 0,
                     podcast : 0,
                     isCpl : 0,
                     vasturl : '',
                     useDfpParams : false ,
                     insertNode : document.currentScript.parentNode ,
                     scriptSibling : document.currentScript.nextElementSibling } );  
  if (typeof(ONTVIFstyle)=="undefined"){
    var ONTVIFstyle = document.createElement("style");
    ONTVIFstyle.innerHTML = 'div.onnetworkplayercontainer{position:relative;padding-bottom:calc( 56.25% - 1px );height:auto;transition:padding-bottom 0.4s ease;' +
                      'overflow:hidden;margin:0px;width:100%;min-width:100%;max-width:100%;max-height:100%;min-height:1px;z-index:10;}'+
                      'div.onnetworkplayercontainer.outstream{padding-bottom:1px;opacity:0;max-height:1px;}' +
                      'div.onnetworkplayercontainer.outstream.isplayinga{padding-bottom:calc( 56.25% - 1px );opacity:1;max-height:none;}' +
                      'div.onnetworkplayercontainer.ocloser{margin-top:20px;overflow:visible;}' +
                      'div.onnetworkplayercontainer.ocloser.outstream{margin-top:0px;overflow:hidden;}' +
                      'div.onnetworkplayercontainer.ocloser.outstream.isplayinga{margin-top:20px;overflow:visible;}' +
                      'div.onnetworkplayercontainer.ocloser::before{height:20px;position:relative;display:block;max-width:100%;width:100%;top:-20px;right:0px;content:" ";background:transparent url(https://cdn.onnetwork.tv/img/close_min_en.png) right center no-repeat;cursor:pointer;overflow:visible;}'+
                      'div.onnetworkplayercontainer.country0.ocloser::before{background-image:url( https://cdn.onnetwork.tv/img/close_minin2.png );}'+
                      'div.onnetworkplayercontainer.country5.ocloser::before{background-image:url( https://cdn.onnetwork.tv/img/close_min_latvian.png );}'+
                      'div.onnetworkplayercontainer.country6.ocloser::before{background-image:url( https://cdn.onnetwork.tv/img/close_min_lithuanian.png );}'+
                      'div.onnetworkplayercontainer.country7.ocloser::before{background-image:url( https://cdn.onnetwork.tv/img/close_min_sk.png );}'+
                      'div.onnetworkplayercontainer.brandp20{ padding-bottom: calc( 67.5% ) !important ; }'+
                      'div.onnetworkplayercontainer.brandp25{ padding-bottom: calc( 70.31% ) !important ; }'+
                      'div.onnetworkplayercontainer.brandp35{ padding-bottom: calc( 75.94% ) !important ; }'+
                      'div.onnetworkplayercontainer.brandp4x3{ padding-bottom: calc( 75% ) !important ; }'+
                      '.rcodeframe{width:100%;height:250px;padding:0;margin:0 auto;border:none;transition:height 0.1s ease 2s;}'+
                      '.rcodeframe2{width:100% !important;height:100% !important;left:0;top:0;position:absolute;padding:0;margin:0 auto;border:none;transition:height 0.1s ease 2s;z-index:1000000;}'+
                      '.isplayinga .rcodeframe2{ display : none ; } .isplayingm .rcodeframe2{ display : none ; }'+
                      '.isplayinga .rcodeframe{ display : none ; } .isplayingm .rcodeframe{ display : none ; }'+
                      '.alwplayer{margin:0px;padding:0px;border:none;overflow:hidden;background:transparent;min-height:1px;'+
                      'transition:height 0.5s;position:absolute;width:100%;height:100%;max-height:none;left:0px;top:0px;}' +
                      '.onnetworkplayercontainer>.alwplayer{z-index:66000 !important;}'+
                      (0?'.onnetworkplayercontainer.miniature{ position : static ; }':'')+
                      '.onnetworkplayercontainer.miniature>.alwplayer{z-index:1000000;position:fixed;left:auto;top:auto;right:auto;bottom:auto;} '+
                      '.onnetworkplayercontainer.miniature.above>.alwplayer{z-index:100000 !important;} '+
                      '.onnetworkplayercontainer.miniature.isplayinga>.alwplayer{z-index:1200000 !important;} '+
                      '.onnetworkplayercontainer.miniature.smin3.isplayingm>.alwplayer{z-index:1100000 !important;} '+
                      '.onnetworkplayercontainer.miniature.smin4.isplayingm>.alwplayer{z-index:1100000 !important;} '+
                      '.miniature>.alwplayer.desktop '+
                      '{width:432px;max-width:432px;height:244px;right:20px;bottom:20px;max-height:244px;}'+
                      '.miniature.podcast1>.alwplayer.desktop{max-height:60px;}'+
                      '.miniature.podcast2>.alwplayer.desktop{max-height:80px;}'+
                      '.miniature.podcast3>.alwplayer.desktop{max-height:110px;}'+
                      '.miniature.mmpl1>.alwplayer.smartphone,.miniature.mmpl1>.alwplayer.tablet '+
                      '{width:400px;max-width:100%;height:224px;right:20px;bottom:20px;max-height:240px;}'+
                      '.miniature.mmpl1.podcast1>.alwplayer.smartphone,.miniature.mmpl1.podcast1>.alwplayer.tablet,'+
                      '.miniature.mmpl3.podcast1>.alwplayer.smartphone,.miniature.mmpl3.podcast1>.alwplayer.tablet,'+
                      '.miniature.mmpl2.podcast1>.alwplayer.smartphone,.miniature.mmpl2.podcast1>.alwplayer.tablet{max-height:80px;padding-bottom:calc( 10% - 1px ) !important;}'+
                      '.miniature.mmpl1.podcast2>.alwplayer.smartphone,.miniature.mmpl1.podcast2>.alwplayer.tablet,'+
                      '.miniature.mmpl3.podcast2>.alwplayer.smartphone,.miniature.mmpl3.podcast2>.alwplayer.tablet,'+
                      '.miniature.mmpl2.podcast2>.alwplayer.smartphone,.miniature.mmpl2.podcast2>.alwplayer.tablet{max-height:90px;padding-bottom:calc( 20% - 1px ) !important;}'+
                      '.miniature.mmpl1.podcast3>.alwplayer.smartphone,.miniature.mmpl1.podcast3>.alwplayer.tablet,'+
                      '.miniature.mmpl3.podcast3>.alwplayer.smartphone,.miniature.mmpl3.podcast3>.alwplayer.tablet,'+
                      '.miniature.mmpl2.podcast3>.alwplayer.smartphone,.miniature.mmpl2.podcast3>.alwplayer.tablet{max-height:100px;padding-bottom:calc( 30% - 1px ) !important;}'+
                      '.mmpl4>.alwplayer.smartphone,.mmpl4>.alwplayer.smartphone{transition:none;}'+
                      '.miniature.mmpl2>.alwplayer.smartphone,.miniature.mmpl2>.alwplayer.tablet, '+
                      '.miniature.mmpl4.above>.alwplayer.smartphone,.miniature.mmpl4.above>.alwplayer.tablet '+
                      '{width:100%;height:0;top:0px;right:0px;max-height:none;padding-bottom:56.25%;}'+
                      '.miniature.mmpl3>.alwplayer.smartphone,.miniature.mmpl3>.alwplayer.tablet, '+
                      '.miniature.mmpl4.below>.alwplayer.smartphone,.miniature.mmpl4.below>.alwplayer.tablet '+
                      '{width:100%;height:0px;bottom:0px;right:0px;max-height:none;padding-bottom:56.25%;}'+
                      '@media (min-width:500px){'+
                      '.miniature.mmpl2>.alwplayer.smartphone,.miniature.mmpl2>.alwplayer.tablet, '+
                      '.miniature.mmpl3>.alwplayer.smartphone,.miniature.mmpl3>.alwplayer.tablet, '+
		      '.miniature.mmpl4.above>.alwplayer.smartphone,.miniature.mmpl4.above>.alwplayer.tablet,'+
		      '.miniature.mmpl4.below>.alwplayer.smartphone,.miniature.mmpl4.below>.alwplayer.tablet'+
                      ' {width:400px;max-width:400px;padding-bottom:225px;}'+
                      '}'+
		      '@media (orientation:landscape){'+
		      '.miniature.mmpl2>.alwplayer.smartphone,.miniature.mmpl2>.alwplayer.tablet,'+
		      '.miniature.mmpl3>.alwplayer.smartphone,.miniature.mmpl3>.alwplayer.tablet,'+
		      '.miniature.mmpl4.above>.alwplayer.smartphone,.miniature.mmpl4.above>.alwplayer.tablet,'+
		      '.miniature.mmpl4.below>.alwplayer.smartphone,.miniature.mmpl4.below>.alwplayer.tablet'+
		      '{width:100vh;padding-bottom:56.25vh;max-width:100vh;}'+
		      '}'+
		      '@media (orientation:landscape) and (min-width:600px) and (min-height:600px){'+
		      '.miniature.mmpl2>.alwplayer.smartphone,.miniature.mmpl2>.alwplayer.tablet,'+
		      '.miniature.mmpl3>.alwplayer.smartphone,.miniature.mmpl3>.alwplayer.tablet,'+
		      '.miniature.mmpl4.above>.alwplayer.smartphone,.miniature.mmpl4.above>.alwplayer.tablet,'+
		      '.miniature.mmpl4.below>.alwplayer.smartphone,.miniature.mmpl4.below>.alwplayer.tablet'+
		      '{width:400px;padding-bottom:225px;max-width:400px;}'+
		      '}'+
                      '.fsplayer{transition:height 0.5s;position:fixed;width:100%;max-width:100%;height:100%;max-height:100%;left:0px;top:0px;z-index:66050;background-color:black;}' +
                      '.miniature.closer.cvis > .alwplayer:after{height:20px;position:relative;display:block;max-width:100%;width:100%;top:-20px;right:0px;content:" ";background:transparent url("https://cdn.onnetwork.tv/img/close_minin2.png") right center no-repeat;cursor:pointer;overflow:visible;}'+
                      '.miniature.closer.cvis > .alwplayer{overflow:visible;} ' +
                      '.miniature.closer.cvis.mmpl2>.alwplayer:after,.miniature.closer.cvis.mmpl4.above>.alwplayer:after{'+
                      'height:20px;position:absolute;display:block;max-width:100%;width:100%;top:100%;'+
                      'right:0px;content:" ";background:transparent url("https://cdn.onnetwork.tv/img/close_minin2.png") right center no-repeat;cursor:pointer;overflow:visible;height:20px;}'+
                      'iframe.onnetworkframe{min-height:auto !important;margin:0 !important;padding:0 !important;border:none !important;overflow:hidden;background:transparent;position:absolute !important;'+
                      'width:100%;height:100%;left:0;top:0;}' ;
    fs = document.getElementsByTagName("body")[0]; fs.appendChild(ONTVIFstyle);
  }
  
  if (typeof(window.ONTVminiatureBlocked)=="undefined"){
    window.ONTVminiatureBlocked = function(){ 
      var td = document.getElementById( 'video_player_miniaturka_displaynone' );
      if (td && (typeof(td)=="object") && (td.id=='video_player_miniaturka_displaynone')){ return true ; }
      if ((typeof(window.ONTVminiatureExcludeBodyClasses)=="object") && (window.ONTVminiatureExcludeBodyClasses.length>0)){
        var allbodies = document.getElementsByTagName( 'BODY' );
        if ((allbodies) && (allbodies.length>0)){      
          for (var i=0;i<allbodies.length;i++){
            for (var j=0;j<window.ONTVminiatureExcludeBodyClasses.length;j++){
              if ((window.ONTVminiatureExcludeBodyClasses[j].trim()!="") && (typeof(allbodies[i].classList)=="object") && (allbodies[i].classList.contains(window.ONTVminiatureExcludeBodyClasses[j]))){ return true; }
            }
          }
        }
      } 
      return false ;
    }
  }
  if (typeof(window.ONTVstartObserver)=="undefined"){
    var thresholds = [0] ;
    for (var i=1; i<=100; i++) { var ratio = i/100; thresholds.push(ratio); }            
    window.ONTVstartObserver = function( observed ){
      try{
        var Ooptions = { threshold : thresholds }; 
        var Oobserver = new IntersectionObserver( function(e,o){window.ONTVintersectionCallback(e,o);} , Ooptions );
        Oobserver.observe( observed );
        var Mobserver = new MutationObserver( function(e){window.ONTVmutationCallback(e);} );
        Mobserver.observe( observed , {attributes:true,attributeFilter:['class'],childList:false,characterData:false} );
      }catch(e){window.ONTVOts.push(observed);console.log("observer error");console.log(e);}
    }
  }
  if (typeof(window.ONTVPlayerIndex)=="undefined"){
    window.ONTVAllPlayerIndex=function(field,value){
      for(var i=0;i<window.ONTVPlayers.length;i++){if (window.ONTVPlayers[i][field]==value){ return i; }}
      return -1;
    }
  }
  
  if (typeof(window.ONTVAllPlayers)=="undefined"){
    window.ONTVAllPlayers=function(p,p1,p2){
      if(typeof(p)!="function")return;
      for(var i=0;i<window.ONTVPlayers.length;i++){
        p(window.ONTVPlayers[i],p1,p2);
      }
    }
  }
  if (typeof(window.ONTVFSSwitch)=="undefined"){
    window.ONTVFSSwitch = function( iid ){
      try{
      var i=window.ONTVAllPlayerIndex( 'iid' , iid );
      if (i>=0){
        if (document.fullscreenElement&&(document.fullscreenElement==window.ONTVPlayers[i].frame)){ document.exitFullscreen(); }
        else if ((document.fullscreenElement==null)&&(window.ONTVPlayers[i].frame)){ window.ONTVPlayers[i].frame.requestFullscreen(); }
      }
      }catch(e){console.log(e);}
    }
    window.ONTVFSOff = function( frameId ){
      var i=window.ONTVAllPlayerIndex( 'frameId' , frameId );
      if ((i>=0)&&document.fullscreenElement&&(document.fullscreenElement==window.ONTVPlayers[i].frame)){ document.exitFullscreen(); }
    }
    document.addEventListener('fullscreenchange',(e)=>{
      if (!document.fullscreenElement){
        window.ONTVsendMes('PFSOff');
        var i=window.ONTVAllPlayerIndex( 'isfs' , 1 );
        if (i!=-1){
          var com={"sender":"onntv","sscript":"loader","comm":"player_fullscreenexit","iid":window.ONTVPlayers[i].iid,"subject":0,"target":0} ;
          var comtxt=JSON.stringify( com ); window.postMessage("onntv://"+comtxt,"*"); window.ONTVPlayers[i].isfs=0;
        }
      }else{
        var i=window.ONTVAllPlayerIndex( 'frame' , document.fullscreenElement );
        if (i==-1){window.ONTVsendMes('PFSOff');
          var i=window.ONTVAllPlayerIndex( 'isfs' , 1 );
          if (i!=-1){
            var com={"sender":"onntv","sscript":"loader","comm":"player_fullscreenexit","iid":window.ONTVPlayers[i].iid,"subject":0,"target":0} ;
            var comtxt=JSON.stringify( com ); window.postMessage("onntv://"+comtxt,"*"); window.ONTVPlayers[i].isfs=0;
          }
        }else{window.ONTVsendMes('PFSOn',window.ONTVPlayers[i].iid);
          var com={"sender":"onntv","sscript":"loader","comm":"player_fullscreenenter","iid":window.ONTVPlayers[i].iid,"subject":0,"target":0} ;
          var comtxt=JSON.stringify( com ); window.postMessage("onntv://"+comtxt,"*"); window.ONTVPlayers[i].isfs=1;
        }
      }
    });
  }
  if(typeof(window.ONTVMiniatureEnabled)=="undefined"){window.ONTVMiniatureEnabled=function(menabled){
    window.ONTVAllPlayers(function(p){
      try{
        if(menabled==true){p.div.classList.remove("minblock");}
        else{p.div.classList.add("minblock");}
      }catch(e){}
    },menabled);}}
  if(typeof(window.ONTVhideMiniature)=="undefined"){window.ONTVhideMiniature=function(PlayerEntry){
    try{if (PlayerEntry.div.classList.contains("smin5")){window.ONTVsendMes('skipads',PlayerEntry.frameId);}}catch(e){}
    try{PlayerEntry.div.classList.remove("smin1","smin2","smin3","smin4","smin5","smin6","smin7"); }catch(e){}
      var umc = 0 ;
      try{ umc=document.getElementById( PlayerEntry.divId ).userMinClose ; }catch(e){}
      window.ONTVsendMes('hideMiniature',PlayerEntry.frameId,umc);
    }
  }
  if (typeof(window.ONTVhideAllMiniature)=="undefined"){
    window.ONTVhideAllMiniature=function(){for(var i=0;i<window.ONTVPlayers.length;i++){window.ONTVhideMiniature(window.ONTVPlayers[i]);}}
  }
  if (typeof(window.ONTVcloseMiniature)=="undefined"){window.ONTVcloseMiniature=function(e){
    if (e && e.parentElement && e.parentElement.classList && e.parentElement.classList.contains( "closer" )){
      e.parentElement.userMinClose = 1 ;
      if (e.parentElement.classList.contains( "aviewa" )){ window.ONTVAllPlayers((function(Player,p1,p2){
      if((Player.div==p1)&&(Player.dsmcv==1)){p1.classList.add("nomin");}}),e.parentElement,null); }
      if (e.parentElement.classList.contains("smin5")){window.ONTVsendMes('skipads','ff'+e.parentElement.id);}
      if (e.parentElement.classList.contains( "closer4" )){ e.parentElement.classList.remove( "pnivp" ); return;}
      if (e.parentElement.classList.contains( "closer2" )){ e.parentElement.classList.remove( "smin1","smin2","smin3","smin4","smin5","smin6","smin7" ); return;}
      if (e.parentElement.classList.contains( "closer3" )||e.parentElement.classList.contains( "closer1" )||e.parentElement.classList.contains( "closer5" )){
        for (var i=0;i<window.ONTVPlayers.length;i++){
          try{if(e.parentElement.classList.contains( "closer3" )){window.ONTVPlayers[i].div.classList.remove("pnivp");}
              else{window.ONTVPlayers[i].div.classList.remove("smin1","smin2","smin3","smin4","smin5","smin6","smin7" );
                if(e.parentElement.classList.contains( "closer5" )){
                  console.log( "ustawiam cookie:"+"nomin"+window.ONTVPlayers[i].wid+"=1;path=;domain=.onnetwork.tv" );
                  document.cookie="nomin"+window.ONTVPlayers[i].wid+"=1; expires=0; " ;
                  console.log( document.cookie );
                }
              }}catch(e){} }
        return ;
      }
    }
  }}
  if (typeof(window.ONTVclosePlayer)=="undefined"){window.ONTVclosePlayer=function(e){
    if (e.offsetY && e.offsetY>0){ return ; }
    var idtoclose = "" ;
    if (e.target && e.target.id){ idtoclose=e.target.id; }
    else if (e.id){ idtoclose=e.id; }
    for(var i=0;i<window.ONTVPlayers.length;i++){
      if (window.ONTVPlayers[i] && (typeof(window.ONTVPlayers[i].divId)=="string") && (window.ONTVPlayers[i].divId==idtoclose)){
        try{var pc=document.getElementById(window.ONTVPlayers[i].divId);
        pc.style.height="0px";pc.style.minHeight="0px";pc.style.padding="0px";pc.classList.remove("ocloser");}catch(e){}
        setTimeout(function(){
          if (window.ONTVPlayers[i].div && window.ONTVPlayers[i].div.parentNode){ window.ONTVPlayers[i].div.parentNode.removeChild( window.ONTVPlayers[i].div ); }
          else if (window.ONTVPlayers[i].div && window.ONTVPlayers[i].div2){ window.ONTVPlayers[i].div.removeChild( window.ONTVPlayers[i].div2 ); }
          window.ONTVPlayers[i]=null;window.ONTVPlayers.splice(i,1);},520);break;}}
  }}
  if (typeof(window.ONTVintersectionCallback)=="undefined"){
    window.ONTVintersectionCallback = function( entries , observer ){
      foundVisible = false ;
      for (var i=0;i<entries.length;i++){
        var pidx=window.ONTVAllPlayerIndex("div",entries[i].target);
        if ((pidx>=0) && window.ONTVPlayers[pidx] && window.ONTVPlayers[pidx].isCpl && (window.ONTVPlayers[pidx].isCpl==1)){continue;}
        if ("miniatureLevel" in entries[i].target){if(entries[i].intersectionRatio>entries[i].target.miniatureLevel){foundVisible=true;}}
        else{if(entries[i].intersectionRatio>0){foundVisible=true;}}
        try{document.getElementById("dff"+entries[i].target.id ).style.zIndex = 1000000 - window.pageYOffset - parseInt(entries[i].boundingClientRect.top);}catch(e){}
      }
      for (var i=0;i<window.ONTVPlayers.length;i++){
        if ((window.ONTVPlayers[i]!=null) && (window.ONTVPlayers[i].div)){
          if (foundVisible){window.ONTVPlayers[i].div.classList.remove("nonevisible");}else{window.ONTVPlayers[i].div.classList.add("nonevisible");}
        }
      }
      try{for (var i=0;i<entries.length;i++){if(entries[i].target){
        if ( (("miniatureLevel" in entries[i].target) && 
              (entries[i].target.intersectionRatio>entries[i].target.miniatureLevel) && 
              (entries[i].intersectionRatio<=entries[i].target.miniatureLevel)) ||
             (!("miniatureLevel" in entries[i].target) && (entries[i].target.intersectionRatio>0) && (entries[i].intersectionRatio==0)) ){
          var eif1 = document.getElementById( "ff"+entries[i].target.id+"nl2" );
          if (eif1){eif1.parentNode.removeChild(eif1);}}
        entries[i].target.intersectionRatio=entries[i].intersectionRatio
        if (entries[i].target){
          if ( (("miniatureLevel" in entries[i].target) && (entries[i].intersectionRatio<=entries[i].target.miniatureLevel)) || 
               (!("miniatureLevel" in entries[i].target) && (entries[i].intersectionRatio<=0)) ){
            window.ONTVAllPlayers((function(Player,p1,p2){
              if((Player.div==p1)&&(Player.dsmv==1)&&p1.classList.contains("aviewa")){p1.classList.add("nomin");}}),entries[i].target,null);
            entries[i].target.classList.add("pnivp");
            if (entries[i].boundingClientRect.top<0){entries[i].target.classList.add("above");}
            else if (entries[i].boundingClientRect.top>0){entries[i].target.classList.add("below");}
          }
          else{entries[i].target.classList.remove("pnivp","above","below");}}
        }}}catch(e){}
    }
  }
  if (typeof(window.ONTVmutationCallback)=="undefined"){
    window.ONTVmutationCallback = function(e){
      if (e && e.length){
        for(var i=0;i<e.length;i++){
          var cl = e[i].target.classList ;
          var sbm = (!cl.contains("minblock") && !cl.contains("nomin") &&
               ((cl.contains("smin1") && cl.contains("nonevisible") && cl.contains("pnivp")) ||
                (cl.contains("smin2") && cl.contains("nonevisible") && cl.contains("pnivp") && cl.contains("isplayinga")) ||
                (cl.contains("smin6") && cl.contains("nonevisible") && cl.contains("pnivp") && cl.contains("isplayinga") && cl.contains("above")) ||
                (cl.contains("smin5") && cl.contains("isplayinga") && cl.contains("avideo")) ||
                (cl.contains("smin3") && cl.contains("nonevisible") && cl.contains("pnivp") && cl.contains("above")) ||
                (cl.contains("smin4") && cl.contains("nonevisible") && cl.contains("pnivp") && cl.contains("isplayinga")) ||
                (cl.contains("smin4") && cl.contains("nonevisible") && cl.contains("pnivp") && cl.contains("isplayingm")) ||
                (cl.contains("smin7") && cl.contains("nonevisible") && cl.contains("pnivp") && cl.contains("isplayinga") && cl.contains("above")) ||
                (cl.contains("smin7") && cl.contains("nonevisible") && cl.contains("pnivp") && cl.contains("isplayingm") && cl.contains("above")) ) );
              if (sbm){if(!e[i].target.classList.contains("miniature")){
            e[i].target.classList.remove( "cvis" );
            e[i].target.classList.add( "miniature" );
            e[i].target.userMinClose = 0 ;
            if (e[i].target.dataset['miniaturetarget'] && (typeof(e[i].target.dataset['miniaturetarget'])=="string") && (e[i].target.dataset['miniaturetarget']!="")){ 
              var mt = document.getElementById( e[i].target.dataset['miniaturetarget'] );
              if (mt){  var r = mt.getBoundingClientRect(); var mp=document.getElementById( 'dff'+e[i].target.id );
                if (r && mp){ mp.style.left=r.left+"px"; mp.style.width=(r.right-r.left)+"px";
                  mp.style.maxWidth=(r.right-r.left)+"px"; mp.style.height=((r.right-r.left)*(9/16))+"px";
                  mp.style.maxHeight=((r.right-r.left)*(9/16))+"px"; }}}            
            if (parseInt(e[i].target.dataset['closerdelay'])>=0){ 
              setTimeout( "try{document.getElementById('"+e[i].target.id+"').classList.add( 'cvis' );}catch(e){}" , 1+1000*parseInt(e[i].target.dataset['closerdelay']) ); }
            window.ONTVsendMes('showMiniature','ff'+e[i].target.id,"");
          }}
          else{if(e[i].target.classList.contains("miniature")){
            e[i].target.classList.remove( "miniature" );
            e[i].target.classList.remove( "cvis" );
            if (e[i].target.dataset['miniaturetarget']!=""){ 
              var mp=document.getElementById( 'dff'+e[i].target.id );
              if (mp){ mp.style.left=mp.style.width=mp.style.maxWidth=mp.style.height=mp.style.maxHeight=""; }}
            window.ONTVsendMes('hideMiniature','ff'+e[i].target.id,e[i].target.userMinClose || 0);
          }}
        }
      }
    }
  }
  if (typeof(window.ONTVredistMes)=="undefined"){
    window.ONTVredistMes=function(m){for(var i=0;i<window.frames.length;i++){frames[i].postMessage(m,"*");}}
  }
  if (typeof(window.ONTVsendCommand)=="undefined"){
    window.ONTVsendCommand=function(comm,iid,arg1="",arg2=""){
      var com={"sender":"onntv","sscript":"loader","comm":comm,"iid":iid,"subject":arg1,"target":arg2} ;
      var comtxt=JSON.stringify( com );for (var i=0;i<window.ONTVPlayers.length;i++){
        if ((window.ONTVPlayers[i].iid==iid) && window.ONTVPlayers[i].frameId){
          var sf = document.getElementById(window.ONTVPlayers[i].frameId);if (sf){sf.contentWindow.postMessage("onntv://"+comtxt,"*");break;}}}}}
  if (typeof(window.ONTVshowBranding)=="undefined"){
    window.ONTVshowBranding=function(iid,com){
      com.sender="onntv"; com.sscript="loader"; com.comm="showbrand"; com.iid=iid;
      var comtxt=JSON.stringify( com );for (var i=0;i<window.ONTVPlayers.length;i++){
        if (((iid==0) || (window.ONTVPlayers[i].iid==iid)) && window.ONTVPlayers[i].frameId){
          var sf = document.getElementById(window.ONTVPlayers[i].frameId);if (sf){sf.contentWindow.postMessage("onntv://"+comtxt,"*");break;}}}}}
  if (typeof(window.ONTVsendMes)=="undefined"){
    window.ONTVsendMes=function(comm,arg1="",arg2=""){
      var com={"sender":"onntv","sscript":"loader","comm":comm,"subject":arg1,"target":arg2} ;
      var comtxt=JSON.stringify( com );for(var i=0;i<window.frames.length;i++){frames[i].postMessage("onntv://"+comtxt,"*");}}}
  if (typeof(window.ONTVaddReplacePlayer)=="undefined"){window.ONTVaddReplacePlayer=function( Player ){
    playerFound=false;
    for (var i=0;i<window.ONTVPlayers.length;i++){
      if ((window.ONTVPlayers[i].containerId==Player.containerId) || 
          (window.ONTVPlayers[i].frameId==Player.frameId)){
        if (window.ONTVPlayers[i].div && window.ONTVPlayers[i].div.parentNode){ window.ONTVPlayers[i].div.parentNode.removeChild( window.ONTVPlayers[i].div ); }
        else if (window.ONTVPlayers[i].div && window.ONTVPlayers[i].div2){ window.ONTVPlayers[i].div.removeChild( window.ONTVPlayers[i].div2 ); }
        window.ONTVPlayers[i].div=window.ONTVPlayers[i].div2=window.ONTVPlayers[i].frame=null;
        for(var pf in Player){window.ONTVPlayers[i][pf]=Player[pf];}
        window.ONTVPlayers[i].frameSrc = 'https://video.onnetwork.tv/'+window.ONTVPlayers[i].outstream+
                                         'frame86.php?mid='+window.ONTVPlayers[i].mid+
	                                 '&preview='+window.ONTVPlayers[i].preview+'&iid='+window.ONTVPlayers[i].iid+'&e=1'+
                                       (window.ONTVPlayers[i].ls>0 ? '&ls='+window.ONTVPlayers[i].ls : '' )+
                                       (window.ONTVPlayers[i].optout>0 ? '&optout='+window.ONTVPlayers[i].optout : '')+
                                       (window.ONTVPlayers[i].widget>0 ? '&widget='+window.ONTVPlayers[i].widget : '')+
                                       (window.ONTVPlayers[i].ap>0 ? '&ap='+window.ONTVPlayers[i].ap : '' )+
                                       (window.ONTVPlayers[i].map>0 ? '&map='+window.ONTVPlayers[i].map : '' )+
                                       (window.ONTVPlayers[i].sfs>0 ? '&sfs='+window.ONTVPlayers[i].sfs : '' )+
                                       (window.ONTVPlayers[i].mtitle!='' ? '&mtitle='+window.ONTVPlayers[i].mtitle : '' )+
                                       (window.ONTVPlayers[i].vids!='' ? '&vids='+window.ONTVPlayers[i].vids : '' )+
                                       (window.ONTVPlayers[i].ampsrc==1 ? '&ampsrc=1' : '' )+
                                       (window.ONTVPlayers[i].vasturl!='' ? '&vasturl='+window.ONTVPlayers[i].vasturl : '' )+
                                       '&id='+window.ONTVPlayers[i].frameId ;                                        
        window.ONTVPlayers[i].addcount = 0 ;
        window.ONTVPlayers[i].added = false ;
        playerFound=true;
        break ;
      }
    }
    if(!playerFound){
      var c=document.getElementById(Player.containerId);
      if(!c){return false;}
      window.ONTVplayerNb++;
      var d=new Date();      
      Player.baseId="EXS1a7df2a4f1796b1440858acd6b905975"+d.getTime();
      Player.divId=Player.baseId+window.ONTVplayerNb;
      Player.frameId="ff"+Player.baseId+window.ONTVplayerNb;
      Player.div2Id="dff"+Player.baseId+window.ONTVplayerNb;
      Player.div=Player.frame=Player.div2=null;
      Player.wid=528;
      if(!Player.ar){Player.ar=56.25;}
      Player.added=false;Player.addcount=0;Player.number=window.ONTVplayerNb;
      if(window.ONTVPlayers[0]){
        Player.preview=window.ONTVPlayers[0].preview;
        Player.ls=window.ONTVPlayers[0].ls;
        Player.optout=window.ONTVPlayers[0].optout;
        Player.ap=window.ONTVPlayers[0].ap;
        Player.map=window.ONTVPlayers[0].map;
        Player.sfs=window.ONTVPlayers[0].sfs;
        Player.smfmo=window.ONTVPlayers[0].smfmo;
        Player.wid=window.ONTVPlayers[0].wid;
        Player.cid=window.ONTVPlayers[0].cid;
        Player.mtitle=window.ONTVPlayers[0].mtitle;
        Player.vids=window.ONTVPlayers[0].vids;
        Player.ampsrc=window.ONTVPlayers[0].ampsrc;
        Player.vasturl=window.ONTVPlayers[0].vasturl;
        Player.useDfpParams=window.ONTVPlayers[0].useDfpParams;
        Player.outstream=window.ONTVPlayers[0].outstream;
        Player.newoutstream=window.ONTVPlayers[0].newoutstream;
        Player.ocloser=window.ONTVPlayers[0].ocloser;
        Player.hmv=window.ONTVPlayers[0].hmv;
        Player.dsmv=window.ONTVPlayers[0].dsmv;
        Player.dsmcv=window.ONTVPlayers[0].dsmcv;
        Player.widget=window.ONTVPlayers[0].widget;
      }
      Player.frameSrc = 'https://video.onnetwork.tv/'+Player.outstream+'frame86.php?mid='+Player.mid+
	                                 '&preview='+Player.preview+'&iid='+Player.iid+'&e=1'+
                                       (Player.ls>0 ? '&ls='+Player.ls : '' )+
                                       (Player.optout>0 ? '&optout='+Player.optout : '')+
                                       (Player.ap>0 ? '&ap='+Player.ap : '' )+
                                       (Player.map>0 ? '&map='+Player.map : '' )+
                                       (Player.sfs>0 ? '&sfs='+Player.sfs : '' )+
                                       (Player.mtitle!='' ? '&mtitle='+Player.mtitle : '' )+
                                       (Player.vids!='' ? '&vids='+Player.vids : '' )+
                                       (Player.ampsrc==1 ? '&ampsrc=1' : '' )+
                                       (Player.vasturl!='' ? '&vasturl='+Player.vasturl : '' )+
                                       (Player.widget>0 ? '&widget='+Player.widget : '')+
                                       '&id='+Player.frameId;
      window.ONTVPlayers.push(Player);      
    }
  }}
  if (typeof(window.ONTVcomFunc)=="undefined"){
    window.ONTVcomFunc = function(e){
      if (!e.data || !e.data.indexOf || (e.data.indexOf("onntv://")!=0)){ window.ONTVdebug( e.data , 6 ); return ; }
      var com = {} ;
      try{
        com = JSON.parse( e.data.substr( 8 ) );         
      }catch(e){ com = {} ; }      
      if ((typeof(com)!="object") || (typeof(com.sender)!="string") || 
          (com.sender!="onntv") || (typeof(com.comm)!="string") || (com.comm.length==0)){ return ; }
      window.ONTVdebug( com , 6 );
      switch( com.comm ){
        case "moviesetu": break ;
        case "moviecompleted": case "moviecleared": case "movieset":
          try{
          if (('AG' in window) && ('rodoAccepted' in window.AG)){ window.ONTVsendMes('rodoAccepted',window.AG.rodoAccepted,""); }
          }catch(e){}
          window.ONTVredistMes(e.data);
          for (var i=0;i<window.ONTVPlayers.length;i++){
            if (window.ONTVPlayers[i] && (typeof(window.ONTVPlayers[i].frameId)=="string") && (window.ONTVPlayers[i].frameId==com.frameId)){
              if (window.ONTVPlayers[i].div){ 
                window.ONTVPlayers[i].div.classList.remove("isplayinga","isplayingm"); 
                if ((com.comm=="moviecompleted") && window.ONTVPlayers[i].div.classList.contains( "smfmo" ) && 
                    window.ONTVPlayers[i].div.classList.contains( "smin4" )){
                  window.ONTVPlayers[i].div.classList.remove("smfmo","smin4");
                  window.ONTVPlayers[i].div.classList.add("smin2");
                }
              }
              break ;
            }
          }
          break;
        case "pl_minhidden" : break ; 
        case "pl_minshown" : break ; 
        case "pl_minstate" :
          try{if (com.frameId){var pcid=com.frameId.substr(2);if (pcid && pcid.length){var pc=document.getElementById(pcid);
          if(pc){if (pc.classList && pc.classList.contains("miniature")){window.ONTVsendMes('showMiniaturer',com.frameId,"");}
          else{window.ONTVsendMes('hideMiniaturer',com.frameId,"");}}}}}catch(e){}
          break ; 
        case "startmovie": case "onntvads": case "onntvadf": window.ONTVredistMes(e.data);break;
        case "log":var logdiv=document.getElementById("logdiv");if(logdiv){logdiv.innerHTML=com.subject+"<br/>"+logdiv.innerHTML;}break;
        case "adstarted" :
          for (var i=0;i<window.ONTVPlayers.length;i++){
            if (window.ONTVPlayers[i] && (typeof(window.ONTVPlayers[i].frameId)=="string") && (window.ONTVPlayers[i].frameId==com.frameId)){
              try{clearTimeout( window.ONTVPlayers[i].mtimer );}catch(e){}
              
                try{
                if ( (window.ONTVPlayers[i].div.classList.contains("smin2") ||
                      (window.ONTVPlayers[i].div.classList.contains("smin4") && (window.ONTVPlayers[i].miniatureAgain==1)))&& 
                     (window.ONTVPlayers[i].div.classList.contains("closer4") || window.ONTVPlayers[i].div.classList.contains("closer3")) && 
                     ((("miniatureLevel" in window.ONTVPlayers[i]) && (window.ONTVPlayers[i].div.intersectionRatio<=window.ONTVPlayers[i].div.miniatureLevel)) || 
                      (!("miniatureLevel" in window.ONTVPlayers[i]) && (window.ONTVPlayers[i].div.intersectionRatio<=0))) ){
                  window.ONTVPlayers[i].div.classList.add("pnivp");
                  window.ONTVPlayers[i].div.classList.remove("nomin");
                }}catch(e){}
                if (window.ONTVPlayers[i].div){ if (com.subject=="nomin"){ window.ONTVPlayers[i].div.classList.add("nomin"); }                
                window.ONTVPlayers[i].div.classList.add("isplayinga"); window.ONTVPlayers[i].div.classList.remove("isplayingm"); 
                if(com.target=="audio"){window.ONTVPlayers[i].div.classList.add("aaudio");}
                if(com.target=="video"){window.ONTVPlayers[i].div.classList.add("avideo");}
                window.ONTVPlayers[i].div.classList.remove("aviewa"); }
              break ;
            }
          }
          break ;
        case "adviewable" :
          for (var i=0;i<window.ONTVPlayers.length;i++){
            if (window.ONTVPlayers[i] && (typeof(window.ONTVPlayers[i].frameId)=="string") && (window.ONTVPlayers[i].frameId==com.frameId)){
              if (window.ONTVPlayers[i].div){ window.ONTVPlayers[i].div.classList.add("aviewa"); 
                if(window.ONTVPlayers[i].hmv==1){window.ONTVPlayers[i].div.classList.add("nomin");}}
              break ;
            }
          }
          break ;
        case "adnotpresent": case "moviestarted": window.ONTVredistMes(e.data);
        case "aderror": case "adskipped": case "adblocked": case "advideoexcluded": case "adcomplete":
          for (var i=0;i<window.ONTVPlayers.length;i++){
            if (window.ONTVPlayers[i] && (typeof(window.ONTVPlayers[i].frameId)=="string") && (window.ONTVPlayers[i].frameId==com.frameId)){
              if (window.ONTVPlayers[i].div){ 
                if (window.ONTVPlayers[i].miniaturePlayer==4){
                  if (window.ONTVPlayers[i].miniatureMBlock==1){
                    window.ONTVPlayers[i].mtimer = setTimeout( function(){window.ONTVPlayers[i].div.classList.remove("isplayinga","aviewa","aaudio","avideo");} , 2000 );
                  }else{
                    window.ONTVPlayers[i].mtimer = setTimeout( function(){window.ONTVPlayers[i].div.classList.remove("isplayinga","nomin","aviewa","aaudio","avideo");} , 2000 );
                  }
                }else{
                  window.ONTVPlayers[i].div.classList.remove("isplayinga","nomin","aviewa","aaudio","avideo"); 
                }
                if (com.comm=="moviestarted"){ window.ONTVPlayers[i].div.classList.add("isplayingm"); }
              }
              break ;
            }
          }
          break ;
        case "addtcclass" :
          for (var i=0;i<window.ONTVPlayers.length;i++){
            if (window.ONTVPlayers[i] && (typeof(window.ONTVPlayers[i].frameId)=="string") && (window.ONTVPlayers[i].frameId==com.frameId)){
              if (window.ONTVPlayers[i].div){ window.ONTVPlayers[i].div.classList.add(com.subject); break;}}}
          break ;
        case "removetcclass" :
          for (var i=0;i<window.ONTVPlayers.length;i++){
            if (window.ONTVPlayers[i] && (typeof(window.ONTVPlayers[i].frameId)=="string") && (window.ONTVPlayers[i].frameId==com.frameId)){
              if (window.ONTVPlayers[i].div){ window.ONTVPlayers[i].div.classList.remove(com.subject); break;}}}
          break ;
        case "xlink" :
          var eif1=document.getElementById( com.subject ); 
          if(eif1){var cw=eif1.clientWidth,ch=eif1.clientHeight,fw=640,fh=360;
            if ((cw)&&(ch)){if(cw/ch>1.5){fw=cw;fh=ch;}else{fw=cw;fh=cw/1.5;}}
            eif1.innerHTML= '<iframe src="" style="width:'+fw+'px;height:'+fh+'px;min-width:300px;min-height:168px;border:none;" webkitallowfullscreen="true" mozallowfullscreen="true" allowfullscreen="true" allow="autoplay; fullscreen *"></iframe>' ;
          } break ;
        case "resize" :
          if ((typeof(com.id)=="string")&&(com.id!="")&&!isNaN(1*com.w)&&!isNaN(1*com.h)){
            var itr=document.getElementById(com.id);if(itr){itr.style.width=1*com.w+"px";itr.style.height=1*com.h+"px";}
          }break ;
        case "nlin" :
          var eif1 = document.getElementById( com.subject.slice(2) ); 
          for (var i=0;i<window.ONTVPlayers.length;i++){
            if ((window.ONTVPlayers[i] && (window.ONTVPlayers[i].divId)=="string") && (window.ONTVPlayers[i].divId==com.subject.slice(2))){
              window.ONTVPlayers[i].miniaturePlayer=0;window.ONTVhideMiniature(window.ONTVPlayers[i]);break;}}
          if (eif1){
            eif1.innerHTML="";eif1.style.paddingBottom="0px";eif1.style.fontSize="1px";
            fetch( 'https://video.onnetwork.tv/rcode.php?web=528&i='+com.subject+'&w='+eif1.clientWidth+'&h='+eif1.clientHeight ).then(function(response){
             if(response.ok){return response.text()}}).then(function(responseText){
               ns=document.createElement("iframe");ns.className="rcodeframe";ns.id=com.subject;eif1.appendChild( ns );
               ns.contentWindow.document.open();ns.contentWindow.document.write(responseText);});}break;
        case "nlin2" :
        case "nlin2i" :
          var eif1 = document.getElementById( com.subject.slice(2) ); 
          if ((eif1) && ((eif1.intersectionRatio>0)||(com.comm=="nlin2i"))){
            fetch( 'https://video.onnetwork.tv/nlin2.php?web=528&id='+com.subject+'&w='+eif1.clientWidth+'&h='+eif1.clientHeight+'&vid='+com.target ).then(function(response){
             if(response.ok){return response.text()}}).then(function(responseText){
               ns=document.createElement("iframe");ns.className="rcodeframe2";ns.id=com.subject+"nl2";eif1.appendChild( ns );
               ns.contentWindow.document.open();ns.contentWindow.document.write(responseText);});}break;
        case "nlin2play" :
          var eif1 = document.getElementById( com.subject+"nl2" ); 
          if (eif1){eif1.parentNode.removeChild(eif1);}
          window.ONTVredistMes(e.data);
          break ;
        case "nlin2hide" :
          var eif1 = document.getElementById( com.subject+"nl2" ); 
          if (eif1){eif1.parentNode.removeChild(eif1);}
          break ;
        case "phide" :
                    var ciid = 0 ;
          for (var i=0;i<window.ONTVPlayers.length;i++){
            if (window.ONTVPlayers[i] && (typeof(window.ONTVPlayers[i].frameId)=="string") && (window.ONTVPlayers[i].frameId==com.frameId)){
              ciid = ciid || window.ONTVPlayers[i].iid ;
              if (window.ONTVPlayers[i].div && window.ONTVPlayers[i].div.parentNode){ window.ONTVPlayers[i].div.parentNode.removeChild( window.ONTVPlayers[i].div ); }
              else if (window.ONTVPlayers[i].div && window.ONTVPlayers[i].div2){ window.ONTVPlayers[i].div.classList.remove("ocloser");window.ONTVPlayers[i].div.removeChild( window.ONTVPlayers[i].div2 ); }
              window.ONTVPlayers[i]=null;window.ONTVPlayers.splice(i,1);
              break ;
            }
          }
          if (typeof(window.injectAdvert)=="function"){ console.log( "try ia" ); try{ window.injectAdvert(ciid); } catch(e){ } }        
          break ;
        case "dphide" :
                    var ciid=0;for(var i=0;i<window.ONTVPlayers.length;i++){
            if (window.ONTVPlayers[i] && (typeof(window.ONTVPlayers[i].frameId)=="string") && (window.ONTVPlayers[i].frameId==com.frameId)){
              ciid = ciid || window.ONTVPlayers[i].iid;try{var pc=document.getElementById(window.ONTVPlayers[i].divId);
              pc.style.height="0px";pc.style.minHeight="0px";pc.style.padding="0px";pc.classList.remove("ocloser");}catch(e){}
              setTimeout(function(){
                if (window.ONTVPlayers[i].div && window.ONTVPlayers[i].div.parentNode){ window.ONTVPlayers[i].div.parentNode.removeChild( window.ONTVPlayers[i].div ); }
                else if (window.ONTVPlayers[i].div && window.ONTVPlayers[i].div2){ window.ONTVPlayers[i].div.removeChild( window.ONTVPlayers[i].div2 ); }
                window.ONTVPlayers[i]=null;window.ONTVPlayers.splice(i,1);},520);break;}}
          if (typeof(window.injectAdvert)=="function"){try{window.injectAdvert(ciid);}catch(e){}}
          break ;
        case "pfsexit" :
          window.ONTVFSOff( com.frameId );
          break ;
        case "onntvfullscreenswitch" :
          for (var i=0;i<window.ONTVPlayers.length;i++){
            if (window.ONTVPlayers[i].frameId==com.frameId){
              if (window.ONTVPlayers[i].div2){
                window.ONTVhideAllMiniature();
                screen.lockOrientationUniversal = screen.lockOrientation || screen.mozLockOrientation || screen.msLockOrientation;
                var unlockOrientation = screen.unlockOrientation || screen.mozUnlockOrientation || screen.msUnlockOrientation || (screen.orientation && screen.orientation.unlock);
                if (window.ONTVPlayers[i].div2.classList.contains('fsplayer')){ 
                  window.ONTVPlayers[i].div2.classList.remove('fsplayer');
                  window.ONTVPlayers[i].div2.classList.add('normplayer');                  
                  try{unlockOrientation();}catch(e){}
                }else{
                  window.ONTVPlayers[i].div2.classList.remove('normplayer');
                  window.ONTVPlayers[i].div2.classList.add('fsplayer');
                  try{screen.lockOrientationUniversal('landscape')}catch(e){}
                }
                break ;
              }
            }
          }
          break ;
        case "rframe" :
//          window.ONTVhideAllMiniature();
          for (var i=0;i<window.ONTVPlayers.length;i++){
            if (window.ONTVPlayers[i].containerId==com.containerId){ window.ONTVhideMiniature(window.ONTVPlayers[i]); } }
          window.ONTVaddReplacePlayer({"containerId":com.containerId,"mid":com.subject});
          break ;
      }
    }
    window.addEventListener( "message" , window.ONTVcomFunc , false );
  }
  if (typeof(window.ONTVIdleTime)=="undefined"){
    window.ONTVIdleTime=0;
    window.ONTVIdleTimerCount=function(){ window.ONTVIdleTime++; if (window.ONTVIdleTime%5==0){window.ONTVIdleTimerNotify();}}
    window.ONTVIdleTimerReset=function(){ var ct=window.ONTVIdleTime; window.ONTVIdleTime=0;if(ct>5){window.ONTVIdleTimerNotify();}}
    window.ONTVIdleTimerNotify=function(){ var com={"sender":"onntv","sscript":"loader","comm":"idletime","subject":window.ONTVIdleTime};
      var comtxt="onntv://"+JSON.stringify( com );window.ONTVredistMes(comtxt);}
    window.addEventListener("load",window.ONTVIdleTimerReset,false);
    window.addEventListener("mousemove",window.ONTVIdleTimerReset,false);
    window.addEventListener("mousedown",window.ONTVIdleTimerReset,false);
    window.addEventListener("touchstart",window.ONTVIdleTimerReset,false);
    window.addEventListener("click",window.ONTVIdleTimerReset,false);
    window.addEventListener("keypress",window.ONTVIdleTimerReset,false);
    window.addEventListener("scroll",window.ONTVIdleTimerReset,true);
    setInterval(window.ONTVIdleTimerCount,1000);
  }
  if(typeof(window.ONTVsblock)=="undefined"){window.ONTVsblock=0;}
  if (typeof(SBFunc)=="undefined"){
    var SBFunc=function(e){if(window.ONTVsblock==1){e=e||window.event;if(e.preventDefault){e.preventDefault();}e.returnValue=false;}}
  }
  if (typeof(window.ONTVkeyvalue)=="undefined"){
    window.ONTVkeyvalue=function(keyvar){
      return Function('"use strict"; return ('+keyvar+');')(); 
    }
  }
  if (typeof(window.ONTVtvnpage)=="undefined"){
    window.ONTVtvnpage = function(){
      var string = window.location.href ;
      if (string.indexOf("://")>=0){ string = string.slice(string.indexOf("://")+3); }
      if ((string.indexOf("/")>0) && (string.indexOf("/")<string.length-1)){ string = string.slice(string.indexOf("/")); }
      try{string = decodeURIComponent(string);}catch(e){} string = string.replace(/[^a-zA-Z0-9]/g, '_');
      string = string.replace(/\_([\_]+)/g, '_'); string = string.toLowerCase();
      string = string.replace(/^\_/g, ''); string = string.replace(/\_$/g, '');
      return string ;
    }
  }
  if (typeof(window.ONTVrefpage)=="undefined"){
    window.ONTVrefpage = function(){
      var string = "" ;try{string=window.top.location.href;}catch(e){string=window.location.href;}
      string = encodeURIComponent(string);return string ;
    }
  }
if (typeof(window.ONTVsetFrame)=="undefined"){window.ONTVsetFrame=function(PlayerEntry){if(PlayerEntry.frame){return;}
var fi=document.getElementById(PlayerEntry.frameId);window.ONTVdebug("setFrame:"+PlayerEntry.frameId,3);
if(fi){newsource=PlayerEntry.frameSrc+'&t_page='+window.ONTVtvnpage()+'&wtop='+window.ONTVrefpage();
if((PlayerEntry.containerId)&&(PlayerEntry.containerId.length>0)){newsource=newsource+'&cId='+PlayerEntry.containerId;}
try{if (('AG' in window) && ('rodoAccepted' in window.AG)){newsource=newsource+'&AGra='+window.AG.rodoAccepted;}}catch(e){}
try{if ('cxDmpSegments' in window){ newsource=newsource+'&cxDmpS='+encodeURIComponent(window.cxDmpSegments.toString()); }}catch(e){}
if (PlayerEntry.vasturl.length>10){ newsource=newsource+'&vasturl=' + PlayerEntry.vasturl ; }
else try{if (PlayerEntry.useDfpParams && ('dfpParams' in window) && ('video' in window.dfpParams) && ('preroll' in window.dfpParams.video)){ newsource=newsource+'&vasturl='+encodeURIComponent(window.dfpParams.video.preroll.substring(0,6000));}}catch(e){}
fi.src=newsource;PlayerEntry.frame=fi;PlayerEntry.div2=fi.parentElement;PlayerEntry.div=PlayerEntry.div2.parentElement;
if (PlayerEntry.div){ PlayerEntry.div.miniatureLevel = PlayerEntry.miniatureLevel ; }
window.ONTVstartObserver(PlayerEntry.div);}}}
  if (typeof(window.ONTVinvokePlayer)=="undefined"){
    window.ONTVinvokePlayer=function( PlayerEntry ){
      if (PlayerEntry.addcount>100){ return ; }
      qq = new Date().getTime();
      var fstyle='padding-bottom:calc( '+PlayerEntry.ar+'% - 1px );';if(PlayerEntry.outstream=="o"){fstyle='padding-bottom:0px;';}
      if(PlayerEntry.newoutstream==1){fstyle='';}
      var frameinvokef = '<div id="d'+PlayerEntry.frameId+'" class="checkvisc normplayer alwplayer desktop'+
                         '" onclick="window.ONTVcloseMiniature(this);">'+
                         '<iframe id="'+PlayerEntry.frameId+'" class="checkvisc onnetworkframe desktop" scrolling="no" allowfullscreen allow="autoplay; fullscreen"></iframe>' +
                         '</div>' ;
      var frameinvoke = '<div id="'+PlayerEntry.divId+'" class="checkvis onnetworkplayercontainer desktop wid'+PlayerEntry.wid+
                        (PlayerEntry.newoutstream==1?' outstream ':' ') + (PlayerEntry.smfmo==1?' smfmo ':' ') + 
                        (PlayerEntry.ocloser==1?' ocloser ':' ') + 'country'+PlayerEntry.cid + ' podcast'+PlayerEntry.podcast +
                        (window.ONTVminiatureBlocked()?'':' smin'+PlayerEntry.miniaturePlayer + (PlayerEntry.miniatureCloser>0?' closer closer'+PlayerEntry.miniatureCloser:' ') + ' mmpl'+PlayerEntry.mMiniaturePlayer) + '" style="'+
                        fstyle+'" '+(PlayerEntry.miniatureCloserDelay>0 ? ' data-closerdelay='+PlayerEntry.miniatureCloserDelay+' ' : 'data-closerdelay=0 ' )+
                        ((PlayerEntry.miniaturePos==1)&&(PlayerEntry.miniatureTarget!="")?' data-miniaturetarget="'+PlayerEntry.miniatureTarget+'" ':'' ) +
                        (PlayerEntry.ocloser==1?' onclick="window.ONTVclosePlayer(this);" ':' ') +
                        ' >'+frameinvokef+'</div>' ;
      if (PlayerEntry.containerId){
        var embedContainer = document.getElementById( PlayerEntry.containerId );
        
        if (embedContainer && (typeof(embedContainer)=="object")){ 
          try{ embedContainer.innerHTML = frameinvoke ; 
               window.ONTVdebug( "onnetwork player assigned into container" , 1 ); }catch(e){ console.log( e ); }
        } else {if(document.readyState=="loading"){document.write( frameinvoke ); window.ONTVdebug( "onnetwork player code written" , 1 );}else{window.ONTVdebug("Async call while document already loaded",1);}}
      } else 
      if (PlayerEntry.insertNode){
        var nd=document.createElement("DIV");
        nd.id=PlayerEntry.divId;if(PlayerEntry.outstream=='o'){if(PlayerEntry.newoutstream!=1){nd.style.paddingBottom="0px;";}}else{nd.style.paddingBottom="calc( "+PlayerEntry.ar+"% - 1px )";}
        nd.className = "checkvis onnetworkplayercontainer desktop wid"+PlayerEntry.wid + 
                       (PlayerEntry.newoutstream==1?' outstream ':' ') + (PlayerEntry.smfmo==1?' smfmo ':' ') + 
                       (PlayerEntry.ocloser==1?' ocloser ':' ') + 'country'+PlayerEntry.cid + ' podcast'+PlayerEntry.podcast +
                       (window.ONTVminiatureBlocked()?'':' smin'+PlayerEntry.miniaturePlayer + (PlayerEntry.miniatureCloser>0?' closer closer'+PlayerEntry.miniatureCloser:' ') + ' mmpl'+PlayerEntry.mMiniaturePlayer) ;
        nd.dataset['closerdelay'] = PlayerEntry.miniatureCloserDelay ;
        if((PlayerEntry.miniaturePos==1)&&(PlayerEntry.miniatureTarget!="")){ nd.dataset['miniaturetarget'] = PlayerEntry.miniatureTarget ; }
        nd.innerHTML = frameinvokef ;
        if (PlayerEntry.ocloser==1){ nd.addEventListener( "click" , window.ONTVclosePlayer , false ); }
        if (PlayerEntry.scriptSibling){ PlayerEntry.insertNode.insertBefore( nd , PlayerEntry.scriptSibling ); }
        else { PlayerEntry.insertNode.appendChild( nd ); }
        window.ONTVdebug( "onnetwork player put after script node" , 1 );
      } else{document.write(frameinvoke);window.ONTVdebug("onnetwork player code written",1);}
      if (PlayerEntry.playerDelay>0){
        setTimeout( function(){window.ONTVsetFrame( PlayerEntry );} , PlayerEntry.playerDelay*1000 );
      }else{
        window.ONTVsetFrame( PlayerEntry );
      }
      if ((PlayerEntry.outstream=='o')&&(PlayerEntry.newoutstream!=1)){setTimeout(function(){try{document.getElementById(PlayerEntry.divId).style.paddingBottom='calc( '+PlayerEntry.ar+'% - 1px )';}catch(e){}},50);}
      PlayerEntry.addcount++ ;
      window.ONTVdebug( window , 3 );
      window.ONTVdebug( window.__cmp , 3 );
      return true ;
    }
    window.EXSInvokePlayer=function(_cId,_sOpt,_mOpt,_sP){
      window.ONTVaddReplacePlayer({"containerId":_cId,"miniaturePlayer":_mOpt,"mid":_sP});
    }
  }
if(typeof(window.ONTVPlayersStartFunction)=="undefined"){window.ONTVPlayersStartFunction=function(){
for(var i=0;i<window.ONTVPlayers.length;i++){if((window.ONTVPlayers[i]!=null) && !window.ONTVPlayers[i].added){window.ONTVPlayers[i].added=window.ONTVinvokePlayer(window.ONTVPlayers[i]);}}}
setTimeout( function(){setInterval( window.ONTVPlayersStartFunction,50);},200 );}
window.ONTVdebug( 'Embed pt:31.0399532318' , 1 );