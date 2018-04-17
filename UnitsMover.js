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

    this.units = units;
    this.pathFinder = pathFinder;
    this.unitFinder = unitFinder;
    this.cellWidth = cellWidth;
    this.cellHeight = cellHeight;
}

UnitsMover.prototype = {
    constructor : UnitsMover,

    _turnAndMoveUnit : function(unit, nextCell) {

        if (MapCell.areEqual(nextCell, unit.destinationMapCell)
            &&
            (this.unitFinder.findByCoordinates(nextCell) !== undefined)) {
            unit.destinationMapCell = unit.currentMapCell;
            unit.nextMapCell = unit.currentMapCell;
            unit.movementPathStepIndex = 0;
            return;
        }

        if (this.unitFinder.findByCoordinates(nextCell) !== undefined) {
            unit.movementPath = this.pathFinder.findPath(unit.currentMapCell, unit.destinationMapCell);
            unit.movementPathStepIndex = 1;
            nextCell = unit.movementPath[unit.movementPathStepIndex];
        }

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

            if (!MapCell.areEqual(unit.currentMapCell, unit.nextMapCell)){
                this._moveUnitsBetweenCells(unitIndex);
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