function UnitFinder(shootableObjects, cellWidth, cellHeight){

    if (!(shootableObjects instanceof Array) && !(shootableObjects instanceof Object))
        throw TypeError("This is not Array or Object");

    for (var i = 0; i < shootableObjects.length; i++){
        if (!(shootableObjects[i] instanceof Unit) && !(shootableObjects[i] instanceof ShootableObject))
            throw TypeError("This is not ShootableObject");
    }

    if (cellWidth === undefined)
        throw TypeError("cellWidth === undefined");

    if (cellHeight === undefined)
        throw TypeError("cellHeight === undefined");

    if (cellWidth <= 0)
        throw RangeError("cellWidth <= 0");

    if (cellHeight <= 0)
        throw RangeError("cellHeight <= 0");

    this.shootableObjects = shootableObjects;
    this.unitHalfWidth = cellWidth / 2;
    this.unitHalfHeight = cellHeight / 2;
}

UnitFinder.prototype = {
    constructor : UnitFinder,

    findByMapCellObjIndex : function (mapCell) {

        if (!(mapCell instanceof MapCell))
            throw TypeError("This is not MapCell");

        for (var unitIndex = 0; unitIndex < this.shootableObjects.length; unitIndex++){

            if (MapCell.areEqual(this.shootableObjects[unitIndex].currentMapCell, mapCell)
                ||
                MapCell.areEqual(this.shootableObjects[unitIndex].nextMapCell, mapCell)) {
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

        for (var unitIndex = 0; unitIndex < this.shootableObjects.length; unitIndex++){
            unitX = this.shootableObjects[unitIndex].renderingX;
            unitY = this.shootableObjects[unitIndex].renderingY;

            if (((unitX - this.unitHalfWidth < point.x) && (point.x < unitX + this.unitHalfWidth))
                &&
                ((unitY - this.unitHalfHeight < point.y) && (point.y < unitY + this.unitHalfHeight))) {
                return unitIndex;
            }
        }

        return undefined;
    }
}