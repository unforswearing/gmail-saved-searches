// function createConfigSheet() {}

// logging create_save_label alone will return an empty object
// use a label method (eg. getName()) to use the return value
const search_util = {
  create_save_label: () => {
    return GmailApp.createLabel('save-search')
  },
  create_delete_label: () => {
    return GmailApp.createLabel('delete-search')
  }
}

/** @type {string} */
globalThis.configSheetId = '1qVGGOCsHX9lhQcQ8-0VhpT2kf6l-2eNhDWEaGL4VICM'

/** @type {object} */
globalThis.spreadsheet = SpreadsheetApp.openById(globalThis.configSheetId)

// 'store' uses script properties to store the saved search info
/**
 * @return {object}
 */
const store = () => {
  /** @type {object} */
  const props = PropertiesService().getScriptProperties();

  return {
    read: (key) => props.getProperty(key),
    write: (key, value) => props.setProperty(key, value),
  };
};

/** @return {Object} */
const config_util = () => {
  let config_params = {
    /**
     * @argument {object} infoObject
     * @return {Array}
     */
    format_search_info_for_sheet: (infoObject) => {
      let info = [
        [
          infoObject.datetime,
          infoObject.messageIds,
          "search terms",
          infoObject.datetime,
        ],
      ];

      return info
    }, config_sheet: {
      // columnHeader: ["datetime", "messageIds", "search", "title"],
      // @todo fix this
      lastRange: () => {
        'A1:' + globalThis.spreadsheet.getLastRow() + globalThis.spreadsheet.getLastCol()
      },
    } 
  }
  return config_params
};

/** @return {Array} */
function retrieveSavedSearches() {
  let sheet = globalThis.spreadsheet
  let lastRange = config_util().config_sheet.lastRange()
  const configData = sheet.getRange(lastRange).getValues();
  return configData
}

/**
 * @argument {object} searchInfoObject
 * @return {void}
 */
function addNewSavedSearch(searchInfoObject) {
  // use ..format_mesage_info_for_sheet to help format info
  // for configuration sheet
  const labels = GmailApp.getUserLabels();
  let newSavedSearches = [];
  for (var n in labels) {
    let label = labels[n];
    if (label.getName() === "save-search") newSavedSearches.push(label);
  }

  if (!newSavedSearches) return;
  // generate info object, create default name, etc

  /*
    { 
    datetime: yyy-mm-dd-hh:mm, 
    messageids: [], 
    search: <replicate search using msg ids>, 
    name: `saved-search:${datetime}`
  }
  */

  /** @type {Date} */
  const now = new Date().getTime();

  /** @type {string} */
  const datetime = `saved-search:${now}`;

  let container = {};

  let tmpObj = {
    /** @type {Date} */
    datetime: now,
    /** @type {string} */
    search: undefined,
    /** @type {Array} */
    messageIds: [],
    /** @type {string} */
    title: datetime,
  };

  /** @type {object} */
  container[now] = tmpObj;

  store().write(datetime, container)
}

// @todo finish this once the basic functions work (add/delete searches)
/**
 * @argument {object} searchInfoObject
 * @return {object}
 */
function renameSavedSearch(searchInfoObject) {
  // update search name from default to user specified
  // this function only applies to names changed in the config sheet.
  // for names changed by manually updating the label, see savedSearches.gs
}

/**
 * @argument {object} searchInfoObject
 * @return {object}
 */
function removeSavedSearch(searchInfoObject) {
  // this function only acts on searches removed from the spreadsheet
}

Config = {
  sheetId: globalThis.configSheetId,
  sheet: globalThis.spreadsheet,
  retrieveSearches: retrieveSavedSearches,
  addNewSearch: addNewSavedSearch,
  renameSearch: renameSavedSearch,
  removeSearch: removeSavedSearch,
}

globalThis.config = Config;





















