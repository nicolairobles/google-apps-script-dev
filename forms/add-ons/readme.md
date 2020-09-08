# Publishing Add-Ons in the GSuite Marketplace
https://developers.google.com/gsuite/add-ons/how-tos/publishing-gsuite-addons

## Step 1: Configure your add-on’s OAuth consent screen
After a user installs your add-on, they’re presented with a dialog that describes the requested permissions. You can customize some of the elements in this dialog to improve the user experience.

- Open the Google Cloud Platform console.
- At the top, make sure the Google Cloud Platform project associated with your add-on is selected.
- At the top-left, click Menu menu > APIs & Services > OAuth Consent Screen.
- Add details about your add-on, like application name and support email. These values must match what you display in your G Suite Marketplace listing and add-on manifest; use the text assets you collected as part of the add-on publication requirements.

## Step 2: Prepare your add-on for review
All G Suite add-ons, whether an upgraded add-on or one built from scratch, must be approved before they can be listed in the G Suite Marketplace.

Follow these steps to prepare your add-on for review:

- Make sure your add-on fulfills all of the add-on publishing requirements, with special attention to the user data protection requirements.
- Create a versioned deployment of your add-on using the version of the code you want to publish. Do not attempt to publish using a head deployment. Record the deployment ID for use later.
- Share your Apps Script project with addonsreviewer2@gmail.com to ensure that the add-on review team can view (not edit) the code and provide feedback.
- Request OAuth verification. You must show that you have ownership of a domain and a privacy policy hosted within that domain.
  - Most verification requests receive a response within 24 to 72 hours.
    - The verification process for sensitive scopes can take 3-5 days to account for clarification questions and re-submissions.
    - The verification process for restricted scopes can take longer to complete, likely several weeks.
  - User access to the add-on for existing approved scopes is not impacted during the verification process.
  - You can check your verification status in Google Cloud Platform at the top of your project’s OAuth consent screen.
  - You can continue to the next step while you wait for OAuth verification to complete. Your app won't be published until it is verified and the listing is approved.

## Step 3: Enable the G Suite Marketplace SDK
All add-ons published to the G Suite Marketplace have listings that describe the add-ons to potential users. Before you can create your listing, you must enable the G Suite Marketplace SDK for your add-on:

- Open the Google Cloud Platform console.
- At the top, make sure the Google Cloud Platform project associated with your add-on is selected.
- At the top-left, click Menu menu > APIs & Services > Dashboard.
- In the API dashboard, click Enable APIs and Services.
- In the Search for APIs & services search bar, type "G Suite Marketplace SDK". Then, select the API.
- In the API listing that opens, click Enable. After a moment the SDK overview control panel opens.

## Step 4: Configure your G Suite Marketplace listing
The G Suite Marketplace SDK settings page has four panels: Overview, Configuration, Publish, and Usage. Follow the steps below to build your add-on's listing and start a publication request:

- Open the G Suite Marketplace SDK control panel.
- On the left, click Configuration to open the configuration panel. This panel contains a form where you provide information about your add-on.
- Complete the form using the required assets. Some of the form elements are optional, but providing them can improve your add-on's user experience.
  - Where indicated, provide localized assets for each language you intend to publish the add-on in.
  - Check the Enable individual install checkbox if you want to allow individual installs.
  - Under OAuth 2.0 Scopes, include every scope listed in your add-on's Apps Script project's manifest.
  - Under Extensions, check the G Suite Add-ons Extension checkbox. In the textbox that appears, enter the new deployment ID you created in step 2 for your G Suite add-on. If your deployment ID is valid, a list of supported hosts appears.
  - Under Visibility, select Public.
- Verify that the information you've entered in the form is correct. Then, click Save changes.
- On the left, click Publish to open the publishing panel.
- Complete the form using the required assets. Some of the form elements are optional, but providing them can improve your add-on's user experience.
  - Where indicated, provide localized assets for each language you intend to publish the add-on in.
  - In the Reach section, select an appropriate category for your add-on to help users locate it in the Marketplace. Also select the regions and countries where you want Marketplace to present your add-on. It's best practice to provide localized assets for each language used in the regions you select.
- Review the information you’ve entered. You won’t be able to modify any of the fields until a final review is completed, so make sure you double-check all fields.
- Click Publish. Your add-on configuration is now automatically sent for final review. Within 2-3 business days, a review team member will send you an email to confirm whether your add-on has been approved and published to the marketplace or whether it needs more work.

# Publishing Requirements
https://developers.google.com/gsuite/add-ons/concepts/gsuite-publishing-requirements

## General requirements
Make sure your add-on meets the following general requirements before attempting to publish:

- Completeness. The add-on must be fully functional. It can't be a “work in progress.”
- Testing. The script has been tested with multiple active users as an unpublished add-on.
- Naming. The script's project name is the same as the name intended for publication (the script name appears in the authorization dialog).
- Style. Follow the recommendations in the add-on style guide.
- Collaborators. If you are collaborating with others to build and maintain this add-on, be sure to configure your project collaborator access settings.

## Technical requirements
Make sure your add-on meets the following technical requirements before attempting to publish:

