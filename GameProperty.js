function GameProperty(currentKey, selectedUnitIndex, units, unitFinder, pathFinder, leftButtonSelectedCell, rightButtonSelectedCell){

    if (!(units instanceof Array) && units !== undefined)
        throw TypeError("units is not Array or undefined");

    if (!(unitFinder instanceof UnitFinder))
        throw TypeError("unitFinder is not UnitFinder");

    this.currentKey = currentKey;
    this.leftButtonSelectedCell = leftButtonSelectedCell;
    this.rightButtonSelectedCell = rightButtonSelectedCell;
    this.selectedUnitIndex = selectedUnitIndex;
    this.units = units;
    this.unitFinder = unitFinder;
    this.pathFinder = pathFinder;
    this.gameState = new InitialState();
}

GameProperty.prototype = {
    constructor : GameProperty
}