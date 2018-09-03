function UnitTracker(units, cellWidth, cellHeight) {

    if (!(units instanceof Array) && units !== undefined)
        throw TypeError("shootableObjects is not Array or undefined");

    if (cellWidth === undefined)
        throw TypeError("cellWidth === undefined");

    if (cellHeight === undefined)
        throw TypeError("cellHeight === undefined");

    if ("number" !== typeof cellWidth)
        throw TypeError("cellWidth isn't number");

    if ("number" !== typeof cellHeight)
        throw TypeError("cellHeight isn't number");

    if (cellWidth <= 0)
        throw RangeError("cellWidth <= 0");

    if (cellHeight <= 0)
        throw RangeError("cellHeight <= 0");

    this.shootableObjects = units;
    this.cellWidth = cellWidth;
    this.cellHeight = cellHeight;
}

UnitTracker.prototype = {
    constructor : UnitTracker,

    unitTrackRoutine : function () {
        var unit,
            targetUnit,
            distance;

        for (var i = 0; i < this.shootableObjects.length; i++) {
            unit = this.shootableObjects[i];

            if (!unit.targetIndex) {
                continue;
            }

            targetUnit = this.shootableObjects[unit.targetIndex];

            if (!targetUnit){
                continue;
            }

            if (targetUnit.health <= 0) {
                unit.targetIndex = undefined;
                unit.stop();
                continue;
            }

            distance = GameObject.CalculateDistance(unit, targetUnit, this.cellHeight, this.cellWidth);

            if ((targetUnit.team != unit.team)
             && (distance < unit.fireRadius)) {
                continue;
            }

            if (!MapCell.areEqual(targetUnit.currentMapCell, unit.destinationMapCell)) {
                unit.destinationMapCell = targetUnit.currentMapCell;
            }
        }
    }
}