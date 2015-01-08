define([], function() {
    "use strict";
    
    /// @class 
    var Channel = function(audioEngine, options) {
        options = options || {};
        this.audioEngine = audioEngine;
        
        this.name = options.name;
        this.maxInstances = options.maxInstances || this.maxInstances;
        
        this.gain = this.audioEngine.context.createGain();
        this.gain.connect(this.audioEngine.masterGain);
    };
    
    Channel.prototype = {
        context: null,
        audioEngine: null,
        name: null,
        maxInstances: 1,
        gain: null,
    };
    
    return Channel;
});