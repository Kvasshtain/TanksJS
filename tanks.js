function inherit(p) {
    if(p == null) throw TypeError();
    if(Object.create)
        return Object.create(p);
    var t = typeof p;
    if (t !== "object" && t !== "function") throw TypeError();
    function f() {};
    f.prototype = p;

    return new f();
}

//=====================================================================

function extend(o, p) {
    for(prop in p) {
        o[prop] = p[prop];
    }
    return o;
}

//=====================================================================

function isInteger(num) {
    return (num ^ 0) === num;
}

//=====================================================================

var direction = {
    up:"up",
    down:"down",
    left:"left",
    right:"right",
    upRight:"upRight",
    downRight: "downRight",
    downLeft: "downLeft",
    upLeft: "upLeft",
    validate: function (value) {
        for(var dir in this){
            if(dir == value) return true;
        }
        return false;
    }
}

Object.freeze(direction);

//=====================================================================

function MapCell(xIndex, yIndex) {
    if (!isInteger(xIndex))
        throw TypeError("xIndex is not int");

    if (!isInteger(yIndex))
        throw TypeError("yIndex is not int");

    this.xIndex = xIndex;
    this.yIndex = yIndex;
}

MapCell.prototype = {
    constructor : MapCell,

    identifyDirectionToNextCell : function (nextCell) {
        if (!(nextCell instanceof MapCell))
            throw TypeError("nextCell is not MapCell");

        if ((this.xIndex > nextCell.xIndex) && (this.yIndex > nextCell.yIndex))
            return "upLeft";

        if ((this.xIndex == nextCell.xIndex) && (this.yIndex > nextCell.yIndex))
            return "up";

        if ((this.xIndex < nextCell.xIndex) && (this.yIndex > nextCell.yIndex))
            return "upRight";

        if ((this.xIndex < nextCell.xIndex) && (this.yIndex == nextCell.yIndex))
            return "right";

        if ((this.xIndex < nextCell.xIndex) && (this.yIndex < nextCell.yIndex))
            return "downRight";

        if ((this.xIndex == nextCell.xIndex) && (this.yIndex < nextCell.yIndex))
            return "down";

        if ((this.xIndex > nextCell.xIndex) && (this.yIndex < nextCell.yIndex))
            return "downLeft";

        if ((this.xIndex > nextCell.xIndex) && (this.yIndex == nextCell.yIndex))
            return "left";
    }
}

MapCell.areEqual = function (firstCell, secondCell) {

    if (!firstCell instanceof MapCell)
        throw new TypeError("firstCell is not MapCell");

    if (!secondCell instanceof MapCell)
        throw new TypeError("secondCell is not MapCell");

    if ((firstCell.xIndex == secondCell.xIndex) && (firstCell.yIndex == secondCell.yIndex)){
        return true;
    }

    return false;
}

//=====================================================================

function MapBlock(mapCell, isPassable) {

    if (!mapCell instanceof MapCell)
        throw new TypeError("currentMapCell is not MapCell");

    if ((typeof isPassable) != "boolean")
        throw TypeError("isPassable isn't boolean");

    this.mapCell = mapCell;
    this.isPassable = isPassable;
}

MapBlock.prototype = {
    constructor : MapBlock
}

//=====================================================================

function Unit(name, currentMapCell, destinationMapCell, orientation, image) {

    if (!direction.validate(orientation))
        throw TypeError("currentDirection is not direction");

    if (!currentMapCell instanceof MapCell && currentMapCell != undefined)
        throw new TypeError("currentMapCell is not MapCell");

    if (!destinationMapCell instanceof MapCell && destinationMapCell != undefined)
        throw new TypeError("destinationMapCell is not MapCell or undefined");

    if (!image instanceof Image)
        throw TypeError("image is not Image");

    this.name = name;
    this.currentMapCell = currentMapCell;
    this.nextMapCell = currentMapCell;
    this.destinationMapCell = destinationMapCell;
    this.orientation = orientation;
    this.image = image;
    this.renderingX = undefined;
    this.renderingY = undefined;
    this.movementPath = undefined;
    this.movementPathStepIndex = 0;
}

Unit.prototype ={
    constructor: Unit
}

//=====================================================================

