import { once } from "ramda";
import creds from "../configurations/drive-credentials.js";

// https://developers.google.com/drive/api/v3/quickstart/js
var CLIENT_ID = creds.web.client_id;
var API_KEY = creds.driveApiKey;

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = [
  "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest",
];

// Authorization scopes required by the API; multiple scopes can be
// included, separated by spaces.
var SCOPES = "https://www.googleapis.com/auth/drive.metadata.readonly";

var authorizeButton = document.getElementById("authorize_button");
var signoutButton = document.getElementById("signout_button");

/**
 *  On load, called to load the auth2 library and API client library.
 */
const handleClientLoad = once(function handleClientLoad() {
  debugger;
  (window as any).gapi.load("client:auth2", initClient);
});

(window as any).handleClientLoad = handleClientLoad;

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
  (window as any).gapi.client
    .init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      discoveryDocs: DISCOVERY_DOCS,
      scope: SCOPES,
    })
    .then(
      function () {
        // Listen for sign-in state changes.
        (window as any).gapi.auth2
          .getAuthInstance()
          .isSignedIn.listen(updateSigninStatus);

        // Handle the initial sign-in state.
        updateSigninStatus(
          (window as any).gapi.auth2.getAuthInstance().isSignedIn.get()
        );
        authorizeButton.onclick = handleAuthClick;
        signoutButton.onclick = handleSignoutClick;
      },
      function (error) {
        appendPre(JSON.stringify(error, null, 2));
      }
    );
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    authorizeButton.style.display = "none";
    signoutButton.style.display = "block";
    listFiles();
  } else {
    authorizeButton.style.display = "block";
    signoutButton.style.display = "none";
  }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
  (window as any).gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
  (window as any).gapi.auth2.getAuthInstance().signOut();
}

/**
 * Append a pre element to the body containing the given message
 * as its text node. Used to display the results of the API call.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPre(message) {
  var pre = document.getElementById("content");
  var textContent = document.createTextNode(message + "\n");
  pre.appendChild(textContent);
}

/**
 * Print files.
 */
function listFiles() {
  (window as any).gapi.client.drive.files
    .list({
      pageSize: 10,
      fields: "nextPageToken, files(id, name)",
    })
    .then(function (response) {
      appendPre("Files:");
      var files = response.result.files;
      if (files && files.length > 0) {
        for (var i = 0; i < files.length; i++) {
          var file = files[i];
          appendPre(file.name + " (" + file.id + ")");
        }
      } else {
        appendPre("No files found.");
      }
    });
}
// document.addEventListener("drive-client-loaded", handleClientLoad);
