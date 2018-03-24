// function enumeration(namesToValue) {
//
//     var enumeration = function () {
//         throw "Нельзя создать экземпляр класса Enumeration";
//     }
//
//     var proto = enumeration.prototype = {
//         constructor: enumeration,
//         toString: function () { return this.name;},
//         valueOf: function () { return this.value; },
//         toJSON: function () { return this.name; }
//     }
//
//     enumeration.values = [];
//
//     for(name in namesToValue) {
//         var e = inherit(proto);
//         e.name = name;
//         e.value = namesToValue[name];
//         enumeration[name] = e;
//         enumeration.values.push(e);
//     }
//
//     enumeration.foreach = function (f,c) {
//         for(var i = 0; i < this.values.length; i++) f.call(c,this.values[i]);
//     }
//
//     return enumeration;
// }


// if (cellWidth <= 0)
//     throw RangeError();
//
// if (cellHeight <= 0)
//     throw RangeError();
//
// if (!isFinite(cellWidth))
//     throw RangeError();
//
// if (!isFinite(cellHeight))
//     throw RangeError();

// map.cellWidth = cellWidth;
// map.cellHeight = cellHeight;
//
//
//
//
// var canvas = document.createElement('canvas');
//
// canvas.id = "BattleMap";
// canvas.width = 1000;
// canvas.height = 1000;
// canvas.style.zIndex = 8;
// canvas.style.position = "absolute";
// canvas.style.border = "3px solid";
//
//
// var body = document.getElementsByTagName("body")[0];
// body.appendChild(canvas);
//
// cursorLayer = document.getElementById("CursorLayer");
//
// console.log(cursorLayer);
//
// // below is optional
//
// var ctx = canvas.getContext("2d");
// ctx.fillStyle = "rgba(255, 0, 0)";
// ctx.fillRect(100, 100, 200, 200);








// function KeyboardUnitMover(battleMap, units, gameState) {
//
//     if (!(units instanceof Array))
//         throw TypeError("This is not Array");
//
//     for (var i = 0; i < units.length; i++)
//     {
//         if (!(units[i] instanceof Unit))
//             throw TypeError("This is not Unit");
//     }
//
//     if (!(battleMap instanceof BattleMap))
//         throw TypeError("This is not BattleMap");
//
//     if (!(gameState instanceof GameProperty))
//         throw TypeError("This is not GameProperty");
//
//     this.battleMap = battleMap;
//     this.units = units;
//     this.gameState = gameState;
// }
//
// KeyboardUnitMover.prototype = {
//     constructor : KeyboardUnitMover,
//
//     moveUnit : function () {
//
//         var selectedUnitIndex = this.gameState.selectedUnitIndex,
//             currentKey = this.gameState.currentKey;
//
//         switch (currentKey) {
//             case 87:
//                 this.units[selectedUnitIndex].orientation = "up";
//                 this.units[selectedUnitIndex].moveUp();
//                 break;
//             case 83:
//                 this.units[selectedUnitIndex].orientation = "down";
//                 this.units[selectedUnitIndex].moveDown();
//                 break;
//             case 65:
//                 this.units[selectedUnitIndex].orientation = "left";
//                 this.units[selectedUnitIndex].moveLeft();
//                 break;
//             case 68:
//                 this.units[selectedUnitIndex].orientation = "right"
//                 this.units[selectedUnitIndex].moveRight();
//                 break;
//         }
//
//         this.gameState.currentKey = currentKey = null;
//     }
// }





// moveUp : function () {
//     this.currentMapCell.yIndex--;
// },
//
// moveDown : function() {
//     this.currentMapCell.yIndex++;
// },
//
// moveLeft : function () {
//     this.currentMapCell.xIndex--;
// },
//
// moveRight : function () {
//     this.currentMapCell.xIndex++;
// },
//
// moveUpRight: function () {
//     this.moveUp();
//     this.moveRight();
// },
//
// moveDownRight : function () {
//     this.moveDown();
//     this.moveRight();
// },
//
// moveDownLeft : function () {
//     this.moveDown();
//     this.moveLeft();
// },
//
// moveUpLeft : function () {
//     this.moveUp();
//     this.moveLeft();
// }