function BattleMap(columnNum, rowNum) {

    if (!isInteger(columnNum))
        throw TypeError("columnNum is not int");

    if (!isInteger(rowNum))
        throw TypeError("rowNum is not int");

    if (columnNum <= 0)
        throw TypeError("columnNum <= 0");

    if (rowNum <= 0)
        throw TypeError("rowNum <= 0");

    this.columnNum = columnNum;
    this.rowNum = rowNum;

    // this.mapBlock = new Array();
    // for(var i = 0; i < rowNum; i++) {
    //     this.mapBlock[i] = new Array();
    //     for (var j = 0; j < columnNum; j++) {
    //         this.mapBlock[i][j] = null;
    //     }
    // }
}

BattleMap.prototype ={
    constructor: BattleMap,

    isCellInMap: function(mapCell)
    {
        if (!(mapCell instanceof MapCell))
            throw TypeError("This is not MapCell");

        if (mapCell.xIndex < 0)
            return false;

        if (mapCell.yIndex < 0)
            return false;

        if (mapCell.xIndex >= this.columnNum)
            return false;

        if (mapCell.yIndex >= this.rowNum)
            return false;

        return true;
    }
}

//=====================================================================

function GameDrawer(cellWidth, cellHeight, battleMap, units) {

    if (!(units instanceof Array))
        throw TypeError("This is not Array");

    for (var i = 0; i < units.length; i++)
    {
        if (!(units[i] instanceof Unit))
            throw TypeError("This is not Unit");
    }

    if (!(battleMap instanceof BattleMap))
        throw TypeError("This is not BattleMap");

    if (cellWidth === undefined)
        throw TypeError("cellWidth === undefined");

    if (cellHeight === undefined)
        throw TypeError("cellHeight === undefined");

    if (cellWidth <= 0)
        throw RangeError("cellWidth <= 0");

    if (cellHeight <= 0)
        throw RangeError("cellHeight <= 0");

    if (!isFinite(cellWidth))
        throw RangeError();

    if (!isFinite(cellHeight))
        throw RangeError("cellHeight is not finite");

    this.cellWidth = cellWidth;
    this.cellHeight = cellHeight;
    this.battleMap = battleMap;
    this.units = units;

    var canvas,
        body,
        cursorLayer;


    canvas = document.createElement('canvas');
    this.canvas = canvas;
    canvas.id = "BattleMap";
    canvas.width = cellWidth * battleMap.columnNum;
    canvas.height = cellHeight * battleMap.rowNum;
    canvas.style.zIndex = 8;
    canvas.style.position = "absolute";
    canvas.style.border = "3px solid";

    body = document.getElementsByTagName("body")[0];
    body.appendChild(canvas);

    cursorLayer = document.getElementById("CursorLayer");

    console.log(cursorLayer);

    this.drawArea = canvas.getContext("2d");
}

GameDrawer.prototype ={
    constructor: GameDrawer,

    drawMap: function () {

        var width = this.cellWidth - 1,
            height = this.cellHeight - 1;

        this.drawArea.fillStyle = "green";

        for(var i = 0; i < this.battleMap.rowNum; i++) {
            for (var j = 0; j < this.battleMap.columnNum; j++) {

                y = this.cellHeight * i;
                x = this.cellWidth * j;

                this.drawArea.fillRect(x, y, width, height);
            }
        }
    },

    drawUnits: function () {

        var width = this.cellWidth - 1,
            height = this.cellHeight - 1,
            x,
            y,
            image,
            orientation;

        for(var i = 0; i < this.units.length; i++){

            if ((this.units[i].renderingX === undefined) || (this.units[i].renderingY === undefined)) {
                this.units[i].renderingX = this.cellHeight * this.units[i].currentMapCell.xIndex;
                this.units[i].renderingY = this.cellWidth * this.units[i].currentMapCell.yIndex;
            }

            x = this.units[i].renderingX;
            y = this.units[i].renderingY;

            orientation = this.units[i].orientation;

            image = this.units[i].image;
            this.drawArea.save();
            this.drawArea.translate(x + width/2,y + height/2);
            switch (orientation) {
                case "up":
                    this.drawArea.rotate(-Math.PI / 2.0);
                    break;
                case "down":
                    this.drawArea.rotate(Math.PI / 2.0);
                    break;
                case "left":
                    this.drawArea.rotate(Math.PI);
                    break;
                case "upRight":
                    this.drawArea.rotate(-Math.PI / 4.0);
                    break;
                case "downRight":
                    this.drawArea.rotate(Math.PI / 4.0);
                    break;
                case "downLeft":
                    this.drawArea.rotate(3 * Math.PI / 4.0);
                    break;
                case "upLeft":
                    this.drawArea.rotate(3 * -Math.PI / 4.0);
                    break;
            }
            this.drawArea.translate(-(x + width/2),-(y + height/2));
            this.drawArea.drawImage(image, x, y, width, height);
            this.drawArea.restore();
        }
    }
}

