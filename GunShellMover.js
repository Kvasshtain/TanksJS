function GunShellMover(gunShells, units, unitFinder, cellWidth, cellHeight) {
    var averageCellSize;

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

            sinAzimuth = Math.sin(gunShell.azimuth);
            cosAzimuth = Math.cos(gunShell.azimuth);

            xCurrentDistanceFromShotPoint = gunShell.currentDistanceFromShotPoint * sinAzimuth;
            yCurrentDistanceFromShotPoint = gunShell.currentDistanceFromShotPoint * cosAzimuth;

            gunShell.currentPoint.x = gunShell.shotPoint.x + xCurrentDistanceFromShotPoint;
            gunShell.currentPoint.y = gunShell.shotPoint.y + yCurrentDistanceFromShotPoint;

            gunShell.currentDistanceFromShotPoint += this.stepDistance;
        }
    },

    _explodeGunShell : function (gunShellIndex) {

        this._makeDamage(gunShellIndex);

        this.gunShells.splice(gunShellIndex, 1);
    },

    _makeDamage : function (gunShellIndex) {
        var gunShell = this.gunShells[gunShellIndex],
            unitIndex = this.unitFinder.findByCoordinates(gunShell.targetPoint);

        if (unitIndex === undefined)
            return;

        if (this.units[unitIndex].health == 0)
            return;

        this.units[unitIndex].health -= gunShell.damage;
    }
}