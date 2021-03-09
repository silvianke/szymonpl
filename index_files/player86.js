  var tplayer = document.getElementById( "tplayer" );
  var autoplayAllowed=true , autoplayRequiresMuted = true ;  
  var hlsOnMediaAttached = null ;
  var hlsOnManifestLoaded = null ;
  var currCue = null ;

  var preloadAction = -1 ;
  var userActionPlay = AP_none ;
  var autoplayActionPlay = AP_autoplay ; 
  var autoplayScrollActionPlay = AP_autoplayscroll ;
  var autoplayIfAdActionPlay = AP_autoplayifad ;
  var autoplayIfAdScrollActionPlay = AP_autoplayifadscroll ;
  
  var pauseResumeScript = 0 ;
  var pauseResumeVisibility = 1 ;
  var pauseResumeClick = 2 ;
  var pauseResumeRedirect = 3 ;
  var pauseResumeAd = 4;

  class fLoader extends Hls.DefaultConfig.loader {
    constructor(config) {
      super(config);
      this.urlparams = config.urlparams ;
      this.secureFunc = config.secureFunc ;
      this.oldload = this.load.bind(this);
      this.load = (context, config, callbacks)=>{ 
        if (typeof(this.secureFunc)=="function"){
          var secureParams = this.secureFunc(context.url);
          if ((typeof(secureParams)=="string")&&(secureParams!="")){
            if (context.url.indexOf("?")>0){
              context.url = context.url + "&" + secureParams ;
            }else{
              context.url = context.url + "?" + secureParams ;
            }
          }
        }
        if (typeof(this.urlparams)=="string"){
          if (context.url.indexOf("?")>0){
            context.url = context.url + "&" + this.urlparams ;
          }else{
            context.url = context.url + "?" + this.urlparams ;
          }
        }
        this.oldload(context,config,callbacks); 
      };
    }
  }

  class tUIPlayer {
    constructor( options , iUI ){
      this.Options = options ;
      if ((typeof(this.Options.videos)=="undefined") || (this.Options.videos.length<1) ) { return ; }   
      this.clearOptions();
      this.playerVisible = 0 ;
      this.isActiveTab = false ;
      this.isVisible = false ;
      this.halfVisible = false ;
      this.fullVisible = false ;
      this.adViewableTimer = 0 ;
      this.adFullViewableTimer = 0 ;
      this.adRAudibleTimer = 0 ;
      this.adAViewableTimer = 0 ;
      this.adViewableSend = 0 ;
      this.adFullViewableSend = 0 ;
      this.adAudibleSend = 0 ;
      this.adRAudibleSend = 0 ;
      this.adRAViewableSend = 0 ;
      this.adStartAudibleSend = 0 ;
      this.mvViewableTimer = 0 ;
      this.mvFullViewableTimer = 0 ;
      this.mvViewableSend = 0 ;

      this.UI = iUI ;
      this.UI.bindPlayer( this );
      this.videoPlayer = this.UI.video ;
      this.videoNb = 0 ;
      this.currPlayer = "" ;
      this.playMuted = 0 ;
      this.widgetControl = 0 ;

      this.ytplayer = null ;
      this.ytplayerstate = -1 ;
      this.hlsPlayer = null ;
      this.dashPlayer = null ;
 
      this.remotePlayer = null ;
      this.remotePlayerController = null ;
      this.remotePlayerInitialized = false ;
      this.playingBeforeConnect = false ;
      this.remotePlayerConnected = false ;
      this.remotePlayerLoadedMedia = false ;
      this.remotePlayerState = "IDLE" ;
      this.remotePlayerLastTime = 0 ;

      this.playerWasStarted = false ; 
      this.playbackStarted = false ;
      this.waitforinit = true ;
      this.userinitplay = false ;      
      this.reportuserinitplay = false ;      
      this.manualVol = 0 ;

      this.preloading = 0 ;
      this.isLive = false ;
      this.liveCheck = Date.now() - 10000 ;
      this.ageWarning = false ;
      this.ageWarningDelayed = false ;
      this.playlistedVideo = 0 ;
      this.toSeek = 0 ;

      this.levelSwitching = false ;
      this.levelSwitchingVPaused = false ;
      this.levelSwitchingUrl = "" ; 
      this.levelSwitchingRes = 0 ;
      this.levelSwitchingTime = 0 ;
      this.attaching = 0 ; // -1 - detaching , 1 - attaching , 2 - attached 
      hlsOnManifestLoaded=this.playerHlsManifestLoaded.bind(this); 
      hlsOnMediaAttached=this.playerHlsMediaAttached.bind(this); 
      this.hlsErrorTime = 0 ;
      this.hlsRecoverCount = 0 ;

      currCue = this.playerCurrCue.bind(this); 
      this.ttime = new Date().getTime(); 

      this.adPodTotalAds = 1 ;
      this.adPodIndex = 0 ;
      this.adPodAdPos = 1 ;
      this.totalAdsPlayed = 0 ;
      this.totalPrePlayed = 0 ;
      this.totalMidPlayed = 0 ;
      this.totalPostPlayed = 0 ;

      this.promiseFailure = false ;
      this.contentInitialized = false ;
      this.revertIdleActivate = 0 ;
      if (this.Options.muteAutoplay){ this.playMuted = 1 ; deb( "muted by option" , 1 ); }
      this.wasPaused = false ;
      this.pausedBy = -1 ;
      this.resumedBy = -1 ;
      this.minCurrAdVol = 0 ;
      this.currAddClickPause = 0 ;
      this.adSearching = false ;
      this.adPlaying = false ;
      this.actionsQueue = [] ;
      this.handleEvents = true ;
      this.adNotPresentReported = false ;

      this.setCurrentVideo();
      this.muteVolume = this.Options.volume ;
      this.setVolume( this.Options.volume );

      this.Options.adDisplayContainerId = this.UI.lcont.id ;
      this.Options.allContainerId = this.UI.allContainer.id ;
      this.adsCtrl = new tAIPlayer( this , this.Options , this.adsCtrlCallback.bind(this) );
      this.UI.titlescroll();
      this.UI.setPoster( this.currentVideo.poster );
      this.videoPlayer.addEventListener("ended",(e)=>{ this.playerEnded(e); } , false );
      this.videoPlayer.addEventListener("pause",(e)=>{ this.playerPaused(e); },false);      
      this.videoPlayer.addEventListener("error",(e)=>{ this.playerError(e); },false);      
      this.videoPlayer.addEventListener("play",(e)=>{ this.playerPlayStart(e); },false);      
      this.videoPlayer.addEventListener("timeupdate",(e)=>{ this.playerTimeUpdate(e); } ,false);      
      this.videoPlayer.addEventListener("contextmenu",(e)=>{ e.preventDefault(); return true ; },false);
      this.videoPlayer.addEventListener("loadedmetadata", (e)=>{ this.playerMetaData(e); },false );
      this.videoPlayer.addEventListener("loadeddata", (e)=>{ this.playerData(e); } ,false );
      this.videoPlayer.addEventListener("readystatechange", (e)=>{ this.videoPlayerReadyStateChange(e); }, false);
      this.videoPlayer.addEventListener("seeking", (e)=>{ this.videoSeeking(e); }, false);
      this.videoPlayer.addEventListener("seeked", (e)=>{ this.videoSeeked(e); }, false);
      this.videoPlayer.addEventListener("waiting", (e)=>{ this.videoWaiting(e); }, false);
      this.videoPlayer.addEventListener("playing", (e)=>{ this.videoPlaying(e); }, false);
      if (((mobile==0)&&!hlsnative) || (ios>0)){ this.videoPlayer.setAttribute( "preload" , "none" ); }
      document.addEventListener("fullscreenchange",(e)=>{ this.fullScreenEvent(e); },false);
      document.addEventListener("webkitfullscreenchange",(e)=>{ this.fullScreenEvent(e); },false);
      if (this.videoPlayer.textTracks){ 
        deb( "addTracklisteners" , 3 );
        this.videoPlayer.textTracks.addEventListener("addtrack",(e)=>{ this.playerTexts(e); } ,false);
        this.videoPlayer.textTracks.addEventListener("change",(e)=>{ this.playerTexts(e); } ,false);
        this.videoPlayer.textTracks.addEventListener("removetrack",(e)=>{ this.playerTexts(e); },false);
      }
      this.updateInterface( "movie" );
      this.consentTimeouted=false;
      this.consentWait=!consentLoaded;
      this.consentStart = Date.now();
      this.mainInterval = setInterval(()=>{this.mainIntervalFunc();},100);
      this.autoplayChecked = false ;
      timelistadd( "before apcheck" );
      if ((this.Options.DoNotCheckAPPolicy==true)||(this.Options.muteAutoplay)){
        this.autoplayChecksResolved(0);
      }else{
        setTimeout( (e)=>{ this.autoplayChecksResolved(1); } , 5000 );
        checkAutoplaySupport( this );
      }
      if (castLoaded){ this.initializeRemotePlayer(); }
    }


    clearOptions(){
      if (typeof(this.Options.autoplay)=="undefined"){ this.Options.autoplay = AP_autoplayifad ; } else { this.Options.autoplay = 1*this.Options.autoplay ; }
      if ((this.Options.autoplay!=AP_none) && (this.Options.autoplay!=AP_autoplay) && (this.Options.autoplay!=AP_autoplayscroll) && 
          (this.Options.autoplay!=AP_autoplayifad) && (this.Options.autoplay!=AP_autoplayifadscroll)){
        this.Options.autoplay = AP_autoplayifadscroll ;
      }
      if (typeof(this.Options.idleActivate)=="undefined"){this.Options.idleActivate=0;}else{this.Options.idleActivate=1*this.Options.idleActivate;}
      if (typeof(this.Options.volume)!="number"){ this.Options.volume = 0.5 ; }
      this.Options.volume = Math.min( 1 , Math.max( 0 , this.Options.volume ) );
      if (typeof(this.Options.movv)!="number"){ this.Options.movv = this.Options.volume ; }
      this.Options.movv = Math.min( 1 , Math.max( 0 , this.Options.movv ) );
      if (typeof(this.Options.allowNonLinear)=="undefined"){ this.Options.allowNonLinear = 0 ; } else { this.Options.allowNonLinear = 1*this.Options.allowNonLinear ; }
      if (typeof(this.Options.adPauseAllowed)=="undefined"){ this.Options.adPauseAllowed = 0 ; } else { this.Options.adPauseAllowed = 1*this.Options.adPauseAllowed ; }
      if (typeof(this.Options.adPauseIAllowed)=="undefined"){ this.Options.adPauseIAllowed = 0 ; } else { this.Options.adPauseIAllowed = 1*this.Options.adPauseIAllowed ; }
      if (typeof(this.Options.adNotPauseOnClick)=="undefined"){ this.Options.adNotPauseOnClick = 0 ; } else { this.Options.adNotPauseOnClick = 1*this.Options.adNotPauseOnClick ; }
      if (typeof(this.Options.adNotUnmuteOnClick)=="undefined"){ this.Options.adNotUnmuteOnClick = 0 ; } else { this.Options.adNotUnmuteOnClick = 1*this.Options.adNotUnmuteOnClick ; }
      if (typeof(this.Options.adNotUnmuteOnSkip)=="undefined"){ this.Options.adNotUnmuteOnSkip = 0 ; } else { this.Options.adNotUnmuteOnSkip = 1*this.Options.adNotUnmuteOnSkip ; }
      if (typeof(this.Options.noAdsPreload)=="undefined"){ this.Options.noAdsPreload = 0 ; } else { this.Options.noAdsPreload = 1*this.Options.noAdsPreload ; }
      if (typeof(this.Options.noAdsPreloadCMPUI)=="undefined"){ this.Options.noAdsPreloadCMPUI = 0 ; } else { this.Options.noAdsPreloadCMPUI = 1*this.Options.noAdsPreloadCMPUI ; }
      if (typeof(this.Options.maxPrerollAdsCount)=="undefined"){ this.Options.maxPrerollAdsCount = 1 ; } else { this.Options.maxPrerollAdsCount = 1*this.Options.maxPrerollAdsCount ; }
      if (typeof(this.Options.maxMidrollAdsCount)=="undefined"){ this.Options.maxMidrollAdsCount = 1 ; } else { this.Options.maxMidrollAdsCount = 1*this.Options.maxMidrollAdsCount ; }
      if (typeof(this.Options.maxPostrollAdsCount)=="undefined"){ this.Options.maxPostrollAdsCount = 1 ; } else { this.Options.maxPostrollAdsCount = 1*this.Options.maxPostrollAdsCount ; }
      if (typeof(this.Options.showSkip)=="undefined"){ this.Options.showSkip = 0 ; } else { this.Options.showSkip = 1*this.Options.showSkip ; }
      if (typeof(this.Options.skipTime)=="undefined"){ this.Options.skipTime = 5 ; } else { this.Options.skipTime = 1*this.Options.skipTime ; }
      if (typeof(this.Options.minAdVol)=="undefined"){ this.Options.minAdVol = 0 ; } else { this.Options.minAdVol = Math.max( 0 , Math.min( 1*this.Options.minAdVol , 1 ) ); }
      this.Options.minAdVol = Math.min( 1 , Math.max( 0 , this.Options.minAdVol ) );
      if (typeof(this.Options.minMvVol)=="undefined"){ this.Options.minMvVol = 0 ; } else { this.Options.minMvVol = Math.max( 0 , Math.min( 1*this.Options.minMvVol , 1 ) ); }
      this.Options.minMvVol = Math.min( 1 , Math.max( 0 , this.Options.minMvVol ) );
      if ((typeof(this.Options.vpaid)=="undefined") || 
          ((this.Options.vpaid!=0) && (this.Options.vpaid!=1) && (this.Options.vpaid!=2))){ this.Options.vpaid = 0 ; }
// vasturl
      if (typeof(this.Options.pauseInvisible)=="undefined"){ this.Options.pauseInvisible = 0 ; } else { this.Options.pauseInvisible = 1*this.Options.pauseInvisible ; }
      if (typeof(this.Options.pauseInvisibleAd)=="undefined"){ this.Options.pauseInvisibleAd = 0 ; } else { this.Options.pauseInvisibleAd = 1*this.Options.pauseInvisibleAd ; }
      if (typeof(this.Options.playNext)=="undefined"){ this.Options.playNext = AP_autoplayifad ; } else { this.Options.playNext = 1*this.Options.playNext ; }
      if ((this.Options.playNext!=AP_none) && (this.Options.playNext!=AP_autoplay) && (this.Options.playNext!=AP_autoplayscroll) && 
          (this.Options.playNext!=AP_autoplayifad) && (this.Options.playNext!=AP_autoplayifadscroll) && (this.Options.playNext!=-1)){
        this.Options.playNext = AP_autoplayifad ;
      }
// pnf
      if (typeof(this.Options.loop)=="undefined"){ this.Options.loop = 0 ; } else { this.Options.loop = 1*this.Options.loop ; }
      if (typeof(this.Options.adMediaLoadTimeout)=="undefined"){ this.Options.adMediaLoadTimeout = 8000 ; } else { this.Options.adMediaLoadTimeout = 1*this.Options.adMediaLoadTimeout ; }
      if (typeof(this.Options.adVastLoadTimeout)=="undefined"){ this.Options.adVastLoadTimeout = 2000 ; } else { this.Options.adVastLoadTimeout = 1*this.Options.adVastLoadTimeout ; }
      if (typeof(this.Options.adMaxRedirects)=="undefined"){ this.Options.adMaxRedirects = 8 ; } else { this.Options.adMaxRedirects = 1*this.Options.adMaxRedirects ; }
      if (typeof(this.Options.adFailSafeLongTimeout)=="undefined"){ this.Options.adFailSafeLongTimeout = 20000 ; } else { this.Options.adFailSafeLongTimeout = 1*this.Options.adFailSafeLongTimeout ; }
      if (typeof(this.Options.adFailSafeShortTimeout)=="undefined"){ this.Options.adFailSafeShortTimeout = 5000 ; } else { this.Options.adFailSafeShortTimeout = 1*this.Options.adFailSafeShortTimeout ; }
      if (typeof(this.Options.locales)=="undefined"){ this.Options.locales = "pl" ; }
      if (typeof(this.Options.DoNotAutoplayScrollIfOtherAdPlaying)=="undefined"){ this.Options.DoNotAutoplayScrollIfOtherAdPlaying = false ; }
    }

    initializeRemotePlayer(){
      if (!castLoaded){ return; }
      if (this.remotePlayerInitialized){ return ; }
      try{
        this.remotePlayer = new cast.framework.RemotePlayer();
        this.remotePlayerController = new cast.framework.RemotePlayerController(this.remotePlayer);
        this.remotePlayerController.addEventListener(
          cast.framework.RemotePlayerEventType.IS_CONNECTED_CHANGED,
          this.switchPlayer.bind(this)
        );
//        this.remotePlayerController.addEventListener(cast.framework.RemotePlayerEventType.ANY_CHANGE,(e)=>{console.log(this);});
        this.remotePlayerInitialized = true ;
        var gcl = document.getElementById( "gcl" );
        if (gcl){
          var s = document.createElement( "style" );
          s.textContent = 'svg{display:block;height:calc( 100% + 4px );width:auto;margin-top:-2px;margin-bottom:2px;}' ;
          gcl.shadowRoot.appendChild(s);
        }
        var gclc = document.getElementById( "castcontrol" );
        if (gclc){ gclc.dataset['caston']="1"; }
      }catch(e){}
    }

    switchPlayer( e ){
      if (cast && cast.framework && this.remotePlayer && this.remotePlayer.isConnected){
        this.playMuted = false ;
        this.remotePlayerConnected=true;
        this.remotePlayerLoadedMedia=false;
        if (this.adsCtrl.isPlayingAd()){ return ; }
        var thisPlaying = this.currentVideo.movieStarted && !this.currentVideo.pausedByClick ;
        this.wrapperPause();
        if (this.prepareRemotePlayer(thisPlaying)){
          this.remotePlayerController.addEventListener(cast.framework.RemotePlayerEventType.IS_PAUSED_CHANGED,this.remotePlayerPausedChanged.bind(this));
          this.remotePlayerController.addEventListener(cast.framework.RemotePlayerEventType.CURRENT_TIME_CHANGED,this.remotePlayerTimeChanged.bind(this));
          this.remotePlayerController.addEventListener(cast.framework.RemotePlayerEventType.DURATION_CHANGED,this.remotePlayerTimeChanged.bind(this));
          this.remotePlayerController.addEventListener(cast.framework.RemotePlayerEventType.VOLUME_LEVEL_CHANGED,this.remotePlayerVolumeChanged.bind(this));
          this.remotePlayerController.addEventListener(cast.framework.RemotePlayerEventType.IS_MUTED_CHANGED,this.remotePlayerVolumeChanged.bind(this));
          this.remotePlayerController.addEventListener(cast.framework.RemotePlayerEventType.PLAYER_STATE_CHANGED,this.remotePlayerStateChanged.bind(this));
          this.setVolume( this.Options.volume );
        }
      } else {
        this.remotePlayerConnected=false;
        this.remotePlayerLoadedMedia=false;
        if (this.remotePlayer.savedPlayerState){
          if (this.remotePlayer.savedPlayerState.isPaused){ this.wrapperPause(); }else{ this.wrapperResume(); }
          if (this.remotePlayer.savedPlayerState.currentTime>0){ this.seekv(this.remotePlayer.savedPlayerState.currentTime); }
        }else 
          if ((this.remotePlayerState=="IDLE") && (this.currentVideo.movieStarted)){ this.playerEnded(e); }
      }
    }

    remotePlayerPausedChanged(e){
      if (this.remotePlayer.isPaused) {
        this.playerPaused(e);
      } else {
        this.playerPlayStart(e);
        this.videoPlaying( e );
      }
    }

    remotePlayerTimeChanged(e){
      this.playerTimeUpdate();
    }

    remotePlayerVolumeChanged(e){
    }

    remotePlayerStateChanged(e){
      if (this.remotePlayer.playerState!=this.remotePlayerState){
        this.remotePlayerState = this.remotePlayer.playerState ;
        if (this.remotePlayerState=="IDLE"){
          try{
            var castSession = cast.framework.CastContext.getInstance().getCurrentSession();
            var session = castsession.getSessionObj();
            if (session){
              session.leave( function(){ castSession.endSession(true); }.bind(this),
                function(errorCode) { castSession.endSession(true); }.bind(this) );
            }else{
              castSession.endSession(true);
            }
          }catch(e){}
        }
      }
    }

    prepareRemotePlayer(thisPlaying){
      try{
      var mediaInfo ;
      switch (this.currentVideo.sourcetype){
        case "hls" : mediaInfo = new chrome.cast.media.MediaInfo(this.currentVideo.url, 'application/vnd.apple.mpegurl' ); break ;
        case "mpegdash" : return false; // this.currentVideo.url
        case "url" : mediaInfo = new chrome.cast.media.MediaInfo(this.currentVideo.url, 'application/vnd.apple.mpegurl' ); break ;
        case "mp4" : mediaInfo = new chrome.cast.media.MediaInfo(this.currentVideo.url, 'application/vnd.apple.mpegurl' ); break ;
        default : return false ;
      }
      mediaInfo.streamType = chrome.cast.media.StreamType.BUFFERED;
      if (this.currentVideo.na!=1){
        var inputs = { vid:this.currentVideo.id,playerVisible:true,acount:this.totalAdsPlayed,plw:1920,plh:1080,
          duration:this.currentVideo.duration*1,muted:false,vastReadNb:0,autoPlay:0,podpos:0,
          website:this.Options.websiteId,mobile:1,wscat:this.Options.wscat,vprovider:this.currentVideo.vprovider,
          brandsafe:this.currentVideo.brandsafe,wasAdBeforeMovie:this.currentVideo.playedPre>0,
          absize:this.currentBlockSize,vpos:1,icor:0,nln:0};
        var clipsInfo = GetCastVASTClips( vastcodes , inputs );
        mediaInfo.breaks = [] ;
        if (clipsInfo.preClipsOwn.length+clipsInfo.preClipsOnn.length>0){
          mediaInfo.breaks.push( {id:'preroll',breakClipIds:clipsInfo.preClipsOnn.concat(clipsInfo.preClipsOwn),position:0} );
          mediaInfo.breakClips = clipsInfo.vastClips ;
        }
        if ((clipsInfo.midClipsOwn.length+clipsInfo.midClipsOnn.length>0) && 
            (this.currentVideo.mids && this.currentVideo.mids.length>0)){
          for(var i=0;i<this.currentVideo.mids.length;i++){ 
            mediaInfo.breaks.push( {id:'midroll'+i,breakClipIds:clipsInfo.midClipsOnn.concat(clipsInfo.midClipsOwn),
                                    position:this.currentVideo.mids[i]} );
          }
          mediaInfo.breakClips = clipsInfo.vastClips ;
        }
      }
      mediaInfo.metadata = new chrome.cast.media.TvShowMediaMetadata();
      mediaInfo.metadata.title = this.currentVideo.title ;
      mediaInfo.metadata.title = this.currentVideo.url ;
      mediaInfo.metadata.images = [{url:this.currentVideo.poster}];
      let request = new chrome.cast.media.LoadRequest(mediaInfo);
      request.currentTime = this.videoPlayer.currentTime ;
      request.autoplay = thisPlaying ;
      var castSession = cast.framework.CastContext.getInstance().getCurrentSession();
      castSession.loadMedia(request).then( 
        function(){ console.log('Load succeed'); this.remotePlayerLoadedMedia=true; this.waitforinit=false; }.bind(this),
        function(errorCode) { console.log('Error code: ' + errorCode);  throw new Error("error"); });
      return true ;
      }catch(e){ console.log( e ); return false ; }
    }

// methods called by UI
    seek( p ){
      if (this.adsCtrl.isPlayingAd()) return ;
      if (this.isLive) return ; 
      var seekp = p * this.wrapperDuration()  ;
      if ((this.currentVideo.startPoint>0) && 
          (this.currentVideo.endPoint>this.currentVideo.startPoint) && 
          (this.currentVideo.endPoint<=this.wrapperDuration()) && 
          ((this.currentVideo.endPoint<seekp) || (this.currentVideo.startPoint>seekp))){
        if ((seekp<this.currentVideo.startPoint) || (seekp>this.currentVideo.endPoint)){ return ; }
      }
      if ((this.currentVideo.vtype==1) && (this.currentVideo.startdate+1000*seekp>Date.now())){ return ; }
      if (this.sourceset==256){
        if (this.ytplayer){try{this.ytplayer.seekTo(seekp,true);}catch(e){}}
      }else if (this.remotePlayerConnected && this.remotePlayerLoadedMedia){
        try{
          if (this.remotePlayer.canSeek){
            this.remotePlayer.currentTime= seekp ;
            this.remotePlayerController.seek()
          }
        }catch(e){}
      }else{
        try{ 
          this.videoPlayer.currentTime = seekp ; 
          this.searchAndPlayMidAfterSeek(seekp,this.wrapperDuration());
        } catch(e){ this.videoPlayer.currentTime = 0 ; }
      }
      return ;
    }
    seekv( p ){
      if (this.wrapperDuration()>0){this.seek(p/this.wrapperDuration());}
    }
    exSeek( sp ){
      if (sp && sp.length && !this.adsCtrl.isPlayingAd() && !isNaN(this.wrapperDuration()) && (this.wrapperDuration()>0)){
        var sv=0 ;
        try{ sv=parseFloat( sp ); }catch(e){ return ; }
        if (isNaN(sv)){ return ; }
        if (!sp.trim().endsWith("%")){ sv=sv/this.wrapperDuration(); }else{ sv=sv/100; }
        if ((sp.trim().startsWith("+") || sp.trim().startsWith("-")) && !isNaN(this.wrapperGetCurrentTime())){ 
          sv= this.wrapperGetCurrentTime()/this.wrapperDuration() + sv ;
        }
        if (sv<0){ sv=0; }
        if (sv>1){ sv=1; }
        this.seek( sv );
      }
    }
    skipAd(){
      if ((this.playMuted==1)&&(this.Options.adNotUnmuteOnSkip==0)){
        this.playMuted = 0 ;
        this.UI.hidePlayClick();
        this.setVolume( this.Options.volume );
      }
      if (this.adsCtrl.isPlayingAd()){this.adsCtrl.skipAds();}
    }
    setVolume( vol ){    
      deb( "volume to set :"+vol , 3 );
      deb( "playMuted :"+this.playMuted , 3 );
      deb( "muteVolume :"+this.muteVolume , 3 );
      var lastvol = this.getVolume();
      try{ vol = Math.max( Math.min( vol , 1 ) , 0 ); } catch(e){ vol = 0.5 ; }
      if (this.playMuted==1){    
        if(this.adsCtrl){this.adsCtrl.setVolume( 0 );}
        if (typeof(this.videoPlayer)=="object"){ 
          this.videoPlayer.volume = 0 ; this.videoPlayer.muted = true ; this.videoPlayer.defaultMuted = true ;
          if (this.sourceset==256){try{this.ytplayer.setVolume(0);this.ytplayer.mute();}catch(e){}}
        }
        this.sendSignal( 'player_volumeset' , this );
        return ;
      }
      if (this.manualVol){
        this.Options.volume = vol ;
        this.Options.movv = vol ;
        this.Options.muteVolume = vol ;
//        this.playMuted = 0 ;
        if(this.adsCtrl){this.adsCtrl.setVolume( vol/2 );}
        if (typeof(this.videoPlayer)=="object"){ 
          this.videoPlayer.defaultMuted = false ; this.videoPlayer.muted = false ; this.videoPlayer.volume = vol ;
          if (this.sourceset==256){try{this.ytplayer.setVolume(100*vol);this.ytplayer.unMute();}catch(e){}}
        }
      } else {
        if(this.adsCtrl){this.adsCtrl.setVolume( Math.min( 1 , Math.max( 0 , vol/2 , this.Options.minAdVol/2 , this.minCurrAdVol/2 ) ) );}
        try{ 
          this.videoPlayer.defaultMuted = false ; 
          this.videoPlayer.muted = false ; 
          this.videoPlayer.volume = Math.min( 1 , Math.max( vol , this.Options.minMvVol ) );  
        }catch(e){}
        if (this.sourceset==256){try{this.ytplayer.setVolume(100*vol);this.ytplayer.unMute();}catch(e){}}
      }
      if (vol!=lastvol){ this.sendSignal( 'player_volumeset' , this ); }
      this.UI.setVolume( vol );
    }
    getVolume(){
      if (this.adsCtrl && this.adsCtrl.isPlayingAd()) { return Math.min( 2*this.adsCtrl.getVolume() , 1 ); }
      else if (typeof(this.videoPlayer)=="object"){ 
        if (this.sourceset==256){try{return this.ytplayer.getVolume()/100;}catch(e){}}
        return this.videoPlayer.volume ; 
      }
      else return 0 ;
    }

// setting current video and checking input params
    setCurrentVideo(){
      this.currentVideo = this.Options.videos[this.videoNb] ;
      if (this.currentVideo.vtype==1){
        try{
          var sd = new Date( this.currentVideo.startdates );
          this.currentVideo.startdate = sd.getTime();
        }catch(e){
          this.currentVideo.startdate = 0 ;
        }
        if (this.currentVideo.startdate>Date.now()){
          console.log( "start in :"+((this.currentVideo.startdate-Date.now())/1000)+" secs" );
        }else{
          console.log( "jump to :"+((Date.now()-this.currentVideo.startdate)/1000)+" secs" );
        }
      }
      if (typeof(this.currentVideo.poster)!="string"){ this.currentVideo.poster = "" ; }
      if (typeof(this.currentVideo.title)!="string"){ this.currentVideo.title = "" ; }
      if (typeof(this.currentVideo.url)!="string"){ this.currentVideo.url = "" ; }
      if (typeof(this.currentVideo.exframe)!="string"){ this.currentVideo.exframe = "" ; }
      if (this.currentVideo.na!=1) { this.currentVideo.na=0; }
      this.currentVideo.signals = { playsignaled:false, mimprsignaled : false, mstartsignaled:false, mfirstsignaled:false, mmidsignaled:false, mthirdsignaled:false, m95signaled:false, mcompletesignaled:false, fullscreensignaled:false } ;
      this.sourceset = 0 ;
      this.wasAdBeforeMovie = 0 ;
      this.currentVideo.movieStarted = false ;
      this.currentVideo.pausedByClick = false ;
      this.currentVideo.preloaded = 0 ;
      this.currentVideo.playedPre = 0 ;
      this.currentVideo.completedAllPre = false ;
      this.currentVideo.playedMidTotal = 0 ;
      this.currentVideo.playedMidCurr = 0 ;
      this.currentVideo.lastMidIndex = 0 ;
      this.currentVideo.playedPost = 0 ;
      this.currentVideo.liveCnt = 0 ;
      this.currentVideo.liveCntW = 0 ;
      this.currentVideo.midsCues = [] ;
      this.isLive = this.currentVideo.live && safari ;
      if (this.currentVideo.na==0 && this.currentVideo.mids && (this.currentVideo.mids.length>0) && (getMidsCodesCount(vastcodes)>0)){
        for(var i=0;i<this.currentVideo.mids.length;i++){ 
          this.currentVideo.midsCues.unshift({mid:i+1,pos:this.currentVideo.mids[i],played:false,preload:false,preloaded:false});
        }
      }
      this.currentVideo.allAdsCompleted = false ;
      this.currentVideo.contentCompleted = false ;
      this.currentVideo.vtype0SetTime = Date.now();
      this.currentVideo.totalPlayTime = 0 ;
      this.currentVideo.adVisibleSend = 0 ;
      this.currentVideo.mvVisibleSend = 0 ;
      this.sendSignal( "movie_set" , this );
      if (this.Options.playlistNextPrev && (this.Options.videos.length>0)){
        this.UI.nextVid.classList.remove("notused");
        this.UI.prevVid.classList.remove("notused");
        if (this.videoNb<this.Options.videos.length-1){
          this.UI.nextVid.classList.remove("grayed");
        }else{
          this.UI.nextVid.classList.add("grayed");
        }
        if (this.videoNb>0){
          this.UI.prevVid.classList.remove("grayed");
        }else{
          this.UI.prevVid.classList.add("grayed");
        }
      }else{ 
        this.UI.nextVid.style.display="none"; 
        this.UI.nextVid.classList.add("notused");
        this.UI.prevVid.style.display="none";
        this.UI.prevVid.classList.add("notused");
      }
    }

    setLinkButton(){
      if ((this.currentVideo.button>0) &&
          (this.wrapperGetCurrentTime()>=this.currentVideo.buttontime) &&
          ((this.currentVideo.buttonetime==0) || (this.wrapperGetCurrentTime()<=this.currentVideo.buttonetime)) &&
          (this.currentVideo.buttontitle.length>0))
      {
        this.UI.showLinkButton( this.currentVideo.button , this.currentVideo.buttontitle , this.currentVideo.buttonlink ); 
      }else{
        this.UI.hideLinkButton();
      }
    }

    hasVideoId( vid ){
      if (!this.Options.videos || !this.Options.videos.length){ return -1 ; }
      for(var i=0;i<this.Options.videos.length;i++){if(this.Options.videos[i].id==vid){return i;}}
      return -1;
    }

    setMovieToPlay(){
      deb( "setMovieToPlay" , 3 );
      this.adsPlayed = 0 ;
      this.waitforinit = true ;
      this.contentInitialized = false ;
      this.adNotPresentReported = false ;
      this.promiseFailure = false ;
      this.videoPlayer.currentTime = 0 ;
      this.mvViewableTimer = 0 ;
      this.mvFullViewableTimer = 0 ;
      this.mvViewableSend = 0 ;
      if (ios==0){ this.videoPlayer.muted = false ; }
      this.updateInterface( "movie" );
      this.UI.setPPBPlay();
//      this.UI.showWaitClick();
      this.playerSetSource(0);
      this.UI.setPoster( this.currentVideo.poster );
      this.UI.setTitle( this.currentVideo.title , 1 , 0 );
      this.UI.setLogo( this.currentVideo.logo );
      try{ this.UI.setInteraction( this.currentVideo.inter ); }catch(e){ console.log( e ); }
      if ((this.Options.allowMPoster>0) && (this.currentVideo.mposter!="")){ 
        this.UI.mposter.src=this.currentVideo.mposter; 
        this.UI.allContainer.classList.add("mposter");
        if (this.Options.allowMPoster==1){ this.UI.mposter.play(); }
      }
      this.setLinkButton();
      if (this.currentVideo.ageallow>=18){
        this.UI.setAgeSign( this.currentVideo.ageallow );
        if (this.currentVideo.agepallow>=18){
          this.UI.setAgeWarning();
          this.ageWarning = true ;
        }else{
          this.Options.autoplay = AP_none ;
          this.ageWarningDelayed = true ;
        }
      }else{
        this.UI.setAgeSign( this.currentVideo.ageallow );
      }
    }

    wrapperPause(){
      if (this.remotePlayerConnected && this.remotePlayerLoadedMedia){if (!this.remotePlayer.isPaused){try{this.remotePlayerController.playOrPause()}catch(e){}}}
      else if (this.sourceset==256){if(this.ytplayer){try{this.ytplayer.pauseVideo()}catch(e){}}}else{this.videoPlayer.pause();}
    }
    wrapperResume(){
      if (this.remotePlayerConnected && this.remotePlayerLoadedMedia){if (this.remotePlayer.isPaused){try{this.remotePlayerController.playOrPause()}catch(e){}}}
      else if (this.sourceset==256){if(this.ytplayer){try{this.ytplayer.playVideo()}catch(e){}}}else{this.videoPlayer.play();}
    }
    wrapperPaused(){
      if (this.remotePlayerConnected && this.remotePlayerLoadedMedia){try{return this.remotePlayer.isPaused;}catch(e){}}
      else if (this.sourceset==256){if(this.ytplayer){try{var s=this.ytplayer.getPlayerState();return (s!=1 && s!=3);}catch(e){}}}
      else{return this.videoPlayer.paused;}
    }
    wrapperDuration(){
      if (this.remotePlayerConnected && this.remotePlayerLoadedMedia){try{return this.remotePlayer.duration}catch(e){}}
      else if (this.sourceset==256){if(this.ytplayer){try{return this.ytplayer.getDuration();}catch(e){}}}
      else{var k=this.videoPlayer.duration; return isNaN(k)?this.currentVideo.duration:k ;}
    }
    wrapperGetCurrentTime(){
      if (this.remotePlayerConnected && this.remotePlayerLoadedMedia){try{return this.remotePlayer.currentTime}catch(e){}}
      else if (this.sourceset==256){if(this.ytplayer){try{return this.ytplayer.getCurrentTime();}catch(e){}}}
      else{return this.videoPlayer.currentTime;}
    }

    clearAfterPlay(){
      this.adsCtrl.destroyBreak();
      this.UI.allContainer.classList.remove("overlay");
      this.wrapperPause();
      this.UI.hideLinkButton();
      try{ clearInterval(this.intervalTimer); }catch(e){}
      this.handleEvents = true ;
      this.UI.allContainer.classList.remove("onyt");
      var sc = document.getElementById( "subtitles-container" );
      if (sc){ sc.style.display = "" ; sc.innerHTML = "" ; }
      this.sendSignal( "movie_clear" , this );
      if (this.sourceset==8){
        if (this.dashPlayer){
          try{ this.dashPlayer.reset(); }catch(e){}
          this.dashPlayer = null ;
        }
      }
      if (this.sourceset==16){
        if (this.hlsPlayer){
          try{ this.hlsPlayer.detachMedia(); }catch(e){}
          if (this.hlsPlayer.bufferTimer){
            clearInterval( this.hlsPlayer.bufferTimer );
            this.hlsPlayer.bufferTimer = undefined ;
          }
          try{ this.hlsPlayer.destroy(); }catch(e){}
          this.hlsPlayer = null ;
        }
      }
      if (this.sourceset==256){
        this.UI.showExframe( "" , 256 );
      }
    }

    getLiveCnt(){
      var player = this ;
      try{
      fetch( 'https://cdn.onnetwork.tv/strcnt/_'+this.currentVideo.id+'.json' ).then(function(response) {
        try{ if(response.ok){ return response.json(); } }catch(e){}
      }).then(function(responseJson){
        if (responseJson['cnt']){
          player.currentVideo.liveCnt = parseInt( responseJson['cnt'] );
          if (isNaN(player.currentVideo.liveCnt)){ player.currentVideo.liveCnt=0; }
          if (player.currentVideo.liveCnt>0){
            if (responseJson.cnts){
              var suma = 0 ;
              var curr = -1 ;
              for (const i in responseJson.cnts){suma=suma+responseJson.cnts[i];if(i==player.Options.websiteId){curr=responseJson.cnts[i];}}
              if ((suma>0)&&(curr>-1)){var mn = Math.max(0,Math.floor(curr*player.currentVideo.liveCnt/suma));
                player.currentVideo.liveCntW = mn ; 
                console.log( "live stream viewers on website:"+mn );
              }
            }
          }
        }else{ player.currentVideo.liveCnt=0; };
        console.log( "live stream viewers:"+player.currentVideo.liveCnt );
      }).catch(function(e){console.log("promise catch"); console.log(e);player.currentVideo.liveCnt=0;});
      }catch(e){ this.currentVideo.liveCnt=0; }
    }

    videoGetHash(){
      var player = this ;
      if (this.currentVideo.sec==2){
        fetch( 'hash.php?video='+this.currentVideo.id+'&hash='+this.currentVideo.hashhash ).then(function(response) {
          if(response.ok){ return response.json(); }
        }).then(function(responseJson){
          player.currentVideo.hash = responseJson['hash'] ;
          player.currentVideo.hashhi = responseJson['hashhi'] ;
          player.currentVideo.hashmed = responseJson['hashmed'] ;
          player.currentVideo.hashlow = responseJson['hashlow'] ;
        });
      }
    }

    videoSecureFunc(orgurl){
      return ;
      if (this.currentVideo.sec==0){ return ; }
      if (this.currentVideo.sec==1){ return this.currentVideo.hash; }
      if (this.currentVideo.sec==2){ 
        if (typeof(orgurl)!="string"){ console.log( "no orgurl" ); return ; }
        if (orgurl.indexOf( "_hi" )>0){ return this.currentVideo.hashhi; }
        if (orgurl.indexOf( "_med" )>0){ return this.currentVideo.hashmed; }
        if (orgurl.indexOf( "_low" )>0){ return this.currentVideo.hashlow; }
      }
    }

    onytintervalfunc(){
      try{
        if (this.ytplayer.getPlayerState()==1){this.playerTimeUpdate();}
      }catch(e){}
    }
    onytplayerready(){
      deb( "onytplayerready" , 1 );
      clearInterval( this.onytinterval );
      this.onytinterval = setInterval(()=>{this.onytintervalfunc()},250);
    }
    onytstatechanged(e){
      try{
        var pstate = this.ytplayerstate ;
        this.ytplayerstate = this.ytplayer.getPlayerState();
        console.log( "YTSTATE:"+this.ytplayerstate );
        if ((this.ytplayerstate==1) && (this.ytplayerstate!=pstate)){this.playerPlayStart(e);this.videoPlaying(e);}
        if ((this.ytplayerstate==0) && (this.ytplayerstate!=pstate)){this.playerEnded(e);}
        if ((this.ytplayerstate==2) && (this.ytplayerstate!=pstate)){this.playerPaused(e);}
        if ((this.ytplayerstate==3) && (this.ytplayerstate!=pstate)){this.videoWaiting(e);}
        if ((this.ytplayerstate==-1) && (this.ytap==1)){this.setVolume(this.Options.volume);this.ytplayer.playVideo();}
      }catch(e){ this.ytplayerstate=-1; }
    }
    onyterror(e){
      console.log( "ONYTERROR" ); console.log( e );
    }

    playerSetSource(oss){
      deb( "playerSetSource:"+this.sourceset , 3 );
      deb( "current source:"+this.videoPlayer.src , 2 );
      deb( "pSS attaching:"+this.attaching , 1 );
      if (!oss && (this.sourceset*1>0)){ return ; }
      if (((mobile==0)&&!hlsnative) || (ios>0)){ this.videoPlayer.setAttribute( "preload" , "none" ); }
//      if (mobile==0){ this.videoPlayer.setAttribute( "preload" , "none" ); }      
      deb( "hlssupport:"+hlssupport+" hlsnative: " + hlsnative + "  sourcetype:"+this.currentVideo.sourcetype , 2 );
      if (this.currentVideo.sourcetype=="hls"){
        if (hlssupport){
          deb( "setting hls:" + this.currentVideo.url , 3 );
          this.sourceset = 16 ;
          if (this.currentVideo.audio==1){
            this.hlsPlayer = new Hls({debug:false,capLevelToPlayerSize:false,startLevel:0,maxMaxBufferLength:60,maxSeekHole:0,
                                      liveDurationInfinity:true,
                                      fLoader : fLoader , urlparams : this.Options.urlparams , secureFunc : this.videoSecureFunc.bind(this) });
          }else{
            this.hlsPlayer = new Hls({debug:false,capLevelToPlayerSize:true,startLevel:1,maxMaxBufferLength:60,maxSeekHole:0,
                                      liveDurationInfinity:true,
                                      fLoader : fLoader , urlparams : this.Options.urlparams , secureFunc : this.videoSecureFunc.bind(this) });
          }
          if (this.hlsPlayer){
            deb( "HLSInitializing" , 3 );
            this.attaching = 0 ;
            this.hlsPlayer.on( Hls.Events.MEDIA_ATTACHING , (e,data)=>{ this.attaching=1; } );
            this.hlsPlayer.on( Hls.Events.MEDIA_ATTACHED , hlsOnMediaAttached );
            this.hlsPlayer.on( Hls.Events.MEDIA_DETACHING , (e,data)=>{ this.attaching=-1; } );
            this.hlsPlayer.on( Hls.Events.FRAG_PARSED , (e,data)=>{ deb("frag",5); deb( data , 5 ); } );
            this.hlsPlayer.on( Hls.Events.MEDIA_DETACHED , (e,data)=>{ this.attaching=0; } );
            this.hlsPlayer.on( Hls.Events.MANIFEST_LOADED , hlsOnManifestLoaded );
            this.hlsPlayer.on( Hls.Events.LEVEL_SWITCHED , (e,data)=>{ this.hlsPlayerLevelSwitched( e , data ); } );
            this.hlsPlayer.on( Hls.Events.FRAG_PARSING_METADATA, (event, data)=>{ deb("FRAG_PARSING_METADATA",5); deb(data,5); } );
            this.hlsPlayer.on( Hls.Events.FRAG_LOADING, (event, data)=>{ } );  
            this.hlsPlayer.on( Hls.Events.LEVEL_LOADED, (event, data)=>{ if(data.details.live){this.isLive=true;this.liveCheck=Date.now()-5000;}else{this.isLive=false;} this.UI.disableResSwitch( this.isLive ); } );
            this.hlsPlayer.on( Hls.Events.ERROR, (event, data)=>{
              deb( "HLS error" , 1 );
              deb( event , 3 );
              deb( data , 3 );
              if (data.fatal){
                if (this.hlsRecoverCount<3){
                  this.hlsRecoverCount++ ;
                  this.hlsPlayer.recoverMediaError(); 
                  this.resumePlayer(pauseResumeScript);
                }
              }
            });
            this.hlsPlayer.autoLevelCapping = 2 ;
            this.hlsPlayer.subtitleDisplay = false ;
          }
        }
        else if (hlsnative){
          deb( "setting native file:"+this.currentVideo.url , 2 );
          this.sourceset = 1 ;
          this.videoPlayer.src = this.currentVideo.url ;
        } else
        {
          deb( "setting mp4 file:"+this.currentVideo.urls[0].url , 2 );
          this.sourceset = 1 ;
          this.videoPlayer.src = this.currentVideo.urls[0].url ;
        }
      }else
      if (this.currentVideo.sourcetype=="mpegdash"){
        deb( "setting dash:" + this.currentVideo.url , 3 );
        this.sourceset = 8 ;
        this.dashPlayer = dashjs.MediaPlayer().create();
        if (this.dashPlayer){
          deb( "DashInitializing" , 2 );
          this.dashPlayer.initialize();      
          this.dashPlayer.setAutoPlay( false );
          this.dashPlayer.attachSource( this.curentVideo.url );
        }
      }else 
      if (this.currentVideo.sourcetype=="redirect"){
        deb( "setting external" , 2 );
        this.sourceset = 128 ;
      }else
      if (this.currentVideo.sourcetype=="yt"){
        deb( "setting external" , 2 );
        console.log( "setting ytext" );
        if (this.UI.exframe){
          this.UI.exframe.innerHTML="<div id=\"onytframe\" class=\"onytframe\"></div>" ;
          this.ytap = 0 ;
          if (this.Options.autoplay!=0){this.ytap=1;}
          this.ytplayer = new YT.Player('onytframe', {
            height: '360',
            width: '640',
            playerVars:{autoplay:this.ytap,controls:0,showinfo:0,rel:0,playsinline:1,origin:'video.onnetwork.tv',
                        modestbranding:1,iv_load_policy:3,fs:0,cc_load_policy:0,controls:0,hl:this.Options.locales},
            videoId: this.currentVideo.url,
            events:{'onReady': (e)=>{this.onytplayerready(e);} , 'onStateChange': (e)=>{this.onytstatechanged(e);} , 
                    'onError': (e)=>{this.onyterror(e);} }
          });
          this.UI.allContainer.classList.add("onyt");
          this.sourceset = 256 ;
        }
      }else
      if (this.currentVideo.sourcetype=="url"){
        deb( "setting file:"+this.currentVideo.url , 2 );
        this.sourceset = 1 ;
        this.videoPlayer.src = this.currentVideo.url ;
      }else
      {
        deb( "setting file:"+this.currentVideo.urls[0].url , 2 );
        this.sourceset = 1 ;
        this.videoPlayer.src = this.currentVideo.urls[0].url ;
      }
      this.UI.showExframe( this.currentVideo.exframe , this.sourceset ); 
    }

    nextMovie(){
      this.playlistedVideo = 10 ;
      if (typeof(this.Options.playNext)=="undefined"){ this.Options.playNext = 0 ; }
      if (typeof(this.Options.playNext)!="undefined"){
        if ((this.Options.playNext==-1)){
          if (typeof(this.Options.pnf)=="function"){
            this.Options.pnf( this );
          }
        } else {
          this.videoNb++ ;
          if (this.videoNb>=this.Options.videos.length){
            if (this.Options.loop!=0) { 
              this.videoNb=0 ; 
            } else { 
              this.videoNb=this.Options.videos.length-1 ;
            }
          }
          this.Options.autoplay = this.Options.playNext ;
        }
      }
    }

    resetMovieToWait(){
      this.reportuserinitplay = false ;
      this.clearAfterPlay();
      this.setCurrentVideo();
      this.setMovieToPlay();
      this.UI.showPlayClick();
    }

    startNextMovie(){
      deb( "startNextMovie" , 3 );
      this.reportuserinitplay = false ;
      this.clearAfterPlay();
      this.nextMovie();
      this.setCurrentVideo();
      this.setMovieToPlay();
      if (this.ageWarning){this.Options.autoplay=AP_none;return;}
      if (this.Options.autoplay>0){this.startPlayer(this.Options.autoplay,0);}
      else{this.resetMovieToWait();}
    }

    startPrev(){
      this.clearAfterPlay();
      if (this.videoNb>0){ this.videoNb-- ;}
      this.setCurrentVideo();
      this.setMovieToPlay();
      if (this.ageWarning){
        this.Options.autoplay = AP_none ;
        return ;
      }
      this.startPlayer(0,0);
    }

    startNext(){
      this.clearAfterPlay();
      this.nextMovie();
      this.setCurrentVideo();
      this.setMovieToPlay();
      if (this.ageWarning){
        this.Options.autoplay = AP_none ;
        return ;
      }
      this.startPlayer(0,0);
    }

//  preloadAction = -1 ;
//  userActionPlay = AP_none ;
//  autoplayActionPlay = AP_autoplay ; 
//  autoplayScrollActionPlay = AP_autoplayscroll ;
//  autoplayIfAdActionPlay = AP_autoplayifad ;
//  autoplayIfAdScrollActionPlay = AP_autoplayifadscroll ;

    getCurrentAd(){
      try{return this.adsCtrl.currentAd;}catch(e){}
      return {};
    }

    showAdsPlayStatus(){
      deb( "total ads played:" + this.adsPlayed , 2 );
      deb( "adPod:"+ this.adPodIndex + "  ads in pod:" + this.adPodTotalAds + " curr ad in pod:" + this.adPodAdPos , 2 );
      deb( "played pre:" + this.currentVideo.playedPre , 2 );
      deb( "played mid total:" + this.currentVideo.playedMidTotal  + "  last/curr mid pod:"+ this.currentVideo.lastMidIndex + "   played mid in pod:"+this.currentVideo.playedMidCurr , 2 );
      deb( "played post:" + this.currentVideo.playedPost , 2 );
    }
    
    getBlockSize(pos){
      switch(pos){
        case 0 : return this.Options.maxPrerollAdsCount ;
        case -1 : return this.Options.maxPostrollAdsCount ;
        default :
          return this.Options.maxMidrollAdsCount ;
      }
    }

    adsCtrlCallback( v ){
      deb( "adsCtrlCallback:" + v , 1 );
      var queueAction = this.getQueueAction() || { action : preloadAction , podPos : this.adsCtrl.currentBlockPos || 0 } ;
      if (v==1){ imaloaded = 1 ; }
      if (v==2){  // no ads found
        this.adSearching=false;
        if (((queueAction.action!=preloadAction)||(this.adsCtrl.currentBlockPos>0)) && (ios==0)
             && this.Options.allowNonLinear && !this.adsCtrl.nonLinearRequest && (this.adsCtrl.currentBlockPos>=0)){
          this.adsCtrl.requestAds(true,true,true,true,true,this.adsCtrl.currentBlockPos,1);
        }else
        try{
          this.sendSignal( "ad_outstreamclose" , null );
          this.UI.setTitle( this.currentVideo.title , 1 , 0 );
          this.updateInterface( "movie" ); 
          if ((this.adsCtrl.currentBlockPos==0) && (queueAction.action!=userActionPlay) && !this.adNotPresentReported){
            this.adNotPresentReported = true ; 
            this.sendSignal( "ad_notpresent" , null );
          }
          if ( (queueAction.action==userActionPlay) ||
               (queueAction.action==autoplayActionPlay) || 
               ((queueAction.action==autoplayScrollActionPlay) && (this.playerVisible==1)) ){
            this.UI.showWaitClick();
            this.playerPlay();
            this.emptyActionsQueue();
          }else{
            if (this.Options.autoplay==AP_autoplayifad){ this.Options.autoplay = AP_autoplayifadscroll ; }
            this.UI.showPlayClick();
            this.deleteCompletedAction();
          }
        }catch(e){console.log(e);}
      }
      if (v==3){  // ads found
        this.adSearching=false;
        if (this.adsCtrl.currentBlockPos>0){
          for(var i=0;i<this.currentVideo.midsCues.length;i++){
            if (this.currentVideo.midsCues[i].mid==this.adsCtrl.currentBlockPos){
              this.currentVideo.midsCues[i].preloaded=true;
              if ((this.currentVideo.midsCues[i].startnow==true) && 
                  ((this.playerVisible==1) || (this.Options.pauseInvisibleAd!=1))){
                this.currentVideo.midsCues[i].played=true;
                this.currentVideo.midsCues[i].startnow=false;
                this.adsCtrl.startAds();
              }
            }
          }
        }
        else if (queueAction.action!=preloadAction){
          if ((this.playerVisible!=1) && ((this.Options.pauseInvisibleAd==1)||((this.Options.pauseInvisibleBeforeAds==1)&&(this.Options.mplr==0)))){}
          else{this.adsCtrl.startAds();}
        }else{
          if(queueAction==0){this.UI.showPlayClick()};
          this.deleteCompletedAction();
        }
      }
      if (v==4){  // ad started
        this.adSearching=false;
        this.adPlaying=true;
        this.wasAdBeforeMovie = 1 ;
        if (this.adsCtrl.currentBlockPos==0){
            deb( "starting PRE-ROLL ad" , 1 );
            this.currentVideo.playedPre++ ;
        } else
        if (this.adsCtrl.currentBlockPos==-1){
            deb( "starting POST-ROLL ad" , 1 );
            this.currentVideo.playedPost++ ;
        } else {
          deb( "starting MID-ROLL ad" , 1 );
          if (this.adsCtrl.currentBlockPos!=this.currentVideo.lastMidIndex){
            this.currentVideo.playedMidCurr=0 ;
            this.currentVideo.lastMidIndex = this.adsCtrl.blockPos ;
          }
          this.currentVideo.playedMidTotal++ ;
          this.currentVideo.playedMidCurr++ ;
        }
      }
      if ((v==5)||(v==6)){ // ads played, adpod not fully played
        this.sendSignal( "ad_outstreamclose" , null );
        this.UI.setTitle( this.currentVideo.title , 1 , 0 );
        this.adSearching=false;
        this.adPlaying=false;
        this.UI.allContainer.classList.remove("overlay");
        if (this.adsCtrl.currentBlockPos>0){
          this.updateInterface( "movie" );
          this.resumePlayer(pauseResumeAd);
          return;
        }
        if ( (queueAction.action==userActionPlay) ||
             (queueAction.action==autoplayActionPlay) || 
             (queueAction.action==autoplayIfAdActionPlay) || 
             (queueAction.action==autoplayScrollActionPlay) ||
             (queueAction.action==autoplayIfAdScrollActionPlay) ){
          this.updateInterface( "movie" );
          if(queueAction.podPos==0){this.currentVideo.completedAllPre=true;}
          if ((this.playerVisible!=1) && (this.Options.pauseInvisible==1)){}
          else{this.playerPlay();}
          this.emptyActionsQueue();
        }
      }
      if (v==7){ // content pause request
        this.playerWasStarted = !this.wrapperPaused();
        this.wrapperPause();
        this.updateInterface( "ima" );
      }
      if (v==71){ // nonlinear content pause request
        this.playerWasStarted = !this.wrapperPaused();
        this.wrapperPause();
        this.updateInterface( "ima" );
        this.UI.hidePlayClick();
      }
      if (v==8){ // content resume request
        this.updateInterface( "movie" );
        if (this.playerWasStarted){this.resumePlayer(pauseResumeAd);}
      }
      if (v==9){ // nonlinear ad shown
        this.adSearching=false;
        this.playbackStarted = true ;
        this.waitforinit = false;
        this.showAdsPlayStatus();
        this.UI.hidePlayClick();
        this.UI.setPPBPause();
        if (this.adsCtrl.currentBlockPos>0){
          this.updateInterface( "movie" );
          this.UI.allContainer.classList.add("overlay");
          this.adsCtrl.adContainerResized();
          this.playerPlay();
          this.UI.setPPBPause();
          this.UI.hidePlayClick();
          this.updateCues();
          this.resumedBy = pauseResumeAd;
          this.pausedBy=-1;
        }
      }
    }

    AIEvent( what , ad ){
      switch (what){
        case 'ad_start' :
          this.playbackStarted = true ;
          this.waitforinit = false;
          this.showAdsPlayStatus();
          this.UI.hidePlayClick();
          this.UI.setPPBPause();
          break ;
        case 'ad_75' :
          if ((this.currentVideo.playedPre>=this.Options.maxPrerollAdsCount) && (ios==0)){ this.videoPreload(); }
          break ;
        case 'ad_100' :
          this.showAdsPlayStatus();
          this.UI.ShowHidePreSkip( false , 0 );
          this.UI.ShowHideSkip( false );
          break ;
        case 'ad_paused' :
          this.adViewableTimer=this.adFullViewableTimer=this.mvViewableTimer=this.mvFullViewableTimer=this.adAViewableTimer=this.adRAudibleTimer=Date.now() ;
          this.UI.showPlayClick();
          this.UI.setPPBPlay();
          break ;
        case 'ad_resumed' :
          this.adViewableTimer=this.adFullViewableTimer=this.mvViewableTimer=this.mvFullViewableTimer=this.adAViewableTimer=this.adRAudibleTimer=Date.now() ;
          this.UI.hidePlayClick();
          this.UI.setPPBPause();
          break ;
        case 'ad_allcomplete' :
          this.showAdsPlayStatus();
          this.currentVideo.allAdsCompleted = true ;
//          if ((ios>0) && (!this.contentResumed || (this.videoPlayer.baseURI==this.videoPlayer.src))){this.playerSetSource(1);}
//          if (this.currentVideo.contentCompleted && (this.widgetControl!=1)){
//            this.startNextMovie();
//          }else{
//            this.updateInterface( "movie" );
//            if ((mobile>0) && !this.currentVideo.contentCompleted && !this.isPlaying() && this.userinitplay){ this.UI.setTitle("",1,0); this.videoPlayer.play(); }
//            if (this.isPlaying()){ this.UI.hidePlayClick(); } else { this.UI.showPlayClick();}
//          }
          break ;
        case 'ad_impression' : 
          this.waitforinit = false ; // no break 
        case 'ad_nonlinear' :
          this.waitforinit = false ; // no break 
          this.updateInterface( "ima" );
          this.UI.hidePlayClick();
          break ;
      }
    }

    startAdsSearch(action,podPos){
      // willautoplay = ((this.Options.autoplay>0)&&(!this.userinitplay)) true|false
      // willplaymuted = autoplayRequiresMuted && !this.userinitplay true | false 
      // currentlyMuted = ((this.playMuted==1) || (this.videoPlayer.muted) || (this.getVolume()==0))
      // currentlyAutoPlay = !this.reportuserinitplay
      if (action!=preloadAction){this.UI.showWaitClick();}
      this.sendSignal( 'pl_trystart' , this );
      this.adSearching = true ;
      if ((ios>0) && this.videoPlayer.webkitDisplayingFullscreen){ this.adsCtrlCallback( 2 ); }
      else{
        this.adsCtrl.requestAds(((action>0)&&(!this.userinitplay)),
                                autoplayRequiresMuted && !this.userinitplay,
                                (this.playMuted==1)||(this.videoPlayer.muted)||(this.getVolume()==0),
                                !this.reportuserinitplay,false,podPos,this.getBlockSize(podPos));
      }
    }

    searchAndPlayMidAfterSeek(ctm,vdr){
      if ((this.sourceset<32) && this.currentVideo.midsCues && (this.currentVideo.midsCues.length>0) &&
          (ctm+this.adsCtrl.defNonlinearDuration<vdr+10)){
        for( var i=0; i<this.currentVideo.midsCues.length ; i++ ){
          if (!this.currentVideo.midsCues[i].played && !this.currentVideo.midsCues[i].preload && 
             (this.currentVideo.midsCues[i].pos<ctm)){
              this.currentVideo.midsCues[i].preload = true ;
              this.currentVideo.midsCues[i].startnow = true ;
              this.startAdsSearch(preloadAction,this.currentVideo.midsCues[i].mid);
          }
        }
      }
    }

    startNAMovie( action , podPos=0 ){
      this.updateInterface( "movie" );
      this.sendSignal( 'pl_trystart' , this );
      this.sendSignal( "ad_videoexcluded" , null );
      var w = parseInt( this.UI.allContainer.offsetWidth ) ;
      if ( (((this.playerVisible!=1) && (this.Options.muteNVAutoplay)) || (this.Options.muteSMAutoplay>=w))
           && !this.playbackStarted && !this.userinitplay){ this.playMuted = 1 ; deb( "play muted 1" , 3 ); }
      this.UI.showWaitClick();
      this.playerPlay(); 
    }

    getQueueAction(){
      if (!this.actionsQueue || this.actionsQueue.length==0){return null;}
      var queueAction = this.actionsQueue[0];
      return queueAction;
    }

    addToActionsQueue(queueAction){
      var qa=this.getQueueAction();
      if (qa && (qa.action=queueAction.action) && (qa.podPos==queueAction.podPos)){return;}
      if (qa && (qa.action=preloadAction) && (qa.podPos==queueAction.podPos)){this.actionsQueue[0].action=queueAction.action;return;}
      this.actionsQueue.unshift(queueAction);
      var i=1;
      while(i<this.actionsQueue.length){
        if ((this.actionsQueue[i].action=queueAction.action) && (this.actionsQueue[i].podPos==queueAction.podPos)){
          this.actionsQueue.splice(i,1);
        }else{i++;}
      }
    }

    emptyActionsQueue(){
      this.actionsQueue=[];
    }

    deleteCompletedAction(){
      if (this.actionsQueue && (this.actionsQueue.length>0)){this.actionsQueue.shift();}
    }

    startFromQueue(){
      var queueAction = this.getQueueAction();
      if (queueAction){this.startPlayer(queueAction.action,queueAction.podPos);}
    }

    startPlayer( action , podPos=0 ){
      deb( "startplayer 1 action"+action , 1 );
      if (this.adPlaying){ return ; }
      var queueAction={action:action,podPos:podPos};
      this.addToActionsQueue(queueAction);
      if (this.adSearching){ return ; }
      if ((action!=userActionPlay)&&!(consentLoaded || this.consentTimeouted)){this.UI.showPlayClick();return;}
      if ((this.playlistedVideo!=0)&&(this.Options.playNextAT==1)&&!this.isActiveTab){this.checkATNP=true;return;}
      this.checkATNP=false;
      this.revertIdleSettings();
      this.consentWait=false;
      deb( "startplayer 2" , 1 );
      if (action==preloadAction){this.startAdsSearch(action,podPos);}
      if ((action==userActionPlay)||(action==autoplayActionPlay)||
          ((action==autoplayScrollActionPlay)&&(this.playerVisible==1))){
        deb( "startplayer 3" , 1 );
        deb( this.currentVideo , 1 );
        if(this.currentVideo.na!=1){this.startAdsSearch(action,podPos);}
        else{
          if ((this.currentVideo.vtype!=1) || (this.currentVideo.startdate<Date.now())){this.startNAMovie(action,podPos);}
          else{this.resetMovieToWait();}
        }
      }
      if ((action==autoplayIfAdActionPlay)||
          ((action==autoplayIfAdScrollActionPlay)&&(this.playerVisible==1))){
        if ((this.currentVideo.na==1)||((this.currentVideo.vtype==1)&&(this.currentVideo.startdate>Date.now()))){this.resetMovieToWait();}
        else{this.startAdsSearch(action,podPos);} 
      }
      if ( ((action==autoplayScrollActionPlay)||(action==autoplayIfAdScrollActionPlay)) && (this.playerVisible!=1) &&
           (this.currentVideo.na!=1) && ((this.currentVideo.vtype!=1) || (this.currentVideo.startdate<Date.now())) ){
        this.startPlayer(preloadAction,podPos);
      }
    }

    mainIntervalFunc(){
      if (this.consentWait){
        if ((consentLoaded && prebidDone)||((Date.now()-this.consentStart>100*consentTimeout)&&((this.Options.noAdsPreloadCMPUI!=1)||(consentUIShown!=1)))){ 
          this.consentWait=false;
          this.consentTimeouted = !consentLoaded;
          this.startFromQueue();
        }
      }
      if ((this.isActiveTab) && (this.Options.idleActivate>0) && (this.Options.autoplay==AP_autoplayifadscroll) && 
          (this.playerVisible!=1) && !this.isPlaying() && (this.currentVideo.na==0) && 
          (this.Options.idleActivate<=idleTime) && (this.Options.idleActivate<=tIdleTime) && this.waitforinit ){
        resetIdleTime();
        this.revertIdleActivate=1;
        this.Options.autoplay=AP_autoplayifad;
        this.startPlayer(this.Options.autoplay,0);
      }
      if (this.checkATNP && this.isActiveTab){this.startFromQueue();this.checkATNP=false;}
      if (!this.isPlaying() && (this.currentVideo.vtype==1) && (this.currentVideo.startdate<Date.now()) && 
          (this.currentVideo.startdate>this.currentVideo.vtype0SetTime) && (this.currentVideo.vtype0SetTime>0) &&
          ((this.playerVisible==1) || (this.Options.pauseInvisible!=1)) ){
        this.Options.autoplay = AP_autoplay ;
        this.currentVideo.vtype0SetTime = 0 ;
        this.startPlayer(this.Options.autoplay,0);
      }
      if (castLoaded && !this.remotePlayer){ this.initializeRemotePlayer(); }
      if ((this.isLive) && (this.liveCheck<Date.now()-10000)){
        this.liveCheck = Date.now();
        this.getLiveCnt();
        var d=document.getElementsByClassName("livecnt");
        var lcnt=this.currentVideo.liveCnt;
        try{for (var i=0;i<logos.length;i++){if ((logos[i].id==this.currentVideo.logo) && logos[i].defs){
          if (logos[i].defs.livecounter==0){lcnt = "" ;}
          if ((logos[i].defs.livecounter==3) || (logos[i].defs.livecounter==4)){lcnt = this.currentVideo.liveCntW ;}break ; }}}catch(e){}
        if (d){for(var i=0;i<d.length;i++){d[i].innerHTML=(lcnt>0?lcnt:"");}}
      }
    }

    revertIdleSettings(){
      if (this.revertIdleActivate==1){
        resetIdleTime();
        this.revertIdleActivate=0;
        this.Options.autoplay = AP_autoplayifadscroll ;
      }
    }


    sendSignal( what , ad ){
      switch (what){
        case 'movie_start' :
          this.currentVideo.signals.mstartsignaled=true ;
          this.currentVideo.movieStarted = true ;
          this.playbackStarted = true ;
          break ;        
        case 'movie_25' :
          this.currentVideo.signals.mfirstsignaled=true ;
          break ;
        case 'movie_50' :
          this.currentVideo.signals.mmidsignaled=true ;
          break ;
        case 'movie_75' :
          this.currentVideo.signals.mthirdsignaled=true ;
          break ;
        case 'movie_95' :
          this.currentVideo.signals.m95signaled=true ;
          break ;
        case 'movie_100' :
          this.currentVideo.signals.mcompletesignaled=true ;
          break ;
        case 'movie_fullscreen_on' :
          this.currentVideo.signals.fullscreensignaled=true ;
          break ;
        case 'movie_click' :
          break ;
      }
    if (typeof(this.Options.signalFunction)=="function"){ this.Options.signalFunction( what , this , ad ); }
  }


    autoplayChecksResolved(to){
      if (this.autoplayChecked){ return ;}
      timelistadd( "apchecks resolved" );
      this.autoplayChecked = true ;
      if (to==1){
        autoplayAllowed = false ;
        autoplayRequiresMuted = false ;
      }
      deb( "autoplay allowed:" + autoplayAllowed , 1 );
      deb( "autoplay required muted:" + autoplayRequiresMuted , 1 );
      if (!autoplayAllowed){ 
        deb( "setting autoplay to none - autoplay policy" , 1 ); 
        autoplayRequiresMuted = true ;
        if (this.Options.autoplay>0){ this.Options.autoplay = AP_autoplayifadscroll ; }
      }
      if (autoplayRequiresMuted){ 
        if ((this.Options.disableMutedAutoplay==1) && (!this.Options.muteAutoplay)){
          deb( "setting autoplay to none - autoplay policy and settings" , 1 );
          this.Options.autoplay = AP_none ;
        } else {
          if (this.Options.autoplay>0){ 
            this.playMuted = 1 ; 
            deb( "setting autoplay muted" , 1 );
          }
        }
      }
      this.setMovieToPlay();
      this.UI.startObserver();
      if(this.Options.autoplay>0){this.startPlayer(this.Options.autoplay,0);}else{
        if (this.currentVideo.na!=1){this.startAdsSearch(preloadAction,0);}
      }
    }

    setResolution( res ){
      if ((this.sourceset==16) && (this.hlsPlayer)){
        if (res==-1){
//          this.hlsPlayer.autoLevelEnabled = true ;         
          this.levelSwitching = true ;
          this.UI.setResolution( -1 , this.hlsPlayer.currentLevel );
          if (!this.isLive){ 
            this.hlsPlayer.currentLevel = -1 ; 
            this.hlsPlayer.nextLevel = -1 ;
            this.hlsPlayer.loadLevel = -1 ;
          }
        }else{
          if ((res>=0) && (res<this.hlsPlayer.levels.length)){
//            this.hlsPlayer.autoLevelEnabled = false ;
            this.UI.setResolution( res );
            if (!this.isLive){ 
              this.hlsPlayer.currentLevel = res ; 
              this.hlsPlayer.loadLevel = res ;
              this.hlsPlayer.nextLevel = res ;
              this.UI.showWaitClick();
            }else{
              this.hlsPlayer.nextLoadLevel = res ;
              this.hlsPlayer.config.autoLevelCapping = res ;
              this.hlsPlayer.autoLevelCapping = res ;
            }
            this.levelSwitching = true ;            
          }
        }
      }
      if (this.sourceset==1){
        if ((typeof(this.currentVideo.urls[ res ].url)=="string") && (this.currentVideo.urls[ res ].url!="")){          
          this.levelSwitchingVPaused = this.wrapperPaused();
          this.levelSwitchingUrl = this.currentVideo.urls[ res ].url;
          this.levelSwitchingRes = res;
          this.levelSwitchingTime = this.videoPlayer.currentTime ;     
	  this.levelSwitching = true ;
          if (this.levelSwitchingVPaused){            
	    this.videoPlayer.src = this.levelSwitchingUrl ;
            this.videoPlayer.load();	    
          } else {
            this.pausePlayer(pauseResumeScript);
          }
        }
      }
    }

    
    setVolumeM( iVol ){
      this.manualVol = 1 ;
      this.setVolume( iVol ); 
    }
    videoSeeked( e ){ 
      if (!e){ return ; }
      deb( "movie_seeked" , 3 );
      deb( this.wrapperGetCurrentTime() , 3 );
      if (this.wrapperPaused()){ this.UI.showPlayClick(); }else{ this.UI.hidePlayClick(); }
    }
    videoSeeking( e ){ 
      if (!e){ return ; }
      deb( "movie_seeking" , 3 );
      deb( this.wrapperGetCurrentTime() , 3 );
      this.sendSignal( "movie_seeking" , null );
      this.UI.showWaitClick();
    }
    videoWaiting( e ){ 
      if (!e){ return ; }
      this.sendSignal( "movie_buffering" , null );
      this.UI.showWaitClick();
    }
    videoPlaying( e ){ 
      if (!e){ return ; }
      this.sendSignal( "movie_playstart" , null );
      if (this.wasPaused){
        this.adViewableTimer=this.adFullViewableTimer=this.mvViewableTimer=this.mvFullViewableTimer=this.adAViewableTimer=this.adRAudibleTimer=Date.now() ;
        this.sendSignal( "movie_resumed" , null );
        this.wasPaused = false ;
      }
    }
    mute( iMute ){ // 0-unmute , 1-mute, -1-switch
      deb( "iMute:"+iMute , 1 );
      this.manualVol = 1 ;
      if (iMute==0){
        if (this.videoPlayer.muted || this.videoPlayer.defaultMuted || (this.getVolume()==0)){ this.sendSignal( "player_munmute" , null ); }
        this.playMuted = 0 ;
        this.videoPlayer.defaultMuted = false ;
        this.videoPlayer.muted = false ;
        if (mobile>0){ this.setVolume( 100 ); }else{ this.setVolume( this.muteVolume ); }
        if (this.isPlaying()){ this.UI.hidePlayClick(); }
      }
      if (iMute==-1){
        if (this.videoPlayer.muted || this.videoPlayer.defaultMuted || (this.getVolume()==0)){
          this.sendSignal( "player_munmute" , null );
          this.playMuted = 0 ;
          this.videoPlayer.defaultMuted = false ;
          this.videoPlayer.muted = false ;
          this.setVolume( this.muteVolume );
          if (this.isPlaying()){ this.UI.hidePlayClick(); }
        } else {
          this.sendSignal( "player_mmute" , null );
          this.playMuted = 0 ;
          this.videoPlayer.defaultMuted = false ;
          this.muteVolume = this.getVolume() ;
          if (this.muteVolume==0){this.muteVolume=this.Options.volume;}
          this.setVolume( 0 );
          this.videoPlayer.muted = true ;
          if (this.sourceset==256){try{this.ytplayer.setVolume(0);this.ytplayer.mute();}catch(e){}}
          if (this.isPlaying()){ this.UI.hidePlayClick(); }
        }
      }
      if (iMute==1){
        this.sendSignal( "player_mmute" , null );
        this.playMuted = 0 ;
        this.muteVolume = this.getVolume() ;
        if (this.muteVolume==0){this.muteVolume=this.Options.volume;}
        this.videoPlayer.defaultMuted = false ;
        this.setVolume( 0 );
        this.videoPlayer.muted = true ;
        if (this.sourceset==256){try{this.ytplayer.setVolume(0);this.ytplayer.mute();}catch(e){}}
        if (this.isPlaying()){ this.UI.hidePlayClick(); }
      }
    }


    setPlayerVisibility( pv ){
      if (pv=="pv"){
        var ppv = this.playerVisible ;
        this.playerVisible = 1 ;
        deb( "player visible "+ppv+" => 1" , 2 );
        if (this.remotePlayerConnected && this.remotePlayerLoadedMedia){ return ; }
        if (this.playerVisible!=ppv){
          if (this.pausedBy==pauseResumeVisibility){this.resumePlayer(pauseResumeVisibility);}
          else if (this.currentVideo.completedAllPre && !this.currentVideo.movieStarted){this.playerPlay();}
          else if (!this.isPlaying() && this.waitforinit && 
              ((this.Options.autoplay==AP_autoplayscroll) || (this.Options.autoplay==AP_autoplayifadscroll)) &&
              ((this.Options.DoNotAutoplayScrollIfOtherAdPlaying==false) || (AdsPlayingOnPageBOP==0))
             ){this.startPlayer(this.Options.autoplay,0)}
        }
      }
      if (pv=="pi"){
        var ppv = this.playerVisible ;
        this.playerVisible = 2 ; 
        deb( "player invisible "+ppv+" => 2" , 2 );
        if (this.remotePlayerConnected && this.remotePlayerLoadedMedia){ return ; }
        if ((this.Options.pauseInvisible==1) && this.isPlaying()){this.pausePlayer(pauseResumeVisibility);}
      }
    }

    resetAVTimers(){
    }

    setAdvancedVisibility( iIsActiveTab , iIsVisible , iHalfVisible , iFullVisible ){
      var vc = false ;
      if (iIsActiveTab!=this.isActiveTab){
        deb( "activeTabChange" , 3 );
        this.isActiveTab = iIsActiveTab ;
        this.adViewableTimer=this.adFullViewableTimer=this.mvViewableTimer=this.mvFullViewableTimer=this.adAViewableTimer=Date.now() ;
        vc = true ;
      }
      if (this.isVisible!=iIsVisible){
        this.isVisible = iIsVisible ;
        this.adViewableTimer=this.adFullViewableTimer=this.mvViewableTimer=this.mvFullViewableTimer=this.adAViewableTimer=Date.now() ;
        vc = true ;
      }
      if (this.halfVisible!=iHalfVisible){
        this.halfVisible = iHalfVisible ;
        this.adViewableTimer=this.adFullViewableTimer=this.mvViewableTimer=this.mvFullViewableTimer=this.adAViewableTimer=Date.now() ;
        vc = true ;
      }
      if (this.fullVisible!=iFullVisible){
        this.fullVisible = iFullVisible ;
        this.adFullViewableTimer = this.mvFullViewableTimer = Date.now() ;
        vc = true ;
      }
      if (vc){ this.sendSignal( "player_visibilitychange" , null ); }
      this.checkADMVVisibilitySend();
    }
    
    checkADMVVisibilitySend(){
      if (this.isPlaying() && this.isActiveTab && this.halfVisible){
        if (this.adsCtrl.isPlayingAdNotPaused() && (this.currentVideo.adVisibleSend==0)){
          this.currentVideo.adVisibleSend = 1 ;
          this.sendSignal( "ad_visibleu" , null ); 
        }
        if (!this.adsCtrl.isPlayingAd() && (this.currentVideo.mvVisibleSend==0)){
          this.currentVideo.mvVisibleSend = 1 ;
          this.sendSignal( "mv_visibleu" , null ); 
        }
      }
    }

    videoPlayerReadyStateChange(e){
      deb( "readystatechange" + this.videoPlayer.readyState + "  " + this.videoPlayer.networkState , 4 );
    }

    fullscreenSwitch(){
      try{
      if (ios==0){
        if (document.fullscreenElement&&(document.fullscreenElement==this.UI.allContainer)){ 
          document.exitFullscreen(); 
        } else {
          this.UI.allContainer.requestFullscreen();
        }
      }else{
        if (this.videoPlayer.webkitDisplayingFullscreen){
          this.videoPlayer.webkitExitFullscreen();
        } else {
          if (this.videoPlayer.webkitSupportsFullscreen){ this.videoPlayer.webkitEnterFullscreen(); }
        }
      }
      }catch(e){ console.log( e ); }
    }
    fullScreenEvent(){
      this.videoResized();
      if (((ios==0) && (document.fullscreenElement==this.UI.allContainer)) || 
          ((ios>0) && (this.videoPlayer.webkitDisplayingFullscreen))){
        if (this.currPlayer=="movie"){ this.sendSignal( "movie_fullscreen_on" , null ); }
        if (this.currPlayer=="imasdk"){ this.sendSignal( "ad_fullscreen_on" , null ); }
        this.UI.setFullscreen( true );
      } else { 
        if (this.currPlayer=="movie"){ this.sendSignal( "movie_fullscreen_off" , null ); }
        if (this.currPlayer=="imasdk"){ this.sendSignal( "ad_fullscreen_off" , null ); }
        this.UI.setFullscreen( false );
        if (ios>0){ this.resumePlayer(pauseResumeScript); }
      }
    }

    videoResized(){
      this.UI.checkPosterSize();
      try{if(this.adsCtrl.isPlayingAd()){this.adsCtrl.adContainerResized();}}catch(e){}
      if (this.contentInitialized){ this.UI.checkVideoSize(); }
      if (this.hlsPlayer){ this.hlsPlayerLevelSwitched(0,0); }
    }

    playerMetaData(e){
      deb( "playerMetaData" , 3 );      
      if (!this.handleEvents){ return false ; }
      this.UI.checkVideoSize();
      if (this.levelSwitching){ return ; }
      this.contentInitialized = true;
      if ((this.sourceset==1) && (this.currentVideo.urls.length>1)){
        var lvls = new Array() ;
        for( var i=0; i<this.currentVideo.urls.length; i++ ){
          var nl = { rname : this.currentVideo.urls[i].name , rlevel : i };
          if (i==0){ nl.rcurr = 1 ; }
          lvls.push( nl );
        }
        this.UI.setResolutions( lvls );
        this.UI.setResolution( 0 );
      }
      this.updateCues();
    }

    playerData(){
      deb( "playerData" , 3 );
      if (!this.handleEvents){ return false ; }
      this.currentVideo.preloaded = 1 ;
      this.UI.checkVideoSize();
      if (this.levelSwitching){
        if (this.sourceset==1){
          this.videoPlayer.currentTime = this.levelSwitchingTime ;
          this.UI.setResolution( this.levelSwitchingRes );
          if (!this.levelSwitchingVPaused){ this.resumePlayer(pauseResumeScript); } else { this.UI.showPlayClick(); }
          this.levelSwitching = false ;
        }
      }
      if (this.toSeek>0){
        var tts = this.toSeek ;
        this.toSeek = 0 ;
        this.seek( tts );
      }
    }

    playerPaused(){  
      deb( "player paused" , 2 );
      if (!this.handleEvents){ return false ; }
      if (!this.levelSwitching){
        this.UI.showPlayClick();
        this.UI.setPPBPlay();
        if (this.wrapperGetCurrentTime()>0){ 
          this.wasPaused = true ;
          this.sendSignal( "movie_paused" , null );
          this.adViewableTimer=this.adFullViewableTimer=this.mvViewableTimer=this.mvFullViewableTimer=this.adAViewableTimer=this.adRAudibleTimer=Date.now() ;
        }
      }else{
        if (this.sourceset==1){
          if (this.levelSwitchingUrl!=""){
            this.videoPlayer.src = this.levelSwitchingUrl ;
            this.videoPlayer.load();
          }
        }
      }
    }

    playerError(e){  
      deb( "MPlayerError" , 2 );
      deb( e , 2 );
      if (!this.handleEvents){ return false ; }
      if (this.hlsPlayer && (this.hlsRecoverCount<3)){
        this.hlsRecoverCount++ ;
        this.hlsPlayer.recoverMediaError(); 
        this.resumePlayer(pauseResumeScript);
      }else{
        this.UI.setPPBPlay();
        this.sendSignal( "movie_error" , null );
      }
    }

    pausePlayer(cause=0){
      deb( "PausePlayer" , 1 );
      if ((cause==pauseResumeVisibility) && (this.playerVisible==1)){ return ; }
      if (this.currPlayer=="imasdk"){
        if (this.adsCtrl.isPlayingAdNotPaused()){
          try{
            this.adsCtrl.pauseAds(cause);
            this.UI.showPlayClick(); 
            this.UI.setPPBPlay();
            this.pausedBy = cause;
            this.resumedBy = -1;
          }catch(e){}
        }
        return ; 
      }
      if (this.currPlayer=="movie"){
        if (((cause==pauseResumeVisibility)||(cause==pauseResumeClick)) && (this.isLive)){ return ; }
        try{
          if (this.pausedBy>-100){
            this.wrapperPause();
            this.UI.setPPBPlay();
            this.UI.showPlayClick();
            this.pausedBy = cause ;
            this.resumedBy = -1;
          }
        }catch(e){}
      }
    }

    resumePlayer(cause=0){
      deb( "resumePlayer" , 3 );
      if ((cause==pauseResumeVisibility) && (this.playerVisible!=1)){ return ; }
      if (this.currPlayer=="imasdk"){
        try{
          this.adsCtrl.resumeAds(cause);
          this.UI.setPPBPause();
          this.UI.hidePlayClick(); 
          this.updateCues();
          this.resumedBy = cause;
          this.pausedBy = -1;
        }catch(e){}
        return ; 
      }
      if (this.currPlayer=="movie"){
        this.playerPlay(); // start odtwarzania
        this.UI.setPPBPause();
        this.UI.hidePlayClick();
        this.updateCues();
        this.resumedBy = cause;
        this.pausedBy=-1;
      }
    }

    videoPreload(){
      deb( "videoPreload videoPlayer.src:"+this.videoPlayer.src , 2 );
      deb( "vP attaching:"+this.attaching , 1 );
      if (this.currentVideo.preloaded!=0){ return ; }
      if (this.sourceset==16){ // hls player 
        try{
          if (this.hlsPlayer.media!=this.videoPlayer){ 
            deb( "starting hls - attaching video and media" , 3 );
            this.preloading = 1 ;
            this.hlsPlayer.attachMedia( this.videoPlayer );
          }else{
            this.preloading = 1 ;
            playerHlsMediaAttached();
          }
        }catch(e){}
      }
      if (this.sourceset==1){ // video element 
        try{
          this.videoPlayer.load();
          this.currentVideo.preloaded = 1 ;
        }catch(e){}
      }
    }

    playerHlsManifestLoaded(e,data){
      if (this.currentVideo.preloaded==0){this.hlsPlayerManifestParsed(e,data);}
      if (this.preloading){
        this.preloading = 0 ;
        if (ios>0){ try{ this.videoPlayer.load(); }catch(e){} }
        this.currentVideo.preloaded = 1 ;
      }else{
        if (!this.currentVideo.movieStarted){
          this.hlsPlayer.subtitleDisplay = false ;
          this.setVolume( this.Options.volume ); 
        }
        deb( "starting hls - play" , 3 );
        deb( "muted:"+this.videoPlayer.muted+"  defaultMuted:"+this.videoPlayer.defaultMuted+"  volume:"+this.videoPlayer.volume , 3 );      
        this.videoPlayer.play().catch( (e)=>{  
          deb( "playerPlay error" , 3 );
          if (!this.currentVideo.movieStarted){
            if (this.currPlayer!="imasdk"){ this.playMuted = 1 ; deb( "play muted 5" , 3 ); }
            this.setVolume( this.Options.volume ); 
          }
          this.videoPlayer.play().catch( (e)=>{ 
            this.UI.showPlayClick(); 
            this.promiseFailure = true ; 
          } );
        } );
      }
    }

    playerHlsMediaAttached(){
      deb( "pHMA attaching:"+this.attaching , 1 );
      this.attaching=2;
      if (this.currentVideo.preloaded==0){this.hlsPlayer.loadSource( this.currentVideo.url );}
      else{this.playerHlsManifestLoaded(0,0);}
    }

    playerPlay(){
      deb( "playerPlay   current sourceset: "+this.sourceset , 2 );
      deb( "current source:"+this.videoPlayer.src , 2 );
      deb( "pP attaching:"+this.attaching , 1 );
      if ((this.currentVideo.vtype==1) && (this.currentVideo.startdate>Date.now())){ this.pausePlayer(pauseResumeScript); return ; }
//      this.setVolume( this.Options.volume ); 
      if (this.remotePlayerConnected && this.remotePlayerLoadedMedia){
        try{if (this.remotePlayer.isPaused){ this.remotePlayerController.playOrPause();}}catch(e){}
        return ; 
      }
      if ((this.sourceset==1) || (this.sourceset==2)){
        deb( "starting native" , 2 );
        this.videoPlayer.play().catch( (e)=>{ 
          deb( "videoPlayer.Play catch" , 3 );
          deb( e , 3 );
          if (e.name==="NotAllowedError"){
            this.playMuted = 1 ; 
            this.setVolume( this.Options.volume ); 
            deb( "play muted 6" , 3 );
          }
          this.videoPlayer.play().catch( (e)=>{ 
            deb( "videoPlayer.Play drugi catch" , 3 );
            deb( e , 3 );
            this.UI.hidePlayClick();
            this.UI.showPlayClick();
            this.promiseFailure = true ; 
          } );
        } );
      } else
      if ((this.sourceset==8) && (this.dashPlayer)){
        if (!this.dashPlayer.isReady()){ this.dashPlayer.attachView( this.videoPlayer ); }
        this.dashPlayer.play();      
      } else
      if ((this.sourceset==16) && (this.hlsPlayer)){
        deb( "starting hls" , 2 );
        this.preloading=0;
        if (this.hlsPlayer.media!=this.videoPlayer){ 
          deb( "starting hls - attaching video and media" , 3 );
          this.hlsPlayer.attachMedia( this.videoPlayer );
        }else{
          this.playerHlsMediaAttached();
        }
      } else
      if (this.sourceset==128){
        deb( "starting external" , 2 );
        if (typeof(this.Options.extsrcfunc)=="function"){
          try{
          this.Options.extsrcfunc( this.currentVideo.url , this.currentVideo.movielink , this.currentVideo.button );
          }catch(e){ console.log( e ); }
        }
      }
      if (this.sourceset==256){
        console.log( "starting 256" );
        if (this.ytplayer){
          try{
            this.ytstartinterval = setInterval( 
              (e)=>{ try{this.ytplayer.playVideo();clearInterval(this.ytstartinterval);}catch(e){} } , 100 );
          }catch(e){}
        }
      }
    }

    manageStartPoint(){
      if (!this.currentVideo.movieStarted && (this.currentVideo.startPoint>0) && 
          (this.currentVideo.endPoint>this.currentVideo.startPoint) && 
          (this.currentVideo.endPoint<=this.wrapperDuration())){
        this.seekv(this.currentVideo.startPoint);
      }
    }
    manageEndPoint(){    
      if (this.currentVideo.movieStarted && (this.currentVideo.startPoint>0) && 
          (this.currentVideo.endPoint>this.currentVideo.startPoint) && 
          (this.currentVideo.endPoint<this.wrapperDuration()) && 
          (this.currentVideo.endPoint<=this.wrapperGetCurrentTime())){
        deb( "manageEndPoint:"+this.wrapperDuration() , 3 );
        if (this.sourceset==256){if(this.ytplayer){try{this.ytplayer.seekTo(this.wrapperDuration());}catch(e){}}}
        else{this.videoPlayer.currentTime = this.wrapperDuration();}
      }
    }
    playerPlayStart(){  
      deb( "playerPlayStart" , 3 );
      if (this.Options.allowMPoster>0){
        this.UI.allContainer.classList.remove( "mposter" );
        this.UI.mposter.pause(); 
      }
      if (!this.handleEvents){ return false ; }
      if ((this.hlsErrorTime*1>0) && (this.hlsPlayer)){
        var k = this.hlsErrorTime ;
        this.hlsErrorTime = 0 ;
//        this.videoPlayer.currentTime = k ;
      }
      this.manageStartPoint();
      this.hlsRecoverCount = 0 ;
      this.UI.setPPBPause();
      if ((this.playMuted==1)||(this.getVolume()==0)){ this.UI.showUnmuteClick(); } else { this.UI.hidePlayClick(); }      
      this.sendSignal( "movie_playstart" , null );
      this.updateCues();
    }

    playerEnded(e){
      deb( "playerEnded" , 2 );
      deb( e , 2 );
      if (!this.handleEvents){ return false ; }
      if (this.adsCtrl.isPlayingAd()){ return false; }
      if ((this.currentVideo.signals.mcompletesignaled==false) && 
          (this.currentVideo.signals.mstartsignaled==true)){ this.sendSignal( "movie_100" , null ); }
      if ((this.wrapperDuration()>0) && (this.wrapperDuration()<this.Options.loopShorter) && 
          (this.currentVideo.totalPlayTime+this.wrapperDuration()<this.Options.loopShorter) && 
          (this.currentVideo.endPoint==0) && (this.currentVideo.startPoint==0)){
        this.currentVideo.totalPlayTime = this.currentVideo.totalPlayTime + this.wrapperDuration() ;
        this.seek( 0 );
        this.videoPlayer.play();
        return ;
      }
      this.currentVideo.totalPlayTime = 0 ;
      this.currentVideo.contentCompleted = true ;
      if (this.widgetControl!=1){this.startNextMovie();}
    }

    isPlaying(){
      return this.adsCtrl.isPlayingAdNotPaused() || (this.videoPlayer && !this.wrapperPaused()) ;
    }

    updateInterface(toPlayer){
      deb( "updateInterface:"+toPlayer , 3 );
      this.updateCues();      
      if (toPlayer==""){
      }
      if (toPlayer=="ima"){
        this.UI.setMode( "ima" );
        this.wrapperPause();
        this.UI.showWaitClick();
        this.currPlayer = "imasdk" ;        
      }
      if (toPlayer=="movie"){
        this.UI.setMode( "movie" );
        this.UI.checkPosterSize();
        this.currPlayer = "movie" ;
        this.UI.showExframe( this.currentVideo.exframe , this.sourceset ); 
        this.playerTexts();
      }
    }

    playerTimeUpdate(){
//    deb( "MPlayerTimeUpdate" );
      if (this.adsCtrl.isPlayingAd()){ this.UI.clearPoster; }
      if (!this.wrapperPaused()){
        if (mobile>0){ this.UI.clearPoster; }
        this.UI.ShowHidePreSkip( false , 0 );
        this.UI.ShowHideSkip( false );
        if (((this.playMuted==1)||(this.getVolume()==0)) && (!this.adsCtrl.isPlayingAd())){ this.UI.showUnmuteClick(); } else { this.UI.hidePlayClick(); }
        if (this.sourceset==256){
          var v = this.getVolume();
          if (v==0){ this.UI.showUnmuteClick(); } else { this.UI.hidePlayClick(); this.setVolume(v); }
        }
        if (this.remotePlayerConnected && this.remotePlayerLoadedMedia){ this.UI.showPauseClick(); }
      }
      this.checkADMVVisibilitySend();
      if (typeof(this.videoPlayer)=="object"){
        this.setLinkButton();
        var vdr = this.wrapperDuration() ;
        var ctm = this.wrapperGetCurrentTime() ;        
        this.manageStartPoint();
        if (!this.adsCtrl.isPlayingAd() && (this.currentVideo.signals.mstartsignaled==false) && ((ctm>0) || ((ctm>=0) && (vdr>0) && (vdr<1)) )){
          if ((this.currentVideo.vtype==1) && (this.currentVideo.vtype0SetTime>0) && 
              (this.currentVideo.vtype0SetTime>this.currentVideo.startdate) &&
              (this.currentVideo.startdate+1000*vdr>Date.now()) )  {
            var ts = (Date.now()-this.currentVideo.startdate)/1000 ;
            this.currentVideo.vtype0SetTime = 0 ;
            clearInterval( this.vtype0interval );
            if ((this.sourceset<32) && this.currentVideo.midsCues && (this.currentVideo.midsCues.length>0)){
              for(var i=0;i<this.currentVideo.midsCues.length;i++){
                if (this.currentVideo.midsCues[i].pos<ts){this.currentVideo.midsCues[i].played=true;}
              }
            }
            if (ts<vdr){try{this.seekv(ts);}catch(e){}}
          }
          this.mvViewableTimer = this.mvFullViewableTimer = Date.now() ;
          this.sendSignal( "movie_start" , null );
          this.waitforinit = false ;
        }
        if (!this.adsCtrl.isPlayingAd() && !this.mvViewableSend && (this.mvViewableTimer>0) && (Date.now()-this.mvViewableTimer>2000) && (this.currentVideo.signals.mstartsignaled==true)){
          if (this.halfVisible && this.isActiveTab){
            this.mvViewableSend = 1 ;
            if (this.isVisible==true){
              this.sendSignal( 'mv_qviewable' , null );
              deb( "movie viewable and visible" , 1 );
            }else{
              this.sendSignal( 'mv_zviewable' , null );
              deb( "movie viewable but not visible" , 1 );
            }
          }
        }
        if (!this.adsCtrl.isPlayingAd() && (this.currentVideo.signals.mfirstsignaled==false) && (this.currentVideo.signals.mstartsignaled==true) && (ctm>=Math.round(vdr/4))){
          this.sendSignal( "movie_25" , null );
        }
        if (!this.adsCtrl.isPlayingAd() && (this.currentVideo.signals.mmidsignaled==false) && (this.currentVideo.signals.mfirstsignaled==true) && (ctm>=Math.round(vdr/2))){
          this.sendSignal( "movie_50" , null );
        }
        if (!this.adsCtrl.isPlayingAd() && (this.currentVideo.signals.mthirdsignaled==false) && (this.currentVideo.signals.mmidsignaled==true) && (ctm>=Math.round(3*vdr/4))){
          this.sendSignal( "movie_75" , null );
        }
        if (!this.adsCtrl.isPlayingAd() && (this.currentVideo.signals.m95signaled==false) && (this.currentVideo.signals.mthirdsignaled==true) && (ctm>=Math.round(0.95*vdr))){
          this.sendSignal( "movie_95" , null );
        }
        if (this.videoPlayer.buffered.length>0){ var btr = this.videoPlayer.buffered.end(0); } else { var btr = 0 ; }
        if (vdr>0){
          var buf = 100 * btr / vdr ;
          if (buf>100) { buf = 100 ; }
          if (this.UI.bufferedbar) { this.UI.bufferedbar.style.width = buf+"%" ; }
        }else{ buf = 0 ; }
        if (this.UI.bufferedbar) { this.UI.bufferedbar.style.width = buf+"%" ; }
        if (vdr>0){
          this.sendSignal( "movie_progress" , null );
          var pla = 100 * ctm / vdr ;
          if (pla>100) { pla = 100 ; }
          this.UI.setPlayedBar( pla );
        }else{ pla = 0 ; }
        this.UI.setPlayedBar( pla );
        if (this.UI.playtime){
          if (vdr=="Infinity"){ this.UI.setPlaytime( " " ); } else { this.UI.setPlaytime( sec2MS(ctm)+" / "+sec2MS(vdr) ); }
          if (!this.adsCtrl.isPlayingAd()){ this.UI.setTitle( this.currentVideo.title , 1 , 0 ); } 
        }
        if((this.UI.currInter) && !isNaN(ctm)){ try{this.UI.currInter.timeUpdate( ctm );}catch(e){} }
        if (!this.adsCtrl.isPlayingAd()) { this.manageEndPoint(); }
        if ((this.sourceset<32) && this.currentVideo.midsCues && (this.currentVideo.midsCues.length>0) && 
            !((this.remotePlayerConnected && this.remotePlayerLoadedMedia)) ){
          for( var i=0; i<this.currentVideo.midsCues.length ; i++ ){
            if (!this.currentVideo.midsCues[i].played && !this.currentVideo.midsCues[i].preload && 
                (this.currentVideo.midsCues[i].pos>ctm) && (this.currentVideo.midsCues[i].pos-10<ctm) ){
              this.currentVideo.midsCues[i].preload = true ;
              this.startAdsSearch(preloadAction,this.currentVideo.midsCues[i].mid);
            }
          }
          for( var i=0; i<this.currentVideo.midsCues.length ; i++ ){
            if (!this.currentVideo.midsCues[i].played && this.currentVideo.midsCues[i].preloaded && 
                (this.currentVideo.midsCues[i].pos<ctm)){
              this.currentVideo.midsCues[i].played = true ;
              if ((this.playerVisible==1) || (this.Options.pauseInvisibleAd!=1)){this.adsCtrl.startAds();}
            }
          }
        }
      }
    }

    clickEvent( e ){
      deb( "clickevent" , 1 );
      if ((this.currPlayer=="imasdk") || (e && e.target && this.UI.lcont.contains( e.target ))){
        if (this.Options.adNotUnmuteOnClick==0){ this.playMuted = 0 ; }
        if (this.Options.adNotUnmuteOnSkip==0){ this.playMuted = 0 ; }
        this.UI.hideSimframe();
        if (this.adsCtrl.isPlayingAdPaused()){
          deb( "clickEvent ima resume" , 3 );
          this.resumePlayer(pauseResumeClick);
        }else if (this.adsCtrl.isPlayingAdNotPaused()){
          deb( "clickEvent ima pause" , 3 );
          if (e.target.classList && e.target.classList.contains('button-pause')){
            this.pausePlayer(pauseResumeClick);
          }else{
            this.pausePlayer(pauseResumeRedirect);
          }
        }
        return 0;
      }else{ this.playMuted = 0 ; }
      if ((this.currPlayer=="movie") && (!e || !e.target || !this.UI.lcont.contains( e.target ))){
        if (this.ageWarningDelayed){
          this.UI.setAgeWarning();
          this.ageWarning = true ;
          this.ageWarningDelayed = false ;
          return ;
        }
        if (this.adsCtrl.isPlayingAd()) return true ;
        this.userinitplay = true ;
        this.reportuserinitplay = true ;
        if (this.waitforinit){
          this.UI.hideSimframe();
          this.UI.showWaitClick();
          this.waitforinit = false ;
          this.promiseFailure = false ;
          this.setVolume( this.Options.volume );
          this.startPlayer( userActionPlay , 0 );
        } else {
          this.UI.hideSimframe();
          if (this.wrapperPaused()){
            this.setVolume( this.Options.volume );
            this.resumePlayer(pauseResumeClick);
            if (this.currentVideo.movieStarted && this.currentVideo.pausedByClick){
              this.currentVideo.pausedByClick=false ;
              this.sendSignal( 'movie_resumedr' , null );
            }
          } else {
            this.pausePlayer(pauseResumeClick);
            this.sendSignal( 'movie_stopped' , null );
            this.sendSignal( 'movie_pausedr' , null );
            this.currentVideo.pausedByClick = true ;
            var targ = evtTarget(e);            
            if ((targ==this.videoPlayer) && (this.currentVideo.movielink.trim().length>11)){
              window.open( this.currentVideo.movielink , "_BLANK" );
              this.sendSignal( "movie_click" , null );
            }
          }
        }
      }

    }

    updateCues(){
      try{
        this.UI.cleanCues();
        if (this.currentVideo.midsCues && (this.currentVideo.midsCues.length>0)){
          for( var i=0; i<this.currentVideo.midsCues.length ; i++ ){
            if (!this.currentVideo.midsCues[i].played){this.UI.addCue( this.currentVideo.midsCues[i].pos );}
          }
        }
      }catch(e){ this.UI.cleanCues(); }
      try{
        if (this.UI.currInter){
          var icues = this.UI.currInter.getCues();
          if (icues && icues.length){
            for(var i=0;i<icues.length;i++){ this.UI.addLongCue( icues[i].ts , icues[i].dur ); }
          }
        }
      }catch(e){ console.log( e ); }
    }


    hlsPlayerManifestParsed( e , data ){
      this.levelSwitching = false ;
      if (this.currentVideo.exsource*1==1){ return ; }
      if (this.currentVideo.audio==1){ this.hlsPlayer.loadLevel=0; this.hlsPlayer.currentLevel=0; return ; }
      var lvls = new Array() ;
      var nl = { rname : "AUTO" , rlevel : '-1' };
      if (this.hlsPlayer.autoLevelEnabled){ nl.rcurr = 1 ; } 
      lvls.push( nl );
      var levelname = "" ;
      if (this.hlsPlayer.levels){
        this.hlsPlayer.currentLevel = Math.min( this.hlsPlayer.currentLevel , this.hlsPlayer.levels.length-1 );
        this.hlsPlayer.startLevel = Math.min( this.hlsPlayer.startLevel , this.hlsPlayer.levels.length-1 );
        this.hlsPlayer.nextAutoLevel = Math.min( this.hlsPlayer.nextAutoLevel , this.hlsPlayer.levels.length-1 );
        this.hlsPlayer.nextLevel = Math.min( this.hlsPlayer.nextLevel , this.hlsPlayer.levels.length-1 );
        this.hlsPlayer.nextLoadLevel = Math.min( this.hlsPlayer.nextLoadLevel , this.hlsPlayer.levels.length-1 );
        this.hlsPlayer.autoLevelCapping = Math.min( this.hlsPlayer.autoLevelCapping , this.hlsPlayer.levels.length-1 );
//        if (this.hlsPlayer.currentLevel>this.hlsPlayer.levels.length-1){ this.hlsPlayer.currentLevel=this.hlsPlayer.levels.length-1 ; }
        for( var i=0; i<this.hlsPlayer.levels.length; i++ ){
          if (typeof(this.hlsPlayer.levels[ i ].name)!="undefined"){
            levelname = this.hlsPlayer.levels[ i ].name ; }
          else if (typeof(this.hlsPlayer.levels[ i ].height)!="undefined"){
            levelname = " "+this.hlsPlayer.levels[ i ].height ; }
          else {
            levelname = Math.round(this.hlsPlayer.levels[ i ].bitrate/1024)+"kbs" ; }
          if (levelname==""){ levelname = "UNK" ; }
          var nl = { rname : levelname , rlevel : i };
          if ((!this.hlsPlayer.autoLevelEnabled) && (this.hlsPlayer.currentLevel==i)){ nl.rcurr = 1 ; }
          lvls.push( nl );
        }
      }else{
        this.hlsPlayer.currentLevel = Math.min( this.hlsPlayer.currentLevel , 0 );
        this.hlsPlayer.startLevel = Math.min( this.hlsPlayer.startLevel , 0 );
        this.hlsPlayer.nextAutoLevel = Math.min( this.hlsPlayer.nextAutoLevel , 0 );
        this.hlsPlayer.nextLevel = Math.min( this.hlsPlayer.nextLevel , 0 );
        this.hlsPlayer.nextLoadLevel = Math.min( this.hlsPlayer.nextLoadLevel , 0 );
        this.hlsPlayer.autoLevelCapping = Math.min( this.hlsPlayer.autoLevelCapping , 0 );
      }
      this.UI.setResolutions( lvls );
      if (this.hlsPlayer.autoLevelEnabled){ this.UI.setResolution( -1 , this.hlsPlayer.currentLevel ); } else { this.UI.setResolution( this.hlsPlayer.currentLevel ); }
    }

    hlsPlayerLevelSwitched( e , data ){  
      this.levelSwitching = false ;
      if (this.currentVideo.exsource*1==1){ return ; }
      if (this.hlsPlayer.autoLevelEnabled){ this.UI.setResolution( -1 , this.hlsPlayer.currentLevel ); } else { this.UI.setResolution( this.hlsPlayer.currentLevel ); }
    }

    setSubtitle( res ){
       if (res==-1){
         this.Options.startWithSubtitles=0 ;
         try{ if (this.hlsPlayer){ this.hlsPlayer.subtitleDisplay = false ; } }catch(e){}
         if (this.videoPlayer.textTracks){ for( var i=0; i<this.videoPlayer.textTracks.length; i++ ){ this.videoPlayer.textTracks[i].mode="hidden" ; } }
       }else{
         try{ if (this.hlsPlayer){ this.hlsPlayer.subtitleDisplay = true ; } }catch(e){}
         if (this.videoPlayer.textTracks){
           for( var i=0; i<this.videoPlayer.textTracks.length; i++ ){
             if (i==res*1){
               this.videoPlayer.textTracks[i].mode="showing" ;
             }else{
               this.videoPlayer.textTracks[i].mode="hidden" ;
             }
           }
         }
       }
    }

    playerCurrCue( e ){
      if (e && e.target && e.target.activeCues){
        var sc = document.getElementById( "subtitles-container" );
        if (sc){
          sc.style.display = "block" ; 
          sc.innerHTML = "" ;
          for( var i=0; i<e.target.activeCues.length;i++){
            var ns = document.createElement( "DIV" );
            ns.appendChild( e.target.activeCues[i].getCueAsHTML() );
            sc.appendChild( ns );
          }
        }
      }
    }

    playerTexts(e){
      if ((this.videoPlayer.textTracks) && (this.videoPlayer.textTracks.length>0) && (ios==0)){
        var soff = true ;
        var curr = -1 ;
        for( var i=0; i<this.videoPlayer.textTracks.length; i++ ){ if (this.videoPlayer.textTracks[i].mode=="showing"){ soff=false; break ; } }
        var lvls = new Array() ;
        var nl = { sname : "OFF" , slevel : '-1' } ;
        if (soff){ nl.scurr = 1 ; } 
        lvls.push( nl );
        for( var i=0; i<this.videoPlayer.textTracks.length; i++ ){
          this.videoPlayer.textTracks[i].removeEventListener( "cuechange" , currCue );
          this.videoPlayer.textTracks[i].addEventListener( "cuechange" , currCue );
          var nl = { sname : this.videoPlayer.textTracks[i].label , slevel : i } ;
          if (this.videoPlayer.textTracks[i].mode=="showing"){ nl.scurr = 1 ; curr = i ; }
          lvls.push( nl );          
        }
        if (this.currPlayer!="imasdk"){ this.UI.subswitch.style.display = "" ; }
        if ((this.Options.startWithSubtitles) && (curr==-1) && (lvls.length>1)){ curr = 0 ; }
        this.UI.setSubtitles( lvls );
        this.UI.setSubtitle( curr );
        if ((this.Options.startWithSubtitles) && (curr!=-1) && (lvls.length>1)){ this.setSubtitle( curr ); }
      }else{
        this.UI.subswitch.style.display = "none" ;
      }
    }
}

  var asperf = false ;
  var amperf = false ;

  function checkAutoplaySupport(UIPlayer) {
    tplayer.muted = false ;
    tplayer.defaultMuted = false ;
    tplayer.volume = 1 ;
    var playPromise = tplayer.play();
    if (playPromise !== undefined) {
      playPromise.then(()=>{ onAutoplayWithSoundSuccess(UIPlayer); } ).catch( error=>{ onAutoplayWithSoundFail(UIPlayer); } );
    }else{
      UIPlayer.autoplayChecksResolved(1);
    }
  }

  function onAutoplayWithSoundSuccess(UIPlayer) {
    tplayer.pause();
    asperf = true ;
    autoplayAllowed = true;
    autoplayRequiresMuted = false;
    UIPlayer.autoplayChecksResolved(0);
  }

  function onAutoplayWithSoundFail(UIPlayer) {
    if (asperf){ return ; }
    checkMutedAutoplaySupport(UIPlayer);
  }

  function checkMutedAutoplaySupport(UIPlayer) {
    tplayer.volume = 0;
    tplayer.muted = true;
    tplayer.defaultMuted = true;
    try{
    var playPromise = tplayer.play();
    if (playPromise !== undefined) {
      playPromise.then(()=>{ onMutedAutoplaySuccess(UIPlayer); }).catch(error=>{ onMutedAutoplayFail(UIPlayer); });
    }else{
      UIPlayer.autoplayChecksResolved(1);
    }
    }catch(e){ 
      UIPlayer.autoplayChecksResolved(1); 
    }
  }

  function onMutedAutoplaySuccess(UIPlayer) {
    amperf = true ;
    tplayer.pause();
    autoplayAllowed = true;
    autoplayRequiresMuted = true;
    UIPlayer.autoplayChecksResolved(0);
  }

  function onMutedAutoplayFail(UIPlayer) {
    if (amperf){ return ; }
    tplayer.volume = 1;
    tplayer.muted = false;
    tplayer.defaultMuted = false;
    autoplayAllowed = false;
    autoplayRequiresMuted = false;
    UIPlayer.autoplayChecksResolved(0);
  }
