;(function() {
  
  var hk = modulo.get('hk');
  
  var DIVIDER_SIZE = hk.theme.SPLIT_PANE_DIVIDER_SIZE;
  
  hk.SPLIT_PANE_HORIZONTAL    = 1;
  hk.SPLIT_PANE_VERTICAL      = 2;
  
  var superKlass = hk.Widget.prototype;
  hk.SplitPane = hk.Widget.extend(function() {
    
    this._widgets     = [null, null];
    this._split       = 0.5;
    this._orientation = hk.SPLIT_PANE_HORIZONTAL;
    
    hk.Widget.apply(this, arguments);
    
    this._bind();
    
  }, {
    methods: {
      dispose: function() {
        this.setWidgetAtIndex(0, null);
        this.setWidgetAtIndex(1, null);
        superKlass.dispose.call(this);
      },
      
      setOrientation: function(orientation) {
        
        this._orientation = orientation;
        
        hk.removeClass(this.root, 'horizontal vertical');
        hk.addClass(this.root, this._orientation == hk.SPLIT_PANE_HORIZONTAL ? 'horizontal' : 'vertical');
        
        this._layout();
      
      },
      
      setBounds: function(x, y, w, h) {
        superKlass.setBounds.call(this, x, y, w, h);
        this._layout();
      },
      
      setSplit: function(split) {
        this._split = split;
        this._layout();
      },
      
      setLeftWidget   : function(widget) { this.setWidgetAtIndex(0, widget); },
      setTopWidget    : function(widget) { this.setWidgetAtIndex(0, widget); },
      setRightWidget  : function(widget) { this.setWidgetAtIndex(1, widget); },
      setBottomWidget : function(widget) { this.setWidgetAtIndex(1, widget); },
      
      setWidgetAtIndex: function(ix, widget) {
        
        var existingWidget = this._widgets[ix];
        
        if (widget !== existingWidget) {
          if (existingWidget) {
            this._removeChildViaElement(existingWidget, this.root);
            this._widgets[ix] = null;
          }

          if (widget) {
            this._widgets[ix] = widget;
            this._attachChildViaElement(widget, this.root);
          }

          this._layout();
        }
          
        return existingWidget;
        
      },
      
      _buildStructure: function() {
        this.root = document.createElement('div');
        this.root.className = 'hk-split-pane';
        
        this._divider = document.createElement('div');
        this._divider.className = 'hk-split-pane-divider';
        
        this._ghost = document.createElement('div');
        this._ghost.className = 'hk-split-pane-divider hk-split-pane-ghost';
        
        this.root.appendChild(this._divider);
        
        hk.addClass(this.root, this._orientation == hk.SPLIT_PANE_HORIZONTAL ? 'horizontal' : 'vertical');
      },
      
      _layout: function() {
        if (this._orientation == hk.SPLIT_PANE_VERTICAL) {
          
          var divt  = Math.floor(this._split * (this.height - DIVIDER_SIZE)),
              w2t   = divt + DIVIDER_SIZE,
              w2h   = this.height - w2t;
          
          this._divider.style.left = '';
          this._divider.style.top = divt + 'px';
          
          if (this._widgets[0]) this._widgets[0].setBounds(0, 0, this.width, divt);
          if (this._widgets[1]) this._widgets[1].setBounds(0, w2t, this.width, w2h);
        
        } else if (this._orientation == hk.SPLIT_PANE_HORIZONTAL) {
          
          var divl  = Math.floor(this._split * (this.width - DIVIDER_SIZE)),
              w2l   = divl + DIVIDER_SIZE,
              w2w   = this.width - w2l;
            
          this._divider.style.left = divl + 'px';
          this._divider.style.top = '';
          
          if (this._widgets[0]) this._widgets[0].setBounds(0, 0, divl, this.height);
          if (this._widgets[1]) this._widgets[1].setBounds(w2l, 0, w2w, this.height);
          
        }
      },
      
      _bind: function() {
        var self = this;
        
        this._divider.addEventListener('mousedown', function(evt) {
          
          var rootPos         = self.root.getBoundingClientRect(),
              offsetX         = evt.offsetX,
              offsetY         = evt.offsetY,
              lastValidSplit  = self._split;
          
          function moveGhost() {
            if (self._orientation == hk.SPLIT_PANE_HORIZONTAL) {
              self._ghost.style.left = Math.floor(lastValidSplit * (rootPos.width - DIVIDER_SIZE)) + 'px';
              self._ghost.style.top = '';
            } else if (self._orientation == hk.SPLIT_PANE_VERTICAL) {
              self._ghost.style.left = '';
              self._ghost.style.top = Math.floor(lastValidSplit * (rootPos.height - DIVIDER_SIZE)) + 'px';
            }
          }
              
          self.root.appendChild(self._ghost);
          moveGhost();
          
          hk.startCapture({
            cursor: (self._orientation == hk.SPLIT_PANE_HORIZONTAL) ? 'col-resize' : 'row-resize',
            mousemove: function(evt) {
              if (self._orientation == hk.SPLIT_PANE_HORIZONTAL) {
                var left    = evt.pageX - offsetX,
                    leftMin = (rootPos.left),
                    leftMax = (rootPos.right - DIVIDER_SIZE);
                if (left < leftMin) left = leftMin;
                if (left > leftMax) left = leftMax;
                
                lastValidSplit = (left - leftMin) / (rootPos.width - DIVIDER_SIZE);
                moveGhost();
              } else {
                var top     = evt.pageY - offsetY,
                    topMin  = (rootPos.top),
                    topMax  = (rootPos.bottom - DIVIDER_SIZE);
                if (top < topMin) top = topMin;
                if (top > topMax) top = topMax;
                
                lastValidSplit = (top - topMin) / (rootPos.height - DIVIDER_SIZE);
                moveGhost();
              }
            },
            mouseup: function() {
              hk.stopCapture();
              self.root.removeChild(self._ghost);
              self.setSplit(lastValidSplit);
            }
          });
          
        });
      
      }
    }
  });
  
})();