function GameProperty(currentKey, selectedUnitIndex, mapObjects, unitFinder, leftButtonSelectedCell, rightButtonSelectedCell, gamerTeam){

    if (!isInteger(selectedUnitIndex))
        throw TypeError("shootableObjects isn't integer");

    if (!(mapObjects instanceof Array) && mapObjects !== undefined)
        throw TypeError("shootableObjects is not Array or undefined");

    if (!(unitFinder instanceof UnitFinder))
        throw TypeError("unitFinder is not UnitFinder");

    if (!(leftButtonSelectedCell instanceof MapCell) && leftButtonSelectedCell != undefined)
        throw TypeError("leftButtonSelectedCell is not MapCell");

    if (!(rightButtonSelectedCell instanceof MapCell) && rightButtonSelectedCell != undefined)
        throw TypeError("rightButtonSelectedCell is not MapCell");

    if (gamerTeam === undefined)
        throw TypeError("gamerTeam is undefined");

    this.currentGameMenuClickedButton = null;
    this.currentKey = currentKey;
    this.leftButtonSelectedCell = leftButtonSelectedCell;
    this.rightButtonSelectedCell = rightButtonSelectedCell;
    this.selectedUnitIndex = selectedUnitIndex;
    this.mapObjects = mapObjects;
    this.unitFinder = unitFinder;
    this.gameState = new InitialState();
    this.gamerTeam = gamerTeam;
}

GameProperty.prototype = {
    constructor : GameProperty,

    currentHighlightedUnitIndex : undefined,

    unitStop : function () {
        var unit = this.mapObjects[this.selectedUnitIndex];
        MovableObject.Stop(unit);
        unit.targetIndex = undefined;
    }
}