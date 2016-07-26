(function() {
    window.google = {
    };
    google.kHL = 'en';

    google.c = {
    c: {
        a: true,
    }
    };
    google.time = function() {
        return (new Date).getTime()
    }
    ;
    google.timers = {};
    google.startTick = function(a, b) {
        var c = b && google.timers[b].t ? google.timers[b].t.start : google.time();
        google.timers[a] = {
            t: {
                start: c
            },
            e: {},
            it: {},
            m: {}
        };
        (c = window.performance) && c.now && (google.timers[a].wsrt = Math.floor(c.now()))
    }
    ;
    google.tick = 
    function(a, b, c) {
        google.timers[a] || google.startTick(a);
        c = c || google.time();
        b instanceof Array || (b = [b]);
        for (var d = 0; d < b.length; ++d)
            google.timers[a].t[b[d]] = c
    }
    ;
    google.afte = !0;
    google.aft = 
    function(a) {
        google.c.c.a && google.afte && google.tick("aft", a.id || a.src || a.name)
    }
    ;
})();