- Standard Cloud Platform (GCP) project. The add-on must use a standard GCP project. If the add-on is using a default GCP project, switch to a standard GCP project. All collaborators working on the add-on should have access to the standard GCP project.
- Manifest. The add-on script project must include a well-defined manifest.
- Libraries. The add-on does not use libraries unnecessarily, which can cause the add-on to run slowly in some cases.
- Error handling. The add-on script has error-handling and shows relevant error messages to the user.
- Hosted images. All users of the add-on can access any hosted image used in your add-on or its OAuth consent screen.
- Versioned deployment. The add-on has a versioned deployment to be used for publication. Do not use head deployments for published add-ons. When you update your add-on, create a new script project version and edit the versioned deployment to use that version number.
- Homepage and contextual trigger functions. If your add-on defines any contextual triggers or homepage triggers in its manifest, the add-on must implement the corresponding trigger functions.
- Universal actions. Any universal actions used in your add-on script must specified in the manifest and implemented.
- OAuth flow. If your add-on connects to non-Google services using OAuth, ensure it handles the OAuth authorization flow correctly.

## User data protection requirements
The following requirements help to ensure that user data is protected while they use your add-on. Any add-on that fails to sufficiently protect user information cannot pass review for publication.

- Scopes. You must set explicit scopes in the add-on manifest, choosing the narrowest scopes possible. Never have the add-on ask the user for more permissions than it actually needs. See Scopes for lists of scopes often used with G Suite add-ons extending different host applications.
 - Note: Many Gmail scopes require temporary access tokens. Others are restricted and should be avoided if possible.
- UrlFetch whitelist. If the add-on script uses UrlFetch to retrieve data, you must whitelist the URLs it accesses using the urlFetchWhitelist manifest field. Restrict the URLs the add-on fetches to the following:
  - Legitimate third-party APIs,
  - Sets of private endpoints you control, and
  - Authorization endpoints that enable OAuth flows.
- Open link whitelist. If your add-on script makes use of OpenLink actions, you must whitelist the URLs it opens using the addOns.common.openLinkUrlPrefixes field in the add-on manifest. This whitelist restricts what URLs the add-on can open. If your script code opens URLs that aren't whitelisted, you can't create or edit versioned deployments of your add-on. If your add-on functionality demands it, you can use a single * character as wildcard to match all links in the whitelist.
  - Warning: Using * wildcards in your open link whitelist can potentially expose your user's data to risk and can prolong the add-on review process. Be certain that you only use wildcards when absolutely necessary for the functionality of the add-on.
- File access changes. If your add-on needs to update the access control list (ACL) of a G Suite or third-party file, it must inform the user it is doing so. ACL changes can't be handled silently in the background. For example, an add-on can't silently add email recipients to the set of accounts that can view a Dropbox file. Instead, the add-on should inform the user about the ACL change the add-on wishes to make and ask the user to confirm the change. Add-ons that don't inform users of such changes can't pass add-on review.



# Connecting to non-Google APIs
https://developers.google.com/gsuite/add-ons/how-tos/non-google-services#using_an_oauth_service

When using an OAuth service object to connect to a non-Google service, your G Suite add-on needs to detect when authorization is required and, when it is, invoke the authorization flow.

The authorization flow consists of:

Alerting the user that auth is needed and providing a link to start the process.
Acquiring authorization from the non-Google service.
Refreshing the add-on to retry accessing the protected resource.
When non-Google authorization is needed, the G Suite add-on infrastructure handles these details. Your add-on only needs to detect when authorization is needed and invoke the authorization flow when necessary.

# Testing A GSuite Add-On
https://developers.google.com/gsuite/add-ons/how-tos/testing-gsuite-addons

Follow these steps to install an unpublished G Suite add-on for testing:

Open the add-on's script project in the Apps Script editor.
Select Publish > Deploy from manifest... to open the Deployments dialog.
In the Latest Version (Head) row, click Install add-on to install the currently saved version of the add-on in development-mode. If you install the Latest Version (Head) of the add-on, any changes you make to the add-on code are applied immediately without you needing to reinstall it.
Alternatively, you can create a versioned deployment and install that instead. This can be helpful if you want to 'checkpoint' a version of the add-on to compare it to the version under development.
You can allow other users to test the add-on by sharing the Apps Script project with their account (read access is required) and then prompting the users to follow the above steps.

# Updating a Published Add-On
https://developers.google.com/gsuite/add-ons/how-tos/update-gsuite-addons#update_published_add-on_code

After an add-on is published, it appears in the G Suite Marketplace. You can update the code of a published add-on to create a new version and 
deploy it without republishing. Creating a new add-on version this way does not require another round of add-on review.

If you want to make a change to your add-on's code after publishing, follow these steps:

- Make the changes you want in the add-on's script project.
- If you made changes that added or removed scopes to the script project, you must update the scopes listed to in the G Suite Marketplace SDK Configuration panel to exactly match the scopes listed in the add-on's project manifest.
- Using a head deployment, verify that the changes you made are working as intended by testing the add-on. You can install the new, unpublished version to test it.
- If a code update changes the scopes used by the add-on after publication, you must file a new request for OAuth verification. Once re-verification is complete, make sure the OAuth scopes listed in the add-on manifest and in the G Suite Marketplace listing match the newly verified scope list. Failing to do so results in an unverified app warning being displayed to your users.
- Once you are certain the updated add-on is functioning correctly, create a new script project version to correspond to this update.
- In the Apps Script editor, update the versioned deployment to use the new script project version you just created.
- Once the deployment is saved, the new version replaces the previous one. It may take some time before the change registers for a given user.
