<!DOCTYPE html>
<html>

<head>
    <title>ACVS_Demo - Cognitive Control Lab</title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
    <script src="https://d3js.org/d3.v4.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/bowser/1.9.4/bowser.min.js"></script>

    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Open+Sans">
    <link rel="stylesheet"
        href="https://fonts.googleapis.com/css?family=Fira+Mono:400,500,700|Open+Sans:400,400i,700,700i">

    <style>
        /* Remove default margins */
        * {
            margin: 0;
            padding: 0;
        }


        body {
            background-color: black;
            overflow: hidden;
            min-height: 100vmin;
        }

        H1 {
            font-family: 'Open Sans', 'Ariel';
            font-size: 2em;
        }

        H2 {
            font-family: 'Open Sans', 'Ariel';
            font-size: 1.2em;
        }

        p {
            font-family: 'Open Sans', 'Ariel';
            font-size: 1em;
            color: white;
        }

        li {
            font-family: 'Open Sans', 'Ariel';
            font-size: 1em;
            color: white;
            text-align: left;
        }

        .ace_header {
            color: white;
            padding: 20px 0;
            border-bottom: 1px solid white;
            /* a divider */
            font-family: 'Georgia', 'serif';
            font-size: 2em;
            text-align: center;
        }

        .ace_message_area {
            background-color: black;
            margin-top: 0px;
            margin-bottom: 0px;
            margin-right: 0px;
            margin-left: 0px;
            padding-top: 5px;
            padding-bottom: 5px;
            padding-right: 10px;
            padding-left: 10px;
            font-family: 'Open Sans', 'Ariel';
            font-size: 1em;
        }

        #gui-container {
            text-align: center;
        }

        .gui-div {
            display: inline-block;
        }

        /* the parent container of #workspace and #window-max-alert-message */
        #gui {
            transition: 1s;
            /* for the darken and brighten transition */
            display: grid;
            grid-template-columns: 1fr;
        }

        .ac-workspace {
            position: relative;
        }

        .ace_pretty_text {
            font-family: 'Open Sans', 'Ariel';
            font-weight: 400;
            fill: white;
        }

        .ace_open_tab_button {
            background-color: rgba(240, 240, 240, 1.0);
            border-style: outset;
            border-color: rgba(230, 230, 230, 1.0);
            border-radius: 5px;
            color: rgba(0, 0, 0, 1.0);
            text-decoration: none;
            padding: 4px;
            display: inline-block;
        }

        .svg_container {
            display: inline-block;
            position: relative;
            width: 90vmin;
            height: 90vmin;
            padding-bottom: 100%;
            vertical-align: top;
            overflow: hidden;
        }

        .ace_svg_content_responsive {
            display: inline-block;
            position: absolute;
            top: 0px;
            left: 0;
        }

        .ace_centered_div_container {
            margin: 0;
            height: 90vmin;
            position: relative;
        }

        .ace_centered_div_content {
            margin: 0;
            position: absolute;
            top: 45%;
            left: 48%;
            margin-right: -50%;
            transform: translate(-50%, -50%);
        }

        .darken {
            transition: 1s;
            filter: blur(5px);
        }

        /* placed on the same level as #workspace */
        .window-max-alert-transparent {
            transition: 1s;
            position: absolute;
            display: flex;
            flex-direction: column;
            justify-content: center;
            height: 100%;
            width: 100%;
            font-size: 2em;
            color: transparent;
            z-index: 1;
        }

        .window-max-alert {
            transition: 1s;
            position: absolute;
            display: flex;
            flex-direction: column;
            justify-content: center;
            height: 100%;
            width: 100%;
            font-size: 2em;
            color: white;
            z-index: 1;
        }

        #overlay {
            position: fixed;
            /* Sit on top of the page content */
            display: none;
            /* Hidden by default */
            width: 100%;
            /* Full width (cover the whole page) */
            height: 100%;
            /* Full height (cover the whole page) */
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.88);
            /* Black background with opacity */
            z-index: 2;
            /* Specify a stack order in case you're using a different order for other elements */
            cursor: pointer;
            /* Add a pointer on hover */
        }

        #overlay-text {
            position: absolute;
            top: 50%;
            left: 50%;
            font-size: 28px;
            color: white;
            transform: translate(-50%, -50%);
            -ms-transform: translate(-50%, -50%);
        }

        .acvs-digit {
            font-family: Arial, Helvetica, sans-serif;
            font-weight: 400;
            fill: white;
            text-anchor: middle;
            /* alignment-baseline: central; */
            /* Warning: Check browser compatibility. WL 8/22/2020 */
        }

        .acvs-feedback {
            font-family: Arial, Helvetica, sans-serif;
            font-style: italic;
            font-size: 2pt;
            fill: white;
            text-anchor: middle;
            /* alignment-baseline: central; */
        }

        .fixation-cross-center {
            text-anchor: middle;
            /* alignment-baseline: central; */
        }

        .btn-wide {
            background-color: white;
            color: black;
            font-size: 1.2em;
            margin: 24px;
            padding: 8px;
            width: 300px;
            height: 45px;
            border-radius: 24px;
        }

        .btn-regular {
            background-color: white;
            color: black;
            font-size: 1.2em;
            margin: 24px;
            padding: 8px;
            width: 200px;
            height: 45px;
            border-radius: 24px;
        }

        .btn-wide:hover,
        .btn-regular:hover {
            transition-duration: 250ms;
            background-color: black;
            color: white;
        }

        .debriefing-title {
            margin: 20px auto;
            font-size: 1.5em;
            text-transform: uppercase;
        }

        .debriefing-msg {
            margin: auto;
            width: 60%;
            font-size: 1.2em;
            font-style: italic;
        }
    </style>
</head>


