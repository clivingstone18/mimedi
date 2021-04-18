const request = require("request");
const cheerio = require("cheerio");


function checker(value, items) {
    return items.every(function(v) {
      return value.indexOf(v) == -1;
    });
  }

var regex = new RegExp([
    "travel","border","quarantine", "hotel","0","1","2","3","4","5","6","7","8","9"].join('|'));

let url = "https://www.dhhs.vic.gov.au/coronavirus/updates";
const fetchAlert = () => {
    return new Promise((resolve, reject) => {
  request(url, function (err, response, html) {
    if (err) {
      console.log(err);
    }
    if (!err) {
      var $ = cheerio.load(html);
      let allItems = $(".views-row");
      let items = [];
      for (let i = 0; i < allItems.length; i++) {
        if (allItems[i].children.length > 1) {
          let date = allItems[i].children[0].children[0].children[0].data;
          let title =
            allItems[i].children[1].children[0].children[0].children[0].data;
          let blurb = allItems[i].children[2].children[0].children[0].data;

          if (regex.test(blurb)) {
            items.push({ date, title, blurb });

          }
        }
      }
      resolve(items);
    }
})
})
}

module.exports = fetchAlert;