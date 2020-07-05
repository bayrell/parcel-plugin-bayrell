/*!
 *  Bayrell Language
 *
 *  (c) Copyright 2016-2020 "Ildar Bikmamatov" <support@bayrell.org>
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

var AssetES6 = require.resolve('./AssetES6.js');
var AssetBay = require.resolve('./AssetBay.js');
var cache = require('./cache.js');

module.exports = function(bundler)
{
	bundler.addAssetType('es6', AssetES6);
	bundler.addAssetType('bay', AssetBay);
	
	bundler.addListener("buildStart", () =>
	{
		// console.log("buildStart");
		cache.build_bay_cache = {};
	});
	
}
