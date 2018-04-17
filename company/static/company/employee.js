Ext.onReady(function () {
  Ext.define('TechZoo.model.Book', {
    extend: 'Ext.data.Model',
    fields: [
      {name: 'title', type: 'string'},
      {name: 'author',  type: 'string'},
      {name: 'price', type: 'int'},
      {name: 'qty',  type: 'int'}
    ]
  });

  Ext.define('TechZoo.store.Books', {
    extend  : 'Ext.data.Store',
    model   : 'TechZoo.model.Book',
    fields  : ['title', 'author','price', 'qty'],
    data    : [
      { title: 'JDBC, Servlet and JSP', 
        author: 'Santosh Kumar', price: 300, qty : 12000 },
      { title: 'Head First Java', 
        author: 'Kathy Sierra', price: 550, qty : 2500 },
      { title: 'Java SCJP Certification', 
        author: 'Khalid Mughal', price: 650, qty : 5500 },
      { title: 'Spring and Hinernate', 
        author: 'Santosh Kumar', price: 350, qty : 2500 },
      { title: 'Mastering C++', 
        author: 'K. R. Venugopal', price: 400, qty : 1200 }
    ]
  });

  Ext.define('TechZoo.view.BooksList', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.bookslist',
    title: 'Books List - (ExtJS 4 CRUD example - @ Tousif Khan)',
    store: 'Books',
    initComponent: function () {
      this.tbar = [{
        text    : 'Add Book',
        action  : 'add',
        iconCls : 'book-add'
      }];
      this.columns = [
        { header: 'Title', dataIndex: 'title', flex: 1 },
        { header: 'Author', dataIndex: 'author' },
        { header: 'Price', dataIndex: 'price' , width: 60 },
        { header: 'Quantity', dataIndex: 'qty', width: 80 },
        { header: 'Action', width: 50,
          renderer: function (v, m, r) {
            var id = Ext.id();
            var max = 15;
            Ext.defer(function () {
              Ext.widget('image', {
                renderTo: id,
                name: 'delete',
                src : 'images/book_delete.png',
                listeners : {
                  afterrender: function (me) { 
                    me.getEl().on('click', function() {
                      var grid = Ext.ComponentQuery.query('bookslist')[0];
                      if (grid) {
                        var sm = grid.getSelectionModel();
                        var rs = sm.getSelection();
                        if (!rs.length) {
                          Ext.Msg.alert('Info', 'No Book Selected');
                          return;
                        }
                        Ext.Msg.confirm('Remove Book', 
                          'Are you sure you want to delete?', 
                          function (button) {
                            if (button == 'yes') {
                              grid.store.remove(rs[0]);
                            }
                        });
                      }
                    });
                  }
                }
              });
            }, 50);
            return Ext.String.format('<div id="{0}"></div>', id);
          }
        }
      ];
      this.callParent(arguments);
    }
  });

    Ext.define('TechZoo.view.BooksForm', {
      extend  : 'Ext.window.Window',
      alias   : 'widget.booksform',
      title   : 'Add Book',
      width   : 350,
      layout  : 'fit',
      resizable: false,
      closeAction: 'hide',
      modal   : true,
      config  : {
        recordIndex : 0,
        action : ''
      },
      items   : [{
        xtype : 'form',
        layout: 'anchor',
        bodyStyle: {
          background: 'none',
          padding: '10px',
          border: '0'
        },
        defaults: {
          xtype : 'textfield',
          anchor: '100%'
        },
        items : [{
          name  : 'title',
          fieldLabel: 'Book Title'
        },{
          name: 'author',
          fieldLabel: 'Author Name'
        },{
          name: 'price',
          fieldLabel: 'Price'
        },{
          name: 'qty',
          fieldLabel: 'Quantity'
        }]
      }],
      buttons: [{
        text: 'OK',
        action: 'add'
      },{
        text    : 'Reset',
        handler : function () { 
          this.up('window').down('form').getForm().reset(); 
        }
      },{
        text   : 'Cancel',
        handler: function () { 
          this.up('window').close();
        }
      }]
    });

  Ext.define('TechZoo.controller.Books', {
    extend  : 'Ext.app.Controller',
    stores  : ['Books'],
    views   : ['BooksList', 'BooksForm'],
    refs    : [{
      ref   : 'formWindow',
      xtype : 'booksform',
      selector: 'booksform',
      autoCreate: true
    }],
    init: function () {
      this.control({
        'bookslist > toolbar > button[action=add]': {
          click: this.showAddForm
        },
        'bookslist': {
          itemdblclick: this.onRowdblclick
        },
        'booksform button[action=add]': {
          click: this.doAddBook
        }
      });
    },
    onRowdblclick: function(me, record, item, index) {
      var win = this.getFormWindow();
      win.setTitle('Edit Book');
      win.setAction('edit');
      win.setRecordIndex(index);
      win.down('form').getForm().setValues(record.getData());
      win.show();
    },
    showAddForm: function () {
      var win = this.getFormWindow();
      win.setTitle('Add Book');
      win.setAction('add');
      win.down('form').getForm().reset();
      win.show();
    },
    doAddBook: function () {
      var win = this.getFormWindow();
      var store = this.getBooksStore();
      var values = win.down('form').getValues();

      var action = win.getAction();
      var book = Ext.create('TechZoo.model.Book', values);
      if(action == 'edit') {
        store.removeAt(win.getRecordIndex());
        store.insert(win.getRecordIndex(), book);  
      }
      else {
        store.add(book);
      }
      win.close();
    }
  });

  Ext.application({
    name  : 'TechZoo',
    controllers: ['Books'],
      launch: function () {
        Ext.widget('bookslist', {
          width : 500,
          height: 300,
          renderTo: 'output'
        });
      }
    }
  );
});
