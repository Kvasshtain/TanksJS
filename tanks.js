function findPathForAllMovableObjects(movableObjects, pathFinder) {
    var movableObject;

    if (!(movableObjects instanceof Array) && movableObjects !== undefined)
        throw TypeError("movableObjects is not Array or undefined");

    for (var i = 0; i < movableObjects.length; i++) {
        if (!(movableObjects[i] instanceof MovableObject) && !(movableObjects[i] instanceof Unit))
            throw TypeError("movableObject isn't MovableObject or Unit");
    }

    if (!(pathFinder instanceof PathFinder))
        throw TypeError("pathFinder is not PathFinder");

    for (var i = 0; i < movableObjects.length; i++) {
        movableObject = movableObjects[i];

        if (!MapCell.areEqual(movableObject.currentMapCell, movableObject.destinationMapCell)) {
            movableObject.movementPath = pathFinder.findPath(movableObject.nextMapCell, movableObject.destinationMapCell);
            movableObject.movementPathStepIndex = 1;
        }
    }
}

function gameRoutine(){

    var tankImage1 = new Image(),
        tankImage2 = new Image(),
        tankImage3 = new Image(),
        tankTurretImage3 = new Image(),
        tankTurretImage4 = new Image(),
        stoneImage1 = new Image(),
        treeImage1 = new Image(),
        gunImage1 = new Image(),
        gunImage2 = new Image(),
        carImage1 = new Image(),
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

        unit11 = new ShootableMovableObject(
            new MapCell(6, 17),
            false,
            true,
            tankImage2,
            1,
            500,
            100,
            "t34-42",
            "РККА",
            500,
            5,
            100,
            tankTurretImage4,
            1.3,
            new MapCell(6, 17),
            "up"),

        unit12 = new ShootableMovableObject(
            new MapCell(7,1),
            false,
            true,
            tankImage3,
            1.3,
            1000,
            100,
            "Pz-5-Panther",
            "панцерваффе",
            1000,
            10,
            100,
            tankTurretImage3,
            2,
            new MapCell(7,1),
            "down"),

        units = [unit0, unit1, unit2, unit3, unit4, unit5, unit6, unit7, unit8, unit9, unit10, unit11, unit12],

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

        gun1 = new ShootableObject(
            new MapCell(13,4),
            false,
            true,
            undefined,
            1,
            100,
            500,
            "pak-40",
            "панцерваффе",
            500,
            1,
            100,
            gunImage2,
            1),

        car0 = new MovableObject(
            new MapCell(14,9),
            false,
            true,
            carImage1,
            0.7,
            100,
            100,
            new MapCell(14,9),
            "up"
        ),

        shootableObjects = units.concat(gun0, gun1),

        visibleObjects = [stone0, stone1, stone2, stone3, stone4, stone5,
                          tree0, tree1, tree2, tree3, tree4, tree5, gun0, gun1],

        movableObjects = units.concat(car0),

        findableObjects = shootableObjects.concat(movableObjects),

        gunShells = [],
        cellWidth = 50,
        cellHeight = 50,
        columnNum = 20,
        rowNum = 20,
        battleMap = new BattleMap(columnNum, rowNum),
        gameDrawer = new GameDrawer(cellWidth, cellHeight, battleMap, movableObjects, gunShells, visibleObjects),
        unitFinder = new UnitFinder(findableObjects, cellWidth, cellHeight),
        mapObjectFinder = new MapObjectFinder(visibleObjects, cellWidth, cellHeight),
        pathFinder = new PathFinder(battleMap, unitFinder, mapObjectFinder),
        unitsMover = new UnitsMover(movableObjects.concat(units), pathFinder, unitFinder, cellWidth, cellHeight),
        gameProperty = new GameProperty("0", 0, findableObjects, unitFinder, undefined, undefined, "панцерваффе"),
        unitStriker = new UnitStriker(shootableObjects, gunShells, unitFinder, mapObjectFinder, cellWidth, cellHeight),
        unitTracker = new UnitTracker(units, cellWidth, cellHeight),
        gameTimer = new GameTimer();

    tankImage1.src = 'Pz-3.png';
    tankImage2.src = 't34-42.png';
    tankImage3.src = 'Pz-5-Panther.png';
    tankTurretImage3.src = 'Pz-5-Panther_turret.png';
    tankTurretImage4.src = 't34-42_turret.png';
    stoneImage1.src = 'stone1.png';
    treeImage1.src = 'spruce_tree1.png';
    gunImage1.src = 'zis-3.png';
    gunImage2.src = 'pak-40.png',
    carImage1.src = 'car.png';

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

        findPathForAllMovableObjects(movableObjects, pathFinder);

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





