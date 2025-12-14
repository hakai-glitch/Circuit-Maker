// level5-logic.js
// Level 5: Final recap — place LED, battery, and resistor correctly.

import {Component, Property} from '@wonderlandengine/api';

export class Level5Logic extends Component {
    static TypeName = 'level5-logic';

    static Properties = {
        battery:  Property.object(),
        led:      Property.object(),
        resistor: Property.object(),

        batterySlot:  Property.object(),
        ledSlot:      Property.object(),
        resistorSlot: Property.object(),

        positionTolerance: Property.float(0.1)
    };

    isCircuitBuilt() {
        console.log('Level5Logic.isCircuitBuilt() called');

        if (!this.battery || !this.led || !this.resistor ||
            !this.batterySlot || !this.ledSlot || !this.resistorSlot) {
            console.warn('Level5Logic: Missing references');
            return false;
        }

        const batOk = this._isNear(
            this.battery.getPositionWorld(),
            this.batterySlot.getPositionWorld(),
            this.positionTolerance
        );
        const ledOk = this._isNear(
            this.led.getPositionWorld(),
            this.ledSlot.getPositionWorld(),
            this.positionTolerance
        );
        const resOk = this._isNear(
            this.resistor.getPositionWorld(),
            this.resistorSlot.getPositionWorld(),
            this.positionTolerance
        );

        const ok = batOk && ledOk && resOk;

        const meshMat =
            this.led.getComponent('mesh-material') ||
            this.led.findComponent('mesh-material');
        if (meshMat) {
            if (ok) meshMat.material.diffuseColor.set([0, 1, 0, 1]);
            else    meshMat.material.diffuseColor.set([1, 0, 0, 1]);
        }

        console.log('Level5Logic result:', ok);
        return ok;
    }

    _isNear(a, b, tolerance) {
        const dx = a[0] - b[0];
        const dy = a[1] - b[1];
        const dz = a[2] - b[2];
        return Math.hypot(dx, dy, dz) <= tolerance;
    }
}
