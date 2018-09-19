function ShootableMovableObject(
    currentMapCell,
    isPassable,
    isGunShellPenetrable,
    image,
    relativeSize,
    health,
    disappearanceAfterDeathCount,
    name,
    team,
    fireRadius,
    damage,
    rechargeGunTime,
    turretImage,
    relativeTurretSize,
    destinationMapCell,
    currentDirection
) {
    if (!(currentMapCell instanceof MapCell) && currentMapCell != undefined)
        throw new TypeError("currentMapCell isn't MapCell");

    if ("boolean" != typeof isPassable)
        throw new TypeError("isPassable isn't bool");

    if ("boolean" != typeof isGunShellPenetrable)
        throw new TypeError("isGunShellPenetrable isn't bool");

    if (!(image instanceof Image))
        throw TypeError("image isn't Image");

    if ("number" != typeof relativeSize)
        throw TypeError("relativeSize isn't number");

    if (!isInteger(health))
        throw TypeError("health isn't integer");

    if (!isInteger(disappearanceAfterDeathCount))
        throw TypeError("disappearanceAfterDeathCount isn't integer");

    if ("number" != typeof fireRadius)
        throw TypeError("fireRadius isn't number");

    if (!isInteger(damage))
        throw TypeError("damage isn't integer");

    if (!isInteger(rechargeGunTime))
        throw TypeError("rechargeGunTime isn't integer");

    if (!(turretImage instanceof Image))
        throw new TypeError("turretImage isn't Image");

    if ("number" != typeof relativeTurretSize)
        throw TypeError("relativeTurretSize isn't number");

    if (!(destinationMapCell instanceof MapCell) && destinationMapCell != undefined)
        throw new TypeError("destinationMapCell is not MapCell or undefined");

    if (!direction.validate(currentDirection))
        throw TypeError("currentDirection is not direction");

    ShootableObject.call(
        this,
        currentMapCell,
        isPassable,
        isGunShellPenetrable,
        image,
        relativeSize,
        health,
        disappearanceAfterDeathCount,
        name,
        team,
        fireRadius,
        damage,
        rechargeGunTime,
        turretImage,
        relativeTurretSize);

    MovableObject.call(
        this,
        currentMapCell,
        isPassable,
        isGunShellPenetrable,
        image,
        relativeSize,
        health,
        disappearanceAfterDeathCount,
        destinationMapCell,
        currentDirection);
}

ShootableMovableObject.prototype = inherit(MovableObject.prototype);
ShootableMovableObject.prototype.constructor = ShootableMovableObject;
ShootableMovableObject.prototype.stop = function () {
    this.destinationMapCell = this.nextMapCell;
    this.movementPath = undefined;
    this.movementPathStepIndex = 0;
};