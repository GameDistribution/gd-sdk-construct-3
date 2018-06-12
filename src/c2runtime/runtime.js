// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
cr.plugins_.GD_SDK = function(runtime)
{
	this.runtime = runtime;
};

(function ()
{
	var pluginProto = cr.plugins_.GD_SDK.prototype;
		
	/////////////////////////////////////
	// Object type class
	pluginProto.Type = function(plugin)
	{
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};

	var typeProto = pluginProto.Type.prototype;

	typeProto.onCreate = function()
	{
	};

	/////////////////////////////////////
	// Instance class
	pluginProto.Instance = function(type)
	{
		this.type = type;
		this.runtime = type.runtime;
		
		// Initialise object properties
		this.gameID = 0;
		this.adPlaying = false;
		this.adViewed = false;

		try {
			if (localStorage.getItem("gd_tag")){
				localStorage.removeItem("gd_tag");
			} else if(this.runtime.exportType == "preview") {
				localStorage.setItem("gd_debug", true);
				localStorage.setItem("gd_tag", "https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ct%3Dlinear&correlator=")					
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
						this.adPlaying = false;
						break;
					case "SDK_GAME_PAUSE":
						// pause game logic / mute audio
						this.adPlaying = true;
						break;
					case "SDK_GDPR_TRACKING":
						// this event is triggered when your user doesn't want to be tracked
						break;
					case "SDK_GDPR_TARGETING":
						// this event is triggered when your user doesn't want personalised targeting of ads and such
						break;
					case "COMPLETE":
						// this event is triggered when the user watched an entire ad
						this.adViewed = true;
						setTimeout(()=>{
							this.adViewed = false;
						}, 5000);
						break;
					case "SDK_READY":
						let debugBar = document.querySelector("#gdsdk__implementation");
						if(debugBar) debugBar.remove();
						this.sdkReady = true;
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

	};
	
	var instanceProto = pluginProto.Instance.prototype;
	
	instanceProto.onCreate = function()
	{
		// Read properties set in C3
		this.gameID = this.properties[0];
	};
	
	instanceProto.saveToJSON = function ()
	{
		return {};
	};
	
	instanceProto.loadFromJSON = function (o)
	{
	};
	
	/**BEGIN-PREVIEWONLY**/
	instanceProto.getDebuggerValues = function (propsections)
	{
	};
	/**END-PREVIEWONLY**/

	//////////////////////////////////////
	// Conditions
	function Cnds() {};

	Cnds.prototype.ResumeGame = function() {
		return !this.adPlaying;
	},

	Cnds.prototype.PauseGame = function() {
		return this.adPlaying;
	},

	Cnds.prototype.AdViewed = function() {
		return this.adViewed;
	}
	
	pluginProto.cnds = new Cnds();

	//////////////////////////////////////
	// Actions
	function Acts() {};

	Acts.prototype.ShowAd = function()
	{
		if(!this.sdkReady) return;
		window['gdsdk']['showBanner']();
	}
	
	pluginProto.acts = new Acts();

	//////////////////////////////////////
	// Expressions
	function Exps() {};
	
	pluginProto.exps = new Exps();

}());