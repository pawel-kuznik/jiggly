import { Slot } from "./Slot";
/**
 *  This is a slot class representing an SVG transformation slot.
 */
export class SVGTransformSlot extends Slot {

    /**
     *  The SVG element to rotate.
     */
    private _elem:SVGGraphicsElement ;

    /**
     *  The rotate by specific number of degrees.
     */
    private _rotation:number = 0;

    /**
     *  A potential initial SVG transform.
     */
    private _init:SVGTransform|null = null;

    /**
     *  The constructor.
     *  @param SVGElement   The element on which to perform the transform
     *  @param persist      Should the transform persist the transform for further tranformations?
     */
    public constructor(elem:SVGElement, persist:boolean = true) {

        // call the parent constructor
        super();

        // assign the element
        this._elem = elem as SVGGraphicsElement ;
    }

    /**
     *  Get the element that is transformed in this slot.
     */
    get elem() : SVGElement { return this._elem; };

    /**
     *  Rotate the element by certain number of degrees.
     *  @param degrees 
     */
    public setRotation(degrees:number) {

        // set the degrees
        this._rotation = degrees;
    }

    /**
     *  Start the animation.
     */
    public start(miliseconds:number) {

        // make the start
        super.start(miliseconds);

        // get the current base values of transforms
        const transforms = this._elem.transform.baseVal;

        // do we have matches? then construct inits for the matrix
        if (transforms.numberOfItems > 0) this._init = transforms.consolidate();
    }

    /**
     *  Tick the animation.
     */
    public tick(miliseconds:number) : boolean {

        // check with parent if we should tick
        if (!super.tick(miliseconds)) return false;

        // get the current value
        const value = this.value(miliseconds);

        // get the base values of transforms
        const transforms = this._elem.transform.baseVal;

        // get the owner SVG element so we can create transforms
        const owner = this._elem.ownerSVGElement;

        // do nothing if there is no root
        if (!owner) return true;

        // get current bounding box
        const bb = this._elem.getBBox();

        // should we initialisze transforms?
        if (this._init) transforms.initialize(this._init);
        else transforms.clear();

        // should we rotate?
        if (this._rotation) {

            // create a rotate transform
            const rotate = owner.createSVGTransform();
            rotate.setRotate(this._rotation * value, bb.x + bb.width / 2, bb.y + bb.height / 2);
            transforms.appendItem(rotate); 
        }

        // it's ok
        return true;
    }
};