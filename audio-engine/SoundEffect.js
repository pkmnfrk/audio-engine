define([], function() {
    "use strict";
    
    /// @class 
    var SoundEffect = function(audioEngine, options) {
        options = options || {};
        
        this.audioEngine = audioEngine;
        this.buffer = options.buffer || null;
        this.error = options.error || null;
    };
    
    SoundEffect.prototype = {
        audioEngine: null,
        buffer: null,
        error: null,
        
    };
    
    return SoundEffect;
});