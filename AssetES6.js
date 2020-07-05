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

var Asset = require('parcel').Asset;
var use = require('bayrell').use;

// use.add_modules( __dirname + "/node_modules" );
// use.add_src( __dirname + "/../app/src" );


var Context = use("Runtime.Context");
var Collection = use("Runtime.Collection");
var Map = use("Runtime.Map");
var ParserBay = use("Bayrell.Lang.LangBay.ParserBay");
var TranslatorES6 = use("Bayrell.Lang.LangES6.TranslatorES6");
var TranslatorNode = use("Bayrell.Lang.LangNode.TranslatorNode");
var TranslatorPHP = use("Bayrell.Lang.LangPHP.TranslatorPHP");
var LangUtils = use("Bayrell.Lang.LangUtils");


class AssetBay extends Asset
{
	
	constructor(name, options)
	{
		super(name, options);
		
		/* Set props */
		this.type = 'js';
	}
	
	parse(code)
	{
		return code;
	}
	
	generate()
	{
		return { "js": this.ast };
	}
}


module.exports = AssetBay
