function UnitStriker(shootableObjects, gunShells, unitFinder, mapObjectFinder, cellWidth, cellHeight) {

    if (!(shootableObjects instanceof Array) && shootableObjects !== undefined)
        throw TypeError("shootableObjects isn't Array or undefined");

    for (var i = 0; i < shootableObjects.length; i++){
        if (!(shootableObjects[i] instanceof Unit) && !(shootableObjects[i] instanceof ShootableObject))
            throw TypeError("This is not ShootableObject");
    }

    if (!(gunShells instanceof Array) && gunShells !== undefined)
        throw TypeError("gunShells isn't Array or undefined");

    if (!(unitFinder instanceof UnitFinder))
        throw TypeError("unitFinder isn't UnitFinder");

    if (!(mapObjectFinder instanceof MapObjectFinder))
        throw TypeError("mapObjectsFinder isn't MapObjectFinder")

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

    this.shootableObjects = shootableObjects;
    this.gunShells = gunShells;
    this.unitFinder = unitFinder;
    this.mapObjectFinder = mapObjectFinder;
    this.cellWidth = cellWidth;
    this.cellHeight = cellHeight;
    this.gunShellMover =
        new GunShellMover(
            this.gunShells,
            this.shootableObjects,
            this.unitFinder,
            this.mapObjectFinder,
            this.cellWidth,
            this.cellHeight
        )
}

UnitStriker.prototype = {
    constructor : UnitStriker,

    _isUnitInMotion : function(unit) {

        if (unit.destinationMapCell === undefined)
            return false;

        return !MapCell.areEqual(unit.destinationMapCell, unit.currentMapCell);
    },

    _isObjectEnemy : function (myTeam, unit) {
        return myTeam !== unit.team;
    },

    _canHit : function (unit, enemyObject) {
        var distanceToEnemy = GameObject.CalculateDistance(unit, enemyObject, this.cellHeight, this.cellWidth);

        return distanceToEnemy < unit.fireRadius;
    },

    _isStillAlive : function (enemyObject) {
        return enemyObject.health > 0;
    },

    _findEnemyInFireRadius : function (shootableObjectIndex) {
        var shootableObject = this.shootableObjects[shootableObjectIndex],
            targetObjectIndex = shootableObject.targetIndex,
            myTeam = shootableObject.team;

        if ((targetObjectIndex !== undefined)
         && (this._isObjectEnemy(myTeam, this.shootableObjects[targetObjectIndex]))
         && (this._canHit(shootableObject, this.shootableObjects[targetObjectIndex]))
         && (this._isStillAlive(this.shootableObjects[targetObjectIndex]))){
            return targetObjectIndex;
        }

        if (!shootableObject.canShootOnMove
            && this._isUnitInMotion(shootableObject)) {
            return undefined;
        }

        for (var i = 0; i < this.shootableObjects.length; i++) {
            if (i == shootableObjectIndex)
                continue;

            if ((this._isObjectEnemy(myTeam, this.shootableObjects[i]))
             && (this._canHit(shootableObject, this.shootableObjects[i]))
             && (this._isStillAlive(this.shootableObjects[i]))) {
                return i;
            }
        }

        return undefined;
    },

    _stopUnitForFire : function (unit, enemyObjectIndex) {
        if (enemyObjectIndex != undefined
            && unit.targetIndex != undefined
            && enemyObjectIndex == unit.targetIndex) {
            unit.stop();
            return;
        }
    },

    _rechargeObjectsGunsRoutine : function(){
        var units = this.shootableObjects,
            unit;

        for (var i = 0; i < units.length; i++) {
            unit = this.shootableObjects[i];

            if (unit.rechargeGunTimer < unit.rechargeGunTime) {
                unit.rechargeGunTimer++;
            }
        }
    },

    _createGunShell : function(shootableObject, enemyObject, gunShellIndex) {
        var shotPoint = new Point(shootableObject.renderingX, shootableObject.renderingY),
            targetPoint = new Point(enemyObject.renderingX, enemyObject.renderingY),
            damage = shootableObject.damage,
            image = shootableObject.gunShellImage;
        return new GunShell(shotPoint, targetPoint, damage, image, gunShellIndex);
    },

    _objectShot : function (shootableObject, enemyObject) {
        var gunShell,
            gunShellIndex;

        if (enemyObject === undefined)
            return;

        if (shootableObject.rechargeGunTimer != shootableObject.rechargeGunTime)
            return;

        shootableObject.rechargeGunTimer = 0;
        gunShellIndex = this.gunShells.length;
        gunShell = this._createGunShell(shootableObject, enemyObject, gunShellIndex);
        this.gunShells.push(gunShell);
    },

    unitFightRoutine : function () {
        var units = this.shootableObjects,
            shootableObject,
            enemyObjectIndex;

        this._rechargeObjectsGunsRoutine();

        this.gunShellMover.moveGunShell();

        for (var i = 0; i < units.length; i++) {
            shootableObject = this.shootableObjects[i];

            if (shootableObject.health <= 0)
                continue;

            enemyObjectIndex = this._findEnemyInFireRadius(i);

            this._stopUnitForFire(shootableObject, enemyObjectIndex);

            this._objectShot(shootableObject, units[enemyObjectIndex]);
        }
    }
}
