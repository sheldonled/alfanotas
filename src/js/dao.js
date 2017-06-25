module.exports = function () {
  const getSubjects = () => {
    let subjs = JSON.parse(localStorage.getItem("subjects"));
    if (!subjs) subjs = [];
    return subjs;
  };
  const saveSubjects = (objs) => {
    localStorage.setItem("subjects",JSON.stringify(objs));
  };

  return {
    getSubjects : getSubjects,
    saveSubjects : saveSubjects
  };
};
