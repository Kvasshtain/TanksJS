function MapObjectFinder(gameObjects, cellWidth, cellHeight){

    if (!(gameObjects instanceof Array) && !(gameObjects instanceof Object))
        throw TypeError("This is not Array or Object");

    for (var i = 0; i < gameObjects.length; i++){
        if (!(gameObjects[i] instanceof GameObject))
            throw TypeError("This is not GameObject");
    }

    if (!cellWidth)
        throw TypeError("cellWidth is undefined");

    if (!cellHeight)
        throw TypeError("cellHeight is undefined");

    if (cellWidth <= 0)
        throw RangeError("cellWidth <= 0");

    if (cellHeight <= 0)
        throw RangeError("cellHeight <= 0");

    this.gameObjects = gameObjects;
    this.cellWidth = cellWidth;
    this.cellHeight = cellHeight;
    this.gameObjectHalfWidth = cellWidth / 2;
    this.gameObjectHalfHeight = cellHeight / 2;
}

MapObjectFinder.prototype = {
    constructor : MapObjectFinder,

    _isObjectMapObject : function (mapObject) {
        return (mapObject instanceof GameObject
                ||
                mapObject.currentMapCell)
    },

    findByMapCellObjIndex : function (mapCell) {

        var mapObject,
            currentMapCell,
            nextMapCell;

        if (!(mapCell instanceof MapCell))
            throw TypeError("This is not MapCell");

        for (var objectIndex = 0; objectIndex < this.gameObjects.length; objectIndex++){

            mapObject = this.gameObjects[objectIndex];
            currentMapCell = mapObject.currentMapCell;
            nextMapCell = mapObject.nextMapCell;

            if (MapCell.areEqual(currentMapCell, mapCell)
                ||
                MapCell.areEqual(nextMapCell, mapCell)) {
                return objectIndex;
            }
        }

        return undefined;
    },

    findByMapCellImpassableObjIndex : function (mapCell) {

        if (!(mapCell instanceof MapCell))
            throw TypeError("This is not MapCell");

        var objectIndex = this.findByMapCellObjIndex(mapCell);

        if (!objectIndex)
            return undefined;

        if (this.gameObjects[objectIndex].isPassable)
            return undefined;

        return objectIndex;
    },

    findByCoordinatesObjIndex : function (point) {

        if (!(point instanceof Point))
            throw TypeError("point isn't Point");

        var gameObjectX,
            gameObjectY,
            gameObject;

        for (var objectIndex = 0; objectIndex < this.gameObjects.length; objectIndex++){
            gameObject = this.gameObjects[objectIndex];
            gameObjectX = gameObject.renderingX;
            gameObjectY = gameObject.renderingY;

            if (!gameObjectX)
                gameObjectX = this.cellHeight * gameObject.currentMapCell.xIndex;

            if (!gameObjectY)
                gameObjectY = this.cellWidth * gameObject.currentMapCell.yIndex;

            if (((gameObjectX - this.gameObjectHalfWidth < point.x) && (point.x < gameObjectX + this.gameObjectHalfWidth))
                &&
                ((gameObjectY - this.gameObjectHalfHeight < point.y) && (point.y < gameObjectY + this.gameObjectHalfHeight))) {
                return objectIndex;
            }
        }

        return undefined;
    },

    findByCoordinatesGunShellImpenetrableObjIndex : function (point) {

        if (!(point instanceof Point))
            throw TypeError("point isn't Point");

        var objectIndex = this.findByCoordinatesObjIndex(point);

        if (!objectIndex)
            return undefined;

        if (this.gameObjects[objectIndex].isGunShellPenetrable)
            return undefined;

        return objectIndex;
    }
}