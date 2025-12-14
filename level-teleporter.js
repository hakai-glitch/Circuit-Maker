// level-teleporter.js
// This script sits on each TEST / NEXT button.
// When the button is clicked, it asks the level logic
// if the circuit is correct. Only then it teleports
// the player to the next table.

import {Component, Property} from '@wonderlandengine/api';

export class LevelTeleporter extends Component {
    static TypeName = 'level-teleporter';

    static Properties = {
        // Player rig to move (root object of the XR rig)
        player: Property.object(),
        // Empty object that marks the spawn point of the next level
        nextLevelTarget: Property.object(),
        // Object that holds the logic component for this level
        levelLogic: Property.object()
    };

    start() {
        // Make sure this button has a collision shape to be clickable
        const collision =
            this.object.getComponent('collision') ||
            this.object.addComponent('collision');

        // If the collision shape is not set in the editor, default to box
        if (collision.shape === 'none')
            collision.shape = 'box';

        // Make sure it has a cursor-target so ray / mouse clicks work
        const cursorTarget =
            this.object.getComponent('cursor-target') ||
            this.object.addComponent('cursor-target');

        // When the button is clicked, run checkAndTeleport()
        cursorTarget.onClick.add(this.checkAndTeleport.bind(this));

        console.log('Level Teleporter initialized on:', this.object.name);
    }

    checkAndTeleport() {
        console.log('Button Pressed! Checking circuit logic...');

        let isCircuitBuilt = false;

        // Ask the level logic object if the circuit is correct
        if (this.levelLogic) {
            console.log('Teleporter: levelLogic object =', this.levelLogic.name);

            // Try to get ANY component on that object which has isCircuitBuilt()
            // This allows us to reuse this teleporter for all levels
            let logicComponent = null;

            // Try each level logic type by name
            logicComponent =
                this.levelLogic.getComponent('level1-logic') ||
                this.levelLogic.getComponent('level2-logic') ||
                this.levelLogic.getComponent('level3-logic') ||
                this.levelLogic.getComponent('level4-logic') ||
                this.levelLogic.getComponent('level5-logic');

            if (logicComponent && logicComponent.isCircuitBuilt) {
                isCircuitBuilt = logicComponent.isCircuitBuilt();
            } else {
                console.warn(
                    'LevelTeleporter: levelLogic object has no levelX-logic component'
                );
            }
        } else {
            console.warn('LevelTeleporter: levelLogic not assigned');
        }

        console.log('Teleporter: isCircuitBuilt =', isCircuitBuilt);

        if (isCircuitBuilt) {
            console.log('Circuit is Valid! Teleporting...');

            if (this.player && this.nextLevelTarget) {
                // Move player to the next level marker
                this.player.setPositionWorld(
                    this.nextLevelTarget.getPositionWorld()
                );
                this.player.setRotationWorld(
                    this.nextLevelTarget.getRotationWorld()
                );
                console.log('Teleport Successful.');
            } else {
                console.error(
                    "Teleport Failed: 'Player' or 'NextLevelTarget' is missing in the Editor."
                );
            }
        } else {
            console.warn('Circuit not complete yet. Cannot teleport.');
        }
    }
}
