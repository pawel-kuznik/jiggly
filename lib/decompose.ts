/**
 *  This is a special function to decompose a matrix.
 * 
 *  Note. A the moment of writing this code, my algebra is rusty, it's quite late, and I am fresh after
 *  a flu. It might contain bugs. But it might be perfect. I say 50/50.
 * 
 *  @see https://www.w3.org/TR/css-transforms-1/#decomposing-a-2d-matrix
 */
export function decompose(matrix:SVGMatrix) : DecompositionResult {

    // extract some variables. they will be needed later on
    let row0x = matrix.a;
    let row0y = matrix.b;
    let row1x = matrix.c;
    let row1y = matrix.d;
    
    // compute translation
    let translationX = matrix.e;
    let translationY = matrix.f;

    // compute scale
    let scaleX = Math.sqrt(row0x * row0x + row0y * row0y);
    let scaleY = Math.sqrt(row1x * row1x + row1y * row1y);

    // if determinant is negative, one axis was flipped
    let determinant = row0x * row1y - row0y * row1x;
    if (determinant < 0) {

        // flip axis
        if (row0x < row1y) scaleX = -scaleX;
        else scaleY = -scaleY;
    }

    // renormalize matrix to remove scale
    if (scaleX) {
        row0x *= 1 / scaleX;
        row0y *= 1 / scaleX;
    }
    if (scaleY) {
        row1x *= 1 / scaleY;
        row1y *= 1 / scaleY;
    }

    // compute angle
    let angle = Math.atan2(row0y, row0x);

    // do we have a rotation? then we need to make some normalization
    if (angle) {

        let sn = -row0y;
        let cs = row0x;
        let m11 = row0x;
        let m12 = row0y;
        let m21 = row1x;
        let m22 = row1y;
        row0x = cs * m11 + sn * m21;
        row0y = cs * m12 + sn * m22;
        row1x = -sn * m11 + cs * m21;
        row1y = -sn * m12 + cs * m22;
    }

    // convert angle to degrees
    angle = angle * (180 / Math.PI);
    
    // return the result
    return {
        translationX,
        translationY,
        rotation:angle
    };
}

// the result of the decomposition
// @todo add scale when we need it
export interface DecompositionResult {
    translationX:number,
    translationY:number,
    rotation:number
};