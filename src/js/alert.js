module.exports = function() {
    this.count = 0;
    this.getHtml = function(data){
      let css = ((data.err) ? "alert" : "success");
      let msg = ((data.err) ? data.err : data.msg);
      return `<div class="callout ${css} alfanotas-msg-${this.count}">
                <span class="close msg-${this.count}">X</span>   
                ${msg}
              </div>
              `;
    };
    this.getDiv = function(data){
      let alertDiv = document.createElement("div");
      alertDiv.innerHTML = this.getHtml(data);
      return alertDiv.firstChild;
    };
};