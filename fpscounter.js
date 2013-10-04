(function() {

    var ele = document.createElement('div');
    ele.className = 'fpscounter';

    var txt = document.createElement('div');
    txt.className = 'fpscounter-text';

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
        text_min_y = canvas_h - 4;
    context.strokeStyle = '#3366cc';
    context.lineWidth = 2;
    context.fillStyle = "#fff";


    var style = document.createElement('style');
    style.textContent = '.fpscounter { '+
                            'opacity: 0.5; '+
                            'background-color: #000; '+
                            'color: #fff; '+
                            'font-size: 30px; '+
                            'font-family: monospace;'+
                        '}'+
                        '.fpscounter, '+
                        '.fpscounter-text { '+
                            'text-align: right;'+
                            'position: absolute; '+
                            'top: 0; '+
                            'right: 0; '+
                        '}'+
                        '.fpscounter { '+
                            'width: 62px; '+
                            'height: 48px; '+
                            ''+
                        '}'+
                        '.fpscounter-text { '+
                            'padding: 5px 10px; '+
                            'width: 42px; '+
                            'height: 38px; '+
                            ''+
                        '}';

    ele.appendChild(txt);
    ele.appendChild(canvas);
    document.body.appendChild(ele);
    document.querySelector('head').appendChild(style);


    var t_pre, t_now, u_pre, u_lim,
        h_arr = [], h_len = canvas_w;

    u_lim = 100;
    t_pre = Date.now();

    u_pre = t_pre ;

    function h_reduce(memo, item) {
        if ( !memo[0] || item < memo[0]) memo[0] = item;
        if ( !memo[1] || item > memo[1]) memo[1] = item;
        return memo;
    }

    function checkfps() {
        var fps, c_min_max, c_min, c_delta, first_point;
        t_now = Date.now();
        if ( t_now >= u_pre + u_lim) {

            fps = Math.round(1/(t_now-t_pre)*1000);

            // txt.innerHTML = fps;

            context.clearRect(0, 0, canvas_w, canvas_h);
            h_arr.unshift(fps);
            if ( h_arr.length > h_len ) h_arr.pop();
            c_min_max = h_arr.reduce(h_reduce, []);
            c_min = c_min_max[0];
            c_max = c_min_max[1];
            c_delta = c_max - c_min;
            first_point = fpsToPoint(0, h_arr[0], c_min, c_delta);
            context.beginPath();
            context.moveTo(first_point[0], first_point[1]);
            h_arr.forEach(function(fps_val, index) {
                var xy = fpsToPoint(index, fps_val, c_min, c_delta);
                context.lineTo(xy[0], xy[1]);
            });
            context.stroke();

            context.font = "bold 30px Monospace";
            context.fillText(fps, text_fps_x, text_fps_y);

            context.font = "10px Monospace";
            context.fillText(c_min, text_min_x, text_min_y);

            context.font = "10px Monospace";
            context.fillText(c_max, text_max_x, text_max_y);

            u_pre = t_now;
        }
        t_pre = t_now;
        requestAnimationFrame(checkfps);
    }

    function fpsToPoint(index, fps_val, min, delta) {
        return [
            canvas_w - index,
            canvas_h - canvas_h * (fps_val - min) / delta
        ];
    }

    checkfps();


})();