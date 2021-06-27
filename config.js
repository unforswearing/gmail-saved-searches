// function createConfigSheet() {}

globalThis.configSheetId = '1qVGGOCsHX9lhQcQ8-0VhpT2kf6l-2eNhDWEaGL4VICM'

const config_util = {
  loadConfigSheet: (globalThis) => SpreadsheetApp.openById(globalThis.configSheetId),
  generate_messge_config_obj: () => {},
  format_message_info_for_sheet: () => {},
  store_searches_in_properties: (infoObject) => {
    // searchname: { infoObject }
  },
}

const searchConfigObject = config_util.generate_messge_config_obj()

function addNewSavedSearch(searchInfoObject) {
  // use ..format_mesage_info_for_sheet to help format info
  // for configuration sheet
  const labels = GmailApp.getUserLabels()
  let newSavedSearches = []
  for (var n in labels) {
    let label = labels[n]
    if (label.getName() === 'save-search') newSavedSearches.push(label)
  }

  if (!newSavedSearches) return;

  // generate info object, create default name, etc
}


function renameSavedSearch(searchInfoObject) {
  // update search name from default to user specified
  // this function only applies to names changed in the config sheet. 
  // for names changed by manually updating the label, see savedSearches.gs
}

function removeSavedSearch(searchInfoObject) {
  // this function only removes searches from 

}

class Config {
  constructor() {
    sheetId = globalThis.configSheetId
    addNewSearch = addNewSavedSearch
    renameSearch = renameSavedSearch
    removeSearch = removeSavedSearch
  }
}

globalThis.config = new Config();


