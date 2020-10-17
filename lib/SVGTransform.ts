import { Slot } from "./Slot";
/**
 *  This is a slot class representing an SVG transformation.
 */
export class SVGTransform extends Slot {

    /**
     *  The SVG element to rotate.
     */
    private _elem:SVGElement;

    /**
     *  A possible origin position against which we would make the transform.
     *  This makes sense only for things like skew or rotate.
     */
    private _origin:DOMPoint|null = null;

    /**
     *  The rotate by specific number of degrees.
     */
    private _rotation:number = 0;

    /**
     *  A potential array of inits.
     */
    private _init:Array<number>|null = null;

    /**
     *  The constructor.
     *  @param SVGElement   The element on which to perform the transform
     *  @param persist      Should the transform persist the transform for further tranformations?
     */
    public constructor(elem:SVGElement, persist:boolean = true) {

        // call the parent constructor
        super();

        // assign the element
        this._elem = elem;
    }

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

        // for the tick we need to calculate the origin position of the element
        const rect = this._elem.getBoundingClientRect();
        this._origin = new DOMPoint(rect.x + rect.width / 2, rect.y + rect.height / 2);

        // a regex to get the matrix directive
        const initxRegex = /matrix\((\-?[0-9\.]+) (\-?[0-9\.]+) (\-?[0-9\.]+) (\-?[0-9\.]+) (\-?[0-9\.]+) (\-?[0-9\.]+)\)/ig;

        // a regext to detect if we have a matrix
        const matches = initxRegex.exec(this._elem.getAttribute('transform') || '');

        // do we have matches? then construct inits for the matrix
        if (matches) this._init = Array.from(matches).slice(1, 7).map((input:string) => Number(input));
    }

    /**
     *  Tick the animation.
     */
    public tick(miliseconds:number) : boolean {

        // check with parent if we should tick
        if (!super.tick(miliseconds)) return false;

        // create a matrix to start the rotation.
        const matrix = this._init ? new DOMMatrix(this._init) : new DOMMatrix();

        // make it spin around itself we need to translate the matrix a by
        // the origin point position
        if (this._origin) matrix.translateSelf(this._origin.x, this._origin.y);

        // calculate the value
        const value = this.value(miliseconds);

        // make a rotation
        if (this._rotation) matrix.rotateSelf(value * this._rotation);

        // and return to expected position
        if (this._origin) matrix.translateSelf(-this._origin.x, -this._origin.y);

        // set the transform on the element
        this._elem.setAttribute('transform', `matrix(${matrix.a} ${matrix.b} ${matrix.c} ${matrix.d} ${matrix.e} ${matrix.f})`);

        // it's ok
        return true;
    }
};