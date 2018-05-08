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
        unit0 = new Unit("pz3", new MapCell(1, 1), new MapCell(1, 1), "upRight", image1, "панцерваффе", 40, 500),
        unit1 = new Unit("pz3", new MapCell(2, 1), new MapCell(2, 1), "upLeft", image1, "панцерваффе", 40, 500),
        unit2 = new Unit("pz3", new MapCell(3, 1), new MapCell(3, 1), "upLeft", image1, "панцерваффе", 500, 500),
        unit3 = new Unit("pz3", new MapCell(4, 1), new MapCell(4, 1), "upLeft", image1, "панцерваффе", 500, 500),
        unit4 = new Unit("pz3", new MapCell(5, 1), new MapCell(5, 1), "upLeft", image1, "панцерваффе", 500, 500),
        unit5 = new Unit("pz3", new MapCell(6, 1), new MapCell(6, 1), "upLeft", image1, "панцерваффе", 500, 500),
        unit6 = new Unit("pz3", new MapCell(7, 1), new MapCell(7, 1), "upLeft", image1, "панцерваффе", 500, 500),
        unit7 = new Unit("pz3", new MapCell(8, 1), new MapCell(8, 1), "upLeft", image1, "панцерваффе", 500, 500),
        unit8 = new Unit("pz3", new MapCell(9, 1), new MapCell(9, 1), "upLeft", image1, "панцерваффе", 500, 500),
        unit9 = new Unit("pz3", new MapCell(10, 1), new MapCell(10, 1), "upLeft", image1, "панцерваффе", 500, 500),
        unit10 = new Unit("t34-42", new MapCell(11, 1), new MapCell(11, 1), "upLeft", image2, "РККА", 500, 500),
        unit11 = new Unit("t34-42", new MapCell(12, 1), new MapCell(12, 1), "upLeft", image2, "РККА", 500, 500),
        unit12 = new Unit("t34-42", new MapCell(13, 1), new MapCell(13, 1), "upLeft", image2, "РККА", 500, 500),
        unit13 = new Unit("t34-42", new MapCell(14, 1), new MapCell(14, 1), "upLeft", image2, "РККА", 500, 500),
        unit14 = new Unit("t34-42", new MapCell(15, 1), new MapCell(15, 1), "upLeft", image2, "РККА", 500, 500),
        unit15 = new Unit("t34-42", new MapCell(16, 1), new MapCell(16, 1), "upLeft", image2, "РККА", 500, 500),
        unit16 = new Unit("t34-42", new MapCell(17, 1), new MapCell(17, 1), "upLeft", image2, "РККА", 500, 500),
        unit17 = new Unit("t34-42", new MapCell(18, 1), new MapCell(18, 1), "upLeft", image2, "РККА", 10, 500),
        unit18 = new Unit("t34-42", new MapCell(11, 2), new MapCell(11, 1), "upLeft", image2, "РККА", 500, 500),
        unit19 = new Unit("t34-42", new MapCell(12, 2), new MapCell(12, 1), "upLeft", image2, "РККА", 500, 500),
        unit20 = new Unit("t34-42", new MapCell(13, 2), new MapCell(13, 1), "upLeft", image2, "РККА", 500, 500),
        unit21 = new Unit("t34-42", new MapCell(14, 2), new MapCell(14, 1), "upLeft", image2, "РККА", 500, 500),
        unit22 = new Unit("t34-42", new MapCell(15, 2), new MapCell(15, 1), "upLeft", image2, "РККА", 500, 500),
        unit23 = new Unit("t34-42", new MapCell(16, 2), new MapCell(16, 1), "upLeft", image2, "РККА", 500, 500),
        unit24 = new Unit("t34-42", new MapCell(17, 2), new MapCell(17, 1), "upLeft", image2, "РККА", 500, 500),
        unit25 = new Unit("t34-42", new MapCell(18, 2), new MapCell(18, 1), "upLeft", image2, "РККА", 500, 500),
        unit26 = new Unit("pz3", new MapCell(1, 2), new MapCell(1, 1), "upRight", image1, "панцерваффе", 500, 500),
        unit27 = new Unit("pz3", new MapCell(2, 2), new MapCell(2, 1), "upLeft", image1, "панцерваффе", 500, 500),
        unit28 = new Unit("pz3", new MapCell(3, 2), new MapCell(3, 1), "upLeft", image1, "панцерваффе", 500, 500),
        unit29 = new Unit("pz3", new MapCell(4, 2), new MapCell(4, 1), "upLeft", image1, "панцерваффе", 500, 500),
        unit30 = new Unit("pz3", new MapCell(5, 2), new MapCell(5, 1), "upLeft", image1, "панцерваффе", 500, 500),
        unit31 = new Unit("pz3", new MapCell(6, 2), new MapCell(6, 1), "upLeft", image1, "панцерваффе", 500, 500),
        unit32 = new Unit("pz3", new MapCell(7, 2), new MapCell(7, 1), "upLeft", image1, "панцерваффе", 500, 500),
        unit33 = new Unit("pz3", new MapCell(8, 2), new MapCell(8, 1), "upLeft", image1, "панцерваффе", 500, 500),
        unit34 = new Unit("pz3", new MapCell(9, 2), new MapCell(9, 1), "upLeft", image1, "панцерваффе", 500, 500),
        unit35 = new Unit("pz3", new MapCell(10, 2), new MapCell(10, 1), "upLeft", image1, "панцерваффе", 500, 500),

        unit36 = new Unit("t34-42", new MapCell(18, 3), new MapCell(18, 3), "upLeft", image2, "РККА", 500, 500),
        unit37 = new Unit("pz3", new MapCell(1, 3), new MapCell(1, 3), "upRight", image1, "панцерваффе", 500, 500),
        unit38 = new Unit("pz3", new MapCell(2, 3), new MapCell(2, 3), "upLeft", image1, "панцерваффе", 500, 500),
        unit39 = new Unit("pz3", new MapCell(3, 3), new MapCell(3, 3), "upLeft", image1, "панцерваффе", 500, 500),
        unit40 = new Unit("pz3", new MapCell(4, 3), new MapCell(4, 3), "upLeft", image1, "панцерваффе", 500, 500),
        unit41 = new Unit("pz3", new MapCell(5, 3), new MapCell(5, 3), "upLeft", image1, "панцерваффе", 500, 500),
        unit42 = new Unit("pz3", new MapCell(6, 3), new MapCell(6, 3), "upLeft", image1, "панцерваффе", 500, 500),
        unit43 = new Unit("pz3", new MapCell(7, 3), new MapCell(7, 3), "upLeft", image1, "панцерваффе", 500, 500),
        unit44 = new Unit("pz3", new MapCell(8, 3), new MapCell(8, 3), "upLeft", image1, "панцерваффе", 500, 500),
        unit45 = new Unit("pz3", new MapCell(9, 3), new MapCell(9, 3), "upLeft", image1, "панцерваффе", 500, 500),
        unit46 = new Unit("pz3", new MapCell(10, 3), new MapCell(10, 3), "upLeft", image1, "панцерваффе", 500, 500),
        unit47 = new Unit("t34-42", new MapCell(18, 4), new MapCell(18, 4), "upLeft", image2, "РККА", 500, 500),

        units = [unit0, unit1, unit2, unit3, unit4, unit5, unit6, unit7, unit8, unit9, unit10, unit11,
            unit12, unit13, unit14, unit15, unit16, unit17, unit18, unit19, unit20, unit21, unit22, unit23,
            unit24, unit25, unit26, unit27, unit28, unit29, unit30, unit31, unit32, unit33, unit34, unit35,
            unit36, unit37, unit38, unit39, unit40, unit41, unit42, unit43, unit44, unit45, unit46, unit47],

        //units = [unit0, unit1, unit17],

        gunShells = [],
        cellWidth = 50,
        cellHeight = 50,
        columnNum = 20,
        rowNum = 20,
        battleMap = new BattleMap(columnNum, rowNum),
        gameDrawer = new GameDrawer(cellWidth, cellHeight, battleMap, units, gunShells),
        unitFinder = new UnitFinder(units, cellWidth, cellHeight),
        pathFinder = new PathFinder(battleMap, unitFinder),
        unitsMover = new UnitsMover(units, pathFinder, unitFinder, cellWidth, cellHeight),
        gameProperty = new GameProperty("0", 0, units, unitFinder, undefined, undefined),
        unitStriker = new UnitStriker(units, gunShells, unitFinder, cellWidth, cellHeight),
        unitTracker = new UnitTracker(units),
        gameTimer = new GameTimer();

    image1.src = 'Pz-3.png';
    image2.src = 't34-42.png';

    function getChar(event) {
        gameProperty.currentKey = event.which;
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
        gameDrawer.drawGunShell();
        gameDrawer.drawSmoke();

        unitTracker.unitTrackRoutine();
    }

    setInterval(updateGame, moveDelay);
}

gameRoutine();





