console.log("ituring toc loaded for: " + document.title);

const headerSelector = ".side .block-header";
const contentSelector = ".side .block-header + div ul";
const articleHeaderSelector =
  "#article h2, #article h3, #article li>p:first-child>strong:only-child";

const scrollToId = (id) => {
  window.scrollTo({
    top: document.getElementById(id).offsetTop,
    behavior: "smooth",
  });
};
const styleTag = document.createElement("style");
styleTag.innerHTML = `
.side .block-header + div ul{
  height: calc(100vh - 164px);
  overflow:auto;
}
.ituring-toc-toggle-btn{
  position: absolute;
  right: 0;
  bottom: 10px;
  user-select: none;
  cursor: pointer;
  padding: 0 10px;
}
.ituring-toc-toggle-btn:hover{
  background: #ddd
}
.side a{
  cursor: pointer;
}
@media (min-width: 992px) {
  .layout-head{
    z-index: 9;
  }
  .block-header{
    margin-top: 10px;
  }
  .side{
    position: fixed;
    background:#fff;
    z-index:10;
    left: 72%;
    top: 110px;
    height: calc(100vh - 110px);
  }
  #toTop, .float_view{
    z-index: 11;
  }
}
`;
document.body.appendChild(styleTag);
const header = document.querySelector(headerSelector);
const toggleButton = document.createElement("div");
toggleButton.innerHTML = "切换到本章节目录";
toggleButton.className = "ituring-toc-toggle-btn";
header.appendChild(toggleButton);

const articleTocList = [];
const hTags = document.querySelectorAll(articleHeaderSelector);
let tagIdPlaceholder = 0;
hTags.forEach((tag) => {
  const tagContent = tag.textContent;
  const tagId =
    tagContent.split("　")[0] || `ituring-toc-${tagIdPlaceholder++}`;
  tag.setAttribute("id", tagId);
  articleTocList.push({
    id: tagId,
    text: tagContent,
    // level by text: "1.1", "1.1.1"
    // level: Array.from(tagId).filter((x) => x === ".").length,

    // level by h tag level: <h2>, <h3> ...
    level: tag.tagName === "STRONG" ? 5 : tag.tagName[1],
  });
});

let tocType = "book";
let bookTocLiHtml, articleTocLiHtml;
const contentEle = (tocContent = document.querySelector(contentSelector));
contentEle.addEventListener("click", (e) => {
  const { target } = e;
  if (target.tagName === "A" && target.dataset.id) {
    scrollToId(target.dataset.id);
  }
});
toggleButton.addEventListener("click", () => {
  if (tocType === "book") {
    if (articleTocLiHtml) {
      contentEle.innerHTML = articleTocLiHtml;
    } else {
      const fragment = document.createDocumentFragment();
      articleTocList.forEach(({ id, text, level }) => {
        const li = document.createElement("li");
        li.setAttribute("style", "line-height:1");
        const span = document.createElement("span");
        const a = document.createElement("a");
        let prefix = "";
        if (level === 5) {
          prefix = "- ";
        }
        a.innerHTML = "&nbsp; ".repeat(2 * (level - 1)) + prefix + text;
        a.dataset.id = id;
        span.appendChild(a);
        li.appendChild(span);
        fragment.appendChild(li);
      });
      bookTocLiHtml = contentEle.innerHTML;
      contentEle.innerHTML = "";
      contentEle.appendChild(fragment);
      articleTocLiHtml = contentEle.innerHTML;
    }
    tocType = "article";
    toggleButton.innerHTML = "切换到全书目录";
  } else {
    contentEle.innerHTML = bookTocLiHtml;
    tocType = "book";
    toggleButton.innerHTML = "切换到本章节目录";
  }
  contentEle.scrollTo({ top: 0 });
});