//=====================================================================

function PathFinder(battleMap, unitFinder) {

    if(!(battleMap instanceof BattleMap))
        throw TypeError("This is not BattleMap");

    if (!(unitFinder instanceof UnitFinder))
        throw TypeError("unitFinder is not UnitFinder");

    this.battleMap = battleMap;
    this.unitFinder = unitFinder;
}

PathFinder.prototype = {
    constructor : PathFinder,

    // _calcDistance : function (startCell, destinationCell) {
    //     return Math.abs(destinationCell.xIndex - startCell.xIndex) + Math.abs(destinationCell.yIndex - startCell.yIndex);
    // },

    _findSurroundingCells : function (cell) {
        var leftX = cell.xIndex - 1,
            rightX = cell.xIndex + 1,
            upY = cell.yIndex - 1,
            downY = cell.yIndex + 1,
            currentCell,
            surroundingCells = [];

        for (var y = upY; y <= downY; y++) {
            for (var x = leftX; x <= rightX; x++) {
                if (x == cell.xIndex && y == cell.yIndex) continue;
                currentCell = new MapCell(x,y);
                if (!this.battleMap.isCellInMap(currentCell)) continue;
                surroundingCells.push(currentCell);
            }
        }

        return surroundingCells;
    },

    _throwOutObstacles : function (cells) {
        for (var i = 0; i < cells.length; i++){
            if (this.unitFinder.findByCoordinates(cells[i]) !== undefined) {
                cells.splice(i, 1);
                i--;
            }
        }
    },
    
    _throwOutCloseCells : function (cells, closeCells) {
        for (var j = 0; j < closeCells.length; j++) {
            for(var i = 0; i < cells.length; i++) {
                if(MapCell.areEqual(cells[i], closeCells[j])) {
                    cells.splice(i,1);
                    i--;
                }
            }
        }
    },

    // _findNearestToDestinationCell : function (cells, destinationCell) {
    //     var minDistance = this._calcDistance(cells[0], destinationCell),
    //         nearestToDestinationCell = cells[0],
    //         distance = 0;
    //     for (var i = 0; i < cells.length; i++){
    //         distance = this._calcDistance(cells[i], destinationCell);
    //         if (distance < minDistance){
    //             minDistance = distance;
    //             nearestToDestinationCell = cells[i];
    //         }
    //     }
    //     return nearestToDestinationCell;
    // },

    _heuristicFunction : function (firstCell, secondCell) {
        var x = secondCell.xIndex - firstCell.xIndex,
            y = secondCell.yIndex - firstCell.yIndex;
        return Math.sqrt(x*x + y*y);
        //return Math.abs(x) + Math.abs(y);
    },

    // _min1d : function (array1d) {
    //     return Math.min.apply(Math, array1d);
    // },
    //
    // _min2d : function (array2d) {
    //     var minimums = [];
    //
    //     for(var i = 0; i<array2d.length; i++){
    //         minimums[i] = this._min1d(array2d[i]);
    //     }
    //
    //     return this._min1d(minimums);
    // },

    _findCellWithMinCurrentToDestinationWeight : function (currentToDestinationWeights, openCells) {
        var minXIndex,
            minYIndex,
            currentWeights,
            openCellsMinIndex,
            min = this.battleMap.rowNum + this.battleMap.columnNum;

        for (var i = 0; i < openCells.length; i++) {
            currentWeights = currentToDestinationWeights[openCells[i].xIndex][openCells[i].yIndex];
            if (currentWeights < min) {
                min = currentWeights;
                minXIndex = openCells[i].xIndex;
                minYIndex = openCells[i].yIndex;
                openCellsMinIndex = i;
            }
        }

        // for (var i = 0; i < currentToDestinationWeights.length; i++) {
        //     for (var j = 0; j < currentToDestinationWeights[i].length; j++) {
        //         if (currentToDestinationWeights[i][j] < min) {
        //             min = currentToDestinationWeights[i][j];
        //             minXIndex = i;
        //             minYIndex = j;
        //         }
        //     }
        // }

        openCells.splice(openCellsMinIndex,1);
        return new MapCell(minXIndex, minYIndex);
    },

    // _calcCurrentToDestinationWeight : function (currentCell, destinationCell) {
    //
    // },
    //
    // _calcCurrentToNextWeight : function (currentCell, nextCell) {
    //
    // },

    _removeCertainCellFromArray : function (cells, cell) {
        for(var i = 0; i < cells.length; i++) {
            if(MapCell.areEqual(cells[i], cell)) {
                cells.splice(i,1);
                return;
            }
        }
    },

    _isCellInOpen : function (cell, openCells) {
        for(var i = 1; i < openCells.length; i++) {
            if(MapCell.areEqual(openCells[i], cell)) {
                return true;
            }
        }
        return false;
    },
    
    _createNewArray2dWithMapSize : function () {
        var array2d = new Array();
        for(var i = 0; i < this.battleMap.columnNum; i++){
            array2d.push(new Array());
            for(var j = 0; j < this.battleMap.rowNum; j++) {
                array2d[i].push(undefined);
            }
        }

        return array2d;
    },

    _findPreviousNeighboringCell : function (cell, cellsArray) {
        var cellIndex;

        for(var i = cellsArray.length - 1; i >= 0; i--) {
            if (MapCell.areEqual(cellsArray[i], cell)) {
                cellIndex = i;
                break;
            }
        }

        for(var i = cellIndex - 1; i >= 0; i--) {
            if (MapCell.areEqual(cellsArray[i], cell)) {
                continue;
            }

            if ((Math.abs(cellsArray[i].xIndex - cell.xIndex) <= 1)
               && (Math.abs(cellsArray[i].yIndex - cell.yIndex) <= 1)) {
                return cellsArray[i];
            }
        }

        return undefined;
    },

    _getWayFromCells : function (fromCells) {
        var way = [],
            currentIndex = fromCells.length - 1,
            firstCell = fromCells[0],
            currentCell = fromCells[currentIndex];

        way.unshift(currentCell);

        while (!MapCell.areEqual(currentCell, firstCell)) {
            currentCell = this._findPreviousNeighboringCell(currentCell, fromCells);
            way.unshift(currentCell);
        }

        return way;
    },

    findPath : function (startCell, destinationCell) {

        if (!(startCell instanceof MapCell))
            throw TypeError("This is not MapCell");

        if (!(destinationCell instanceof MapCell))
            throw TypeError("This is not MapCell");

        if (!this.battleMap.isCellInMap(startCell))
            throw RangeError("startCell out of battleMap");

        if (!this.battleMap.isCellInMap(destinationCell))
            throw RangeError("destinationCell out of battleMap");

        var openCells = [],
            closeCells = [],
            cameFromCells = [],
            resultWay,
            startToCurrentWeights = this._createNewArray2dWithMapSize(),
            currentToDestinationWeights = this._createNewArray2dWithMapSize(),
            currentCell,
            surroundingCells,
            tempStartToCurrentWeights,
            neighboringCell;

        openCells.push(startCell);
        startToCurrentWeights[startCell.xIndex][startCell.yIndex] = 0;
        currentToDestinationWeights[startCell.xIndex][startCell.yIndex]
            = startToCurrentWeights[startCell.xIndex][startCell.yIndex] + this._heuristicFunction(startCell, destinationCell);

        while (openCells.length > 0) {

            currentCell = this._findCellWithMinCurrentToDestinationWeight(currentToDestinationWeights, openCells);
            if (MapCell.areEqual(currentCell, destinationCell)) {
                cameFromCells.push(destinationCell);
                resultWay = this._getWayFromCells(cameFromCells);
                return resultWay;
            }
            this._removeCertainCellFromArray(openCells, currentCell);
            closeCells.push(currentCell);
            surroundingCells = this._findSurroundingCells(currentCell);
            this._throwOutObstacles(surroundingCells);
            this._throwOutCloseCells(surroundingCells, closeCells);
            for(var i = 0; i < surroundingCells.length; i++) {
                neighboringCell = surroundingCells[i];
                tempStartToCurrentWeights = startToCurrentWeights[currentCell.xIndex][currentCell.yIndex] + 1;
                // 1 - это дорога до соседа
                if (!this._isCellInOpen(neighboringCell, openCells)
                    || tempStartToCurrentWeights < startToCurrentWeights[neighboringCell.xIndex][neighboringCell.yIndex]) {
                    cameFromCells.push(currentCell);
                    startToCurrentWeights[neighboringCell.xIndex][neighboringCell.yIndex] = tempStartToCurrentWeights;
                    currentToDestinationWeights[neighboringCell.xIndex][neighboringCell.yIndex] =
                        tempStartToCurrentWeights + this._heuristicFunction(neighboringCell, destinationCell);
                    openCells.push(neighboringCell);
                }
                // if (!this._isCellInOpen(neighboringCell, openCells)) {
                //     openCells.push(neighboringCell);
                // }
            }
        }

        return undefined;

        // if ((currentCell.xIndex != destinationCell.xIndex)
        // || (currentCell.yIndex != destinationCell.yIndex)){
        //     surroundingCells = this._findSurroundingCells(currentCell);
        //     this._throwOutObstacles(surroundingCells);
        //     openCells.push(surroundingCells);
        //     currentCell = this._findNearestToDestinationCell(surroundingCells, destinationCell);
        //     closeCells.push(currentCell);
        // }

        return closeCells;
    }
}

