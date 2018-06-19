function ShootableObject(
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
    relativeTurretSize) {

    if (!currentMapCell instanceof MapCell && currentMapCell != undefined)
        throw new TypeError("currentMapCell isn't MapCell");

    if ("boolean" != typeof isPassable)
        throw new TypeError("isPassable isn't bool");

    if ("boolean" != typeof isGunShellPenetrable)
        throw new TypeError("isGunShellPenetrable isn't bool");

    if (!image instanceof Image)
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

    if (!turretImage instanceof Image)
        throw new TypeError("turretImage isn't Image");

    if ("number" != typeof relativeTurretSize)
        throw TypeError("relativeTurretSize isn't number");

    DestroyableVisibleObject.call(this, currentMapCell, isPassable, isGunShellPenetrable, image, relativeSize, health, disappearanceAfterDeathCount);

    this.name = name;
    this.team = team;
    this.fireRadius = fireRadius;
    this.damage = damage;
    this.rechargeGunTime = rechargeGunTime;
    this.turretImage = turretImage;
    this.turretOrientation = 0;
    this.gunShellImage = new Image();
    this.gunShellImage.src = 'redGunShell.png';
    this.targetIndex = undefined;
    this.rechargeGunTimer = this.rechargeGunTime;
    this.relativeTurretSize = relativeTurretSize;
}

ShootableObject.prototype = inherit(DestroyableVisibleObject.prototype);
ShootableObject.prototype.constructor = ShootableObject;