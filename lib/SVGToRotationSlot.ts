import { decompose } from "./decompose";
import { SVGTransformSlot } from "./SVGTransformSlot";
/**
 *  A special slot that will tranform an element to a specific rotation.
 */
export class SVGToRotationSlot extends SVGTransformSlot {

    /**
     *  The desired rotation.
     */
    private _toRotation:number = 0;

    /**
     *  Set target rotation.
     */
    public setTargetRotation(degrees:number) : void { 

        // set target rotation
        this._toRotation = degrees;
    }

    /**
     *  Start the slot.
     */
    start(miliseconds:number) {

        // get the current base values of transforms
        const transforms = (this.elem as SVGGraphicsElement).transform.baseVal;

        // do we have matches? then construct inits for the matrix
        if (transforms.numberOfItems > 0) {

            // get the current rotation
            const current = decompose(transforms.consolidate().matrix).rotation;

            // set the target rotation
            this.setRotation((this._toRotation - current) % 360);
        }

        // ok, no initial rotation so we can just set the rotation from the target
        else this.setRotation(this._toRotation);

        // we can start the slot
        return super.start(miliseconds);
    }

};
