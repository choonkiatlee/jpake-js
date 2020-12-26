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

export function asBase64String( x: bigint ): string {
    return BigIntBase64.fromInt(x)
}

export function fromBase64String(str: string): bigint {
    return BigIntBase64.toInt(str)
}


export const BigIntBase64 = (function () {
    var digitsStr = 
    //   0       8       16      24      32      40      48      56     63
    //   v       v       v       v       v       v       v       v      v
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var digits = digitsStr.split('');
    var digitsMap: {[digit: string]: bigint} = {};
    for (var i = 0; i < digits.length; i++) {
        digitsMap[digits[i]] = BigInt(i);
    }
    return {
        fromInt: function(x: bigint) {
            // Fast base64 encoding based on RFC
            var result = ''
            const byteLen = Math.ceil(bitLength(x) / 8)
            const leftoverBytes = (byteLen % 3)
            const numPadBytes = leftoverBytes == 0 ? 0 : 3 - leftoverBytes
            x <<= BigInt(numPadBytes * 8)
            while (true) {
                result = digits[Number(x & 0x3fn)] + result; // this is safe because of the bitshifting
                x >>= 6n; // Only good for us with unsigned integers? this should break for signed integers.
                if (x === 0n)
                    break;
            }
            // Replace the last numPadBytes characters with "="
            result = result.substr(0, result.length - numPadBytes) + Array(numPadBytes+1).join("=")

            return result;
        },
        toInt: function(digitsStr: string) {
            var result = 0n;            
            var digits = digitsStr.split('');

            var numPadChars = 0
            for (let i = 0; i < 2; i++ ){
                if ( digits[digits.length - i - 1]  == '=' ) {
                    digits[digits.length - i - 1] = "A"
                    numPadChars ++
                }
            }
            for (var i = 0; i < digits.length; i++) {
                result = (result << 6n) + digitsMap[digits[i]];
            }
            // Right shift result back based on the correct number of padded chars
            result >>= BigInt(8*numPadChars)
            return result;
        }
    };
})();


// export const UnsignedBigIntBase64 = (function () {
//     const byteToHex: Array<string> = new Array(0xff);
//     for (let n = 0; n <= 0xff; ++n)
//     {
//         const hexOctet = n.toString(16).padStart(2, "0");
//         byteToHex.push(hexOctet);
//     }

//     return {
//         fromInt: function(x: bigint) {
//             var byteStringArray = x.toString(8).split('');
//             var u8 = new Uint8Array(byteStringArray.length);
        
//             // And then we can iterate each element by one
//             for ( var i = 0; i < byteStringArray.length; i++ ) {
//                 u8[i] = Number(x & 0xfn); // 0xf == 1 byte
//                 x >>= 2n   // THIS DOES NOT WORK WITH NEGATIVE NUMBERS!
//             }
//             return u8;
//         },
//         toInt: function(digitsStr: string) {
//             const bytes = window.atob(digitsStr)
//             var hex = new Array(bytes.length);
//             for (let i = 0; i < bytes.length; ++i) {
//                 hex[i] = byteToHex[bytes[i]]
//             }
//             return hex.join('')
//         }
//     };
// })();

// const bytes = atob(data);
//     let length = bytes.length;
//     let out = new Uint8Array(length);

//     // Loop and convert.
//     while (length--) {
//         out[length] = bytes.charCodeAt(length);
//     }

//     return new Blob([out], { type: type });


// export const asd = (function(){
//     "use strict";
    
//     var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    
//     // Use a lookup table to find the index.
//     var lookup = new Uint8Array(256);
//     for (var i = 0; i < chars.length; i++) {
//         lookup[chars.charCodeAt(i)] = i;
//     }

//     return {
//         fromInt: function(x: bigint) {
//             var byteStringArray = x.toString(8).split('');
//             var u8 = new Uint8Array(byteStringArray.length);
//             var base64 = ""
        
//             // And then we can iterate each element by one
//             for ( var i = 0; i < byteStringArray.length; i+=3 ) {
//                 u8[i] = Number(x & 0xfn); // 0xf == 1 byte
//                 x >>= 2n   // THIS DOES NOT WORK WITH NEGATIVE NUMBERS!
//             }
//             return u8;
//         },
//     }
    
//     encode = function(arraybuffer) {
//         var bytes = new Uint8Array(arraybuffer),
//         i, len = bytes.length, base64 = "";
    
//         for (i = 0; i < len; i+=3) {
//             base64 += chars[bytes[i] >> 2];
//             base64 += chars[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)];
//             base64 += chars[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)];
//             base64 += chars[bytes[i + 2] & 63];
//         }
    
//         if ((len % 3) === 2) {
//         base64 = base64.substring(0, base64.length - 1) + "=";
//         } else if (len % 3 === 1) {
//         base64 = base64.substring(0, base64.length - 2) + "==";
//         }
    
//         return base64;
//     };
    
//     exports.decode =  function(base64) {
//         var bufferLength = base64.length * 0.75,
//         len = base64.length, i, p = 0,
//         encoded1, encoded2, encoded3, encoded4;
    
//         if (base64[base64.length - 1] === "=") {
//         bufferLength--;
//         if (base64[base64.length - 2] === "=") {
//             bufferLength--;
//         }
//         }
    
//         var arraybuffer = new ArrayBuffer(bufferLength),
//         bytes = new Uint8Array(arraybuffer);
    
//         for (i = 0; i < len; i+=4) {
//         encoded1 = lookup[base64.charCodeAt(i)];
//         encoded2 = lookup[base64.charCodeAt(i+1)];
//         encoded3 = lookup[base64.charCodeAt(i+2)];
//         encoded4 = lookup[base64.charCodeAt(i+3)];
    
//         bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
//         bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
//         bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
//         }
    
//         return arraybuffer;
//     };
//     })();
    