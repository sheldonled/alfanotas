/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = function () {
  this.count = 0;
  this.getHtml = function (data) {
    var css = data.err ? "alert" : "success";
    var msg = data.err ? data.err : data.msg;
    return "<div class=\"callout " + css + " alfanotas-msg-" + this.count + "\">\n                <span class=\"close msg-" + this.count + "\">X</span>   \n                " + msg + "\n              </div>\n              ";
  };
  this.getDiv = function (data) {
    var alertDiv = document.createElement("div");
    alertDiv.innerHTML = this.getHtml(data);
    return alertDiv.firstChild;
  };
};


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = function (name, n1, n2, n3, n4) {
  var dao = __webpack_require__(3)();
  var toNumber = function toNumber(n) {
    return Number(n) || 0;
  };
  var messages = __webpack_require__(4)('pt_br');
  /**
   * I've used this because when I was testing 
   * assert.equal(7.6, new Subject("Math",5,9,8.8).getAvgMarks());
   * I've got 7.6000000000000005 instead of 7.6
   */
  var round = function round(n) {
    return Number(Math.round(n + 'e2') + 'e-2');
  };
  /******************************* Functions that get Average Marks ***********************************************/
  var getAvgN2 = function getAvgN2(n1, n2) {
    return round((toNumber(n1) + toNumber(n2)) / 2);
  };

  var getAvgN3 = function getAvgN3(n1, n2, n3) {
    return round((toNumber(n1) + toNumber(n2) + toNumber(n3)) / 3);
  };

  var getAvgN4 = function getAvgN4(n1, n2, n3, n4) {
    return round((getAvgN3(n1, n2, n3) + toNumber(n4)) / 2);
  };

  /*************************** Functions that handle marks needed depending on what Marks they have ***************/
  var handleSubjectInN1 = function handleSubjectInN1(n1) {
    if (n1 + 10 >= 16) return { n2: round(16 - n1) };else {
      return handleSubjectInN2(n1, 10, { n2: 10 });
    }
  };
  var handleSubjectInN2 = function handleSubjectInN2(n1, n2) {
    var tmp = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    if (_isApproved(n1, n2)) return { msg: messages.approved };
    if (n1 + n2 < 6) return { msg: messages.reproved };

    var sumN2 = round(n1 + n2);
    if (sumN2 + 10 >= 18) {
      tmp.n3 = round(18 - sumN2); //apparently 18 - 15.1 == 2.9000000000000004
      tmp.msg = messages.needsN3;
    } else {
      tmp.n3 = 10;
      var tmp2 = handleSubjectInN3(n1, n2, tmp.n3);
      tmp.n4 = tmp2.n4;
      tmp.msg = tmp2.msg;
    }
    return tmp;
  };
  var handleSubjectInN3 = function handleSubjectInN3(n1, n2, n3) {
    var avgN3 = getAvgN3(n1, n2, n3);
    if (_isApproved(n1, n2, n3)) return { msg: messages.approved };else if (avgN3 - 12 > 0) return { msg: messages.reproved };else return { n4: round(12 - avgN3), msg: messages.needsN4 };
  };
  var handleSubjectInN4 = function handleSubjectInN4(n1, n2, n3, n4) {
    var message = _isApproved(n1, n2, n3, n4) ? messages.approved : messages.reproved;
    return { msg: message };
  };

  /******************************* Public Functions ***************************************************************/
  var _isApproved = function _isApproved(n1, n2, n3, n4) {
    if (toNumber(n1) + toNumber(n2) <= 6) return false;
    if (getAvgN2(n1, n2) >= 8) return true;else if (getAvgN3(n1, n2, n3) >= 6) return true;else if (getAvgN4(n1, n2, n3, n4) >= 6) return true;else return false;
  };
  var _getAvgMarks = function _getAvgMarks(n1, n2, n3, n4) {
    switch (true) {
      case !!n4:
        return getAvgN4(n1, n2, n3, n4);
      case !!n3:
        return getAvgN3(n1, n2, n3);
      default:
        return getAvgN2(n1, n2);
    }
  };
  var simplify = function simplify(name, marks) {
    return {
      name: name,
      n1: marks.n1,
      n2: marks.n2,
      n3: marks.n3,
      n4: marks.n4
    };
  };
  /******************************* Returned Object ****************************************************************/
  return {
    name: name,
    marks: { n1: n1, n2: n2, n3: n3, n4: n4 },
    isApproved: function isApproved() {
      return _isApproved(this.marks.n1, this.marks.n2, this.marks.n3, this.marks.n4);
    },
    getAvgMarks: function getAvgMarks() {
      return _getAvgMarks(this.marks.n1, this.marks.n2, this.marks.n3, this.marks.n4);
    },
    projectMarksNeeded: function projectMarksNeeded() {
      switch (true) {
        case !!this.marks.n4:
          return handleSubjectInN4(this.marks.n1, this.marks.n2, this.marks.n3, this.marks.n4);
        case !!this.marks.n3:
          return handleSubjectInN3(this.marks.n1, this.marks.n2, this.marks.n3);
        case !!this.marks.n2:
          return handleSubjectInN2(this.marks.n1, this.marks.n2);
        case !!this.marks.n1:
          return handleSubjectInN1(this.marks.n1);
        default:
          return {};
      }
    },
    getAllSubjects: function getAllSubjects() {
      return dao.getSubjects();
    },
    saveAllSubjects: function saveAllSubjects(subjs) {
      return dao.saveSubjects(subjs);
    },
    saveSubject: function saveSubject(newSub) {
      var done = false,
          subjs = dao.getSubjects();
      Object.keys(newSub).map(function (key, index) {
        if (["n1", "n2", "n3", "n4"].indexOf(key) >= 0 && newSub[key] !== undefined && newSub[key] !== null) {
          newSub[key] = newSub[key].toString().replace(/,/g, ".");
          newSub[key] = isNaN(newSub[key]) ? null : Number(newSub[key]);
          if (newSub[key] > 10) newSub[key] = null;
        }
      });
      subjs = subjs.map(function (s) {
        if (s.name == newSub.name) {
          done = true;
          s.n1 = newSub.n1;
          s.n2 = newSub.n2;
          s.n3 = newSub.n3;
          s.n4 = newSub.n4;
        }
        return s;
      });
      if (!done) subjs.push(newSub);
      return dao.saveSubjects(subjs);
    },
    save: function save() {
      var subjs = dao.getSubjects();
      self = this;
      if (subjs.filter(function (a) {
        return a.name === self.name;
      }).length > 0) return { err: messages.compose("subjAlreadyExists", self.name) };

      subjs.push(simplify(this.name, this.marks));
      dao.saveSubjects(subjs);
      return { msg: messages.compose("subjAdded", self.name) };
    },
    delete: function _delete(name) {
      var done = false,
          subjs = dao.getSubjects();
      subjs = subjs.filter(function (s) {
        if (s.name == name) done = true;else return true;
      });
      dao.saveSubjects(subjs);
      objReturn = {};
      if (done) objReturn.msg = messages.compose("subjDeleted", name);else objReturn.err = messages.compose("subjNotDeleted", name);
      return objReturn;
    }
  };
};


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

