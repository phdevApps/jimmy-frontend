if(!customElements.get("toggle-box")){class ToggleBox extends HTMLElement{constructor(){super()}connectedCallback(){this.button=this.querySelector(".toggle-box--button"),this.button.addEventListener("click",()=>{this.toggleAttribute("open")})}}customElements.define("toggle-box",ToggleBox)}
//# sourceMappingURL=/cdn/shop/t/19/assets/toggle-boxes.js.map
