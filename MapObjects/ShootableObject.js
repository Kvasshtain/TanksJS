function ShootableObject(
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
    turretGraphicObject) {

    if (!(currentMapCell instanceof MapCell) && currentMapCell != undefined)
        throw new TypeError("currentMapCell isn't MapCell");

    if ("boolean" != typeof isPassable)
        throw new TypeError("isPassable isn't bool");

    if ("boolean" != typeof isGunShellPenetrable)
        throw new TypeError("isGunShellPenetrable isn't bool");

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

    DestroyableVisibleObject.call(
        this,
        currentMapCell,
        isPassable,
        isGunShellPenetrable,
        graphicObject,
        health,
        disappearanceAfterDeathCount);

    this.name = name;
    this.team = team;
    this.fireRadius = fireRadius;
    this.damage = damage;
    this.rechargeGunTime = rechargeGunTime;
    this.turretGraphicObject = turretGraphicObject;
    this.turretOrientation = 0;
    this.gunShellImage = new Image();
    this.gunShellImage.src = 'Pictures/redGunShell.png';
    this.targetIndex = undefined;
    this.rechargeGunTimer = this.rechargeGunTime;
}

ShootableObject.prototype = inherit(DestroyableVisibleObject.prototype);
ShootableObject.prototype.constructor = ShootableObject;