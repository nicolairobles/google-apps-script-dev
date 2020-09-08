# Google Apps Script Dev
Different projects and helper methods for Google Apps Script Development

## Contributions:
Overview: Typically you work on Google Apps Scripts in the browser, but to submit code here you need to get it on your local OR manual add edits to Github. See notes on both of these methods below.

1. **Checklist**: Use checklist as guidance for development: https://docs.google.com/spreadsheets/d/1q5Sq6SJAKlfApsggFbroME_COpCBIufUr8hzk9zJPxc/edit#gid=0
2. **Project Location**: Add your project in the appropriate folder. If you are working on a Google Docs Add-On, place your project inside google-docs > add-ons
3. **Pull Request**: When you are ready for a submission, make a pull request so I get notified and can make comments/approve your pull request.

## Alternative Contribution Method: Manual Updates
- Just edit in Github and submit pull request manually

## Using glacp cli: https://developers.google.com/apps-script/guides/clasp
- sign in to your google account: `clasp login`
- pull a script editor project to your local: 
  1. Go to your script editor project > File > Project Properties > Info > Script Id 
  2. `clasp clone {scriptId}`
  3. Pull latest changes to your local: `clasp pull` from you local folder with the project build
- pushing your local to your script editor project
  1. Log in to the correct account: `clasp login`
  2. `clasp push`
- push to this repo for pull request submission

## Resources:
- https://codelabs.developers.google.com/?cat=G+Suite
- https://www.youtube.com/watch?v=As3keJaPmmk
- https://developers.google.com/gsuite/add-ons/samples
