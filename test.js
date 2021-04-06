function test() {
  let savesrch = new SavedSearches();
  // let labels = savesrch.labels();
  // add() {};
  // remove() {};

  Logger.log(savesrch.findCreate())
  Logger.log(savesrch.findRemove())
  Logger.log(savesrch.savedSearches())
}