//=====================================================================

function UnitsMover(units, pathFinder, cellWidth, cellHeight){

    if (!(units instanceof Array) && !(units instanceof Object))
        throw TypeError("This is not Array or Object");

    for (var i = 0; i < units.length; i++) {
        if (!(units[i] instanceof Unit))
            throw TypeError("This is not Unit");
    }

    if (!(pathFinder instanceof PathFinder))
        throw TypeError("This is not PathFinder");

    if (cellWidth === undefined)
        throw TypeError("cellWidth === undefined");

    if (cellHeight === undefined)
        throw TypeError("cellHeight === undefined");

    if (cellWidth <= 0)
        throw RangeError("cellWidth <= 0");

    if (cellHeight <= 0)
        throw RangeError("cellHeight <= 0");

    this.units = units;
    this.pathFinder = pathFinder;
    this.cellWidth = cellWidth;
    this.cellHeight = cellHeight;
}

UnitsMover.prototype = {
    constructor : UnitsMover,

    _turnAndMoveUnit : function(unit, nextCell) {

        unit.orientation = unit.currentMapCell.identifyDirectionToNextCell(nextCell);

        unit.nextMapCell = nextCell;
    },

    moveUnits : function () {
        var length = this.units.length;

        for (var unitIndex = 0; unitIndex < length; unitIndex++) {
            var unit = this.units[unitIndex],
                closeCells;

            if (MapCell.areEqual(unit.currentMapCell, unit.destinationMapCell)) {
                continue;
            }

            if ((unit.currentMapCell.xIndex != unit.nextMapCell.xIndex) || (unit.currentMapCell.yIndex != unit.nextMapCell.yIndex)){
                this._moveUnitsBetweenCells(unitIndex);
                continue;
            }

            // closeCells = this.pathFinder.findPath(unit.currentMapCell, unit.destinationMapCell);
            // unit.movementPath = closeCells;
            // unit.movementPathStepIndex = 0;

            if (unit.movementPath != undefined) {
                this._turnAndMoveUnit(unit, unit.movementPath[unit.movementPathStepIndex]);
                if (unit.movementPathStepIndex < unit.movementPath.length - 1) {
                    unit.movementPathStepIndex++;
                }
            }
        }
    },

    _moveUnitsBetweenCells : function (i) {
        var orientation;

        if (MapCell.areEqual(this.units[i].currentMapCell, this.units[i].nextMapCell)) {
            return;
        }

        orientation = this.units[i].orientation;

        switch (orientation) {
            case "up":
                this.units[i].renderingY--;
                break;
            case "down":
                this.units[i].renderingY++;
                break;
            case "left":
                this.units[i].renderingX--;
                break;
            case "right":
                this.units[i].renderingX++;
                break;
            case "upRight":
                this.units[i].renderingX++;
                this.units[i].renderingY--;
                break;
            case "downRight":
                this.units[i].renderingX++;
                this.units[i].renderingY++;
                break;
            case "downLeft":
                this.units[i].renderingX--;
                this.units[i].renderingY++;
                break;
            case "upLeft":
                this.units[i].renderingX--;
                this.units[i].renderingY--;
                break;
        }

        if ((this.cellWidth * this.units[i].nextMapCell.xIndex == this.units[i].renderingX)
            && (this.cellHeight * this.units[i].nextMapCell.yIndex == this.units[i].renderingY)){
            this.units[i].currentMapCell.xIndex = this.units[i].nextMapCell.xIndex;
            this.units[i].currentMapCell.yIndex = this.units[i].nextMapCell.yIndex
        }
    }
}

