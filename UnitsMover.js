function UnitsMover(movableObjects, units, pathFinder, unitFinder, cellWidth, cellHeight){

    if (!(movableObjects instanceof Array) && !(movableObjects instanceof Object))
        throw TypeError("movableObjects isn't Array or Object");

    for (var i = 0; i < movableObjects.length; i++) {
        if (!(movableObjects[i] instanceof MovableObject) && !(movableObjects[i] instanceof Unit))
            throw TypeError("movableObject isn't MovableObject or Unit");
    }

    if (!(units instanceof Array) && !(units instanceof Object))
        throw TypeError("This is not Array or Object");

    for (var i = 0; i < units.length; i++) {
        if (!(units[i] instanceof Unit))
            throw TypeError("This is not Unit");
    }

    if (!(pathFinder instanceof PathFinder))
        throw TypeError("This is not PathFinder");

    if (!(unitFinder instanceof UnitFinder))
        throw TypeError("This is not UnitFinder");

    if (cellWidth === undefined)
        throw TypeError("cellWidth === undefined");

    if (cellHeight === undefined)
        throw TypeError("cellHeight === undefined");

    if (cellWidth <= 0)
        throw RangeError("cellWidth <= 0");

    if (cellHeight <= 0)
        throw RangeError("cellHeight <= 0");

    this.movableObjects = movableObjects.concat(units);
    this.pathFinder = pathFinder;
    this.unitFinder = unitFinder;
    this.cellWidth = cellWidth;
    this.cellHeight = cellHeight;
}

UnitsMover.prototype = {
    constructor : UnitsMover,

    moveUnits : function () {
        var length = this.movableObjects.length;

        for (var unitIndex = 0; unitIndex < length; unitIndex++) {
            var unit = this.movableObjects[unitIndex];

            if (unit.health <= 0)
                continue;

            if (MapCell.areEqual(unit.currentMapCell, unit.destinationMapCell)) {
                continue;
            }

            if (!MapCell.areEqual(unit.currentMapCell, unit.nextMapCell)){
                this._moveUnitsBetweenCells(unitIndex);
                continue;
            }

            if (unit.isStopForShot) {
                continue;
            }

            if (unit.movementPath != undefined) {
                this._turnAndMoveUnit(unit, unit.movementPath[unit.movementPathStepIndex]);
                if (unit.movementPathStepIndex < unit.movementPath.length - 1) {
                    unit.movementPathStepIndex++;
                }
            }
        }
    },

    _turnAndMoveUnit : function(unit, nextCell) {

        if (MapCell.areEqual(nextCell, unit.destinationMapCell)
            &&
            (this.unitFinder.findByMapCellObjIndex(nextCell) !== undefined)) {
            unit.destinationMapCell = unit.currentMapCell;
            unit.nextMapCell = unit.currentMapCell;
            unit.movementPathStepIndex = 0;
            return;
        }

        if (this.unitFinder.findByMapCellObjIndex(nextCell) !== undefined) {
            unit.movementPath = this.pathFinder.findPath(unit.currentMapCell, unit.destinationMapCell);
            unit.movementPathStepIndex = 1;
            nextCell = unit.movementPath[unit.movementPathStepIndex];
        }

        unit.orientation = unit.currentMapCell.identifyDirectionToNextCell(nextCell);

        unit.nextMapCell = nextCell;
    },

    _moveUnitsBetweenCells : function (i) {
        var orientation;

        if (MapCell.areEqual(this.movableObjects[i].currentMapCell, this.movableObjects[i].nextMapCell)) {
            return;
        }

        orientation = this.movableObjects[i].orientation;

        switch (orientation) {
            case "up":
                this.movableObjects[i].renderingY--;
                break;
            case "down":
                this.movableObjects[i].renderingY++;
                break;
            case "left":
                this.movableObjects[i].renderingX--;
                break;
            case "right":
                this.movableObjects[i].renderingX++;
                break;
            case "upRight":
                this.movableObjects[i].renderingX++;
                this.movableObjects[i].renderingY--;
                break;
            case "downRight":
                this.movableObjects[i].renderingX++;
                this.movableObjects[i].renderingY++;
                break;
            case "downLeft":
                this.movableObjects[i].renderingX--;
                this.movableObjects[i].renderingY++;
                break;
            case "upLeft":
                this.movableObjects[i].renderingX--;
                this.movableObjects[i].renderingY--;
                break;
        }

        if ((this.cellWidth * this.movableObjects[i].nextMapCell.xIndex == this.movableObjects[i].renderingX)
            && (this.cellHeight * this.movableObjects[i].nextMapCell.yIndex == this.movableObjects[i].renderingY)){
            this.movableObjects[i].currentMapCell.xIndex = this.movableObjects[i].nextMapCell.xIndex;
            this.movableObjects[i].currentMapCell.yIndex = this.movableObjects[i].nextMapCell.yIndex
        }
    }
}