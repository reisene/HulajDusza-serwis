function searchPosts(o,t){$(".post-article").each(function(){var t=$(this),e=t.find("h2").text().toLowerCase(),s=t.find(".post-content").text().toLowerCase();e.includes(o)||s.includes(o)?t.show():t.hide()})}export default searchPosts;
//# sourceMappingURL=post-searcher.js.map
