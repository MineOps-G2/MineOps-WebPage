const mainContent = document.querySelector(".mainContainer");
const sidebar = document.querySelector(".otherVideos");

const mainContentHeight = mainContent.offsetHeight;
const sidebarHeight = sidebar.offsetHeight;

if (mainContentHeight !== sidebarHeight) {
  sidebar.style.height = mainContentHeight + "px";
}

document.addEventListener(
  "DOMContentLoaded",
  function () {
    autosize(document.querySelectorAll("textarea"));
  },
  false
);

// function adjustHeight() {
//   const textEle = document.querySelectorAll("textarea");
//   textEle[0].style.height = "auto";
//   let textEleHeight = textEle.prop("scrollHeight");
//   textEle.css("height", textEleHeight);
// }

// adjustHeight();

// textEle.addEventListener("keyup", adjustHeight);
