(() => {
  const Subject = require('./model');

  function AlfaNotasView(subs) {
    function LocalSubject(obj) {
      this.name = ko.observable(obj.name);
      this.n1 = ko.observable(obj.n1);
      this.n2 = ko.observable(obj.n2);
      this.n3 = ko.observable(obj.n3);
      this.n4 = ko.observable(obj.n4);
      this.viewOpened = ko.observable(obj.viewOpened);
    }
    const self = this;
    self.editSubj = ko.observable(new LocalSubject({}));
    self.subjectBar = ko.observable("");
    self.totalSubs = ko.observableArray();
    self.subjects = ko.computed(() => {
      return ko.utils.arrayFilter(self.totalSubs(),(a => {
        return a.name.match(new RegExp(self.subjectBar(), "i"));
      })).map(a => new LocalSubject(a));
    });
    self.addSubject = () => {
      console.log(new Subject(self.subjectBar()).save());
      loadSubjects();
    };
    self.editSubject = (id) => {
      self.editSubj(self.subjects()[id]);
      changeView("edit-view");  
    };
    self.cancelEdit = () => {
      window.setTimeout(()=>self.editSubj(new LocalSubject({})),400);
      changeView("main-view");  
    };
    self.saveEdit = () => {
      new Subject().saveSubject(ko.toJS(self.editSubj()));
      self.cancelEdit();
      loadSubjects();
    };
    self.deleteSubject = () => {
      let msg = new Subject().delete(self.editSubj().name());
      console.log(msg);
      self.cancelEdit();
      loadSubjects();
    };
    self.toggleDetailView = (id) => {
      self.subjects()[id].viewOpened(!self.subjects()[id].viewOpened());
    };
    let loadSubjects = () => {
      self.subjectBar("");
      self.totalSubs(new Subject().getAllSubjects());
      self.totalSubs.notifySubscribers();
    };
    loadSubjects();
    let changeView = (view) => {
      let appViews = document.getElementsByClassName("app-views")[0];
      switch (view) {
        case "main-view":
          appViews.style.left = 0;
          break;
        case "edit-view":
          appViews.style.left = "-100%";
          break;
      }
    };
  }
  new Subject().saveSubject({name:"Portuguese",n1:7.3});
  ko.applyBindings(new AlfaNotasView());
})();
