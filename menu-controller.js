import {Component, Property} from '@wonderlandengine/api'; // Telling wonderland engine that I want to use Component and Property the wonderland api

export class MenuController extends Component { // class definition, extends means were creating our own custom component
    static TypeName = 'menu-controller';
    
    static Properties = { //  Variaables declerations that showup in the sidebar where I can create a slot or a field in the Wonderland Editor interface
        player: Property.object(),      // VR Rig root
        level1Target: Property.object(), // Level1_Marker
    };

    start() { // Start is called by the Game Engine and runs once per instance of the object, in this case only once
        // ADD cursor-target for VR clicking
        const cursorTarget = this.object.getComponent('cursor-target') || this.object.addComponent('cursor-target');
        // ADD collision for raycast hitting
        const collision = this.object.getComponent('collision') || this.object.addComponent('collision');
        collision.shape = 'box'; // I set the collision shape to a box, so that there is a physical shape to hit
        
        cursorTarget.onClick.add(this.enterLevel.bind(this)); // Triggers enterLevel Callback Function
        console.log("Button ready:", this.object.name);

        // These two lines check if the object has a cursor-target or collision component. If not, I add them via code.
    }

    enterLevel() { // This function works to check if player and level1Target are assigned to prevent the game from crashing if I forgot to link them in the editor
        console.log("=== BUTTON CLICKED ===");
        
        if (this.player && this.level1Target) {
            console.log("Teleporting...");
            this.player.setPositionWorld(this.level1Target.getPositionWorld()); // Get the World (Global) Position of the target marker + Set the Player's World Position to match it.
            this.player.setRotationWorld(this.level1Target.getRotationWorld()); // Also match the rotation so the player faces the correct way
            // We use World-Space coordinates specifically to make sure of accurate positioning regardless of the scene graph hierarchy (Global X, Y, Z)
            console.log("TELEPORT DONE!");
        } else {
            console.error("Missing player or target!"); // Helps debug if the teleport fails
        }
    }
}
