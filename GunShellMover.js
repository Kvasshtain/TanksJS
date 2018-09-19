function GunShellMover(gunShells, shootableObjects, unitFinder, mapObjectFinder, cellWidth, cellHeight) {
    var averageCellSize;

    if (!(shootableObjects instanceof Array) && shootableObjects !== undefined)
        throw TypeError("shootableObjects isn't Array or undefined");

    if (!(gunShells instanceof Array) && gunShells !== undefined)
        throw TypeError("gunShells isn't Array or undefined");

    if (!(unitFinder instanceof UnitFinder))
        throw TypeError("unitFinder isn't UnitFinder");

    if (!(mapObjectFinder instanceof MapObjectFinder))
        throw TypeError("mapObjectsFinder isn't MapObjectFinder");

    if (cellWidth === undefined)
        throw TypeError("cellWidth === undefined");

    if (cellHeight === undefined)
        throw TypeError("cellHeight === undefined");

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
    averageCellSize = (this.cellWidth + this.cellHeight) / 2;
    this.stepDistance = averageCellSize / 20;
}

GunShellMover.prototype = {
    constructor : GunShellMover,

    moveGunShell : function() {
        var gunShell,
            xCurrentDistanceFromShotPoint,
            yCurrentDistanceFromShotPoint,
            sinAzimuth,
            cosAzimuth;

        for (var gunShellIndex = 0; gunShellIndex < this.gunShells.length; gunShellIndex++) {
            gunShell = this.gunShells[gunShellIndex];

            if (gunShell.currentDistanceFromShotPoint >= gunShell.flightDistance) {
                this._explodeGunShell(gunShellIndex);
                continue;
            }

            if (this.mapObjectFinder.findByCoordinatesGunShellImpenetrableObjIndex(gunShell.currentPoint) !== undefined) {
                this._destroyGunShell(gunShellIndex);
                continue;
            }

            sinAzimuth = Math.sin(gunShell.azimuth);
            cosAzimuth = Math.cos(gunShell.azimuth);

            xCurrentDistanceFromShotPoint = gunShell.currentDistanceFromShotPoint * sinAzimuth;
            yCurrentDistanceFromShotPoint = gunShell.currentDistanceFromShotPoint * cosAzimuth;

            gunShell.currentPoint.x = gunShell.shotPoint.x + xCurrentDistanceFromShotPoint;
            gunShell.currentPoint.y = gunShell.shotPoint.y + yCurrentDistanceFromShotPoint;

            gunShell.currentDistanceFromShotPoint += this.stepDistance;
        }
    },

    _destroyGunShell : function (gunShellIndex) {

        this.gunShells.splice(gunShellIndex, 1);
    },

    _explodeGunShell : function (gunShellIndex) {

        this._makeDamage(gunShellIndex);

        this._destroyGunShell(gunShellIndex);
    },

    _makeDamage : function (gunShellIndex) {
        var gunShell = this.gunShells[gunShellIndex],
            unitIndex = this.unitFinder.findByCoordinatesObjIndex(gunShell.targetPoint),
            shootableObjects = this.shootableObjects;

        if (unitIndex === undefined)
            return;

        if (!shootableObjects[unitIndex])
            return;

        if (shootableObjects[unitIndex].health == 0)
            return;

        shootableObjects[unitIndex].health -= gunShell.damage;
    }
}