function BattleMap(columnNum, rowNum) {

    if (!isInteger(columnNum))
        throw TypeError("columnNum is not int");

    if (!isInteger(rowNum))
        throw TypeError("rowNum is not int");

    if (columnNum <= 0)
        throw TypeError("columnNum <= 0");

    if (rowNum <= 0)
        throw TypeError("rowNum <= 0");

    this.columnNum = columnNum;
    this.rowNum = rowNum;
}

BattleMap.prototype ={
    constructor: BattleMap,

    isCellInMap: function(mapCell)
    {
        if (!(mapCell instanceof MapCell))
            throw TypeError("This is not MapCell");

        if (mapCell.xIndex < 0)
            return false;

        if (mapCell.yIndex < 0)
            return false;

        if (mapCell.xIndex >= this.columnNum)
            return false;

        if (mapCell.yIndex >= this.rowNum)
            return false;

        return true;
    }
}