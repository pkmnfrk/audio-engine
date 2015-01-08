define(['audio-engine/Channel', 'audio-engine/SoundEffectManager'], function(Channel, SoundEffectManager) {
    "use strict";
    
    var AudioEngine = function(options) {
        options = options || {};
        
        this.channels = {};
        
        var AC = window.AudioContext || window.webkitAudioContext;
        
        if(!AudioContext)
            throw new Error("AudioContext is not supported");
        
        this.context = new AC();
        
        this.masterGain = this.context.createGain();
        this.masterGain.connect(this.context.destination);
        
        this.sfxManager = new SoundEffectManager(this);
    };
    
    AudioEngine.prototype = {
        context: null,
        masterGain: null,
        channels: null,
        sfxManager: null,
        
        createChannel: function(options) {
            var chan = new Channel(this, options);
            
            this.channels[chan.name] = chan;
            
            return chan;
        }
    };
    
    return AudioEngine;
});