function UnitFinder(units){

    if (!(units instanceof Array) && !(units instanceof Object))
        throw TypeError("This is not Array or Object");

    for (var i = 0; i < units.length; i++){
        if (!(units[i] instanceof Unit))
            throw TypeError("This is not Unit");
    }

    this.units = units;
}

UnitFinder.prototype = {
    constructor : UnitFinder,

    findByCoordinates : function (mapCell) {

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
    }
}