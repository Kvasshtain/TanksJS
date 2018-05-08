function UnitStriker(units, gunShells, unitFinder, cellWidth, cellHeight) {

    if (!(units instanceof Array) && units !== undefined)
        throw TypeError("units is not Array or undefined");

    if (!(gunShells instanceof Array) && gunShells !== undefined)
        throw TypeError("gunShells is not Array or undefined");

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
    this.gunShells = gunShells;
    this.unitFinder = unitFinder;
    this.cellWidth = cellWidth;
    this.cellHeight = cellHeight;
    this.gunShellMover = new GunShellMover(this.gunShells, this.units, this.unitFinder, this.cellWidth, this.cellHeight)
}

UnitStriker.prototype = {
    constructor : UnitStriker,

    _isUnitInMotion : function(unit) {
        return !MapCell.areEqual(unit.destinationMapCell, unit.currentMapCell);
    },

    _isObjectEnemy : function (myTeam, unit) {
        return myTeam !== unit.team;
    },

    _canHit : function (unit, enemyObject) {
        var distanceToEnemy = Unit.CalculateDistance(unit, enemyObject);

        return distanceToEnemy < unit.fireRadius;
    },

    _isStillAlive : function (enemyObject) {
        return enemyObject.health > 0;
    },

    _findEnemyInFireRadius : function (unitIndex) {
        var unit = this.units[unitIndex],
            targetUnitIndex = unit.targetUnitIndex,
            myTeam = unit.team;

        if ((targetUnitIndex !== undefined)
         && (this._isObjectEnemy(myTeam, this.units[targetUnitIndex]))
         && (this._canHit(unit, this.units[targetUnitIndex]))
         && (this._isStillAlive(this.units[targetUnitIndex]))){
            return targetUnitIndex;
        }

        if (!unit.canShootOnMove
            && this._isUnitInMotion(unit)) {
            return undefined;
        }

        for (var i = 0; i < this.units.length; i++) {
            if (i == unitIndex)
                continue;

            if ((this._isObjectEnemy(myTeam, this.units[i]))
             && (this._canHit(unit, this.units[i]))
             && (this._isStillAlive(this.units[i]))) {
                return i;
            }
        }

        return undefined;
    },

    _stopUnitForFire : function (unit, enemyObjectIndex) {
        if (enemyObjectIndex != undefined
            && unit.targetUnitIndex != undefined
            && enemyObjectIndex == unit.targetUnitIndex) {
            //unit.isStopForShot = true;
            unit.stop();
            return;
        }

        //unit.isStopForShot = false;
    },

    _rechargeObjectsGunsRoutine : function(){
        var units = this.units,
            unit;

        for (var i = 0; i < units.length; i++) {
            unit = this.units[i];

            if (unit.rechargeGunTimer < unit.rechargeGunTime) {
                unit.rechargeGunTimer++;
            }
        }
    },

    _createGunShell : function(unit, enemyObject, gunShellIndex) {
        var shotPoint = new Point(unit.renderingX, unit.renderingY),
            targetPoint = new Point(enemyObject.renderingX, enemyObject.renderingY),
            damage = unit.damage,
            image = unit.gunShellImage;
        return new GunShell(shotPoint, targetPoint, damage, image, gunShellIndex);
    },

    _objectShot : function (unit, enemyObject) {
        var gunShell,
            gunShellIndex;

        if (enemyObject === undefined)
            return;

        if (unit.rechargeGunTimer != unit.rechargeGunTime)
            return;

        unit.rechargeGunTimer = 0;
        gunShellIndex = this.gunShells.length;
        gunShell = this._createGunShell(unit, enemyObject, gunShellIndex);
        this.gunShells.push(gunShell);
    },

    unitFightRoutine : function () {
        var units = this.units,
            unit,
            enemyObjectIndex;

        this._rechargeObjectsGunsRoutine();

        this.gunShellMover.moveGunShell();

        for (var i = 0; i < units.length; i++) {
            unit = this.units[i];

            if (unit.health <= 0)
                continue;

            enemyObjectIndex = this._findEnemyInFireRadius(i);

            this._stopUnitForFire(unit, enemyObjectIndex);

            this._objectShot(unit, units[enemyObjectIndex]);
        }
    }
}
