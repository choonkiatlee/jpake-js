!function(t,n){"object"==typeof exports&&"object"==typeof module?module.exports=n():"function"==typeof define&&define.amd?define([],n):"object"==typeof exports?exports.jpake=n():t.jpake=n()}(this,(function(){return(()=>{var t={905:function(t,n,e){"use strict";var r=this&&this.__createBinding||(Object.create?function(t,n,e,r){void 0===r&&(r=e),Object.defineProperty(t,r,{enumerable:!0,get:function(){return n[e]}})}:function(t,n,e,r){void 0===r&&(r=e),t[r]=n[e]}),i=this&&this.__setModuleDefault||(Object.create?function(t,n){Object.defineProperty(t,"default",{enumerable:!0,value:n})}:function(t,n){t.default=n}),o=this&&this.__importStar||function(t){if(t&&t.__esModule)return t;var n={};if(null!=t)for(var e in t)"default"!==e&&Object.hasOwnProperty.call(t,e)&&r(n,t,e);return i(n,t),n};Object.defineProperty(n,"__esModule",{value:!0}),n.base64=n.JPake=void 0;const s=o(e(795)),a=e(91),c=new s.Point(0n,0n);new s.Point(s.CURVE.Gx,s.CURVE.Gy),n.JPake=class{constructor(t,n=a.SHA256Hash){this.hashFn=n,this.s=a.mod(BigInt("0x"+this.hashFn(t)),s.CURVE.n),this.x1=a.randBetween(0n,s.CURVE.n-1n),this.x2=a.randBetween(0n,s.CURVE.n-1n);const e=new s.Point(s.CURVE.Gx,s.CURVE.Gy);this.G=e}setState(t,n){this.x1=t,this.x2=n}test1(t){return a.asBase64String(t)}computeZKP(t,n,e=c){const r=a.randBetween(0n,s.CURVE.n-1n),i=n.multiply(r);e=e.equals(c)?n.multiply(t):e;const o=a.asBase64String(n.x)+a.asBase64String(n.y)+a.asBase64String(i.x)+a.asBase64String(i.y)+a.asBase64String(e.x)+a.asBase64String(e.y),u=BigInt("0x"+this.hashFn(o)),f=a.mod(r-u*t,s.CURVE.n);return{tx:a.asBase64String(i.x),ty:a.asBase64String(i.y),r:a.asBase64String(f),c:a.asBase64String(u)}}checkZKP(t,n,e,r,i){const o=a.asBase64String(r.x)+a.asBase64String(r.y)+a.asBase64String(t)+a.asBase64String(n)+a.asBase64String(i.x)+a.asBase64String(i.y),c=BigInt("0x"+this.hashFn(o));return r.multiply(e).add(i.multiply(c)).equals(new s.Point(t,n))}checkZKPSimpler(t,n,e){const r=a.fromBase64String(t.tx),i=a.fromBase64String(t.ty),o=a.fromBase64String(t.r),c=a.fromBase64String(t.c);return n.multiply(o).add(e.multiply(c)).equals(new s.Point(r,i))}GetRound1Message(){this.x1G=this.G.multiply(this.x1),this.x2G=this.G.multiply(this.x2);var t={x1Gx:a.asBase64String(this.x1G.x),x1Gy:a.asBase64String(this.x1G.y),x2Gx:a.asBase64String(this.x2G.x),x2Gy:a.asBase64String(this.x2G.y),x1ZKP:this.computeZKP(this.x1,this.G,this.x1G),x2ZKP:this.computeZKP(this.x2,this.G,this.x2G)};return JSON.stringify(t)}GetRound2Message(t){const n=JSON.parse(t),e=new s.Point(a.fromBase64String(n.x1Gx),a.fromBase64String(n.x1Gy)),r=new s.Point(a.fromBase64String(n.x2Gx),a.fromBase64String(n.x2Gy)),i=this.checkZKPSimpler(n.x1ZKP,this.G,e),o=this.checkZKPSimpler(n.x2ZKP,this.G,r);if(!i||!o)throw"Round1 Knowledge Proof Not verified!";this.otherx1G=e,this.otherx2G=r,this.x2s=this.x2*this.s;const c=this.x1G.add(e).add(r),u=c.multiply(this.x2s),f=c.multiply(this.x2).multiply(this.s);return console.log(u,f,u.equals(f)),JSON.stringify({Ax:a.asBase64String(u.x),Ay:a.asBase64String(u.y),xsZKP:this.computeZKP(this.x2s,c,u)})}ComputeSharedKey(t){const n=JSON.parse(t),e=new s.Point(a.fromBase64String(n.Ax),a.fromBase64String(n.Ay)),r=this.x1G.add(this.x2G).add(this.otherx1G);if(!this.checkZKPSimpler(n.xsZKP,r,e))throw"Round2 Knowledge Proof Not verified!";const i=e.subtract(this.otherx2G.multiply(this.x2s)).multiply(this.x2);return this.hashFn(a.asBase64String(i.x))}},n.base64=a.BigIntBase64},91:function(t,n,e){"use strict";var r=this&&this.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(n,"__esModule",{value:!0}),n.BigIntBase64=n.fromBase64String=n.asBase64String=n.SHA256Hash=n.asPad64HexString=n.randBetween=n.fromBuffer=n.mod=void 0;const i=r(e(153));function o(t){const n=function(t){const n=new Uint8Array(t);if("object"==typeof window&&"crypto"in window)return window.crypto.getRandomValues(n);if("object"==typeof process&&"node"in process.versions){const{randomBytes:n}=e(906);return new Uint8Array(n(t).buffer)}throw new Error("The environment doesn't have randomBytes function")}(Math.ceil(t/8)),r=(t%8+8)%8;return r&&(n[0]=n[0]&2**r-1),n}function s(t){let n=0n;for(const e of t.values()){const t=BigInt(e);n=(n<<BigInt(8))+t}return n}function a(t){if(1n===(t=BigInt(t)))return 1;let n=1;do{n++}while((t>>=1n)>1n);return n}n.mod=function(t,n){return(t%n+n)%n},n.fromBuffer=s,n.randBetween=function(t,n){if(n<=0n||t<0n||n<=t)throw new RangeError("Arguments MUST be: max > 0 && min >=0 && max > min");const e=n-t,r=a(e);let i;do{i=s(o(r))}while(i>e);return i+t},n.asPad64HexString=function(t,n=!0){const e=t.toString(16).padStart(64,"0");return n?"0x"+e:e},n.SHA256Hash=function(t){return i.default(t).toString()},n.asBase64String=function(t){return n.BigIntBase64.fromInt(t)},n.fromBase64String=function(t){return n.BigIntBase64.toInt(t)},n.BigIntBase64=function(){for(var t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split(""),n={},e=0;e<t.length;e++)n[t[e]]=BigInt(e);return{fromInt:function(n){var e="";const r=Math.ceil(a(n)/8)%3,i=0==r?0:3-r;for(n<<=BigInt(8*i);e=t[Number(0x3fn&n)]+e,0n!==(n>>=6n););return e.substr(0,e.length-i)+Array(i+1).join("=")},toInt:function(t){var e=0n,r=t.split(""),i=0;for(let t=0;t<2;t++)"="==r[r.length-t-1]&&(r[r.length-t-1]="A",i++);for(var o=0;o<r.length;o++)e=(e<<6n)+n[r[o]];return e>>BigInt(8*i)}}}()},249:function(t,n,e){var r;t.exports=r=r||function(t,n){var r;if("undefined"!=typeof window&&window.crypto&&(r=window.crypto),!r&&"undefined"!=typeof window&&window.msCrypto&&(r=window.msCrypto),!r&&void 0!==e.g&&e.g.crypto&&(r=e.g.crypto),!r)try{r=e(906)}catch(t){}var i=function(){if(r){if("function"==typeof r.getRandomValues)try{return r.getRandomValues(new Uint32Array(1))[0]}catch(t){}if("function"==typeof r.randomBytes)try{return r.randomBytes(4).readInt32LE()}catch(t){}}throw new Error("Native crypto module could not be used to get secure random number.")},o=Object.create||function(){function t(){}return function(n){var e;return t.prototype=n,e=new t,t.prototype=null,e}}(),s={},a=s.lib={},c=a.Base={extend:function(t){var n=o(this);return t&&n.mixIn(t),n.hasOwnProperty("init")&&this.init!==n.init||(n.init=function(){n.$super.init.apply(this,arguments)}),n.init.prototype=n,n.$super=this,n},create:function(){var t=this.extend();return t.init.apply(t,arguments),t},init:function(){},mixIn:function(t){for(var n in t)t.hasOwnProperty(n)&&(this[n]=t[n]);t.hasOwnProperty("toString")&&(this.toString=t.toString)},clone:function(){return this.init.prototype.extend(this)}},u=a.WordArray=c.extend({init:function(t,n){t=this.words=t||[],this.sigBytes=null!=n?n:4*t.length},toString:function(t){return(t||h).stringify(this)},concat:function(t){var n=this.words,e=t.words,r=this.sigBytes,i=t.sigBytes;if(this.clamp(),r%4)for(var o=0;o<i;o++){var s=e[o>>>2]>>>24-o%4*8&255;n[r+o>>>2]|=s<<24-(r+o)%4*8}else for(o=0;o<i;o+=4)n[r+o>>>2]=e[o>>>2];return this.sigBytes+=i,this},clamp:function(){var n=this.words,e=this.sigBytes;n[e>>>2]&=4294967295<<32-e%4*8,n.length=t.ceil(e/4)},clone:function(){var t=c.clone.call(this);return t.words=this.words.slice(0),t},random:function(t){for(var n=[],e=0;e<t;e+=4)n.push(i());return new u.init(n,t)}}),f=s.enc={},h=f.Hex={stringify:function(t){for(var n=t.words,e=t.sigBytes,r=[],i=0;i<e;i++){var o=n[i>>>2]>>>24-i%4*8&255;r.push((o>>>4).toString(16)),r.push((15&o).toString(16))}return r.join("")},parse:function(t){for(var n=t.length,e=[],r=0;r<n;r+=2)e[r>>>3]|=parseInt(t.substr(r,2),16)<<24-r%8*4;return new u.init(e,n/2)}},l=f.Latin1={stringify:function(t){for(var n=t.words,e=t.sigBytes,r=[],i=0;i<e;i++){var o=n[i>>>2]>>>24-i%4*8&255;r.push(String.fromCharCode(o))}return r.join("")},parse:function(t){for(var n=t.length,e=[],r=0;r<n;r++)e[r>>>2]|=(255&t.charCodeAt(r))<<24-r%4*8;return new u.init(e,n)}},d=f.Utf8={stringify:function(t){try{return decodeURIComponent(escape(l.stringify(t)))}catch(t){throw new Error("Malformed UTF-8 data")}},parse:function(t){return l.parse(unescape(encodeURIComponent(t)))}},y=a.BufferedBlockAlgorithm=c.extend({reset:function(){this._data=new u.init,this._nDataBytes=0},_append:function(t){"string"==typeof t&&(t=d.parse(t)),this._data.concat(t),this._nDataBytes+=t.sigBytes},_process:function(n){var e,r=this._data,i=r.words,o=r.sigBytes,s=this.blockSize,a=o/(4*s),c=(a=n?t.ceil(a):t.max((0|a)-this._minBufferSize,0))*s,f=t.min(4*c,o);if(c){for(var h=0;h<c;h+=s)this._doProcessBlock(i,h);e=i.splice(0,c),r.sigBytes-=f}return new u.init(e,f)},clone:function(){var t=c.clone.call(this);return t._data=this._data.clone(),t},_minBufferSize:0}),p=(a.Hasher=y.extend({cfg:c.extend(),init:function(t){this.cfg=this.cfg.extend(t),this.reset()},reset:function(){y.reset.call(this),this._doReset()},update:function(t){return this._append(t),this._process(),this},finalize:function(t){return t&&this._append(t),this._doFinalize()},blockSize:16,_createHelper:function(t){return function(n,e){return new t.init(e).finalize(n)}},_createHmacHelper:function(t){return function(n,e){return new p.HMAC.init(t,e).finalize(n)}}}),s.algo={});return s}(Math)},153:function(t,n,e){var r;t.exports=(r=e(249),function(t){var n=r,e=n.lib,i=e.WordArray,o=e.Hasher,s=n.algo,a=[],c=[];!function(){function n(n){for(var e=t.sqrt(n),r=2;r<=e;r++)if(!(n%r))return!1;return!0}function e(t){return 4294967296*(t-(0|t))|0}for(var r=2,i=0;i<64;)n(r)&&(i<8&&(a[i]=e(t.pow(r,.5))),c[i]=e(t.pow(r,1/3)),i++),r++}();var u=[],f=s.SHA256=o.extend({_doReset:function(){this._hash=new i.init(a.slice(0))},_doProcessBlock:function(t,n){for(var e=this._hash.words,r=e[0],i=e[1],o=e[2],s=e[3],a=e[4],f=e[5],h=e[6],l=e[7],d=0;d<64;d++){if(d<16)u[d]=0|t[n+d];else{var y=u[d-15],p=(y<<25|y>>>7)^(y<<14|y>>>18)^y>>>3,w=u[d-2],g=(w<<15|w>>>17)^(w<<13|w>>>19)^w>>>10;u[d]=p+u[d-7]+g+u[d-16]}var m=r&i^r&o^i&o,x=(r<<30|r>>>2)^(r<<19|r>>>13)^(r<<10|r>>>22),B=l+((a<<26|a>>>6)^(a<<21|a>>>11)^(a<<7|a>>>25))+(a&f^~a&h)+c[d]+u[d];l=h,h=f,f=a,a=s+B|0,s=o,o=i,i=r,r=B+(x+m)|0}e[0]=e[0]+r|0,e[1]=e[1]+i|0,e[2]=e[2]+o|0,e[3]=e[3]+s|0,e[4]=e[4]+a|0,e[5]=e[5]+f|0,e[6]=e[6]+h|0,e[7]=e[7]+l|0},_doFinalize:function(){var n=this._data,e=n.words,r=8*this._nDataBytes,i=8*n.sigBytes;return e[i>>>5]|=128<<24-i%32,e[14+(i+64>>>9<<4)]=t.floor(r/4294967296),e[15+(i+64>>>9<<4)]=r,n.sigBytes=4*e.length,this._process(),this._hash},clone:function(){var t=o.clone.call(this);return t._hash=this._hash.clone(),t}});n.SHA256=o._createHelper(f),n.HmacSHA256=o._createHmacHelper(f)}(Math),r.SHA256)},795:(t,n,e)=>{"use strict";Object.defineProperty(n,"__esModule",{value:!0});const r={a:0n,b:7n,P:2n**256n-2n**32n-977n,n:2n**256n-432420386565659656852420866394968145599n,h:1n,Gx:55066263022277343669578718895168534326250603453777594175500187360389116729240n,Gy:32670510020758816978083085130507043184471273380659243275938904335757337482424n,beta:0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501een};n.CURVE=r;const i=(r.P+1n)/4n;function o(t){const{a:n,b:e}=r;return S(t**3n+n*t+e)}const s=0n===r.a;class a{constructor(t,n,e){this.x=t,this.y=n,this.z=e}static fromAffine(t){if(!(t instanceof u))throw new TypeError("JacobianPoint#fromAffine: expected Point");return new a(t.x,t.y,1n)}static toAffineBatch(t){const n=function(t,n=r.P){const e=t.length,i=new Array(e);let o=1n;for(let r=0;r<e;r++)0n!==t[r]&&(i[r]=o,o=S(o*t[r],n));o=b(o,n);for(let r=e-1;r>=0;r--){if(0n===t[r])continue;let e=S(o*t[r],n);t[r]=S(o*i[r],n),o=e}return t}(t.map((t=>t.z)));return t.map(((t,e)=>t.toAffine(n[e])))}static normalizeZ(t){return a.toAffineBatch(t).map(a.fromAffine)}equals(t){const n=this,e=t,r=S(n.z*n.z),i=S(n.z*r),o=S(e.z*e.z),s=S(e.z*o);return S(n.x*o)===S(r*e.x)&&S(n.y*s)===S(i*e.y)}negate(){return new a(this.x,S(-this.y),this.z)}double(){const t=this.x,n=this.y,e=this.z,r=t**2n,i=n**2n,o=i**2n,s=2n*((t+i)**2n-r-o),c=3n*r,u=S(c**2n-2n*s),f=S(c*(s-u)-8n*o),h=S(2n*n*e);return new a(u,f,h)}add(t){if(!(t instanceof a))throw new TypeError("JacobianPoint#add: expected JacobianPoint");const n=this.x,e=this.y,r=this.z,i=t.x,o=t.y,s=t.z;if(0n===i||0n===o)return this;if(0n===n||0n===e)return t;const c=r**2n,u=s**2n,f=n*u,h=e*s*u,l=o*r*c,d=S(i*c-f),y=S(l-h);if(0n===d)return 0n===y?this.double():a.ZERO;const p=S(d**2n),w=S(d*p),g=f*p,m=S(y**2n-w-2n*g),x=S(y*(g-m)-h*w),B=S(r*s*d);return new a(m,x,B)}multiplyUnsafe(t){if("number"!=typeof t&&"bigint"!=typeof t)throw new TypeError("Point#multiply: expected number or bigint");let n=S(BigInt(t),r.n);if(n<=0)throw new Error("Point#multiply: invalid scalar, expected positive integer");if(!s){let t=a.ZERO,e=this;for(;n>0n;)1n&n&&(t=t.add(e)),e=e.double(),n>>=1n;return t}let[e,i,o,c]=A(n),u=a.ZERO,f=a.ZERO,h=this;for(;i>0n||c>0n;)1n&i&&(u=u.add(h)),1n&c&&(f=f.add(h)),h=h.double(),i>>=1n,c>>=1n;return e&&(u=u.negate()),o&&(f=f.negate()),f=new a(S(f.x*r.beta),f.y,f.z),u.add(f)}precomputeWindow(t){const n=s?128/t+2:256/t+1;let e=[],r=this,i=r;for(let o=0;o<n;o++){i=r,e.push(i);for(let n=1;n<2**(t-1);n++)i=i.add(r),e.push(i);r=i.double()}return e}wNAF(t,n){!n&&this.equals(a.BASE)&&(n=u.BASE);const e=n&&n._WINDOW_SIZE||1;if(256%e)throw new Error("Point#wNAF: Invalid precomputation window, must be power of 2");let r=n&&c.get(n);r||(r=this.precomputeWindow(e),n&&1!==e&&(r=a.normalizeZ(r),c.set(n,r)));let i=a.ZERO,o=a.ZERO;const f=s?128/e+2:256/e+1,h=2**(e-1),l=BigInt(2**e-1),d=2**e,y=BigInt(e);for(let n=0;n<f;n++){const e=n*h;let s=Number(t&l);if(t>>=y,s>h&&(s-=d,t+=1n),0===s)o=o.add(n%2?r[e].negate():r[e]);else{const t=r[e+Math.abs(s)-1];i=i.add(s<0?t.negate():t)}}return[i,o]}multiply(t,n){if("number"!=typeof t&&"bigint"!=typeof t)throw new TypeError("Point#multiply: expected number or bigint");let e,i,o=S(BigInt(t),r.n);if(o<=0)throw new Error("Point#multiply: invalid scalar, expected positive integer");if(s){const[t,s,c,u]=A(o);let f,h,l,d;[f,l]=this.wNAF(s,n),[h,d]=this.wNAF(u,n),t&&(f=f.negate()),c&&(h=h.negate()),h=new a(S(h.x*r.beta),h.y,h.z),[e,i]=[f.add(h),l.add(d)]}else[e,i]=this.wNAF(o,n);return a.normalizeZ([e,i])[0]}toAffine(t=b(this.z)){const n=t**2n,e=S(this.x*n),r=S(this.y*n*t);return new u(e,r)}}a.BASE=new a(r.Gx,r.Gy,1n),a.ZERO=new a(0n,1n,0n);const c=new WeakMap;class u{constructor(t,n){this.x=t,this.y=n}_setWindowSize(t){this._WINDOW_SIZE=t,c.delete(this)}static fromX(t){const n=x(t);let e=v(o(n),i,r.P);1n===(1n&e)&&(e=S(-e));const s=new u(n,e);return s.assertValidity(),s}static fromCompressedHex(t){if(33!==t.length)throw new TypeError("Point.fromHex: compressed expects 33 bytes, not "+2*t.length);const n=x(t.slice(1));let e=v(o(n),i,r.P);1==(1&t[0])!=(1n===(1n&e))&&(e=S(-e));const s=new u(n,e);return s.assertValidity(),s}static fromUncompressedHex(t){if(65!==t.length)throw new TypeError("Point.fromHex: uncompressed expects 65 bytes, not "+2*t.length);const n=x(t.slice(1,33)),e=x(t.slice(33)),r=new u(n,e);return r.assertValidity(),r}static fromHex(t){const n=t instanceof Uint8Array?t:m(t);if(32===n.length)return this.fromX(n);const e=n[0];if(2===e||3===e)return this.fromCompressedHex(n);if(4===e)return this.fromUncompressedHex(n);throw new TypeError("Point.fromHex: received invalid point")}static fromPrivateKey(t){return u.BASE.multiply(H(t))}static fromSignature(t,n,e){const i=R(n),{r:o,s}=i;if(0n===o||0n===s)return;const c=b(o,r.n),f="string"==typeof t?g(t):x(t),h=u.fromHex(`0${2+(1&e)}${y(o)}`),l=a.fromAffine(h).multiplyUnsafe(s),d=a.BASE.multiply(f).negate(),p=l.add(d).multiplyUnsafe(c).toAffine();return p.assertValidity(),p}toRawBytes(t=!1){return m(this.toHex(t))}toHex(t=!1){const n=y(this.x);return t?`${1n&this.y?"03":"02"}${n}`:`04${n}${y(this.y)}`}toHexX(){return this.toHex(!0).slice(2)}toRawX(){return this.toRawBytes(!0).slice(1)}assertValidity(){const{x:t,y:n}=this;if(0n===t||0n===n||t>=r.P||n>=r.P)throw new TypeError("Point is not on elliptic curve");if((S(n*n)-o(t))%r.P!==0n)throw new TypeError("Point is not on elliptic curve")}equals(t){return this.x===t.x&&this.y===t.y}negate(){return new u(this.x,S(-this.y))}double(){return a.fromAffine(this).double().toAffine()}add(t){return a.fromAffine(this).add(a.fromAffine(t)).toAffine()}subtract(t){return this.add(t.negate())}multiply(t){return a.fromAffine(this).multiply(t,this).toAffine()}}function f(t){return parseInt(t[0],16)>=8?"00"+t:t}n.Point=u,u.BASE=new u(r.Gx,r.Gy),u.ZERO=new u(0n,0n);class h{constructor(t,n){this.r=t,this.s=n}static fromHex(t){const n=t instanceof Uint8Array?d(t):t;if("string"!=typeof n)throw new TypeError({}.toString.call(t));const e=n.slice(0,2),r=B(n.slice(2,4)),i=n.slice(4,6);if("30"!==e||r!==n.length-4||"02"!==i)throw new Error("Signature.fromHex: Invalid signature");const o=8+B(n.slice(6,8)),s=g(n.slice(8,o));if("02"!==n.slice(o,o+2))throw new Error("SignResult.fromHex: Invalid signature");const a=B(n.slice(o+2,o+4)),c=o+4,u=g(n.slice(c,c+a));return new h(s,u)}toRawBytes(t=!1){return m(this.toHex(t))}toHex(t=!1){const n=f(w(this.s));if(t)return n;const e=f(w(this.r)),r=w(e.length/2),i=w(n.length/2);return`30${w(e.length/2+n.length/2+4)}02${r}${e}02${i}${n}`}}function l(...t){if(1===t.length)return t[0];const n=t.reduce(((t,n)=>t+n.length),0),e=new Uint8Array(n);for(let n=0,r=0;n<t.length;n++){const i=t[n];e.set(i,r),r+=i.length}return e}function d(t){let n="";for(let e=0;e<t.length;e++)n+=t[e].toString(16).padStart(2,"0");return n}function y(t){return t.toString(16).padStart(64,"0")}function p(t){return m(y(t))}function w(t){const n=t.toString(16);return 1&n.length?`0${n}`:n}function g(t){if("string"!=typeof t)throw new TypeError("hexToNumber: expected string, got "+typeof t);return BigInt(`0x${t}`)}function m(t){t=1&t.length?`0${t}`:t;const n=new Uint8Array(t.length/2);for(let e=0;e<n.length;e++){let r=2*e;n[e]=Number.parseInt(t.slice(r,r+2),16)}return n}function x(t){return g(d(t))}function B(t){return 2*Number.parseInt(t,16)}function S(t,n=r.P){const e=t%n;return e>=0?e:n+e}function v(t,n,e){let r=1n;for(;n>0;)1n&n&&(r=S(r*t,e)),n>>=1n,t=S(t*t,e);return r}function b(t,n=r.P){if(0n===t||n<=0n)throw new Error("invert: expected positive integers");const[e,i]=function(t,n){let[e,r,i,o]=[0n,1n,1n,0n];for(;0n!==t;){let s=n/t,a=n%t,c=e-i*s,u=r-o*s;[n,t]=[t,a],[e,r]=[i,o],[i,o]=[c,u]}return[n,e,r]}(S(t,n),n);if(1n!==e)throw new Error("invert: does not exist");return S(i,n)}function A(t){const{n}=r,e=0x3086d221a7d46bcde86c90e49284eb15n,i=-0xe4437ed6010e88286f547fa90abfe4c3n,o=e*t/n,s=-i*t/n,a=t-o*e-0x114ca50f7a8e2f3f657c1108d9d44cfd8n*s,c=-o*i-s*e,u=a<0,f=c<0;return[u,u?-a:a,f,f?-c:c]}function P(t){return 0<t&&t<r.n}function E(t,n,e){const i=r.n,o=u.BASE.multiply(t),s=S(o.x,i),a=S(b(t,i)*(n+s*e),i);if(0n!==s&&0n!==a)return[o,s,a]}function H(t){if(!t)throw new Error(`Expected receive valid private key, not "${t}"`);let n;return n=t instanceof Uint8Array?x(t):"string"==typeof t?g(t):BigInt(t),n}function _(t){return t instanceof u?t:u.fromHex(t)}function R(t){return t instanceof h?t:h.fromHex(t)}function I(t){const n=t instanceof Uint8Array,e="string"==typeof t,r=(n||e)&&t.length;return n?33===r||65===r:e?66===r||130===r:t instanceof u}async function G(t,...e){const r=new Uint8Array(t.split("").map((t=>t.charCodeAt(0)))),i=await n.utils.sha256(r);return x(await n.utils.sha256(l(i,i,...e)))}async function U(t,n,e){const i=p(t);return S(await G("BIP0340/challenge",i,n.toRawX(),e),r.n)}function z(t){return 0n===S(t.y,2n)}n.Signature=h,n.SignResult=h,n.getPublicKey=function(t,n=!1){const e=u.fromPrivateKey(t);return"string"==typeof t?e.toHex(n):e.toRawBytes(n)},n.recoverPublicKey=function(t,n,e){const r=u.fromSignature(t,n,e);if(r)return"string"==typeof t?r.toHex():r.toRawBytes()},n.getSharedSecret=function(t,n,e=!1){if(I(t)&&!I(n))[t,n]=[n,t];else if(!I(n))throw new Error("Received invalid keys");const r=n instanceof u?n:u.fromHex(n);r.assertValidity();const i=r.multiply(H(t));return"string"==typeof t?i.toHex(e):i.toRawBytes(e)},n.sign=async function(t,e,{recovered:i,canonical:o}={}){if(null==t)throw new Error(`Expected valid msgHash, not "${t}"`);const s=H(e),[a,c,u]=await async function(t,e){const r=p("string"==typeof t?g(t):x(t)),i=p(e),o=x(r);let s=new Uint8Array(32).fill(1),a=new Uint8Array(32).fill(0);const c=Uint8Array.from([0]),u=Uint8Array.from([1]);a=await n.utils.hmacSha256(a,s,c,i,r),s=await n.utils.hmacSha256(a,s),a=await n.utils.hmacSha256(a,s,u,i,r),s=await n.utils.hmacSha256(a,s);for(let t=0;t<1e3;t++){s=await n.utils.hmacSha256(a,s);const t=x(s);let r;if(P(t)&&(r=E(t,o,e)))return r;a=await n.utils.hmacSha256(a,s,c),s=await n.utils.hmacSha256(a,s)}throw new TypeError("secp256k1: Tried 1,000 k values for sign(), all were invalid")}(t,s);let f=(a.x===c?0:2)|Number(1n&a.y),l=u;u>r.n>>1n&&o&&(l=r.n-u,f^=1);const d=new h(c,l),y="string"==typeof t?d.toHex():d.toRawBytes();return i?[y,f]:y},n.verify=function(t,n,e){const i=function(t){let n=g((t="string"==typeof t?t:d(t))||"0");const e=t.length/2*8-256;return e>0&&(n>>=BigInt(e)),n>=r.n&&(n-=r.n),n}(n),{r:o,s}=R(t),c=a.fromAffine(_(e)),u=b(s,r.n),f=a.BASE.multiply(S(i*u,r.n)),h=c.multiplyUnsafe(S(o*u,r.n));return f.add(h).toAffine().x===o};class K{constructor(t,n){if(this.r=t,this.s=n,0n===t||0n===n||t>=r.P||n>=r.n)throw new Error("Invalid signature")}static fromHex(t){const n=t instanceof Uint8Array?t:m(t);if(64!==n.length)throw new TypeError(`SchnorrSignature.fromHex: expected 64 bytes, not ${n.length}`);const e=x(n.slice(0,32)),r=x(n.slice(32));return new K(e,r)}toHex(){return y(this.r)+y(this.s)}toRawBytes(){return m(this.toHex())}}async function Z(t,n,e){const r=t instanceof K?t:K.fromHex(t),i="string"==typeof n?m(n):n,o=_(e),s=await U(r.r,o,i),a=u.fromPrivateKey(r.s),c=o.multiply(s),f=a.subtract(c);return!(f.equals(u.BASE)||!z(f)||f.x!==r.r)}n.schnorr={Signature:K,getPublicKey:function(t){const n=u.fromPrivateKey(t);return"string"==typeof t?n.toHexX():n.toRawX()},sign:async function(t,e,i=n.utils.randomPrivateKey()){if(null==t)throw new TypeError(`Expected valid message, not "${t}"`);e||(e=0n);const{n:o}=r,s="string"==typeof t?m(t):t,a=H(e);if(!(0<a&&a<o))throw new Error("Invalid private key");const c="string"==typeof i?m(i):i;if(32!==c.length)throw new TypeError("Expected 32 bytes of aux randomness");const f=u.fromPrivateKey(a),h=z(f)?a:o-a,l=h^await G("BIP0340/aux",c),d=S(await G("BIP0340/nonce",p(l),f.toRawX(),s),o);if(0n===d)throw new Error("Creation of signature failed. k is zero");const y=u.fromPrivateKey(d),w=z(y)?d:o-d,g=await U(y.x,f,s),x=new K(y.x,S(w+g*h,o));if(!await Z(x.toRawBytes(),s,f.toRawX()))throw new Error("Invalid signature produced");return"string"==typeof t?x.toHex():x.toRawBytes()},verify:Z},u.BASE._setWindowSize(8),n.utils={isValidPrivateKey:t=>P(H(t)),randomPrivateKey:(t=32)=>{if("object"==typeof window&&"crypto"in window)return window.crypto.getRandomValues(new Uint8Array(t));if("object"==typeof process&&"node"in process.versions){const{randomBytes:n}=e(906);return new Uint8Array(n(t).buffer)}throw new Error("The environment doesn't have randomBytes function")},sha256:async t=>{if("object"==typeof window&&"crypto"in window){const n=await window.crypto.subtle.digest("SHA-256",t.buffer);return new Uint8Array(n)}if("object"==typeof process&&"node"in process.versions){const{createHash:n}=e(906);return Uint8Array.from(n("sha256").update(t).digest())}throw new Error("The environment doesn't have sha256 function")},hmacSha256:async(t,...n)=>{if("object"==typeof window&&"crypto"in window){const e=await window.crypto.subtle.importKey("raw",t,{name:"HMAC",hash:{name:"SHA-256"}},!1,["sign"]),r=l(...n),i=await window.crypto.subtle.sign("HMAC",e,r);return new Uint8Array(i)}if("object"==typeof process&&"node"in process.versions){const{createHmac:r,randomBytes:i}=e(906),o=r("sha256",t);for(let t of n)o.update(t);return Uint8Array.from(o.digest())}throw new Error("The environment doesn't have hmac-sha256 function")},precompute(t=8,n=u.BASE){const e=n===u.BASE?n:new u(n.x,n.y);return e._setWindowSize(t),e.multiply(3n),e}}},906:()=>{}},n={};function e(r){if(n[r])return n[r].exports;var i=n[r]={exports:{}};return t[r].call(i.exports,i,i.exports,e),i.exports}return e.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(t){if("object"==typeof window)return window}}(),e(905)})()}));
//# sourceMappingURL=jpake.js.map