function findPathForAllUnits(units, pathFinder) {
    var unit;

    if (!(units instanceof Array) && units !== undefined)
        throw TypeError("shootableObjects is not Array or undefined");

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

    var tankImage1 = new Image(),
        tankImage2 = new Image(),
        stoneImage1 = new Image(),
        treeImage1 = new Image(),
        gunImage1 = new Image(),
        moveDelay = 10,

        unit0 = new Unit("pz3", new MapCell(1, 1), new MapCell(1, 1), "down", tankImage1, "панцерваффе", 40, 500),
        unit1 = new Unit("pz3", new MapCell(2, 1), new MapCell(2, 1), "down", tankImage1, "панцерваффе", 40, 500),
        unit2 = new Unit("pz3", new MapCell(3, 1), new MapCell(3, 1), "down", tankImage1, "панцерваффе", 40, 500),
        unit3 = new Unit("pz3", new MapCell(4, 1), new MapCell(4, 1), "down", tankImage1, "панцерваффе", 40, 500),
        unit4 = new Unit("pz3", new MapCell(5, 1), new MapCell(5, 1), "down", tankImage1, "панцерваффе", 40, 500),
        unit5 = new Unit("pz3", new MapCell(6, 1), new MapCell(6, 1), "down", tankImage1, "панцерваффе", 40, 500),

        unit6 = new Unit("t34-42", new MapCell(1, 17), new MapCell(1, 17), "up", tankImage2, "РККА", 40, 500),
        unit7 = new Unit("t34-42", new MapCell(2, 17), new MapCell(2, 17), "up", tankImage2, "РККА", 40, 500),
        unit8 = new Unit("t34-42", new MapCell(3, 17), new MapCell(3, 17), "up", tankImage2, "РККА", 40, 500),
        unit9 = new Unit("t34-42", new MapCell(4, 17), new MapCell(4, 17), "up", tankImage2, "РККА", 40, 500),
        unit10 = new Unit("t34-42", new MapCell(5, 17), new MapCell(5, 17), "up", tankImage2, "РККА", 40, 500),
        unit11 = new Unit("t34-42", new MapCell(6, 17), new MapCell(6, 17), "up", tankImage2, "РККА", 40, 500),

        units = [unit0, unit1, unit2, unit3, unit4, unit5, unit6, unit7, unit8, unit9, unit10, unit11],

        stone0 = new VisibleObject(new MapCell(1, 8), false, false, stoneImage1, 1),
        stone1 = new VisibleObject(new MapCell(2, 8), false, false, stoneImage1, 1),
        stone2 = new VisibleObject(new MapCell(3, 8), false, false, stoneImage1, 1),
        stone3 = new VisibleObject(new MapCell(4, 8), false, false, stoneImage1, 1),
        stone4 = new VisibleObject(new MapCell(5, 8), false, false, stoneImage1, 1),
        stone5 = new VisibleObject(new MapCell(6, 8), false, false, stoneImage1, 1),

        tree0 = new DestroyableVisibleObject(new MapCell(7,8), false, true, treeImage1, 1, 100, 500),
        tree1 = new DestroyableVisibleObject(new MapCell(8,8), false, true, treeImage1, 0.5, 100, 500),
        tree2 = new DestroyableVisibleObject(new MapCell(9,8), false, true, treeImage1, 1, 100, 500),
        tree3 = new DestroyableVisibleObject(new MapCell(10,8), false, true, treeImage1, 0.5, 100, 500),
        tree4 = new DestroyableVisibleObject(new MapCell(11,8), false, true, treeImage1, 1, 100, 500),
        tree5 = new DestroyableVisibleObject(new MapCell(12,8), false, true, treeImage1, 0.5, 100, 500),

        gun0 = new ShootableObject(
            new MapCell(13,8),
            false,
            true,
            undefined,
            1,
            100,
            500,
            "zis-3",
            "РККА",
            500,
            1,
            100,
            gunImage1,
            1),

        shootableObjects = units.concat(gun0),

        visibleObjects = [stone0, stone1, stone2, stone3, stone4, stone5,
                          tree0, tree1, tree2, tree3, tree4, tree5, gun0],

        gunShells = [],
        cellWidth = 50,
        cellHeight = 50,
        columnNum = 20,
        rowNum = 20,
        battleMap = new BattleMap(columnNum, rowNum),
        gameDrawer = new GameDrawer(cellWidth, cellHeight, battleMap, units, gunShells, visibleObjects),
        unitFinder = new UnitFinder(shootableObjects, cellWidth, cellHeight),
        mapObjectFinder = new MapObjectFinder(visibleObjects, cellWidth, cellHeight),
        pathFinder = new PathFinder(battleMap, unitFinder, mapObjectFinder),
        unitsMover = new UnitsMover(units, pathFinder, unitFinder, cellWidth, cellHeight),
        gameProperty = new GameProperty("0", 0, units, unitFinder, undefined, undefined),
        unitStriker = new UnitStriker(shootableObjects, gunShells, unitFinder, mapObjectFinder, cellWidth, cellHeight),
        unitTracker = new UnitTracker(units, cellWidth, cellHeight),
        gameTimer = new GameTimer();

    tankImage1.src = 'Pz-3.png';
    tankImage2.src = 't34-42.png';
    stoneImage1.src = 'stone1.png';
    treeImage1.src = 'spruce_tree1.png';
    gunImage1.src = 'zis-3.png'

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

        gameDrawer.drawVisibleObjects();
        gameDrawer.drawUnits();
        gameDrawer.drawGunShell();
        gameDrawer.drawSmoke();

        unitTracker.unitTrackRoutine();
    }

    setInterval(updateGame, moveDelay);
}

gameRoutine();





