{
    "baseUrl": "../lib",
    "paths": {
        "canvas-game-engine": "../audio-engine"
    },
    "include": ["../tools/almond", "audio-engine"],
    "exclude": ["jquery"],
    "out": "../dist/audio-engine.js",
    "wrap": {
        "startFile": "wrap.start",
        "endFile": "wrap.end"
    }
}
