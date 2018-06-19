function VisibleObject(currentMapCell, isPassable, isGunShellPenetrable, image, relativeSize) {

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

    GameObject.call(this, currentMapCell, isPassable, isGunShellPenetrable);

    this.image = image;
    this.relativeSize = relativeSize;
}

VisibleObject.prototype = inherit(GameObject.prototype);
VisibleObject.prototype.constructor = VisibleObject;