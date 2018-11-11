function GameState() {
    if (this.constructor === GameState)
        throw Error("Can't instantiate abstract class!");
}

GameState.prototype = {
    constructor : GameState,

    _isButtonNotClicked : function (currentGameMenuClickedButton, buttonName) {
        if (buttonName !== buttonName && currentGameMenuClickedButton !== null)
            return true;

        return false;
    },

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
            throw TypeError("gameProperty isn't GameProperty");

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
        gameProperty.currentGameMenuClickedButton = null;

        if (!(gameProperty instanceof GameProperty))
            throw TypeError("This is not GameProperty");

        if (gameProperty.leftButtonSelectedCell === undefined) {
            gameProperty.gameState = new InitialState();
            return;
        }

        gameProperty.selectedUnitIndex = gameProperty.unitFinder.findByMapCellObjIndex(gameProperty.leftButtonSelectedCell);

        if (gameProperty.selectedUnitIndex !== undefined){
            gameProperty.currentHighlightedUnitIndex = gameProperty.selectedUnitIndex;
            gameProperty.gameState = new UserSelectUnitState();
            gameProperty.leftButtonSelectedCell = undefined;
            return;
        }

        gameProperty.currentHighlightedUnitIndex = undefined;
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

    _isStartMove : function (currentGameMenuClickedButton) {
        if (this._isButtonNotClicked(currentGameMenuClickedButton,'move'))
            return false;

        return true;
    },

    _isStartAttack : function (currentGameMenuClickedButton, targetUnitIndex) {
        if ((targetUnitIndex !== undefined)
            &&
            (currentGameMenuClickedButton === null))
            return true;

        if (currentGameMenuClickedButton !== 'attack')
            return false;

        if ((targetUnitIndex === undefined))
            return false;

        return true;
    },

    _isTurn : function (currentGameMenuClickedButton) {
        if (this._isButtonNotClicked(currentGameMenuClickedButton,'turn'))
            return false;

        return true;
    },

    _startAttackEnemyObject : function (unit, targetUnitIndex, gameProperty) {
        unit.targetIndex = targetUnitIndex;

        gameProperty.leftButtonSelectedCell = undefined;
        gameProperty.gameState = new InitialState();
        return;
    },

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

        unit = gameProperty.mapObjects[gameProperty.selectedUnitIndex];

        targetUnitIndex = gameProperty.unitFinder.findByMapCellObjIndex(gameProperty.leftButtonSelectedCell);

        if (unit.team !== gameProperty.gamerTeam){
            gameProperty.leftButtonSelectedCell = undefined;
            gameProperty.gameState = new InitialState();
            return;
        }

        if (this._isStartAttack(gameProperty.currentGameMenuClickedButton, targetUnitIndex)) {
            this._startAttackEnemyObject(unit, targetUnitIndex, gameProperty);
            return;
        }

        unit.targetIndex = undefined;

        if (this._isStartMove(gameProperty.currentGameMenuClickedButton)) {
            unit.destinationMapCell = gameProperty.leftButtonSelectedCell;
        }

        gameProperty.leftButtonSelectedCell = undefined;
        gameProperty.gameState = new InitialState();
        gameProperty.currentGameMenuClickedButton = null;
        return;
    }
})