// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
cr.plugins_.GD_SDK = function(runtime) {
  this.runtime = runtime;
};

(function() {
  var pluginProto = cr.plugins_.GD_SDK.prototype;

  /////////////////////////////////////
  // Object type class
  pluginProto.Type = function(plugin) {
    this.plugin = plugin;
    this.runtime = plugin.runtime;
  };

  var typeProto = pluginProto.Type.prototype;

  typeProto.onCreate = function() {};

  /////////////////////////////////////
  // Instance class
  pluginProto.Instance = function(type) {
    this.type = type;
    this.runtime = type.runtime;
    this.available_adtypes = ["interstitial", "rewarded"];

    // Initialise object properties
    this._gameID = 0;
    this._adPlaying = false;
    this._adViewed = false;
    this._giveReward = false;
    this._adPreloaded = false;
  };

  var instanceProto = pluginProto.Instance.prototype;

  instanceProto.onCreate = function() {
    // Read properties set in C3
    this._gameID = this.properties[0];

    try {
      try {
        if (this._runtime.IsPreview()) {
          localStorage.setItem("gd_debug", true);
          localStorage.setItem(
            "gd_tag",
            "https://pubads.g.doubleclick.net/gampad/ads?sz=640x480&iu=/124319096/external/single_ad_samples&ciu_szs=300x250&impl=s&gdfp_req=1&env=vp&output=vast&unviewed_position_start=1&cust_params=deployment%3Ddevsite%26sample_ct%3Dlinear&correlator="
          );
        } else {
          localStorage.removeItem("gd_debug");
          localStorage.removeItem("gd_tag");
        }
      } catch (e) {}
    } catch (e) {}

    window["GD_OPTIONS"] = {
      gameId: this._gameID,
      // "prefix": "gd_", // Set your own prefix in case you get id conflicts.
      advertisementSettings: {
        // "debug": true, // Enable IMA SDK debugging.
        // "autoplay": false, // Don't use this because of browser video autoplay restrictions.
        // "locale": "en", // Locale used in IMA SDK, this will localise the "Skip ad after x seconds" phrases.
      },
      onEvent: event => {
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
          case "SDK_REWARDED_WATCH_COMPLETE":
            // this event is triggered when your user doesn't want personalised targeting of ads and such
            this._giveReward = true;
            setTimeout(() => {
              this._giveReward = false;
            }, 5000);
            break;
          case "COMPLETE":
            // this event is triggered when the user watched an entire ad
            this._adViewed = true;
            setTimeout(() => {
              this._adViewed = false;
            }, 5000);
            break;
          case "SDK_READY":
            let debugBar = document.querySelector("#gdsdk__implementation");
            if (debugBar) debugBar.remove();
            this._sdkReady = true;
            break;
        }
      }
    };

    //Load the SDK from the CDN
    (function(d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s);
      js.id = id;
      js.src = "//html5.api.gamedistribution.com/main.min.js";
      fjs.parentNode.insertBefore(js, fjs);
    })(document, "script", "gamedistribution-jssdk");
  };

  instanceProto.saveToJSON = function() {
    return {};
  };

  instanceProto.loadFromJSON = function(o) {};

  /**BEGIN-PREVIEWONLY**/
  instanceProto.getDebuggerValues = function(propsections) {};
  /**END-PREVIEWONLY**/

  //////////////////////////////////////
  // Conditions
  function Cnds() {}

  (Cnds.prototype.ResumeGame = function() {
    return !this._adPlaying;
  }),
    (Cnds.prototype.PauseGame = function() {
      return this._adPlaying;
    }),
    (Cnds.prototype.AdViewed = function() {
      return this._adViewed;
    }),
    (Cnds.prototype.RewardPlayer = function() {
      return this._giveReward;
    }),
    (Cnds.prototype.PreloadedAd = function() {
      return this._preloadedAd;
    });

  pluginProto.cnds = new Cnds();

  //////////////////////////////////////
  // Actions
  function Acts() {}

  Acts.prototype.ShowAd = function() {
    if (!this._sdkReady) return;

    // adType = this._available_adtypes[adType] || adType;

    if (!this._sdkReady) return;
    var gdsdk = window["gdsdk"];
    if (gdsdk !== "undefined" && gdsdk.showAd !== "undefined") {
      gdsdk.showAd();
    }
  };

  Acts.prototype.ShowRewardedAd = function() {
    if (!this._sdkReady) return;

    // adType = this._available_adtypes[adType] || adType;

    if (!this._sdkReady) return;
    var gdsdk = window["gdsdk"];
    if (gdsdk !== "undefined" && gdsdk.showAd !== "undefined") {
      this._preloadedAd = false;
      gdsdk.showAd("rewarded");
    }
  };

  Acts.prototype.PreloadRewardedAd = function() {
    if (!this._sdkReady) return;

    // adType = this._available_adtypes[adType] || adType;

    this._preloadedAd = false;

    var gdsdk = window["gdsdk"];
    if (gdsdk !== "undefined" && gdsdk.preloadAd !== "undefined") {
      gdsdk
        .preloadAd("rewarded")
        .then(() => {
          this._preloadedAd = true;
        })
        .catch(error => {
          this._preloadedAd = false;
        });
    }
  };

  pluginProto.acts = new Acts();

  //////////////////////////////////////
  // Expressions
  function Exps() {}

  pluginProto.exps = new Exps();
})();
