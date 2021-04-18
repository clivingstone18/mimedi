const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const port = 5000;
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
const { fetchSuburbsPracs, fetchAllInfoInASuburb } = require("./scraper.js");

const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const connectToDB = require("./ConnectToDB.js")
const CognitoUserPool = AmazonCognitoIdentity.CognitoUserPool;
const AWS = require('aws-sdk');
const request = require('request');
const jwkToPem = require('jwk-to-pem');
const jwt = require('jsonwebtoken');
const fetchAlert = require('./alertScraper');
const { result } = require("lodash");
global.fetch = require('node-fetch');

// TERRIBLE PRACTICE 
AWS.config.update({
  accessKeyId: "AKIAIXIC5H3FIBQERXAA",
  secretAccessKey: "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",
  region: "ap-southeast-2",
});

var cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider({apiVersion: '2016-04-18'});

const poolData = {    
  UserPoolId : "ap-southeast-2_TZfsBgucZ", // Your user pool id here    
  ClientId : "2t8gccu0alcb2j684q6i7cl2bh" // Your client id here
}; 

const pool_region = 'ap-southeast-2';
const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);


app.get("/api/getAlerts", (req, res) => {
  fetchAlert().then(response=>res.send(response))
});


// just login And register 

async function RegisterUser(info){
  return new Promise((resolve, reject) => {
    let attributeList = [];
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"birthdate",Value:info.age}));
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"gender",Value:info.sex}));
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"given_name",Value:info.firstName}));
    attributeList.push(new AmazonCognitoIdentity.CognitoUserAttribute({Name:"family_name",Value:info.lastName}));
  
    userPool.signUp(info.email, info.password, attributeList,
      null, function (err, result) {
          event = {
              request: {
                  "userAttributes": attributeList,
                  "validationData": {
                      "Name": "email",
                      "Value": info.email
                  }
              },
              response: {
                  autoVerifyEmail: true
              }
          }
          // Confirm the user
  
          var confirmParams = {
              UserPoolId: "ap-southeast-2_TZfsBgucZ", /* required */
              Username: info.email/* required */
            };
            cognitoidentityserviceprovider.adminConfirmSignUp(confirmParams, function(err, data) {
              if (err) console.log(err, err.stack); // an error occurred
  
             
              // Set the email as verified if it is in the request
              if (event.request.userAttributes.hasOwnProperty("email")) {
                  event.response.autoVerifyEmail = 'true';
              }
  
              // Return to Amazon Cognito
             
  
              if (err) {
                  console.log("Error aws: ", err.message);
                  reject(cognitoUser)
              }
              
              cognitoUser = result.user;
              console.log('user name is ' + cognitoUser.getUsername());
              resolve(cognitoUser)
              // return;
            });
          })
        })
      }

  
  function Login(info) {
    return new Promise((resolve, reject) => {

    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
        Username : info.email,
        Password : info.password,
    });
  
    var userData = {
        Username : info.email,
        Pool : userPool
    };
    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
            console.log('access token + ' + result.getAccessToken().getJwtToken());
            console.log('id token + ' + result.getIdToken().getJwtToken());
            console.log('refresh token + ' + result.getRefreshToken().getToken());
            resolve(result);
        },
        onFailure: function(err) {
            console.log(err);
            reject(err);
        },
      })
    })
  }

app.get("/api/", (req, res) => {
  res.send("root");
});


/* CONNECTED TO COGNITO */
/* CONNECTED TO DB */

app.post("/api/signIn", (req, res) => {
  Login(req.body).then(response=>res.send(response)).catch(e=>res.send(e))


});

app.post("/api/register", (req, res) => {
  RegisterUser(req.body).then(response=>res.send(response)).catch(e=>res.send(e))

});


app.get("/api/attributes", (req,res) => {

})



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});




function getCommon(arr1, arr2) {
  arr1.sort(); // Sort both the arrays
  arr2.sort();
  var common = []; // Array to contain common elements
  var i = 0,
    j = 0; // i points to arr1 and j to arr2
  // Break if one of them runs out

  if (arr2.length == 0) {
    return [1];
  }
  while (i < arr1.length && j < arr2.length) {
    if (arr1[i] == arr2[j]) {
      // If both are same, add it to result
      common.push(arr1[i]);
      i++;
      j++;
    } else if (arr1[i] < arr2[j]) {
      // Increment the smaller value so that
      i++; // it could be matched with the larger
    } // element
    else {
      j++;
    }
  }

  return common;
}

app.post("/api/findPrac", (req, res) => {
  let { suburbs, languages, facilities, options, services } = req.body;
  let languagesList = [];
  let facilitiesList = [];
  let optionsList = [];
  // sorts out the facilities/languages/options lists 
  for (let i = 0; i < languages.length; i++) {
    languagesList.push(languages[i].name);
  }

  for (let i = 0; i < facilities.length; i++) {
    facilitiesList.push(facilities[i].name);
  }

  for (let i = 0; i < options.length; i++) {
    optionsList.push(options[i].name);
  }

  let specLinks = [];
  let suburbLinks = [];

  // now for each of the services. 
  for (let k = 0; k < services.length; k++) {
    for (let i = 0; i < suburbs.length; i++) {
      let link = `https://healthengine.com.au/find/${services[k].name.toLowerCase()}/VIC/${suburbs[i].name.replace(" ", "-")}-${
        suburbs[i].postcodes[0]} `;
        suburbLinks.push(link);
    }
    specLinks.push({serviceName: services[k].name.toLowerCase(), suburbLinks})
    suburbLinks = [];
  }

  let practicesInfoPromises = []
  let allInfoPromises = []
  for (let k = 0; k < services.length; k++) {
    for (let i = 0; i < suburbs.length; i++) {
      console.log(specLinks[k])
      practicesInfoPromises.push(filterInfoForSuburb(facilitiesList, optionsList, languagesList, specLinks[k].suburbLinks[i]));
    }
    allInfoPromises.push(practicesInfoPromises);
    practicesInfoPromises = [];
  }

  let inf = []
  let itemsProcessed = 0;

  allInfoPromises.forEach((val, i) => {
    Promise.all(allInfoPromises[i]).then(response=> {
       inf.push({response: response[0], name:services[i].name});
       itemsProcessed++;
       console.log(itemsProcessed)
       if (itemsProcessed == allInfoPromises.length) {
         res.send(inf)
       }
      }
    )
  })

  })


;





const filterInfoForSuburb = async (facilitiesList, optionsList, languagesList, suburbLink) => {
  return new Promise((resolve, reject) => {
      fetchSuburbsPracs(suburbLink)
      .then(data => 
         fetchAllInfoInASuburb(data)
      )
      .then((data) => {
        // apply the filters //
        data = data.filter((i) => {
          // check BB.
          if (
              getCommon(i.pracLanguages, languagesList).length > 0 &&
              getCommon(i.facilitiesList, facilitiesList).length > 0 
            ) {

              if (!optionsList.includes("TeleHealth") || 
              optionsList.includes("TeleHealth") && i.teleHealth) {
                if (!optionsList.includes("Bulk Billing") || 
                optionsList.includes("Bulk Billing") && i.bulkBill)  {
                  return i
                }

              }
            }
          })
          resolve(data);
        
  })
})
}