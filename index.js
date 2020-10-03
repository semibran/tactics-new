"use strict";var _slicedToArray=function(arr,i){if(Array.isArray(arr))return arr;if(Symbol.iterator in Object(arr))return function(arr,i){var _arr=[],_n=!0,_d=!1,_e=void 0;try{for(var _s,_i=arr[Symbol.iterator]();!(_n=(_s=_i.next()).done)&&(_arr.push(_s.value),!i||_arr.length!==i);_n=!0);}catch(err){_d=!0,_e=err}finally{try{!_n&&_i.return&&_i.return()}finally{if(_d)throw _e}}return _arr}(arr,i);throw new TypeError("Invalid attempt to destructure non-iterable instance")},_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(obj){return typeof obj}:function(obj){return obj&&"function"==typeof Symbol&&obj.constructor===Symbol&&obj!==Symbol.prototype?"symbol":typeof obj};function _toConsumableArray(arr){if(Array.isArray(arr)){for(var i=0,arr2=Array(arr.length);i<arr.length;i++)arr2[i]=arr[i];return arr2}return Array.from(arr)}function _defineProperty(obj,key,value){return key in obj?Object.defineProperty(obj,key,{value:value,enumerable:!0,configurable:!0,writable:!0}):obj[key]=value,obj}!function(){var srcmap={palette:[70,156,5,2],"icon-ice":[150,77,10,10],"icon8-sword":[116,97,8,8],"icon6-hat":[80,146,6,6],"icon6-dagger":[130,150,6,6],"icon6-shield":[140,140,6,6],"icon6-bow":[100,123,6,6],"icon-fire":[120,20,10,10],"icon8-axe":[150,87,8,8],"font-serif":[0,0,120,77],"icon-volt":[140,0,10,10],"icon6-cudgel":[110,113,6,6],"icon-dark":[70,146,10,10],"font-smallcaps":[100,77,50,20],"font-numbers":[70,140,60,6],"icon8-shield":[120,30,8,8],"icon8-dagger":[130,20,8,8],"font-standard":[0,77,100,63],select:[120,0,20,20],"icon8-hat":[140,10,8,8],"icon6-sword":[116,105,6,6],"icon8-bow":[150,0,8,8],piece:[100,97,16,16],"icon-holy":[130,140,10,10],"icon-plant":[100,113,10,10],"icon6-axe":[124,97,6,6],"font-smallcaps-bold":[0,140,70,20]};function extract(image,x,y,width,height){var canvas=document.createElement("canvas"),context=canvas.getContext("2d");return canvas.width=width,canvas.height=height,context.drawImage(image,-x,-y),canvas}function fromCanvas(image){return image.getContext("2d").getImageData(0,0,image.width,image.height)}function toCanvas(data){var canvas=document.createElement("canvas"),context=canvas.getContext("2d");return canvas.width=data.width,canvas.height=data.height,context.putImageData(data,0,0),canvas}function replace(image,oldColor,newColor){oldColor[3]||((oldColor=oldColor.slice())[3]=255),newColor[3]||((newColor=newColor.slice())[3]=255);for(var i=0;i<image.data.length;i+=4){for(var c=0;c<4&&image.data[i+c]===oldColor[c];c++);if(4===c)for(c=0;c<4;c++)image.data[i+c]=newColor[c]}return image}function create(width,height){var canvas=document.createElement("canvas");return canvas.width=width,canvas.height=height,canvas.getContext("2d")}function recolor$1(canvas,newColor){return toCanvas(function(image,newColor){newColor[3]||((newColor=newColor.slice())[3]=255);for(var i=0;i<image.data.length;i+=4)if(0!==image.data[i+3])for(var c=0;c<4;c++)image.data[i+c]=newColor[c];return image}(fromCanvas(canvas),newColor))}function rgb(r,g,b){return"rgb("+r+", "+g+", "+b+")"}var matrix=[["white","gray","cyan","blue","navy"],["black","jet","pink","red","purple"]],mappings={factions:{player:{light:"cyan",normal:"blue",dark:"navy"},enemy:{light:"pink",normal:"red",dark:"purple"}}};function match(image){for(var palette={},data=function(image){var canvas=document.createElement("canvas"),context=image.getContext("2d");return canvas.width=image.width,canvas.height=image.height,context.drawImage(canvas,0,0),context.getImageData(0,0,image.width,image.height)}(image),y=0;y<matrix.length;y++)for(var x=0;x<matrix[y].length;x++){var colorname=matrix[y][x];palette[colorname]=function(image,i,y){return i=4*(y*image.width+i),[image.data[i],image.data[1+i],image.data[2+i],image.data[3+i]]}(data,x,y)}return function assign(obj,mappings){for(var n in mappings)"object"===_typeof(mappings[n])?(obj[n]={},assign(obj[n],mappings[n])):obj[n]=palette[mappings[n]]}(palette,mappings),palette}var fonts={standard:{id:"standard",cellsize:{width:10,height:9},charsize:{width:6,height:7},exceptions:{1:{width:4},I:{width:4},J:{width:5},M:{width:7},W:{width:7},f:{width:5},g:{height:9},i:{width:3},j:{width:5},l:{width:3,x:0},m:{width:10},p:{height:9},q:{height:9},w:{width:10},y:{height:9},",":{width:2,height:8},".":{width:2},"!":{width:2},"?":{width:6},"'":{width:2},"(":{width:4},")":{width:4}},spacing:{char:1,word:4,line:5},layout:["0123456789","ABCDEFGHIJ","KLMNOPQRST","UVWXYZ,.!?","abcdefghij","klmnopqrst","uvwxyz'()"]},serif:{id:"serif",cellsize:{width:12,height:11},charsize:{width:8,height:9},exceptions:{A:{width:9},D:{width:9},H:{width:9},I:{width:4},J:{width:5},K:{width:9},M:{width:10},N:{width:9},Q:{width:9,height:11},S:{width:7},U:{width:9},a:{width:7},b:{width:7},c:{width:6},d:{width:7},e:{width:6},f:{width:5},g:{width:7,height:11},h:{width:8},i:{width:4},j:{width:4,height:11},k:{width:8},l:{width:4},m:{width:12},n:{width:8},o:{width:6},p:{width:7,height:11},q:{width:7,height:11},r:{width:7},s:{width:6},t:{width:5},v:{width:7},w:{width:12},x:{width:7},y:{width:8,height:11},z:{width:7}},spacing:{char:1,word:4,line:5},layout:["0123456789","ABCDEFGHIJ","KLMNOPQRST","UVWXYZ    ","abcdefghij","klmnopqrst","uvwxyz"]},smallcaps:{id:"smallcaps",cellsize:{width:5,height:5},charsize:{width:5,height:5},exceptions:{1:{width:3},",":{width:1},".":{width:1},"!":{width:1},"/":{width:3}},spacing:{char:1,word:3,line:2},layout:["0123456789","ABCDEFGHIJ","KLMNOPQRST","UVWXYZ,.!/"]},smallcapsBold:{id:"smallcaps-bold",cellsize:{width:7,height:5},charsize:{width:6,height:5},exceptions:{1:{width:4},M:{width:7},W:{width:7},",":{width:2},".":{width:2},"!":{width:2},"/":{width:3}},spacing:{char:1,word:4,line:2},layout:["0123456789","ABCDEFGHIJ","KLMNOPQRST","UVWXYZ,.!/"]},numbers:{id:"numbers",cellsize:{width:6,height:6},charsize:{width:6,height:6},exceptions:{1:{width:4}},spacing:{char:1,word:3,line:2},layout:["0123456789"]}};function drawOutline(image,color){for(var result=create(image.width+2,image.height+2),base=recolor$1(image,color),y=0;y<3;y++)for(var x=0;x<3;x++)1===x&&1===y||result.drawImage(base,x,y);return result.drawImage(image,1,1),result.canvas}function makeCharmap(image,font,newColor,stroke){if(!image)throw new Error("No image found for font "+font.id+". Try rebuilding your spritesheet.");var oldColor,charmap={},cols=image.width/font.cellsize.width,rows=image.height/font.cellsize.height;newColor&&(oldColor=[255,255,255],newColor=newColor,image=toCanvas(replace(fromCanvas(image),oldColor,newColor)));for(var row=0;row<rows;row++)for(var col=0;col<cols;col++){var char=font.layout[row][col];if(char){var axis,size={width:font.charsize.width,height:font.charsize.height},offsets=font.exceptions[char];for(axis in offsets)size[axis]=offsets[axis];var base=extract(image,col*font.cellsize.width,row*font.cellsize.height,size.width,size.height);charmap[char]=stroke?drawOutline(base,stroke):base}}return charmap}function normalize(icons){var images=function disasm(sheet,srcmap){var sprites={};for(var id in srcmap){var x,y,w,h;Array.isArray(srcmap[id])?(h=_slicedToArray(srcmap[id],4),x=h[0],y=h[1],w=h[2],h=h[3],sprites[id]=extract(sheet,x,y,w,h)):sprites[id]=disasm(sheet,srcmap[id])}return sprites}(icons,srcmap),palette=match(images.palette),icons=function(images){var name,icons={small:{},types:{axe:"fighter",bow:"archer",dagger:"thief",hat:"mage",shield:"knight",sword:"soldier"},fire:images["icon-fire"],ice:images["icon-ice"],volt:images["icon-volt"],plant:images["icon-plant"],holy:images["icon-holy"],dark:images["icon-dark"]};for(name in icons.types){var type=icons.types[name];icons.small[name]=images["icon6-"+name],icons.small[type]=images["icon6-"+name],icons[name]=images["icon8-"+name],icons[type]=images["icon8-"+name]}return icons}(images);return{icons:icons,palette:palette,badges:function(palette,icons){var faction,badges={};for(faction in palette.factions){var subpal=palette.factions[faction],badge=create(5,5);badge.fillStyle=rgb.apply(void 0,_toConsumableArray(palette.jet)),badge.fillRect(1,0,3,5),badge.fillRect(0,1,5,3),badge.fillStyle=rgb.apply(void 0,_toConsumableArray(subpal.normal)),badge.fillRect(1,1,3,3),badge.fillStyle=rgb.apply(void 0,_toConsumableArray(subpal.light)),badge.fillRect(2,1,2,2),badges[faction]=badge.canvas}var iconname,base=create(10,10);for(iconname in base.fillStyle=rgb.apply(void 0,_toConsumableArray(palette.jet)),base.fillRect(1,0,8,10),base.fillRect(0,1,10,8),base.fillStyle=rgb.apply(void 0,_toConsumableArray(palette.gray)),base.fillRect(1,1,8,8),badges.base=base.canvas,icons.types){var unittype=icons.types[iconname],icon=function(image,base){var result=create(image.width+2,image.height+2),base=recolor$1(image,base);return result.drawImage(base,0,1),result.drawImage(base,1,0),result.drawImage(base,2,1),result.drawImage(base,1,2),result.drawImage(image,1,1),result.canvas}(icons[iconname],palette.jet),_badge=function(canvas){var result=create(canvas.width,canvas.height);return result.drawImage(canvas,0,0),result}(base.canvas);_badge.drawImage(icon,0,0),badges[unittype]=_badge.canvas}return badges}(palette,icons),select:function(image,palette){var faction,select={};for(faction in palette.factions){var ring=palette.factions[faction],sprite=image.getContext("2d").getImageData(0,0,image.width,image.height);replace(sprite,palette.white,ring.light);ring=create(image.width,image.height+1);ring.putImageData(sprite,0,1),ring.drawImage(image,0,0),select[faction]=ring.canvas}return select}(images.select,palette),pieces:function(base,icons,palette){var faction,pieces={};for(faction in palette.factions){pieces[faction]={};var iconname,subpal=palette.factions[faction];for(iconname in icons.types){var unittype=icons.types[iconname],_piece=icons.small[iconname],_piece=function(tmp,icon,colors){var template=tmp.getContext("2d").getImageData(0,0,tmp.width,tmp.height);replace(template,palette.white,colors.normal),replace(template,palette.black,colors.dark);var piece=create(tmp.width,tmp.height);piece.putImageData(template,0,0);tmp=create(8,8),template=icon.getContext("2d").getImageData(0,0,icon.width,icon.height);return replace(template,palette.white,colors.light),tmp.putImageData(template,0,0),piece.drawImage(tmp.canvas,5,5),tmp=create(8,8),replace(template=icon.getContext("2d").getImageData(0,0,icon.width,icon.height),palette.white,colors.dark),tmp.putImageData(template,0,0),piece.drawImage(tmp.canvas,5,4),piece.canvas}(base,_piece,subpal);pieces[faction][unittype]=_piece}}return pieces}(images.piece,icons,palette),fonts:function(images,fonts,palette){var fontname,result={};for(fontname in fonts){var font=fonts[fontname],image=images["font-"+font.id];result[fontname]=function(image,data,palette){var charmap=makeCharmap(image,data);return{image:image,data:data,cache:_defineProperty({default:charmap},palette.white,charmap)}}(image,font,palette)}return result}(images,fonts,palette)}}function renderText(content,_iteratorError4,width){var font=_iteratorError4.font,_didIteratorError4=_iteratorError4.color?_iteratorError4.stroke?_iteratorError4.color+"+"+_iteratorError4.stroke:_iteratorError4.color:"default";if(!font)throw new Error("Attempting to render an unregistered font. Is your font exported by fonts/index.js?");font.cache[_didIteratorError4]||(font.cache[_didIteratorError4]=makeCharmap(font.image,font.data,_iteratorError4.color,_iteratorError4.stroke));var cached=font.cache[_didIteratorError4];content=content.toString(),width=width||function(content,font,stroked){var width=0,_iteratorNormalCompletion3=!0,_didIteratorError3=!1,_iteratorError3=void 0;try{for(var _iterator3=content[Symbol.iterator]();!(_iteratorNormalCompletion3=(image=_iterator3.next()).done);_iteratorNormalCompletion3=!0){var cache,image,char=image.value;" "!==char?(image=(image=(cache=font.cache.default)[char])||cache[char.toUpperCase()])&&(width+=image.width+font.data.spacing.char):width+=font.data.spacing.word}}catch(err){_didIteratorError3=!0,_iteratorError3=err}finally{try{!_iteratorNormalCompletion3&&_iterator3.return&&_iterator3.return()}finally{if(_didIteratorError3)throw _iteratorError3}}return width&&(width-=font.data.spacing.char),stroked&&(width+=2),width}(content,font,_iteratorError4.stroke);_didIteratorError4=font.data.cellsize.height;_iteratorError4.stroke&&(_didIteratorError4+=2);var text=create(width,_didIteratorError4),x=0,kerning=font.data.spacing.char;_iteratorError4.stroke&&(kerning-=2);var _iteratorNormalCompletion4=!0,_didIteratorError4=!1,_iteratorError4=void 0;try{for(var _iterator4=content[Symbol.iterator]();!(_iteratorNormalCompletion4=(image=_iterator4.next()).done);_iteratorNormalCompletion4=!0){var image,char=image.value;" "!==char?(image=(image=cached[char])||cached[char.toUpperCase()])&&(text.drawImage(image,x,0),x+=image.width+kerning):x+=font.data.spacing.word}}catch(err){_didIteratorError4=!0,_iteratorError4=err}finally{try{!_iteratorNormalCompletion4&&_iterator4.return&&_iterator4.return()}finally{if(_didIteratorError4)throw _iteratorError4}}return text.canvas}var tilesize=16;function init$1(view,app){var _view$state=view.state,camera=_view$state.camera,pointer=_view$state.pointer,selection=_view$state.selection;view.app=app;var device=null,actions={resize:function(){var scaleX,canvas;scaleX=Math.max(1,Math.floor(window.innerWidth/view.native.width)),canvas=Math.max(1,Math.floor(window.innerHeight/view.native.height)),view.scale=Math.min(scaleX,canvas),view.width=Math.ceil(window.innerWidth/view.scale),view.height=Math.ceil(window.innerHeight/view.scale),(canvas=view.element).width=view.width,canvas.height=view.height,canvas.style.transform="scale("+view.scale+")",render(view)},press:function(event){if(device=device||function(event){var device="desktop";event.touches?(device="mobile",window.removeEventListener("mousedown",actions.press),window.removeEventListener("mousemove",actions.move),window.removeEventListener("mouseup",actions.release)):(window.removeEventListener("touchstart",actions.press),window.removeEventListener("touchmove",actions.move),window.removeEventListener("touchend",actions.release));return device}(event),pointer.pressed)return!1;if(pointer.pos=getPosition(event),!pointer.pos)return!1;snapToGrid(pointer.pos);pointer.clicking=!0,pointer.pressed=pointer.pos,pointer.offset={x:camera.x*view.scale,y:camera.y*view.scale}},move:function(a){pointer.pos=getPosition(a);var b=snapToGrid(pointer.pos);pointer.pos&&pointer.pressed&&(pointer.clicking&&(a=snapToGrid(pointer.pressed),b=b,(a=a).x===b.x&&a.y===b.y||(pointer.clicking=!1)),camera.x=(pointer.pos.x-pointer.pressed.x+pointer.offset.x)/view.scale,camera.y=(pointer.pos.y-pointer.pressed.y+pointer.offset.y)/view.scale,render(view))},release:function(){if(!pointer.pressed)return!1;var unit;pointer.clicking&&(pointer.clicking=!1,unit=snapToGrid(pointer.pressed),unit=function(map,cell){if(function(map,cell){return 0<=cell.x&&0<=cell.y&&cell.x<map.width&&cell.y<map.height}(map,cell)){var _iteratorNormalCompletion2=!0,_didIteratorError2=!1,_iteratorError2=void 0;try{for(var _iterator2=map.units[Symbol.iterator]();!(_iteratorNormalCompletion2=(unit=_iterator2.next()).done);_iteratorNormalCompletion2=!0){var unit=unit.value;if(unit.x===cell.x&&unit.y===cell.y)return unit}}catch(err){_didIteratorError2=!0,_iteratorError2=err}finally{try{!_iteratorNormalCompletion2&&_iterator2.return&&_iterator2.return()}finally{if(_didIteratorError2)throw _iteratorError2}}}}(app.map,unit),selection.unit?(selection.unit=null,render(view)):unit&&(selection.unit=unit,console.log(unit),render(view))),pointer.pressed=null}};function getPosition(y){var x=y.pageX||y.touches&&y.touches[0].pageX,y=y.pageY||y.touches&&y.touches[0].pageY;return void 0===x||void 0===y?null:{x:x,y:y}}function snapToGrid(realpos_y){var gridpos_y=app.map,gridpos_x=(realpos_y.x-window.innerWidth/2)/view.scale,realpos_y=(realpos_y.y-window.innerHeight/2)/view.scale,gridpos_x=gridpos_x+gridpos_y.width*tilesize/2-camera.x,gridpos_y=realpos_y+gridpos_y.height*tilesize/2-camera.y;return{x:Math.floor(gridpos_x/tilesize),y:Math.floor(gridpos_y/tilesize)}}actions.resize(),window.addEventListener("resize",actions.resize),window.addEventListener("mousedown",actions.press),window.addEventListener("mousemove",actions.move),window.addEventListener("mouseup",actions.release),window.addEventListener("touchstart",actions.press),window.addEventListener("touchmove",actions.move),window.addEventListener("touchend",actions.release)}function render(_y2){var sprites=_y2.sprites,palette=sprites.palette,shadow=_y2.element,context=shadow.getContext("2d");context.fillStyle="black",context.fillRect(0,0,shadow.width,shadow.height);var stats=_y2.state,element=stats.camera,selection=stats.selection,center_x=Math.round(_y2.width/2-64+element.x),center_y=Math.round(_y2.height/2-64+element.y);context.fillStyle="#112";for(var i=0;i<8;i++)for(var x,y,j=0;j<8;j++){(j+i)%2&&(x=16*j+center_x,y=16*i+center_y,context.fillRect(x,y,16,16))}var app=_y2.app,_iteratorNormalCompletion5=!0,width=!1,content=void 0;try{for(var _iterator5=app.map.units[Symbol.iterator]();!(_iteratorNormalCompletion5=(_y=_iterator5.next()).done);_iteratorNormalCompletion5=!0){var _unit=_y.value,sprite=sprites.pieces[_unit.faction][_unit.type],_x=center_x+16*_unit.x,_y=center_y+16*_unit.y;_unit===selection.unit&&context.drawImage(sprites.select[selection.unit.faction],_x-2,_y-2),context.drawImage(sprite,_x,_y-1)}}catch(err){width=!0,content=err}finally{try{!_iteratorNormalCompletion5&&_iterator5.return&&_iterator5.return()}finally{if(width)throw content}}var _unit2,text,box;selection.unit;selection.unit&&(text=renderText((_unit2=selection.unit).name,{font:sprites.fonts.serif,color:palette.white,stroke:palette.jet}),box=function(){var icon=sprites.badges[_unit2.type],orb=sprites.badges[_unit2.faction],result=create(icon.width+2,icon.height+1);return"mage"===_unit2.type?(result.drawImage(icon,1,1),result.drawImage(orb,0,0)):(result.drawImage(icon,1,1),result.drawImage(orb,icon.width-orb.width+2,0)),result.canvas}(),shadow=function(){var bar=create(68,11),value=palette.factions[_unit2.faction];bar.fillStyle=rgb.apply(void 0,_toConsumableArray(palette.jet)),bar.fillRect(0,0,68,6);var max=bar.createLinearGradient(0,3,68,3);max.addColorStop(0,rgb.apply(void 0,_toConsumableArray(value.normal))),max.addColorStop(1,rgb.apply(void 0,_toConsumableArray(value.light))),bar.fillStyle=max,bar.fillRect(1,1,66,4);var label=renderText("HP",{font:sprites.fonts.smallcaps,color:palette.white,stroke:palette.jet}),value=renderText(_unit2.hp,{font:sprites.fonts.standard,color:palette.white,stroke:palette.jet}),max=renderText("/"+_unit2.hp,{font:sprites.fonts.smallcapsBold,color:palette.white,stroke:palette.jet});return bar.drawImage(label,3,2),bar.drawImage(max,bar.canvas.width-max.width-3,2),bar.drawImage(value,bar.canvas.width-max.width-3-value.width,2),bar.canvas}(),stats=function(){var stats={font:sprites.fonts.numbers,color:palette.white,stroke:palette.jet},atk=renderText(_unit2.atk,stats),def=renderText(_unit2.def,stats),sword=drawOutline(sprites.icons.small.sword,palette.jet),shield=drawOutline(sprites.icons.small.shield,palette.jet),stats=create(sword.width+atk.width+3+shield.width+def.width,8);return stats.drawImage(sword,0,0),stats.drawImage(atk,sword.width,0),stats.drawImage(shield,sword.width+atk.width+2,0),stats.drawImage(def,sword.width+atk.width+2+shield.width,0),stats.canvas}(),element=function(){var icon=sprites.icons[_unit2.element],element=create(icon.width+6,icon.height);return element.fillStyle=rgb.apply(void 0,_toConsumableArray(palette.cyan)),element.fillRect(0,2,icon.width+6,icon.height-4),element.fillRect(1,1,icon.width+4,icon.height-2),element.fillStyle="white",element.fillRect(1,2,icon.width+4,icon.height-4),element.drawImage(icon,3,0),element.canvas}(),(content=create(width=shadow.width+1,box.height+2+shadow.height+3+stats.height+1)).drawImage(box,0,0),content.drawImage(text,box.width+1,0),content.drawImage(shadow,1,box.height+2),content.drawImage(stats,4,box.height+2+shadow.height+3),content.drawImage(element,width-element.width,box.height+3+shadow.height+1),box=function(width,height){var box=create(width,height);return box.fillStyle="white",box.fillRect(1,0,width-2,height),box.fillRect(0,1,width,height-2),box.canvas}(content.canvas.width+8,content.canvas.height+5),shadow=recolor$1(content.canvas,palette.cyan),_y2=_y2.height-box.height-4,context.drawImage(box,4,_y2),context.drawImage(shadow,7,3+_y2),context.drawImage(content.canvas,6,2+_y2))}var path,state={map:function(data){var map={width:data.width,height:data.height,units:[]},_iteratorNormalCompletion=!0,_didIteratorError=!1,_iteratorError=void 0;try{for(var _iterator=data.units[Symbol.iterator]();!(_iteratorNormalCompletion=(unit=_iterator.next()).done);_iteratorNormalCompletion=!0){var unit=unit.value;map.units.push({type:unit.type,name:unit.name,faction:unit.faction,x:unit.pos[0],y:unit.pos[1],hp:unit.hp,atk:unit.atk,def:unit.def,element:unit.element})}}catch(err){_didIteratorError=!0,_iteratorError=err}finally{try{!_iteratorNormalCompletion&&_iterator.return&&_iterator.return()}finally{if(_didIteratorError)throw _iteratorError}}return map}({id:"test",width:8,height:8,units:[{type:"soldier",name:"Arthur",faction:"enemy",pos:[1,4],hp:11,atk:13,def:10,element:"holy"},{type:"knight",name:"Percy",faction:"enemy",pos:[3,3],hp:12,atk:9,def:11,element:"plant"},{type:"mage",name:"Morgan",faction:"enemy",pos:[2,6],hp:7,atk:11,def:3,element:"dark"},{type:"fighter",name:"Gilda",faction:"player",pos:[5,5],hp:13,atk:14,def:7,element:"volt"},{type:"thief",name:"Kid",faction:"player",pos:[6,2],hp:8,atk:7,def:5,element:"fire"},{type:"archer",name:"Napi",faction:"player",pos:[4,1],hp:9,atk:12,def:9,element:"ice"}]})};path="sprites.png",new Promise(function(resolve,reject){var image=new Image;image.src=path,image.onload=function(){resolve(image)},image.onerror=function(){reject(new Error("Failed to load image `"+path+"`"))}}).then(function(view){view=function(width,height,sprites){return{width:window.innerWidth,height:window.innerHeight,native:{width:width,height:height},scale:1,sprites:sprites,element:document.createElement("canvas"),state:{camera:{x:0,y:0},selection:{unit:null},pointer:{pos:null,clicking:!1,pressed:null,offset:null}},app:null}}(160,160,normalize(view));document.body.appendChild(view.element),init$1(view,state)})}();