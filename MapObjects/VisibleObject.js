function VisibleObject(currentMapCell, isPassable, isGunShellPenetrable, graphicObject) {

    if (!(currentMapCell instanceof MapCell) && currentMapCell !== undefined)
        throw new TypeError("currentMapCell isn't MapCell");

    if ("boolean" != typeof isPassable)
        throw new TypeError("isPassable isn't bool");

    if ("boolean" != typeof isGunShellPenetrable)
        throw new TypeError("isGunShellPenetrable isn't bool");

    if (!(graphicObject instanceof GraphicObject) && graphicObject !== undefined)
        throw new TypeError("graphicObject isn't GraphicObject");

    GameObject.call(this, currentMapCell, isPassable, isGunShellPenetrable);

    this.graphicObject = graphicObject;
}

VisibleObject.prototype = inherit(GameObject.prototype);
VisibleObject.prototype.constructor = VisibleObject;