//=====================================================================

function UnitFinder(units){

    if (!(units instanceof Array) && !(units instanceof Object))
        throw TypeError("This is not Array or Object");

    for (var i = 0; i < units.length; i++){
        if (!(units[i] instanceof Unit))
            throw TypeError("This is not Unit");
    }

    this.units = units;
}

UnitFinder.prototype = {
    constructor : UnitFinder,

    findByCoordinates : function (mapCell) {

        if (!(mapCell instanceof MapCell))
            throw TypeError("This is not MapCell");

        for (var unitIndex = 0; unitIndex < this.units.length; unitIndex++){

            if (MapCell.areEqual(this.units[unitIndex].currentMapCell, mapCell)) {
                return unitIndex;
            }
        }

        return undefined;
    }
}

//=====================================================================

function GameProperty(currentKey, selectedUnitIndex, units, unitFinder, pathFinder, leftButtonSelectedCell, rightButtonSelectedCell){

    if (!(units instanceof Array) && units !== undefined)
        throw TypeError("units is not Array or undefined");

    if (!(unitFinder instanceof UnitFinder))
        throw TypeError("unitFinder is not UnitFinder");

    this.currentKey = currentKey;
    this.leftButtonSelectedCell = leftButtonSelectedCell;
    this.rightButtonSelectedCell = rightButtonSelectedCell;
    this.selectedUnitIndex = selectedUnitIndex;
    this.units = units;
    this.unitFinder = unitFinder;
    this.pathFinder = pathFinder;
    this.gameState = new InitialState();
}

