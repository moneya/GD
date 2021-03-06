/*
 *  GDevelop JS Platform
 *  2013 Florian Rival (Florian.Rival@gmail.com)
 */

/**
 * The PanelSpriteRuntimeObject displays a tiled texture.
 *
 * @class PanelSpriteRuntimeObject
 * @extends RuntimeObject
 * @namespace gdjs
 */
gdjs.PanelSpriteRuntimeObject = function(runtimeScene, objectData)
{
    gdjs.RuntimeObject.call(this, runtimeScene, objectData);

    if ( this._spritesContainer === undefined ) {
        var texture = runtimeScene.getGame().getImageManager().getPIXITexture(objectData.texture);
        this._spritesContainer = new PIXI.DisplayObjectContainer();
        this._centerSprite = new PIXI.Sprite(new PIXI.Texture(texture));
        this._borderSprites = [
            new PIXI.Sprite(new PIXI.Texture(texture)), //Right
            new PIXI.Sprite(texture), //Top-Right
            new PIXI.Sprite(new PIXI.Texture(texture)), //Top
            new PIXI.Sprite(texture), //Top-Left
            new PIXI.Sprite(new PIXI.Texture(texture)), //Left
            new PIXI.Sprite(texture), //Bottom-Left
            new PIXI.Sprite(new PIXI.Texture(texture)), //Bottom
            new PIXI.Sprite(texture)  //Bottom-Right
        ];
        this._borderMasks = [
            new PIXI.Graphics(), //Top-Right
            new PIXI.Graphics(), //Top-Left
            new PIXI.Graphics(), //Bottom-Left
            new PIXI.Graphics()  //Bottom-Right
        ];
    }

    this._centerSprite.anchor.x = this._centerSprite.anchor.y = 0.5;
    for (var i = 0;i < this._borderSprites.length;++i) {
        this._borderSprites[i].anchor.x = this._borderSprites[i].anchor.y = 0.5;

        if (i % 2 !== 0) {
            this._borderSprites[i].mask = this._borderMasks[(i - 1) / 2];
        }
    }

    this._rBorder = objectData.rightMargin;
    this._lBorder = objectData.leftMargin;
    this._tBorder = objectData.topMargin;
    this._bBorder = objectData.bottomMargin;
    this._runtimeScene = runtimeScene;
    this.setTexture(objectData.texture, runtimeScene);
    this.setWidth(objectData.width);
    this.setHeight(objectData.height);

    this._spritesContainer.removeChildren();
    this._spritesContainer.addChild(this._centerSprite);
    for (var i = 0;i < this._borderSprites.length;++i) {
        this._spritesContainer.addChild(this._borderSprites[i]);
    }
    for (var i = 0;i < this._borderMasks.length;++i) {
        this._spritesContainer.addChild(this._borderMasks[i]);
    }
    runtimeScene.getLayer("").addChildToPIXIContainer(this._spritesContainer, this.zOrder);
};

gdjs.PanelSpriteRuntimeObject.prototype = Object.create( gdjs.RuntimeObject.prototype );
gdjs.PanelSpriteRuntimeObject.thisIsARuntimeObjectConstructor = "PanelSpriteObject::PanelSprite";

gdjs.PanelSpriteRuntimeObject.prototype.onDeletedFromScene = function(runtimeScene) {
    runtimeScene.getLayer(this.layer).removePIXIContainerChild(this._spritesContainer);
};

/**
 * Initialize the extra parameters that could be set for an instance.
 */
gdjs.PanelSpriteRuntimeObject.prototype.extraInitializationFromInitialInstance = function(initialInstanceData) {
    if ( initialInstanceData.customSize ) {
        this.setWidth(initialInstanceData.width);
        this.setHeight(initialInstanceData.height);
    }
};

