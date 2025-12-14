// level1-logic.js
// Level 1: Player must connect battery + LED in the correct locations.
// Component: The base class for all scripts attached to objects.
// Property: Used to define variables editable in the Wonderland Editor inspector.
import {Component, Property} from '@wonderlandengine/api';

/**
 * Checks if specific game objects (Battery and LED) are placed close enough to their target destination markers (Slots).
 */
export class Level1Logic extends Component {
    // The name used to register this component in the engine.
    static TypeName = 'level1-logic';

    // Properties exposed to the Wonderland Editor.
    // Designers can drag-and-drop objects into these slots in the browser GUI.
    static Properties = {
        // Reference to the movable Battery object (the object the player grabs).
        battery:   Property.object(), 
        
        // Reference to the movable LED object.
        led:       Property.object(), 
        
        // Reference to the static marker object indicating where the Battery should go.
        batterySlot: Property.object(), 
        
        // Reference to the static marker object indicating where the LED should go.
        ledSlot:     Property.object(), 
        
        // The maximum distance (in meters) allowed between an object and its slot 
        // for it to be considered "connected".
        positionTolerance: Property.float(0.1) 
    };

    /**
     * Checks if the circuit is correctly assembled.
     * This method is likely called by a GameManager, a Loop, or an Event Trigger
     * when the player releases an object.
     * 
     * @returns {boolean} True if both components are correctly placed, False otherwise.
     */
    isCircuitBuilt() {
        console.log('Level1Logic.isCircuitBuilt() called');

        // Safety Check: Ensure all required objects are assigned in the Editor.
        // If any are missing, log a warning and return false to prevent errors.
        if (!this.battery || !this.led || !this.batterySlot || !this.ledSlot) {
            console.warn('Level1Logic: Missing references (battery / led / slots)');
            return false;
        }

        // Get the global (World) positions of the objects.
        // We use World positions because the objects might be children of different parents,
        // so their local coordinates (getPosition) would not be comparable.
        const batPos = this.battery.getPositionWorld();
        const batSlotPos = this.batterySlot.getPositionWorld();
        const ledPos = this.led.getPositionWorld();
        const ledSlotPos = this.ledSlot.getPositionWorld();

        // Calculate if the Battery is within the tolerance distance of its slot.
        const batteryOk = this._isNear(batPos, batSlotPos, this.positionTolerance);
        
        // Calculate if the LED is within the tolerance distance of its slot.
        const ledOk     = this._isNear(ledPos, ledSlotPos, this.positionTolerance);

        // The circuit is only complete if BOTH parts are in the correct place.
        const ok = batteryOk && ledOk;

        // --- Visual Feedback Logic ---
        // Attempt to find the visual material component of the LED object
        // so we can change its color to indicate success or failure.
        
        // 1. Try to get 'mesh-material' directly on the LED object.
        // 2. If not found, look for it on children objects (findComponent).
        const meshMat =
            this.led.getComponent('mesh-material') ||
            this.led.findComponent('mesh-material');
            
        if (meshMat) {
            if (ok) {
                // Set color to Green (RGBA: 0, 1, 0, 1) to indicate Success.
                meshMat.material.diffuseColor.set([0, 1, 0, 1]); 
            } else {
                // Set color to Red (RGBA: 1, 0, 0, 1) to indicate Incomplete/Wrong.
                meshMat.material.diffuseColor.set([1, 0, 0, 1]); 
            }
        }

        console.log('Level1Logic result:', ok);
        return ok;
    }

    /**
     * Helper method to calculate 3D distance between two points.
     * 
     * @param {Float32Array} a - The [x, y, z] coordinates of the first point.
     * @param {Float32Array} b - The [x, y, z] coordinates of the second point.
     * @param {number} tolerance - The maximum allowed distance.
     * @returns {boolean} True if distance is less than or equal to tolerance.
     */
    _isNear(a, b, tolerance) {
        // Calculate the difference in each axis
        const dx = a[0] - b[0];
        const dy = a[1] - b[1];
        const dz = a[2] - b[2];
        
        // Math.hypot calculates the Square Root of the sum of squares (Pythagorean theorem).
        // Essentially: sqrt(dx*dx + dy*dy + dz*dz)
        return Math.hypot(dx, dy, dz) <= tolerance;
    }
}