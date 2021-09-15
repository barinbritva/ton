import { BitString, Cell } from "..";
import { deserializeBoc, serializeToBoc } from "./boc";
const NativeCell = require('tonweb/src/boc/Cell').Cell;

const cases: string[] = [
    // Wallets
    'B5EE9C72410101010044000084FF0020DDA4F260810200D71820D70B1FED44D0D31FD3FFD15112BAF2A122F901541044F910F2A2F80001D31F3120D74A96D307D402FB00DED1A4C8CB1FCBFFC9ED5441FDF089',
    'B5EE9C724101010100530000A2FF0020DD2082014C97BA9730ED44D0D70B1FE0A4F260810200D71820D70B1FED44D0D31FD3FFD15112BAF2A122F901541044F910F2A2F80001D31F3120D74A96D307D402FB00DED1A4C8CB1FCBFFC9ED54D0E2786F',
    'B5EE9C7241010101005F0000BAFF0020DD2082014C97BA218201339CBAB19C71B0ED44D0D31FD70BFFE304E0A4F260810200D71820D70B1FED44D0D31FD3FFD15112BAF2A122F901541044F910F2A2F80001D31F3120D74A96D307D402FB00DED1A4C8CB1FCBFFC9ED54B5B86E42',
    'B5EE9C724101010100570000AAFF0020DD2082014C97BA9730ED44D0D70B1FE0A4F2608308D71820D31FD31F01F823BBF263ED44D0D31FD3FFD15131BAF2A103F901541042F910F2A2F800029320D74A96D307D402FB00E8D1A4C8CB1FCBFFC9ED54A1370BB6',
    'B5EE9C724101010100630000C2FF0020DD2082014C97BA218201339CBAB19C71B0ED44D0D31FD70BFFE304E0A4F2608308D71820D31FD31F01F823BBF263ED44D0D31FD3FFD15131BAF2A103F901541042F910F2A2F800029320D74A96D307D402FB00E8D1A4C8CB1FCBFFC9ED54044CD7A1',
    'B5EE9C724101010100620000C0FF0020DD2082014C97BA9730ED44D0D70B1FE0A4F2608308D71820D31FD31FD31FF82313BBF263ED44D0D31FD31FD3FFD15132BAF2A15144BAF2A204F901541055F910F2A3F8009320D74A96D307D402FB00E8D101A4C8CB1FCB1FCBFFC9ED543FBE6EE0',
    'B5EE9C724101010100710000DEFF0020DD2082014C97BA218201339CBAB19F71B0ED44D0D31FD31F31D70BFFE304E0A4F2608308D71820D31FD31FD31FF82313BBF263ED44D0D31FD31FD3FFD15132BAF2A15144BAF2A204F901541055F910F2A3F8009320D74A96D307D402FB00E8D101A4C8CB1FCB1FCBFFC9ED5410BD6DAD'
];

function expectBitStringEqual(src: BitString, src2: any) {
    expect(src.length).toBe(src2.length);
    expect(src.cursor).toBe(src2.cursor);
    for (let i = 0; i < src.length; i++) {
        expect(src.get(i)).toBe(src2.get(i));
    }
}

async function expectCellEqual(src: Cell, src2: any) {
    expect(src.isExotic).toBe(!!src2.isExotic);
    expectBitStringEqual(src.bits, src2.bits);
    expect(src.refs.length).toBe(src2.refs.length);
    for (let i = 0; i < src.refs.length; i++) {
        expectCellEqual(src.refs[i], src2.refs[i]);
    }
    expect(await src.hash()).toEqual(Buffer.from(await src2.hash()));
}

describe('boc', () => {
    for (let caseIndx = 0; caseIndx < cases.length; caseIndx++) {
        it('should deserialize boc #' + caseIndx, async () => {
            const testCase = cases[caseIndx];
            let cells = deserializeBoc(Buffer.from(testCase, 'hex'));
            let nativeCells = NativeCell.fromBoc(testCase);
            expect(cells.length).toBe(nativeCells.length);
            for (let i = 0; i < cells.length; i++) {
                await expectCellEqual(cells[i], nativeCells[i]);
            }

            // Serialize
            let serialized = (await serializeToBoc(cells[0], false));
            expect(serialized.toString('hex')).toBe(testCase.toLowerCase());
        });
    }
});