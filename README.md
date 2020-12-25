# JPAKE 

This library allows 2 parties to generate a mutual secret key using a weak key that is known to each other beforehand.
This provides a simple API over an implementation of Password Authenticated Key Exchange by Juggling (J-PAKE) based on elliptic curves (currently secp2561k). 

This protocol is derived from the [J-PAKE paper](https://eprint.iacr.org/2010/190.pdf) and [relevant RFC](https://tools.ietf.org/html/rfc8236).

# Install
```npm install --save jpake```

# Quick Start
```javascript
import {jpake} from 'jpake'

var secret = "Hello World!"

// Initialise a new JPake Object
var pakeA = new jpake.JPake(secret)
var pakeB = new jpake.JPake(secret)

// Generate the 1st message to kick off the PAKE Exchange
const msgA1 = pakeA.startRound1()
const msgB1 = pakeB.startRound1()

// Round 1 exchange
const msgA2 = pakeA.computeRound1Results(msgB1)
const msgB2 = pakeB.computeRound1Results(msgA1)

// Round 2 exchange. both A and B now have a secure shared key
const keyA = pakeA.computeSharedKey(msgB2)
const keyB = pakeB.computeSharedKey(msgA2)

console.log ("Exchange Complete!")
console.log (`\nAlice key: ${keyA}`)
console.log (`Bob key: ${keyB}`)
```

# JPAKE theory

* Explanation to come

# Implementation Notes:

- This currently uses Javascript BigInts.