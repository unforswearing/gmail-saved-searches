// function createConfigSheet() {}
import { join } from "path";
import { Low, JSONFile } from "lowdb";
import { SHARE_ENV } from "worker_threads";
import { Script } from "vm";

globalThis.configSheetId = '1qVGGOCsHX9lhQcQ8-0VhpT2kf6l-2eNhDWEaGL4VICM'
globalThis.spreadsheet = SpreadsheetApp.openById(globalThis.configSheetId)

const store = () => {
  /** @type {string} */
  const dbPath = (__dirname, "db.json");

  let dbFile = new JSONFile(dbPath);
  let database = new Low(dbFile);

  await database.read();

  /** @type {Object} */
  database.data ||= {};

  return {
    read: database.read,
    write: database.write,
    data: database.data,
  };
};

const configSheetParameters = {
  columnHeader: ["datetime", "messageIds", "search", "title"],
  lastRange: globalThis.spreadsheet.getLastRow() + globalThis.spreadsheet.getLastCol(), 

}

/** @return {Object} */
const config_util = {
  loadConfigSheet: (globalThis) => {},
  generate_search_info_obj: (savedSearchDataRange) => {

  },
  format_search_info_for_sheet: (infoObject) => {
    let container = [];
    let info = [
      infoObject.datetime,
      infoObject.messageIds,
      "search terms",
      infoObject.datetime,
    ];
    /** @type {Array} */
    return container[info];
  },
  store_searches_in_properties: (infoObject) => {
    let formattedObject = store().write(infoObject)
    PropertiesService().getScriptProperties().setProperty(infoObject.datetime, formattedObject)
  },
};

/** @type {object} */
const searchConfigObject = config_util.generate_messge_config_obj();

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
  // generate info object, create default name,  expect(1).toBe(2)

  /*
    { 
    datetime: yyy-mm-dd-hh:mm, 
    messageids: [], 
    search: <replicate search using msg ids>, 
    name: `saved-search:${datetime}`
  }
  */

  const now = `saved-search:${new Date().getTime()}`

  let container = {}

  let tmpObj = {
    /** @type {Date} */
    datetime: undefined,
    /** @type {string} */
    search: undefined,
    /** @type {Array} */
    messageIds: [],
    /** @type {string} */
    title: now,
  };

  container[now] = tmpObj

  // store().write(container);
  const searchhInfoArray = config_util.format_search_info_for_sheet(container)

}

// @todo finish this once the basic functions work (add/delete searches)
function renameSavedSearch(searchInfoObject) {
  // update search name from default to user specified
  // this function only applies to names changed in the config sheet.
  // for names changed by manually updating the label, see savedSearches.gs

}

// @todo finish this once the basic functions work (add/delete searches)
function removeSavedSearch(searchInfoObject) {
  // this function only removes searches from
}

class Config {
  constructor() {
    sheetId = globalThis.configSheetId;
    addNewSearch = addNewSavedSearch;
    renameSearch = renameSavedSearch;
    removeSearch = removeSavedSearch;
  }
}

globalThis.config = new Config();
