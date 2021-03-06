/*
 * loquat-char test / char.letter
 */

"use strict";

const chai = require("chai");
const expect = chai.expect;

const show             = _core.show;
const SourcePos        = _core.SourcePos;
const ErrorMessageType = _core.ErrorMessageType;
const ErrorMessage     = _core.ErrorMessage;
const ParseError       = _core.ParseError;
const Config           = _core.Config;
const State            = _core.State;
const Result           = _core.Result;
const assertParser     = _core.assertParser;

const letter = _char.letter;

describe(".letter", () => {
    it("should return a parser that parses a letter", () => {
        assertParser(letter);
        // match
        for (const c of "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz") {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                c + "012",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = letter.run(initState);
            expect(Result.equal(
                res,
                Result.csuc(
                    ParseError.unknown(new SourcePos("foobar", 1, 2)),
                    c,
                    new State(
                        initState.config,
                        "012",
                        new SourcePos("foobar", 1, 2),
                        "none"
                    )
                )
            )).to.be.true;
        }
        // not match
        {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                "012",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = letter.run(initState);
            expect(Result.equal(
                res,
                Result.eerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 1),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, show("0")),
                            new ErrorMessage(ErrorMessageType.EXPECT, "letter")
                        ]
                    )
                )
            )).to.be.true;
        }
        // empty input
        {
            const initState = new State(
                new Config({ tabWidth: 8 }),
                "",
                new SourcePos("foobar", 1, 1),
                "none"
            );
            const res = letter.run(initState);
            expect(Result.equal(
                res,
                Result.eerr(
                    new ParseError(
                        new SourcePos("foobar", 1, 1),
                        [
                            new ErrorMessage(ErrorMessageType.SYSTEM_UNEXPECT, ""),
                            new ErrorMessage(ErrorMessageType.EXPECT, "letter")
                        ]
                    )
                )
            )).to.be.true;
        }
    });
});
