/*
 * GDevelop JS Platform
 * Copyright 2013-2015 Florian Rival (Florian.Rival@gmail.com). All rights reserved.
 * This project is released under the MIT License.
 */

/**
 * Store input made on a canvas: mouse position, key pressed
 * and touches states.
 *
 * See **bindStandardEvents** method for connecting the input
 * manager to a canvas.
 *
 * @constructor
 * @namespace gdjs
 * @class InputManager
 */
gdjs.InputManager = function()
{
    this._pressedKeys = new Hashtable();
    this._lastPressedKey = 0;
    this._pressedMouseButtons = new Array(5);
    this._mouseX = 0;
    this._mouseY = 0;
    this._mouseWheelDelta = 0;
};

/**
 * Should be called whenever a key is pressed
 * @method onKeyPressed
 * @param keyCode {Number} The key code associated to the key press.
 */
gdjs.InputManager.prototype.onKeyPressed = function(keyCode) {
	this._pressedKeys.put(keyCode, true);
    this._lastPressedKey = keyCode;
};

/**
 * Should be called whenever a key is released
 * @method onKeyReleased
 * @param keyCode {Number} The key code associated to the key release.
 */
gdjs.InputManager.prototype.onKeyReleased = function(keyCode) {
	this._pressedKeys.put(keyCode, false);
};

/**
 * Return the code of the last key that was pressed.
 * @return {Number} The code of the last key pressed.
 * @method getLastPressedKey
 */
gdjs.InputManager.prototype.getLastPressedKey = function() {
    return this._lastPressedKey;
};

/**
 * Return true if the key corresponding to keyCode is pressed.
 * @method isKeyPressed
 * @param keyCode {Number} The key code to be tested.
 */
gdjs.InputManager.prototype.isKeyPressed = function(keyCode) {
	return this._pressedKeys.containsKey(keyCode) && this._pressedKeys.get(keyCode);
};

/**
 * Return true if any key is pressed
 * @method anyKeyPressed
 */
gdjs.InputManager.prototype.anyKeyPressed = function() {
	var allKeys = this._pressedKeys.entries();

	for(var i = 0, len = allKeys.length;i < len;++i) {
		if (allKeys[i][1]) {
			return true;
		}
	}

	return false;
};

/**
 * Should be called when the mouse is moved.<br>
 * Please note that the coordinates must be expressed relative to the view position.
 *
 * @method onMouseMove
 * @param x {Number} The mouse new X position
 * @param y {Number} The mouse new Y position
 */
gdjs.InputManager.prototype.onMouseMove = function(x,y) {
	this._mouseX = x;
	this._mouseY = y;
};

/**
 * Get the mouse X position
 *
 * @method getMouseX
 * @return the mouse X position, relative to the game view.
 */
gdjs.InputManager.prototype.getMouseX = function() {
	return this._mouseX;
};

/**
 * Get the mouse Y position
 *
 * @method getMouseY
 * @return the mouse Y position, relative to the game view.
 */
gdjs.InputManager.prototype.getMouseY = function() {
	return this._mouseY;
};


/**
 * Should be called whenever a mouse button is pressed
 * @method onMouseButtonPressed
 * @param buttonCode {Number} The mouse button code associated to the event.<br>0: Left button<br>1: Right button
 */
gdjs.InputManager.prototype.onMouseButtonPressed = function(buttonCode) {
	this._pressedMouseButtons[buttonCode] = true;
};

/**
 * Should be called whenever a mouse button is released
 * @method onMouseButtonReleased
 * @param buttonCode {Number} The mouse button code associated to the event. ( See onMouseButtonPressed )
 */
gdjs.InputManager.prototype.onMouseButtonReleased = function(buttonCode) {
	this._pressedMouseButtons[buttonCode] = false;
};

/**
 * Return true if the mouse button corresponding to buttonCode is pressed.
 * @method isMouseButtonPressed
 * @param buttonCode {Number} The mouse button code.<br>0: Left button<br>1: Right button
 */
gdjs.InputManager.prototype.isMouseButtonPressed = function(buttonCode) {
	return this._pressedMouseButtons[buttonCode] !== undefined && this._pressedMouseButtons[buttonCode];
};

/**
 * Should be called whenever the mouse wheel is used
 * @method onMouseWheel
 * @param wheelDelta {Number} The mouse wheel delta
 */
gdjs.InputManager.prototype.onMouseWheel = function(wheelDelta) {
	this._mouseWheelDelta = wheelDelta;
};

/**
 * Return the mouse wheel delta
 * @method getMouseWheelDelta
 */
gdjs.InputManager.prototype.getMouseWheelDelta = function() {
	return this._mouseWheelDelta;
};


/**
 * Add the standard events handler.
 * @method bindStandardEvents
 */
