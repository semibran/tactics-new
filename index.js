"use strict";var _slicedToArray=function(arr,i){if(Array.isArray(arr))return arr;if(Symbol.iterator in Object(arr))return function(arr,i){var _arr=[],_n=!0,_d=!1,_e=void 0;try{for(var _s,_i=arr[Symbol.iterator]();!(_n=(_s=_i.next()).done)&&(_arr.push(_s.value),!i||_arr.length!==i);_n=!0);}catch(err){_d=!0,_e=err}finally{try{!_n&&_i.return&&_i.return()}finally{if(_d)throw _e}}return _arr}(arr,i);throw new TypeError("Invalid attempt to destructure non-iterable instance")},_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(obj){return typeof obj}:function(obj){return obj&&"function"==typeof Symbol&&obj.constructor===Symbol&&obj!==Symbol.prototype?"symbol":typeof obj};function _toConsumableArray(arr){if(Array.isArray(arr)){for(var i=0,arr2=Array(arr.length);i<arr.length;i++)arr2[i]=arr[i];return arr2}return Array.from(arr)}function _defineProperty(obj,key,value){return key in obj?Object.defineProperty(obj,key,{value:value,enumerable:!0,configurable:!0,writable:!0}):obj[key]=value,obj}!function(){var srcmap={palette:[70,156,5,2],"select-glow":[100,97,16,18],"icon-ice":[150,77,10,10],"icon8-sword":[135,20,8,8],"select-cursor":[120,20,15,15],"icon6-hat":[140,14,6,6],"icon6-dagger":[154,0,6,6],"icon6-shield":[110,115,6,6],"icon6-bow":[116,107,6,6],"icon-fire":[70,146,10,10],"icon8-axe":[150,87,8,8],"font-serif":[0,0,120,77],"icon-volt":[130,140,10,10],"icon6-cudgel":[126,97,6,6],"icon-dark":[100,115,10,10],"font-smallcaps":[100,77,50,20],"font-numbers":[70,140,60,6],"icon8-shield":[80,146,8,8],"icon8-dagger":[130,150,8,8],"font-standard":[0,77,100,63],"icon8-hat":[140,140,8,8],"icon6-sword":[120,45,6,6],"icon8-bow":[100,125,8,8],piece:[140,0,14,14],"icon-holy":[116,97,10,10],"icon-plant":[120,35,10,10],"icon6-axe":[130,35,6,6],"select-ring":[120,0,20,20],"font-smallcaps-bold":[0,140,70,20]};function extract(image,x,y,width,height){var canvas=document.createElement("canvas"),context=canvas.getContext("2d");return canvas.width=width,canvas.height=height,context.drawImage(image,-x,-y),canvas}function fromCanvas(image){return image.getContext("2d").getImageData(0,0,image.width,image.height)}function toCanvas(data){var canvas=document.createElement("canvas"),context=canvas.getContext("2d");return canvas.width=data.width,canvas.height=data.height,context.putImageData(data,0,0),canvas}function replace(image,oldColor,newColor){oldColor[3]||((oldColor=oldColor.slice())[3]=255),newColor[3]||((newColor=newColor.slice())[3]=255);for(var i=0;i<image.data.length;i+=4){for(var c=0;c<4&&image.data[i+c]===oldColor[c];c++);if(4===c)for(c=0;c<4;c++)image.data[i+c]=newColor[c]}return image}function create(width,height){var canvas=document.createElement("canvas");return canvas.width=width,canvas.height=height,canvas.getContext("2d")}function replace$1(canvas,oldColor,newColor){return toCanvas(replace(fromCanvas(canvas),oldColor,newColor))}function recolor$1(canvas,newColor){return toCanvas(function(image,newColor){newColor[3]||((newColor=newColor.slice())[3]=255);for(var i=0;i<image.data.length;i+=4)if(0!==image.data[i+3])for(var c=0;c<4;c++)image.data[i+c]=newColor[c];return image}(fromCanvas(canvas),newColor))}function rgb(r,g,b){return"rgb("+r+", "+g+", "+b+")"}var matrix=[["white","gray","cyan","blue","navy"],["black","jet","pink","red","purple"]],mappings={factions:{player:{light:"cyan",normal:"blue",dark:"navy"},enemy:{light:"pink",normal:"red",dark:"purple"}}};function match(image){for(var palette={},data=function(image){var canvas=document.createElement("canvas"),context=image.getContext("2d");return canvas.width=image.width,canvas.height=image.height,context.drawImage(canvas,0,0),context.getImageData(0,0,image.width,image.height)}(image),_y=0;_y<matrix.length;_y++)for(var _x=0;_x<matrix[_y].length;_x++){var colorname=matrix[_y][_x];palette[colorname]=function(image,i,y){return i=4*(y*image.width+i),[image.data[i],image.data[1+i],image.data[2+i],image.data[3+i]]}(data,_x,_y)}return function assign(obj,mappings){for(var n in mappings)"object"===_typeof(mappings[n])?(obj[n]={},assign(obj[n],mappings[n])):obj[n]=palette[mappings[n]]}(palette,mappings),palette}var fonts={standard:{id:"standard",cellsize:{width:10,height:9},charsize:{width:6,height:7},exceptions:{1:{width:4},I:{width:4},J:{width:5},M:{width:7},W:{width:7},f:{width:5},g:{height:9},i:{width:3},j:{width:5},l:{width:3,x:0},m:{width:10},p:{height:9},q:{height:9},w:{width:10},y:{height:9},",":{width:2,height:8},".":{width:2},"!":{width:2},"?":{width:6},"'":{width:2},"(":{width:4},")":{width:4}},spacing:{char:1,word:4,line:5},layout:["0123456789","ABCDEFGHIJ","KLMNOPQRST","UVWXYZ,.!?","abcdefghij","klmnopqrst","uvwxyz'()"]},serif:{id:"serif",cellsize:{width:12,height:11},charsize:{width:8,height:9},exceptions:{A:{width:9},D:{width:9},H:{width:9},I:{width:4},J:{width:5},K:{width:9},M:{width:10},N:{width:9},Q:{width:9,height:11},S:{width:7},U:{width:9},a:{width:7},b:{width:7},c:{width:6},d:{width:7},e:{width:6},f:{width:5},g:{width:7,height:11},h:{width:8},i:{width:4},j:{width:4,height:11},k:{width:8},l:{width:4},m:{width:12},n:{width:8},o:{width:6},p:{width:7,height:11},q:{width:7,height:11},r:{width:7},s:{width:6},t:{width:5},v:{width:7},w:{width:12},x:{width:7},y:{width:8,height:11},z:{width:7}},spacing:{char:1,word:4,line:5},layout:["0123456789","ABCDEFGHIJ","KLMNOPQRST","UVWXYZ    ","abcdefghij","klmnopqrst","uvwxyz"]},smallcaps:{id:"smallcaps",cellsize:{width:5,height:5},charsize:{width:5,height:5},exceptions:{1:{width:3},",":{width:1},".":{width:1},"!":{width:1},"/":{width:3}},spacing:{char:1,word:3,line:2},layout:["0123456789","ABCDEFGHIJ","KLMNOPQRST","UVWXYZ,.!/"]},smallcapsBold:{id:"smallcaps-bold",cellsize:{width:7,height:5},charsize:{width:6,height:5},exceptions:{1:{width:4},M:{width:7},W:{width:7},",":{width:2},".":{width:2},"!":{width:2},"/":{width:3}},spacing:{char:1,word:4,line:2},layout:["0123456789","ABCDEFGHIJ","KLMNOPQRST","UVWXYZ,.!/"]},numbers:{id:"numbers",cellsize:{width:6,height:6},charsize:{width:6,height:6},exceptions:{1:{width:4}},spacing:{char:1,word:3,line:2},layout:["0123456789"]}};function drawOutline(image,color){for(var result=create(image.width+2,image.height+2),base=recolor$1(image,color),_y2=0;_y2<3;_y2++)for(var _x2=0;_x2<3;_x2++)1===_x2&&1===_y2||result.drawImage(base,_x2,_y2);return result.drawImage(image,1,1),result.canvas}function makeCharmap(image,font,color,stroke){if(!image)throw new Error("No image found for font "+font.id+". Try rebuilding your spritesheet.");var charmap={},cols=image.width/font.cellsize.width,rows=image.height/font.cellsize.height;color&&(image=replace$1(image,[255,255,255,255],color));for(var row=0;row<rows;row++)for(var col=0;col<cols;col++){var char=font.layout[row][col];if(char){var axis,size={width:font.charsize.width,height:font.charsize.height},offsets=font.exceptions[char];for(axis in offsets)size[axis]=offsets[axis];var base=extract(image,col*font.cellsize.width,row*font.cellsize.height,size.width,size.height);charmap[char]=stroke?drawOutline(base,stroke):base}}return charmap}function normalize(icons){var images=function disasm(sheet,srcmap){var sprites={};for(var id in srcmap){var _x4,_y4,w,h;Array.isArray(srcmap[id])?(h=_slicedToArray(srcmap[id],4),_x4=h[0],_y4=h[1],w=h[2],h=h[3],sprites[id]=extract(sheet,_x4,_y4,w,h)):sprites[id]=disasm(sheet,srcmap[id])}return sprites}(icons,srcmap),palette=match(images.palette),icons=function(images){var name,icons={small:{},types:{axe:"fighter",bow:"archer",dagger:"thief",hat:"mage",shield:"knight",sword:"soldier"},fire:images["icon-fire"],ice:images["icon-ice"],volt:images["icon-volt"],plant:images["icon-plant"],holy:images["icon-holy"],dark:images["icon-dark"]};for(name in icons.types){var type=icons.types[name];icons.small[name]=images["icon6-"+name],icons.small[type]=images["icon6-"+name],icons[name]=images["icon8-"+name],icons[type]=images["icon8-"+name]}return icons}(images);return{icons:icons,palette:palette,squares:function(){var move=create(16,16);move.globalAlpha=.25,move.fillStyle="blue",move.fillRect(0,0,15,15);var attack=create(16,16);return attack.globalAlpha=.25,attack.fillStyle="red",attack.fillRect(0,0,15,15),{move:move.canvas,attack:attack.canvas}}(),badges:function(palette,icons){var faction,badges={};for(faction in palette.factions){var subpal=palette.factions[faction],badge=create(5,5);badge.fillStyle=rgb.apply(void 0,_toConsumableArray(palette.jet)),badge.fillRect(1,0,3,5),badge.fillRect(0,1,5,3),badge.fillStyle=rgb.apply(void 0,_toConsumableArray(subpal.normal)),badge.fillRect(1,1,3,3),badge.fillStyle=rgb.apply(void 0,_toConsumableArray(subpal.light)),badge.fillRect(2,1,2,2),badges[faction]=badge.canvas}var iconname,base=create(10,10);for(iconname in base.fillStyle=rgb.apply(void 0,_toConsumableArray(palette.jet)),base.fillRect(1,0,8,10),base.fillRect(0,1,10,8),base.fillStyle=rgb.apply(void 0,_toConsumableArray(palette.gray)),base.fillRect(1,1,8,8),badges.base=base.canvas,icons.types){var unittype=icons.types[iconname],icon=function(image,base){var result=create(image.width+2,image.height+2),base=recolor$1(image,base);return result.drawImage(base,0,1),result.drawImage(base,1,0),result.drawImage(base,2,1),result.drawImage(base,1,2),result.drawImage(image,1,1),result.canvas}(icons[iconname],palette.jet),_badge=function(canvas){var result=create(canvas.width,canvas.height);return result.drawImage(canvas,0,0),result}(base.canvas);_badge.drawImage(icon,0,0),badges[unittype]=_badge.canvas}return badges}(palette,icons),select:function(images,palette){var faction,select={glow:{},ring:{},cursor:{}};for(faction in palette.factions){var cursor=palette.factions[faction];select.glow[faction]=images["select-glow"];var cursorbase=images["select-ring"],ringshadow=replace$1(cursorbase,palette.white,cursor.light),cursorshadow=create(cursorbase.width,cursorbase.height+1);cursorshadow.drawImage(ringshadow,0,1),cursorshadow.drawImage(cursorbase,0,0),select.ring[faction]=cursorshadow.canvas;cursorbase=images["select-cursor"],cursorshadow=replace$1(cursorbase,palette.white,cursor.light),cursor=create(cursorbase.width+1,cursorbase.height+1);cursor.drawImage(cursorshadow,1,1),cursor.drawImage(cursorbase,0,0),select.cursor[faction]=cursor.canvas}return select}(images,palette),pieces:function(base,icons,palette){var faction,pieces={done:{},shadow:base};for(faction in palette.factions){pieces[faction]={},pieces.done[faction]={};var iconname,subpal=palette.factions[faction];for(iconname in icons.types){var unittype=icons.types[iconname],done=icons.small[iconname],_piece=Piece(base,done,subpal),done=Piece(base,done,{light:subpal.normal,normal:subpal.dark,dark:palette.black});pieces[faction][unittype]=_piece,pieces.done[faction][unittype]=done}}return pieces;function Piece(piece,icon,colors){var template=recolor$1(piece,colors.normal),tmp=colors.dark!==palette.black?recolor$1(piece,colors.dark):piece,piece=create(piece.width,piece.height+2);piece.drawImage(tmp,0,2),piece.drawImage(template,0,0);tmp=create(8,8),template=icon.getContext("2d").getImageData(0,0,icon.width,icon.height);return replace(template,palette.white,colors.light),tmp.putImageData(template,0,0),piece.drawImage(tmp.canvas,4,5),tmp=create(8,8),replace(template=icon.getContext("2d").getImageData(0,0,icon.width,icon.height),palette.white,colors.dark),tmp.putImageData(template,0,0),piece.drawImage(tmp.canvas,4,4),piece.canvas}}(images.piece,icons,palette),fonts:function(images,fonts,palette){var fontname,result={};for(fontname in fonts){var font=fonts[fontname],image=images["font-"+font.id];result[fontname]=function(image,data,palette){var _cache,charmap=makeCharmap(image,data);return{image:image,data:data,cache:(_defineProperty(_cache={default:charmap},palette.white,charmap),_defineProperty(_cache,palette.white+"+"+palette.jet,makeCharmap(image,data,palette.white,palette.jet)),_cache)}}(image,font,palette)}return result}(images,fonts,palette)}}function equals(a,b){return a.x===b.x&&a.y===b.y}function distance(a,b){return Math.abs(b.x-a.x)+Math.abs(b.y-a.y)}function neighbors(cell){return[{x:cell.x-1,y:cell.y},{x:cell.x+1,y:cell.y},{x:cell.x,y:cell.y-1},{x:cell.x,y:cell.y+1}]}function contains(map,cell){return 0<=cell.x&&0<=cell.y&&cell.x<map.width&&cell.y<map.height}function walkable(map,cell){return contains(map,cell)}function unitAt(map,cell){if(contains(map,cell)){var _iteratorNormalCompletion=!0,_didIteratorError=!1,_iteratorError=void 0;try{for(var _iterator=map.units[Symbol.iterator]();!(_iteratorNormalCompletion=(unit=_iterator.next()).done);_iteratorNormalCompletion=!0){var unit=unit.value;if(equals(unit.cell,cell))return unit}}catch(err){_didIteratorError=!0,_iteratorError=err}finally{try{!_iteratorNormalCompletion&&_iterator.return&&_iterator.return()}finally{if(_didIteratorError)throw _iteratorError}}}}function allied(a,b){return a.faction===b.faction}function findRange(unit,map){var mov$1=function(unit){return"knight"===unit.type?4:"thief"===unit.type?6:5}(unit),rng$1=function(unit){return"mage"===unit.type||"archer"===unit.type?2:1}(unit),_iteratorError3=mov$1+rng$1,range={center:unit.cell,radius:_iteratorError3,squares:[]},queue=[{steps:0,cell:unit.cell}],edges=[];for(mov$1||(queue.length=0,edges.push(unit.cell));queue.length;){var node=queue.shift(),_iteratorNormalCompletion2=!0,_didIteratorError2=!1,_iteratorError2=void 0;try{for(var _step2,_iterator2=neighbors(node.cell)[Symbol.iterator]();!(_iteratorNormalCompletion2=(_step2=_iterator2.next()).done);_iteratorNormalCompletion2=!0)(function(neighbor){if(!walkable(map,neighbor,node.cell))return;if(range.squares.find(function(square){return"move"===square.type&&equals(neighbor,square.cell)}))return;var target=unitAt(map,neighbor);target?allied(unit,target)||range.squares.find(function(square){return"attack"===square.type&&equals(neighbor,square.cell)})||range.squares.push({type:"attack",cell:neighbor}):range.squares.push({type:"move",cell:neighbor}),node.steps<mov$1-1?target&&!allied(unit,target)||queue.push({steps:node.steps+1,cell:neighbor}):edges.push(neighbor)})(_step2.value)}catch(err){_didIteratorError2=!0,_iteratorError2=err}finally{try{!_iteratorNormalCompletion2&&_iterator2.return&&_iterator2.return()}finally{if(_didIteratorError2)throw _iteratorError2}}}var _iteratorNormalCompletion3=!0,_didIteratorError3=!1,_iteratorError3=void 0;try{for(var _iterator3=edges[Symbol.iterator]();!(_iteratorNormalCompletion3=(_iteratorError4=_iterator3.next()).done);_iteratorNormalCompletion3=!0){var edge=_iteratorError4.value,_iteratorNormalCompletion4=!0,_didIteratorError4=!1,_iteratorError4=void 0;try{for(var _step4,_iterator4=function(cell,radius){for(var queue=[{steps:0,cell:cell}],cells=[];queue.length;)for(var node=queue.shift(),adj=neighbors(node.cell),i=0;i<adj.length;i++){var neighbor=adj[i];if(!equals(cell,neighbor)){for(var j=0;j<cells.length;j++){if(equals(neighbor,cells[j]))break}j<cells.length||(cells.push(neighbor),node.steps+1<radius&&queue.push({steps:node.steps+1,cell:neighbor}))}}return cells}(edge,rng$1)[Symbol.iterator]();!(_iteratorNormalCompletion4=(_step4=_iterator4.next()).done);_iteratorNormalCompletion4=!0)(function(_neighbor){if(!contains(map,_neighbor)||!walkable(map,_neighbor)||equals(unit.cell,_neighbor))return;var target=unitAt(map,_neighbor);if(!target||!allied(unit,target)){if(range.squares.find(function(square){return equals(_neighbor,square.cell)}))return;range.squares.push({type:"attack",cell:_neighbor})}})(_step4.value)}catch(err){_didIteratorError4=!0,_iteratorError4=err}finally{try{!_iteratorNormalCompletion4&&_iterator4.return&&_iterator4.return()}finally{if(_didIteratorError4)throw _iteratorError4}}}}catch(err){_didIteratorError3=!0,_iteratorError3=err}finally{try{!_iteratorNormalCompletion3&&_iterator3.return&&_iterator3.return()}finally{if(_didIteratorError3)throw _iteratorError3}}return range}function endTurn(index,game){var pending=game.phase.pending,index=pending.indexOf(index);return-1!==index&&(pending.splice(index,1),pending.length||function nextPhase(game){var map=game.map,phase=game.phase;"player"===phase.faction?phase.faction="enemy":"enemy"===phase.faction&&(phase.faction="player");phase.pending=map.units.filter(function(unit){return unit.faction===phase.faction});phase.pending.length||nextPhase(game)}(game),1)}function strify(cell){return cell.x+","+cell.y}function renderText(content,_iteratorError6,width){var font=_iteratorError6.font,_didIteratorError6=_iteratorError6.color?_iteratorError6.stroke?_iteratorError6.color+"+"+_iteratorError6.stroke:_iteratorError6.color:"default";if(!font)throw new Error("Attempting to render an unregistered font. Is your font exported by fonts/index.js?");font.cache[_didIteratorError6]||(font.cache[_didIteratorError6]=makeCharmap(font.image,font.data,_iteratorError6.color,_iteratorError6.stroke));var cached=font.cache[_didIteratorError6];content=content.toString(),width=width||function(content,font,stroked){var width=0,_iteratorNormalCompletion5=!0,_didIteratorError5=!1,_iteratorError5=void 0;try{for(var _iterator5=content[Symbol.iterator]();!(_iteratorNormalCompletion5=(image=_iterator5.next()).done);_iteratorNormalCompletion5=!0){var cache,image,char=image.value;" "!==char?(image=(image=(cache=font.cache.default)[char])||cache[char.toUpperCase()])&&(width+=image.width+font.data.spacing.char):width+=font.data.spacing.word}}catch(err){_didIteratorError5=!0,_iteratorError5=err}finally{try{!_iteratorNormalCompletion5&&_iterator5.return&&_iterator5.return()}finally{if(_didIteratorError5)throw _iteratorError5}}return width&&(width-=font.data.spacing.char),stroked&&(width+=2),width}(content,font,_iteratorError6.stroke);_didIteratorError6=font.data.cellsize.height;_iteratorError6.stroke&&(_didIteratorError6+=2);var text=create(width,_didIteratorError6),x=0,kerning=font.data.spacing.char;_iteratorError6.stroke&&(kerning-=2);var _iteratorNormalCompletion6=!0,_didIteratorError6=!1,_iteratorError6=void 0;try{for(var _iterator6=content[Symbol.iterator]();!(_iteratorNormalCompletion6=(image=_iterator6.next()).done);_iteratorNormalCompletion6=!0){var image,char=image.value;" "!==char?(image=(image=cached[char])||cached[char.toUpperCase()])&&(text.drawImage(image,x,0),x+=image.width+kerning):x+=font.data.spacing.word}}catch(err){_didIteratorError6=!0,_iteratorError6=err}finally{try{!_iteratorNormalCompletion6&&_iterator6.return&&_iterator6.return()}finally{if(_didIteratorError6)throw _iteratorError6}}return text.canvas}var rangeExpand=Object.freeze({__proto__:null,create:function(range){return{type:"RangeExpand",done:!1,time:0,src:range,range:{center:range.center,radius:range.radius,squares:[]}}},update:function(anim){if(!anim.done){var _iteratorNormalCompletion7=!0,_didIteratorError7=!1,_iteratorError7=void 0;try{for(var _iterator7=anim.src.squares[Symbol.iterator]();!(_iteratorNormalCompletion7=(square=_iterator7.next()).done);_iteratorNormalCompletion7=!0){var square=square.value;distance(anim.range.center,square.cell)===anim.time&&anim.range.squares.push(square)}}catch(err){_didIteratorError7=!0,_iteratorError7=err}finally{try{!_iteratorNormalCompletion7&&_iterator7.return&&_iterator7.return()}finally{if(_didIteratorError7)throw _iteratorError7}}anim.time++===anim.range.radius&&(anim.done=!0)}}});var rangeShrink=Object.freeze({__proto__:null,create:function(range){return{type:"RangeShrink",done:!1,range:range}},update:function(anim){if(!anim.done){for(var i=0;i<anim.range.squares.length;i++){var square=anim.range.squares[i];distance(anim.range.center,square.cell)===anim.range.radius&&anim.range.squares.splice(i--,1)}anim.range.radius--<0&&(anim.done=!0)}}});var previewEnter=Object.freeze({__proto__:null,create:function(){return{type:"PreviewEnter",done:!1,x:0,time:0}},update:function(anim){var t;anim.done||(t=anim.time/10,anim.x=function(t){return-t*(t-2)}(t),10==anim.time++&&(anim.done=!0))}});var previewExit=Object.freeze({__proto__:null,create:function(x){return{type:"PreviewExit",done:!1,x:x||1}},update:function(anim){anim.done||(anim.x-=.2,anim.x<0&&(anim.x=0,anim.done=!0))}});var pieceLift=Object.freeze({__proto__:null,height:4,create:function(){return{type:"PieceLift",y:0,time:0,floating:!1}},update:function(anim){var t;anim.done||(anim.time++,anim.floating?(t=anim.time%120/120,anim.y=4+Math.sin(2*Math.PI*t)):4==++anim.y&&(anim.floating=!0))}});var pieceDrop=Object.freeze({__proto__:null,create:function(y){return{type:"PieceDrop",y:y||4}},update:function(anim){anim.done||--anim.y<=0&&(anim.y=0,anim.done=!0)}});var lerp_1=function(v0,v1,t){return v0*(1-t)+v1*t};var pieceMove=Object.freeze({__proto__:null,create:function(path){return{type:"PieceMove",blocking:!0,time:0,path:path,cell:{x:path[0].x,y:path[0].y}}},update:function(anim){if(anim.done)return!1;var next=Math.floor(anim.time/3),t=anim.time%3/3,cell=anim.path[next];return(next=anim.path[next+1])?(anim.cell.x=lerp_1(cell.x,next.x,t),anim.cell.y=lerp_1(cell.y,next.y,t)):(anim.cell.x=cell.x,anim.cell.y=cell.y,anim.done=!0),anim.time++,!0}});function getAugmentedNamespace(n){if(n.__esModule)return n;var a=Object.defineProperty({},"__esModule",{value:!0});return Object.keys(n).forEach(function(k){var d=Object.getOwnPropertyDescriptor(n,k);Object.defineProperty(a,k,d.get?d:{enumerable:!0,get:function(){return n[k]}})}),a}var anims={RangeExpand:getAugmentedNamespace(rangeExpand),RangeShrink:getAugmentedNamespace(rangeShrink),PreviewEnter:getAugmentedNamespace(previewEnter),PreviewExit:getAugmentedNamespace(previewExit),PieceLift:getAugmentedNamespace(pieceLift),PieceDrop:getAugmentedNamespace(pieceDrop),PieceMove:getAugmentedNamespace(pieceMove)},tilesize=16;function init(view,game){var state=view.state,cache=view.cache,sprites=view.sprites,camera=state.camera,pointer=state.pointer,map=game.map;view.game=game,view.cache.map=function(map,tilesize,palette){var canvas=document.createElement("canvas"),context=canvas.getContext("2d");canvas.width=map.width*tilesize,canvas.height=map.height*tilesize,context.fillStyle=rgb.apply(void 0,_toConsumableArray(palette.gray)),context.fillRect(0,0,canvas.width,canvas.height),context.fillStyle=rgb.apply(void 0,_toConsumableArray(palette.jet));for(var i=0;i<map.height;i++)for(var _x5,_y5,j=0;j<map.width;j++){(j+i)%2&&(_x5=j*tilesize,_y5=i*tilesize,context.fillRect(_x5,_y5,tilesize,tilesize))}return canvas}(map,tilesize,sprites.palette);var device=null,events={resize:function(){var scaleX,canvas;scaleX=Math.max(1,Math.floor(window.innerWidth/view.native.width)),canvas=Math.max(1,Math.floor(window.innerHeight/view.native.height)),view.scale=Math.min(scaleX,canvas),view.width=Math.ceil(window.innerWidth/view.scale),view.height=Math.ceil(window.innerHeight/view.scale),(canvas=view.element).width=view.width,canvas.height=view.height,canvas.style.transform="scale("+view.scale+")",state.dirty=!0},press:function(square){return device=device||function(event){var device="desktop";event.touches?(device="mobile",window.removeEventListener("mousedown",events.press),window.removeEventListener("mousemove",events.move),window.removeEventListener("mouseup",events.release)):(window.removeEventListener("touchstart",events.press),window.removeEventListener("touchmove",events.move),window.removeEventListener("touchend",events.release));return device}(square),!pointer.pressed&&(pointer.pos=getPosition(square),!!pointer.pos&&(pointer.clicking=!0,pointer.pressed=pointer.pos,pointer.offset={x:camera.pos.x*view.scale,y:camera.pos.y*view.scale},void(state.selection&&(unit=state.selection.unit,cursor=snapToGrid(pointer.pos),square=null,game.phase.pending.includes(unit)&&(square=cache.range.squares.find(function(_ref){return equals(_ref.cell,cursor)})),square&&(cache.cursor=cursor)))));var unit,cursor},move:function(top){var left,right,bottom;pointer.pos=getPosition(top),pointer.pos&&pointer.pressed&&(bottom=pointer.pos,pointer.clicking&&3<distance(pointer.pressed,bottom)&&(pointer.clicking=!1),camera.target.x=(pointer.pos.x-pointer.pressed.x+pointer.offset.x)/view.scale,camera.target.y=(pointer.pos.y-pointer.pressed.y+pointer.offset.y)/view.scale,left=view.width/2,right=-view.width/2,top=view.height/2,bottom=-view.height/2,camera.target.x>left?camera.target.x=left:camera.target.x<right&&(camera.target.x=right),camera.target.y>top?camera.target.y=top:camera.target.y<bottom&&(camera.target.y=bottom))},release:function(){if(!pointer.pressed)return!1;var cursor,unit,_unit,square;pointer.clicking&&(pointer.clicking=!1,cursor=snapToGrid(pointer.pressed),unit=unitAt(map,cursor),state.selection?(_unit=state.selection.unit,square=null,cache.range&&game.phase.pending.includes(_unit)&&(square=cache.range.squares.find(function(_ref2){return equals(_ref2.cell,cursor)})),square&&"move"===square.type?function(unit,move){{var shrink;cache.range&&(shrink=anims.RangeShrink.create(cache.range),state.concurs.push(shrink))}{cache.preview&&(path=anims.PreviewExit.create(cache.preview.anim.x),cache.preview.anim=path,state.concurs.push(path))}var path=function(start,goal,opts){var path=[],open=[start],opened={},closed={},parent={},g={},f={};if(opts.width&&opts.height)for(var y=0;y<opts.height;y++)for(var x=0;x<opts.width;x++)g[x+","+y]=1/0,f[x+","+y]=1/0;for(g[strify(start)]=0,f[strify(start)]=distance(start,goal);open.length;){for(var cell,best={score:1/0,index:-1,cell:null},i=0;i<open.length;i++){(score=f[strify(cell=open[i])])<best.score&&(best.score=score,best.index=i,best.cell=cell)}if(equals(cell=best.cell,goal)){for(;!equals(cell,start);)path.unshift(cell),cell=parent[strify(cell)];return path.unshift(cell),path}open.splice(best.index,1),opened[strify(cell)]=!1,closed[strify(cell)]=!0;for(var adj=neighbors(cell),i=0;i<adj.length;i++){var score,neighbor=adj[i];if(!closed[strify(neighbor)]&&!(opts&&opts.width&&opts.height&&(neighbor.x<0||neighbor.y<0||neighbor.x>=opts.width||neighbor.y>=opts.height))){if(opts&&opts.blacklist){for(var j=0;j<opts.blacklist.length;j++){if(equals(opts.blacklist[j],neighbor))break}if(j<opts.blacklist.length)continue}opened[strify(neighbor)]||(opened[strify(neighbor)]=!0,open.push(neighbor)),(score=g[strify(cell)]+1)>=g[strify(neighbor)]||(parent[strify(neighbor)]=cell,g[strify(neighbor)]=score,f[strify(neighbor)]=score+distance(neighbor,goal))}}}}(unit.cell,move,{width:map.width,height:map.height,blacklist:map.units.filter(function(other){return!allied(unit,other)}).map(function(unit){return unit.cell})}),move=anims.PieceMove.create(path);cache.selection.anim.done=!0,cache.selection.anim=move,cache.selection.path=path,state.concurs.push(move)}(_unit,cursor):animating(state.concurs,"PreviewEnter")||animating(state.concurs,"PieceMove")||function(){{var shrink;cache.selection.anim.done=!0,cache.range&&(shrink=anims.RangeShrink.create(cache.range),state.concurs.push(shrink))}{cache.preview&&(drop=anims.PreviewExit.create(cache.preview.anim.x),cache.preview.anim=drop,state.concurs.push(drop))}{var drop;cache.selection&&(drop=anims.PieceDrop.create(cache.selection.anim.y),state.concurs.push(drop),cache.selection.anim=drop)}state.selection=null}()):!unit||animating(state.concurs,"PreviewExit")||animating(state.concurs,"PieceMove")||function(unit){var lift=findRange(unit,map),preview=function(unit,sprites){var fonts=sprites.fonts,palette=sprites.palette,name=renderText(unit.name,{font:sprites.fonts.serif,color:palette.white,stroke:palette.jet}),shadow=(element=sprites.badges[unit.type],width=sprites.badges[unit.faction],content=create(element.width+2,element.height+1),"mage"===unit.type?(content.drawImage(element,1,1),content.drawImage(width,0,0)):(content.drawImage(element,1,1),content.drawImage(width,element.width-width.width+2,0)),content.canvas),box=function(){var bar=create(68,11),value=palette.factions[unit.faction];bar.fillStyle=rgb.apply(void 0,_toConsumableArray(palette.jet)),bar.fillRect(0,0,68,6);var max=bar.createLinearGradient(0,3,68,3);max.addColorStop(0,rgb.apply(void 0,_toConsumableArray(value.normal))),max.addColorStop(1,rgb.apply(void 0,_toConsumableArray(value.light))),bar.fillStyle=max,bar.fillRect(1,1,66,4);var label=renderText("HP",{font:fonts.smallcaps,color:palette.white,stroke:palette.jet}),value=renderText(unit.stats.hp,{font:fonts.standard,color:palette.white,stroke:palette.jet}),max=renderText("/"+unit.stats.hp,{font:fonts.smallcaps,color:palette.white,stroke:palette.jet});return bar.drawImage(label,3,2),bar.drawImage(value,3+label.width+2,2),bar.drawImage(max,3+label.width+2+value.width-1,2),bar.canvas}(),stats=function(){var stats={font:fonts.numbers,color:palette.white,stroke:palette.jet},atk=renderText(unit.stats.atk,stats),def=renderText(unit.stats.def,stats),sword=drawOutline(sprites.icons.small.sword,palette.jet),shield=drawOutline(sprites.icons.small.shield,palette.jet),stats=create(sword.width+atk.width+1+shield.width+def.width,8);return stats.drawImage(sword,0,0),stats.drawImage(atk,sword.width-1,0),stats.drawImage(shield,sword.width-1+atk.width+2,0),stats.drawImage(def,sword.width-1+atk.width+2+shield.width-1,0),stats.canvas}(),element=function(){var icon=sprites.icons[unit.stats.element],element=create(icon.width+6,icon.height);return element.fillStyle=rgb.apply(void 0,_toConsumableArray(palette.cyan)),element.fillRect(0,2,icon.width+6,icon.height-4),element.fillRect(1,1,icon.width+4,icon.height-2),element.fillStyle="white",element.fillRect(1,2,icon.width+4,icon.height-4),element.drawImage(icon,3,0),element.canvas}(),width=box.width+1,content=create(width,shadow.height+2+box.height+3+stats.height);return content.drawImage(shadow,0,0),content.drawImage(name,shadow.width+2,0),content.drawImage(box,1,shadow.height+2),content.drawImage(stats,width-stats.width,shadow.height+2+box.height+2),content.drawImage(element,0,shadow.height+3+box.height),shadow=recolor$1(content.canvas,palette.cyan),(box=create(content.canvas.width+6,content.canvas.height+5)).fillStyle=rgb.apply(void 0,_toConsumableArray(palette.cyan)),box.fillRect(0,1,box.canvas.width,box.canvas.height-2),box.fillRect(1,0,box.canvas.width-2,box.canvas.height),box.fillStyle="white",box.fillRect(0,1,box.canvas.width-1,box.canvas.height-3),box.fillRect(1,0,box.canvas.width-3,box.canvas.height-1),box.drawImage(shadow,3,3),box.drawImage(content.canvas,2,2),box.canvas}(unit,sprites),expand=anims.RangeExpand.create(lift),enter=anims.PreviewEnter.create(),lift=anims.PieceLift.create();state.concurs.push(expand,enter,lift),state.selection={unit:unit},cache.selection={unit:unit,anim:lift},cache.preview={image:preview,anim:enter},cache.range=expand.range}(unit)),pointer.pressed=null}};function animating(anims,type){if(!type)return anims.length;var _iteratorNormalCompletion8=!0,_didIteratorError8=!1,_iteratorError8=void 0;try{for(var _step8,_iterator8=anims[Symbol.iterator]();!(_iteratorNormalCompletion8=(_step8=_iterator8.next()).done);_iteratorNormalCompletion8=!0){if(_step8.value.type===type)return 1}}catch(err){_didIteratorError8=!0,_iteratorError8=err}finally{try{!_iteratorNormalCompletion8&&_iterator8.return&&_iterator8.return()}finally{if(_didIteratorError8)throw _iteratorError8}}}function getPosition(y){var x=y.pageX||y.touches&&y.touches[0].pageX,y=y.pageY||y.touches&&y.touches[0].pageY;return void 0===x||void 0===y?null:{x:x,y:y}}function snapToGrid(realpos_y){var gridpos_y=game.map,gridpos_x=(realpos_y.x-window.innerWidth/2)/view.scale,realpos_y=(realpos_y.y-window.innerHeight/2)/view.scale,gridpos_x=gridpos_x+gridpos_y.width*tilesize/2-camera.pos.x,gridpos_y=realpos_y+gridpos_y.height*tilesize/2-camera.pos.y;return{x:Math.floor(gridpos_x/tilesize),y:Math.floor(gridpos_y/tilesize)}}events.resize(),window.addEventListener("resize",events.resize),window.addEventListener("mousedown",events.press),window.addEventListener("mousemove",events.move),window.addEventListener("mouseup",events.release),window.addEventListener("touchstart",events.press),window.addEventListener("touchmove",events.move),window.addEventListener("touchend",events.release),requestAnimationFrame(function update(){state.time++,state.dirty&&(state.dirty=!1,function(_y9){var sprites=_y9.sprites,state=(sprites.palette,_y9.state),cache=_y9.cache,_didIteratorError9=_y9.element,context=_didIteratorError9.getContext("2d");context.fillStyle="black",context.fillRect(0,0,_didIteratorError9.width,_didIteratorError9.height);var _view$state=_y9.state,_didIteratorError9=_view$state.camera,origin=(_view$state.selection,{x:Math.round(_y9.width/2-cache.map.width/2+_didIteratorError9.pos.x),y:Math.round(_y9.height/2-cache.map.width/2+_didIteratorError9.pos.y)}),layers={map:[],shadows:[],range:[],markers:[],pieces:[],selection:[],ui:[]};if(layers.map.push({image:cache.map,x:origin.x,y:origin.y}),cache.range){var range=cache.range,_iteratorNormalCompletion9=!0,_didIteratorError9=!1,_sprite=void 0;try{for(var _iterator9=range.squares[Symbol.iterator]();!(_iteratorNormalCompletion9=(_x6=_iterator9.next()).done);_iteratorNormalCompletion9=!0){var _y6=_x6.value,sprite=sprites.squares[_y6.type],_x6=origin.x+_y6.cell.x*tilesize,_y6=origin.y+_y6.cell.y*tilesize;layers.range.push({image:sprite,x:_x6,y:_y6})}}catch(err){_didIteratorError9=!0,_sprite=err}finally{try{!_iteratorNormalCompletion9&&_iterator9.return&&_iterator9.return()}finally{if(_didIteratorError9)throw _sprite}}}var game=_y9.game;cache.cursor&&(_sprite=sprites.select.cursor[game.phase.faction],_x9=cache.cursor,preview=origin.x+_x9.x*tilesize,_x9=origin.y+_x9.y*tilesize,(!cache.selection.path||state.time%2)&&layers.selection.push({image:_sprite,x:preview,y:_x9}));var layername,_iteratorNormalCompletion10=!0,preview=!1,_x9=void 0;try{for(var _iterator10=game.map.units[Symbol.iterator]();!(_iteratorNormalCompletion10=(_y8=_iterator10.next()).done);_iteratorNormalCompletion10=!0){var anim,ring=_y8.value,_sprite2=sprites.pieces[ring.faction][ring.type],z=ring.cell,_x8=origin.x+z.x*tilesize,_y8=origin.y+z.y*tilesize,z=0,layer="pieces";game.phase.faction===ring.faction&&(game.phase.pending.includes(ring)?cache.selection&&cache.selection.unit===ring||(anim=sprites.select.glow[ring.faction],layers.pieces.push({image:anim,x:_x8,y:_y8-3,z:-1}),layer="selection"):_sprite2=sprites.pieces.done[ring.faction][ring.type]),cache.selection&&cache.selection.unit===ring&&(layer="selection",cache.selection.path?(anim=cache.selection.anim,_x8=origin.x+anim.cell.x*tilesize,_y8=origin.y+anim.cell.y*tilesize):(z=Math.round(cache.selection.anim.y),ring=sprites.select.ring[ring.faction],layers.pieces.push({image:ring,x:_x8-2,y:_y8-3,z:-1}))),layers[layer].push({image:_sprite2,x:_x8+1,y:_y8-1,z:z}),layers.shadows.push({image:sprites.pieces.shadow,x:_x8+1,y:_y8+3})}}catch(err){preview=!0,_x9=err}finally{try{!_iteratorNormalCompletion10&&_iterator10.return&&_iterator10.return()}finally{if(preview)throw _x9}}for(layername in cache.preview&&(preview=cache.preview,_x9=Math.round(lerp_1(-preview.image.width,4,preview.anim.x)),_y9=_y9.height-preview.image.height+1-4,layers.ui.push({image:preview.image,x:_x9,y:_y9})),layers){(layer=layers[layername]).sort(zsort);var _iteratorNormalCompletion11=!0,_didIteratorError11=!1,_iteratorError11=void 0;try{for(var _iterator11=layer[Symbol.iterator]();!(_iteratorNormalCompletion11=(_y10=_iterator11.next()).done);_iteratorNormalCompletion11=!0){var node=_y10.value,_x10=Math.round(node.x),_y10=Math.round(node.y-(node.z||0));context.drawImage(node.image,_x10,_y10)}}catch(err){_didIteratorError11=!0,_iteratorError11=err}finally{try{!_iteratorNormalCompletion11&&_iterator11.return&&_iterator11.return()}finally{if(_didIteratorError11)throw _iteratorError11}}}}(view)),camera.pos.x+=(camera.target.x-camera.pos.x)/4,camera.pos.y+=(camera.target.y-camera.pos.y)/4,Math.round(cache.camera.x)===Math.round(camera.pos.x)&&Math.round(cache.camera.y)===Math.round(camera.pos.y)||(cache.camera.x=camera.pos.x,cache.camera.y=camera.pos.y,state.dirty=!0);for(var i=0;i<state.concurs.length;i++){var unit,_anim=state.concurs[i];anims[_anim.type].update(_anim),_anim.done&&(state.concurs.splice(i--,1),"RangeShrink"===_anim.type?cache.range=null:"PreviewExit"===_anim.type?cache.preview=null:"PieceDrop"===_anim.type?(cache.selection=null,cache.cursor=null):"PieceMove"===_anim.type&&(function(unit,dest,map){walkable(map,unit.cell)&&(unit.cell=dest)}(unit=state.selection.unit,_anim.cell,map),endTurn(unit,game),state.selection=null,cache.selection=null,cache.cursor=null)),state.dirty=!0}state.consecs[0];requestAnimationFrame(update)})}function zsort(a,b){return a.y+a.image.height/2-(b.y+b.image.height/2)}var path,state=function(map){var units=map.units.map(function(unit){return function(name,type,faction,cell,stats){return{name:name,type:type,faction:faction,cell:cell,stats:stats}}.apply(void 0,_toConsumableArray(unit))});return{map:{width:map.width,height:map.height,units:units},phase:{faction:"player",pending:units.filter(function(unit){return"player"===unit.faction})}}}({id:"test",width:9,height:9,units:[["Arthur","soldier","enemy",{x:1,y:4},{hp:11,atk:13,def:10,element:"holy"}],["Percy","knight","enemy",{x:3,y:3},{hp:12,atk:9,def:11,element:"plant"}],["Merlin","mage","enemy",{x:2,y:6},{hp:7,atk:11,def:3,element:"ice"}],["Gilda","fighter","player",{x:5,y:5},{hp:13,atk:14,def:7,element:"fire"}],["Kid","thief","player",{x:6,y:2},{hp:8,atk:7,def:5,element:"dark"}],["Napi","archer","player",{x:4,y:1},{hp:9,atk:12,def:9,element:"volt"}]]});path="sprites.png",new Promise(function(resolve,reject){var image=new Image;image.src=path,image.onload=function(){resolve(image)},image.onerror=function(){reject(new Error("Failed to load image `"+path+"`"))}}).then(function(view){view=function(width,height,sprites){return{native:{width:width,height:height},width:window.innerWidth,height:window.innerHeight,scale:1,sprites:sprites,element:document.createElement("canvas"),state:{consecs:[],concurs:[],time:0,dirty:!1,camera:{pos:{x:0,y:0},target:{x:0,y:0}},selection:null,pointer:{pos:null,clicking:!1,pressed:null,offset:null}},cache:{map:null,selection:null,camera:{x:0,y:0},cursor:null},range:null,game:null}}(160,160,normalize(view));document.body.appendChild(view.element),init(view,state)})}();