"use strict";

{
	const PLUGIN_CLASS = SDK.Plugins.GD_SDK;
	
	PLUGIN_CLASS.Type = class MyCustomPluginType extends SDK.ITypeBase
	{
		constructor(sdkPlugin, iObjectType)
		{
			super(sdkPlugin, iObjectType);
		}
	};
}