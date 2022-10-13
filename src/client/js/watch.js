const mainContent = document.querySelector(".mainContainer");
const sidebar = document.querySelector(".otherVideos");

const mainContentHeight = mainContent.offsetHeight;
const sidebarHeight = sidebar.offsetHeight;

if (mainContentHeight !== sidebarHeight) {
  sidebar.style.height = mainContentHeight + "px";
}
