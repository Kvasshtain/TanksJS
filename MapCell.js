function MapCell(xIndex, yIndex) {
    if (!isInteger(xIndex))
        throw TypeError("xIndex is not int");

    if (!isInteger(yIndex))
        throw TypeError("yIndex is not int");

    this.xIndex = xIndex;
    this.yIndex = yIndex;
}

MapCell.prototype = {
    constructor : MapCell,

    identifyDirectionToNextCell : function (nextCell) {
        if (!(nextCell instanceof MapCell))
            throw TypeError("nextCell is not MapCell");

        if ((this.xIndex > nextCell.xIndex) && (this.yIndex > nextCell.yIndex))
            return "upLeft";

        if ((this.xIndex == nextCell.xIndex) && (this.yIndex > nextCell.yIndex))
            return "up";

        if ((this.xIndex < nextCell.xIndex) && (this.yIndex > nextCell.yIndex))
            return "upRight";

        if ((this.xIndex < nextCell.xIndex) && (this.yIndex == nextCell.yIndex))
            return "right";

        if ((this.xIndex < nextCell.xIndex) && (this.yIndex < nextCell.yIndex))
            return "downRight";

        if ((this.xIndex == nextCell.xIndex) && (this.yIndex < nextCell.yIndex))
            return "down";

        if ((this.xIndex > nextCell.xIndex) && (this.yIndex < nextCell.yIndex))
            return "downLeft";

        if ((this.xIndex > nextCell.xIndex) && (this.yIndex == nextCell.yIndex))
            return "left";
    }
}

MapCell.areEqual = function (firstCell, secondCell) {

    if (!(firstCell instanceof MapCell))
        return false;

    if (!secondCell instanceof MapCell)
        return false;

    if (firstCell === undefined)
        return false;

    if (secondCell === undefined)
        return false;

    if ((firstCell.xIndex == secondCell.xIndex) && (firstCell.yIndex == secondCell.yIndex)){
        return true;
    }

    return false;
}