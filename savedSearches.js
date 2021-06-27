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

// function createConfigSheet() {}

/** @type {Date} */
const now = new Date().getTime();

/** @type {string} */
const datetime = `saved-search:${now}`;

/** @type {string} */
const configSheetId = '1qVGGOCsHX9lhQcQ8-0VhpT2kf6l-2eNhDWEaGL4VICM'

/** @type {object} */
const spreadsheet = SpreadsheetApp.openById(globalThis.configSheetId)

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
    // logging create_save_label alone will return an empty object
    // use a label method (eg. getName()) to use the return value
    create_save_label: () => GmailApp.createLabel('save-search'),
    create_delete_label: () => GmailApp.createLabel('delete-search'),
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
    /**
     * @type {object}
     */
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
  let lastRange = config_util().config_sheet.lastRange()
  const configData = spreadsheet.getRange(lastRange).getValues();
  return configData
}

/** @return {object} */
function findNewSavedSearchMessages() {

  /** @return {Array} */
  const getThreadIds = (label) => {
    let labelThreads = label.getThreads()
    let collector = []
    for (let i = 0; i < labelThreads.length; i++) {
      let thread = labelThreads[i]
      let threadMessages = GmailApp.getMessagesForThread(thread);
      collector.push(threadMessages.map((item) => item.getId))
    }
    return collector
  }

  /** @type {Array} */
  let labels = GmalApp.getUserLabels()
  let collector = []

  for (let i = 0; i < labels.length; i++) {
    let l = labels[i]

    if (l.getName() === 'save-search') {
      collector.push({
        datetime: now,
        messageIds: getThreadIds(),
        searchTerm: undefined,
        title: datetime
      })
    }
  }

  return collector
}

/**
 * @argument {object} searchInfoObject
 * @return {void}
 */
function addNewSavedSearch(searchInfoObject) {
  // use ..format_mesage_info_for_sheet to help format info
  // for configuration sheet
  const labels = config_util().user_labels()
  let newSavedSearches = [];
  for (var n in labels) {
    let label = labels[n];
    if (label.getName() === 'save-search') newSavedSearches.push(label);
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

const config = {
  sheetId: globalThis.configSheetId,
  sheet: globalThis.spreadsheet,
  retrieveSearches: retrieveSavedSearches,
  addNewSearch: addNewSavedSearch,
  renameSearch: renameSavedSearch,
  removeSearch: removeSavedSearch,
}




























