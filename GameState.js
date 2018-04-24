function GameState() {
    if (this.constructor === GameState)
        throw Error("Can't instantiate abstract class!");
}

GameState.prototype = {
    constructor : GameState,

    handleUserAction : function (gameProperty) {
        throw Error("Abstract method!");
    }
}

function InitialState() {
}

InitialState.prototype = inherit(GameState.prototype);
extend(InitialState.prototype, {
    constructor : InitialState,
    handleUserAction : function (gameProperty) {
        if (!(gameProperty instanceof GameProperty))
            throw TypeError("gameProperty is not GameProperty");

        if (gameProperty.leftButtonSelectedCell === undefined)
            return;

        gameProperty.gameState = new UserSelectCellState();
        return;
    }
})

function UserSelectCellState() {
}

UserSelectCellState.prototype = inherit(GameState.prototype);
extend(UserSelectCellState.prototype, {
    constructor : UserSelectCellState,
    handleUserAction : function (gameProperty) {
        if (!(gameProperty instanceof GameProperty))
            throw TypeError("This is not GameProperty");

        if (gameProperty.leftButtonSelectedCell === undefined) {
            gameProperty.gameState = new InitialState();
            return;
        }

        gameProperty.selectedUnitIndex = gameProperty.unitFinder.findByCoordinates(gameProperty.leftButtonSelectedCell);

        if (gameProperty.selectedUnitIndex !== undefined){
            gameProperty.gameState = new UserSelectUnitState();
            gameProperty.leftButtonSelectedCell = undefined;
            return;
        }

        gameProperty.gameState = new InitialState();
        gameProperty.leftButtonSelectedCell = undefined;
        return;
    }
})


function UserSelectUnitState( ) {
}

UserSelectUnitState.prototype = inherit(GameState.prototype);
extend(UserSelectUnitState.prototype, {
    constructor : UserSelectUnitState,
    handleUserAction : function (gameProperty) {
        var unit,
            targetUnitIndex;

        if (!(gameProperty instanceof GameProperty))
            throw TypeError("This is not GameProperty");

        if (gameProperty.selectedUnitIndex === undefined){
            gameProperty.gameState = new InitialState();
            return;
        }

        if (gameProperty.leftButtonSelectedCell === undefined){
            return;
        }

        unit = gameProperty.units[gameProperty.selectedUnitIndex];

        targetUnitIndex = gameProperty.unitFinder.findByCoordinates(gameProperty.leftButtonSelectedCell);

        if (targetUnitIndex !== undefined) {

            unit.targetUnitIndex = targetUnitIndex;

            gameProperty.leftButtonSelectedCell = undefined;
            gameProperty.gameState = new InitialState();
            return;
        }

        unit.targetUnitIndex = undefined;

        unit.destinationMapCell = gameProperty.leftButtonSelectedCell;
        gameProperty.leftButtonSelectedCell = undefined;
        gameProperty.gameState = new InitialState();
        return;
    }
})