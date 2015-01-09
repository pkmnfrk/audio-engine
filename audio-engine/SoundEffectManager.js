define(['audio-engine/SoundEffect'], function(SoundEffect) {
    "use strict";
    
    /// @class 
    var SoundEffectManager = function(audioEngine, options) {
        options = options || {};
        
        this.audioEngine = audioEngine;
        
        this.toLoad = [];
        this.sounds = {};
    };
    
    SoundEffectManager.prototype = {
        audioEngine: null,
        loading: false,
        toLoad: null,
        sounds: null,
        
        sound: function(name) {
            return this.sounds[name];
        },
        
        load: function(name, url, options) {
            this.toLoad.push({ name: name, url: url, options: options });
            
            if(!this.loading) {
                this.loadNext();
            }
        },
        
        loadNext: function() {
            if(this.loading) return;
            
            if(!this.toLoad.length) return;
            
            this.loading = true;
            
            var toLoad = this.toLoad.shift();
            
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = (function() {
                if(xhr.readyState == 4) {
                    this.audioEngine.context.decodeAudioData(xhr.response,
                    (function(buffer) {
                        var opts = {};
                        for(var p in toLoad.options) {
                            opts[p] = toLoad.options[p];
                        }
                        opts.buffer = buffer;
                        opts.url = toLoad.url;
                        
                        var sfx = new SoundEffect(this, opts);
                        
                        onComplete(sfx);
                        
                    }).bind(this),
                    (function(e) {
                        var sfx = new SoundEffect(this, {
                            error: e || new Error("There was an error decoding the sound effect"),
                            url: toLoad.url
                        });
                        
                        //hmm, this blows
                        onComplete(sfx);
                        
                    }).bind(this));
                }
                
            }).bind(this);
            xhr.responseType = "arraybuffer";
            xhr.open("GET", toLoad.url, true);
            xhr.send();
            
            var onComplete = (function(sfx) {
                this.loading = false;
                this.sounds[toLoad.name] = sfx;
                this.loadNext();
            }).bind(this);
            
        }
    };
    
    return SoundEffectManager;
});