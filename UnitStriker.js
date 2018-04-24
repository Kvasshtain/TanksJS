function UnitStriker(units) {

    if (!(units instanceof Array) && units !== undefined)
        throw TypeError("units is not Array or undefined");

    this.units = units;
}

UnitStriker.prototype = {
    constructor : UnitStriker,

    _isUnitInMotion : function(unit) {
        return !MapCell.areEqual(unit.destinationMapCell, unit.currentMapCell);
    },

    _isObjectEnemy : function (myTeam, unit) {
        return myTeam !== unit.team;
    },

    _calcDistance : function(unit, enemyObject) {
        var xDistance = unit.renderingX - enemyObject.renderingX,
            yDistance = unit.renderingY - enemyObject.renderingY;

        return Math.sqrt(xDistance * xDistance + yDistance * yDistance);
    },

    _canHit : function (unit, enemyObject) {
        var distanceToEnemy = this._calcDistance(unit, enemyObject);

        return distanceToEnemy < unit.fireRadius;
    },

    _findEnemyInFireRadius : function (unitIndex) {
        var unit = this.units[unitIndex],
            surroundingObjects,
            targetUnitIndex = unit.targetUnitIndex,
            myTeam = unit.team;

        surroundingObjects = this.units.slice(0);
        surroundingObjects.splice(unitIndex, 1);

        if ((targetUnitIndex !== undefined)
         && (this._isObjectEnemy(myTeam, this.units[targetUnitIndex]))
         && (this._canHit(unit, this.units[targetUnitIndex]))) {
            return targetUnitIndex;
        }

        if (!unit.canShootOnMove
            && this._isUnitInMotion(unit)) {
            return undefined;
        }

        for (var i = 0; i < surroundingObjects.length; i++) {
            if (this._isObjectEnemy(myTeam, surroundingObjects[i])) {
                return i;
            }
        }

        return undefined;
    },

    _stopUnitForFire : function (unit, enemyObjectIndex) {
        if (enemyObjectIndex != undefined
            && unit.targetUnitIndex != undefined
            && enemyObjectIndex == unit.targetUnitIndex) {
            unit.isStopForShot = true;
            return;
        }

        unit.isStopForShot = false;
    },

    unitFightRoutine : function () {
        var units = this.units,
            unit,
            enemyObjectIndex;

        for (var i = 0; i < units.length; i++) {
            unit = this.units[i];
            enemyObjectIndex = this._findEnemyInFireRadius(i);

            this._stopUnitForFire(unit, enemyObjectIndex);
        }
    }
}
