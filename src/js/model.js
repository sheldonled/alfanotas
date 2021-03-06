module.exports   = function (name, n1, n2, n3, n4) {
  const dao      = require('./dao')();
  const toNumber = n => Number(n) || 0;
  const messages = require('./messages.js')('pt_br');
  /**
   * I've used this because when I was testing 
   * assert.equal(7.6, new Subject("Math",5,9,8.8).getAvgMarks());
   * I've got 7.6000000000000005 instead of 7.6
   */
  const round = n => Number(Math.round(n + 'e2') + 'e-2');
  /******************************* Functions that get Average Marks ***********************************************/
  const getAvgN2 = (n1, n2) => round((toNumber(n1) + toNumber(n2)) / 2);

  const getAvgN3 = (n1, n2, n3) => round((toNumber(n1) + toNumber(n2) + toNumber(n3)) / 3);

  const getAvgN4 = (n1, n2, n3, n4) => round((getAvgN3(n1, n2, n3) + toNumber(n4)) / 2);


  /*************************** Functions that handle marks needed depending on what Marks they have ***************/
  const handleSubjectInN1 = (n1) => {
    if(n1+10 >= 16)
      return {n2:round(16-n1)};
    else{
      return handleSubjectInN2(n1,10,{n2:10});
    }
  };
  const handleSubjectInN2 = (n1, n2,tmp = {}) => {
    if (isApproved(n1, n2))
      return { msg: messages.approved };
    if (n1+n2 < 6)
      return { msg: messages.reproved };

    let sumN2 = round(n1 + n2);
    if (sumN2 + 10 >= 18) {
      tmp.n3 = round(18 - sumN2);//apparently 18 - 15.1 == 2.9000000000000004
      tmp.msg = messages.needsN3;
    } else {
      tmp.n3 = 10;
      let tmp2 = handleSubjectInN3(n1, n2, tmp.n3);
      tmp.n4 = tmp2.n4;
      tmp.msg = tmp2.msg;
    }
    return tmp;

  };
  const handleSubjectInN3 = (n1, n2, n3) => {
    const avgN3 = getAvgN3(n1, n2, n3);
    if (isApproved(n1, n2, n3))
      return { msg: messages.approved };
    else if (avgN3 - 12 > 0)
      return { msg: messages.reproved };
    else
      return { n4: round(12 - avgN3), msg: messages.needsN4 };
  };
  const handleSubjectInN4 = (n1, n2, n3, n4) => {
    const message = (isApproved(n1, n2, n3, n4) ? messages.approved : messages.reproved);
    return { msg: message };
  };

  /******************************* Public Functions ***************************************************************/
  const isApproved = (n1, n2, n3, n4) => {
    if (toNumber(n1) + toNumber(n2) <= 6)
      return false;
    if (getAvgN2(n1, n2) >= 8)
      return true;
    else if (getAvgN3(n1, n2, n3) >= 6)
      return true;
    else if (getAvgN4(n1, n2, n3, n4) >= 6)
      return true;
    else
      return false;
  };
  const getAvgMarks = (n1, n2, n3, n4) => {
    switch (true) {
      case !(!n4):
        return getAvgN4(n1, n2, n3, n4);
      case !(!n3):
        return getAvgN3(n1, n2, n3);
      default:
        return getAvgN2(n1, n2);
    }
  };
  const simplify = (name,marks) => {
    return {
      name : name,
      n1 : marks.n1,
      n2 : marks.n2,
      n3 : marks.n3,
      n4 : marks.n4
    };
  };
  /******************************* Returned Object ****************************************************************/
  return {
    name: name,
    marks: { n1, n2, n3, n4 },
    isApproved: function () {
      return isApproved(this.marks.n1, this.marks.n2, this.marks.n3, this.marks.n4);
    },
    getAvgMarks: function () {
      return getAvgMarks(this.marks.n1, this.marks.n2, this.marks.n3, this.marks.n4);
    },
    projectMarksNeeded: function () {
      switch (true) {
        case !(!this.marks.n4):
          return handleSubjectInN4(this.marks.n1, this.marks.n2, this.marks.n3, this.marks.n4);
        case !(!this.marks.n3):
          return handleSubjectInN3(this.marks.n1, this.marks.n2, this.marks.n3);
        case !(!this.marks.n2):
          return handleSubjectInN2(this.marks.n1, this.marks.n2);
        case !(!this.marks.n1):
          return handleSubjectInN1(this.marks.n1);
        default:
          return {};
      }
    },
    getAllSubjects : function(){
      return dao.getSubjects();
    },
    saveAllSubjects : function(subjs){
      return dao.saveSubjects(subjs);
    },
    saveSubject : function(newSub){
      let done = false,
          subjs = dao.getSubjects();
      Object.keys(newSub).map(function(key,index){
        if (["n1", "n2", "n3", "n4"].indexOf(key) >= 0 && newSub[key] !== undefined && newSub[key] !== null) {
          newSub[key] = newSub[key].toString().replace(/,/g, ".");
          newSub[key] = (isNaN(newSub[key]) ? null : Number(newSub[key]));
          if(newSub[key] > 10)
            newSub[key] = null;
        }
      });
      subjs = subjs.map(s => {
        if(s.name == newSub.name) {
          done = true;
          s.n1 = newSub.n1;
          s.n2 = newSub.n2;
          s.n3 = newSub.n3;
          s.n4 = newSub.n4;
        }
        return s;
      });
      if(!done)
        subjs.push(newSub);
      return dao.saveSubjects(subjs);
    },
    save : function(){
      let subjs = dao.getSubjects();
      self = this;
      if(subjs.filter(a=>a.name === self.name).length > 0)
        return {err: messages.compose("subjAlreadyExists",self.name)};
      
      subjs.push(simplify(this.name,this.marks));
      dao.saveSubjects(subjs);
      return {msg: messages.compose("subjAdded",self.name)};
    },
    delete: function(name) {
      let done = false,
          subjs = dao.getSubjects();
      subjs = subjs.filter(s => {
        if(s.name == name)
          done = true;
        else
          return true;
      });
      dao.saveSubjects(subjs);
      objReturn = {};
      if(done)
        objReturn.msg = messages.compose("subjDeleted",name);
      else
        objReturn.err = messages.compose("subjNotDeleted",name);
      return objReturn;
    }
  };
};