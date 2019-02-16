import { Injectable } from "@angular/core";
import { Player, Direction } from "../../models/player";
import { GameEngineService } from "../game-engine/game-engine.service";
import { ImageLocation } from "../../models/game-object";
import { Point } from "src/app/models/point";

@Injectable({
    providedIn: "root"
})
export class PlayerManagerService {

    constructor(private _gameEngineService: GameEngineService) {}

    drawPlayer(ctx: CanvasRenderingContext2D, player: Player): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!ctx) {
                reject("Context cannot be null");
                return;
            }

            this._gameEngineService
                .getImage(ImageLocation.player)
                .then(playerSpritesheet => {
                    // First, we get the position of the action in our spritesheet.
                    player.animate();
                    const spritePosition = {
                        col: player.animationFrame % 3,
                        row: -1
                    };

                    // The player sprite contains 4 rows, each one describe an action.
                    if (player.currentActions.move_up) {
                        spritePosition.row = 0;
                    } else if (player.currentActions.move_right) {
                        spritePosition.row = 1;
                    } else if (player.currentActions.move_down) {
                        spritePosition.row = 2;
                    } else if (player.currentActions.move_left) {
                        spritePosition.row = 3;
                    }
                    // If the player is not moving, set his sprite to the direction he's facing.
                    else if (player.previousDirection === Direction.Up) {
                        spritePosition.row = 0;
                    } else if (player.previousDirection === Direction.Right) {
                            spritePosition.row = 1;
                    } else if (player.previousDirection === Direction.Down) {
                        spritePosition.row = 2;
                    } else {
                        // The player is facing left.
                        spritePosition.row = 3;
                    }

                    // Drawing the player's sprite
                    this._gameEngineService.drawSprite(
                        ctx,
                        playerSpritesheet,
                        player.coordinates,
                        32,
                        32,
                        spritePosition.col,
                        spritePosition.row,
                        28,
                        28,
                        2
                    );

                    // And his name.
                    const playerNamePosition: Point = {
                        _x: player.coordinates._x + player.width / 2,
                        _y: player.coordinates._y,
                    };

                    this._gameEngineService.drawText(
                        player.playerId,
                        ctx,
                        "white",
                        playerNamePosition
                    );

                    resolve();
                })
                .catch((error) => {
                    console.log(`Could not load sprite for player ${player.playerId}.`, error);
                    reject(error);
                });
        });
    }
}
