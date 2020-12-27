# JPAKE 

This library allows 2 parties to generate a mutual secret key using a weak key that is known to each other beforehand.
This provides a simple API over an implementation of Password Authenticated Key Exchange by Juggling (J-PAKE) based on elliptic curves (currently secp2561k). 

This protocol is derived from the [J-PAKE paper](https://eprint.iacr.org/2010/190.pdf) and [relevant RFC](https://tools.ietf.org/html/rfc8236).

Try it out [here](https://choonkiatlee.github.io/jpake-calculator/), see detailed implementation details with all the (simplified) gory math [here](https://choonkiatlee.github.io/jpake-implementation/) and a companion project in golang compatible with this library [here](https://github.com/choonkiatlee/jpake-go)

# Install
```npm install --save jpake```

# Quick Start
```html
<html>
<script src="https://cdn.jsdelivr.net/gh/choonkiatlee/jpake-js/dist/jpake.js"></script>
<!-- or use the ES6 import as: import {jpake} from 'jpake' -->

<script>
var secret = "Hello World!"

// Initialise a new JPake Object
var pakeA = new jpake.JPake(secret)
var pakeB = new jpake.JPake(secret)

// Generate the 1st message to kick off the PAKE Exchange
const msgA1 = pakeA.GetRound1Message()
const msgB1 = pakeB.GetRound1Message()

// Round 1 exchange
const msgA2 = pakeA.GetRound2Message(msgB1)
const msgB2 = pakeB.GetRound2Message(msgA1)

// Round 2 exchange. both A and B now have a secure shared key
const keyA = pakeA.ComputeSharedKey(msgB2)
const keyB = pakeB.ComputeSharedKey(msgA2)

console.log ("Exchange Complete!")
console.log (`\nAlice key: ${keyA}`)
console.log (`Bob key: ${keyB}`)
</script>
</html>
```

# Security and Implementation notes
This library uses native Javascript BigInts, which does not protect against timing attacks. Do not allow attackers to measure how long it takes you to create or respond to a message. We currently do not implement the final step of verifying the shared keys generated between Alice and Bob are the same. This step is optional as per the RFC specs, and we will work on adding it in the future.