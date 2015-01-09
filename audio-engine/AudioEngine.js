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
        this.defaultChannel = new Channel(this, {
            name: "__default",
            maxInstances: 100
        });
    };
    
    AudioEngine.prototype = {
        context: null,
        masterGain: null,
        channels: null,
        defaultChannel: null,
        sfxManager: null,
        
        createChannel: function(options) {
            var chan = new Channel(this, options);
            
            this.channels[chan.name] = chan;
            
            return chan;
        },
        
        channel: function(name) {
            if(!name) return this.defaultChannel;
            return this.channels[name];
        },
        
        sound: function(name) {
            return this.sfxManager.sound(name);
        }
    };
    
    return AudioEngine;
});