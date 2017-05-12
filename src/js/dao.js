module.exports = function () {
  const getSubjects = () => {
    return JSON.parse(localStorage.getItem("subjects"));
  };
  const saveSubjects = (objs) => {
    localStorage.setItem("subjects",JSON.stringify(objs));
  };

  return {
    getSubjects : getSubjects,
    saveSubjects : saveSubjects
  };
};