<body>
    <div id="gui-container">
        <div id="gui" class="gui-div">
            <div id="workspace" class="ac-workspace"></div>
        </div>
    </div>
    <div id="overlay">
        <div id="overlay-text">To optimize your experience in this experiment, click anywhere to enter full-screen mode.
        </div>
    </div>
    <div id="hidden-sub-id"><?php echo $_GET['id'] ?></div>
    <div id="hidden-test"><?php echo $_GET['test'] ?></div>

    <script>
        let acvs_version = {};
        // Define an objection which will act as a namespace.
        'use strict'
        const util = {};
        ///////////////////////////////////////////////////////////////////////////////
        ///
        /// A class full of static utility methods.
        ///
        util.Util = class Util {
            /////////////////////////////////////////////////////////////////////////////
            ///
            /// Return the sum of a numeric array.
            ///
            static sum(arr) {
                if (arr.length == 0) { return 0; } // edge case
                let result = 0.0;
                arr.forEach(function (item) {
                    result += item;
                });
                return result;
            }

            /////////////////////////////////////////////////////////////////////////////
            ///
            /// Returns the mean of the array, arr.
            ///
            static mean(arr) {
                if (arr.length == 0) { throw RangeError("Can not calculate mean of empty array."); }
                let result = Util.sum(arr) / arr.length;
                return result;
            }

            /////////////////////////////////////////////////////////////////////////////
            ///
            /// Returns the standard deviation of arr.
            ///
            static stdev(arr) {
                if (arr.length == 0) { throw RangeError("Can not calculate stdev of empty array."); }
                let m = Util.mean(arr);
                let result = 0.0;
                arr.forEach(function (item) {
                    result += Math.abs(item - m);
                });
                result /= arr.length;
                return result;
            }

            /////////////////////////////////////////////////////////////////////////////
            ///
            /// Returns the standard error of the mean of arr
            ///
            static std_error_of_the_mean(arr) {
                if (arr.length == 0) { throw RangeError("Can not calculate standard error of the mean of empty array."); }
                let result = Util.stdev(arr) / Math.sqrt(arr.length);
                return result;
            }

            /////////////////////////////////////////////////////////////////////////////
            ///
            /// Returns a integer pseudo-randomly drawn from the range [min, max) or
            /// [min, max]
            ///
            static gen_random_int(min, max, inclusive = false) {
                if (inclusive == false) {
                    return Math.floor(Math.random() * (max - min)) + min;
                } else {
                    return Math.floor(Math.random() * (max - min + 1)) + min;
                }
            }

            /////////////////////////////////////////////////////////////////////////////
            ///
            /// Returns a float pseudo-randomly drawn from the range [min, max) or
            /// [min, max]
            ///
            static gen_random_float(min, max, inclusive = false) {
                if (inclusive == false) {
                    return Math.random() * (max - min) + min;
                } else {
                    return Math.random() * (max - min + 1) + min;
                }
            }

            /////////////////////////////////////////////////////////////////////////////
            ///
            /// Randomly shuffles the array, arr, in-place using the Fisher-Yates
            /// algorithm. Note the original array (not a copy) is modified.
            ///
            static fisher_yates_shuffle(arr) {
                let j = undefined;
                let k = undefined;
                for (let i = arr.length - 1; i >= 0; i--) {
                    j = Util.gen_random_int(0, i, true);
                    k = arr[j];
                    arr[j] = arr[i];
                    arr[i] = k;
                }
                return arr;
            }

            /////////////////////////////////////////////////////////////////////////////
            ///
            /// Tries to determin if the current window object is associated with the
            /// main browser window or a iframe window.  Returns true if it looks like an
            /// iframe.
            ///
            static window_is_iframe() {
                try {
                    return window.self !== window.top;
                } catch (err) {
                    return true;
                }
            }

            ///////////////////////////////////////////////////////////////////////////////
            ///
            /// Plays a beep audio sound.
            ///
            static play_beep_sound() {
                const beep = new Audio("data:audio/mpeg;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU1LjEyLjEwMAAAAAAAAAAAAAAA//uQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAAcAAAAIAAAOsAA4ODg4ODg4ODg4ODhVVVVVVVVVVVVVVVVxcXFxcXFxcXFxcXFxjo6Ojo6Ojo6Ojo6OqqqqqqqqqqqqqqqqqsfHx8fHx8fHx8fHx+Pj4+Pj4+Pj4+Pj4+P///////////////9MYXZmNTUuMTIuMTAwAAAAAAAAAAAkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQRAAAAn4Tv4UlIABEwirzpKQADP4RahmJAAGltC3DIxAAFDiMVk6QoFERQGCTCMA4AwLOADAtYEAMBhy4rBAwIwDhtoKAgwoxw/DEQOB8u8McQO/1Agr/5SCDv////xAGBOHz4IHAfBwEAQicEAQBAEAAACqG6IAQBAEAwSIEaNHOiAUCgkJ0aOc/a6MUCgEAQDBJAuCAIQ/5cEAQOCcHAx1g+D9YPyjvKHP/E7//5QEP/+oEwf50FLgApF37Dtz3P3m1lX6yGruoixd2POMuGLxAw8AIonkGyqamRBNxHfz+XRzy1rMP1JHVDJocoFL/TTKBUe2ShqdPf+YGleouMo9zk////+r33///+pZgfb/8a5U/////9Sf////KYMp0GWFNICTXh3idEiGwVhUEjLrJkSkJ9JcGvMy4Fzg2i7UOZrE7tiDDeiZEaRTUYEfrGTUtFAeEuZk/7FC84ZrS8klnutKezTqdbqPe6Dqb3Oa//X6v///qSJJ//yybf/yPQ/nf///+VSZIqROCBrFtJgH2YMHSguW4yRxpcpql//uSZAuAAwI+Xn9iIARbC9v/57QAi/l7b8w1rdF3r239iLW6ayj8ou6uPlwdQyxrUkTzmQkROoskl/SWBWDYC1wAsGxFnWiigus1Jj/0kjgssSU1b/qNhHa2zMoot9NP/+bPzpf8p+h3f//0B4KqqclYxTrTUZ3zbNIfbxuNJtULcX62xPi3HUzD1JU8eziFTh4Rb/WYiegGIF+CeiYkqat+4UAIWat/6h/Lf/qSHs3Olz+s9//dtEZx6JLV6jFv/7//////+xeFoqoJYEE6mhA6ygs11CpXJhA8rSSQbSlMdVU6QHKSR0ewsQ3hy6jawJa7f+oApSwfBIr/1AxAQf/8nBuict8y+dE2P8ikz+Vof/0H4+k6tf0f/6v6k/////8qKjv/1BIam6gCYQjpRBQav4OKosXVrPwmU6KZNlen6a6MB5cJshhL5xsjwZrt/UdFMJkPsOkO0Qp57smlUHeDBT/+swC8hDfv8xLW50u/1r//s3Ol/V9v///S/////yYSf/8YN5mYE2RGrWXGAQDKHMZIOYWE0kNTx5qkxvtMjP/7kmQOAAMFXl5582t2YYvrnz5qbowhfX/sQa3xf6+u/Pi1uiPOmcKJXrOF5EuhYkF1Bbb/3EAiuOWJocX9kycBtMDLId5o7P+pMDYRv1/mDdaP8ul39X1X5IDHrt1o///9S/////85KVVbuCOQNeMpICJ81DqHDGVCurLAa/0EKVUsmzQniQzJVY+w7Nav+kDexOCEgN7iPiImyBmYImrmgCQAcVltnZv2IQsAXL9vqLPlSb+Qk3/6K3MFb+v//b+n////+UJW//Sc1mSKuyRZwAEkXLIQJXLBl6otp8KPhiYHYh+mEAoE+gTBfJgeNItsdG6GYPP/1FkQFHsP3IOPLtavWEOGMf/WThMwEWCpNm6y/+Y+s//OH/1/u/OGX////6v////+bCSoHMzMgsoTebSaIjVR6lKPpG7rCYWmN+jRhtGuXiHi57E0XETEM7EAUl/9IdINsg8wIAAQBmS8ipal6wx8BnH//UYhNzT9L8lH51v6m//u3IhI1r9aP///V/////0iQ//pC87YAWAKKWAQA67PwQ2iCdsikVY4Ya//+5JkC4ADTmzX+01rcFLry/8+DW/OgbNV7NINwQ6e7nTWtXLHHhydAAxwZFU1lQttM3pgMwP6lqdB/rIgABAaxBRnKSLo/cB2hFDz/9MxDiD2l6yh9RTflZKf1Jfr/RfkQYWtL6P///V/////w/icFn///7lAwJp2IBpQ4NESCKe1duJchO8QoLN+zCtDqky4WiQ5rhbUb9av+oQljfDBZdPstVJJFIMSgXUXu39EFGQG//JZus//OG/6X6Lc4l/////t/////Kx4LWYoAQABgwQAGWtOU1f5K1pzNGDvYsecfuce4LdBe8iBuZmBmVdZJVAmuCk8tt/qOi8Ax4QjgywDYEMM0dkkUkqQ1gGCpaf/nTgoQH36vpkMflE7/KRj+k/0n5DiDPS+3///qf////7JizRCya////WaGLygCl0lqppwAH1n/pGM6MCPFK7JP2qJpsz/9EfgHUN4bYUo8kVfxZDd/9ZqXSi31/WXW51D+ZG37/pNycMDbnf///+JaiWbxwJAADEAgAWBoRJquMpaxJQFeTcU+X7VxL3MGIJe//uSZBAABBVs0ftaa3BCS+udTaVvjLV5W+w1rdk5r6x89rW+Bx4xGI3LIG/dK42coANwBynnsZ4f//+t3GfrnRJKgCTLdi1m1ZprMZymUETN4tj3+//9FQEMDmX9L5qVmlaiKVfx3FJ/mH5dfphw6b////60P////qWkMQEfIZq////sMESP4H4fCE0SSBAnknkX+pZzSS2dv1KPN/6hdAJUhIjzKL1L2sDqST/+gwF//ir8REf5h35f2bmDz3//////////jAGKcREwKMQI+VWsj7qNCFp0Zk9ibgh82rKj/JEIFmShuSZMMxk6Jew7BLOh/6wWk1EaAK4nJszopGpdUYh9EYN2/0zQYYnhvJt1j1+pPzpr/TKHXs3z6WdE1N0pm/o///9f/////MpkiIiBeCALJpkgpbKFme7rvPs1/vwM0yWmeNn75xH/+BkEIWITktZ+ijXEi//nC8XQ8v9D5wez86Xv6SL/Lv5ePcrIOl////1/////84bPG1/BwAHSMrAmlSw9S3OfrGMy51bTgmVmHAFtAmCmRg2s1LzmAP/7kmQSgAM9Xs5rM2twXG2Z70IKbg09fT2nva3xgq/mtRe1ui8AFVGaC/9EawNnhihesNgE5E6kir3GVFlof+tEQEpf/rMH50lv5WPH6k2+XX4JUKRpn9Xq//+7f////x3CyAX/4LIzvDgdgAEbFbAc0rGqTO2p1zoKA22l8tFMiuo2RRBOMzZv+mUA2MiAyglI3b9ZwZ0G7jqlt/OcDIKX+/1NblSX+VKfQfP8xuJJGk7////rf////+PgXTv///1JThJJQainmySAB6imUyuVbVttUo7T4Csa821OuF88f62+CZHFnGf///mQgYIEO0SMF2NVy9NxYTdlqJ8AuS4zr//SJoTUJ+CaKKTcZvosrUPo8W/MUv0f033E9E/QpN6P///v/////WRR2mwUAYUABjabRu1vrOLKAF0kIdHjnEx/iNWo7jGn1////mApxNTJQQOU1Het/NoUFTMQs6Vja///THaGIl/0fojl8mjd/Jo8W+ZfpNpCajsz7////6kn/////WRRgDz//LD1KSTDjKOciSAKxdLx5S31uYqKIWj/+5JECgAC8V5M6g9rdFyr6Vo9rW6KtHcr5DEJQRkSpLRklSigvVc4QpmyPe9H3zHR1/in9P/8VNCMJOzYUDyVjfwHP0ZgiZt/3/+9EBnDKbegdUrckhgntHaQ9vX/X/9A/////+r/////mJ3/9ItRcoVRogAcmV9N8z0pvES8QQsKoMGXEymPQyWm6E4HQLqgpv/CZJAtYXQSwoF8e6SB56zABEoW+qgZjJAZovGr0Gl5/OjFKL3JwnaX9v7/X8y1f/////////49WAzMzEYYMZLq6CUANIqbDX7lisBIdraAEPwShTRc9WZ2vAqBc4NQ9GrUNaw0Czcrte0g1NEoiU8NFjx4NFh54FSwlOlgaCp0S3hqo8SLOh3/63f7P/KgKJxxhgGSnAFMCnIogwU5JoqBIDAuBIiNLETyFmiImtYiDTSlb8ziIFYSFv/QPC38zyxEOuPeVGHQ77r/1u/+kq49//6g4gjoVQSUMYQUSAP8PwRcZIyh2kCI2OwkZICZmaZxgnsNY8DmSCWX0idhtz3VTJSqErTSB//1X7TTTVVV//uSZB2P8xwRJ4HvYcItQlWBACM4AAABpAAAACAAADSAAAAEVf/+qCE000VVVVU0002//+qqqqummmmr///qqqppppoqqqqppppoqqATkEjIyIxBlBA5KwUEDBBwkFhYWFhUVFfiqhYWFhcVFRUVFv/Ff/xUVFRYWFpMQU1FMy45OS41qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqg==");
                beep.play();
            }

            ///////////////////////////////////////////////////////////////////////////////
            ///
            /// Returns today's date as a string
            ///
            static today() {
                let today = new Date();
                let dd = String(today.getDate()).padStart(2, '0');
                let mm = String(today.getMonth() + 1).padStart(2, '0');
                let yyyy = String(today.getFullYear());
                return yyyy + '-' + mm + '-' + dd;
            }

            ///////////////////////////////////////////////////////////////////////////////
            ///
            /// Sets a cookie. Uses btoa to mangle the key.
            ///
            /// Credit: https://www.w3schools.com/js/js_cookies.asp
            ///
            static set_cookie(key, value, expires_in_N_days) {
                let d = new Date();
                d.setTime(d.getTime() + (expires_in_N_days * 24 * 60 * 60 * 1000));
                let expires = "expires=" + d.toGMTString();
                document.cookie = btoa(key) + "=" + value + ";" + expires + ";path=/";
            }

            ///////////////////////////////////////////////////////////////////////////////
            ///
            /// Retrieves a cookie. Uses btoa to un-mangle the key.
            ///
            /// Credit: https://www.w3schools.com/js/js_cookies.asp
            ///
            static get_cookie(key) {
                key = btoa(key) + "=";
                let decodedCookie = decodeURIComponent(document.cookie);
                let ca = decodedCookie.split(';');
                for (let i = 0; i < ca.length; i++) {
                    let c = ca[i];
                    while (c.charAt(0) == ' ') {
                        c = c.substring(1);
                    }
                    if (c.indexOf(key) == 0) {
                        return c.substring(key.length, c.length);
                    }
                }
                return "";
            }

            /**
             * 
             * @param {Array<*>} array 
             * @param {*} exclude : an object of array to be excluded when selecting
             * @param {boolean} replace : whether to remove the selected item from array
             */
            static select_rand_from_array(array, exclude = null, replace = true) {
                let rand_index = Util.gen_random_int(0, array.length);
                let result = array[rand_index];
                if (result === exclude) {
                    return Util.select_rand_from_array(array, exclude);
                }
                if (!replace) array.splice(rand_index, 1);
                return result;
            }

            static choose_from(array, exclude = [], replace = true) {
                let index = Util.gen_random_int(0, array.length);
                let result = array[index];
                if (exclude.length > 0) {
                    for (let i = 0; i < exclude.length; i++) {
                        if (array[index] === exclude[i]) {
                            return Util.choose_from(array, exclude, replace);
                        }
                    }
                }
                if (!replace) array.splice(rand_index, 1);
                return result;
            }

            static is_test_mode() {
                return d3.select("#hidden-test").html() === "true";
            }

            static get_sub_id() {
                return d3.select("#hidden-sub-id").html();
            }


        }
        ///////////////////////////////////////////////////////////////////////////////
        ///
        /// Simple implementation of a "Signals and Slots" callback system.
        ///
        util.Signal = class {
            constructor() {
                this._connected_slots = [];
            }

            /////////////////////////////////////////////////////////////////////////////
            ///
            /// Use to connect a callback to this signal.
            ///
            connect(new_slot) {
                this._connected_slots.push(new_slot);
            }

            /////////////////////////////////////////////////////////////////////////////
            ///
            /// Use to call all callbacks connected to this signal.
            ///
            emit() {
                for (let i = 0; i < this._connected_slots.length; i++) {
                    this._connected_slots[i].apply(null, arguments);
                }
            }
        }
        ///////////////////////////////////////////////////////////////////////////////
        ///
        /// A KeyFilter is a wrapper class for a keypress EventListener.
        ///
        /// Example usage:
        /// ...
        /// let myKeyFilter = new KeyFilter( myCallback );
        /// myKeyFilter.turn_on()
        /// // When user presses "any" key
        /// // myKeyFilter will immediately call myCallback("any")
        /// ...
        /// myKeyFilter.turn_off()
        /// // User presses "any" key
        /// // nothing happens
        /// ...
        /// myKeyFilter = myKeyFilter.destroy() // will remove the event listener and
        ///                                     // sets myKeyFilter to undefined.
        ///
        util.KeyFilter = class {
            constructor(on_keypress_callback, key_filter_on = true) {
                this._key_filter_on = key_filter_on; /// enable or disable this KeyFilter.
                this._callback = on_keypress_callback;  /// This method is called whenever a key is pressed if the logger is on.
                this.bound_callback = this._catch_keypress.bind(this);
                window.addEventListener('keypress', this.bound_callback);  /// adds a listener for key presses.
            }

            /////////////////////////////////////////////////////////////////////////////
            ///
            /// Turn this filter ON.
            ///
            turn_on() {
                this._key_filter_on = true;
            }

            /////////////////////////////////////////////////////////////////////////////
            ///
            /// Turn this filter OFF.
            ///
            turn_off() {
                this._key_filter_on = false;
            }

            /////////////////////////////////////////////////////////////////////////////
            ///
            /// Private method to be triggered from the EventListener. It will call the
            /// callback on a keypress event if the KeyFiler is on.  This function
            /// forwards the key identity (i.e. "a" "b" "c") to the callback as an
            /// argument.
            ///
            _catch_keypress(key_num) {
                if (this._key_filter_on == true) {
                    this._callback(key_num.key);
                }
            }

            /////////////////////////////////////////////////////////////////////////////
            ///
            /// This method cleans up the class when the client is done with it.
            ///
            destroy() {
                window.removeEventListener("keypress", this.bound_callback);
                return undefined;
            }
        }
        // Taken from https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest
        // in 2018.

        ///////////////////////////////////////////////////////////////////////////////
        ///
        /// A utility class for hash functions.
        ///
        util.Hash = class Hash {
            ///////////////////////////////////////////////////////////////////////////////
            ///
            /// Convert an arraybuffer into a hex number
            ///
            static _hex(buffer) {
                var hexCodes = [];
                var view = new DataView(buffer);
                for (var i = 0; i < view.byteLength; i += 4) {
                    // Using getUint32 reduces the number of iterations needed (we process 4 bytes each time)
                    var value = view.getUint32(i)
                    // toString(16) will give the hex representation of the number without padding
                    var stringValue = value.toString(16)
                    // We use concatenation and slice for padding
                    var padding = '00000000'
                    var paddedValue = (padding + stringValue).slice(-padding.length)
                    hexCodes.push(paddedValue);
                }

                // Join all the hex strings into one
                return hexCodes.join("");
            }

            ///////////////////////////////////////////////////////////////////////////////
            ///
            /// Apply the sha256 hash function on a string input
            ///
            static sha256(str) {
                // We transform the string into an arraybuffer.
                let buffer = new TextEncoder("utf-8").encode(str);
                let result = {};
                crypto.subtle.digest("SHA-256", buffer).then(function (hash) {
                    result.hash = Hash._hex(hash); // unload from the Promise object
                });
                return result;
            }
        }
        ///////////////////////////////////////////////////////////////////////////////
        ///
        /// <ExperimentBase> is the base class for Experiemnts. It can be filled with
        /// <Steps> and then ran.
        ///
        /// Example usage:
        /// ...
        /// let ex = new Experiment();
        /// ex.add_new_step( someStep );
        /// ex.add_new_step( anotherStep );
        /// ex.run();
        ///
        util.ExperimentBase = class {
            constructor(version) {
                this._steps = []; // an array of the experiment steps
                this._steps_finalized = false; // private flag for signaling initialization
                this._db = new util.Database();
                this._db._acvs_version = "version_" + String(version);
                this._run_date = util.Util.today();
            }

            /////////////////////////////////////////////////////////////////////////////
            ///
            /// Adds a new step to the Experiment
            ///
            add_new_step(new_step) {
                if (!(new_step instanceof util.AbstractStep)) {
                    throw "Error: argument must be derived from AbstractStep"
                }
                if (this._steps_finalized == true) {
                    throw "Error: Cannot append a new step after the experiemnt has started";
                }
                new_step.step_completed_signal.connect(this._execute_next_step.bind(this));
                this._steps.push(new_step);
            }

            /////////////////////////////////////////////////////////////////////////////
            ///
            /// Starts the Experiment
            ///
            run() {
                this._stepsFinalized = true;
                this._execute_next_step();
            }

            /////////////////////////////////////////////////////////////////////////////
            ///
            /// Executes the next step in the experiment each time it is called. Does
            /// nothing if there are no more steps.
            ///
            _execute_next_step() {
                let queuedStep = this._steps.shift();
                if (queuedStep != undefined) {
                    queuedStep.execute();
                }
            }
        }
        ///////////////////////////////////////////////////////////////////////////////
        ///
        /// <AbstractStep> defines a common interface to be used by all derived
        /// Step objects.
        ///
        util.AbstractStep = class {
            constructor() {
                // all derived classes should emit() this Signal at the end of their
                // overridden execute() method.
                this.step_completed_signal = new util.Signal();
            }

            /////////////////////////////////////////////////////////////////////////////
            ///
            /// The main routine called to start this step.
            ///
            execute() {
                throw "Error: Abstract method called";
            }
        }
        ///////////////////////////////////////////////////////////////////////////////
        ///
        /// An abstraction for a database-like object containing tables of records.
        ///
        /// db = new Database();
        /// db.add_new_table("table1");
        /// db.table1.add_new_column("col1");
        /// db.table1.add_new_column("col2");
        /// db.table1.add_new_column("col3");
        ///
        /// db.finalize(); // lock structure
        ///
        /// db.table1.add_new_row(valA1, valB1, valC1);
        /// db.table1.add_new_row(valA2, valB2, valC2);
        ///
        /// console.log(db);
        /// >> {table1: {col1:         [valA1,     valA2   ],
        ///              col2:         [valB1,     valB2   ],
        ///              col3:         [valC1,     valC2   ],
        ///              rowIndex:     [1,         2       ],
        ///              rowTimestamp: [0.1231..., 0.231...] } }
        ///
        util.Database = class {
            /////////////////////////////////////////////////////////////////////////////
            ///
            /// Called on instantiation.
            ///
            constructor() {
                // timestamp for when this object was created
                this._time_instantiated = performance.now();
                // an array containing the names of the tables in this db
                this._array_of_table_names = [];
            }

            /////////////////////////////////////////////////////////////////////////////
            ///
            /// Add a new table to this db.
            ///
            add_new_table(table_name) {
                // record the new table's name
                this._array_of_table_names.push(table_name);
                // create the new table
                this[table_name] = new util.Table(this._time_instantiated);
            }

            /////////////////////////////////////////////////////////////////////////////
            ///
            /// Call this method after all tables have been added to lock the structure
            /// of the db.
            ///
            finalize() {
                // call finalize on all tables in the db
                for (let i = 0; i < this._array_of_table_names.length; i++) {
                    this[this._array_of_table_names[i]].finalize();
                }
                // delete the methods that can be used to modify the structure of the db
                delete this.add_new_table;
                delete this.finalize;
            }
        }

        ///////////////////////////////////////////////////////////////////////////////
        ///
        /// An abstraction for a database table.
        ///
        util.Table = class {
            constructor(absolute_timestamp) {
                // initial timestamp for use in all subsequent timestamps:
                this._absolute_timestamp = absolute_timestamp;
                // for internal bookkeeping:
                this._array_of_column_names = [];
                // automatically populated columns:
                this["RowTimestamp"] = [];
                this["RowIndex"] = [];
                this["RowHash"] = [];
            }

            /////////////////////////////////////////////////////////////////////////////
            ///
            /// Return the number of rows in this table or 0 if the table has no columns.
            ///
            number_of_rows() {
                if (this._array_of_column_names.length == 0) {
                    return 0;
                } else {
                    return this[this._array_of_column_names[0]].length;
                }
            }

            /////////////////////////////////////////////////////////////////////////////
            ///
            /// Append a new column to the table.
            ///
            add_new_column(column_name) {
                // record the column name
                this._array_of_column_names.push(column_name);
                // create an empty array to represent the column
                this[column_name] = [];
            }

            /////////////////////////////////////////////////////////////////////////////
            ///
            /// Append a new row/record to this table.
            ///
            add_new_row() {
                // automatically timestamp when this row is added
                this["RowTimestamp"].push(performance.now() - this._absolute_timestamp);
                // automatically add an index number for this row
                this["RowIndex"].push(this[this._array_of_column_names[0]].length + 1);
                // automatically add a hash of the previous row
                let num_rows = this.number_of_rows();
                if (num_rows > 0) {
                    let previous_row_as_string = JSON.stringify(this.get_row(num_rows - 1));
                    this["RowHash"].push(util.Hash.sha256(previous_row_as_string))
                } else {
                    this["RowHash"].push("init")
                }
                // add the arguments given to this function as elements for the row
                for (let i = 0; i < this._array_of_column_names.length; i++) {
                    this[this._array_of_column_names[i]].push(arguments[i]);
                }
            }

            /////////////////////////////////////////////////////////////////////////////
            ///
            /// Return an array containing the contents of the table at row_index.
            /// Note: primitives are likely returned *by-copy* and objects *by-reference*
            /// within the new array.
            ///
            get_row(row_index) {
                let result = [];
                result.push(this["RowTimestamp"][row_index]);
                result.push(this["RowIndex"][row_index]);
                result.push(this["RowHash"][row_index]);
                for (let i = 0; i < this._array_of_column_names.length; i++) {
                    result.push(this[this._array_of_column_names[i]][row_index]);
                }
                return result;
            }

            /////////////////////////////////////////////////////////////////////////////
            ///
            /// Call to lock the structure of this table by deleting the mutator methods.
            ///
            finalize() {
                delete this.add_new_column;
                delete this.finalize;
            }
        }
        /**
         * A class that includes static methods to manipulate the workspace of the
         * experiment.
         * 
         * @package acvs-online
         * @author Walden Li
         * @version 1.4
         */
        util.Workspace = class Workspace {

            static guiDiv() {
                return d3.select('#gui');
            }

            static show_header(text) {
                // clear any existing header
                HtmlGui.clear_header();
                // add a new header <div>
                d3.select("body")
                    .insert("div", ":first-child")
                    .attr("class", "ace_header")
                    .attr("id", "headerDiv")
                    .html(text);
            }


            static clear_header() {
                d3.selectAll("#headerDiv").remove();
            }

            static workspace() {
                return d3.select("#workspace");
            }

            /**
             * This method clears every <div> under #workspace
             * Note: In the previous version the method was to delete the whole #workspace
             * entirely and create a new identitical #workspace under its parent element.
             * This would completely remove all the class attributes and event listeners
             * manipulated by JS code, so it was not an ideal way to do it.
             */
            static clear_workspace() {
                // delete any existing workspace <div>
                d3.selectAll("#workspace *").remove();
            }


            static append_paragraphs(html, font_size = 1.5) {
                HtmlGui.workspace().selectAll("p").data(html)
                    .enter().append("p")
                    .style("font-size", String(font_size) + "em")
                    .html(function (d) { return d; });
            }


            static append_image(img) {
                img = [img.src];
                HtmlGui.workspace().selectAll("img").data(img)
                    .enter().append("img")
                    .attr('src', function (d) { return d; })
                    .attr('class', "ace_centered_div_content");
            }


            static append_button(buttonText, onClickCallback) {
                let button = HtmlGui.workspace().selectAll("button").data([buttonText])
                    .enter().append("button");
                button.text(function (d) { return d; });
                button.attr("id", function (d) { return d + "_button"; });
                button.on("click", onClickCallback);
            }

            static show_message(text, color = "white") {
                // clear any existing header
                HtmlGui.clear_message();
                // add a new header <div>
                d3.select("body")
                    .insert("div", ":first-child")
                    .attr("class", "ace_message_area")
                    .attr("id", "messageDiv")
                    .style("color", color)
                    .html(text);
            }

            static clear_message() {
                d3.selectAll("#messageDiv").data([]).exit().remove();
            }

            static hide_cursor() {
                Workspace.workspace().style("cursor", "none");
            }

            static show_cursor() {
                Workspace.workspace().style("cursor", "default");
            }
        }/**
 * Just a namespace.
 * 
 * @package ac-spatial-cue-1
 * @version 1.1
 * @author Walden Li
 */
        'use strict'
        const disp = {};
        /**
         * This is a class that handles the logic of an ACVS stimuli display.
         * 
         * @package ac-spatial-cue-1
         * @version 1.2 (07/03/20)
         * @author Walden Li
         */
        disp.Display = class {

            constructor() {
                // screen center coordinates
                this.screen_center_x = 50;
                this.screen_center_y = 50;
                // ACVS rings
                this.ring_radius = 45;
                this.square_size = 4;
                // digits
                this.digit_size = this.square_size * 0.65;
                this.digit_color = "white";
                this.digit_class_name = "acvs-digit";
                // for non-Chrome browsers, text location needs to be adjusted in order to center on squares
                this.digit_shift_x = 0;
                this.digit_shift_y = this.digit_size * 0.35;
                // fixation cross (as text "+")
                this.fixation_cross_class_name = "fixation-cross-center";
                this.ring_square_numbers = [12, 18, 24];
                this.subring_radius_proportion = [0.5, 0.75, 1];
                this.square_color = "rgb(128, 128, 128)";
                // Specific to spatial cue paradigm
                this.cue_radius = this.square_size / 1.5;
                this.cue_stroke_color = "white";
                this.cue_stroke_width = 0.2;
                // Specific to temporal paradigm
                this.letter_cue_color = "white";
                // this.letter_cue_font_size = this.digit_size;
            }

            /** Some setter methods. */
            set_ring_radius(r) { this.ring_radius = r }

            set_square_size(sz) { this.square_size = sz }

            /**
             * This method calculates grid position coordinates and store them in a two
             * dimensional Array.
             * 
             * Some variables in the "grid" object:
             * 
             * rect_x & rect_y: the x and y coordinates of the top left corner of
             * each square in the display. This calculation is needed for the widget to
             * draw a square, or <rect>, because an html <rect> element needs only this
             * point to determine the position of a <rect>, and so does d3.
             * Note that different from the MATLAB version, where a "fillRect" method
             * needs the top left AND bottom right corners of a rectangle for it to draw
             * on the screen.
             * 
             * alpha: the angle formed by the vertical line pointing y positive from
             * fixation moving to the line pointing the grid point from fixation (rad).
             * 
             * @returns {Map<number,object>} result : key-value pairs of grid indexes and their information
             */
            get_grid_pos() {
                let result = new Map();
                const r = this.ring_radius;
                const cx = this.screen_center_x, cy = this.screen_center_y;
                const sz = this.square_size;
                const p = this.subring_radius_proportion;
                let i = 1;  // grid number, to be set as the key of the output <Map>
                for (let j = 0; j < 3; j++) {   // three rings, from inner to outer
                    let n = this.ring_square_numbers[j];    // get # of squares in this ring
                    for (let k = 0; k < n; k++) {
                        // Create an Object to store grid info
                        let grid = {};
                        let angle = 2 * Math.PI / n;
                        grid.x = Math.cos(angle * k + Math.PI / 2) * r * p[j] + cx;
                        grid.y = Math.sin(angle * k + Math.PI / 2) * r * p[j] + cy;
                        grid.rect_x = grid.x - sz / 2;
                        grid.rect_y = grid.y - sz / 2;
                        grid.ecc = j + 1;     // eccentricity
                        grid.alpha = angle * k;
                        // Set the Object as the value of the key (grid number)
                        result.set(i, grid);
                        i++;
                    }

                }
                return result;
            }


        }
        /**
         * A class that represents an ACVS square. All the information, including its x
         * and y coordinates, side length (here denoted by w and h), color, digit on it,
         * whether it is a target square, whether it is an optimal target, etc.
         * 
         * 
         */
        disp.Rect = class {
            /**
             * 
             * @param {String} x 
             * @param {String} y 
             * @param {String} w 
             * @param {String} h 
             * @param {String} fill : the color of the <rect>
             */
            constructor(x, y, w, h, fill) {
                this.x = x;
                this.y = y;
                this.width = w;
                this.height = h;
                this.fill = fill;
            }
        }


        disp.Circle = class {
            /**
             * 
             * @param {String} cx
             * @param {String} cy 
             * @param {String} r 
             * @param {String} fill 
             * @param {String} stroke 
             * @param {String} strokeWidth : <svg> <circle> attr "stroke-width" 
             */
            constructor(cx, cy, r, fill, stroke, strokeWidth) {
                this.cx = cx;
                this.cy = cy;
                this.r = r;
                this.fill = fill;
                this.stroke = stroke;
                this.strokeWidth = strokeWidth;
            }
        }


        disp.Line = class {
            /**
             * 
             * @param {String} x1 
             * @param {String} y1 
             * @param {String} x2 
             * @param {String} y2 
             * @param {String} stroke 
             * @param {String} strokeWidth : <svg> <line> attr "stroke-width" 
             */
            constructor(x1, y1, x2, y2, stroke, strokeWidth) {
                this.x1 = x1;
                this.y1 = y1;
                this.x2 = x2;
                this.y2 = y2;
                this.stroke = stroke;
                this.strokeWidth = strokeWidth;
            }
        }


        disp.Text = class {
            /**
             * 
             * @param {String} text 
             * @param {String} x 
             * @param {String} y 
             * @param {String} fill 
             * @param {String} fontSize : <svg> -> <text> attr "font-size"
             * @param {String} className : <svg> -> <text> attr "class"
             */
            constructor(text, x, y, fill, fontSize, className) {
                this.text = text;
                this.x = x;
                this.y = y;
                this.fill = fill;
                this.fontSize = fontSize;
                this.className = className;
            }
        }/**
 * A class that encapsulates all the elements that will be used by d3 to draw on
 * the display.
 * 
 * @package ac-spatial-cue-1
 * @version 1.4 (07/21/2020)
 * @author Walden Li
 * 
 * @update 1.5 added a duplicate() method and removed the logic object
 * @update 1.4 added a setter method to logic
 * @update 1.3 added a "logic" object to the constructor
 * @update 1.2 fixed bugs in methods for adding arrays
 */
        disp.DisplayDataset = class {

            constructor(lines = [], texts = [], rects = [], circles = []) {
                this.lines = lines;
                this.texts = texts;
                this.rects = rects;
                this.circles = circles;
            }

            // Setter methods.
            set_lines(lines) { this.lines = lines }

            set_texts(texts) { this.texts = texts }

            set_rects(rects) { this.rects = rects }

            set_circles(circles) { this.circles = circles }

            // Methods for adding an array of objects to the display.
            add_lines(lines) { this.lines = this.lines.concat(lines) }

            add_texts(texts) { this.texts = this.texts.concat(texts) }

            add_rects(rects) { this.rects = this.rects.concat(rects) }

            add_circles(circles) { this.circles = this.circles.concat(circles) }

            // Methods for adding one object to the display.
            add_a_line(line) { this.lines.push(line) }

            add_a_text(text) { this.texts.push(text) }

            add_a_rect(rect) { this.rects.push(rect) }

            add_a_circle(circle) { this.circles.push(circle) }

            duplicate() {
                return new disp.DisplayDataset(this.lines, this.texts, this.rects, this.circles);
            }

            /**
             * Merge the current <DisplayDataset> with another one.
             * 
             * @param {disp.DisplayDataset} dispDataset 
             */
            merge(dispDataset) {
                this.add_lines(dispDataset.lines);
                this.add_texts(dispDataset.texts);
                this.add_rects(dispDataset.rects);
                this.add_circles(dispDataset.circles);
            }

        }/**
 * DisplayWidget is a class that encapsulates the logic for the visual display.
 * It is instantiated once in a <Trail>.
 * Previously, this module was responsible for not only the graphics but also
 * some ad-hoc data calculation. In the new version, <DisplayWidget> only
 * handles the graphic display.
 * Depending on the version of the ACVS experiment, <DisplayWidget> takes in a
 * <DisplayDataset> that contains a number of <disp.Square>, <disp.Digit>,
 * <disp.Circle>, <disp.Line>, etc. for d3 to draw on the screen.
 * 
 * @package ac-spatial-cue-1
 * @version 1.4 (07/20/2020)
 * @author Walden Li
 * 
 * @update 1.5 Added run_rsvp() method.
 */
        disp.DisplayWidget = class {
            constructor(parent) {
                this.parent = parent;   // the parent HTML element for the widget
                this.cue;
                this.stimuli;
                // Create the svg container element and selection
                this.svg_container = this.parent.selectAll("div").data([0]).enter().append("div")
                    .attr("class", "svg_container");
                // Create the svg element and selection
                this.svg = this.svg_container.selectAll("svg").data([0]).enter().append("svg")
                    .attr("viewBox", "0 0 100 100")
                    .attr("preserveAspectRatio", "xMinYMin meet")
                    .attr("class", "ace_svg_content_responsive");
                // TODO: a previously included event listener
                // window.addEventListener("resize", this.show.bind(this));  // redraw the graphic if the window resizes.
            }

            set_cue(cue) {
                this.cue = cue;
            }

            set_stimuli(stimuli) {
                this.stimuli = stimuli;
            }

            /** A method to destroy this widget object. */
            destroy() {
                this.parent.selectAll(".svg_container").remove();
                // window.removeEventListener("resize", this.show.bind(this));
                return undefined;
            }

            /** A method to clear the display. */
            clear() {
                this.parent.selectAll("rect").remove();
                this.parent.selectAll("circle").remove();
                this.parent.selectAll("line").remove();
                this.parent.selectAll("text").remove();
            }

            /**
             * This method clears the display and adds a string as a <text> element at
             * the display center.
             * 
             * @param {string} text
             */
            show_feedback(text) {
                this.clear();
                this.svg.append("text")
                    .text(text)
                    .attr("x", '50')
                    .attr("y", '50')
                    .attr("class", "acvs-feedback");
            }

            /**
             * The core method for the widget. It takes in a <DisplayDataset> where
             * shapes are encapsulated in customized classes, and uses d3.js to create
             * the corresponding svg elements under the parent element.
             * 
             * @param {disp.DisplayDataset} dataset
             */
            draw(dataset) {
                // console.log(dataset)
                // Clear the display
                this.clear();

                // Draw the rects
                const rects = this.svg.selectAll("rect").data(dataset.rects);
                rects.enter().append("rect")
                    .attr("x", d => d.x)
                    .attr("y", d => d.y)
                    .attr("width", d => d.width)
                    .attr("height", d => d.height)
                    .attr("fill", d => d.fill);
                rects.exit().remove();

                // Draw the circles
                const circles = this.svg.selectAll("circle").data(dataset.circles);
                circles.enter().append("circle")
                    .attr("cx", d => d.cx)
                    .attr("cy", d => d.cy)
                    .attr("r", d => d.r)
                    .attr("fill", d => d.fill)
                    .attr("stroke", d => d.stroke)
                    .attr("stroke-width", d => d.strokeWidth);
                circles.exit().remove();

                // Draw the lines
                const lines = this.svg.selectAll("line").data(dataset.lines);
                lines.enter().append("line")
                    .attr("x1", d => d.x1)
                    .attr("y1", d => d.y1)
                    .attr("x2", d => d.x2)
                    .attr("y2", d => d.y2)
                    .attr("stroke", d => d.stroke)
                    .attr("stroke-width", d => d.strokeWidth);
                lines.exit().remove();

                // Draw the texts
                const texts = this.svg.selectAll("text").data(dataset.texts);
                texts.enter().append("text")
                    .text(d => d.text)
                    .attr("x", d => d.x)
                    .attr("y", d => d.y)
                    .attr("fill", d => d.fill)
                    .attr("font-size", d => d.fontSize)
                    .attr("class", d => d.className);
                texts.exit().remove();


            }

            /** A method to draw the cue using draw(). */
            draw_cue() {
                this.draw(this.cue);
            }

            /** A method to draw the stimuli display using draw(). */
            draw_stimuli() {
                this.draw(this.stimuli);
            }

            /**
             * 
             * @param {disp.DisplayDataset} cue
             * @param {Array<disp.DisplayDataset>} stimuli
             * @param {number} cue_duration : time cue lasts
             * @param {number} soa : stimulus-onset async., time between cue and stimuli
             * @param {number} isi: interstimulus interval for the RSVP stream
             */
            run_rsvp(cue, stimuli, cue_duration, soa, isi) {

                setTimeout(() => { this.draw(cue) }, 0);

                setTimeout(() => { this.clear() }, cue_duration);

                for (let i = 0; i < stimuli.length; i++) {
                    setTimeout(() => { this.draw(stimuli[i]) }, isi * i + soa);
                }

            }

        }// Define an objection which will act as a namespace.
        'use strict'
        const exp = {};
        exp.TrialDataGenerator = class {

            constructor() {
                this._targetDigits = [2, 3, 4, 5];
                this._distractorDigits = [6, 7, 8, 9];
                this._display = new disp.Display();
                this._blockData = [];
            }


            /**
             * A helper method. Used to generate a "run" of trials in which the optimal
             * target have certain same attribute. For example, in previous color
             * versions of ACVS, we have "runs" of RED or BLUE optimal.  Here, we have
             * "runs" of LEFT or RIGHT optimal.
             * 
             * @param {number} num_opt_type : Number of optimal target types. For example, 2 for experiments that have BLUE optimal and RED optmial trials.
             * @param {number} num_total_trials : Number of trials in this block.
             * @param {number} max_rep : Maximum number of repitions allowed for each run of optimal target type trials.
             */
            _generate_opt_target_types(num_opt_type, num_total_trials, max_rep) {

                // Calculate the number of reps that need to be generated
                const reps = num_total_trials / num_opt_type;
                // if (reps%1 !== 0) throw("Total number of trials must be a multiple of optimal target types.")

                let result = [];
                for (let i = 0; i < num_opt_type; i++) {
                    for (let j = 0; j < reps; j++) {
                        result.push(i);
                    }
                }
                util.Util.fisher_yates_shuffle(result);

                // Check if there are more than MAXREP reps in a run
                let previous = result[0];
                // rep: current run rep numbers; maxRep: max rep numbers recorded so far
                let rep = 1, maxRep = 1;
                for (let i = 1; i < result.length; i++) {
                    if (result[i] === previous) {
                        rep++;
                    } else {
                        maxRep = Math.max(rep, maxRep);
                        rep = 1;
                    }
                    previous = result[i];
                }
                if (maxRep > max_rep) {
                    return this._generate_opt_target_types(num_opt_type, num_total_trials, max_rep)    // generate another array
                } else return result;

            }


            /**
             * Given display grid position info, the optimal target eccentricity, and
             * the non-optimal target eccentricity, return a js object with three items:
             * 0. "optTargPos" : the position (indexed between 0 - 53) of the opt targ
             * 1. "nonOptTargPos" : same as above, of the non opt targ
             * 2. "nonTargPool" : an array of randomized grid position indexes without
             *     two targets
             * 
             * @param {Map<number,object>} gridPos 
             * @param {number} optTargEcc 
             * @param {number} nonOptTargEcc 
             */
            _generate_target_pools_by_ecc(gridPos, optTargEcc, nonOptTargEcc) {

                // Add potential targets to pools according to required eccentricity
                let optTargPool = [];
                let nonOptTargPool = [];
                let nonTargPool = [];

                // If optTargEcc === nonOptTargEcc, put them in a combined pool, and 
                // then split in half
                let targPool = [];
                if (optTargEcc !== nonOptTargEcc) {
                    for (let [i, grid] of gridPos) {
                        if (grid.ecc === optTargEcc) {
                            optTargPool.push(i);
                        } else if (grid.ecc === nonOptTargEcc) {
                            nonOptTargPool.push(i);
                        } else {    // add the rest to non-target pool
                            nonTargPool.push(i);
                        }
                    }
                } else {
                    for (let [i, grid] of gridPos) {
                        if (grid.ecc === optTargEcc) {
                            targPool.push(i);
                        } else {    // add the rest to non-target pool
                            nonTargPool.push(i);
                        }
                    }
                    // find a rough center of the targPool
                    let n = Math.floor(targPool.length / 2);
                    // give each half of targPool items to optTargPool and nonOptTargPool
                    optTargPool = targPool.slice(0, n);
                    nonOptTargPool = targPool.slice(n);
                }

                // Randomly select targets
                const optTargPos = util.Util.select_rand_from_array(optTargPool, null, false);
                const nonOptTargPos = util.Util.select_rand_from_array(nonOptTargPool, null, false);

                // Add the rest to non-target pool
                nonTargPool = nonTargPool.concat(optTargPool).concat(nonOptTargPool);
                // Shuffle the non-target pool
                util.Util.fisher_yates_shuffle(nonTargPool);

                // Return three things with an object
                return {
                    optTargPos: optTargPos,
                    nonOptTargPos: nonOptTargPos,
                    nonTargPool: nonTargPool
                };

            }

            /**
             * Returns the next array of <DisplayDataset> with a trial condition
             * logic array in this block.  When exhausted this method will return null.
             * 
             */
            yield_trial_dataset() {
                if (this._blockData.length > 0) {
                    return this._blockData.pop();
                } else {
                    return null;
                }
            }

        }/**
 * The classical ACVS as in Irons & Leber (2018).
 * 
 * RED optimal trials: 13 RED, 27 BLUE, 14 GREEN
 * BLUE optimal trials: 27 RED, 13 BLUE, 14 GREEN
 * 
 * @package acvs-online
 * @version 1.4 (9/7/2020)
 * @author Walden Li
 */
        exp.StandardTrialDataGenerator = class extends exp.TrialDataGenerator {

            constructor(is_practice = false, has_preview = false) {
                super();
                this._is_practice = is_practice; // if block is practice block, _make_block_dataset will return only 10 trials
                this._has_preview = has_preview; // if task has preview, _make_stimuli_dataset will return both preview and search array displays
                this._numTotalTrials = 108;
                this._colors = [
                    "rgb(255, 0, 0)",
                    "rgb(0, 0, 255)",
                    "rgb(0, 150, 0)"
                ];
                // 1+1+14+12+12+14=54
                this._numGreenDist = 14;
                this._numRedDist = 12;
                this._numBlueDist = 12;
                this._numVarDist = 14;
                this._trialConds = this._generate_trial_conditions();
                this._blockData = this._make_block_dataset(this._trialConds);
            }


            /**
             * Crossed variables: optEcc (3) * nonOptEcc (3) * optDigit (4) * nonOptDigit (3) = 108
             * Balanced variables: opt & nonOpt colors (2)
             * 
             * An example of one row is 3 1 3 4 1 2, which means this trial has an
             * optimal target on the ring furthermost to the center, a digit 3, and is
             * colored RED, as well as a non-optimal target on the ring closest to the
             * center, a digit 4, and is colored BLUE.
             */
            _generate_trial_conditions() {

                let result = [];

                for (let ecc1 = 1; ecc1 <= 3; ecc1++) {
                    for (let ecc2 = 1; ecc2 <= 3; ecc2++) {
                        for (let d1 = 2; d1 <= 5; d1++) {
                            for (let d2 = 2; d2 <= 5; d2++) {
                                if (d1 !== d2) result.push([ecc1, ecc2, d1, d2]);
                            }
                        }
                    }
                }
                result = util.Util.fisher_yates_shuffle(result);

                let optTargColorArray = this._generate_opt_target_types(2, this._numTotalTrials, 6);
                let optColor, nonOptColor;  // temp vars for each trial
                for (let i = 0; i < result.length; i++) {
                    optColor = optTargColorArray.pop();
                    optColor === 1 ? nonOptColor = 0 : nonOptColor = 1;
                    result[i] = result[i].concat([optColor, nonOptColor]);
                }

                return result;

            }


            /**
             * 
             * @param {number} optTargColor : 0, 1
             * @param {number} nonOptTargColor : 0, 1
             * @param {number} optTargEcc : 1-3
             * @param {number} nonOptTargEcc : 1-3
             * @param {number} optTargDigit : 2-5
             * @param {number} nonOptTargDigit : 2-5
             */
            _make_trial_dataset(optTargEcc, nonOptTargEcc, optTargDigit,
                nonOptTargDigit, optTargColor, nonOptTargColor) {
                const x = this._display.screen_center_x;
                const y = this._display.screen_center_y;
                const sz = this._display.square_size;

                let fixation = new disp.DisplayDataset();
                let preview = new disp.DisplayDataset();
                let stimuli = new disp.DisplayDataset();

                const gridPos = this._display.get_grid_pos();

                const targPosInfo = this._generate_target_pools_by_ecc(gridPos, optTargEcc, nonOptTargEcc);
                const optTargPos = targPosInfo.optTargPos;
                const nonOptTargPos = targPosInfo.nonOptTargPos;
                const nonTargPool = targPosInfo.nonTargPool;

                const optTargGrid = gridPos.get(optTargPos);
                const nonOptTargGrid = gridPos.get(nonOptTargPos);

                // 1. Add two targets

                // 1.1 Add rects to both preivew and stimuli (if a preview is ordered)
                let optRect = new disp.Rect(
                    optTargGrid.rect_x + '',
                    optTargGrid.rect_y + '',
                    sz + '',
                    sz + '',
                    this._colors[optTargColor]
                );
                let nonOptRect = new disp.Rect(
                    nonOptTargGrid.rect_x + '',
                    nonOptTargGrid.rect_y + '',
                    sz + '',
                    sz + '',
                    this._colors[nonOptTargColor]
                );

                stimuli.add_rects([optRect, nonOptRect]);

                if (this._has_preview) preview.add_rects([optRect, nonOptRect]);

                // 1.2 Add digits to stimuli but not preview
                stimuli.add_a_text(new disp.Text(
                    optTargDigit + '',
                    optTargGrid.x + this._display.digit_shift_x + '',
                    optTargGrid.y + this._display.digit_shift_y + '',
                    this._display.digit_color,
                    this._display.digit_size,
                    this._display.digit_class_name
                ));
                stimuli.add_a_text(new disp.Text(
                    nonOptTargDigit + '',
                    nonOptTargGrid.x + this._display.digit_shift_x + '',
                    nonOptTargGrid.y + this._display.digit_shift_y + '',
                    this._display.digit_color,
                    this._display.digit_size,
                    this._display.digit_class_name
                ));

                // 2. Add GREEN distractor rects and digits. They can be of any digit.
                for (let i = 0; i < this._numGreenDist; i++) {

                    let j = nonTargPool.pop();  // grid position number
                    let grid = gridPos.get(j);  // grid info

                    // 2.1 add rects to both preview and stimuli
                    let currentRect = new disp.Rect(
                        grid.rect_x + '',
                        grid.rect_y + '',
                        sz + '',
                        sz + '',
                        this._colors[2]
                    );
                    stimuli.add_a_rect(currentRect);
                    if (this._has_preview) preview.add_a_rect(currentRect);

                    // 2.2 add digits to only stimuli
                    stimuli.add_a_text(new disp.Text(
                        util.Util.select_rand_from_array(this._targetDigits.concat(this._distractorDigits)) + '',
                        grid.x + this._display.digit_shift_x + '',
                        grid.y + this._display.digit_shift_y + '',
                        this._display.digit_color,
                        this._display.digit_size,
                        this._display.digit_class_name
                    ));
                }

                // 3. Add RED distractor rects and digits. Digits must be 6-9.
                for (let i = 0; i < this._numRedDist; i++) {

                    let j = nonTargPool.pop();  // grid position number
                    let grid = gridPos.get(j);  // grid info

                    // 3.1 add rects to both preview and stimuli
                    let currentRect = new disp.Rect(
                        grid.rect_x + '',
                        grid.rect_y + '',
                        sz + '',
                        sz + '',
                        this._colors[0]
                    );
                    stimuli.add_a_rect(currentRect);
                    if (this._has_preview) preview.add_a_rect(currentRect);

                    // 3.2 add digits to only stimuli
                    stimuli.add_a_text(new disp.Text(
                        util.Util.select_rand_from_array(this._distractorDigits) + '',
                        grid.x + this._display.digit_shift_x + '',
                        grid.y + this._display.digit_shift_y + '',
                        this._display.digit_color,
                        this._display.digit_size,
                        this._display.digit_class_name
                    ));
                }

                // 4. Add BLUE distractor rects and digits. Digits must be 6-9.
                for (let i = 0; i < this._numBlueDist; i++) {

                    let j = nonTargPool.pop();  // grid position number
                    let grid = gridPos.get(j);  // grid info

                    // 4.1 add rects to both preview and stimuli
                    let currentRect = new disp.Rect(
                        grid.rect_x + '',
                        grid.rect_y + '',
                        sz + '',
                        sz + '',
                        this._colors[1]
                    );
                    stimuli.add_a_rect(currentRect);
                    if (this._has_preview) preview.add_a_rect(currentRect);

                    // 4.2 add digits to only stimuli
                    stimuli.add_a_text(new disp.Text(
                        util.Util.select_rand_from_array(this._distractorDigits) + '',
                        grid.x + this._display.digit_shift_x + '',
                        grid.y + this._display.digit_shift_y + '',
                        this._display.digit_color,
                        this._display.digit_size,
                        this._display.digit_class_name
                    ));
                }

                // 5. Add variable distractor rects and digits
                for (let i = 0; i < this._numVarDist; i++) {

                    let j = nonTargPool.pop();  // grid position number
                    let grid = gridPos.get(j);  // grid info

                    // 5.1 add rects to both preview and stimuli
                    let currentRect = new disp.Rect(
                        grid.rect_x + '',
                        grid.rect_y + '',
                        sz + '',
                        sz + '',
                        // if opt targ color is RED, var dist color should be blue, and vice versa
                        optTargColor === 0 ? this._colors[1] : this._colors[0]
                    );
                    stimuli.add_a_rect(currentRect);
                    if (this._has_preview) preview.add_a_rect(currentRect);

                    // 5.2 add digits to only stimuli
                    stimuli.add_a_text(new disp.Text(
                        util.Util.select_rand_from_array(this._distractorDigits) + '',
                        grid.x + this._display.digit_shift_x + '',
                        grid.y + this._display.digit_shift_y + '',
                        this._display.digit_color,
                        this._display.digit_size,
                        this._display.digit_class_name
                    ));
                }

                // Finally, generate a fixation cross to everything
                const fixation_text = new disp.Text(
                    '+', x, y, 'white', 3, this._display.fixation_cross_class_name
                );

                fixation.add_a_text(fixation_text);
                if (this._has_preview) preview.add_a_text(fixation_text);
                stimuli.add_a_text(fixation_text);


                // Decide if return includes a preview
                if (this._has_preview) {
                    return {
                        cue: [fixation, preview],
                        stimuli: [stimuli]
                    }
                }
                return {
                    cue: [fixation],
                    stimuli: [stimuli]
                }

            }


            _make_trial_logic(optTargEcc, nonOptTargEcc, optTargDigit,
                nonOptTargDigit, optTargColor, nonOptTargColor) {
                return (
                    {
                        optTargEcc: optTargEcc,
                        nonOptTargEcc: nonOptTargEcc,
                        optTargDigit: optTargDigit,
                        nonOptTargDigit: nonOptTargDigit,
                        optTargColor: optTargColor,
                        nonOptTargColor: nonOptTargColor
                    }
                );
            }

            /**
             * 
             * 
             * @param {Array<number>} trialConds 
             */
            _make_block_dataset(trialConds) {
                let trial_conditions = trialConds.slice();  // make a copy
                let result = [];
                let currentTrialCond;
                while (trial_conditions.length > 0) {
                    currentTrialCond = trial_conditions.pop();
                    let currentTrialDisplays = this._make_trial_dataset(...currentTrialCond);
                    let currentTrialLogic = this._make_trial_logic(...currentTrialCond);
                    result.push(
                        {
                            "logic": currentTrialLogic,
                            "cue": currentTrialDisplays.cue,
                            "stimuli": currentTrialDisplays.stimuli
                        }
                    );
                }
                if (this._is_practice) return result.slice(0, 10);
                return result;
            }

        }///////////////////////////////////////////////////////////////////////////////
        ///
        /// Abstract Base Class for Block Trials
        ///
        exp.AbstractTrial = class {
            constructor() {
                this.trial_completed_signal = null //new util.Signal();
            }

            /////////////////////////////////////////////////////////////////////////////
            ///
            /// All subclasses should override this method in order to provide the
            /// behavior for the trial.
            ///
            run_trial() {
                throw ("abstract method called");
            }
        }
        /**
         * 
         */
        exp.Trial = class extends exp.AbstractTrial {

            constructor(logic, cue, stimuli, timing) {
                super();
                // Check if enough time stamps are provided
                if ((timing.length - 1) !== cue.length) throw ("ERROR: Mismatch in cue frames and number of time stamps");
                this.logic = logic;
                this.timing = timing;
                this.cue = cue;
                this.stimuli = stimuli;


                this.trial_completed_signal = new util.Signal();

                this.display_widget = new disp.DisplayWidget(exp.HtmlGui.workspace());

                this.display_widget.set_cue(cue);
                this.display_widget.set_stimuli(stimuli);

                // create an object to store the data for this Trial
                this.trial_data = { "trialCreatedAt": performance.now() };
                // this is the amount of time a message is shown to the user after hitting
                // a response key
                this.duration_feedback = util.Util.is_test_mode() ? 0 : 1000;
                // this is the amount of time a fixation cross is shown to the user before
                // the graphic is shown

                //TODO: blank screen 500ms

                // //TODO: cue for 1000ms
                // this.length_of_time_cue_is_shown = 1000;

                // this.length_of_time_cross_is_shown = 1500 // ms
                // this maps the answer keys to the target numbers
                this.answer_keys = new Map([["v", 2], ["b", 3], ["n", 4], ["m", 5]]);
                // this is a counter for the total number of keys the user presses during
                // the trial
                this.num_keys_pressed = 0;

                // These two parameters are used in blockstep
                this._block_number;
                this._trial_number_in_block;
            }

            ///////////////////////////////////////////////////////////////////////////////
            ///
            /// helper method which creates and initializes the settings for the chart-
            /// graphic for this trial.
            ///
            initialize_chart_settings() {
                exp.HtmlGui.clear_header();
                exp.HtmlGui.clear_workspace();
            }

            ///////////////////////////////////////////////////////////////////////////////
            ///
            /// helper method which creates and initializes the KeyFilter to capture user
            /// input during this trial.
            ///
            initialize_keyboard() {
                this.keyboard = new util.KeyFilter((function (the_key_the_user_pressed) {
                    let time_stamp = performance.now();
                    this.num_keys_pressed += 1;

                    if (this.answer_keys.has(the_key_the_user_pressed)) {
                        this.respond_to_valid_user_keyboard_input(the_key_the_user_pressed, time_stamp);
                    } else {
                        this.respond_to_invalid_user_keyboard_input(the_key_the_user_pressed);
                    }
                }).bind(this), false);
            }

            ///////////////////////////////////////////////////////////////////////////////
            ///
            /// helper method providing the logic for what happens when the user hits a
            /// valid key.
            ///
            respond_to_valid_user_keyboard_input(the_key_the_user_pressed, time_stamp) {
                let result = false;
                if (this.answer_keys.get(the_key_the_user_pressed) == this.logic.optTargDigit ||
                    this.answer_keys.get(the_key_the_user_pressed) == this.logic.nonOptTargDigit) {
                    result = true;
                } else {
                    util.Util.play_beep_sound();
                }

                this.trial_data.blockTrial = this._trial_number_in_block;
                this.trial_data.blockNumber = this._block_number;

                this.trial_data.logic = this.logic;

                // this.trial_data.optTargIndex = this.logic.optTargIndex;
                // this.trial_data.nonOptTargIndex = this.logic.nonOptTargIndex;

                // this.trial_data.optTargDigit = this.logic.optTargDigit;
                // this.trial_data.nonOptTargDigit = this.logic.nonOptTargDigit;

                // this.trial_data.optTargEcc = this.logic.optTargEcc;
                // this.trial_data.nonOptTargEcc = this.logic.nonOptTargEcc;

                // this.trial_data.optTargRegion = this.logic.optTargRegion;
                // this.trial_data.nonOptTargRegion = this.logic.nonOptTargRegion;

                this.trial_data.response = this.answer_keys.get(the_key_the_user_pressed);
                this.trial_data.targChoice = this.trial_data.response == this.trial_data.optTargDigit ? 1 :
                    this.trial_data.response == this.trial_data.nonOptTargDigit ? 2 :
                        0;
                this.trial_data.acc = result ? 1 : 0;
                this.trial_data.bool = result;
                this.trial_data.rt = time_stamp - this.trial_data.stimuli_shown_at;
                this.trial_data.answerKeyRecieved = the_key_the_user_pressed;
                this.trial_data.answerDigitRecieved = this.answer_keys.get(the_key_the_user_pressed);
                this.trial_data.numberOfKeysPressed = this.num_keys_pressed;
                this.trial_data.answerRecievedAt = time_stamp;
                this.trial_data.result = result ? "correct" : "incorrect";
                // this.trial_data.chart_dataset = this.chart_dataset;

                this.keyboard = this.keyboard.destroy();
                this.show_debriefing();
            }

            ///////////////////////////////////////////////////////////////////////////////
            ///
            /// helper method providing the logic for what happens when the user hits an
            /// invalid key.
            ///
            respond_to_invalid_user_keyboard_input(the_key_the_user_pressed) {
                exp.HtmlGui.show_message("Key '" + the_key_the_user_pressed + "' not recognized. Please use: 'v' for 2, 'b' for 3, 'n' for 4, and 'm' for 5", "red");

                util.Util.play_beep_sound();

                setTimeout(function () {
                    exp.HtmlGui.show_message(".", "black");
                }, 2000);
            }

            ///////////////////////////////////////////////////////////////////////////////
            ///
            /// helper method providing the logic for what is shown to the user after
            /// completing the trial by providing valid user input.
            ///
            show_debriefing() {
                // WL: this is adapted from RewardTrial.js
                if (this.trial_data.result == "incorrect") {
                    this.display_widget.show_feedback("Incorrect");
                } else {
                    this.display_widget.show_feedback("Correct");
                }

                if (window._secret_speed != undefined) {
                    this.duration_feedback = window._secret_speed;
                }

                setTimeout((function () {
                    this.display_widget = this.display_widget.destroy();
                    this.trial_completed_signal.emit(this.trial_data);
                }).bind(this), this.duration_feedback);
            }

            ///////////////////////////////////////////////////////////////////////////////
            ///
            /// Executes this trial of the block.
            ///
            run_trial() {
                // this.initialize_chart_settings();
                this.initialize_keyboard();

                // show the fixation cross
                // this.chart_widget.show_cross_only();
                this.display_widget.clear();

                if (window._test) {
                    this.keyboard.turn_on();
                }

                for (let i = 0; i < this.cue.length; i++) {
                    setTimeout((() => {
                        this.display_widget.draw(this.cue[i]);
                    }).bind(this), this.timing[i]);
                }

                for (let i = 0; i < this.stimuli.length; i++) {
                    setTimeout((() => {
                        this.display_widget.draw(this.stimuli[i]);
                        // turn on keyboard at the first iteration
                        if (i == 0) {
                            this.keyboard.turn_on();
                            this.trial_data.stimuli_shown_at = performance.now();
                        }
                    }).bind(this), this.timing[this.cue.length + i]);
                }

            }

        }///////////////////////////////////////////////////////////////////////////////
        ///
        /// <HtmlGui> contains simple high-level helper methods for manipulating the
        /// html representing the user-interface.
        ///
        exp.HtmlGui = class HtmlGui {

            /////////////////////////////////////////////////////////////////////////////
            ///
            /// Return the main div for the gui
            ///
            static guiDiv() {
                return d3.select('#gui');
            }

            /////////////////////////////////////////////////////////////////////////////
            ///
            /// Create and show a header area with the given text
            ///
            static show_header(text) {
                // clear any existing header
                HtmlGui.clear_header();
                // add a new header <div>
                d3.select("body")
                    .insert("div", ":first-child")
                    .attr("class", "ace_header")
                    .attr("id", "headerDiv")
                    .html(text);
            }

            /////////////////////////////////////////////////////////////////////////////
            ///
            /// Clear the header area
            ///
            static clear_header() {
                d3.selectAll("#headerDiv").remove();
            }

            /////////////////////////////////////////////////////////////////////////////
            ///
            /// Return a D3 selection of the workspace, assuming it exists
            ///
            static workspace() {
                return d3.select("#workspace");
            }

            /**
             * This method clears every <div> under #workspace
             * Note: In the previous version the method was to delete the whole #workspace
             * entirely and create a new identitical #workspace under its parent element.
             * This would completely remove all the class attributes and event listeners
             * manipulated by JS code, so it was not an ideal way to do it.
             */
            static clear_workspace() {
                // delete any existing workspace <div>
                d3.selectAll("#workspace *").remove();
            }

            /////////////////////////////////////////////////////////////////////////////
            ///
            /// Inserts text on the window
            ///
            static append_paragraphs(html, font_size = 1.5) {
                HtmlGui.workspace().selectAll("p").data(html)
                    .enter().append("p")
                    .style("font-size", String(font_size) + "em")
                    .html(function (d) { return d; });
            }

            /////////////////////////////////////////////////////////////////////////////
            ///
            /// Inserts an image into the window
            ///
            static append_image(img) {
                img = [img.src];
                HtmlGui.workspace().selectAll("img").data(img)
                    .enter().append("img")
                    .attr('src', function (d) { return d; })
                    .attr('class', "ace_centered_div_content");
            }

            /////////////////////////////////////////////////////////////////////////////
            ///
            /// Inserts a button on the window
            ///
            static append_button(buttonText, onClickCallback) {
                let button = HtmlGui.workspace().selectAll("button").data([buttonText])
                    .enter().append("button");
                button.text(function (d) { return d; });
                button.attr("id", function (d) { return d + "_button"; });
                button.on("click", onClickCallback);
            }

            /////////////////////////////////////////////////////////////////////////////
            ///
            /// Create and show a message area with the given text
            ///
            static show_message(text, color = "white") {
                // clear any existing header
                HtmlGui.clear_message();
                // add a new header <div>
                d3.select("body")
                    .insert("div", ":first-child")
                    .attr("class", "ace_message_area")
                    .attr("id", "messageDiv")
                    .style("color", color)
                    .html(text);
            }

            /////////////////////////////////////////////////////////////////////////////
            ///
            /// Clear the message area
            ///
            static clear_message() {
                d3.selectAll("#messageDiv").data([]).exit().remove();
            }
        }
        /**
         * The <PreparationStep> will do the following preparation before entering the
         * experiment.
         * 
         * First, gather information from the user's web browser, and if the window
         * is not maximized, alert the user to enter full screen.
         * 
         * Second, show the user informed consent and options to accept or decline.
         * 
         * Third,
         * 
         * @package ac-spatial-cue-1
         * @version 1.1 (07/23/2020)
         * @author Walden Li
         * 
         */
        exp.PreparationStep = class extends (util.AbstractStep) {

            constructor(db) {
                super();
                this._db = db;
            }

            execute() {

                this._db.EventsTable.add_new_row("Begin Preparation Step.");

                // Store browser information
                this._db.BrowserInfo = {};
                this._db.BrowserInfo.browser_name = bowser.name;
                console.log(this._db.BrowserInfo.browser_name);

            }

        }
        exp.TestStep = class extends util.AbstractStep {

            constructor(db) {
                super();
                this._db = db;
            }

            execute() {
                exp.HtmlGui.append_paragraphs([
                    "The following experiment is running under the test mode.",
                    "You can specify relevant task parameters if needed."
                ])
                exp.HtmlGui.workspace().append("button").text("dsaf");
                setTimeout(() => { this.step_completed_signal.emit(); }, 5000)
            }

        }/**
 * 
 */
        exp.ConsentStep = class extends (util.AbstractStep) {
            constructor(db) {
                super();
                this._db = db;
            }

            execute() {

                const CONSENT_FORM_URL = "https://psy-ccl.asc.ohio-state.edu/files/forms/consent_REP_online_exempt.pdf";
                const SUB_ID = d3.select("#hidden-sub-id").html();

                // The message
                exp.HtmlGui.workspace().append("p")
                    .html("The following is the consent form. Please read it carefully.")
                    .style("font-size", "1.2em")
                    .style("font-style", "italic")
                    .style("text-align", "center")

                // Use an <iframe> to display the consent form
                exp.HtmlGui.workspace().append("iframe")
                    .attr("width", "70%")
                    .attr("height", "400")
                    .attr("src", CONSENT_FORM_URL);

                const responseArea = exp.HtmlGui.workspace().append("div")
                    .attr("id", "consent-response-area")
                    .style("width", "80%")
                    .style("display", "block")
                    .style("margin", "auto");

                responseArea.append("button")
                    .attr("class", "btn-wide")
                    .text("I agree to participate")
                    .on("click", (function () {
                        this._db.EventsTable.add_new_row("Subject agreed to consent form");
                        alert("Before we get started, please answer 2 quick questions.");
                        let age = prompt("Please type your age:", "N/A");
                        let gender = prompt("Please type your gender:", "N/A");
                        alert("Thank you!");
                        this._db._user_data = {
                            self_reported_age: age,
                            self_reported_gender: gender,
                            sub_id: SUB_ID
                        };
                        exp.HtmlGui.clear_workspace();
                        this.step_completed_signal.emit();
                    }).bind(this));

                responseArea.append("button")
                    .text("I do NOT agree to participate")
                    .attr("class", "btn-wide")
                    .on("click", () => {
                        exp.HtmlGui.clear_header();
                        exp.HtmlGui.clear_workspace();
                        exp.HtmlGui.append_paragraphs([
                            "<br><br><br><br>",
                            "You have declined to participate.",
                            "<br>",
                            "Thank you for your consideration.",
                            "<br>",
                            "You may now close the tab."
                        ]);
                    });

            }

        }/**
 * A step class that collects the participant's browser information and prompt
 * them to enter full screen, if they have not already.
 * 
 * Some useful API documentation for reference.
 * Full-screen related:
 * https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API
 * https://developer.mozilla.org/en-US/docs/Web/API/Element/requestFullScreen
 * Detect full-screen:
 * https://developer.mozilla.org/en-US/docs/Web/API/DocumentOrShadowRoot/fullscreenElement
 * 
 * @package ac-spatial-cue-1
 * @version 1.1 (08/04/2020)
 * @author Walden Li
 */
        exp.CheckBrowserStep = class extends (util.AbstractStep) {

            constructor(db) {
                super();
                this._db = db;
            }

            execute() {

                if (navigator.cookieEnabled === false) {

                }

                const is_fullscreen = () => { return document.fullscreenElement !== null };

                // This function requests the browser to enter full screen. In Chrome,
                // the request can only be called by a user action such as a mouseclick
                // or a keypress, for security reasons.
                // This function checks if the browser is in full-screen mode. If not,
                // it will reveal the overlay div and prompt user to click to trigger
                // a full-screen request. It will then 
                const check_fullscreen = () => {
                    if (!is_fullscreen()) {
                        document.getElementById("overlay").style.display = "block";
                        document.getElementById("overlay").addEventListener(
                            "click", document.documentElement.requestFullscreen
                        );
                        document.onfullscreenchange = () => {
                            document.getElementById("overlay").style.display = "none";
                            check_fullscreen();
                        }
                    } else {
                        document.onfullscreenchange = () => check_fullscreen();
                    }
                }

                this._db.EventsTable.add_new_row("Checking Browser Step");


                // Initiate the 
                check_fullscreen();
                this.step_completed_signal.emit();
            }

        }/**
 * The preparation step is intended to collect participant's demographic
 * information.
 */
        exp.PreparationStep = class extends (util.AbstractStep) {
            constructor(db) {
                super();
                this._db = db;
            }

            execute() {


                // exp.HtmlGui.clear_header();
                // exp.HtmlGui.clear_workspace();

                const form = exp.HtmlGui.workspace().append("form")
                    .attr("name", "info")
                    .attr("id", "participant-info");
                form.append("label").html("Age");


                // this.step_completed_signal.emit();
            }

        }/**
 * <Block> represents a block of ACVS experiment.
 * 
 * @package acvs-online
 * @author Walden Li
 * @version 1.4 (8/30/2020)
 */
        exp.Block = class extends util.AbstractStep {

            /**
             * 
             * @param {util.Database} db 
             * @param {number} blockNo 
             * @param {string} blockType
             * @param {exp.TrialDataGenerator} dataGenerator 
             */
            constructor(db, blockNo, blockType, dataGenerator) {
                super();

                this._db = db;

                this._blockNo = blockNo;

                this._blockType = blockType;

                this._display_dataset_generator = dataGenerator;

                // array of 1s & 0s for "correct" & "incorrect" for each trial
                this._accuracy_data = [];

                // array of all of the data for all for each of the trials
                this._all_trials_data = [];

                this._trial_num = 1;

            }


            /**
             * 
             * @param {exp.TrialInfo} logic : the condition of the trial
             * @param {Array<disp.DisplayDataset>} cue : an array (usually one element) that contains the cue <DisplayDataset>(s) for the trial
             * @param {Array<disp.DisplayDataset>} stimuli : array (also usually one element) that contains the stimuli <DisplayDataset>(s) for the trial
             */
            _construct_trial(logic, cue, stimuli) {
                switch (this._blockType) {
                    case "Standard":
                        if (util.Util.is_test_mode()) return new exp.Trial(logic, cue, stimuli, [0, 0, 0]);
                        return new exp.Trial(logic, cue, stimuli, [0, 400, 1400]);
                    // return new exp.Trial(logic, cue, stimuli, [0, 0, 0]);
                    case "ColorCue":
                        return new exp.Trial(logic, cue, stimuli, [0, 1000]);
                }
            }

            _run_next_trial(previous_results = null) {
                if (previous_results != null) {
                    this._accuracy_data.push(previous_results.bool);
                    this._all_trials_data.push(previous_results);
                }

                let datasets = this._display_dataset_generator.yield_trial_dataset();

                if (datasets != null) {
                    // create a new trial
                    let trial = this._construct_trial(datasets.logic, datasets.cue, datasets.stimuli);
                    trial._trial_number_in_block = this._trial_num;
                    this._trial_num++;
                    trial._block_number = this._blockNo;

                    // when the trial is completed call the next trial (~recursive)
                    trial.trial_completed_signal.connect(this._run_next_trial.bind(this));

                    // start the trial
                    trial.run_trial();
                } else {
                    // all trials have been completed so tell the user how they did.
                    this._save_data();
                    this._show_summary();
                }
            }

            _save_data() {
                this._db.ExperimentTable.add_new_row(this._blockNo, this._all_trials_data);
                console.log(this._db);
                localStorage.setItem(window._acvs_guid, btoa(JSON.stringify(this._db)));
            }

            _show_summary() {
                util.Workspace.show_cursor();
                let paragraph = [];
                paragraph.push("<br><br><br>");
                if (this._blockNo !== 0) {
                    paragraph.push("<b>You Completed Block #" + this._blockNo + "!</b>");
                }
                paragraph.push("<b>You complete the practice block!</b>");
                paragraph.push("<hr>");
                paragraph.push("Your Accuracy: " + (Math.round(util.Util.mean(this._accuracy_data) * 1000) / 10) + "%");
                paragraph.push("<hr>");
                paragraph.push("<b>Ready to continue?</b>");
                exp.HtmlGui.append_paragraphs(paragraph);

                // create a button for the user to press to acknowledge
                exp.HtmlGui.append_button("Yes", this.step_completed_signal.emit.bind(this.step_completed_signal));
                exp.HtmlGui.clear_message()
            }

            execute() {
                util.Workspace.hide_cursor();
                exp.HtmlGui.clear_header();
                exp.HtmlGui.clear_workspace();
                this._db.EventsTable.add_new_row("beginning block step #" + this._blockNo);
                this._run_next_trial();
                exp.HtmlGui.show_message(".", "black");
            }

        }///////////////////////////////////////////////////////////////////////////////
        ///
        /// The <BriefingSet> is used to put an image on the screen. The step will
        /// end when the user types the "key".
        ///
        exp.BriefingStep = class extends (util.AbstractStep) {
            constructor(db, htmlImgTag, callbackKey) {
                super();
                this._db = db;
                this._htmlImgTag = htmlImgTag;
                this._callbackKey = callbackKey;
            }

            ///////////////////////////////////////////////////////////////////////////////
            ///
            /// Override the <AbstractStep> execute method.
            ///
            execute() {
                // show the image on screen
                exp.HtmlGui.clear_header();
                exp.HtmlGui.clear_workspace();
                exp.HtmlGui.append_paragraphs([this._htmlImgTag]);

                // if the user hits the callbackKey, then the step will exit
                let keyboard = new util.KeyFilter((function (key) {
                    if (key == this._callbackKey) {
                        keyboard.destroy();
                        this._db.EventsTable.add_new_row("briefing was step completed");
                        // while(!util.Util.window_is_maximized()) {}
                        this.step_completed_signal.emit();
                    }
                }).bind(this)
                );
            }
        }
        ///////////////////////////////////////////////////////////////////////////////
        ///
        /// <FeedbackStep> gathers general feedback from the participant.
        ///
        exp.FeedbackStep = class extends (util.AbstractStep) {
            constructor(db) {
                super();
                this._db = db;
            }


            validateForm() {
                let x = document.forms["myForm"]["Text1"].value;
                alert(x);
                this._db._userFeedback = x;
                this._db.EventsTable.add_new_row("user feedback was collected");
                setTimeout(this.step_completed_signal.emit(), 100);
            }

            /////////////////////////////////////////////////////////////////////////////
            ///
            /// Override the AbstractStep execute method.
            ///
            execute() {


                exp.HtmlGui.clear_workspace();

                let paragraphs = []
                paragraphs.push("<br><br><br>");
                paragraphs.push("<hr>");
                paragraphs.push('Please describe what you were thinking about during the task (i.e. strategy for completing the task, thoughts, moods, location) or general feedback about the experiment.');
                paragraphs.push('<br><br><br>');
                paragraphs.push('If you do not want ot provide this information type NA.');
                paragraphs.push('<br><br><br>');
                paragraphs.push('<textarea name="Text1" cols="40" rows="5"></textarea> <br>');
                paragraphs.push("<hr>");

                exp.HtmlGui.append_paragraphs(paragraphs);
                exp.HtmlGui.append_button("Continue", this.validateForm.bind(this));

            }
        }
        /**
         * Submit data step. Changed from using an ajax call to send stringified json
         * database to an XMLHttpRequest.
         * 
         * @package acvs-online
         * @version 1.4
         * @author Walden Li
         */
        exp.SubmitDataStep = class extends util.AbstractStep {

            constructor(db) {
                super();
                this._db = db;
            }

            execute() {

                exp.HtmlGui.clear_workspace();
                exp.HtmlGui.show_header("Online REP Experiment - Cognitive Control Lab");
                d3.select("#overlay").remove();

                $.ajax({
                    type: "POST",
                    // url: "receive.php",
                    url: "https://tuiqiang.org/ac/receive.php",
                    data: {
                        "full": JSON.stringify(this._db)
                    },
                    success: function () {
                        console.log("success");
                    },
                    failure: function (errMsg) {
                        alert(errMsg);
                    }
                });

                // Debriefing title
                exp.HtmlGui.workspace().append("p").attr("class", "debriefing-title")
                    .html("-- End of experiment --");

                // Debriefing message
                exp.HtmlGui.workspace().append("p").attr("class", "debriefing-msg")
                    .html(
                        "You have completed the experiment. Thank you for your " +
                        "participation. If you have any questions or concerns, " +
                        "please email us at all of the following addresses:</br>" +
                        "li.6942@osu.edu (Walden Li), leber.30@osu.edu (Dr. Andrew Leber), cognitivecontrol@osu.edu" +
                        "</br></br>" +
                        "For your information, please find the debriefing form attached:"
                    );

                // Debriefing form button
                exp.HtmlGui.workspace().append("button")
                    .attr("class", "btn-regular")
                    .text("Download")
                    .on("click", () => {
                        window.open("https://psy-ccl.asc.ohio-state.edu/files/forms/debrief_REP_online.pdf")
                    });

                // exp.HtmlGui.workspace().append("button")
                //     .attr("class", "btn-regular")
                //     .text("Exit")
                //     .on("click", () => {
                //         document.exitFullscreen();
                //     });

                this._db.EventsTable.add_new_row("Data submitted.");
                util.Util.set_cookie("completed_acvs", "true", 30);

            }

        }///////////////////////////////////////////////////////////////////////////////
        ///
        /// The default implementation of the Adaptive Choice Experiment.
        ///
        /// let experiment = new exp.DefaultExperiment();
        /// experiment.run();
        ///
        exp.DefaultExperiment = class extends util.ExperimentBase {
            constructor(version) {
                super(version);
                //
                // Set up the database
                //
                this._db.experiment_type = 'DefaultVersion';

                this._db.add_new_table("EventsTable");
                this._db.EventsTable.add_new_column("What");

                this._db.add_new_table("ExperimentTable");
                this._db.ExperimentTable.add_new_column("BlockNumber");
                this._db.ExperimentTable.add_new_column("AllTrialsData");

                //
                // Set up the experiment
                // this.add_new_step(new exp.TestStep(this._db));
                // If run locally, do not add these steps.
                // if (window.location.pathname.substring(0,5) !== "/User") {
                this.add_new_step(new exp.ConsentStep(this._db));
                this.add_new_step(new exp.CheckBrowserStep(this._db));
                // this.add_new_step(new exp.PreparationStep(this._db));
                const NUM_INSTR_SLIDES = 9;
                const INSTR_ROOT = "https://psy-ccl.asc.ohio-state.edu/files/instr/acol-1/";
                for (let i = 1; i <= NUM_INSTR_SLIDES; i++) {

                    this.add_new_step(new exp.BriefingStep(this._db, [`<img src=${INSTR_ROOT}Slide${i}.JPG>`], " "));
                }
                // }


                // Add practice block
                // this.add_new_step(new exp.Block(this._db, 0, "ColorCue", new exp.ColorCueTrialDataGenerator(true)));
                this.add_new_step(new exp.Block(this._db, 0, "Standard", new exp.StandardTrialDataGenerator(true, true)));


                const NUM_EXP_BLOCK = 3;
                for (let i = 1; i <= NUM_EXP_BLOCK; i++) {
                    this.add_new_step(new exp.Block(this._db, i, "Standard", new exp.StandardTrialDataGenerator(false, true)));
                }

                this.add_new_step(new exp.SubmitDataStep(this._db));
            }
        }
        window.onload = () => {

            window._acvs_guid = "Cp5i1nx9Px1HRtHT3evgDg";

            exp.HtmlGui.show_header("Online REP Experiment - Cognitive Control Lab");
            const experiment = new exp.DefaultExperiment("");
            experiment.run();

        } 
    </script>

</body>

</html>