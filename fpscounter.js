(function(global) {

    global.fpscounter = function(options) {

        // late binding for options > global.fpscounter_options > defaults
        options = options || {};
        var globals = global.fpscounter_options || {};

        var defaults = {
            remove_on_click: false,
            width: 100,
            height: 50
        };
        Object.keys(defaults).forEach(function(key) {
            options[key] = options[key] || globals[key] || defaults[key];
        });


        // get the width height for repeated use
        var canvas_w = options.width,
            canvas_h = options.height;

        // create the new dom elements, the canvas context, the style
        var ele = document.createElement('div');
        ele.className = 'fpscounter';
        ele.style.width = canvas_w + 'px';
        ele.style.height = canvas_h + 'px';

        var canvas = document.createElement('canvas');
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

        var gradient_fill = context.createLinearGradient(0,0,0,canvas_h);
        gradient_fill.addColorStop(0, '#001133');
        gradient_fill.addColorStop(1, '#112288');

        var gradient_line = context.createLinearGradient(0,0,0,canvas_h);
        gradient_line.addColorStop(0, '#2848d8');
        gradient_line.addColorStop(1, '#3366ff');

        context.lineWidth = 1;
        context.strokeStyle = gradient_line;


        var style = document.createElement('style');
        style.textContent = '.fpscounter { '+
                                'position: fixed; '+
                                'top: 0; '+
                                'right: 0; '+
                                'background-color: #000; '+
                                'color: #fff; '+
                                'font-size: 30px; '+
                                'font-family: monospace;'+
                                'z-index: 999999'+
                            '}';

        ele.appendChild(canvas);
        document.body.appendChild(ele);
        document.querySelector('head').appendChild(style);


        // initialize some timing and history variables
        var t_pre, t_now, u_pre, u_lim,
            h_arr = [], h_len = canvas_w,
            raf_request, raf_running;

        // we won't update anything more often than this many milliseconds
        u_lim = 100;

        // reduce an array of values to it members bounding values in the form [min, max]
        function h_reduce(memo, item) {
            if ( !memo[0] || item < memo[0]) memo[0] = item;
            if ( !memo[1] || item > memo[1]) memo[1] = item;
            return memo;
        }

        function checkfps() {
            var fps, c_min_max, c_min, c_delta, first_point, xy;
            raf_running = true;
            t_now = Date.now();
            // this is where we throttle displayed updates
            if ( t_now >= u_pre + u_lim) {

                // get the fps for the history
                fps = Math.min(60, Math.round(1/(t_now-t_pre)*1000));
                h_arr.unshift(fps);

                // do required math
                context.clearRect(0, 0, canvas_w, canvas_h);
                if ( h_arr.length > h_len ) h_arr.pop();
                c_min_max = h_arr.reduce(h_reduce, []);
                c_min = c_min_max[0];
                c_max = c_min_max[1];
                c_delta = c_max - c_min;


                // draw the line graph
                context.fillStyle = gradient_fill;
                context.beginPath();
                // first_point = fpsToPoint(0, h_arr[0], c_min, c_delta);
                context.moveTo(canvas_w, canvas_h);
                h_arr.forEach(function(fps_val, index) {
                    xy = fpsToPoint(index, fps_val, c_min, c_delta);
                    context.lineTo(xy[0], xy[1]);
                });
                context.lineTo(xy[0], canvas_h);
                context.lineTo(canvas_w, canvas_h);
                context.fill();
                context.stroke();

                context.fillStyle = '#fff';
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
            if ( raf_running ) {
                raf_request = requestAnimationFrame(checkfps);
            }
        }

        // convert an fps value to an [x,y] array
        function fpsToPoint(index, fps_val, min, delta) {
            return [
                canvas_w - index,
                canvas_h - canvas_h * (fps_val - min) / delta
            ];
        }

        // add removal event
        ele.addEventListener('click', function() {
            raf_running = !raf_running;
            if (raf_running) {
                start();
            } else {
                cancelAnimationFrame(raf_request);
                if ( options.remove_on_click ) {
                    document.body.removeChild(ele);
                }
            }
        });

        // start
        function start() {
            t_pre = Date.now();
            h_arr = [];
            u_pre = t_pre;
            checkfps();
        }

        start();
    };

    // lots of negatives here because the assumption is we should start
    if ( !global.fpscounter_options || global.fpscounter_options.auto_start !== false) {
        global.fpscounter();
    }

})(window);