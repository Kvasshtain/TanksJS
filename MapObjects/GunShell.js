function GunShell(shotPoint, targetPoint, damage, image, gunShellIndex) {
    var xFlightDistance, yFlightDistance, xFlightDistancePow2, yFlightDistancePow2;

    if (!(shotPoint instanceof Point))
        throw TypeError("shotPoint isn't Point");

    if (!(targetPoint instanceof Point))
        throw TypeError("targetPoint isn't Point");

    if ("number" != typeof(damage))
        throw TypeError("damage isn't number");

    if (!(image instanceof Image))
        throw TypeError("image isn't Image");

    if (!isInteger(gunShellIndex))
        throw TypeError("gunShellIndex isn't Integer")

    this.shotPoint = shotPoint;
    this.targetPoint = targetPoint;
    this.damage = damage;
    this.currentPoint = new Point(shotPoint.x, shotPoint.y);
    this.currentDistanceFromShotPoint = 0;
    xFlightDistance = targetPoint.x - shotPoint.x;
    yFlightDistance = targetPoint.y - shotPoint.y;
    xFlightDistancePow2 = xFlightDistance * xFlightDistance;
    yFlightDistancePow2 = yFlightDistance * yFlightDistance;
    this.flightDistance = Math.sqrt(xFlightDistancePow2 + yFlightDistancePow2);
    this.azimuth = Math.atan2(xFlightDistance, yFlightDistance);
    this.image = image;
    this.gunShellIndex = gunShellIndex;
}

GunShell.prototype = {
    constructor : GunShell
}