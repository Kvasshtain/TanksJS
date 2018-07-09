function UnitFinder(findableObjects, cellWidth, cellHeight){

    if (!(findableObjects instanceof Array) && !(findableObjects instanceof Object))
        throw TypeError("This is not Array or Object");

    for (var i = 0; i < findableObjects.length; i++){
        if (findableObjects[i].currentMapCell === undefined)
            throw TypeError("findableObjects doesn't have property currentMapCell");
    }

    if (cellWidth === undefined)
        throw TypeError("cellWidth === undefined");

    if (cellHeight === undefined)
        throw TypeError("cellHeight === undefined");

    if (cellWidth <= 0)
        throw RangeError("cellWidth <= 0");

    if (cellHeight <= 0)
        throw RangeError("cellHeight <= 0");

    this.findableObjects = findableObjects;
    this.unitHalfWidth = cellWidth / 2;
    this.unitHalfHeight = cellHeight / 2;
}

UnitFinder.prototype = {
    constructor : UnitFinder,

    findByMapCellObjIndex : function (mapCell) {

        if (!(mapCell instanceof MapCell))
            throw TypeError("This is not MapCell");

        for (var unitIndex = 0; unitIndex < this.findableObjects.length; unitIndex++){

            if (MapCell.areEqual(this.findableObjects[unitIndex].currentMapCell, mapCell)
                ||
                MapCell.areEqual(this.findableObjects[unitIndex].nextMapCell, mapCell)) {
                return unitIndex;
            }
        }

        return undefined;
    },

    findByCoordinatesObjIndex : function (point) {
        var unitX,
            unitY;

        if (!point instanceof Point)
            throw TypeError("point isn't Point");

        for (var unitIndex = 0; unitIndex < this.findableObjects.length; unitIndex++){
            unitX = this.findableObjects[unitIndex].renderingX;
            unitY = this.findableObjects[unitIndex].renderingY;

            if (((unitX - this.unitHalfWidth < point.x) && (point.x < unitX + this.unitHalfWidth))
                &&
                ((unitY - this.unitHalfHeight < point.y) && (point.y < unitY + this.unitHalfHeight))) {
                return unitIndex;
            }
        }

        return undefined;
    }
}