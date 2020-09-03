/**
 * @OnlyCurrentDoc
 *
 * The above comment directs Apps Script to limit the scope of file
 * access for this add-on. It specifies that this add-on will only
 * attempt to read or modify the files in which the add-on is used,
 * and not all of the user's files. The authorization request message
 * presented to users will reflect this limited scope.
 */

/**
 * A global constant String holding the title of the add-on. This is
 * used to identify the add-on in the notification emails.
 */
var ADDON_TITLE = "Forms to Trello";
var trelloKey = PropertiesService.getScriptProperties().getProperty('TRELLO_KEY'); // Get from https://trello.com/app-key

/**
 * A global constant 'notice' text to include with each email
 * notification.
 */
var NOTICE =
  "The number of notifications this add-on produces are limited by the" +
  "owner's available email quota; it will not send email notifications if the" +
  "owner's daily email quota has been exceeded. Collaborators using this add-on on" +
  "the same form will be able to adjust the notification settings, but will not be" +
  "able to disable the notification triggers set by other collaborators.";

/**
 * Adds a custom menu to the active form to show the add-on sidebar.
 *
 * @param {object} e The event parameter for a simple onOpen trigger. To
 *     determine which authorization mode (ScriptApp.AuthMode) the trigger is
 *     running in, inspect e.authMode.
 */
function onOpen(e) {
  FormApp.getUi()
    .createAddonMenu()
    .addItem("Configure", "showSidebar")
    .addToUi();
}

/**
 * Runs when the add-on is installed.
 *
 * @param {object} e The event parameter for a simple onInstall trigger. To
 *     determine which authorization mode (ScriptApp.AuthMode) the trigger is
 *     running in, inspect e.authMode. (In practice, onInstall triggers always
 *     run in AuthMode.FULL, but onOpen triggers may be AuthMode.LIMITED or
 *     AuthMode.NONE).
 */
function onInstall(e) {
  ScriptApp.newTrigger("respondToFormSubmit")
    .forForm(FormApp.getActiveForm())
    .onFormSubmit()
    .create();

  onOpen(e);
}

/**
 * Save sidebar settings to this form's Properties, and update the onFormSubmit
 * trigger as needed.
 *
 * @param {Object} settings An Object containing key-value
 *      pairs to store.
 */
function saveSettings(settings) {
  PropertiesService.getDocumentProperties().setProperties(settings);
}

/**
 * Opens a sidebar in the form containing the add-on's user interface for
 * configuring the notifications this add-on will produce.
 */
function showSidebar() {
  var ui = HtmlService.createHtmlOutputFromFile("sidebar").setTitle(
    ADDON_TITLE
  );
  FormApp.getUi().showSidebar(ui);
}

/**
 * Responds to a form submission event if an onFormSubmit trigger has been
 * enabled.
 *
 * @param {Object} e The event parameter created by a form
 *      submission; see
 *      https://developers.google.com/apps-script/understanding_events
 */
function respondToFormSubmit(e) {
  var authInfo = ScriptApp.getAuthorizationInfo(ScriptApp.AuthMode.FULL);
  var form = FormApp.getActiveForm();
  var settings = PropertiesService.getDocumentProperties();
  var userId = settings.getProperty("userId");
  var token = settings.getProperty("token");
  var list = settings.getProperty("list");
  var dueDate = null;
  var email = "";
  var data = form.getItems().map((item) => {
    if (item.getTitle() === "Due Date") {
      dueDate = e.response.getResponseForItem(item).getResponse();
      return;
    }
    if (item.getTitle() === "Email Address") {
      email = e.response.getResponseForItem(item).getResponse();
      return;
    }
    return [item.getTitle(), e.response.getResponseForItem(item).getResponse()];
  });

  // Check if the actions of the trigger require authorizations that have not
  // been supplied yet -- if so, warn the active user via email (if possible).
  // This check is required when using triggers with add-ons to maintain
  // functional triggers.
  if (
    authInfo.getAuthorizationStatus() == ScriptApp.AuthorizationStatus.REQUIRED
  ) {
    // Re-authorization is required. In this case, the user needs to be alerted
    // that they need to reauthorize; the normal trigger action is not
    // conducted, since authorization needs to be provided first. Send at
    // most one 'Authorization Required' email a day, to avoid spamming users
    // of the add-on.
    sendReauthorizationRequest();
  } else {
    // All required authorizations have been granted, so continue to respond to
    // the trigger event.

    generateTrelloCard(userId, email, dueDate, data, token, list);

    // Check if the form creator needs to be notified; if so, construct and
    // send the notification.
    if (settings.getProperty("creatorNotify") == "true") {
      sendCreatorNotification();
    }

    // Check if the form respondent needs to be notified; if so, construct and
    // send the notification. Be sure to respect the remaining email quota.
    if (
      settings.getProperty("respondentNotify") == "true" &&
      MailApp.getRemainingDailyQuota() > 0
    ) {
      sendRespondentNotification(e.response);
    }
  }
}

/**
 * Called when the user needs to reauthorize. Sends the user of the
 * add-on an email explaining the need to reauthorize and provides
 * a link for the user to do so. Capped to send at most one email
 * a day to prevent spamming the users of the add-on.
 */
function sendReauthorizationRequest() {
  var settings = PropertiesService.getDocumentProperties();
  var authInfo = ScriptApp.getAuthorizationInfo(ScriptApp.AuthMode.FULL);
  var lastAuthEmailDate = settings.getProperty("lastAuthEmailDate");
  var today = new Date().toDateString();
  if (lastAuthEmailDate != today) {
    if (MailApp.getRemainingDailyQuota() > 0) {
      var template = HtmlService.createTemplateFromFile("authorizationEmail");
      template.url = authInfo.getAuthorizationUrl();
      template.notice = NOTICE;
      var message = template.evaluate();
      MailApp.sendEmail(
        Session.getEffectiveUser().getEmail(),
        "Authorization Required",
        message.getContent(),
        {
          name: ADDON_TITLE,
          htmlBody: message.getContent(),
        }
      );
    }
    settings.setProperty("lastAuthEmailDate", today);
  }
}

function generateTrelloCard(id, email, dueDate, data, token, list) {
  //  set up data to send to Trello API
  var cardData = {
    name: "Form Submission: " + email, //(required) Valid Values: a string with a length from 1 to 16384
    desc: data.reduce(
      (acc, item) => (item ? `${acc}\n**${item[0]}:** ${item[1]}` : ""),
      "Form Responses:\n----------------"
    ), //(optional )Valid Values: a string with a length from 0 to 16384
    pos: "top", //(optional) Default: bottom Valid Values: A position. top, bottom, or a positive number.
    due: dueDate || null, //(required) Valid Values: A date, or null
    idList: list, //(required)Valid Values: id of the list that the card should be added to
    idMembers: id || null, //(optional)Valid Values: A comma-separated list of objectIds, 24-character hex strings
    idLabels: null, //(optional)
  };
  var trelloAPIUrl =
    "https://api.trello.com/1/cards?key=" +
    trelloKey +
    "&token=" +
    token +
    "&scope=read,write,account"; //optional... -&cards=open&lists=open'-
  var options = { method: "post", payload: cardData };

  //  make trello API call
  var responseData = UrlFetchApp.fetch(trelloAPIUrl, options);
}
