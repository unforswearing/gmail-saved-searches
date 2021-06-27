/*

  SavedSearches: Add a hacky way to use labels as saved searches in gmail
  - started: 3/31/2021
  - revised: 6/26/2021
    - saving searches: currently using a spreadsheet for configuration

  perform a search, select all messages that appear
  save the search by adding the "save-search" label to all messages
  the script will save the search to the configuration sheet:
 
  { 
    datetime: yyy-mm-dd-hh:mm, 
    messageids: [], 
    search: <replicate search using msg ids>, 
    name: `saved-search:${datetime}`
  }

  the  name can be changed via the configuration sheet "Name" column (the script
  will update the label name on edit)

  saved searches can be removed by using the label "delete-search", or 
  just delete the corresponding row in the configuration sheet. (the script will
  remove the label from the messages on edit)

  @todo search information can be backed up to script properties

*/

const saveLabel = GmailApp.getUserLabels().find((label) => label.getName() === 'save-search')
const delLabel = GmailApp.getUserLabels().find((label) => label.getName() === 'delete-search')

const retrieveSearches = () => Config.retrieveSearches();
const saveSearch = () =>  Config.addNewSearch();

// this function only removes searches by gmail label
// searches can also be removed by deleting the item in config sheet
// see config.gs
const removeSearch = () => Config.removeSearch();

// currently searches can only be renamed in the config sheet 
// or by manually editing the gmail label name.
// this function handles any manually update gmail label names, 
// see config for names updated in the sheet (uses onEdit trigger)
// search for saved item, check if the name is the same as default 
// listed in config, if not, update config. 
const renameSearch = () => Config.renameSearch();




























