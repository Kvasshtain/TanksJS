function MapBlock(mapCell, isPassable) {

    if (!mapCell instanceof MapCell)
        throw new TypeError("currentMapCell is not MapCell");

    if ((typeof isPassable) != "boolean")
        throw TypeError("isPassable isn't boolean");

    this.mapCell = mapCell;
    this.isPassable = isPassable;
}

MapBlock.prototype = {
    constructor : MapBlock
}