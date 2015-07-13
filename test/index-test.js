console.log('\033c');

var expect = require('expect.js');
var bitwise = require('../');

describe('binary conversion', function () {
	describe('convert from strings', function () {
		it('without special characters', function () {
			expect(bitwise.toBits('1001')).to.eql([1,0,0,1]);
		});
		it('with special characters', function () {
			expect(bitwise.toBits('10$" -_,.\\/=01')).to.eql([1,0,0,1]);
		});
		it('with long strings', function () {
			expect(bitwise.toBits('1010 0011 0001 0000 1011 0000 0100 1101 1111 0000 1101 1001 0000 0100 1110 0001 1110 0001 0010 0100')).to.eql([1,0,1,0,0,0,1,1,0,0,0,1,0,0,0,0,1,0,1,1,0,0,0,0,0,1,0,0,1,1,0,1,1,1,1,1,0,0,0,0,1,1,0,1,1,0,0,1,0,0,0,0,0,1,0,0,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,1,0,0,1,0,0,1,0,0]);
		});
	});
	describe('convert from bits', function () {
		it('without spacing', function () {
			expect(bitwise.toString([1,0,1,0,1,0,1,0,1,0,1,0])).to.be('101010101010');
		});
		it('with spacing', function () {
			expect(bitwise.toString([1,0,1,0,0,0,1,1,0,0,0,1,0,0,0,0,1,0,1,1,0,0,0,0,0,1,0,0,1,1,0,1,1,1,1,1,0,0,0,0,1,1,0,1,1,0,0,1,0,0,0,0,0,1,0,0,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,1,0,0,1,0,0,1,0,0], 4)).to.eql('1010 0011 0001 0000 1011 0000 0100 1101 1111 0000 1101 1001 0000 0100 1110 0001 1110 0001 0010 0100');
		});
	});
});

describe('bitwise operations', function () {
	function createBits () {
		return bitwise.toBits('1000 1101');
	}
	function createOtherBits () {
		return bitwise.toBits('0110 0100');
	}
	it('NOT', function () {
		var bits = createBits();
		var expected = bitwise.toBits('0111 0010');
		expect(bitwise.not(bits)).to.eql(expected);
	});
	it('AND', function () {
		var bits = createBits();
		var otherBits = createOtherBits();
		var expected = bitwise.toBits('0000 0100');
		expect(bitwise.and(bits, otherBits)).to.eql(expected);
	});
	it('OR', function () {
		var bits = createBits();
		var otherBits = createOtherBits();
		var expected = bitwise.toBits('1110 1101');
		expect(bitwise.or(bits, otherBits)).to.eql(expected);
	});
	it('XOR', function () {
		var bits = createBits();
		var otherBits = createOtherBits();
		var expected = bitwise.toBits('1110 1001');
		expect(bitwise.xor(bits, otherBits)).to.eql(expected);
	});
	it('NOR', function () {
		var bits = createBits();
		var otherBits = createOtherBits();
		var expected = bitwise.toBits('0001 0010');
		expect(bitwise.nor(bits, otherBits)).to.eql(expected);
	});
	it('XNOR', function () {
		var bits = createBits();
		var otherBits = createOtherBits();
		var expected = bitwise.toBits('0001 0110');
		expect(bitwise.xnor(bits, otherBits)).to.eql(expected);
	});
	it('NAND', function () {
		var bits = createBits();
		var otherBits = createOtherBits();
		var expected = bitwise.toBits('1111 1011');
		expect(bitwise.nand(bits, otherBits)).to.eql(expected);
	});
});

describe('byte manipulation', function () {
	describe('write data', function () {
		it('write data', function () {
			expect(bitwise.writeByte([1,1,1,0,0,0,0,1])).to.be(0xE1);
			expect(bitwise.writeByte([0,0,1,0,1,0,1,0])).to.be(0x2A);
			expect(bitwise.writeByte([1,1,1,1,1,1,1,1])).to.be(0xFF);
			expect(bitwise.writeByte([0,0,0,0,0,0,0,0])).to.be(0x00);
		});
		it('return false when the array is invalid', function () {
			expect(bitwise.writeByte([1,0,1,0])).to.not.be.ok();
			expect(bitwise.writeByte([1,0,1,0,1,0,1,0,1])).to.not.be.ok();
			expect(bitwise.writeByte([])).to.not.be.ok();
			expect(bitwise.writeByte('10101010')).to.not.be.ok();
		});
	});
	describe('read data', function () {
		it('read data', function () {
			expect(bitwise.readByte(0xE1)).to.eql([1,1,1,0,0,0,0,1]);
			expect(bitwise.readByte(0x2A)).to.eql([0,0,1,0,1,0,1,0]);
			expect(bitwise.readByte(0xFF)).to.eql([1,1,1,1,1,1,1,1]);
			expect(bitwise.readByte(0x00)).to.eql([0,0,0,0,0,0,0,0]);
		});
		it('return false when the array is invalid', function () {
			expect(bitwise.readByte()).to.not.be.ok();
			expect(bitwise.readByte(256)).to.not.be.ok();
			expect(bitwise.readByte(-1)).to.not.be.ok();
			expect(bitwise.readByte(0.01)).to.not.be.ok();
			expect(bitwise.readByte([0,1,0,1,0,1,0,1])).to.not.be.ok();
			expect(bitwise.readByte('FF')).to.not.be.ok();
		});
	});
});

