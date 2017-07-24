(() => {
  const Subject = require('./model');

  function AlfaNotasView(subs) {
    /**
     * Local Object
     */
    const _ = {
      scrollTop : 0,
      loadSubjects : () => {
        self.subjectBar("");
        self.totalSubs(new Subject().getAllSubjects());
        self.totalSubs.notifySubscribers();
      },
      changeView :  (view) => {
        let mainView = document.getElementsByClassName("app__view--main")[0],
            editView = document.getElementsByClassName("app__view--edit")[0];
        switch (view) {
          case "main":
            console.log(_.scrollTop);
            console.log(_.scrollTop || 0);
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
        this.name = ko.observable(obj.name);
        this.n1 = ko.observable(obj.n1);
        this.n2 = ko.observable(obj.n2);
        this.n3 = ko.observable(obj.n3);
        this.n4 = ko.observable(obj.n4);
        this.viewOpened = ko.observable(obj.viewOpened);
      }
    };

    const self = this;
    self.editSubj = ko.observable(new _.LocalSubject({}));
    self.subjectBar = ko.observable("");
    self.totalSubs = ko.observableArray();
    self.subjects = ko.computed(() => {
      return ko.utils.arrayFilter(self.totalSubs(),(a => {
        return a.name.match(new RegExp(self.subjectBar(), "i"));
      })).map(a => new _.LocalSubject(a));
    });
    self.addSubject = () => {
      if (self.subjectBar().length <= 0)
        return;
      console.log(new Subject(self.subjectBar()).save());
      _.loadSubjects();
    };
    self.editSubject = (id) => {
      self.editSubj(self.subjects()[id]);
      _.changeView("edit");  
    };
    self.cancelEdit = () => {
      window.setTimeout(()=>self.editSubj(new _.LocalSubject({})),400);
      _.changeView("main");  
    };
    self.saveEdit = () => {
      new Subject().saveSubject(ko.toJS(self.editSubj()));
      self.cancelEdit();
      _.loadSubjects();
    };
    self.deleteSubject = () => {
      let msg = new Subject().delete(self.editSubj().name());
      console.log(msg);
      self.cancelEdit();
      _.loadSubjects();
    };
    self.toggleDetailView = (id) => {
      self.subjects()[id].viewOpened(!self.subjects()[id].viewOpened());
    };
    _.loadSubjects();
  }
  
  ko.applyBindings(new AlfaNotasView());
})();
