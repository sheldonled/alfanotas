const assert = require('assert'),
  Subject = require('../src/js/model'),
  messages = {
    approved: "Passou!",
    reproved: "Reprovado!",
    needsN3: "Volte para os livros, você vai para N3!",
    needsN4: "Não entre em pânico, mas você vai para N4!"
  };

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
    it("Returns an object saying that the studant has been approved", () => {
      //assert.equal({n2:8}, new Subject("Math",8).projectMarksNeeded());
      assert.equal({ msg: messages.approved },
        new Subject("Math", 8, 8).projectMarksNeeded());
      assert.equal({ msg: messages.approved },
        new Subject("Math", 5, 9, 8.8).projectMarksNeeded());
      assert.equal({ msg: messages.approved },
        new Subject("Math", 3, 6, 6, 7.8).projectMarksNeeded());
      assert.equal({ msg: messages.approved },
        new Subject("Math", null, 9, 9).projectMarksNeeded());
      assert.equal({ msg: messages.approved },
        new Subject("Math", 3.2, 6, 9).projectMarksNeeded());
    });
  });
  describe('projectMarksNeeded', function () {
    it("Returns an object containing the marks a student needs to pass, and a support message", () => {
      assert.equal({ n4: 7.83, msg: messages.needsN4 },
        new Subject("Math", 5.1, null, 7.42).projectMarksNeeded());
    });
  });
});
