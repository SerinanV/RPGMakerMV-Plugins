//==========================================================================
// Cryptocurrency.js
//==========================================================================

/*:
 * @plugindesc 仮想通貨のトレードシステムを実現するプラグインです。
 * @author Serinan
 * 
 * @param Item ID
 * @desc 仮想通貨として扱うアイテムのIDです。
 * @default 0
 * 
 * @param Default Price
 * @desc 初期価格です。
 * @default 100
 *
 * @param Variation Range
 * @desc 価格の変動幅です。
 * @default 20
 *
 * @help
 *
 * 【バージョン】
 * 　1.0.0
 * 
 * 【プラグインコマンド】
 * 　UpdateCryptoPrice	： 仮想通貨の価格を更新する
 *
 * 　SetCryptoTrend [UP, DOWN, RANGE]	： トレンドを設定する
 * 　　例：SetCryptoTrend UP	… 上昇トレンドになる。
 * 　　　　SetCryptoTrend DOWN	… 下降トレンドになる。
 * 　　　　SetCryptoTrend RANGE	… レンジ相場（ボックス相場）になる。
 */

(function()
{
	//--------------------------------------------------------------------------
	// 列挙型
	//--------------------------------------------------------------------------
	var Trend =
	{
		up : 1,
		down : 2,
		range : 3
	};
	
	//--------------------------------------------------------------------------
	// 変数宣言
	//--------------------------------------------------------------------------
	var parameters = PluginManager.parameters('Cryptocurrency');
	var itemId = Number(parameters['Item ID']);
	var defaultPrice = Number(parameters['Default Price']);
	var variationRange = Number(parameters['Variation Range']);

	//--------------------------------------------------------------------------
	// Game_Interpreter
	//--------------------------------------------------------------------------
	var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
	
	Game_Interpreter.prototype.pluginCommand = function(command, args)
	{
		_Game_Interpreter_pluginCommand.call(this, command, args);
		
		switch (command.toUpperCase())
		{
			case 'UPDATECRYPTOPRICE':
				$gameSystem.updatePrice();
				break;
			case 'SETCRYPTOTREND':
				$gameSystem.setTrend(args[0]);
				break;
		}
	};
	
	//--------------------------------------------------------------------------
	// Window_ShopBuy
	//--------------------------------------------------------------------------
	var _WindowShopBuy_price = Window_ShopBuy.prototype.price;
	
	Window_ShopBuy.prototype.price = function(item)
	{
		var price = _WindowShopBuy_price.call(this, item);
		
	    if (item == $dataItems[itemId])
	    {
	    	price = $gameSystem.getPrice();
	    }
	    
	    return price;
	};
	
	//--------------------------------------------------------------------------
	// Scene_Shop
	//--------------------------------------------------------------------------
	var _Scene_Shop_sellingPrice = Scene_Shop.prototype.sellingPrice;
	
	Scene_Shop.prototype.sellingPrice = function()
	{
		var sellingPrice = _Scene_Shop_sellingPrice.call(this);
		
		if (this._item == $dataItems[itemId])
		{
			sellingPrice = $gameSystem.getPrice();
		}
		
	    return sellingPrice;
	};
	
	//--------------------------------------------------------------------------
	// Game_System
	//--------------------------------------------------------------------------
	Game_System.prototype.updatePrice = function()
	{
		var variableValue = 0;
		
		switch (this.getTrend())
		{
			case Trend.up:
				variableValue = Math.floor(Math.random() * (variationRange + 1)) - variationRange * 0.33;
				break;
			case Trend.down:
				variableValue = Math.floor(Math.random() * (variationRange + 1)) - variationRange * 0.66;
				break;
			case Trend.range:
				variableValue = Math.floor(Math.random() * (variationRange + 1)) - variationRange * 0.5;
				break;
		}
		
		this._price = Math.round(this.getPrice() + variableValue);
		if (this._price < 1)
		{
			this._price = 1;
		}
	};
	
	Game_System.prototype.getPrice = function()
	{
		return this._price || defaultPrice;
	};
	
	Game_System.prototype.getTrend = function()
	{
		return this._trend || Trend.range;
	};
	
	Game_System.prototype.setTrend = function(trend)
	{
		switch (trend.toUpperCase())
		{
			case 'UP':
				this._trend = Trend.up;
				break;
			case 'DOWN':
				this._trend = Trend.down;
				break;
			case 'RANGE':
				this._trend = Trend.range;
				break;
		}
	};
})();