GameProperty.prototype = {
    constructor : GameProperty
}

//=====================================================================

function GameState() {
    if (this.constructor === GameState)
        throw Error("Can't instantiate abstract class!");
}

GameState.prototype = {
    constructor : GameState,

    handleUserAction : function (gameProperty) {
        throw Error("Abstract method!");
    }
}

function InitialState() {
}

InitialState.prototype = inherit(GameState.prototype);
extend(InitialState.prototype, {
    constructor : InitialState,
    handleUserAction : function (gameProperty) {
        if (!(gameProperty instanceof GameProperty))
            throw TypeError("gameProperty is not GameProperty");

        if (gameProperty.leftButtonSelectedCell === undefined)
            return;

        gameProperty.gameState = new UserSelectCellState();
        return;
    }
})

function UserSelectCellState() {
}

UserSelectCellState.prototype = inherit(GameState.prototype);
extend(UserSelectCellState.prototype, {
    constructor : UserSelectCellState,
    handleUserAction : function (gameProperty) {
        if (!(gameProperty instanceof GameProperty))
            throw TypeError("This is not GameProperty");

        if (gameProperty.leftButtonSelectedCell === undefined) {
            gameProperty.gameState = new InitialState();
            return;
        }

        gameProperty.selectedUnitIndex = gameProperty.unitFinder.findByCoordinates(gameProperty.leftButtonSelectedCell);

        if (gameProperty.selectedUnitIndex !== undefined){
            gameProperty.gameState = new UserSelectUnitState();
            gameProperty.leftButtonSelectedCell = undefined;
            return;
        }

        gameProperty.gameState = new InitialState();
        gameProperty.leftButtonSelectedCell = undefined;
        return;
    }
})


function UserSelectUnitState( ) {
}

UserSelectUnitState.prototype = inherit(GameState.prototype);
extend(UserSelectUnitState.prototype, {
    constructor : UserSelectUnitState,
    handleUserAction : function (gameProperty) {
        var unit,
            closeCells;

        if (!(gameProperty instanceof GameProperty))
            throw TypeError("This is not GameProperty");

        if (gameProperty.selectedUnitIndex === undefined){
            gameProperty.gameState = new InitialState();
            return;
        }

        if (gameProperty.leftButtonSelectedCell === undefined){
            return;
        }

        unit = gameProperty.units[gameProperty.selectedUnitIndex];

        unit.destinationMapCell = gameProperty.leftButtonSelectedCell;
        closeCells = gameProperty.pathFinder.findPath(unit.currentMapCell, unit.destinationMapCell);
        unit.movementPath = closeCells;
        unit.movementPathStepIndex = 1; //!!!!!!!!!
        gameProperty.leftButtonSelectedCell = undefined;
        gameProperty.gameState = new InitialState();
        return;
    }
})

