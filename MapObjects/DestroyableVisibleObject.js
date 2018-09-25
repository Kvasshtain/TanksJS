function DestroyableVisibleObject(
    currentMapCell,
    isPassable,
    isGunShellPenetrable,
    graphicObject,
    health,
    disappearanceAfterDeathCount) {

    if (!(currentMapCell instanceof MapCell) && currentMapCell !== undefined)
        throw new TypeError("currentMapCell isn't MapCell");

    if ("boolean" != typeof isPassable)
        throw new TypeError("isPassable isn't bool");

    if ("boolean" != typeof isGunShellPenetrable)
        throw new TypeError("isGunShellPenetrable isn't bool");

    if (!(graphicObject instanceof GraphicObject) && graphicObject !== undefined)
        throw new TypeError("graphicObject isn't GraphicObject");

    if (!isInteger(health))
        throw TypeError("health isn't integer");

    if (!isInteger(disappearanceAfterDeathCount))
        throw TypeError("disappearanceAfterDeathCount isn't integer");

    VisibleObject.call(this, currentMapCell, isPassable, isGunShellPenetrable, graphicObject);

    this.health = health;
    this.maxHealth = health;
    this.disappearanceAfterDeathCount = disappearanceAfterDeathCount;
}

DestroyableVisibleObject.prototype = inherit(VisibleObject.prototype);
DestroyableVisibleObject.prototype.constructor = DestroyableVisibleObject;