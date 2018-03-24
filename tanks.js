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

function MapCell(x, y) {
    if (!isInteger(x))
        throw TypeError("x is not int");

    if (!isInteger(y))
        throw TypeError("y is not int");

    this.x = x;
    this.y = y;
}

MapCell.prototype = {
    constructor : MapCell
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

    this.mapBlock = new Array();
    for(var i = 0; i < rowNum; i++) {
        this.mapBlock[i] = new Array();
        for (var j = 0; j < columnNum; j++) {
            this.mapBlock[i][j] = null;
        }
    }
}

BattleMap.prototype ={
    constructor: BattleMap,

    isCellInMap: function(mapCell)
    {
        if (!(mapCell instanceof MapCell))
            throw TypeError("This is not MapCell");

        if (mapCell.x < 0)
            return false;

        if (mapCell.y < 0)
            return false;

        if (mapCell.x >= this.columnNum)
            return false;

        if (mapCell.y >= this.rowNum)
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
                this.units[i].renderingX = this.cellHeight * this.units[i].currentMapCell.x;
                this.units[i].renderingY = this.cellWidth * this.units[i].currentMapCell.y;
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

            this._animateMovement(i);
        }
    },

    _animateMovement : function(i) {

        if ((this.units[i].currentMapCell.x == this.units[i].nextMapCell.x) && (this.units[i].currentMapCell.y == this.units[i].nextMapCell.y))
            return;

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

        if ((this.cellHeight * this.units[i].nextMapCell.x == this.units[i].renderingX) && (this.cellHeight * this.units[i].nextMapCell.y == this.units[i].renderingY)){
            this.units[i].currentMapCell.x = this.units[i].nextMapCell.x;
            this.units[i].currentMapCell.y = this.units[i].nextMapCell.y
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

    _calcDistance : function (startCell, destinationCell) {
        return Math.abs(destinationCell.x - startCell.x) + Math.abs(destinationCell.y - startCell.y);
    },

    _findSurroundingCells : function (cell) {
        var leftX = cell.x - 1,
            rightX = cell.x + 1,
            upY = cell.y - 1,
            downY = cell.y + 1,
            currentCell,
            surroundingCells = [];

        for (var y = upY; y <= downY; y++) {
            for (var x = leftX; x <= rightX; x++) {
                if (x == cell.x && y == cell.y) continue;
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

    _findNearestToDestinationCell : function (cells, destinationCell) {
        var minDistance = this._calcDistance(cells[0], destinationCell),
            nearestToDestinationCell = cells[0],
            distance = 0;
        for (var i = 0; i < cells.length; i++){
            distance = this._calcDistance(cells[i], destinationCell);
            if (distance < minDistance){
                minDistance = distance;
                nearestToDestinationCell = cells[i];
            }
        }
        return nearestToDestinationCell;
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
            currentCell = startCell,
            surroundingCells;

        closeCells.push(currentCell);

        // while ((currentCell.x != destinationCell.x)
        // || (currentCell.y != destinationCell.y)){
        //     surroundingCells = this._findSurroundingCells(currentCell);
        //     this._throwOutObstacles(surroundingCells);
        //     openCells.push(surroundingCells);
        //     currentCell = this._findNearestToDestinationCell(surroundingCells, destinationCell);
        //     closeCells.push(currentCell);
        // }

        if ((currentCell.x != destinationCell.x)
        || (currentCell.y != destinationCell.y)){
            surroundingCells = this._findSurroundingCells(currentCell);
            this._throwOutObstacles(surroundingCells);
            openCells.push(surroundingCells);
            currentCell = this._findNearestToDestinationCell(surroundingCells, destinationCell);
            closeCells.push(currentCell);
        }

        return closeCells;
    }
}

//=====================================================================

function UnitsMover(units, pathFinder){

    if (!(units instanceof Array) && !(units instanceof Object))
        throw TypeError("This is not Array or Object");

    for (var i = 0; i < units.length; i++) {
        if (!(units[i] instanceof Unit))
            throw TypeError("This is not Unit");
    }

    if (!(pathFinder instanceof PathFinder))
        throw TypeError("This is not PathFinder");

    this.units = units;
    this.pathFinder = pathFinder;
}

UnitsMover.prototype = {
    constructor : UnitsMover,

    _turnAndMoveUnit : function(unit, nextCell) {

        if (!(nextCell instanceof MapCell))
            throw TypeError("nextCell is not MapCell");

        if ((unit.currentMapCell.x > nextCell.x) && (unit.currentMapCell.y > nextCell.y))
            unit.orientation = "upLeft";

        if ((unit.currentMapCell.x == nextCell.x) && (unit.currentMapCell.y > nextCell.y))
            unit.orientation = "up";

        if ((unit.currentMapCell.x < nextCell.x) && (unit.currentMapCell.y > nextCell.y))
            unit.orientation = "upRight";

        if ((unit.currentMapCell.x < nextCell.x) && (unit.currentMapCell.y == nextCell.y))
            unit.orientation = "right";

        if ((unit.currentMapCell.x < nextCell.x) && (unit.currentMapCell.y < nextCell.y))
            unit.orientation = "downRight";

        if ((unit.currentMapCell.x == nextCell.x) && (unit.currentMapCell.y < nextCell.y))
            unit.orientation = "down";

        if ((unit.currentMapCell.x > nextCell.x) && (unit.currentMapCell.y < nextCell.y))
            unit.orientation = "downLeft";

        if ((unit.currentMapCell.x > nextCell.x) && (unit.currentMapCell.y == nextCell.y))
            unit.orientation = "left";

        //unit.currentMapCell = nextCell;
        unit.nextMapCell = nextCell;
    },

    moveUnits : function () {
        var length = this.units.length;

        for (var unitIndex = 0; unitIndex < length; unitIndex++) {
            var unit = this.units[unitIndex],
                closeCells;

            if ((unit.currentMapCell.x != unit.nextMapCell.x) || (unit.currentMapCell.y != unit.nextMapCell.y)){
                continue;
            }

            if ((unit.currentMapCell.x == unit.destinationMapCell.x) && (unit.currentMapCell.y == unit.destinationMapCell.y)){
                continue;
            }

            closeCells = this.pathFinder.findPath(unit.currentMapCell, unit.destinationMapCell);
            if (closeCells[1] != undefined) {
                this._turnAndMoveUnit(unit, closeCells[1]);
            }
        }
    },

    _moveUnitsBetweenCells : function () {
        var orientation;

        if ((this.units[i].currentMapCell.x == this.units[i].nextMapCell.x)
            && (this.units[i].currentMapCell.y == this.units[i].nextMapCell.y))
            return;

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

        if ((this.cellHeight * this.units[i].nextMapCell.x == this.units[i].renderingX) && (this.cellHeight * this.units[i].nextMapCell.y == this.units[i].renderingY)){
            this.units[i].currentMapCell.x = this.units[i].nextMapCell.x;
            this.units[i].currentMapCell.y = this.units[i].nextMapCell.y
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
            if (this.units[unitIndex].currentMapCell.x == mapCell.x && this.units[unitIndex].currentMapCell.y == mapCell.y){
                return unitIndex;
            }
        }

        return undefined;
    }
}

//=====================================================================

function GameProperty(currentKey, selectedUnitIndex, units, unitFinder, leftButtonSelectedCell, rightButtonSelectedCell){

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
        if (!(gameProperty instanceof GameProperty))
            throw TypeError("This is not GameProperty");

        if (gameProperty.selectedUnitIndex === undefined){
            gameProperty.gameState = new InitialState();
            return;
        }

        if (gameProperty.leftButtonSelectedCell === undefined){
            return;
        }

        gameProperty.units[gameProperty.selectedUnitIndex].destinationMapCell = gameProperty.leftButtonSelectedCell;
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
        units = [unit0, unit1, unit2, unit3, unit4, unit5, unit6, unit7, unit8, unit9],
        //units = [unit0],
        cellWidth = 50,
        cellHeight = 50,
        columnNum = 20,
        rowNum = 20,
        battleMap = new BattleMap(columnNum, rowNum),
        gameDrawer = new GameDrawer(cellWidth, cellHeight, battleMap, units),
        unitFinder = new UnitFinder(units),
        pathFinder = new PathFinder(battleMap, unitFinder),
        unitsMover = new UnitsMover(units, pathFinder),
        gameProperty = new GameProperty("0", 0, units, unitFinder, undefined, undefined);

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





