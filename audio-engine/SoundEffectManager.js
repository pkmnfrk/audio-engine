define(['audio-engine/SoundEffect', 'emitter'], function(SoundEffect, emitter) {
    "use strict";
    
    /// @class 
    var SoundEffectManager = function(audioEngine, options) {
        options = options || {};
        
        emitter(this);
        
        this.audioEngine = audioEngine;
        
        this.toLoad = [];
        this.sounds = {};
    };
    
    SoundEffectManager.prototype = {
        audioEngine: null,
        loading: 0,
        maxLoading: 2,
        toLoad: null,
        sounds: null,
        
        sound: function(name) {
            return this.sounds[name];
        },
        
        load: function(name, url, options) {
            
            if(this.audioEngine.loadingManager) {
                this.audioEngine.loadingManager.load(url, 'arraybuffer', null, function(data, xhr) {
                    this.handleLoadedBuffer(data, name, url, options);
                }, this);
                
                return;
            }
            this.toLoad.push({ name: name, url: url, options: options });
            
            this.emit('loadingstart', { number: this.toLoad.length });
            
            this.loadNext();
        },
        
        loadNext: function() {
            if(this.loading >= this.maxLoading) return;
            
            if(!this.toLoad.length) return;
            
            this.loading++;
            
            var toLoad = this.toLoad.shift();
            
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = (function() {
                if(xhr.readyState == 4) {
                    this.handleLoadedBuffer(xhr.response, toLoad.name, toLoad.url, toLoad.options, function() {
                        this.onLoadedSfx();
                    });
                }
                
            }).bind(this);
            xhr.responseType = "arraybuffer";
            xhr.open("GET", toLoad.url, true);
            xhr.send();
            
        },
        handleLoadedBuffer: function(data, name, url, options, cb) {
            this.audioEngine.context.decodeAudioData(data,
            (function(buffer) {
                var opts = {};
                for(var p in options) {
                    opts[p] = options[p];
                }
                opts.buffer = buffer;
                opts.url = url;

                var sfx = new SoundEffect(this, opts);
                this.sounds[name] = sfx;
                if(cb) cb.call(this);

            }).bind(this),
            (function(e) {
                var sfx = new SoundEffect(this, {
                    error: e || new Error("There was an error decoding the sound effect"),
                    url: url
                });

                this.sounds[name] = sfx;
                //hmm, this blows
                if(cb) cb.call(this);

            }).bind(this));
        },
        
        onLoadedSfx: function() {
            this.loading--;
            if(this.toLoad.length) {
                this.emit('loadingprogress', { number: this.toLoad.length });
            } else {
                this.emit('loadingend', { });
            }
            
            this.loadNext();
        }
    };
    
    return SoundEffectManager;
});