module.exports = function() {
    const setRemoveAction = (el, wait = false) => {
      const fading = () => {
        el.style.opacity=0;
        setTimeout(()=>{
          try{
            el.parentNode.removeChild(el);
          }catch(e){}
        },800);
      };
      setTimeout(fading,(wait ? 1500 : 0));
    };
    this.getHtml = function(data){
      const css = ((data.err) ? "alert" : "success");
      const msg = ((data.err) ? data.err : data.msg);
      return `<div class="callout ${css}">
                <span class="close">X</span>   
                ${msg}
              </div>
              `;
    };
    this.getDiv = function(data){
      const alertDiv = document.createElement("div");
      alertDiv.innerHTML = this.getHtml(data);
      setRemoveAction(alertDiv.firstChild,true);
      return alertDiv.firstChild;
    };
    this.closeEvent = function(el) {
      if(!el || el.nodeName.toLocaleLowerCase === "body")
        return;
        
      if(el.classList.contains("callout")){
        setRemoveAction(el);
        return;
      }
      this.closeEvent(el.parentNode);
    };
};