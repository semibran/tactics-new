"use strict";var _slicedToArray=function(arr,i){if(Array.isArray(arr))return arr;if(Symbol.iterator in Object(arr))return function(arr,i){var _arr=[],_n=!0,_d=!1,_e=void 0;try{for(var _s,_i=arr[Symbol.iterator]();!(_n=(_s=_i.next()).done)&&(_arr.push(_s.value),!i||_arr.length!==i);_n=!0);}catch(err){_d=!0,_e=err}finally{try{!_n&&_i.return&&_i.return()}finally{if(_d)throw _e}}return _arr}(arr,i);throw new TypeError("Invalid attempt to destructure non-iterable instance")},_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(obj){return typeof obj}:function(obj){return obj&&"function"==typeof Symbol&&obj.constructor===Symbol&&obj!==Symbol.prototype?"symbol":typeof obj};function _defineProperty(obj,key,value){return key in obj?Object.defineProperty(obj,key,{value:value,enumerable:!0,configurable:!0,writable:!0}):obj[key]=value,obj}!function(){var srcmap={palette:[20,75,4,2],"icon-axe":[20,63,6,6],"icon-sword":[16,83,6,6],"icon-dagger":[20,69,6,6],"icon-shield":[26,63,6,6],"icon-bow":[16,89,6,6],"icon-hat":[22,83,6,6],select:[0,63,20,20],piece:[0,83,16,16],"font-standard-bold":[0,0,100,63]};function extract(image,x,y,width,height){var canvas=document.createElement("canvas"),context=canvas.getContext("2d");return canvas.width=width,canvas.height=height,context.drawImage(image,-x,-y),canvas}function Canvas(width,height){var canvas=document.createElement("canvas");return canvas.width=width,canvas.height=height,canvas.getContext("2d")}function fromImage(image){var canvas=document.createElement("canvas"),context=canvas.getContext("2d");return canvas.width=image.width,canvas.height=image.height,context.drawImage(image,0,0),context.getImageData(0,0,canvas.width,canvas.height)}function replace(image,oldColor,newColor){oldColor[3]||((oldColor=oldColor.slice())[3]=255),newColor[3]||((newColor=newColor.slice())[3]=255);for(var i=0;i<image.data.length;i+=4){for(var c=0;c<4&&image.data[i+c]===oldColor[c];c++);if(4===c)for(c=0;c<4;c++)image.data[i+c]=newColor[c]}return image}var units={fighter:"axe",knight:"shield",thief:"dagger",mage:"hat",soldier:"sword",archer:"bow"},matrix=[["white","cyan","blue","navy"],["black","pink","red","purple"]],mappings={factions:{player:{light:"cyan",normal:"blue",dark:"navy"},enemy:{light:"pink",normal:"red",dark:"purple"}}};function match(image){for(var palette={},data=fromImage(image),y=0;y<matrix.length;y++)for(var x=0;x<matrix[y].length;x++){var colorname=matrix[y][x];palette[colorname]=function(image,i,y){return i=4*(y*image.width+i),[image.data[i],image.data[1+i],image.data[2+i],image.data[3+i]]}(data,x,y)}return function assign(obj,mappings){for(var n in mappings)"object"===_typeof(mappings[n])?(obj[n]={},assign(obj[n],mappings[n])):obj[n]=palette[mappings[n]]}(palette,mappings),palette}var fonts={standardBold:{id:"standard-bold",cellsize:{width:10,height:9},charsize:{width:6,height:7},exceptions:{4:{width:5},I:{width:4},J:{width:5},M:{width:7},W:{width:7},f:{width:5},g:{height:9},i:{width:3},j:{width:5},l:{width:3,x:0},m:{width:10},p:{height:9},q:{height:9},w:{width:10},y:{height:9},",":{width:2,height:8},".":{width:2},"!":{width:2},"?":{width:6},"'":{width:2},"(":{width:4},")":{width:4}},spacing:{char:1,word:4,line:5},layout:["0123456789","ABCDEFGHIJ","KLMNOPQRST","UVWXYZ,.!?","abcdefghij","klmnopqrst","uvwxyz'()"]}};function makeCharmap(image,props,context){var data,canvas,charmap={},cols=image.width/props.cellsize.width,rows=image.height/props.cellsize.height;context&&(data=replace(fromImage(image),[255,255,255],context),canvas=document.createElement("canvas"),context=canvas.getContext("2d"),canvas.width=data.width,canvas.height=data.height,context.putImageData(data,0,0),image=canvas);for(var y=0;y<rows;y++)for(var x=0;x<cols;x++){var char=props.layout[y][x];if(char){var axis,size={width:props.charsize.width,height:props.charsize.height},offsets=props.exceptions[char];for(axis in offsets)size[axis]=offsets[axis];charmap[char]=extract(image,x*props.cellsize.width,y*props.cellsize.height,size.width,size.height)}}return charmap}function normalize(icons){var images=function disasm(sheet,srcmap){var sprites={};for(var id in srcmap){var x,y,w,h;Array.isArray(srcmap[id])?(h=_slicedToArray(srcmap[id],4),x=h[0],y=h[1],w=h[2],h=h[3],sprites[id]=extract(sheet,x,y,w,h)):sprites[id]=disasm(sheet,srcmap[id])}return sprites}(icons,srcmap),palette=match(images.palette),icons={axe:(icons=images)["icon-axe"],bow:icons["icon-bow"],dagger:icons["icon-dagger"],hat:icons["icon-hat"],shield:icons["icon-shield"],sword:icons["icon-sword"]};return{icons:icons,select:function(image,palette){var faction,select={};for(faction in palette.factions){var ring=palette.factions[faction],sprite=image.getContext("2d").getImageData(0,0,image.width,image.height);replace(sprite,palette.white,ring.light);ring=Canvas(image.width,image.height+1);ring.putImageData(sprite,0,1),ring.drawImage(image,0,0),select[faction]=ring.canvas}return select}(images.select,palette),pieces:function(base,icons,palette){var faction,pieces={};for(faction in palette.factions){pieces[faction]={};var unittype,subpal=palette.factions[faction];for(unittype in units){var _piece=units[unittype],_piece=icons[_piece],_piece=function(tmp,icon,colors){var template=tmp.getContext("2d").getImageData(0,0,tmp.width,tmp.height);replace(template,palette.white,colors.normal),replace(template,palette.black,colors.dark);var piece=Canvas(tmp.width,tmp.height);piece.putImageData(template,0,0);tmp=Canvas(8,8),template=icon.getContext("2d").getImageData(0,0,icon.width,icon.height);return replace(template,palette.white,colors.light),tmp.putImageData(template,0,0),piece.drawImage(tmp.canvas,5,5),tmp=Canvas(8,8),replace(template=icon.getContext("2d").getImageData(0,0,icon.width,icon.height),palette.white,colors.dark),tmp.putImageData(template,0,0),piece.drawImage(tmp.canvas,5,4),piece.canvas}(base,_piece,subpal);pieces[faction][unittype]=_piece}}return pieces}(images.piece,icons,palette),fonts:function(images,fonts,palette){var fontname,result={};for(fontname in fonts){var font=fonts[fontname],image=images["font-"+font.id];result[fontname]=function(image,data,palette){var charmap=makeCharmap(image,data);return{image:image,data:data,cache:_defineProperty({default:charmap},palette.white,charmap)}}(image,font,palette)}return result}(images,fonts,palette)}}function renderText(content,font,_didIteratorError4,_iteratorError4){var cache=font.cache[_didIteratorError4]||font.cache.default,text=Canvas(_iteratorError4=_iteratorError4||function(content,font){var width=0,_iteratorNormalCompletion3=!0,_didIteratorError3=!1,_iteratorError3=void 0;try{for(var _iterator3=content[Symbol.iterator]();!(_iteratorNormalCompletion3=(image=_iterator3.next()).done);_iteratorNormalCompletion3=!0){var cache,image,char=image.value;" "!==char?(image=(image=(cache=font.cache.default)[char])||cache[char.toUpperCase()])&&(width+=image.width+font.data.spacing.char):width+=font.data.spacing.word}}catch(err){_didIteratorError3=!0,_iteratorError3=err}finally{try{!_iteratorNormalCompletion3&&_iterator3.return&&_iterator3.return()}finally{if(_didIteratorError3)throw _iteratorError3}}return width&&(width-=font.data.spacing.char),width}(content,font),font.data.cellsize.height),x=0,_iteratorNormalCompletion4=!0,_didIteratorError4=!1,_iteratorError4=void 0;try{for(var _iterator4=content[Symbol.iterator]();!(_iteratorNormalCompletion4=(image=_iterator4.next()).done);_iteratorNormalCompletion4=!0){var image,char=image.value;" "!==char?(image=(image=cache[char])||cache[char.toUpperCase()])&&(text.drawImage(image,x,0),x+=image.width+font.data.spacing.char):x+=font.data.spacing.word}}catch(err){_didIteratorError4=!0,_iteratorError4=err}finally{try{!_iteratorNormalCompletion4&&_iterator4.return&&_iterator4.return()}finally{if(_didIteratorError4)throw _iteratorError4}}return text.canvas}var tilesize=16;function init$1(view,app){var _view$state=view.state,camera=_view$state.camera,pointer=_view$state.pointer,selection=_view$state.selection;view.app=app;var device=null,actions={resize:function(){var scaleX,canvas;scaleX=Math.max(1,Math.floor(window.innerWidth/view.native.width)),canvas=Math.max(1,Math.floor(window.innerHeight/view.native.height)),view.scale=Math.min(scaleX,canvas),view.width=Math.ceil(window.innerWidth/view.scale),view.height=Math.ceil(window.innerHeight/view.scale),(canvas=view.element).width=view.width,canvas.height=view.height,canvas.style.transform="scale("+view.scale+")",render(view)},press:function(event){if(device=device||function(event){var device="desktop";event.touches?(device="mobile",window.removeEventListener("mousedown",actions.press),window.removeEventListener("mousemove",actions.move),window.removeEventListener("mouseup",actions.release)):(window.removeEventListener("touchstart",actions.press),window.removeEventListener("touchmove",actions.move),window.removeEventListener("touchend",actions.release));return device}(event),pointer.pressed)return!1;if(pointer.pos=getPosition(event),!pointer.pos)return!1;snapToGrid(pointer.pos);pointer.clicking=!0,pointer.pressed=pointer.pos,pointer.offset={x:camera.x*view.scale,y:camera.y*view.scale}},move:function(a){pointer.pos=getPosition(a);var b=snapToGrid(pointer.pos);pointer.pos&&pointer.pressed&&(pointer.clicking&&(a=snapToGrid(pointer.pressed),b=b,(a=a).x===b.x&&a.y===b.y||(pointer.clicking=!1)),camera.x=(pointer.pos.x-pointer.pressed.x+pointer.offset.x)/view.scale,camera.y=(pointer.pos.y-pointer.pressed.y+pointer.offset.y)/view.scale,render(view))},release:function(){if(!pointer.pressed)return!1;var unit;pointer.clicking&&(pointer.clicking=!1,unit=snapToGrid(pointer.pressed),(unit=function(map,cell){if(function(map,cell){return 0<=cell.x&&0<=cell.y&&cell.x<map.width&&cell.y<map.height}(map,cell)){var _iteratorNormalCompletion2=!0,_didIteratorError2=!1,_iteratorError2=void 0;try{for(var _iterator2=map.units[Symbol.iterator]();!(_iteratorNormalCompletion2=(unit=_iterator2.next()).done);_iteratorNormalCompletion2=!0){var unit=unit.value;if(unit.x===cell.x&&unit.y===cell.y)return unit}}catch(err){_didIteratorError2=!0,_iteratorError2=err}finally{try{!_iteratorNormalCompletion2&&_iterator2.return&&_iterator2.return()}finally{if(_didIteratorError2)throw _iteratorError2}}}}(app.map,unit))?(selection.unit=unit,console.log(unit),render(view)):selection.unit&&(selection.unit=null,render(view))),pointer.pressed=null}};function getPosition(y){var x=y.pageX||y.touches&&y.touches[0].pageX,y=y.pageY||y.touches&&y.touches[0].pageY;return void 0===x||void 0===y?null:{x:x,y:y}}function snapToGrid(realpos_y){var gridpos_y=app.map,gridpos_x=(realpos_y.x-window.innerWidth/2)/view.scale,realpos_y=(realpos_y.y-window.innerHeight/2)/view.scale,gridpos_x=gridpos_x+gridpos_y.width*tilesize/2-camera.x,gridpos_y=realpos_y+gridpos_y.height*tilesize/2-camera.y;return{x:Math.floor(gridpos_x/tilesize),y:Math.floor(gridpos_y/tilesize)}}actions.resize(),window.addEventListener("resize",actions.resize),window.addEventListener("mousedown",actions.press),window.addEventListener("mousemove",actions.move),window.addEventListener("mouseup",actions.release),window.addEventListener("touchstart",actions.press),window.addEventListener("touchmove",actions.move),window.addEventListener("touchend",actions.release)}function render(icon){var sprites=icon.sprites,y=icon.element,context=y.getContext("2d");context.fillStyle="black",context.fillRect(0,0,y.width,y.height);var text=icon.state,y=text.camera,selection=text.selection,center_x=Math.round(icon.width/2-64+y.x),center_y=Math.round(icon.height/2-64+y.y);context.fillStyle="#112";for(var i=0;i<8;i++)for(var x,_y,j=0;j<8;j++){(j+i)%2&&(x=16*j+center_x,_y=16*i+center_y,context.fillRect(x,_y,16,16))}var app=icon.app,_iteratorNormalCompletion5=!0,text=!1,y=void 0;try{for(var _iterator5=app.map.units[Symbol.iterator]();!(_iteratorNormalCompletion5=(_y2=_iterator5.next()).done);_iteratorNormalCompletion5=!0){var unit=_y2.value,sprite=sprites.pieces[unit.faction][unit.type],_x=center_x+16*unit.x,_y2=center_y+16*unit.y;unit===selection.unit&&context.drawImage(sprites.select[selection.unit.faction],_x-2,_y2-2),context.drawImage(sprite,_x,_y2-1)}}catch(err){text=!0,y=err}finally{try{!_iteratorNormalCompletion5&&_iterator5.return&&_iterator5.return()}finally{if(text)throw y}}text=renderText(selection.unit?selection.unit.name:"(Select a unit!)",sprites.fonts.standardBold),y=icon.height-text.height-2;selection.unit?(icon=units[selection.unit.type],icon=sprites.icons[icon],context.drawImage(icon,4,1+y),context.drawImage(text,14,y)):context.drawImage(text,4,y)}var path,state={map:function(data){var map={width:data.width,height:data.height,units:[]},_iteratorNormalCompletion=!0,_didIteratorError=!1,_iteratorError=void 0;try{for(var _iterator=data.units[Symbol.iterator]();!(_iteratorNormalCompletion=(unit=_iterator.next()).done);_iteratorNormalCompletion=!0){var unit=unit.value;map.units.push({type:unit.type,name:unit.name,faction:unit.faction,x:unit.position[0],y:unit.position[1]})}}catch(err){_didIteratorError=!0,_iteratorError=err}finally{try{!_iteratorNormalCompletion&&_iterator.return&&_iterator.return()}finally{if(_didIteratorError)throw _iteratorError}}return map}({id:"test",width:8,height:8,units:[{type:"knight",name:"Arthur",faction:"enemy",position:[3,3]},{type:"soldier",name:"Lance",faction:"enemy",position:[1,4]},{type:"mage",name:"Morgan",faction:"enemy",position:[2,6]},{type:"fighter",name:"Gilgas",faction:"player",position:[5,5]},{type:"thief",name:"Enkidu",faction:"player",position:[6,2]},{type:"archer",name:"Utna",faction:"player",position:[4,1]}]})};path="sprites.png",new Promise(function(resolve,reject){var image=new Image;image.src=path,image.onload=function(){resolve(image)},image.onerror=function(){reject(new Error("Failed to load image `"+path+"`"))}}).then(function(view){view=function(width,height,sprites){return{width:window.innerWidth,height:window.innerHeight,native:{width:width,height:height},scale:1,sprites:sprites,element:document.createElement("canvas"),state:{camera:{x:0,y:0},selection:{unit:null},pointer:{pos:null,clicking:!1,pressed:null,offset:null}},app:null}}(160,160,normalize(view));document.body.appendChild(view.element),init$1(view,state)})}();