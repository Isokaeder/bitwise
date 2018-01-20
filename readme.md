<h1 align="center">bitwise</h2>

<p align="center">
	JavaScript library to manipulate bits, nibbles, bytes, and buffers.
</p>

<p align="center">
	<a href="https://travis-ci.org/dodekeract/bitwise/"><img src="https://travis-ci.org/dodekeract/bitwise.svg?branch=master"/></a>
	<a href="https://coveralls.io/github/dodekeract/bitwise?branch=master"><img src="https://coveralls.io/repos/dodekeract/bitwise/badge.svg?branch=master&service=github"/></a>
	<a href="https://inch-ci.org/github/dodekeract/bitwise"><img src="https://inch-ci.org/github/dodekeract/bitwise.svg"/></a>
	<a href="https://codeclimate.com/github/dodekeract/bitwise/maintainability"><img src="https://api.codeclimate.com/v1/badges/5828648788cdc3b806ac/maintainability"/></a>
</p>

<p align="center">
	<a href="https://slack.dodekeract.com"><img src="https://slack.dodekeract.com/badge.svg"/></a>
	<a href="https://npmjs.com/package/bitwise"><img src="https://img.shields.io/npm/dm/bitwise.svg"/></a>
	<a href="https://npmjs.com/package/bitwise"><img src="https://david-dm.org/dodekeract/bitwise.svg"/></a>
</p>

## Example

```js
import bitwise from 'bitwise'

const bits = bitwise.byte.read(42)
// [0, 0, 1, 0, 1, 0, 1, 0]

bitwise.bits.toString(bits, 4)
// '0010 1010'

bitwise.byte.write(bits)
// 42

bitwise.bits.xor([0, 0, 1, 1], [0, 1, 0, 1])
// [0, 0, 0, 1]

bitwise.bits.xor([0, 0, 1, 1], [0, 1, 0, 1])
// [0, 1, 1, 0]

// cherry-pick parts of bitwise
import byte from 'bitwise/byte'
byte.read(42)
// [0, 0, 1, 0, 1, 0, 1, 0]
```

## Installation

<pre>
<a href="https://yarnpkg.com">yarn</a> add <a href="https://yarnpkg.com/package/bitwise">bitwise</a>
</pre>
or
<pre>
<a href="https://npmjs.com">npm</a> i <a href="https://npmjs.com/package/bitwise">bitwise</a>
</pre>

## Table of Contents

* bits
	* operations
		* and
		* nand
		* nor
		* not
		* or
		* xnor
		* xor
	* toString
* buffer
	* operations
		* and
		* nand
		* nor
		* not
		* or
		* xnor
		* xor
	* create
	* modify
	* read
	* readCInt
	* readUInt
	* readInt
* byte
	* read
	* write
* nibble
	* read
	* write
* string
	* toBits

## byte

```js
// cherry-pick
import byte from 'bitwise/byte'
```

### byte.read (Int byte)

Returns an Array of length 8 containing the read bits.

```js
bitwise.byte.read(42)
// [0,0,1,0,1,0,1,0]
bitwise.byte.read(256)
// RangeError('invalid size')
```

### write (Int byte)

Returns a Byte (0-255) which equals the given bits.

```js
import byte from 'bitwise/byte'
byte.write([0,0,1,0,1,0,1,0])
// 42
byte.read([0,0,1,0,1,0,1,0, 0])
// RangeError('invalid array length')
```

## buffer

```js
// cherry-pick
import buffer from 'bitwise/buffer'
```

### read (Buffer buffer, [Int bitOffset], [Int bitLength])

Returns an Array containing `bitLength` bits starting at `bitOffset`.

```js
const buffer = new Buffer('ED743E17', 'hex')
bitwise.buffer.read(buffer, 12)
// [0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 1, 1, 1]
```

### modify (Buffer buffer, Array newBits, [Int bitOffset])

Modifies the buffer's bits to equal `newBits` starting at `bitOffset`.

```js
const buffer = new Buffer('A43A', 'hex');
bitwise.modifyBuffer(buffer, [0, 0, 0, 1, 0, 0, 1], 3);
// Buffer(1010 1001 0011 1010)
```

### create (Array bits)

Creates a new buffer and writes the given bits.