gdjs.PanelSpriteRuntimeObject.prototype._updateSpritePositions = function() {
    this._spritesContainer.position.x = this.x + this._width / 2;
    this._spritesContainer.position.y = this.y + this._height / 2;

    this._centerSprite.position.x = (this._width - this._lBorder - this._rBorder) / 2 + this._lBorder;
    this._centerSprite.position.y = (this._height - this._tBorder - this._bBorder) / 2 + this._tBorder;
    this._borderSprites[0].position.x = this._width - this._borderSprites[0].width / 2;
    this._borderSprites[0].position.y = (this._height - this._tBorder - this._bBorder) / 2 + this._tBorder;

    this._borderSprites[1].position.x = this._width - this._borderSprites[1].width / 2;
    this._borderSprites[1].position.y = this._borderSprites[1].height / 2;
    this._borderMasks[0].position = this._borderSprites[1].position;

    this._borderSprites[2].position.x = (this._width - this._lBorder - this._rBorder) / 2 + this._lBorder;
    this._borderSprites[2].position.y = this._borderSprites[2].height / 2;

    this._borderSprites[3].position.x = this._borderSprites[3].width / 2;
    this._borderSprites[3].position.y = this._borderSprites[3].height / 2;
    this._borderMasks[1].position = this._borderSprites[3].position;

    this._borderSprites[4].position.x = this._borderSprites[4].width / 2;
    this._borderSprites[4].position.y = (this._height - this._tBorder - this._bBorder) / 2 + this._tBorder;

    this._borderSprites[5].position.x = this._borderSprites[5].width / 2;
    this._borderSprites[5].position.y = this._height - this._borderSprites[5].height / 2;
    this._borderMasks[2].position = this._borderSprites[5].position;

    this._borderSprites[6].position.x = (this._width - this._lBorder - this._rBorder) / 2 + this._lBorder;
    this._borderSprites[6].position.y = this._height - this._borderSprites[6].height / 2;

    this._borderSprites[7].position.x = this._width - this._borderSprites[7].width / 2;
    this._borderSprites[7].position.y = this._height - this._borderSprites[7].height / 2;
    this._borderMasks[3].position = this._borderSprites[7].position;
};

gdjs.PanelSpriteRuntimeObject.prototype._updateSpritesAndTexturesSize = function() {

    this._centerSprite.width = Math.max(this._width - this._rBorder - this._lBorder, 0);
    this._centerSprite.height = Math.max(this._height - this._tBorder - this._bBorder, 0);

    //Top, Bottom, Right, Left borders:
    this._borderSprites[0].width = this._rBorder;
    this._borderSprites[0].height = Math.max(this._height - this._tBorder - this._bBorder, 0);

    this._borderSprites[2].height = this._tBorder;
    this._borderSprites[2].width = Math.max(this._width - this._rBorder - this._lBorder, 0);

    this._borderSprites[4].width = this._lBorder;
    this._borderSprites[4].height = Math.max(this._height - this._tBorder - this._bBorder, 0);

    this._borderSprites[6].height = this._bBorder;
    this._borderSprites[6].width = Math.max(this._width - this._rBorder - this._lBorder, 0);

    //Corners masks:
    for (var i = 0;i < this._borderMasks.length;++i) {
        this._borderMasks[i].clear();
        this._borderMasks[i].beginFill(0xFFFFFF,0);
    }

    this._borderMasks[0].drawRect(this._borderSprites[1].width / 2 - this._rBorder, -this._borderSprites[1].height / 2, this._rBorder, this._tBorder);
    this._borderMasks[1].drawRect(-this._borderSprites[3].width / 2, -this._borderSprites[3].height / 2, this._lBorder, this._tBorder);
    this._borderMasks[2].drawRect(-this._borderSprites[5].width / 2, this._borderSprites[5].height / 2 - this._bBorder, this._lBorder, this._bBorder);
    this._borderMasks[3].drawRect(this._borderSprites[7].width / 2 - this._rBorder, this._borderSprites[7].height / 2 - this._bBorder, this._rBorder, this._bBorder);

    for (var i = 0;i < this._borderMasks.length;++i) {
        this._borderMasks[i].endFill();
    }
};

gdjs.PanelSpriteRuntimeObject.prototype.setX = function(x) {
    gdjs.RuntimeObject.prototype.setX.call(this, x);
    this._updateSpritePositions();
};

