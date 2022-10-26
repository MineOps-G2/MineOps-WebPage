const mainContent = document.querySelector(".mainContainer");
const sidebar = document.querySelector(".otherVideos");
const textarea = document.querySelector(".videoInfo2__para");

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

if (textarea.scrollHeight > textarea.clientHeight)
  //textarea height 확장
  textarea.style.height = textarea.scrollHeight + "px";
//textarea height 축소
else textarea.style.height = textarea.scrollHeight - 18 + "px";
