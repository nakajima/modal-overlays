(function() {
  document.observe('keypress', function(event) {
    if (event.keyCode == Event.KEY_ESC) {
      $$('.popup').invoke('fade', { duration: .2 });
      document.fire('escape:pressed');
    }
  });
})();

var Overlay = Class.create({
  initialize: function(fn) {
    this.fn = fn;
    this.cancel = this.cancel.bind(this);
    this.overlay = this.createOverlay();
    this.setupElements();
    this.setupBehaviors();
  },
  
  cancel: function(event) {
    if (event) { event.stop(); }
    with(this) {
      $A([message, overlay]).invoke('fade', { duration: 0.2 });
    }
  },
  
  createOverlay: function() {
    return new Element('div').setOpacity(0.3);
  },
  
  appendElement: function(element) {
    $(document.body).insert(element);
    this.fixPosition();
  },
  
  fixPosition: function() {
    var topOffset = document.viewport.getScrollOffsets().top;
    
    this.overlay.setStyle({
      width: '100%',
      height: '100%',
      background: '#000',
      position: 'absolute',
      left: '0px',
      top: (topOffset + 'px')
    });
    
    this.message.setStyle({
      top: ((this.overlay.getHeight() - this.message.getHeight()) / 2 + topOffset) + 'px',
      left: ((this.overlay.getWidth() - this.message.getWidth()) / 2) + 'px',
      position: 'absolute'
    });
  },
  
  setupElements: function() {
    this.message = this.fn(this.cancel, this.overlay);
    this.appendElement(this.overlay);
    this.appendElement(this.message);
  },
  
  setupBehaviors: function() {
    Event.observe(window, 'scroll', this.fixPosition());
    Event.observe(window, 'resize', this.fixPosition());
    document.observe('escape:pressed', this.cancel);
  }
});

Object.extend(Overlay, {
  create: function(contentFn) {
    new Overlay(contentFn);
  } 
});