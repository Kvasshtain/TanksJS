function UnitTracker(units) {

    if (!(units instanceof Array) && units !== undefined)
        throw TypeError("units is not Array or undefined");

    this.units = units;
}

UnitTracker.prototype = {
    constructor : UnitTracker,

    unitTrackRoutine : function () {
        var unit,
            targetUnit,
            distance;

        for (var i = 0; i < this.units.length; i++) {
            unit = this.units[i];

            if (unit.targetUnitIndex === undefined) {
                continue;
            }

            targetUnit = this.units[unit.targetUnitIndex];

            if (targetUnit.health <= 0) {
                unit.targetUnitIndex = undefined;
                unit.stop();
                continue;
            }

            distance = Unit.CalculateDistance(unit, targetUnit);

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