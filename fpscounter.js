(function() {

    // create the new dom elements, the canvas context, the style
    var ele = document.createElement('div');
    ele.className = 'fpscounter';

    var canvas = document.createElement('canvas'),
        canvas_w = 62,
        canvas_h = 48;
    canvas.className = 'fpscounter-canvas';
    canvas.width = canvas_w;
    canvas.height = canvas_h;

    var context = canvas.getContext('2d'),
        text_fps_x = canvas_w/2 - 14,
        text_fps_y = canvas_h/2 + 10,
        text_max_x = 4,
        text_max_y = 8,
        text_min_x = 4,
        text_min_y = canvas_h - 4,
        fps_font = 'bold 30px Monospace',
        min_max_font = '10px Monospace';
    context.strokeStyle = '#3366cc';
    context.lineWidth = 2;
    context.fillStyle = "#fff";


    var style = document.createElement('style');
    style.textContent = '.fpscounter { '+
                            'position: fixed; '+
                            'top: 0; '+
                            'right: 0; '+
                            'opacity: 0.5; '+
                            'background-color: #000; '+
                            'color: #fff; '+
                            'font-size: 30px; '+
                            'font-family: monospace;'+
                            'width: 62px; '+
                            'height: 48px; '+
                            'z-index: 999999'+
                        '}';

    ele.appendChild(canvas);
    document.body.appendChild(ele);
    document.querySelector('head').appendChild(style);


    // initialize some timing and history variables
    var t_pre, t_now, u_pre, u_lim,
        h_arr = [], h_len = canvas_w;

    // we won't update anything more often than this many milliseconds
    u_lim = 100;
    t_pre = Date.now();

    // reduce an array of values to it members bounding values in the form [min, max]
    function h_reduce(memo, item) {
        if ( !memo[0] || item < memo[0]) memo[0] = item;
        if ( !memo[1] || item > memo[1]) memo[1] = item;
        return memo;
    }

    function checkfps() {
        var fps, c_min_max, c_min, c_delta, first_point;
        t_now = Date.now();
        // this is where we throttle displayed updates
        if ( t_now >= u_pre + u_lim) {

            // get the fps for the history
            fps = Math.round(1/(t_now-t_pre)*1000);
            h_arr.unshift(fps);

            // do required math
            context.clearRect(0, 0, canvas_w, canvas_h);
            if ( h_arr.length > h_len ) h_arr.pop();
            c_min_max = h_arr.reduce(h_reduce, []);
            c_min = c_min_max[0];
            c_max = c_min_max[1];
            c_delta = c_max - c_min;

            // draw the line graph
            context.beginPath();
            first_point = fpsToPoint(0, h_arr[0], c_min, c_delta);
            context.moveTo(first_point[0], first_point[1]);
            h_arr.forEach(function(fps_val, index) {
                var xy = fpsToPoint(index, fps_val, c_min, c_delta);
                context.lineTo(xy[0], xy[1]);
            });
            context.stroke();

            // write the main FPS text
            context.font = fps_font;
            context.fillText(fps, text_fps_x, text_fps_y);

            // write the limit texts
            context.font = min_max_font;
            context.fillText(c_min, text_min_x, text_min_y);
            context.fillText(c_max, text_max_x, text_max_y);

            // set the "update time" counter
            u_pre = t_now;
        }

        // set the "frame time" counter
        t_pre = t_now;

        // request another update later
        requestAnimationFrame(checkfps);
    }

    // convert an fps value to an [x,y] array
    function fpsToPoint(index, fps_val, min, delta) {
        return [
            canvas_w - index,
            canvas_h - canvas_h * (fps_val - min) / delta
        ];
    }

    // start
    u_pre = t_pre;
    checkfps();


})();