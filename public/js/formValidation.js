/*--- EDITABLE PART -------*/
/*---MAKE SURE TO PUT YOUR EACH INPUT INSIDE SEPARATE DIV -------*/
//SET requiredFill = "true" where condition applies
//Border when error
const borderStyleEmpty = `
                          border:.2px solid #ff385c;
                          box-shadow:0 0 5px #ff385c61
                         `;

//Border when no error
const borderStyleFilled = `
                          border:.2px solid green;
                          box-shadow:0 0 5px rgba(0,255,0,.3)
                         `;

//Warning paragraph
const warningPara = true;
const warningParaStyle = `
                          font-size:50%;
                          color:#ff385c;
                          text-transform:uppercase;
                          padding:0;
                          margin:0
                          `;
const uniqueAttribute = "name";

const warningToDisplay = {
  //uniqueAttribute : What to display
  username: "Please type your username",
  "listing[title]": "Title is a must",
  "listing[price]": "Price cannot be lower than 0",
  "listing[location]": "Enter a location",
  "listing[country]": "Enter a country name",
  price: "Price cannot be lower than 0",
  "review[comment]": "Please type a comment"
};
const lowestNum = 1;

/*---------*/
/*-------------------------------------------------------------------------------*/

/*------- IGNORE THIS PART --------*/
let requiredInputs = [];
function findInputs() {
  const inputElems = document.querySelectorAll("input");
  inputElems.forEach(elem => {
    let required = elem.getAttribute("requiredFill");
    if (required == "true") {
      requiredInputs.push(elem);
    }
  });
  const textareas = document.querySelectorAll("textarea");
  textareas.forEach(elem => {
    let required = elem.getAttribute("requiredFill");
    if (required == "true") {
      requiredInputs.push(elem);
    }
  });
}
findInputs();

requiredInputs.forEach(elem => {
  elem.addEventListener("keyup", () => {
    checkInputs(elem, "number");
  });
});
const form = document.querySelector(".validate-form");
form.addEventListener("submit", event => {
  event.preventDefault();
  let count = 0;
  requiredInputs.forEach(elem => {
    checkInputs(elem);
    let type = elem.getAttribute("type");
    if (elem.value == "" || (type == "number" && elem.value < lowestNum)) {
      if (type == "number") {
        checkInputs(elem, "number");
      }
      return;
    } else {
      count++;
    }
  });
  if (count == requiredInputs.length) {
    form.submit();
  }
});

function warningParaAndBorder(elem, borderType, customWarn) {
  if (borderType == "err") {
    elem.style.cssText = borderStyleEmpty;
    if (warningPara) {
      let inputName = elem.getAttribute(uniqueAttribute || "name");
      let parent = elem.parentNode;
      let currP = document.getElementById(`${inputName}`);
      if (!currP) {
        let p = document.createElement("p");
        p.innerText = warningToDisplay[inputName] || `${inputName} required`;
        p.setAttribute("id", inputName);
        p.style.cssText = warningParaStyle;
        parent.appendChild(p);
      }
    }
  } else if (borderType == "res") {
    elem.style.cssText = borderStyleFilled;
    if (warningPara) {
      let inputName = elem.getAttribute(uniqueAttribute || "name");
      let parent = elem.parentNode;
      let currP = document.getElementById(`${inputName}`);
      if (currP) {
        parent.removeChild(currP);
      }
    }
  }
}

function checkInputs(elem, numberCheck) {
  if (numberCheck == "number") {
    if (elem.value < lowestNum) {
      warningParaAndBorder(elem, "err");
    } else {
      warningParaAndBorder(elem, "res");
    }
  } else if (elem.value == "" && !numberCheck) {
    warningParaAndBorder(elem, "err");
  } else {
    warningParaAndBorder(elem, "res");
  }
}