gdjs.PanelSpriteRuntimeObject.prototype.setY = function(y) {
    gdjs.RuntimeObject.prototype.setY.call(this, y);
    this._updateSpritePositions();
};

gdjs.PanelSpriteRuntimeObject.prototype.setTexture = function(textureName, runtimeScene) {
    var texture = runtimeScene.getGame().getImageManager().getPIXITexture(textureName);

    function makeInsideTexture(rect) {
        if (rect.width < 0) rect.width = 0;
        if (rect.height < 0) rect.height = 0;
        if (rect.x < 0) rect.x = 0;
        if (rect.y < 0) rect.y = 0;
        if (rect.x > texture.width) rect.x = texture.width;
        if (rect.y > texture.height) rect.y = texture.height;
        if (rect.x + rect.width > texture.width) rect.width = texture.width - rect.x;
        if (rect.y + rect.height > texture.height) rect.height = texture.height - rect.y;

        return rect;
    }

    this._centerSprite.setTexture(new PIXI.Texture(texture,
        makeInsideTexture(new PIXI.Rectangle(this._lBorder, this._tBorder,
        texture.width - this._lBorder - this._rBorder,
        texture.height - this._tBorder - this._bBorder))));

    //Top, Bottom, Right, Left borders:
    this._borderSprites[0].setTexture(new PIXI.Texture(texture,
        makeInsideTexture(new PIXI.Rectangle(texture.width - this._rBorder, this._tBorder, this._rBorder,
        texture.height - this._tBorder - this._bBorder))));
    this._borderSprites[2].setTexture(new PIXI.Texture(texture,
        makeInsideTexture(new PIXI.Rectangle(this._lBorder, 0, texture.width - this._lBorder - this._rBorder, this._tBorder))));
    this._borderSprites[4].setTexture(new PIXI.Texture(texture,
        makeInsideTexture(new PIXI.Rectangle(0, this._tBorder, this._lBorder, texture.height - this._tBorder - this._bBorder))));
    this._borderSprites[6].setTexture(new PIXI.Texture(texture,
        makeInsideTexture(new PIXI.Rectangle(this._lBorder, texture.height - this._bBorder,
        texture.width - this._lBorder - this._rBorder, this._bBorder))));

    //Corners:
    this._borderSprites[1].setTexture(texture);
    this._borderSprites[3].setTexture(texture);
    this._borderSprites[5].setTexture(texture);
    this._borderSprites[7].setTexture(texture);

    this._updateSpritesAndTexturesSize();
    this._updateSpritePositions();
};

gdjs.PanelSpriteRuntimeObject.prototype.setAngle = function(angle) {
    gdjs.RuntimeObject.prototype.setAngle.call(this, angle);
    this._spritesContainer.rotation = gdjs.toRad(angle);
};

gdjs.PanelSpriteRuntimeObject.prototype.setLayer = function(name) {
    //We need to move the object from the pixi container of the layer
    this._runtimeScene.getLayer(this.layer).removePIXIContainerChild(this._spritesContainer);
    this.layer = name;
    this._runtimeScene.getLayer(this.layer).addChildToPIXIContainer(this._spritesContainer, this.zOrder);
};

gdjs.PanelSpriteRuntimeObject.prototype.getWidth = function() {
    return this._width;
};

gdjs.PanelSpriteRuntimeObject.prototype.getHeight = function() {
    return this._height;
};

gdjs.PanelSpriteRuntimeObject.prototype.setWidth = function(width) {
    this._width = width;
    this._spritesContainer.pivot.x = width / 2;
    this._updateSpritesAndTexturesSize();
    this._updateSpritePositions();
};

gdjs.PanelSpriteRuntimeObject.prototype.setHeight = function(height) {
    this._height = height;
    this._spritesContainer.pivot.y = height / 2;
    this._updateSpritesAndTexturesSize();
    this._updateSpritePositions();
};

gdjs.PanelSpriteRuntimeObject.prototype.setZOrder = function(z) {
    if ( z !== this.zOrder ) {
        this._runtimeScene.getLayer(this.layer).changePIXIContainerChildZOrder(this._spritesContainer, z);
        this.zOrder = z;
   }
};
