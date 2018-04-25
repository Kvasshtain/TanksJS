function findPathForAllUnits(units, pathFinder) {
    var unit;

    if (!(units instanceof Array) && units !== undefined)
        throw TypeError("units is not Array or undefined");

    if (!(pathFinder instanceof PathFinder))
        throw TypeError("pathFinder is not PathFinder");

    for (var i = 0; i < units.length; i++) {
        unit = units[i];

        if (!MapCell.areEqual(unit.currentMapCell, unit.destinationMapCell)) {
            unit.movementPath = pathFinder.findPath(unit.nextMapCell, unit.destinationMapCell);
            unit.movementPathStepIndex = 1;
        }
    }
}

function gameRoutine(){

    var image1 = new Image(),
        image2 = new Image(),
        moveDelay = 10,
        unit0 = new Unit("pz3", new MapCell(1, 1), new MapCell(1, 1), "upRight", image1, "панцерваффе", 100, 200),
        unit1 = new Unit("pz3", new MapCell(2, 1), new MapCell(2, 1), "upLeft", image1, "панцерваффе", 100, 200),
        // unit2 = new Unit("pz3", new MapCell(3, 1), new MapCell(3, 1), "upLeft", image1, "панцерваффе", 100, 200),
        // unit3 = new Unit("pz3", new MapCell(4, 1), new MapCell(4, 1), "upLeft", image1, "панцерваффе", 100, 200),
        // unit4 = new Unit("pz3", new MapCell(5, 1), new MapCell(5, 1), "upLeft", image1, "панцерваффе", 100, 200),
        // unit5 = new Unit("pz3", new MapCell(6, 1), new MapCell(6, 1), "upLeft", image1, "панцерваффе", 100, 200),
        // unit6 = new Unit("pz3", new MapCell(7, 1), new MapCell(7, 1), "upLeft", image1, "панцерваффе", 100, 200),
        // unit7 = new Unit("pz3", new MapCell(8, 1), new MapCell(8, 1), "upLeft", image1, "панцерваффе", 100, 200),
        // unit8 = new Unit("pz3", new MapCell(9, 1), new MapCell(9, 1), "upLeft", image1, "панцерваффе", 100, 200),
        // unit9 = new Unit("pz3", new MapCell(10, 1), new MapCell(10, 1), "upLeft", image1, "панцерваффе", 100, 200),
        // unit10 = new Unit("t34-42", new MapCell(11, 1), new MapCell(11, 1), "upLeft", image2, "РККА", 100, 200),
        // unit11 = new Unit("t34-42", new MapCell(12, 1), new MapCell(12, 1), "upLeft", image2, "РККА", 100, 200),
        // unit12 = new Unit("t34-42", new MapCell(13, 1), new MapCell(13, 1), "upLeft", image2, "РККА", 100, 200),
        // unit13 = new Unit("t34-42", new MapCell(14, 1), new MapCell(14, 1), "upLeft", image2, "РККА", 100, 200),
        // unit14 = new Unit("t34-42", new MapCell(15, 1), new MapCell(15, 1), "upLeft", image2, "РККА", 100, 200),
        // unit15 = new Unit("t34-42", new MapCell(16, 1), new MapCell(16, 1), "upLeft", image2, "РККА", 100, 200),
        // unit16 = new Unit("t34-42", new MapCell(17, 1), new MapCell(17, 1), "upLeft", image2, "РККА", 100, 200),
        unit17 = new Unit("t34-42", new MapCell(18, 1), new MapCell(18, 1), "upLeft", image2, "РККА", 100, 200),
        //units = [unit0, unit1, unit2, unit3, unit4, unit5, unit6, unit7, unit8, unit9, unit10, unit11, unit12, unit13, unit14, unit15, unit16, unit17],
        units = [unit0, unit1, unit17],
        cellWidth = 50,
        cellHeight = 50,
        columnNum = 20,
        rowNum = 20,
        battleMap = new BattleMap(columnNum, rowNum),
        gameDrawer = new GameDrawer(cellWidth, cellHeight, battleMap, units),
        unitFinder = new UnitFinder(units),
        pathFinder = new PathFinder(battleMap, unitFinder),
        unitsMover = new UnitsMover(units, pathFinder, unitFinder, cellWidth, cellHeight),
        gameProperty = new GameProperty("0", 0, units, unitFinder, undefined, undefined),
        unitStriker = new UnitStriker(units),
        unitTracker = new UnitTracker(units),
        gameTimer = new GameTimer();

    image1.src = 'Pz-3.png';
    image2.src = 't34-42.png';

    function getChar(event) {
        gameProperty.currentKey = event.which;
    }

    function testTimer() {
        alert("Ху-Ху!");
    }

    document.onkeydown = getChar;

    function gameClickHandler(event) {

        var currentX,
            currentY,
            selectedCell;

        cellWidth = gameDrawer.cellWidth;
        cellHeight = gameDrawer.cellHeight;
        currentX = Math.floor(event.offsetX / cellWidth);
        currentY = Math.floor(event.offsetY / cellHeight);

        if (event.which == 1)
        {
            selectedCell = new MapCell(currentX, currentY);
            gameProperty.leftButtonSelectedCell = selectedCell;
        }

        if (event.which == 2)
        {
            selectedCell = new MapCell(currentX, currentY);
            gameProperty.rightButtonSelectedCell = selectedCell;
        }
    }

    gameDrawer.canvas.onclick = gameClickHandler;

    function updateGame() {
        gameTimer.countUp();
        gameDrawer.drawMap();
        gameProperty.gameState.handleUserAction(gameProperty);
        findPathForAllUnits(units, pathFinder);
        unitStriker.unitFightRoutine();
        unitsMover.moveUnits();
        gameDrawer.drawUnits();
        unitTracker.unitTrackRoutine();
    }

    setInterval(updateGame, moveDelay);
}

gameRoutine();





