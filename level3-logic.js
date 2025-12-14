// level2-logic.js
// Level 2: Player must place 1 battery and 2 LEDs in correct spots.

import {Component, Property} from '@wonderlandengine/api';

export class Level2Logic extends Component {
    static TypeName = 'level2-logic';

    static Properties = {
        battery: Property.object(),
        led1:    Property.object(),
        led2:    Property.object(),
        batterySlot: Property.object(),
        led1Slot:    Property.object(),
        led2Slot:    Property.object(),
        positionTolerance: Property.float(0.1)
    };

    isCircuitBuilt() {
        console.log('Level2Logic.isCircuitBuilt() called');

        if (!this.battery || !this.led1 || !this.led2 ||
            !this.batterySlot || !this.led1Slot || !this.led2Slot) {
            console.warn('Level2Logic: Missing references');
            return false;
        }

        const batOk  = this._isNear(
            this.battery.getPositionWorld(),
            this.batterySlot.getPositionWorld(),
            this.positionTolerance
        );
        const led1Ok = this._isNear(
            this.led1.getPositionWorld(),
            this.led1Slot.getPositionWorld(),
            this.positionTolerance
        );
        const led2Ok = this._isNear(
            this.led2.getPositionWorld(),
            this.led2Slot.getPositionWorld(),
            this.positionTolerance
        );

        const ok = batOk && led1Ok && led2Ok;

        // Optional: feedback on both LEDs
        this._setLedColor(this.led1, ok);
        this._setLedColor(this.led2, ok);

        console.log('Level2Logic result:', ok);
        return ok;
    }

    _setLedColor(ledObject, ok) {
        const meshMat =
            ledObject.getComponent('mesh-material') ||
            ledObject.findComponent('mesh-material');
        if (!meshMat) return;
        if (ok) meshMat.material.diffuseColor.set([0, 1, 0, 1]);
        else    meshMat.material.diffuseColor.set([1, 0, 0, 1]);
    }

    _isNear(a, b, tolerance) {
        const dx = a[0] - b[0];
        const dy = a[1] - b[1];
        const dz = a[2] - b[2];
        return Math.hypot(dx, dy, dz) <= tolerance;
    }
}
