let selectedTool = "Pen";
let color = "#fff";

document
  .querySelector("li[data-content='Pen']")
  .addEventListener("click", function () {
    document
      .querySelector(`li[data-content='${selectedTool}']`)
      .classList.remove("selected");
    selectedTool = this.dataset.content;
    this.classList.add("selected");
  });

document
  .querySelector("li[data-content='Eraser']")
  .addEventListener("click", function () {
    document
      .querySelector(`li[data-content='${selectedTool}']`)
      .classList.remove("selected");
    selectedTool = this.dataset.content;
    this.classList.add("selected");
  });

document
  .querySelector("li[data-content='Color'] input")
  .addEventListener("input", function () {
    color = this.value;
  });

document
  .querySelector("li[data-content='Reset position']")
  .addEventListener("click", function () {
    resetPosition();
  });