(function () {
  var Subject = __webpack_require__(1);
  var Alert = __webpack_require__(0);
  /**
   * Local Object
   */
  var _ = {
    scrollTop: 0,
    alert: new Alert(),
    loadSubjects: function loadSubjects(view) {
      view.subjectBar("");
      view.totalSubs(new Subject().getAllSubjects());
      view.totalSubs.notifySubscribers();
    },
    changeView: function changeView(domView) {
      var mainView = document.getElementsByClassName("app__view--main")[0],
          editView = document.getElementsByClassName("app__view--edit")[0];
      switch (domView) {
        case "main":
          mainView.style.left = 0;
          editView.style.left = "100%";
          window.setTimeout(function () {
            if (_.scrollTop > 0) document.body.scrollTop = _.scrollTop;
          }, 400);
          break;
        case "edit":
          _.scrollTop = document.body.scrollTop;
          mainView.style.left = "-100%";
          editView.style.left = 0;
          break;
      }
    },
    LocalSubject: function LocalSubject(obj) {
      var _this = this;

      subj = new Subject(obj.name, obj.n1, obj.n2, obj.n3, obj.n4);
      this.name = ko.observable(obj.name);
      this.n1 = ko.observable(obj.n1);
      this.n2 = ko.observable(obj.n2);
      this.n3 = ko.observable(obj.n3);
      this.n4 = ko.observable(obj.n4);
      this.statusMsg = subj.projectMarksNeeded().msg;
      this.marksProjected = subj.projectMarksNeeded();
      this.isProjected = function (k) {
        return Object.keys(_this.marksProjected).indexOf(k) >= 0;
      };
      this.viewOpened = ko.observable(obj.viewOpened);
    },
    addAlert: function addAlert(msg) {
      document.getElementById("alerts").appendChild(this.alert.getDiv(msg));
    }
  };

  /**
   * Model Object
   */
  var AlfaNotasView = function AlfaNotasView() {
    var self = this;
    self.editSubj = ko.observable(new _.LocalSubject({}));
    self.subjectBar = ko.observable("");
    self.totalSubs = ko.observableArray();
    self.subjects = ko.computed(function () {
      return ko.utils.arrayFilter(self.totalSubs(), function (a) {
        return a.name.match(new RegExp(self.subjectBar(), "i"));
      }).map(function (a) {
        return new _.LocalSubject(a);
      });
    });
    _.loadSubjects(self);
  };

  /**
   * Model Functions
   */
  AlfaNotasView.prototype.addSubject = function () {
    if (this.subjectBar().length <= 0) return;
    var msg = new Subject(this.subjectBar()).save();
    _.addAlert(msg);
    _.loadSubjects(this);
  };
  AlfaNotasView.prototype.editSubject = function (id) {
    this.editSubj(this.subjects()[id]);
    _.changeView("edit");
  };
  AlfaNotasView.prototype.cancelEdit = function () {
    var _this2 = this;

    window.setTimeout(function () {
      return _this2.editSubj(new _.LocalSubject({}));
    }, 400);
    _.changeView("main");
  };
  AlfaNotasView.prototype.saveEdit = function () {
    new Subject().saveSubject(ko.toJS(this.editSubj()));
    this.cancelEdit();
    _.loadSubjects(this);
  };
  AlfaNotasView.prototype.deleteSubject = function () {
    var msg = new Subject().delete(this.editSubj().name());
    console.log(msg);
    this.cancelEdit();
    _.loadSubjects(this);
  };
  AlfaNotasView.prototype.toggleDetailView = function (id) {
    this.subjects()[id].viewOpened(!this.subjects()[id].viewOpened());
  };

  /**
   * Applying Binding
   */
  ko.applyBindings(new AlfaNotasView(), document.body);
  /**
   * Global Listenings
   */
  document.body.addEventListener('click', function (e) {
    if (e.target.classList.value.match(/close/ig)) {
      e.target.parentNode.parentNode.removeChild(e.target.parentNode);
    }
  });
})();


/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = function () {
  var getSubjects = function getSubjects() {
    var subjs = JSON.parse(localStorage.getItem("subjects"));
    if (!subjs) subjs = [];
    return subjs;
  };
  var saveSubjects = function saveSubjects(objs) {
    localStorage.setItem("subjects", JSON.stringify(objs));
  };

  return {
    getSubjects: getSubjects,
    saveSubjects: saveSubjects
  };
};


/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = function (lang) {
    switch (lang) {
        case "pt_br":
            var msgs = {
                approved: "Passou!",
                reproved: "Reprovado!",
                needsN3: "Volte para os livros, você vai para N3!",
                needsN4: "Não entre em pânico, mas você vai para N4!",
                subjAlreadyExists: "A matéria %s já existe",
                subjAdded: "Matéria %s adicionada",
                subjDeleted: "Matéria %s deletada",
                subjNotDeleted: "Erro ao deletar matéria %s"
            };
            msgs.compose = function (msg, piece) {
                return msgs[msg].replace(/%s/ig, piece);
            };
            return msgs;
    }
};


/***/ })
/******/ ]);