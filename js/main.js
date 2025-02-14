
class EventEmitter {
    constructor() {
        this._events = {};
    }
    on(evt, listener) {
        (this._events[evt] || (this._events[evt] = [])).push(listener);
        return this;
    }
    emit(evt, arg) {
        (this._events[evt] || []).slice().forEach(lsn => lsn(arg));
    }
}
// Model
class ListModel extends EventEmitter {
    constructor(items) {
        super();
        this._items = items || [];
        this._selectedIndex = -1;
    }

    getItems() {
        return this._items.slice();
    }

    addItem(item) {
        this._items.push(item);
        this.emit('itemAdded', item);
    }

    removeItemAt(index) {
        const item = this._items.splice(index, 1)[0];
        this.emit('itemRemoved', item);
        if (index === this._selectedIndex) {
            this.selectedIndex = -1;
        }
    }
    // changeItemAt(index){
    //     const item = this._items.splice(index, 1)[0];
    //     this.emit('itemChanged', item);
    //     if (index === this._selectedIndex) {
    //         this.selectedIndex = -1;
    //     }
    // }


    get selectedIndex () {
        return this._selectedIndex;
    }

    set selectedIndex(index) {
        const previousIndex = this._selectedIndex;
        this._selectedIndex = index;
        this.emit('selectedIndexChanged', previousIndex);
    }
}
//  View
class ListView extends EventEmitter {
    constructor(model, elements) {
        super();
        this._model = model;
        this._elements = elements;

        // attach model listeners
        model.on('itemAdded', () => this.rebuildList())
            .on('itemRemoved', () => this.rebuildList())
            .on('itemChanged',()=> this.rebuildList());

        // attach listeners to HTML controls
        elements.list.addEventListener('change',
            e => this.emit('listModified', e.target.selectedIndex));
        elements.addButton.addEventListener('click',
            () => this.emit('addButtonClicked'));
        elements.delButton.addEventListener('click',
            () => this.emit('delButtonClicked'));
        // elements.changeButton.addEventListener('click',
        //     () => this.emit('changeButtonClicked'));
    }

    show() {
        this.rebuildList();
    }

    // changeProduct(){
    // }

    rebuildList() {
        const list = this._elements.list;
        list.options.length = 0;
        this._model.getItems().forEach(
            item => list.options.add(new Option(item)));
        this._model.selectedIndex = -1;
    }
}

// Controller
class ListController {
    constructor(model, view) {
        this._model = model;
        this._view = view;

        view.on('listModified', idx => this.updateSelected(idx));
        view.on('addButtonClicked', () => this.addItem());
        view.on('delButtonClicked', () => this.delItem());
        // view.on('changeButtonClicked', () => this.changeItem());
    }

    addItem() {
        const item = window.prompt('Add item:', '');
       try {
           if (item) {
               this._model.addItem(item);
           }else throw 'Error!'
       } catch (e) {
           console.log('It`s empty! You must enter some product!');
       }
       
    }

    delItem() {
        const index = this._model.selectedIndex;
        if (index !== -1) {
            this._model.removeItemAt(index);
        }
    }
   /* changeItem(){
        const index = this._model.selectedIndex;
        if (index !== -1) {
            this._model.changeItemAt(index);
        }
    }
*/
    updateSelected(index) {
        this._model.selectedIndex = index;
    }
}

window.addEventListener('load', () => {
    const model = new ListModel(['iphone 7 (300$)', 'iphone 8 (400$)', ' intel core i5 (200$)', " intel core i7 (350$)" , "iphone X (600$)"]),
        view = new ListView(model, {
            'list' : document.getElementById('list'),
            'addButton' : document.getElementById('plusBtn'),
            'delButton' : document.getElementById('minusBtn'),
            // 'changeButton' : document.getElementById('changeBtn')
        }),
        controller = new ListController(model, view);

    view.show();
});



