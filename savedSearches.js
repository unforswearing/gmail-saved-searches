/*
  SavedSearches: Add a hacky way to use labels as saved searches in gmail
  - started: 3/31/2021
*/
class SavedSearches {
  /*
    from: 3/31 - 4/1
    @todo save params.label to script properties
    @todo add a list of saved searches (as strings and objects) to params.label.saved)
    @todo add newly created labels to params.label.saved
    @todo when finding msgs labeled '::create' or '::remove', 
      remove the create/remove label at some point after adding to script props
    @todo need a way to allow 'user' to name the search
  */
  constructor() {
    this._lgmail = GmailApp;
    this.params = { 
      label: {
        object: { create: false, remove: false, },
        string: {
          create: 'saved_search::create', remove: 'saved_search::remove', 
          prefix: 'saved_search>'
        }
      },
      saved_search_re: new RegExp(/^saved_search:(!?=:)/, 'gim'),
      find_user_label: (name) => this._lgmail.getUserLabelByName(name),
      create_and_add_label: (name) => {
        this._lgmail.createLabel(name);
        this.params[name] = this.params.get_user_label(name);
      },
    }
    this.params.label.object.create = (!this.params.find_user_label(this.params.label.string.create)) ? 
      this.params.create_and_add_label(this.params.label.string.create) :
      this.params.find_user_label(this.params.label.string.create);
    this.params.label.object.remove = (!this.params.find_user_label(this.params.label.string.remove)) ?
      this.params.create_and_add_label(this.params.label.string.remove) :
      this.params.find_user_label(this.params.label.string.remove);
    this._searches = {};
    this._searches['list'] = this._lgmail.getUserLabels();
    this._searches['filter_create'] = () => {};
    this._searches['filter_remove'] = () => {};
    this._searches['filter_saved'] = () => {
      let labelList = this._searches.list;
      let getName = (label) => label.getName();
      let collector = [];
      for (let i = 0; i < labelList.length; i++) {
        let item = labelList[i];
        let localItem = getName(item);
        let isSaved = (localItem.match(this.params.saved_search_re));
        collector.push(isSaved ? item : undefined);
      };
      let cleanup = () => {
        delete this._searches.list;
        delete this._searches.filter_saved;
        delete this._lgmail;
        return collector.filter(Boolean);
      };
      return { cleanup: cleanup };
    };
    this._searches['saved_searches'] = this._searches.filter_saved().cleanup();
  };
  _parameters() { return this.params; };
  labels() { return this._searches.saved_searches };
  findNew() {};
  add() {};
  remove() {};
};

function manageSavedSearches() {
  let savesrch = new SavedSearches();
  let labels = savesrch.labels();

  Logger.log(savesrch)
  Logger.log(labels)
  Logger.log(savesrch._parameters())

  /*
    manage labels in this function - use on trigger, 
    exec the find / add / remove / etc funcs
  */

}



































