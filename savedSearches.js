/*

  SavedSearches: Add a hacky way to use labels as saved searches in gmail
  - started: 3/31/2021
    - saving searches: currently using a spreadsheet for configuration
    -> possible solution for naming searches: https://www.inboxsdk.com/

*/
class SavedSearches {
  constructor() {
    // lgmail = local gmail
    this._lgmail = GmailApp;

    // params will be used as an output to this class
    this.params = { 
      label: {
        saved: [],
        object: { create: false, remove: false, },
        string: {
          create: 'saved_search::create', 
          remove: 'saved_search::remove', 
          prefix: 'saved_search>'
        }
      },
      find_user_label: (name) => this._lgmail.getUserLabelByName(name),
      create_and_add_label: (name) => {
        this._lgmail.createLabel(name);
        this.params[name] = this.params.get_user_label(name);
      },
    };

    // if the 'create' label doesn't exist create it, otherwise search for it
    this.params.label.object.create = (!this.params.find_user_label(this.params.label.string.create)) ? 
      this.params.create_and_add_label(this.params.label.string.create) :
      this.params.find_user_label(this.params.label.string.create);

    // if the 'create' label doesn't exist create it, otherwise search for it
    this.params.label.object.remove = (!this.params.find_user_label(this.params.label.string.remove)) ?
      this.params.create_and_add_label(this.params.label.string.remove) :
      this.params.find_user_label(this.params.label.string.remove);
    
    // use the output of the filters as data for 
    // filter_saved / filter_create / and filter_remove params
    this.params['saved_search_re'] = new RegExp(this.params.label.string.prefix, 'gim');
    this.params['create_label_re'] = new RegExp(this.params.label.string.create, 'gim');
    this.params['remove_label_re'] = new RegExp(this.params.label.string.remove, 'gim');

    this._searches = {};
    
    // get the full label list (as gmailLabel)
    // this only exists to retrieve the label name, so maybe 
    // just create an array of name strings
    this._searches['list'] = this._lgmail.getUserLabels();

    // filter searches 
    // these create/remove/saved filters can be deduped
    this._searches['filter_create'] = () => {
      let labelList = this._searches.list;
      let getName = (label) => label.getName();

      let collector = [];
      
      for (let i = 0; i < labelList.length; i++) {
        let item = labelList[i];
        let localItem = getName(item);

        let isSaved = (localItem.match(this.params.create_label_re));
        
        collector.push(isSaved ? item : undefined);
      };
      
      return collector.filter(Boolean);
    };
    
    this._searches['filter_remove'] = () => {
      let labelList = this._searches.list;
      let getName = (label) => label.getName();

      let collector = [];
      
      for (let i = 0; i < labelList.length; i++) {
        let item = labelList[i];
        let localItem = getName(item);

        let isSaved = (localItem.match(this.params.remove_label_re));
        
        collector.push(isSaved ? item : undefined);
      };
      
      return collector.filter(Boolean);
    };
    
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
      
      return collector.filter(Boolean);
    };
  
    this._searches['saved_searches'] = this._searches.filter_saved();
    this._searches['create_search'] = this._searches.filter_create();
    this._searches['remove_search'] = this._searches.filter_remove();
  };

  _parameters() { return this.params; };
  savedSearches() { return this._searches.saved_searches };
  findCreate() { return this._searches.create_search };
  findRemove() { return this._searches.remove_search };
};




































