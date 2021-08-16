import { expect } from 'chai';
import { id } from '../lib';

describe('index.id', () => {
    it('should exist', () => {
        expect(id).to.not.be.an('undefined');
    });
    it('should be a function', () => {
        expect(id).to.be.a('function');
    });
});

describe('index.id', () => {
    it('should return nothing', () => {
        expect(id()).to.equal(undefined);
    });
    it('should return a value', () => {
        expect(id(undefined)).to.equal(undefined);
        expect(id(null)).to.equal(null);
        expect(id(true)).to.equal(true);
    });
    it('should return an array', () => {
        const a = id(undefined, null);
        expect(a).to.be.an('array');
        expect(a).to.include.members([undefined, null]);
        const b = id(false, true);
        expect(b).to.be.an('array');
        expect(b).to.include.members([false, true]);
        const c = id(0, 1);
        expect(c).to.be.an('array');
        expect(c).to.include.members([0, 1]);
    });
});
