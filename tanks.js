function findPathForAllMovableObjects(movableObjects, pathFinder) {
    var movableObject;

    if (!(movableObjects instanceof Array) && movableObjects !== undefined)
        throw TypeError("movableObjects is not Array or undefined");

    // for (var i = 0; i < movableObjects.length; i++) {
    //     if (!(movableObjects[i] instanceof MovableObject) && !(movableObjects[i] instanceof Unit))
    //         throw TypeError("movableObject isn't MovableObject or Unit");
    // }

    if (!(pathFinder instanceof PathFinder))
        throw TypeError("pathFinder is not PathFinder");

    for (var i = 0; i < movableObjects.length; i++) {
        movableObject = movableObjects[i];

        if (!movableObject.currentMapCell
            ||
            !movableObject.nextMapCell
            ||
            !movableObject.destinationMapCell){
            continue;
        }

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
        tankTurretImage1 = new Image(),
        tankTurretImage3 = new Image(),
        tankTurretImage4 = new Image(),
        stoneImage1 = new Image(),
        treeImage1 = new Image(),
        gunImage1 = new Image(),
        gunImage2 = new Image(),
        carImage1 = new Image(),
        moveDelay = 10,

        unit0 = new ShootableMovableObject(
            new MapCell(1, 1),
            false,
            true,
            tankImage1,
            1,
            300,
            100,
            "pz3",
            "панцерваффе",
            300,
            3,
            100,
            tankTurretImage1,
            1.3,
            new MapCell(1, 1),
            "down"),

        unit1 = new ShootableMovableObject(
            new MapCell(2, 1),
            false,
            true,
            tankImage1,
            1,
            300,
            100,
            "pz3",
            "панцерваффе",
            300,
            3,
            100,
            tankTurretImage1,
            1.3,
            new MapCell(2, 1),
            "down"),

        unit2 = new Unit("pz3", new MapCell(3, 1), new MapCell(3, 1), "down", tankImage1, "панцерваффе", 40, 500),

        unit2 = new ShootableMovableObject(
            new MapCell(3, 1),
            false,
            true,
            tankImage1,
            1,
            300,
            100,
            "pz3",
            "панцерваффе",
            300,
            3,
            100,
            tankTurretImage1,
            1.3,
            new MapCell(3, 1),
            "down"),

        unit3 = new ShootableMovableObject(
            new MapCell(4, 1),
            false,
            true,
            tankImage1,
            1,
            300,
            100,
            "pz3",
            "панцерваффе",
            300,
            3,
            100,
            tankTurretImage1,
            1.3,
            new MapCell(4, 1),
            "down"),

        unit4 = new ShootableMovableObject(
            new MapCell(5, 1),
            false,
            true,
            tankImage1,
            1,
            300,
            100,
            "pz3",
            "панцерваффе",
            300,
            3,
            100,
            tankTurretImage1,
            1.3,
            new MapCell(5, 1),
            "down"),

        unit5 = new ShootableMovableObject(
            new MapCell(6, 1),
            false,
            true,
            tankImage1,
            1,
            300,
            100,
            "pz3",
            "панцерваффе",
            300,
            3,
            100,
            tankTurretImage1,
            1.3,
            new MapCell(6, 1),
            "down"),

        unit13 = new ShootableMovableObject(
            new MapCell(8, 1),
            false,
            true,
            tankImage1,
            1,
            300,
            100,
            "pz3",
            "панцерваффе",
            300,
            3,
            100,
            tankTurretImage1,
            1.3,
            new MapCell(8, 1),
            "down"),

        unit6 = new ShootableMovableObject(
            new MapCell(1, 17),
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
            new MapCell(1, 6),
            "up"),

        unit7 = new ShootableMovableObject(
            new MapCell(2, 17),
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
            new MapCell(2, 6),
            "up"),

        unit8 = new ShootableMovableObject(
            new MapCell(3, 17),
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
            new MapCell(3, 6),
            "up"),

        unit9 = new ShootableMovableObject(
            new MapCell(4, 17),
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
            new MapCell(4, 6),
            "up"),

        unit10 = new ShootableMovableObject(
            new MapCell(5, 17),
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
            new MapCell(10, 2),
            "up"),

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
            new MapCell(11, 1),
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
            new MapCell(15,10),
            false,
            true,
            carImage1,
            0.7,
            100,
            100,
            new MapCell(19,19),
            "up"
        ),

        units = [unit0, unit1, unit2, unit3, unit4, unit5, unit6, unit7, unit8, unit9, unit10, unit11, unit12, unit13],

        visibleObjects = [stone0, stone1, stone2, stone3, stone4, stone5,
            tree0, tree1, tree2, tree3, tree4, tree5],

        gameObjectsPool = units.concat(gun0, gun1).concat(car0).concat(visibleObjects),

        //gameObjectsPool = [unit0, unit8],

        gunShells = [],
        cellWidth = 50,
        cellHeight = 50,
        columnNum = 20,
        rowNum = 20,
        battleMap = new BattleMap(columnNum, rowNum),
        unitFinder = new UnitFinder(gameObjectsPool, cellWidth, cellHeight),
        mapObjectFinder = new MapObjectFinder(gameObjectsPool, cellWidth, cellHeight),
        pathFinder = new PathFinder(battleMap, unitFinder, mapObjectFinder),
        unitsMover = new UnitsMover(gameObjectsPool, pathFinder, unitFinder, mapObjectFinder, cellWidth, cellHeight),
        gameProperty = new GameProperty("0", 0, gameObjectsPool, unitFinder, undefined, undefined, "панцерваффе"),
        gameDrawer = new GameDrawer(cellWidth, cellHeight, battleMap, gunShells, gameObjectsPool, gameProperty),
        unitStriker = new UnitStriker(gameObjectsPool, gunShells, unitFinder, mapObjectFinder, cellWidth, cellHeight),
        unitTracker = new UnitTracker(gameObjectsPool, cellWidth, cellHeight),
        gameTimer = new GameTimer();

    tankImage1.src = 'Pz-3.png';
    tankImage2.src = 't34-42.png';
    tankImage3.src = 'Pz-5-Panther.png';
    tankTurretImage1.src = 'Pz-3_turret.png';
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

        findPathForAllMovableObjects(gameObjectsPool, pathFinder);

        unitStriker.unitFightRoutine();
        unitsMover.moveUnits();

        gameDrawer.drawVisibleObjects();
        gameDrawer.drawGunShell();
        gameDrawer.drawSmoke();

        unitTracker.unitTrackRoutine();
    }

    setInterval(updateGame, moveDelay);
}

gameRoutine();





