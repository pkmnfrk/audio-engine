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
        
        this.playing = [];
    };
    
    Channel.prototype = {
        context: null,
        audioEngine: null,
        name: null,
        maxInstances: 1,
        gain: null,
        playing: null,
        
        play: function(sound, whenComplete) {
            var sfx = sound;
            if(typeof sfx == "string") {
                sfx = this.audioEngine.sound(sfx);
            }
            
            if(!sfx) {
                window.console.error("Tried to play non-existant sound", sound);
                return;
            } else if(sfx.error) {
                window.console.error("Cannot play errored sound", sound, sfx.error);
            }
            
            var source = this.audioEngine.context.createBufferSource();
            source.buffer = sfx.buffer;
            source.loop = sfx.loop;
            source.loopStart = sfx.loopStart;
            source.loopEnd = sfx.loopEnd;
            source.whenComplete = whenComplete;
            
            source.onended = (function() {
                var ix = this.playing.indexOf(source);
                if(ix !== -1) this.playing.splice(ix, 1);
                if(source.whenComplete) source.whenComplete();
            }).bind(this);
            
            source.connect(this.gain);
            
            this.playing.push(source);
            
            while(this.maxInstances > -1 && this.playing.length > this.maxInstances) {
                var killed = this.playing.shift();
                killed.stop();
                if(killed.whenComplete) killed.whenComplete();
            }
            
            source.start();
        },
        
        stopAll: function() {
            while(this.playing.length > 0) {
                var killed = this.playing.shift();
                killed.stop();
                if(killed.whenComplete) killed.whenComplete();
            }
        }
    };
    
    return Channel;
});