describe('number conversion', function () {
	function createTestBuffer () {
		return bitwise.createBuffer(bitwise.toBits('11110110 11111110 10000110 11001000'));
	}
	describe('unsigned integer', function () {
		it('2-7 bit', function () {
			var buffer = createTestBuffer();
			var tests = [
				{length: 2, offset: 6, expected: 2},
				{length: 3, offset: 5, expected: 6},
				{length: 4, offset: 4, expected: 6},
				{length: 5, offset: 3, expected: 22},
				{length: 6, offset: 2, expected: 54},
				{length: 7, offset: 1, expected: 118},
				{length: 5, offset: 4, expected: 13}
			];
			tests.forEach(function (test) {
				var number = bitwise.readUInt(buffer, test.offset, test.length);
				expect(number).to.be(test.expected);
			});
		});
		it('8-15 bit', function () {
			var buffer = createTestBuffer();
			var tests = [
				{length: null, offset: 0, expected: 246},
				{length: 8, offset: 0, expected: 246},
				{length: 9, offset: 7, expected: 254},
				{length: 10, offset: 6, expected: 766},
				{length: 11, offset: 5, expected: 1790},
				{length: 12, offset: 4, expected: 1790},
				{length: 13, offset: 3, expected: 5886},
				{length: 14, offset: 2, expected: 14078},
				{length: 15, offset: 1, expected: 30462},
				{length: 13, offset: 13, expected: 6683}
			];
			tests.forEach(function (test) {
				var number = bitwise.readUInt(buffer, test.offset, test.length);
				expect(number).to.be(test.expected);
			});
		});
		it('16-23 bit', function () {
			var buffer = createTestBuffer();
			var tests = [
				{length: 16, offset: 0, expected: 63230},
				{length: 17, offset: 7, expected: 65158},
				{length: 18, offset: 6, expected: 196230},
				{length: 19, offset: 5, expected: 458374},
				{length: 20, offset: 4, expected: 458374},
				{length: 21, offset: 3, expected: 1506950},
				{length: 22, offset: 2, expected: 3604102},
				{length: 23, offset: 1, expected: 7798406},
				{length: 21, offset: 9, expected: 2073010}
			];
			tests.forEach(function (test) {
				var number = bitwise.readUInt(buffer, test.offset, test.length);
				expect(number).to.be(test.expected);
			});
		});
		it('24-31 bit', function () {
			var buffer = createTestBuffer();
			var tests = [
				{length: 24, offset: 0, expected: 16187014},
				{length: 25, offset: 7, expected: 16680648},
				{length: 26, offset: 6, expected: 50235080},
				{length: 27, offset: 5, expected: 117343944},
				{length: 28, offset: 4, expected: 117343944},
				{length: 29, offset: 3, expected: 385779400},
				{length: 30, offset: 2, expected: 922650312},
				{length: 31, offset: 1, expected: 1996392136},
				{length: 29, offset: 1, expected: 499098034}
			];
			tests.forEach(function (test) {
				var number = bitwise.readUInt(buffer, test.offset, test.length);
				expect(number).to.be(test.expected);
			});
		});
		it('32 bit', function () {
			var buffer = createTestBuffer();
			var number = bitwise.readUInt(buffer, 0, 32);
			expect(number).to.be(4143875784);
		});
	});
	describe('signed integer', function () {
		it('2-7 bit', function () {
			var buffer = createTestBuffer();
			var tests = [
				{length: 2, offset: 6, expected: -2},
				{length: 3, offset: 5, expected: -2},
				{length: 4, offset: 4, expected: 6},
				{length: 5, offset: 3, expected: -10},
				{length: 6, offset: 2, expected: -10},
				{length: 7, offset: 1, expected: -10}
			];
			tests.forEach(function (test) {
				var number = bitwise.readInt(buffer, test.offset, test.length);
				expect(number).to.be(test.expected);
			});
		});
		it('8-15 bit', function () {
			var buffer = createTestBuffer();
			var tests = [
				{length: null, offset: 0, expected: -10},
				{length: 8, offset: 0, expected: -10},
				{length: 9, offset: 7, expected: 254},
				{length: 10, offset: 6, expected: -258},
				{length: 11, offset: 5, expected: -258},
				{length: 12, offset: 4, expected: 1790},
				{length: 13, offset: 3, expected: -2306},
				{length: 14, offset: 2, expected: -2306},
				{length: 15, offset: 1, expected: -2306}
			];
			tests.forEach(function (test) {
				var number = bitwise.readInt(buffer, test.offset, test.length);
				expect(number).to.be(test.expected);
			});
		});
		it('16-23 bit', function () {
			var buffer = createTestBuffer();
			var tests = [
				{length: 16, offset: 0, expected: -2306},
				{length: 17, offset: 7, expected: 65158},
				{length: 18, offset: 6, expected: -65914},
				{length: 19, offset: 5, expected: -65914},
				{length: 20, offset: 4, expected: 458374},
				{length: 21, offset: 3, expected: -590202},
				{length: 22, offset: 2, expected: -590202},
				{length: 23, offset: 1, expected: -590202}
			];
			tests.forEach(function (test) {
				var number = bitwise.readInt(buffer, test.offset, test.length);
				expect(number).to.be(test.expected);
			});
		});
		it('24-31 bit', function () {
			var buffer = createTestBuffer();
			var tests = [
				{length: 24, offset: 0, expected: -590202},
				{length: 25, offset: 7, expected: 16680648},
				{length: 26, offset: 6, expected: -16873784},
				{length: 27, offset: 5, expected: -16873784},
				{length: 28, offset: 4, expected: 117343944},
				{length: 29, offset: 3, expected: -151091512},
				{length: 30, offset: 2, expected: -151091512},
				{length: 31, offset: 1, expected: -151091512}
			];
			tests.forEach(function (test) {
				var number = bitwise.readInt(buffer, test.offset, test.length);
				expect(number).to.be(test.expected);
			});
		});
		it('32 bit', function () {
			var buffer = createTestBuffer();
			var number = bitwise.readInt(buffer, 0, 32);
			expect(number).to.be(-151091512);
		});
	});
	describe('complementary integer', function () {
		it('2-7 bit', function () {
			var buffer = createTestBuffer();
			var tests = [
				{length: 2, offset: 6, expected: -2},
				{length: 3, offset: 5, expected: -6},
				{length: 4, offset: 4, expected: -6},
				{length: 5, offset: 3, expected: -22},
				{length: 6, offset: 2, expected: -54},
				{length: 7, offset: 1, expected: -118},
				{length: 5, offset: 4, expected: -13}
			];
			tests.forEach(function (test) {
				var number = bitwise.readCInt(buffer, test.offset, test.length);
				expect(number).to.be(test.expected);
			});
		});
		it('8-15 bit', function () {
			var buffer = createTestBuffer();
			var tests = [
				{length: 8, offset: 0, expected: -246},
				{length: 9, offset: 7, expected: -254},
				{length: 10, offset: 6, expected: -766},
				{length: 11, offset: 5, expected: -1790},
				{length: 12, offset: 4, expected: -1790},
				{length: 13, offset: 3, expected: -5886},
				{length: 14, offset: 2, expected: -14078},
				{length: 15, offset: 1, expected: -30462},
				{length: 13, offset: 13, expected: -6683}
			];
			tests.forEach(function (test) {
				var number = bitwise.readCInt(buffer, test.offset, test.length);
				expect(number).to.be(test.expected);
			});
		});
		it('16-23 bit', function () {
			var buffer = createTestBuffer();
			var tests = [
				{length: 16, offset: 0, expected: -63230},
				{length: 17, offset: 7, expected: -65158},
				{length: 18, offset: 6, expected: -196230},
				{length: 19, offset: 5, expected: -458374},
				{length: 20, offset: 4, expected: -458374},
				{length: 21, offset: 3, expected: -1506950},
				{length: 22, offset: 2, expected: -3604102},
				{length: 23, offset: 1, expected: -7798406},
				{length: 21, offset: 9, expected: -2073010}
			];
			tests.forEach(function (test) {
				var number = bitwise.readCInt(buffer, test.offset, test.length);
				expect(number).to.be(test.expected);
			});
		});
		it('24-31 bit', function () {
			var buffer = createTestBuffer();
			var tests = [
				{length: 24, offset: 0, expected: -16187014},
				{length: 25, offset: 7, expected: -16680648},
				{length: 26, offset: 6, expected: -50235080},
				{length: 27, offset: 5, expected: -117343944},
				{length: 28, offset: 4, expected: -117343944},
				{length: 29, offset: 3, expected: -385779400},
				{length: 30, offset: 2, expected: -922650312},
				{length: 31, offset: 1, expected: -1996392136},
				{length: 29, offset: 1, expected: -499098034}
			];
			tests.forEach(function (test) {
				var number = bitwise.readCInt(buffer, test.offset, test.length);
				expect(number).to.be(test.expected);
			});
		});
		it('32 bit', function () {
			var buffer = createTestBuffer();
			var number = bitwise.readCInt(buffer, 0, 32);
			expect(number).to.be(-4143875784);
		});
	});
});

