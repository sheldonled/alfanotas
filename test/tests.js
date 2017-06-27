const assert = require('chai').assert,
  expect     = require('chai').expect
  Subject    = require('../src/js/model'),
  messages   = require('../src/js/messages')('pt_br');;

describe('Subject Model', function () {
  describe('isApproved', function () {
    it('Check whether the student has been approved in a specific subject', () => {
      assert.equal(false, new Subject("Math").isApproved());
      assert.equal(false, new Subject("Math", 1, 2).isApproved());
      assert.equal(false, new Subject("Math", 1, 2, 3).isApproved());
      assert.equal(true, new Subject("Math", 8, 8, 3).isApproved());
    });
  });
  describe('getAvgMarks', function () {
    it("Returns the student's average marks", () => {
      assert.equal(4, new Subject("Math", 8).getAvgMarks());
      assert.equal(8, new Subject("Math", 8, 8).getAvgMarks());
      assert.equal(7.6, new Subject("Math", 5, 9, 8.8).getAvgMarks());
      assert.equal(4.17, new Subject("Math", 5.1, null, 7.42).getAvgMarks());
      assert.equal(6.4, new Subject("Math", 3, 6, 6, 7.8).getAvgMarks());
      assert.equal(6, new Subject("Math", null, 9, 9).getAvgMarks());
      assert.equal(6.07, new Subject("Math", 3.2, 6, 9).getAvgMarks());
    });
  });
  describe('projectMarksNeeded', function () {
    it("Returns an object containing the marks a student needs to pass, and a support message", () => {
      expect({ n4: 7.83, msg: messages.needsN4 }).to.deep.equal
        (new Subject("Math", 5.1, null, 7.42).projectMarksNeeded());
      expect({ msg: messages.approved }).to.deep.equal
        (new Subject("Math", 8, 8).projectMarksNeeded());
      expect({ msg: messages.approved }).to.deep.equal
        (new Subject("Math", 5, 9, 8.8).projectMarksNeeded());
      expect({ n4: 7, msg: messages.needsN4 }).to.deep.equal
        (new Subject("Math", 3, 6, 6).projectMarksNeeded());
      expect({ msg: messages.approved }).to.deep.equal
        (new Subject("Math", null, 9, 9).projectMarksNeeded());
      expect({ n3: 8.8, msg: messages.needsN3 }).to.deep.equal
        (new Subject("Math", 3.2, 6).projectMarksNeeded());
      expect({ msg: messages.reproved }).to.deep.equal
        (new Subject("Math", 3.2, 2).projectMarksNeeded());
      expect({ msg: messages.reproved }).to.deep.equal
        (new Subject("Math", 3.2, 5,3,4).projectMarksNeeded());
      expect({ n3:10, n4:6.6, msg: messages.needsN4 }).to.deep.equal
        (new Subject("Math", 3.2, 3).projectMarksNeeded());
      expect({ n3:6, msg: messages.needsN3 }).to.deep.equal
        (new Subject("Math", 9, 3).projectMarksNeeded());
      expect({ msg: messages.approved }).to.deep.equal
        (new Subject("Math", 4.75, 4.43, 8.82).projectMarksNeeded());
      expect({ n3:2.59, msg: messages.needsN3 }).to.deep.equal
        (new Subject("Math", 9.09, 6.32).projectMarksNeeded());
    });
  });
});
