import sha256  from 'crypto-js/sha256'


/* HELPER FUNCTIONS */
function modNum (x: number, n: number): number {
    return ((x % n) + n) % n
}

export function mod (x: bigint, n: bigint): bigint {
    return ((x % n) + n) % n
}
  
function getRandomBytes (byteLength: number): Uint8Array {
    const uint8Buf = new Uint8Array(byteLength)
    if (typeof window == 'object' && 'crypto' in window) {
        return window.crypto.getRandomValues(uint8Buf);
    }
    else if (typeof process === 'object' && 'node' in process.versions) {
        const { randomBytes } = require('crypto');
        return new Uint8Array(randomBytes(byteLength).buffer);
    }
    else {
        throw new Error("The environment doesn't have randomBytes function");
    }
}

function getRandomBits (bitLength: number): Uint8Array {
    const byteLength = Math.ceil(bitLength / 8) 
    const randBytes = getRandomBytes(byteLength)

    const bitLengthMod8 = modNum(bitLength, 8)
    if (bitLengthMod8) {
        // randBytes[0] is the MSByte
        // Fill the MSByte with leading zeros to produce the correct
        // bit length
        randBytes[0] = randBytes[0] & (2 ** bitLengthMod8 - 1)
    }
    return randBytes
}

export function fromBuffer (buf: Uint8Array) {
    let ret = 0n
    for (const i of buf.values()) {
        const bi = BigInt(i)
        ret = (ret << BigInt(8)) + bi
    }
    return ret
}

function bitLength (a: number|bigint) {
    a = BigInt(a)
    if (a === 1n) { return 1 }
    let bits = 1
    do {
        bits++
    } while ((a >>= 1n) > 1n)
    return bits
}

export function randBetween (min: bigint, max: bigint): bigint {
    if (max <= 0n || min < 0n || max <= min) throw new RangeError('Arguments MUST be: max > 0 && min >=0 && max > min')
    const interval = max - min
    const bitLen = bitLength(interval)
    let rnd
    do {
      const buf = getRandomBits(bitLen)
      rnd = fromBuffer(buf)
    } while (rnd > interval)
    const randnum = rnd + min
    return randnum
}

export function asPad64HexString(x: bigint, add0x: boolean = true): string {
    const pad64HexString = x.toString(16).padStart(64, '0')
    return add0x ? '0x' + pad64HexString : pad64HexString
}

export function SHA256Hash(toHash: string): string {
    var hash = sha256(toHash).toString()
    return hash
}