describe('buffer manipulation', function () {
	describe('read buffers', function () {
		it('without length and offset', function () {
			var buffer = new Buffer('AE37', 'hex');
			expect(bitwise.readBuffer(buffer).join()).to.be(bitwise.toBits('1010 1110 0011 0111').join());
		});
		it('without length, but offset', function () {
			var buffer = new Buffer('950225B12B44E2B4C4A6', 'hex');
			expect(bitwise.readBuffer(buffer, 64).join()).to.be(bitwise.toBits('1100 0100 1010 0110').join());
		});
		it('without length, but offset (odd start)', function () {
			var buffer = new Buffer('ED743E17', 'hex');
			expect(bitwise.readBuffer(buffer, 12).join()).to.be(bitwise.toBits('0100 0011 1110 0001 0111').join());
		});
		it('with offset and length', function () {
			var buffer = new Buffer('950225B12B44E2B4C4A6', 'hex');
			expect(bitwise.readBuffer(buffer, 32, 24).join()).to.be(bitwise.toBits('0010 1011 0100 0100 1110 0010').join());
		});
		it('with offset and length (odd end)', function () {
			var buffer = new Buffer('950225B12B44E2B4C4A6', 'hex');
			expect(bitwise.readBuffer(buffer, 32, 30).join()).to.be(bitwise.toBits('0010 1011 0100 0100 1110 0010 1011 01').join());
		});
		it('with offset and length (odd start and end)', function () {
			var buffer = new Buffer('950225B12B44E2B4C4A6', 'hex');
			expect(bitwise.readBuffer(buffer, 34, 28).join()).to.be(bitwise.toBits('1010 1101 0001 0011 1000 1010 1101').join());
		});
	});

	describe('modify buffers', function () {
		it('with one bit of data', function () {
			var buffer = new Buffer(1);
			buffer.fill(0x00);

			bitwise.modifyBuffer(buffer, bitwise.toBits('1'));

			expect(bitwise.readBuffer(buffer).join()).to.be(bitwise.toBits('1000 0000').join());
		});
		it('without offset', function () {
			var buffer = new Buffer('FBA8', 'hex');

			bitwise.modifyBuffer(buffer, bitwise.toBits('01010'));

			expect(bitwise.readBuffer(buffer).join()).to.be(bitwise.toBits('0101 0011 1010 1000').join());
		});
		it('with offset', function () {
			var buffer = new Buffer('A43A', 'hex');

			bitwise.modifyBuffer(buffer, bitwise.toBits('01001001'), 3);

			expect(bitwise.readBuffer(buffer).join()).to.be(bitwise.toBits('1010 1001 0011 1010').join());
		});
		it('with one byte offset', function () {
			var buffer = new Buffer('AC14E974', 'hex');

			bitwise.modifyBuffer(buffer, bitwise.toBits('01001001'), 8);

			expect(bitwise.readBuffer(buffer).join()).to.be(bitwise.toBits('1010 1100 0100 1001 1110 1001 0111 0100').join());
		});
	});

	describe('create buffers', function () {
		it('with less than one byte', function () {
			var buffer = bitwise.createBuffer(bitwise.toBits('10011'));
			expect(bitwise.readBuffer(buffer).join()).to.be(bitwise.toBits('1001 1000').join());
		});
		it('with one byte', function () {
			var buffer = bitwise.createBuffer(bitwise.toBits('0111 1100'));
			expect(bitwise.readBuffer(buffer).join()).to.be(bitwise.toBits('0111 1100').join());
		});
		it('with more than one byte', function () {
			var buffer = bitwise.createBuffer(bitwise.toBits('1111 0001 1010'));
			expect(bitwise.readBuffer(buffer).join()).to.be(bitwise.toBits('1111 0001 1010 0000').join());
		});
		it('with multiple bytes', function () {
			var buffer = bitwise.createBuffer(bitwise.toBits('10101101 11100101 01100011'));
			expect(bitwise.readBuffer(buffer).join()).to.be(bitwise.toBits('10101101 11100101 01100011').join());
		});
	});
});