gdjs.InputManager.prototype.bindStandardEvents = function(window, document, game, renderer, canvasArea) {

    var manager = this;
    document.onkeydown = function(e) {
        manager.onKeyPressed(e.keyCode);
    };
    document.onkeyup = function(e) {
        manager.onKeyReleased(e.keyCode);
    };
    renderer.view.onmousemove = function(e){
        var pos = [0,0];
        if (e.pageX) {
            pos[0] = e.pageX-canvasArea.offsetLeft;
            pos[1] = e.pageY-canvasArea.offsetTop;
        } else {
            pos[0] = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft-canvasArea.offsetLeft;
            pos[1] = e.clientY + document.body.scrollTop + document.documentElement.scrollTop-canvasArea.offsetTop;
        }

        //Handle the fact that the game is stretched to fill the canvas.
        pos[0] *= game.getDefaultWidth()/renderer.view.width;
        pos[1] *= game.getDefaultHeight()/renderer.view.height;

        manager.onMouseMove(pos[0], pos[1]);
    };
    renderer.view.onmousedown = function(e){
        manager.onMouseButtonPressed(e.button === 2 ? 1 : 0);
        if (window.focus !== undefined) window.focus();
        return false;
    };
    renderer.view.onmouseup = function(e){
        manager.onMouseButtonReleased(e.button === 2 ? 1 : 0);
        return false;
    };
    renderer.view.onmouseout = function(e){
        manager.onMouseButtonReleased(0);
        manager.onMouseButtonReleased(1);
        manager.onMouseWheel(0);
        return false;
    };
    window.addEventListener('click', function(e) {
        if (window.focus !== undefined) window.focus();
        e.preventDefault();
        return false;
    }, false);
    renderer.view.oncontextmenu = function(event) {
        event.preventDefault();
        event.stopPropagation();
        return false;
    };
    renderer.view.onmousewheel = function (event){
        manager.onMouseWheel(event.wheelDelta);
    };
    //Simulate mouse events when receiving touch events
    window.addEventListener('touchmove', function(e){
        e.preventDefault();
        if ( e.touches && e.touches.length > 0 ) {
            var pos = [0,0];
            if (e.touches[0].pageX) {
                pos[0] = e.touches[0].pageX-canvasArea.offsetLeft;
                pos[1] = e.touches[0].pageY-canvasArea.offsetTop;
            }
            else {
                pos[0] = e.touches[0].clientX + document.body.scrollLeft + document.documentElement.scrollLeft-canvasArea.offsetLeft;
                pos[1] = e.touches[0].clientY + document.body.scrollTop + document.documentElement.scrollTop-canvasArea.offsetTop;
            }

            //Handle the fact that the game is stretched to fill the canvas.
            pos[0] *= game.getDefaultWidth()/renderer.view.width;
            pos[1] *= game.getDefaultHeight()/renderer.view.height;

            manager.onMouseMove(pos[0], pos[1]);
        }
    });
    window.addEventListener('touchstart', function(e){
        e.preventDefault();
        if ( e.touches && e.touches.length > 0 ) {
            var pos = [0,0];
            if (e.touches[0].pageX) {
                if ( isNaN(canvasArea.offsetLeft) ) {
                    canvasArea.offsetLeft = 0;
                    canvasArea.offsetTop = 0;
                }

                pos[0] = e.touches[0].pageX-canvasArea.offsetLeft;
                pos[1] = e.touches[0].pageY-canvasArea.offsetTop;
            }
            else {
                if ( isNaN(document.body.scrollLeft) ) {
                    document.body.scrollLeft = 0;
                    document.body.scrollTop = 0;
                }
                if ( document.documentElement === undefined || document.documentElement === null ) {
                    document.documentElement = {};
                }
                if ( isNaN(document.documentElement.scrollLeft) ) {
                    document.documentElement.scrollLeft = 0;
                    document.documentElement.scrollTop = 0;
                }
                if ( isNaN(canvasArea.offsetLeft) ) {
                    canvasArea.offsetLeft = 0;
                    canvasArea.offsetTop = 0;
                }
                pos[0] = e.touches[0].clientX + document.body.scrollLeft + document.documentElement.scrollLeft-canvasArea.offsetLeft;
                pos[1] = e.touches[0].clientY + document.body.scrollTop + document.documentElement.scrollTop-canvasArea.offsetTop;
            }

            //Handle the fact that the game is stretched to fill the canvas.
            pos[0] *= game.getDefaultWidth()/renderer.view.width;
            pos[1] *= game.getDefaultHeight()/renderer.view.height;

            manager.onMouseMove(pos[0], pos[1]);
        }
        manager.onMouseButtonPressed(0);
        return false;
    });
    window.addEventListener('touchend', function(e){
        e.preventDefault();
        if ( e.touches && e.touches.length > 0 ) {
            var pos = [0,0];
            if (e.touches[0].pageX) {
                pos[0] = e.touches[0].pageX-canvasArea.offsetLeft;
                pos[1] = e.touches[0].pageY-canvasArea.offsetTop;
            }
            else {
                pos[0] = e.touches[0].clientX + document.body.scrollLeft + document.documentElement.scrollLeft-canvasArea.offsetLeft;
                pos[1] = e.touches[0].clientY + document.body.scrollTop + document.documentElement.scrollTop-canvasArea.offsetTop;
            }

            //Handle the fact that the game is stretched to fill the canvas.
            pos[0] *= game.getDefaultWidth()/renderer.view.width;
            pos[1] *= game.getDefaultHeight()/renderer.view.height;

            manager.onMouseMove(pos[0], pos[1]);
        }
        manager.onMouseButtonReleased(0);
        return false;
    });
};