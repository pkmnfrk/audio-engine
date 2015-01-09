define([], function() {
    "use strict";
    
    /// @class 
    var SoundEffect = function(audioEngine, options) {
        options = options || {};
        
        this.audioEngine = audioEngine;
        this.buffer = options.buffer || null;
        this.error = options.error || null;
        if(options.loop) this.loop = true;
        if(options.loopStart) this.loopStart = options.loopStart;
        if(options.loopEnd) this.loopEnd = options.loopEnd;
    };
    
    SoundEffect.prototype = {
        audioEngine: null,
        buffer: null,
        error: null,
        
        loop: false,
        loopStart: 0,
        loopEnd: 0
    };
    
    return SoundEffect;
});