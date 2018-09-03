function DestroyableVisibleObject(
    currentMapCell,
    isPassable,
    isGunShellPenetrable,
    image,
    relativeSize,
    health,
    disappearanceAfterDeathCount) {

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

    VisibleObject.call(this, currentMapCell, isPassable, isGunShellPenetrable, image, relativeSize);

    this.health = health;
    this.maxHealth = health;
    this.disappearanceAfterDeathCount = disappearanceAfterDeathCount;
}

DestroyableVisibleObject.prototype = inherit(VisibleObject.prototype);
DestroyableVisibleObject.prototype.constructor = DestroyableVisibleObject;