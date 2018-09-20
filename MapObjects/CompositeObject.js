function CompositeObject(currentMapCell, isPassable, isGunShellPenetrable, image, xSize, ySize) {

    if (!(currentMapCell instanceof MapCell) && currentMapCell != undefined)
        throw new TypeError("currentMapCell isn't MapCell");

    if ("boolean" != typeof isPassable)
        throw new TypeError("isPassable isn't bool");

    if ("boolean" != typeof isGunShellPenetrable)
        throw new TypeError("isGunShellPenetrable isn't bool");

    if (!isInteger(xSize))
        throw new TypeError("xSize isn't integer");

    if (!isInteger(ySize))
        throw new TypeError("ySize isn't integer");

    GameObject.call(this, currentMapCell, isPassable, isGunShellPenetrable);

    this.image = image;
    this.xSize = xSize;
    this.ySize = ySize;

    this.internalObjects = [];

    for (var i = 0; i < xSize; i++) {
        for (var j = 0; j < ySize; j++) {
            this.internalObjects
                .push(new VisibleObject(
                              new MapCell(currentMapCell.xIndex + i, currentMapCell.yIndex + j),
                              isPassable,
                              isGunShellPenetrable,
                              undefined,
                              1)
                );
        }
    }
}

CompositeObject.prototype = inherit(GameObject.prototype);
CompositeObject.prototype.constructor = CompositeObject;