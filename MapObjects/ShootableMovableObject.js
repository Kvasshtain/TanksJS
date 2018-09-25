function ShootableMovableObject(
    currentMapCell,
    isPassable,
    isGunShellPenetrable,
    graphicObject,
    health,
    disappearanceAfterDeathCount,
    name,
    team,
    fireRadius,
    damage,
    rechargeGunTime,
    turretGraphicObject,
    destinationMapCell,
    currentDirection
) {
    if (!(currentMapCell instanceof MapCell) && currentMapCell != undefined)
        throw new TypeError("currentMapCell isn't MapCell");

    if ("boolean" != typeof isPassable)
        throw new TypeError("isPassable isn't bool");

    if ("boolean" != typeof isGunShellPenetrable)
        throw new TypeError("isGunShellPenetrable isn't bool");

    if (!(graphicObject instanceof GraphicObject))
        throw TypeError("graphicObject isn't GraphicObject");

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

    if (!(turretGraphicObject instanceof GraphicObject))
        throw new TypeError("turretGraphicObject isn't GraphicObject");

    if (!(destinationMapCell instanceof MapCell) && destinationMapCell != undefined)
        throw new TypeError("destinationMapCell is not MapCell or undefined");

    if (!direction.validate(currentDirection))
        throw TypeError("currentDirection is not direction");

    ShootableObject.call(
        this,
        currentMapCell,
        isPassable,
        isGunShellPenetrable,
        graphicObject,
        health,
        disappearanceAfterDeathCount,
        name,
        team,
        fireRadius,
        damage,
        rechargeGunTime,
        turretGraphicObject);

    MovableObject.call(
        this,
        currentMapCell,
        isPassable,
        isGunShellPenetrable,
        graphicObject,
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