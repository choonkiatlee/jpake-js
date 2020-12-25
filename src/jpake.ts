import * as secp from "noble-secp256k1";
import {randBetween, asBase64String, mod, SHA256Hash, fromBase64String} from './utils'

// see: https://billatnapier.medium.com/password-juggling-in-discrete-logs-and-elliptic-curves-a82d5926d26d
// https://asecuritysite.com/encryption/jpake2
const ZEROPOINT = new secp.Point(0n, 0n)
const BASEPOINT = new secp.Point(secp.CURVE.Gx, secp.CURVE.Gy)

type ZKPMsg = {
    tx: string,
    ty: string,
    r: string,
    c: string,
}

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
    otherx1G: secp.Point
    otherx2G: secp.Point
    otherV: secp.Point
    G: secp.Point
    hashFn: (str: string) => string

    constructor(secret: string, hashFn: (str: string) => string = SHA256Hash) { 
        this.hashFn = hashFn

        this.s = mod( BigInt("0x" + this.hashFn(secret)), secp.CURVE.n )
        this.x1 = randBetween(0n, secp.CURVE.n - 1n)
        this.x2 = randBetween(0n, secp.CURVE.n - 1n)

        const G = new secp.Point(secp.CURVE.Gx, secp.CURVE.Gy );
        this.G = G
        this.x1G = G.multiply(this.x1)
        this.x2G = G.multiply(this.x2)              
    }

    // ZKP checks not implemented into protocol yet.
    computeZKP(x: bigint, Generator: secp.Point, y: secp.Point = ZEROPOINT) : object{
        // Computes a ZKP for x on Generator. We use the Fiat-Shamir heuristic:
        // https://en.wikipedia.org/wiki/Fiat%E2%80%93Shamir_heuristic
        // i.e. prove that we know x such that y = x.Generator
        // Note that we differentiate between the point G on the curve, and the
        // Generator used to compute the ZKP

        // 1. Pick a random v \in Z_q* and compute t = vG
        const v = randBetween(0n, secp.CURVE.n - 1n)
        const t = Generator.multiply(v)

        // 2. Compute c = H(g, y, t) where H() is a cryptographic has fn
        y = y.equals(ZEROPOINT) ? Generator.multiply(x) : y
        const chal = asBase64String(Generator.x) + asBase64String(Generator.y) + asBase64String(t.x) + asBase64String(t.y) + asBase64String(y.x) + asBase64String(y.y)
        const c = BigInt("0x"+this.hashFn(chal))

        // 3. Compute r = v - cx
        const r = mod((v-c*x), secp.CURVE.n)

        // The resulting proof is the pair (t, r).
        // you can use this to verify the pair by
        // calculating c = H(g, y, t) and checking if t == rG * cy.
        // Here, we send over c for simplicity.
        return {
            tx: asBase64String(t.x),
            ty: asBase64String(t.y),
            r: asBase64String(r),
            c: asBase64String(c),
        }
    }

    checkZKP(tx: bigint, ty: bigint, r: bigint, G: secp.Point, y: secp.Point): boolean {
        const chal = asBase64String(G.x) + asBase64String(G.y) + asBase64String(tx) + asBase64String(ty) + asBase64String(y.x) + asBase64String(y.y)
        const c = BigInt("0x" + this.hashFn(chal))

        var Vcheck = G.multiply(r).add(y.multiply(c))
        return Vcheck.equals(new secp.Point(tx, ty))
    }

    checkZKPSimpler(msgObj: ZKPMsg, Generator: secp.Point, y: secp.Point) {

        const tx = fromBase64String(msgObj.tx)
        const ty = fromBase64String(msgObj.ty)
        const r = fromBase64String(msgObj.r)
        const c = fromBase64String(msgObj.c)

        var Vcheck = Generator.multiply(r).add(y.multiply(c))
        return Vcheck.equals(new secp.Point(tx, ty))
    }

    Round1Message(): string{
        var pubVar = {
            x1Gx: asBase64String(this.x1G.x),
            x1Gy: asBase64String(this.x1G.y),
            x2Gx: asBase64String(this.x2G.x),
            x2Gy: asBase64String(this.x2G.y),

            x1ZKP: this.computeZKP(this.x1, this.G, this.x1G),
            x2ZKP: this.computeZKP(this.x2, this.G, this.x2G),
        }
        return JSON.stringify(pubVar);
    }

    Round2Message(jsonStringFromB: string): string{
        // In Round 1, we receive x1G and x2G from Bob, and possibly knowledge proofs for x1 and x2
        const otherPubVars = JSON.parse(jsonStringFromB)
        const otherx1G = new secp.Point(fromBase64String(otherPubVars.x1Gx), fromBase64String(otherPubVars.x1Gy)) // also x3G and x4G from Bob if you are following the paper
        const otherx2G = new secp.Point(fromBase64String(otherPubVars.x2Gx), fromBase64String(otherPubVars.x2Gy))
        
        // validate ZKPs
        const x1Proof = this.checkZKPSimpler(otherPubVars.x1ZKP, this.G, otherx1G)
        const x2Proof = this.checkZKPSimpler(otherPubVars.x2ZKP, this.G, otherx2G)

        if (!(x1Proof && x2Proof)) {
            throw "Round1 Knowledge Proof Not verified!"
        }

        // These are variables which can be cached for other steps 
        this.otherx1G = otherx1G
        this.otherx2G = otherx2G
        this.x2s = this.x2 * this.s

        // A = (G1 + G3 + G4) x [x2*s]
        const Generator = this.x1G.add(otherx1G).add(otherx2G) // As per the RFC, the 2nd round generator is G1 + G3 + G4 in the EC setting
        const A = Generator.multiply(this.x2s)

        return JSON.stringify({
            Ax: asBase64String(A.x),
            Ay: asBase64String(A.y),

            xsZKP: this.computeZKP(this.x2s, Generator, A)
        })
    }

    computeSharedKey(jsonStringFromB: string) : string {
        const otherA = JSON.parse(jsonStringFromB)
        const B = new secp.Point(fromBase64String(otherA.Ax), fromBase64String(otherA.Ay))
        
        const ZKPGenerator = this.x1G.add(this.x2G).add(this.otherx1G)
        const xsProof = this.checkZKPSimpler(otherA.xsZKP, ZKPGenerator, B)
        if (!xsProof) {
            throw "Round2 Knowledge Proof Not verified!"
        }

        // Ka = (B - (G4 x [x2*s])) x [x2]
        const Ka = B.subtract(this.otherx2G.multiply(this.x2s)).multiply(this.x2)
        const sharedKey = this.hashFn(asBase64String(Ka.x))
        return sharedKey
    }
}
