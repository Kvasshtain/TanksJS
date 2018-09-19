function UnitsMover(movableObjects, pathFinder, unitFinder, mapObjectFinder, cellWidth, cellHeight){

    if (!(movableObjects instanceof Array) && !(movableObjects instanceof Object))
        throw TypeError("movableObjects isn't Array or Object");

    if (!(pathFinder instanceof PathFinder))
        throw TypeError("This is not PathFinder");

    if (!(unitFinder instanceof UnitFinder))
        throw TypeError("This is not UnitFinder");

    if (!(mapObjectFinder instanceof MapObjectFinder))
        throw TypeError("This is not MapObjectFinder");

    if (!cellWidth)
        throw TypeError("cellWidth is undefined");

    if (!cellHeight)
        throw TypeError("cellHeight is undefined");

    if (cellWidth <= 0)
        throw RangeError("cellWidth <= 0");

    if (cellHeight <= 0)
        throw RangeError("cellHeight <= 0");

    this.movableObjects = movableObjects;
    this.pathFinder = pathFinder;
    this.unitFinder = unitFinder;
    this.mapObjectFinder = mapObjectFinder;
    this.cellWidth = cellWidth;
    this.cellHeight = cellHeight;
}

UnitsMover.prototype = {
    constructor : UnitsMover,

    moveUnits : function () {
        var length = this.movableObjects.length;

        for (var unitIndex = 0; unitIndex < length; unitIndex++) {
            var unit = this.movableObjects[unitIndex];

            if (!(unit instanceof MovableObject))
                continue;

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

        unit.currentDirection = unit.currentMapCell.identifyDirectionToNextCell(nextCell);

        unit.turretOrientation = direction.defineOrientationFromDirection(unit.currentDirection);

        unit.nextMapCell = nextCell;
    },

    _moveUnitsBetweenCells : function (i) {
        var currentDirection,
            movableObject = this.movableObjects[i];

        if (MapCell.areEqual(movableObject.currentMapCell, movableObject.nextMapCell)) {
            return;
        }

        if(movableObject.currentDirection) {

            currentDirection = movableObject.currentDirection;

            switch (currentDirection) {
                case "up":
                    movableObject.renderingY--;
                    break;
                case "down":
                    movableObject.renderingY++;
                    break;
                case "left":
                    this.movableObjects[i].renderingX--;
                    break;
                case "right":
                    movableObject.renderingX++;
                    break;
                case "upRight":
                    movableObject.renderingX++;
                    movableObject.renderingY--;
                    break;
                case "downRight":
                    movableObject.renderingX++;
                    movableObject.renderingY++;
                    break;
                case "downLeft":
                    movableObject.renderingX--;
                    movableObject.renderingY++;
                    break;
                case "upLeft":
                    movableObject.renderingX--;
                    movableObject.renderingY--;
                    break;
            }
        }

        if ((this.cellWidth * movableObject.nextMapCell.xIndex == movableObject.renderingX)
            && (this.cellHeight * movableObject.nextMapCell.yIndex == movableObject.renderingY)){
            movableObject.currentMapCell.xIndex = movableObject.nextMapCell.xIndex;
            movableObject.currentMapCell.yIndex = movableObject.nextMapCell.yIndex
        }
    }
}