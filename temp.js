function exec() {
  document.querySelectorAll(".word").forEach((word) => {
    console.log(word.innerText.replaceAll(" - ", "\t").replaceAll("\n", "\t"));
  });
  document.querySelector(".rightbutton").click();
  if (document.querySelector(".midbutton").innerText !== "page 500 of 500") {
    setTimeout(exec, 100);
  }
}



