;(function() {
  
  var hk = modulo.get('hk');
  
  var superKlass = hk.Widget.prototype;
  hk.CodeEditor = hk.Widget.extend(function() {
    
    this._changeTimeout = 750;
    this._changeTimeoutId = null;
    hk.Widget.apply(this, arguments);
    this._setupHandlers();
    
  }, {
    methods: {
      dispose: function() {
        clearTimeout(this._changeTimeoutId);
        // TODO: teardown ACE editor
        superKlass.dispose.apply(this);
      },
      
      setChangeTimeout: function(timeout) {
        this._changeTimeout = timeout;
      },
      
      getValue: function() {
        return this._editor.getValue();
      },
      
      setValue: function(newValue) {
        this._editor.setValue(newValue, 1);
      },
      
      getEditor: function() {
        return this._editor;
      },
      
      _buildStructure: function() {
        this.root = document.createElement('div');
        this.root.className = 'hk-code-editor';
        
        this._editRoot = document.createElement('div');
        this._editRoot.style.position = 'absolute';
        this._editRoot.style.top = '5px';
        this._editRoot.style.left = '5px';
        this._editRoot.style.bottom = '5px';
        this._editRoot.style.right = '5px';
        this.root.appendChild(this._editRoot);
        
        this._editor = ace.edit(this._editRoot);
        this._editor.setTheme("ace/theme/cobalt");
        this._editor.getSession().setMode("ace/mode/javascript");

        var session = this._editor.getSession();
        session.setUseWorker(false);
      },
      
      _setupHandlers: function() {
        var self = this;
        
        this._editor.on('change', function() {
          clearTimeout(self._changeTimeoutId);
          self._changeTimeoutId = setTimeout(function() {
            
            // HACK: need to find a preferred way fo dealing with event handlers
            if (self.onchange) self.onchange();
            
          }, self._changeTimeout);
        });
      },
      
      _applyBounds: function() {
        superKlass._applyBounds.apply(this, arguments);
        if (this._editor) {
          this._editor.resize();
        }
      }
    }
  });
  
})();