//=====================================================================

function gameRoutine(){

    var image = new Image(),
        moveDelay = 10,
        unit0 = new Unit("pz3", new MapCell(1, 1), new MapCell(1, 1), "upRight", image),
        unit1 = new Unit("pz3", new MapCell(2, 1), new MapCell(2, 1), "upLeft", image),
        unit2 = new Unit("pz3", new MapCell(3, 1), new MapCell(3, 1), "upLeft", image),
        unit3 = new Unit("pz3", new MapCell(4, 1), new MapCell(4, 1), "upLeft", image),
        unit4 = new Unit("pz3", new MapCell(5, 1), new MapCell(5, 1), "upLeft", image),
        unit5 = new Unit("pz3", new MapCell(6, 1), new MapCell(6, 1), "upLeft", image),
        unit6 = new Unit("pz3", new MapCell(7, 1), new MapCell(7, 1), "upLeft", image),
        unit7 = new Unit("pz3", new MapCell(8, 1), new MapCell(8, 1), "upLeft", image),
        unit8 = new Unit("pz3", new MapCell(9, 1), new MapCell(9, 1), "upLeft", image),
        unit9 = new Unit("pz3", new MapCell(10, 1), new MapCell(10, 1), "upLeft", image),
        unit10 = new Unit("pz3", new MapCell(11, 1), new MapCell(11, 1), "upLeft", image),
        unit11 = new Unit("pz3", new MapCell(12, 1), new MapCell(12, 1), "upLeft", image),
        unit12 = new Unit("pz3", new MapCell(13, 1), new MapCell(13, 1), "upLeft", image),
        unit13 = new Unit("pz3", new MapCell(14, 1), new MapCell(14, 1), "upLeft", image),
        unit14 = new Unit("pz3", new MapCell(15, 1), new MapCell(15, 1), "upLeft", image),
        unit15 = new Unit("pz3", new MapCell(16, 1), new MapCell(16, 1), "upLeft", image),
        unit16 = new Unit("pz3", new MapCell(17, 1), new MapCell(17, 1), "upLeft", image),
        unit17 = new Unit("pz3", new MapCell(18, 1), new MapCell(18, 1), "upLeft", image),
        units = [unit0, unit1, unit2, unit3, unit4, unit5, unit6, unit7, unit8, unit9, unit10, unit11, unit12, unit13, unit14, unit15, unit16, unit17],
        //units = [unit0],
        cellWidth = 50,
        cellHeight = 50,
        columnNum = 20,
        rowNum = 20,
        battleMap = new BattleMap(columnNum, rowNum),
        gameDrawer = new GameDrawer(cellWidth, cellHeight, battleMap, units),
        unitFinder = new UnitFinder(units),
        pathFinder = new PathFinder(battleMap, unitFinder),
        unitsMover = new UnitsMover(units, pathFinder, cellWidth, cellHeight),
        gameProperty = new GameProperty("0", 0, units, unitFinder, pathFinder, undefined, undefined);

    image.src = 'Pz-3.png';

    function getChar(event) {
        gameProperty.currentKey = event.which;
    }

    document.onkeydown = getChar;

    function gameClickHandler(event) {

        var currentX,
            currentY,
            selectedCell;

        cellWidth = gameDrawer.cellWidth;
        cellHeight = gameDrawer.cellHeight;
        currentX = Math.floor(event.offsetX / cellWidth);
        currentY = Math.floor(event.offsetY / cellHeight);

        if (event.which == 1)
        {
            selectedCell = new MapCell(currentX, currentY);
            gameProperty.leftButtonSelectedCell = selectedCell;
        }

        if (event.which == 2)
        {
            selectedCell = new MapCell(currentX, currentY);
            gameProperty.rightButtonSelectedCell = selectedCell;
        }
    }

    gameDrawer.canvas.onclick = gameClickHandler;

    function updateGame() {

        gameDrawer.drawMap();
        gameProperty.gameState.handleUserAction(gameProperty);
        unitsMover.moveUnits();
        gameDrawer.drawUnits();
    }

    setInterval(updateGame, moveDelay);
}

gameRoutine();





