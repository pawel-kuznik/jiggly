import { Animation } from "./Animation";
/**
 *  A special animation to rotate an SVG element.
 */
export class SVGRotate extends Animation {

    /**
     *  The SVG element to rotate.
     */
    private _elem:SVGElement;

    /**
     *  A possible origin position against which we would make the rotation.
     */
    private _origin:DOMPoint|null = null;

    /**
     *  The constructor.
     */
    public constructor(elem:SVGElement) {

        // call the parent constructor
        super();

        // assign the element
        this._elem = elem;
    }

    /**
     *  Start the animation.
     */
    public start() {

        // make the start
        super.start();

        // for the tick we need to calculate the origin position of the element
        const rect = this._elem.getBoundingClientRect();
        this._origin = new DOMPoint(rect.width / 2, rect.height / 2)
    }

    /**
     *  Tick the animation.
     */
    public tick(miliseconds:number) : boolean {

        // check with parent if we should tick
        if (!super.tick(miliseconds)) return false;

        // create a matrix to start the rotation.
        const matrix = new DOMMatrix();

        // make it spin around itself we need to translate the matrix a by
        // the origin point position
        if (this._origin) matrix.translateSelf(this._origin.x, this._origin.y);

        // make a rotation
        matrix.rotateSelf(this.progress(miliseconds) * 360);

        // and return to expected position
        if (this._origin) matrix.translateSelf(-this._origin.x, -this._origin.y);

        // set the transform on the element
        this._elem.setAttribute('transform', `matrix(${matrix.a} ${matrix.b} ${matrix.c} ${matrix.d} ${matrix.e} ${matrix.f})`);

        // it's ok
        return true;
    }
}