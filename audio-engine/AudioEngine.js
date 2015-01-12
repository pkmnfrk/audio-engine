define(['emitter', 'audio-engine/Channel', 'audio-engine/SoundEffectManager'],
function(emitter, Channel, SoundEffectManager) {
    "use strict";
    
    var AudioEngine = function(options) {
        options = options || {};
        
        emitter(this);
        
        var AC = window.AudioContext || window.webkitAudioContext;
        
        if(!AC) {
            window.console.error("AudioContext is not supported");
            this.supported = false;
            return;
        }
        
        if(options.loadingManager) {
            this.loadingManager = options.loadingManager;
        }
        
        this.channels = {};
        
        this.context = new AC();
        
        this.masterGain = this.context.createGain();
        this.masterGain.connect(this.context.destination);
        
        this._sfxLoadEnd = this._sfxLoadEnd.bind(this);
        this._sfxLoadProgress = this._sfxLoadProgress.bind(this);
        this._sfxLoadStart = this._sfxLoadStart.bind(this);
        
        this.sfxManager = new SoundEffectManager(this);
        this.sfxManager.on("loadingstart", this._sfxLoadStart);
        this.sfxManager.on("loadingprogress", this._sfxLoadProgress);
        this.sfxManager.on("loadingend", this._sfxLoadEnd);
        this.defaultChannel = new Channel(this, {
            name: "__default",
            maxInstances: 100
        });
    };
    
    AudioEngine.prototype = {
        supported: true,
        context: null,
        masterGain: null,
        channels: null,
        defaultChannel: null,
        sfxManager: null,
        
        _sfxLoadStart: function(e) {
            this.emit('loadingstart', e);
        },
        
        _sfxLoadEnd: function(e) {
            this.emit('loadingend', e);
        },
        
        _sfxLoadProgress: function(e) {
            this.emit('loadingprogress', e);
        },
        
        createChannel: function(options) {
            if(!this.supported) return null;
            var chan = new Channel(this, options);
            
            this.channels[chan.name] = chan;
            
            return chan;
        },
        
        channel: function(name) {
            if(!this.supported) return {play:function(a,b){if(b){setTimeout(b,0);}}};
            if(!name) return this.defaultChannel;
            return this.channels[name];
        },
        
        sound: function(name) {
            if(!this.supported) return {play:function(){}};
            return this.sfxManager.sound(name);
        }
    };
    
    return AudioEngine;
});