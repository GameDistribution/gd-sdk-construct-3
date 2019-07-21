"use strict";

{
  C3.Plugins.GD_SDK.Cnds = {
    ResumeGame() {
      return !this._adPlaying;
    },

    PauseGame() {
      return this._adPlaying;
    },

    AdViewed() {
      return this._adViewed;
    },
    PreloadedAd() {
      return this._preloadedAd;
    }
  };
}
