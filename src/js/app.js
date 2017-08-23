(() => {
  const Subject = require('./model');  
  const Alert = require('./alert');  
  /**
   * Local Object
   */
  const _ = {
    scrollTop : 0,
    alert : new Alert(),
    loadSubjects : (view) => {
      view.subjectBar("");
      view.totalSubs(new Subject().getAllSubjects());
      view.totalSubs.notifySubscribers();
    },
    changeView :  (domView) => {
      let mainView = document.getElementsByClassName("app__view--main")[0],
          editView = document.getElementsByClassName("app__view--edit")[0];
      switch (domView) {
        case "main":
          mainView.style.left = 0;
          editView.style.left = "100%";
          window.setTimeout(()=> {
            if(_.scrollTop > 0) document.body.scrollTop = _.scrollTop;
          },400);
          break;
        case "edit":
          _.scrollTop = document.body.scrollTop;
          mainView.style.left = "-100%";
          editView.style.left = 0;
          break;
      }
    },
    LocalSubject: function(obj) {
      subj = new Subject(obj.name, obj.n1, obj.n2, obj.n3, obj.n4);
      this.name = ko.observable(obj.name);
      this.n1 = ko.observable(obj.n1);
      this.n2 = ko.observable(obj.n2);
      this.n3 = ko.observable(obj.n3);
      this.n4 = ko.observable(obj.n4);
      this.statusMsg = subj.projectMarksNeeded().msg;
      this.marksProjected = subj.projectMarksNeeded();
      this.isProjected = (k) => Object.keys(this.marksProjected).indexOf(k) >= 0;
      this.viewOpened = ko.observable(obj.viewOpened);
    },
    addAlert: function(msg){
      document
        .getElementById("alerts")
        .appendChild(this.alert.getDiv(msg));
    }
  };

  /**
   * Model Object
   */
  const AlfaNotasView = function() {
    const self = this;
    self.editSubj = ko.observable(new _.LocalSubject({}));
    self.subjectBar = ko.observable("");
    self.totalSubs = ko.observableArray();
    self.subjects = ko.computed(() => {
      return ko.utils.arrayFilter(self.totalSubs(),(a => {
        return a.name.match(new RegExp(self.subjectBar(), "i"));
      })).map(a => new _.LocalSubject(a));
    });
    _.loadSubjects(self);
  };

  /**
   * Model Functions
   */
  AlfaNotasView.prototype.addSubject = function() {
    if (this.subjectBar().length <= 0)
      return;
    let msg = new Subject(this.subjectBar()).save();
    _.addAlert(msg);
    _.loadSubjects(this);
  };
  AlfaNotasView.prototype.editSubject = function(id) {
    this.editSubj(this.subjects()[id]);
    _.changeView("edit");  
  };
  AlfaNotasView.prototype.cancelEdit = function() {
    window.setTimeout(()=>this.editSubj(new _.LocalSubject({})),400);
    _.changeView("main");  
  };
  AlfaNotasView.prototype.saveEdit = function() {
    new Subject().saveSubject(ko.toJS(this.editSubj()));
    this.cancelEdit();
    _.loadSubjects(this);
  };
  AlfaNotasView.prototype.deleteSubject = function() {
    let msg = new Subject().delete(this.editSubj().name());
    console.log(msg);
    this.cancelEdit();
    _.loadSubjects(this);
  };
  AlfaNotasView.prototype.toggleDetailView = function(id) {
    this.subjects()[id].viewOpened(!this.subjects()[id].viewOpened());
  };
  
  /**
   * Applying Binding
   */
  ko.applyBindings(new AlfaNotasView(), document.body);
  /**
   * Global Listenings
   */
  document.body.addEventListener('click', function(e){
    if(e.target.classList.value.match(/close/ig)){
      e
        .target
        .parentNode
        .parentNode
        .removeChild(e.target.parentNode);
    }
  });
})();
