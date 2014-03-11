
/*
 * Match Game
 * Santiago Chen made it
 * santiago1209@foxmail.com
 * =========================
 * Parameters
 * this.pattern = 1; range: 1,2,3,4
 * this.level = 1; range: 1,2,3,4
 * =========================
*/

/*
 *Card Class
 */
function Card(value,cl,index){
	var _self = this;
	this._value = value;
	this._class = cl;
	this._el = $('<li class="matchli default"></li>').attr("data-cl",this._class).html(this._value).on("click",function(){
		$(this).trigger("cardclicking",_self)
	});
	return this;
}


/*
 *GameMaster Class
 */
function GameMaster(){
	//this.mode = first timemode second countclickmode
	this.level = 1; //total4
	this.pattern = 1; //1 for 8pairs, 2 for 18pairs, 3 for 32pairs, 4 for 50pairs,

}

GameMaster.prototype = function(){
	
	var _level,_pattern,_textarr,_cardbuntch=[],_wrap = $('<div class="matchwrap"></div>'), 
		_wrapcard=$('<ul id="matchul"></ul>'),_wrapct=$('<ul class="matchct"></ul>'),_where,_selected=[],
		_clickable=false,_right=0, _newstart = $('<div class="newstart">New Game</div>'),
		_timeui = $('<li class="timediv">剩余时间:<span id="lefttime">00</span></li>'),
		_timehas,_timer,_interval;
	init = function(where){
		var _self=this;
		_level = Math.min(Math.max(1,this.level),4),
		_pattern = Math.min(Math.max(1,this.pattern),4);
		_newstart.on("click",_self,startgame);
		
		_where = where||$(document.body);
		_where.append(_wrap);
		_wrap.append(_wrapcard);
		_wrap.append(_wrapct);
		_wrapct.append(_timeui);

		switch(_pattern){
			case 1:
			_textarr = new Array(8);
			break;
			case 2:
			_textarr = new Array(18);
			break;
			case 3:
			_textarr = new Array(32);
			break;
			case 4:
			_textarr = new Array(50);
			break;
		}
		switch(_level){
			case 1:
			_timehas = 60;
			break;
			case 2:
			_timehas = 55;
			break;
			case 3:
			_timehas = 50;
			break;
			case 4:
			_timehas = 40;
			break;
		}

		shuffle(makecard(_textarr.length,this));
		displaycard();
		$(this).on("win",this,onwinhandler);
	}
	function startgame(e,data){
		var _self = e.data;
		if(_right==_cardbuntch.length/2){
			_wrapcard.empty();
			_cardbuntch=[];
			_selected=[];
			_right=0;
			shuffle(makecard(_textarr.length,e.data));
			displaycard();
		}
		$(this).hide();
		_clickable=true;
		_timer = _timehas;
		_interval = setInterval(function(){
			_timer--;
			_timeui.find("#lefttime").html(_timer);
			if(_timer==0&&_right!==_cardbuntch.length/2){
				$(_self).trigger("win","Game Lose");
				clearInterval(_interval);
			}
		},1000);
	}
	onwinhandler = function(e,data){
		_newstart.html(data+"\r"+"Start?").show();
		_clickable = false;
		//console.log(data)

	}
	displaycard = function(){
		var length = _cardbuntch.length;

		for(var x=0; x<length; x++){
			_wrapcard.append(_cardbuntch[x]._el);
		}
		_wrapcard.css({
			width:_cardbuntch[0]._el.outerWidth(true)*Math.sqrt(_cardbuntch.length),
			height:_cardbuntch[0]._el.outerHeight(true)*Math.sqrt(_cardbuntch.length)
		});
		_wrap.css({
			width:_wrapcard.outerWidth(true),
			height:_wrapcard.outerHeight(true)
		});

		_wrapct.appendTo(_wrap).css({
			"right":-_wrapct.outerWidth(true),
		});
		_newstart.css({
			'width':_wrapcard.outerWidth(true)*.6,
			'left': _wrapcard.outerWidth(true)*.1
		});
		_wrap.append(_newstart);
		_timeui.find("#lefttime").html(_timer);
	}
	makecard = function(length,domain){
		var  _cardarr = [];

		for(var m=0; m<length; m++){
			var card = new Card(m,("class"+m),1);
			card._el.on("cardclicking",domain,cardclickinghandler);
			_cardarr.push(card);
			var card = new Card(m,("class"+m),2);
			card._el.on("cardclicking",domain,cardclickinghandler);
			_cardarr.push(card);	
		}

		return _cardarr;
	}
	shuffle = function(arr){
		var _length = arr.length;
		for(var n=0; n<_length; n++){
			var _index = parseInt(Math.random()*arr.length);
			_cardbuntch.push(arr[_index]);
			arr.splice(_index,1);
		}
		

	}
	cardclickinghandler = function(e,data){
		
		if(_clickable==true){
			//tell the one selected;
			data._el.css("borderColor","#E10602");
			data._el.addClass(data._class);
			//this is 1st click; push what you selected;
			if(_selected.length==0){
				_selected.push(data);
			}
			//this is 2nd click; push what you selected, and compare them;
			else if(_selected.length==1){
				if(data===_selected[0]){alert("You can not selecte the same one")}
				else{
					_clickable = false;
					_selected.push(data);
					var result = compareselected(_selected);
					if(result==true){
						for(var m=0; m<_selected.length; m++){
							_selected[m]._el.css("borderColor","#ffffff");
							_selected[m]._el.off("cardclicking");
						}
						_selected = [];
						_clickable = true;
						_right++;
						if(_right==_cardbuntch.length/2){$(e.data).trigger("win","Game Win");clearInterval(_interval);}
					}
					else{
						setTimeout(function(){
							for(var m=0; m<_selected.length; m++){
								_selected[m]._el.css("borderColor","#ffffff");
								_selected[m]._el.removeClass(_selected[m]._class);
							}
							_selected = [];
							_clickable = true;
						},500)
					}
					
				}
				
			}

		}
	}
	compareselected = function(data){
		if(data[0]._value==data[1]._value){return true}
		else{return false}
	}
	return{
		init:init,
		shuffle:shuffle
	}

}()

