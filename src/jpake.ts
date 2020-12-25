import * as secp from "noble-secp256k1";
import {randBetween, asPad64HexString, mod, SHA256Hash} from './utils'

// see: https://billatnapier.medium.com/password-juggling-in-discrete-logs-and-elliptic-curves-a82d5926d26d
// https://asecuritysite.com/encryption/jpake2
const ZEROPOINT = new secp.Point(0n, 0n)
const BASEPOINT = new secp.Point(secp.CURVE.Gx, secp.CURVE.Gy)

export class JPake {
    
    // Private Variables
    private x1:  bigint
    private x2:  bigint
    private s:   bigint

    // Public Variables
    x1G: secp.Point
    x2G: secp.Point

    // Received Variables / cached variables
    x2s: bigint
    otherx2G: secp.Point
    otherV: secp.Point
    hashFn: (str: string) => string

    constructor(secret: string, hashFn: (str: string) => string = SHA256Hash) { 
        this.hashFn = hashFn

        this.s = mod( BigInt("0x" + this.hashFn(secret)), secp.CURVE.n )
        this.x1 = randBetween(0n, secp.CURVE.n - 1n)
        this.x2 = randBetween(0n, secp.CURVE.n - 1n)

        const G = new secp.Point(secp.CURVE.Gx, secp.CURVE.Gy );
        this.x1G = G.multiply(this.x1)
        this.x2G = G.multiply(this.x2)              
    }

    // ZKP checks not implemented into protocol yet.
    computeZKP(x: bigint, G: secp.Point, xG: secp.Point = ZEROPOINT) : object{
        // Computes a ZKP for x on curve G. We use the Fiat-Shamir heuristic:
        // https://en.wikipedia.org/wiki/Fiat%E2%80%93Shamir_heuristic
        // i.e. prove that we know x such that y = xG

        // 1. Pick a random v \in Z_q* and compute t = vG
        const v = randBetween(0n, secp.CURVE.n - 1n)
        const t = G.multiply(v)

        // 2. Compute c = H(g, y, t) where H() is a cryptographic has fn
        xG = (xG.equals(ZEROPOINT) ? G.multiply(x) : xG) // Calculate xG if not provided
        const chal = asPad64HexString(G.x) + asPad64HexString(G.y) + asPad64HexString(t.x) + asPad64HexString(t.y) + asPad64HexString(xG.x) + asPad64HexString(xG.y)
        const c = BigInt("0x"+this.hashFn(chal))

        // 3. Compute r = v - cx
        const r = mod((v-c*x), secp.CURVE.n - 1n)

        // The resulting proof is the pair (t, r).
        // you can use this to verify the pair by
        // calculating c = H(g, y, t) and checking if t == rG * cy.
        // Here, we send over c for simplicity.
        return {
            tx: asPad64HexString(t.x),
            ty: asPad64HexString(t.y),
            r: asPad64HexString(r),
            c: asPad64HexString(c),
        }
    }

    checkZKP(tx: bigint, ty: bigint, r: bigint, c: bigint, G: secp.Point, y: secp.Point): boolean {
        var Vcheck = G.multiply(r).add(y.multiply(c))
        return Vcheck.equals(new secp.Point(tx, ty))
    }

    Round1Message(): string{
        var pubVar = {
            x1Gx: asPad64HexString(this.x1G.x),
            x1Gy: asPad64HexString(this.x1G.y),
            x2Gx: asPad64HexString(this.x2G.x),
            x2Gy: asPad64HexString(this.x2G.y),
        }
        return JSON.stringify(pubVar);
    }

    Round2Message(jsonStringFromB: string): string{
        // In Round 1, we receive x1G and x2G from Bob, and possibly knowledge proofs for x1 and x2
        const otherPubVars = JSON.parse(jsonStringFromB)
        const otherx1G = new secp.Point(BigInt(otherPubVars.x1Gx), BigInt(otherPubVars.x1Gy)) // also x3G and x4G from Bob if you are following the paper
        const otherx2G = new secp.Point(BigInt(otherPubVars.x2Gx), BigInt(otherPubVars.x2Gy))
        
        // These are variables which can be cached for other steps 
        this.otherx2G = otherx2G
        this.x2s = this.x2 * this.s

        // A = (G1 + G3 + G4) x [x2*s]
        var A = this.x1G.add(otherx1G).add(otherx2G)
        A = A.multiply(this.x2s)

        return JSON.stringify({
            Ax: asPad64HexString(A.x),
            Ay: asPad64HexString(A.y)
        })
    }

    computeSharedKey(jsonStringFromB: string) : string {
        const otherA = JSON.parse(jsonStringFromB)
        const B = new secp.Point(BigInt(otherA.Ax), BigInt(otherA.Ay))

        // Ka = (B - (G4 x [x2*s])) x [x2]
        const Ka = B.subtract(this.otherx2G.multiply(this.x2s)).multiply(this.x2)
        const sharedKey = this.hashFn(asPad64HexString(Ka.x))
        return sharedKey
    }
}
