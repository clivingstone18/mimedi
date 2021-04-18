const request = require("request");
const cheerio = require("cheerio");

/* gets the languages spoken in 10 different practices within a given suburb */
/* gets whether it is bulk billed */

/* does it provide covid 19 testing? */
/* does it bulk bill */

const fetchSuburbsPracs = (url) => {
    return new Promise((resolve, reject) => {
    request(url, function (err, response, html) {
        if (err) {
          console.log(err);
        }
        if (!err) {
          var $ = cheerio.load(html);
          let allItems = $(".ProfileNamestyles__StyledLink-tgn88t-0.fLcCFy");          
          let practiceLinks = [];
          allItems.each((index, item) => {
            let link = item.attribs.href;
            let pracName = link.split("/")[4];
            practiceLinks.push({
              nameOfClinic: pracName,
              link: item.attribs.href,
            });
        })
        resolve(practiceLinks);
    }
})
})
}

// get all info for a practice 

const fetchPracticeInfo = (nameOfClinic, link) => {
    return new Promise((resolve, reject) => {
    request(link, function (err, response, html) {
        let pracInfo = [];
        if (!err) {
          // get langs
          var $ = cheerio.load(html);
          let allItems = $(".language");
          let pracLanguages = [];
          for (let j = 1; j < allItems.children().length; j++) {
            pracLanguages.push(
              allItems.children()[j].children[0].data.trim()
            );
          }

          // gets bulk bill or not
          let regex = "bulk bill";
          let pracPrices = $(".pricing-guide-wrapper").html();

          // gets facilities

          let facilities = $(
            ".practice-facilities.one-third"
          ).children()[1];
          let facilitiesList = [];

          if (facilities) {
            for (let k = 1; k < facilities.children.length; k += 2) {
              facilitiesList.push(
                facilities.children[k].children[3].children[0].data
              );
            }
          }

          let address = $(".map-links")[0].attribs.title;
   


          let toBulkBill;
          if (pracPrices == null) {
              toBulkBill = false;
          }
          else {
            toBulkBill = pracPrices.toLowerCase().includes(regex);
          }

          // get tele 

          let teleHealth = $(".profile-telehealth-pill");







          pracInfo.push({
              nameOfClinic: nameOfClinic,
              pracLanguages: pracLanguages,
              bulkBill: toBulkBill,
              teleHealth: teleHealth.length ? true: false,
              facilitiesList: facilitiesList,
              address:address,
              link:link,
          });


        } else {
          //console.log(err);
        }

        resolve(pracInfo[0]);
    })
});
}

const fetchAllInfoInASuburb = (practiceLinks) => {
    let pracInfo = [];    
    return new Promise((resolve, reject) => {

    let coreUrl = "https://healthengine.com.au/";
    let promises = [];

    for (let i = 0; i < practiceLinks.length; i++) {
          let currPracUrl = coreUrl + practiceLinks[i].link;
          let nameOfClinic = (practiceLinks[i].link.split("/")[4]);
          promises.push(fetchPracticeInfo(nameOfClinic, currPracUrl));
    }

    Promise.all(promises).then(res=>resolve(res)).catch(e=>reject(e));
})
}



module.exports = {fetchSuburbsPracs, fetchAllInfoInASuburb};


