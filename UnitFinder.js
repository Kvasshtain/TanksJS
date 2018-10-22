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

    findByMapCellObjIndex : function (mapCell, myOwnIndex) {

        if (mapCell === undefined)
            return undefined;

        if (!(mapCell instanceof MapCell))
            throw TypeError("mapCell isn't MapCell");

        if (!isInteger(myOwnIndex) && myOwnIndex !== undefined)
            throw TypeError("myOwnIndex isn't index or undefined");

        for (var unitIndex = 0; unitIndex < this.findableObjects.length; unitIndex++){

            if (unitIndex === myOwnIndex)
                continue;

            if (MapCell.areEqual(this.findableObjects[unitIndex].currentMapCell, mapCell)
                ||
                MapCell.areEqual(this.findableObjects[unitIndex].nextMapCell, mapCell)) {
                return unitIndex;
            }
        }

        return undefined;
    },

    findCrossMovementUnit : function (currentMapCell, nextMapCell) {

        if (currentMapCell === undefined)
            return undefined;

        if (nextMapCell === undefined)
            return undefined;

        if (!(currentMapCell instanceof MapCell))
            throw TypeError("currentMapCell isn't MapCell");

        if (!(nextMapCell instanceof MapCell))
            throw TypeError("nextMapCell isn't MapCell");

        for (var unitIndex = 0; unitIndex < this.findableObjects.length; unitIndex++){

            if (this.findableObjects[unitIndex].currentMapCell === undefined)
                continue;

            if (this.findableObjects[unitIndex].nextMapCell === undefined)
                continue;

            if ((this.findableObjects[unitIndex].currentMapCell.xIndex == nextMapCell.xIndex)
                &&
                (this.findableObjects[unitIndex].nextMapCell.yIndex == nextMapCell.yIndex)
                &&
                (this.findableObjects[unitIndex].currentMapCell.yIndex == currentMapCell.yIndex)
                &&
                (this.findableObjects[unitIndex].nextMapCell.xIndex == currentMapCell.xIndex)) {
                return unitIndex;
            }

            if ((this.findableObjects[unitIndex].currentMapCell.yIndex == nextMapCell.yIndex)
                &&
                (this.findableObjects[unitIndex].nextMapCell.xIndex == nextMapCell.xIndex)
                &&
                (this.findableObjects[unitIndex].currentMapCell.xIndex == currentMapCell.xIndex)
                &&
                (this.findableObjects[unitIndex].nextMapCell.yIndex == currentMapCell.yIndex)) {
                return unitIndex;
            }
        }

        return undefined;
    },

    _isObjectUnit : function (mapObject) {
        return (mapObject instanceof MovableObject
                ||
                mapObject instanceof ShootableObject
                ||
                mapObject instanceof ShootableMovableObject)
    },

    findByCoordinatesObjIndex : function (point) {
        var unit,
            unitX,
            unitY;

        if (!(point instanceof Point))
            throw TypeError("point isn't Point");

        for (var unitIndex = 0; unitIndex < this.findableObjects.length; unitIndex++){
            unit = this.findableObjects[unitIndex];
            unitX = unit.renderingX;
            unitY = unit.renderingY;

            if (!unit)
                continue;

            if (!this._isObjectUnit(unit))
                continue;

            if (((unitX - this.unitHalfWidth < point.x)  && (point.x < unitX + this.unitHalfWidth))
                &&
                ((unitY - this.unitHalfHeight < point.y) && (point.y < unitY + this.unitHalfHeight))) {
                return unitIndex;
            }
        }

        return undefined;
    },

    getGameObjectByIndex : function (index) {
        return this.findableObjects[index];
    }
}