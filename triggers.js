const scriptLabels = { 
  save: GmailApp.getUserLabels().find((label) => label.getName() === 'save-search'),
  del: GmailApp.getUserLabels().find((label) => label.getName() === 'delete-search'),
}

function onEdit() {
  // check if the range is the name col
  // check if each name contains the default name
  // if not, use the edited / updated name to 
  // update the gmail label title (updateGmailLabelTitle())
}

function updateGmailLabelTitle() {

}

function findNewOrDeletedSearches() {
  // runs on a trigger every minute to find new and deleted searches.
  // i could maybe have multiple of these in order to check 
  // every 5-10 seconds or so (5 seconds = 12 triggers, 
  // 10 seconds = 6 triggers)

    /** @type {Array} */
  let newlySaved = findNewSavedSearchMessages()
  if (newlySaved) {
    for (var i = 0; i < newlySaved.length; i++) {
      // create searchinfo object
      // addNewSavedSearch(searchInfoObject)
    }
  }
}

// this function only removes searches by gmail label
// searches can also be removed by deleting the item in config sheet
// see config.gs
const removeSearch = '';

// currently searches can only be renamed in the config sheet 
// or by manually editing the gmail label name.
// this function handles any manually update gmail label names, 
// see config for names updated in the sheet (uses onEdit trigger)
// search for saved item, check if the name is the same as default 
// listed in config, if not, update config. 
const renameSearch = '';




















