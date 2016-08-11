$.ajax({
  url: "http://interface.bilibili.com/playurl?cid=6899340&player=1&ts=1470032869&sign=8e38cedc3bbe431a91718a9c3087006b",
  type: "GET",
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "text/xml; charset=utf-8"
  },
  success: function () {
    console.log(arguments);
  }
});