```js
const buffer = bitwise.create([1,1,1,1, 0,0,0,1, 1,0,1,0]);
// Buffer(1111 0001 1010 0000)
```

### readUInt (Buffer buffer, Int bitOffset = 0, Int bitLength = 8)

Converts a section of a buffer to an unsigned integer.

```js
// buffer 11110110
bitwise.buffer.readUInt(buffer, 3, 5)
// 22
```

### readInt (Buffer buffer, Int bitOffset = 0, Int bitLength = 8)

Converts a section of a buffer to a signed integer.

```js
// buffer 11110110
bitwise.buffer.readUInt(buffer, 3, 5)
// -10
```

### readCInt (Buffer buffer, Int bitOffset = 0, Int bitLength = 8)

Converts a section of a buffer to a complementary integer.
A complementary integer is like an unsigned integer, but always represents negative numbers.

```js
// buffer 11110110
bitwise.buffer.readUInt(buffer, 3, 5)
// -22
```

### Buffer Operations

NOT, OR, NOR, XOR, XNOR, AND, NAND

Proper documentation will (probably) follow later, if you need to know more now, just look into the [unit test files](https://github.com/dodekeract/bitwise/blob/master/source/buffer/operations.test.js).

```js
const isLooping = true; // -> if first buffer is "empty", it will be read again from its start
const resultBuffer = bitwise.buffer.xor(bufferA, bufferB, isLooping);
```

## string

```js
// cherry-pick
import string from 'bitwise/string'
```

### string.toBits (String string)

Converts a string into an array of bits. Ignores all characters except `1` and `0`.

```js
bitwise.string.toBits('10 10 12$%_.0')
// [1, 0, 1, 0, 1, 0]
```

## bits

### bits.toString (Array bits, [Int spacing], [String spacer])

Converts a bit `Array` to a `String`. If defined, inserts `spacer` every `spacing` characters, but never inserts it as the last substring.

```js
bitwise.toString([1,0,1,0,1,0], 2, '_')
// '10_10_10'
```

### bits.not (Array bits)

Flips all given bits and returns the flipped bits.

```js
bitwise.not([1,0,1,1,0,1])
// [0,1,0,0,1,0]
```

### bits.and (Array bits1, Array bits2)

Applies the AND operation, expects two arrays of the same size and returns a new one.

```js
bitwise.and([1,0,0,0,1,1,0,1], [0,1,1,0,0,1,0,0])
// [0,0,0,0,0,1,0,0]
```

### bits.or (Array bits1, Array bits2)

Applies the OR operation, expects two arrays of the same size and returns a new one.

```js
bitwise.or([1,0,0,0,1,1,0,1], [0,1,1,0,0,1,0,0])
// [1,1,1,0,1,1,0,1]
```

### bits.xor (Array bits1, Array bits2)

Applies the exclusive or operation, expects two arrays of the same size and returns a new one.

```js
bitwise.xor([1,0,0,0,1,1,0,1], [0,1,1,0,0,1,0,0])
// [1,1,1,0,1,0,0,1]
```

### bits.nor (Array bits1, Array bits2)

Applies the NOR operation, expects two arrays of the same size and returns a new one.

```js
bitwise.nor([1,0,0,0,1,1,0,1], [0,1,1,0,0,1,0,0])
// [1,1,1,0,1,0,0,1]
```

### bits.xnor (Array bits1, Array bits2)

Applies the exclusive NOR operation, expects two arrays of the same size and returns a new one.

```js
bitwise.xnor([1,0,0,0,1,1,0,1], [0,1,1,0,0,1,0,0])
// [1,1,1,0,1,0,0,1]
```

### bits.nand (Array bits1, Array bits2)

Applies the NAND operation, expects two arrays of the same size and returns a new one.

```js
bitwise.nand([1,0,0,0,1,1,0,1], [0,1,1,0,0,1,0,0])
// [1,1,1,0,1,0,0,1]
```

## History

### 0.2.0
- Added buffer bitwise operations

### 0.1.2
- Added nor, xnor, nand
- Fixed bitwise operations modifying original array

### 0.1.0
- **Re-ordered the arguments** in readInt, readCInt, readUInt
- Added not, and, or, xor
- Renamed flipBits to not
