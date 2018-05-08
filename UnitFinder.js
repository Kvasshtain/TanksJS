function UnitFinder(units, cellWidth, cellHeight){

    if (!(units instanceof Array) && !(units instanceof Object))
        throw TypeError("This is not Array or Object");

    for (var i = 0; i < units.length; i++){
        if (!(units[i] instanceof Unit))
            throw TypeError("This is not Unit");
    }

    if (cellWidth === undefined)
        throw TypeError("cellWidth === undefined");

    if (cellHeight === undefined)
        throw TypeError("cellHeight === undefined");

    if (cellWidth <= 0)
        throw RangeError("cellWidth <= 0");

    if (cellHeight <= 0)
        throw RangeError("cellHeight <= 0");

    this.units = units;
    this.unitHalfWidth = cellWidth / 2;
    this.unitHalfHeight = cellHeight / 2;
}

UnitFinder.prototype = {
    constructor : UnitFinder,

    findByMapCell : function (mapCell) {

        if (!(mapCell instanceof MapCell))
            throw TypeError("This is not MapCell");

        for (var unitIndex = 0; unitIndex < this.units.length; unitIndex++){

            if (MapCell.areEqual(this.units[unitIndex].currentMapCell, mapCell)
                ||
                MapCell.areEqual(this.units[unitIndex].nextMapCell, mapCell)) {
                return unitIndex;
            }
        }

        return undefined;
    },

    findByCoordinates : function (point) {
        var unitX,
            unitY;

        if (!point instanceof Point)
            throw TypeError("point isn't Point");

        for (var unitIndex = 0; unitIndex < this.units.length; unitIndex++){
            unitX = this.units[unitIndex].renderingX;
            unitY = this.units[unitIndex].renderingY;

            if (((unitX - this.unitHalfWidth < point.x) && (point.x < unitX + this.unitHalfWidth))
                &&
                ((unitY - this.unitHalfHeight < point.y) && (point.y < unitY + this.unitHalfHeight))) {
                return unitIndex;
            }
        }

        return undefined;
    }
}