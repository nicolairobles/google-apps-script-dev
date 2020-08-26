Reference: https://developers.google.com/apps-script/reference/forms

Link with sample spreadsheet data that generates the form:
https://docs.google.com/spreadsheets/d/1nU29O9O8xmpt9BFmCOHxZNaqt_gN6qG-Re4GwfU_eVg/edit#gid=0

```
function createFormQuestionsWithOptions() {
  // clear form
  deleteAllQuestions() 
  
  
  // set questionTitles by page
  var questionTitles = {
    'Expertise':'title',
    'Interest':'title',
  }
  
  
  // get options list
  var ss = SpreadsheetApp.openById('1nU29O9O8xmpt9BFmCOHxZNaqt_gN6qG-Re4GwfU_eVg')
  var sheet  = ss.getSheetByName("Skills Outline");
  var range = sheet.getDataRange();
  var lastRow = range.getLastRow();
  var values = range.getValues();
  var skillsArray = []
  var skillCategoryArray = new Set()
  var skillsObjByCategory = {}
  
  for (i = 1; i < values.length; i++){
    skillsArray.push(values[i][1])
    skillCategoryArray.add(values[i][0])
    
    // create obj of skills by category
    if( skillsObjByCategory[values[i][0]]){
      console.log("skillsObjByCategory[values[0]] exists: " + skillsObjByCategory[values[i][0]])
      console.log("adding values[1]: " + values[i][1])
      skillsObjByCategory[values[i][0]].push(values[i][1])
    } else {
      console.log("skillsObjByCategory[values[0]] instantiate: " + skillsObjByCategory[values[i][0]])
      console.log("adding initial values[1]: " + values[i][1])
      skillsObjByCategory[values[i][0]] = [values[i][1]]
    }
  }
  console.log("skillsArray: " + skillsArray)  
  console.log("skillCategoryArray: " + skillCategoryArray)  
  console.log(new Array(...skillCategoryArray).join(' '));
  console.log("skillsObjByCategory: " + JSON.stringify(skillsObjByCategory))
  
  // ensure only the latest version of the question types are in the form
  var form = FormApp.getActiveForm();   
  
  // add questions from scratch
  var questionTitlesArray = Object.keys(questionTitles)
  questionTitlesArray.map(function(questionTitle, index){
    // create page for each question type
//    form.addSectionHeaderItem().setTitle(questionTitle)
    var helperText = '(0) - Having no knowledge, (1) - Has basic knowledge, (2) - Can do with support, (3) - Has knowledge and can do independently, (4) - Good in theory and practical and can train others'

    // add a section for each skill category
    new Array(...skillCategoryArray).map(function(skillCategory){
      
      // add skills by category
      var question = form.addGridItem()
      question.setTitle(skillCategory + " " + questionTitle)
      .setRows(skillsObjByCategory[skillCategory])
      .setHelpText(helperText)
      .setColumns(['0', '1', '2', '3', '4']);
    })
    
    // only add page break on first page
    if(index >= 0 && index < questionTitlesArray.length ){
      form.addPageBreakItem()
    }
  })
  
}




function deleteQuestionByTitle() {
  
  // set questionTitles
  var questionTitle = ''
  var form = FormApp.getActiveForm(); 
  var items = form.getItems()
  items.map(function(item){
    if(item.getTitle() === questionTitle){
      form.deleteItem(item)
    }
  })
  
}


function deleteAllQuestions() {
  
  var form = FormApp.getActiveForm(); 
  var items = form.getItems()
  items.map(function(item){
      form.deleteItem(item)
  })
  
}
```