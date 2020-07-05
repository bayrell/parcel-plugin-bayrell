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
var path = require('path');
var fs = require('fs');
var Context = use("Runtime.Context");
var Collection = use("Runtime.Collection");
var Map = use("Runtime.Map");
var ParserBay = use("Bayrell.Lang.LangBay.ParserBay");
var TranslatorES6 = use("Bayrell.Lang.LangES6.TranslatorES6");
var TranslatorNode = use("Bayrell.Lang.LangNode.TranslatorNode");
var TranslatorPHP = use("Bayrell.Lang.LangPHP.TranslatorPHP");
var LangUtils = use("Bayrell.Lang.LangUtils");
var RuntimeException = use("Runtime.Exceptions.RuntimeException");
var OpUse = use("Bayrell.Lang.OpCodes.OpUse");
var cache = require('./cache.js');


class AssetBay extends Asset
{
	
	constructor(name, options)
	{
		super(name, options);
		
		/* Create context */
		this.ctx = Context.create(null);
		use("Runtime.RuntimeUtils").setContext(this.ctx);
		
		/* Create parsers */
		this.parser_bay = new ParserBay();
		this.translator_es6 = new TranslatorES6(this.ctx, { "use_module_name": true, "use_strict": true, });
		this.translator_nodejs = new TranslatorNode();
		this.translator_php = new TranslatorPHP();
		
		/* Set props */
		this.type = 'js';
		this.root_path = path.dirname(this.options.rootDir);
		this.modules = {};
	}
	
	findClass(path, class_name)
	{
		var arr = class_name.split(".");
		var i = 1;
		
		while (i < arr.length)
		{
			var arr1 = arr.slice(0, i);
			var arr2 = arr.slice(i);
			var file_name = "";
			
			file_name = path + "/" + arr1.join(".") + "/bay/" + arr2.join(".") + ".bay";
			if (fs.existsSync(file_name))
			{
				return file_name;
			}
			
			file_name = path + "/" + arr1.join(".") + "/bay/" + arr2.join(".") + ".es6";
			if (fs.existsSync(file_name))
			{
				return file_name;
			}
			
			file_name = path + "/" + arr1.join(".") + "/bay/" + arr2.join(".") + ".js";
			if (fs.existsSync(file_name))
			{
				return file_name;
			}
			
			i++;
		}
		
		return null;
	}
	
	addClass(class_name)
	{
		var file_path = "";
		file_path = this.findClass(this.root_path + "/lib", class_name);
		if (file_path != null)
		{
			var file_name = path.relative(path.dirname(this.name), file_path);
			if (file_name[0] != ".") file_name = "./" + file_name;
			if
			(
				this.name != file_path &&
				!this.dependencies.has(file_path)
			)
			{
				this.addDependency
				(
					file_path,
					{
						name: file_name
					}
				);
				this.modules[class_name] = file_name;
			}
		}
	}
	
	addDefaultDependencies()
	{
		this.addClass("Runtime.rtl");
		this.addClass("Runtime.AsyncAwait");
		this.addClass("Runtime.Collection");
		this.addClass("Runtime.Dict");
		this.addClass("Runtime.Monad");

		for (var i = 0; i < this.ast.items.length; i++)
		{
			var op_code = this.ast.items[i];
			if (op_code instanceof OpUse)
			{
				this.addClass(op_code.name);
			}
		}
	}
	
	async parse(code)
	{
		if (cache.build_bay_cache[this.name] != undefined)
		{
			return cache.build_bay_cache[this.name];
		}
		
		// console.log("Compile " + this.name);
		
		try
		{
			var ast = LangUtils.parse(this.ctx, this.parser_bay, code);
		}
		catch (e)
		{
			if (e instanceof RuntimeException)
			{
				throw new Error(e.toString());
			}
			else
			{
				throw e;
			}
		}
		
		cache.build_bay_cache[this.name] = ast;
		
		return ast;
	}
	
	collectDependencies()
	{
		this.addDefaultDependencies();
		
		/*
		if (node.filename !== this.name && !this.dependencies.has(node.filename))
		{
			this.addDependency
			(
				node.filename,
				{
				}
			);
		}
		*/
	}
	
	async generate()
	{
		var code = LangUtils.translate(this.ctx, this.translator_es6, this.ast);
		var str_modules = JSON.stringify(this.modules);
		var str_use = "var use = function(class_name){ var m = " + str_modules + 
			"; return require( m[class_name] ); }";
		var content = str_use + "\n" + code;
		
		/*
		var minify = require('@node-minify/core');
		var uglifyjs = require('@node-minify/uglify-js');
		var babelMinify = require('@node-minify/babel-minify');
		content = await minify({
			compressor: uglifyjs,
			content: content,
		});
		*/
		
		// var res = uglify_js.minify(content, {fromString: true}); content = res.code;
		return { "js": content };
	}
}

module.exports = AssetBay
