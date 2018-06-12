"use strict";

{
	C3.Plugins.GD_SDK.Acts =
	{
		ShowAd()
		{
			if(!this._sdkReady) return;
			window['gdsdk'].showBanner();
		}
	};
}