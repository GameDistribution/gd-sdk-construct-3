"use strict";

{
	C3.Plugins.GD_SDK.Instance = class SingleGlobalInstance extends C3.SDKInstanceBase
	{

		constructor(inst, properties)
		{
			super(inst);
			
			// Initialise object properties
			this._gameID = "";
			this._sdkReady = false;
			this._adPlaying = false;
			this._adViewed = false;

			// note properties may be null in some cases
			if (properties)		
			{
				this._gameID = properties[0];
			}

			try {
				if(this._runtime.IsPreview()) {
					localStorage.setItem("gd_debug", true);
					localStorage.setItem("gd_tag", "https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ct%3Dlinear&correlator=")					
				}else{
					localStorage.removeItem("gd_debug");
					localStorage.removeItem("gd_tag");
				}
			} catch (e) {
			}

			window["GD_OPTIONS"] = {
				"gameId": this._gameID,
				// "prefix": "gd_", // Set your own prefix in case you get id conflicts.
				"advertisementSettings": {
					// "debug": true, // Enable IMA SDK debugging.
					// "autoplay": false, // Don't use this because of browser video autoplay restrictions.
					// "locale": "en", // Locale used in IMA SDK, this will localise the "Skip ad after x seconds" phrases.
				},
				"onEvent": event => {
					//https://github.com/GameDistribution/GD-HTML5
					switch (event.name) {
						case "SDK_GAME_START":
							// advertisement done, resume game logic and unmute audio
							this._adPlaying = false;
							break;
						case "SDK_GAME_PAUSE":
							// pause game logic / mute audio
							this._adPlaying = true;
							break;
						case "SDK_GDPR_TRACKING":
							// this event is triggered when your user doesn't want to be tracked
							break;
						case "SDK_GDPR_TARGETING":
							// this event is triggered when your user doesn't want personalised targeting of ads and such
							break;
						case "COMPLETE":
							// this event is triggered when the user watched an entire ad
							this._adViewed = true;
							setTimeout(()=>{
								this._adViewed = false;
							}, 5000);
							break;
						case "SDK_READY":
							let debugBar = document.querySelector("#gdsdk__implementation");
							if(debugBar) debugBar.remove();
							this._sdkReady = true;
							break;
					}
				},
			};

			//Load the SDK from the CDN
			(function(d, s, id) {
				var js, fjs = d.getElementsByTagName(s)[0];
				if (d.getElementById(id)) return;
				js = d.createElement(s);
				js.id = id;
				js.src = '//html5.api.gamedistribution.com/main.min.js';
				fjs.parentNode.insertBefore(js, fjs);
			}(document, 'script', 'gamedistribution-jssdk'));


		}
		
		Release()
		{
			super.Release();
		}
		
		SaveToJson()
		{
			return {
				// data to be saved for savegames
			};
		}
		
		LoadFromJson(o)
		{
			// load state for savegames
		}
	};
}