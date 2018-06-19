function UnitsMover(units, pathFinder, unitFinder, cellWidth, cellHeight){

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

    this.shootableObjects = units;
    this.pathFinder = pathFinder;
    this.unitFinder = unitFinder;
    this.cellWidth = cellWidth;
    this.cellHeight = cellHeight;
}

UnitsMover.prototype = {
    constructor : UnitsMover,

    moveUnits : function () {
        var length = this.shootableObjects.length;

        for (var unitIndex = 0; unitIndex < length; unitIndex++) {
            var unit = this.shootableObjects[unitIndex];

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

        if (MapCell.areEqual(this.shootableObjects[i].currentMapCell, this.shootableObjects[i].nextMapCell)) {
            return;
        }

        orientation = this.shootableObjects[i].orientation;

        switch (orientation) {
            case "up":
                this.shootableObjects[i].renderingY--;
                break;
            case "down":
                this.shootableObjects[i].renderingY++;
                break;
            case "left":
                this.shootableObjects[i].renderingX--;
                break;
            case "right":
                this.shootableObjects[i].renderingX++;
                break;
            case "upRight":
                this.shootableObjects[i].renderingX++;
                this.shootableObjects[i].renderingY--;
                break;
            case "downRight":
                this.shootableObjects[i].renderingX++;
                this.shootableObjects[i].renderingY++;
                break;
            case "downLeft":
                this.shootableObjects[i].renderingX--;
                this.shootableObjects[i].renderingY++;
                break;
            case "upLeft":
                this.shootableObjects[i].renderingX--;
                this.shootableObjects[i].renderingY--;
                break;
        }

        if ((this.cellWidth * this.shootableObjects[i].nextMapCell.xIndex == this.shootableObjects[i].renderingX)
            && (this.cellHeight * this.shootableObjects[i].nextMapCell.yIndex == this.shootableObjects[i].renderingY)){
            this.shootableObjects[i].currentMapCell.xIndex = this.shootableObjects[i].nextMapCell.xIndex;
            this.shootableObjects[i].currentMapCell.yIndex = this.shootableObjects[i].nextMapCell.yIndex
        }
    }
}