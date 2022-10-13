const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const videoComments = document.querySelector(".video__comments ul");
const videoCommentArray = videoComments.querySelectorAll("#comment-text");
const deleteBtns = videoComments.querySelectorAll("#delete-comment");

const addComment = (text, id, name, avatarUrl) => {
  const newComment = document.createElement("li");
  newComment.className = "video__comment";
  newComment.dataset.id = id;
  const icon = document.createElement("div");
  icon.className = "video__comment-icon";
  if (!avatarUrl) {
    const imoti = document.createElement("span");
    imoti.className = "smaller__imoticon";
    imoti.innerText = "😀";
    icon.appendChild(imoti);
  } else {
    const image = document.createElement("img");
    image.src = avatarUrl;
    image.className = "smaller__avatar";
    icon.appendChild(image);
  }
  const commentBox = document.createElement("div");
  commentBox.className = "video__comment-box";
  const ownerName = document.createElement("div");
  ownerName.className = "ownerName";
  ownerName.innerText = name;
  commentBox.appendChild(ownerName);
  const commentText = document.createElement("div");
  commentText.className = "video__comment-text";
  const span = document.createElement("span");
  span.id = "comment-text";
  span.innerText = ` ${text}`;
  const h6 = document.createElement("i");
  h6.className = "far fa-trash-alt";
  h6.id = "delete-comment";
  h6.addEventListener("click", handleClick);
  // span.addEventListener("mouseover", handleMouse);
  commentText.appendChild(span);
  commentText.appendChild(h6);
  commentBox.appendChild(commentText);
  newComment.appendChild(icon);
  newComment.appendChild(commentBox);
  videoComments.prepend(newComment); //가장 뒤에 추가
};

const handleSubmit = async (event) => {
  event.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
  const videoId = videoContainer.dataset.id;
  if (text === "") {
    return;
  }
  const response = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });
  if (response.status === 201) {
    textarea.value = "";
    const { newCommentId, name, avatarUrl } = await response.json();
    addComment(text, newCommentId, name, avatarUrl);
  }
};

if (form) {
  form.addEventListener("submit", handleSubmit);
}

const handleClick = async (e) => {
  const parentComment = e.target.parentElement.parentElement.parentElement;
  const commentId = parentComment.dataset.id;
  const response = await fetch(`/api/videos/${commentId}/comment`, {
    method: "delete",
  });
  if (response.status === 200) {
    videoComments.removeChild(parentComment);
  }
};

// const handleMouse = (e) => {
//   const commentDiv = e.target.parentElement;
//   const delBtn = commentDiv.childNodes[1];
//   delBtn.className = "showing";
//   setTimeout(() => {
//     delBtn.className = "";
//   }, 3000);
// };

// videoCommentArray.forEach((comment) => {
//   comment.addEventListener("mouseover", handleMouse);
// });

if (deleteBtns) {
  deleteBtns.forEach((deleteBtn) => {
    // deleteBtn.addEventListener("mouseover", (e) => {
    //   e.target.className = "showing";
    //   setTimeout(() => {
    //     e.target.className = "";
    //   }, 3000);
    // });
    deleteBtn.addEventListener("click", handleClick);
  });
}
