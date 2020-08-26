// ENV Variables can be stored as properties
// They can be set in File > Project Properties > Script Properties

var TRELLO_KEY = PropertiesService.getScriptProperties().getProperty('TRELLO_KEY');
var TRELLO_TOKEN = PropertiesService.getScriptProperties().getProperty('TRELLO_TOKEN');