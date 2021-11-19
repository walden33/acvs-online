<!DOCTYPE html>
<html>
<head>
  <title>ACVS - Cognitive Control Lab</title>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

  <!--JAVASCRIPT_INCLUDES_BEGIN-->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
    <script src="https://d3js.org/d3.v4.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/bowser/1.9.4/bowser.min.js"></script>
  <!--JAVASCRIPT_INCLUDES_END-->

  <!--CSS_INCLUDES_BEGIN-->
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Open+Sans">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Fira+Mono:400,500,700|Open+Sans:400,400i,700,700i">
  <!--CSS_INCLUDES_END-->

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
  margin: 20px 0;
  border-bottom: 1px solid white;    /* a divider */
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
  transition: 1s; /* for the darken and brighten transition */
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
.ace_open_tab_button{
  background-color: rgba(240,240,240,1.0);
  border-style: outset;
  border-color: rgba(230,230,230,1.0);
  border-radius: 5px;
  color: rgba(0,0,0,1.0);
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
  position: fixed; /* Sit on top of the page content */
  display: none; /* Hidden by default */
  width: 100%; /* Full width (cover the whole page) */
  height: 100%; /* Full height (cover the whole page) */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.88); /* Black background with opacity */
  z-index: 2; /* Specify a stack order in case you're using a different order for other elements */
  cursor: pointer; /* Add a pointer on hover */
}

#overlay-text {
  position: absolute;
  top: 50%;
  left: 50%;
  font-size: 28px;
  color: white;
  transform: translate(-50%,-50%);
  -ms-transform: translate(-50%,-50%);
}

.acvs-digit {
  font-family: Arial, Helvetica, sans-serif;
  font-weight: 400;
  fill: white;
  text-anchor: middle;
  /* alignment-baseline: central; */ /* Warning: Check browser compatibility. WL 8/22/2020 */
}

/* .acvs-feedback {
  font-family: Arial, Helvetica, sans-serif;
  font-style: italic;
  font-size: 2pt;
  fill: white;
  text-anchor: middle;
} */

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

.btn-wide:hover, .btn-regular:hover {
  transition-duration: 250ms;
  background-color: black;
  color: white;
}

.debriefing-title {
  margin: 20px auto;
  font-size: 1.5em;
  text-transform: uppercase;
  color: yellow;
}

.debriefing-msg {
  margin: auto;
  width: 60%;
  font-size: 1.2em;
  font-style: italic;
}

@keyframes blinker {
  50% {
    opacity: 0;
  }
}  </style>
</head>


<body>
  <!-- This is where the GUI will be inserted -->
  <div id="gui-container">
    <div id="gui" class="gui-div">
      <div id="workspace" class="ac-workspace"></div>
    </div>
  </div>
  <div id="overlay">
    <div id="overlay-text">To optimize your experience in this experiment, click anywhere to enter full-screen mode.</div>
  </div>
  <div id="hidden-sub-id" style="display: none;"><?php echo $_GET['id'] ?></div>
  <div id="hidden-test" style="display: none;"><?php echo $_GET['test'] ?></div>
  <div id="hidden-alt" style="display: none;"><?php echo $_GET['alt'] ?></div>
  <div id="cb-id" style="display: none;"><?php echo $_GET['CB_ID'] ?></div>
  <div id="prolific-id" style="display: none;"><?php echo $_GET['PROLIFIC_PID'] ?></div>
  <div id="study-id" style="display: none;"><?php echo $_GET['STUDY_ID'] ?></div>
  <div id="session-id" style="display: none;"><?php echo $_GET['SESSION_ID'] ?></div>


  <script>
let acvs_version = {};
// Define an objection which will act as a namespace.
'use strict'
const util = {};
/**
 * A class of static utilities methods.
 */
util.Util = class Util {

    static sum(arr) {
        if (arr.length == 0) { return 0; } // edge case
        let result = 0.0;
        arr.forEach(function (item) {
            result += item;
        });
        return result;
    }

    static mean(arr) {
        if (arr.length == 0) { throw RangeError("Can not calculate mean of empty array."); }
        let result = Util.sum(arr) / arr.length;
        return result;
    }

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

    static std_error_of_the_mean(arr) {
        if (arr.length == 0) { throw RangeError("Can not calculate standard error of the mean of empty array."); }
        let result = Util.stdev(arr) / Math.sqrt(arr.length);
        return result;
    }

    static gen_random_int(min, max, inclusive = false) {
        if (inclusive == false) {
            return Math.floor(Math.random() * (max - min)) + min;
        } else {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
    }

    static gen_random_float(min, max, inclusive = false) {
        if (inclusive == false) {
            return Math.random() * (max - min) + min;
        } else {
            return Math.random() * (max - min + 1) + min;
        }
    }

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

    /**
     * Takes in an integer and split it into random integers that sum up as the
     * original integer.
     * 
     * TODO: an issue with min greater than 1
     * 
     * @param {number} int the integer to be splited
     * @param {number} n how many integers to split to
     * @param {number} min minimum of each resulting integer
     */
    static split_int(int, n, min=1) {
        let result = [];
        if (n === 1) {
            if (int >= min) {
                result.push(int);
            }
        } else {
            let rand = Util.gen_random_int(min, int-n+1, true);
            result = Util.split_int(int-rand, n-1, min);
            result.push(rand);
        }
        return result;
    }

    /**
     * Returns the dot product of two matrices.
     * 
     * @param {Array<*>} m1 
     * @param {Array<*>} m2 
     */
    static dot_product(m1, m2) {
        return m1.map((__, i) => m1[i] * m2[i]).reduce((m, n) => m + n);
    }

    /**
     * 
     * @param {number} length : the length of the random string, must be 2 - 8
     */
    static random_string(length) {
        return Math.random().toString(36).slice(-length);
    }

    static window_is_iframe() {
        try {
            return window.self !== window.top;
        } catch (err) {
            return true;
        }
    }


    static play_beep_sound() {
        const beep = new Audio("data:audio/mpeg;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU1LjEyLjEwMAAAAAAAAAAAAAAA//uQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAAcAAAAIAAAOsAA4ODg4ODg4ODg4ODhVVVVVVVVVVVVVVVVxcXFxcXFxcXFxcXFxjo6Ojo6Ojo6Ojo6OqqqqqqqqqqqqqqqqqsfHx8fHx8fHx8fHx+Pj4+Pj4+Pj4+Pj4+P///////////////9MYXZmNTUuMTIuMTAwAAAAAAAAAAAkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uQRAAAAn4Tv4UlIABEwirzpKQADP4RahmJAAGltC3DIxAAFDiMVk6QoFERQGCTCMA4AwLOADAtYEAMBhy4rBAwIwDhtoKAgwoxw/DEQOB8u8McQO/1Agr/5SCDv////xAGBOHz4IHAfBwEAQicEAQBAEAAACqG6IAQBAEAwSIEaNHOiAUCgkJ0aOc/a6MUCgEAQDBJAuCAIQ/5cEAQOCcHAx1g+D9YPyjvKHP/E7//5QEP/+oEwf50FLgApF37Dtz3P3m1lX6yGruoixd2POMuGLxAw8AIonkGyqamRBNxHfz+XRzy1rMP1JHVDJocoFL/TTKBUe2ShqdPf+YGleouMo9zk////+r33///+pZgfb/8a5U/////9Sf////KYMp0GWFNICTXh3idEiGwVhUEjLrJkSkJ9JcGvMy4Fzg2i7UOZrE7tiDDeiZEaRTUYEfrGTUtFAeEuZk/7FC84ZrS8klnutKezTqdbqPe6Dqb3Oa//X6v///qSJJ//yybf/yPQ/nf///+VSZIqROCBrFtJgH2YMHSguW4yRxpcpql//uSZAuAAwI+Xn9iIARbC9v/57QAi/l7b8w1rdF3r239iLW6ayj8ou6uPlwdQyxrUkTzmQkROoskl/SWBWDYC1wAsGxFnWiigus1Jj/0kjgssSU1b/qNhHa2zMoot9NP/+bPzpf8p+h3f//0B4KqqclYxTrTUZ3zbNIfbxuNJtULcX62xPi3HUzD1JU8eziFTh4Rb/WYiegGIF+CeiYkqat+4UAIWat/6h/Lf/qSHs3Olz+s9//dtEZx6JLV6jFv/7//////+xeFoqoJYEE6mhA6ygs11CpXJhA8rSSQbSlMdVU6QHKSR0ewsQ3hy6jawJa7f+oApSwfBIr/1AxAQf/8nBuict8y+dE2P8ikz+Vof/0H4+k6tf0f/6v6k/////8qKjv/1BIam6gCYQjpRBQav4OKosXVrPwmU6KZNlen6a6MB5cJshhL5xsjwZrt/UdFMJkPsOkO0Qp57smlUHeDBT/+swC8hDfv8xLW50u/1r//s3Ol/V9v///S/////yYSf/8YN5mYE2RGrWXGAQDKHMZIOYWE0kNTx5qkxvtMjP/7kmQOAAMFXl5582t2YYvrnz5qbowhfX/sQa3xf6+u/Pi1uiPOmcKJXrOF5EuhYkF1Bbb/3EAiuOWJocX9kycBtMDLId5o7P+pMDYRv1/mDdaP8ul39X1X5IDHrt1o///9S/////85KVVbuCOQNeMpICJ81DqHDGVCurLAa/0EKVUsmzQniQzJVY+w7Nav+kDexOCEgN7iPiImyBmYImrmgCQAcVltnZv2IQsAXL9vqLPlSb+Qk3/6K3MFb+v//b+n////+UJW//Sc1mSKuyRZwAEkXLIQJXLBl6otp8KPhiYHYh+mEAoE+gTBfJgeNItsdG6GYPP/1FkQFHsP3IOPLtavWEOGMf/WThMwEWCpNm6y/+Y+s//OH/1/u/OGX////6v////+bCSoHMzMgsoTebSaIjVR6lKPpG7rCYWmN+jRhtGuXiHi57E0XETEM7EAUl/9IdINsg8wIAAQBmS8ipal6wx8BnH//UYhNzT9L8lH51v6m//u3IhI1r9aP///V/////0iQ//pC87YAWAKKWAQA67PwQ2iCdsikVY4Ya//+5JkC4ADTmzX+01rcFLry/8+DW/OgbNV7NINwQ6e7nTWtXLHHhydAAxwZFU1lQttM3pgMwP6lqdB/rIgABAaxBRnKSLo/cB2hFDz/9MxDiD2l6yh9RTflZKf1Jfr/RfkQYWtL6P///V/////w/icFn///7lAwJp2IBpQ4NESCKe1duJchO8QoLN+zCtDqky4WiQ5rhbUb9av+oQljfDBZdPstVJJFIMSgXUXu39EFGQG//JZus//OG/6X6Lc4l/////t/////Kx4LWYoAQABgwQAGWtOU1f5K1pzNGDvYsecfuce4LdBe8iBuZmBmVdZJVAmuCk8tt/qOi8Ax4QjgywDYEMM0dkkUkqQ1gGCpaf/nTgoQH36vpkMflE7/KRj+k/0n5DiDPS+3///qf////7JizRCya////WaGLygCl0lqppwAH1n/pGM6MCPFK7JP2qJpsz/9EfgHUN4bYUo8kVfxZDd/9ZqXSi31/WXW51D+ZG37/pNycMDbnf///+JaiWbxwJAADEAgAWBoRJquMpaxJQFeTcU+X7VxL3MGIJe//uSZBAABBVs0ftaa3BCS+udTaVvjLV5W+w1rdk5r6x89rW+Bx4xGI3LIG/dK42coANwBynnsZ4f//+t3GfrnRJKgCTLdi1m1ZprMZymUETN4tj3+//9FQEMDmX9L5qVmlaiKVfx3FJ/mH5dfphw6b////60P////qWkMQEfIZq////sMESP4H4fCE0SSBAnknkX+pZzSS2dv1KPN/6hdAJUhIjzKL1L2sDqST/+gwF//ir8REf5h35f2bmDz3//////////jAGKcREwKMQI+VWsj7qNCFp0Zk9ibgh82rKj/JEIFmShuSZMMxk6Jew7BLOh/6wWk1EaAK4nJszopGpdUYh9EYN2/0zQYYnhvJt1j1+pPzpr/TKHXs3z6WdE1N0pm/o///9f/////MpkiIiBeCALJpkgpbKFme7rvPs1/vwM0yWmeNn75xH/+BkEIWITktZ+ijXEi//nC8XQ8v9D5wez86Xv6SL/Lv5ePcrIOl////1/////84bPG1/BwAHSMrAmlSw9S3OfrGMy51bTgmVmHAFtAmCmRg2s1LzmAP/7kmQSgAM9Xs5rM2twXG2Z70IKbg09fT2nva3xgq/mtRe1ui8AFVGaC/9EawNnhihesNgE5E6kir3GVFlof+tEQEpf/rMH50lv5WPH6k2+XX4JUKRpn9Xq//+7f////x3CyAX/4LIzvDgdgAEbFbAc0rGqTO2p1zoKA22l8tFMiuo2RRBOMzZv+mUA2MiAyglI3b9ZwZ0G7jqlt/OcDIKX+/1NblSX+VKfQfP8xuJJGk7////rf////+PgXTv///1JThJJQainmySAB6imUyuVbVttUo7T4Csa821OuF88f62+CZHFnGf///mQgYIEO0SMF2NVy9NxYTdlqJ8AuS4zr//SJoTUJ+CaKKTcZvosrUPo8W/MUv0f033E9E/QpN6P///v/////WRR2mwUAYUABjabRu1vrOLKAF0kIdHjnEx/iNWo7jGn1////mApxNTJQQOU1Het/NoUFTMQs6Vja///THaGIl/0fojl8mjd/Jo8W+ZfpNpCajsz7////6kn/////WRRgDz//LD1KSTDjKOciSAKxdLx5S31uYqKIWj/+5JECgAC8V5M6g9rdFyr6Vo9rW6KtHcr5DEJQRkSpLRklSigvVc4QpmyPe9H3zHR1/in9P/8VNCMJOzYUDyVjfwHP0ZgiZt/3/+9EBnDKbegdUrckhgntHaQ9vX/X/9A/////+r/////mJ3/9ItRcoVRogAcmV9N8z0pvES8QQsKoMGXEymPQyWm6E4HQLqgpv/CZJAtYXQSwoF8e6SB56zABEoW+qgZjJAZovGr0Gl5/OjFKL3JwnaX9v7/X8y1f/////////49WAzMzEYYMZLq6CUANIqbDX7lisBIdraAEPwShTRc9WZ2vAqBc4NQ9GrUNaw0Czcrte0g1NEoiU8NFjx4NFh54FSwlOlgaCp0S3hqo8SLOh3/63f7P/KgKJxxhgGSnAFMCnIogwU5JoqBIDAuBIiNLETyFmiImtYiDTSlb8ziIFYSFv/QPC38zyxEOuPeVGHQ77r/1u/+kq49//6g4gjoVQSUMYQUSAP8PwRcZIyh2kCI2OwkZICZmaZxgnsNY8DmSCWX0idhtz3VTJSqErTSB//1X7TTTVVV//uSZB2P8xwRJ4HvYcItQlWBACM4AAABpAAAACAAADSAAAAEVf/+qCE000VVVVU0002//+qqqqummmmr///qqqppppoqqqqppppoqqATkEjIyIxBlBA5KwUEDBBwkFhYWFhUVFfiqhYWFhcVFRUVFv/Ff/xUVFRYWFpMQU1FMy45OS41qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqg==");
        beep.play();
    }

    static play_mario_sound() {
        const snd = new Audio("https://exp.leberatory.org/files/sounds/Mario-coin-sound.mp3");
        snd.play();
    }


    static today() {
        let today = new Date();
        let dd = String(today.getDate()).padStart(2, '0');
        let mm = String(today.getMonth() + 1).padStart(2, '0');
        let yyyy = String(today.getFullYear());
        return yyyy + '-' + mm + '-' + dd;
    }


    // https://www.w3schools.com/js/js_cookies.asp
    static set_cookie(key, value, expires_in_N_days) {
        let d = new Date();
        d.setTime(d.getTime() + (expires_in_N_days * 24 * 60 * 60 * 1000));
        let expires = "expires=" + d.toGMTString();
        document.cookie = btoa(key) + "=" + value + ";" + expires + ";path=/";
    }

    // https://www.w3schools.com/js/js_cookies.asp
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
        if (!replace) array.splice(index, 1);
        return result;
    }

    static is_test_mode() {
        return document.getElementById("hidden-test").innerText === "true";
    }

    static get_sub_id() {
        return document.getElementById("hidden-sub-id").innerText;
    }

    static is_alt_server_mode() {
        return document.getElementById("hidden-alt").innerText === "true";
    }

    /**
     * Return <div> id "prolific-id" html generated by php $GET from URL
     * parameter. Removed d3 method.
     */
    static get_prolific_id() {
        return document.getElementById("prolific-id").innerText;
    }

    static get_study_id() {
        return document.getElementById("study-id").innerText;
    }

    static get_session_id() {
        return document.getElementById("session-id").innerText;
    }

    static get_cb_id() {
        return document.getElementById("cb-id").innerText;
    }

    /**
     * Generate a randomized array of objects chosen from a given array of
     * unique items, with a maximum number of repititions of the same item
     * allowed. The returned array will contain an equal number of each unique
     * item from the input items array.
     * 
     * @param {Array<*>} items : an array of unique objects
     * @param {number} length : expected output array length
     * @param {number} max_rep : maximum number of repeats of a single object
     */
    static generate_random_array(items, length, max_rep=0) {
        if (length % items.length !== 0) {
            throw RangeError("Output array length has to be a multiple of number of items")
        }
        const reps = length / items.length;
        let result = [];
        for (let i = 0; i < items.length; i++) {
            for (let j = 0; j < reps; j++) {
                result.push(items[i]);
            }
        }
        Util.fisher_yates_shuffle(result);
        if ( max_rep===0) return result;

        // Check if there are more than MAXREP reps in a run
        let previous = result[0];
        // rep: current run rep accumulator
        // maxRep: max and min rep numbers recorded so far
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
        if (max_rep !== 0) {
            if (maxRep > max_rep) {
                return Util.generate_random_array(items, length, max_rep);
            } else return result;
        }

    }

    static zeros(n) {
        let result = new Array(n);
        for (let i = 0; i < result.length; i++) {
            result[i] = 0;
        }
        return result;
    }

    static range(n) {
        let result = new Array(n);
        for (let i = 0; i < result.length; i++) {
            result[i] = i;
        }
        return result;
    }


    /**
     * Create a multi-dimensional array with a specific size and initial value.
     * 
     * @param {Array<number>} size : size of each dimension
     * @param {number} init : initial values of the whole ndarray
     */
    static ndarray(size, init) {
        let result = new Array(size[0]);
        if(size.length === 1) {
            for(let i = 0; i < size[0]; i++) {
                result[i] = init;
            }
        } else {
            let subsize = size.splice(1);   // size of the next dimension
            for(let i = 0; i < result.length; i++) {
                let arr = Util.ndarray(subsize, init);
                result[i] = arr;
            }
        }
        return result;
    }

    /**
     * Removes element(s) from an array
     * 
     * @param {Array<*>} arr the array
     * @param {*} args element(s) to remove
     */
    static remove_element_from_array(arr, ...args) {
        args.forEach( (e) => {
            const index = arr.indexOf(e);
            if (index > -1) {
                arr.splice(index, 1);
            }
        } );
    }

    /**
     * Courtesy of https://stackoverflow.com/questions/8860188/javascript-clear-all-timeouts
     */
    static clear_timeouts() {

        let id = window.setTimeout(function() {}, 0);

        while (id--) {
            window.clearTimeout(id);
        }
    }

    static redirect(url, timeout=0) {
        if(timeout > 0) {
            setTimeout(()=>{
                window.location.replace(url);
            }, timeout);
        } else {
            window.location.replace(url);
        }
    }

}
///////////////////////////////////////////////////////////////////////////////
///
/// Simple implementation of a "Signals and Slots" callback system.
///
util.Signal = class {
  constructor () {
    this._connected_slots = [];
  }

  /////////////////////////////////////////////////////////////////////////////
  ///
  /// Use to connect a callback to this signal.
  ///
  connect (new_slot) {
    this._connected_slots.push(new_slot);
  }

  /////////////////////////////////////////////////////////////////////////////
  ///
  /// Use to call all callbacks connected to this signal.
  ///
  emit () {
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
  constructor ( on_keypress_callback, key_filter_on=true ) {
    this._key_filter_on = key_filter_on; /// enable or disable this KeyFilter.
    this._callback = on_keypress_callback;  /// This method is called whenever a key is pressed if the logger is on.
    this.bound_callback = this._catch_keypress.bind(this);
    window.addEventListener('keypress', this.bound_callback);  /// adds a listener for key presses.
  }

  /////////////////////////////////////////////////////////////////////////////
  ///
  /// Turn this filter ON.
  ///
  turn_on () {
    this._key_filter_on = true;
  }

  /////////////////////////////////////////////////////////////////////////////
  ///
  /// Turn this filter OFF.
  ///
  turn_off () {
    this._key_filter_on = false;
  }

  /////////////////////////////////////////////////////////////////////////////
  ///
  /// Private method to be triggered from the EventListener. It will call the
  /// callback on a keypress event if the KeyFiler is on.  This function
  /// forwards the key identity (i.e. "a" "b" "c") to the callback as an
  /// argument.
  ///
  _catch_keypress (key_num) {
    if (this._key_filter_on == true){
      this._callback(key_num.key);
    }
  }

  /////////////////////////////////////////////////////////////////////////////
  ///
  /// This method cleans up the class when the client is done with it.
  ///
  destroy () {
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
  static _hex (buffer) {
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
  static sha256 (str) {
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
  constructor (version) {
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
  add_new_step (new_step) {
    if ( !(new_step instanceof util.AbstractStep) ) {
      throw "Error: argument must be derived from AbstractStep"
    }
    if (this._steps_finalized == true) {
      throw "Error: Cannot append a new step after the experiemnt has started";
    }
    new_step.step_completed_signal.connect( this._execute_next_step.bind(this) );
    this._steps.push(new_step);
  }

  /////////////////////////////////////////////////////////////////////////////
  ///
  /// Starts the Experiment
  ///
  run () {
    this._stepsFinalized = true;
    this._execute_next_step();
  }

  /////////////////////////////////////////////////////////////////////////////
  ///
  /// Executes the next step in the experiment each time it is called. Does
  /// nothing if there are no more steps.
  ///
  _execute_next_step () {
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
  constructor () {
    // all derived classes should emit() this Signal at the end of their
    // overridden execute() method.
    this.step_completed_signal = new util.Signal();
  }

  /////////////////////////////////////////////////////////////////////////////
  ///
  /// The main routine called to start this step.
  ///
  execute()  {
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
  constructor () {
    // timestamp for when this object was created
    this._database_created_at = performance.now();
    // an array containing the names of the tables in this db
    this._array_of_table_names = [];
  }

  /////////////////////////////////////////////////////////////////////////////
  ///
  /// Add a new table to this db.
  ///
  add_new_table (table_name) {
    // record the new table's name
    this._array_of_table_names.push(table_name);
    // create the new table
    this[table_name] = new util.Table(this._database_created_at);
  }

  /////////////////////////////////////////////////////////////////////////////
  ///
  /// Call this method after all tables have been added to lock the structure
  /// of the db.
  ///
  finalize () {
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
  constructor (absolute_timestamp) {
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
  number_of_rows () {
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
  add_new_column (column_name) {
    // record the column name
    this._array_of_column_names.push(column_name);
    // create an empty array to represent the column
    this[column_name] = [];
  }

  /////////////////////////////////////////////////////////////////////////////
  ///
  /// Append a new row/record to this table.
  ///
  add_new_row () {
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
  get_row (row_index) {
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
  finalize () {
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
        Workspace.clear_header();
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
        Workspace.workspace().selectAll("p").data(html)
            .enter().append("p")
            .style("font-size", String(font_size) + "em")
            .html(function (d) { return d; });
    }


    static append_line(html, font_size=1.5, color="white", life=0) {
        const id = "s_" + util.Util.random_string(8);
        Workspace.workspace().append("div")
            .attr("id", id)
            .style("font-size", String(font_size) + "em")
            .style("color", color)
            .html(html);
        if (life > 0) {
            setTimeout(() => {
                Workspace.workspace().select("#" + id).remove();
            }, life);
        }
    }


    /**
     * @deprecated
     * 
     * This method appends given HTML code to the existing HTML in workspace.
     * Problems were identified when using this method; it would remove existing
     * event listeners on elements like <button> in orginal HTML code.
     * 
     * @param {string} html : HTML code to append
     * 
     */
    static append_html(html) {
        document.getElementById("workspace").innerHTML =
            document.getElementById("workspace").innerHTML + html;
    }


    static append_image(img) {
        img = [img.src];
        Workspace.workspace().selectAll("img").data(img)
            .enter().append("img")
            .attr('src', function (d) { return d; })
            .attr('class', "ace_centered_div_content");
    }


    static append_button(buttonText, onClickCallback) {
        let button = Workspace.workspace().selectAll("button").data([buttonText])
            .enter().append("button");
        button.text(function (d) { return d; });
        button.attr("id", function (d) { return d + "_button"; });
        button.on("click", onClickCallback);
    }

    static show_message(text, color = "white") {
        // clear any existing header
        Workspace.clear_message();
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
}
/**
 * A name space for disp
 * 
 * @package acvs-online
 * @version 1.1
 * @author Walden Li
 */
const disp = {};
/**
 * A class that contains parameters for the settings of the display.
 * Previously named <disp.Display>
 */
disp.DisplaySetting = class {
    constructor() {
        // screen center coordinates
        this.screen_center_x = 50;
        this.screen_center_y = 50;
        // Minimum distance between two targets
        this.min_targ_dist = 30;
        // ACVS rings
        this.ring_radius = 45;
        this.square_size = 4;
        // digits
        this.digit_size = this.square_size * 0.65;
        this.digit_color = "white";
        this.digit_font = "Arial, Helvetica, sans-serif",
        this.digit_class_name = "acvs-digit";
        // for non-Chrome browsers, text location needs to be adjusted in order to center on squares
        this.digit_shift_x = 0;
        this.digit_shift_y = this.digit_size * 0.35;
        // fixation cross (as text "+")
        this.fixation_cross_class_name = "fixation-cross-center";
        this.fixation_cross_size = this.digit_size;
        this.ring_square_numbers = [12, 18, 24];
        this.subring_radius_proportion = [0.5, 0.75, 1];
        this.square_color = "rgb(128, 128, 128)";
        // Specific to spatial cue paradigm
        this.cue_radius = this.square_size / 1.5;
        this.cue_stroke_color = "white";
        this.cue_stroke_width = 0.2;
        // Specific to spatial letter cue and temporal paradigm
        this.letter_cue_color = "white";
        // this.letter_cue_font_size = this.digit_size;
    }
}/**
 * A collection of classes that encapsulate shapes that can be added to a
 * <DisplayDataset>.
 * 
 * @author Walden Y. Li
 * @version 1.5 (07/04/2021)
 * 
 * @update 1.5 (07/04/21) Added support for polygons.
 * @update 1.4 (01/31/21) Added class, id to most shape objects
 */

/**
 * A class that represents an ACVS square. All the information, including its x
 * and y coordinates, side length (here denoted by w and h), color, digit on it,
 * whether it is a target square, whether it is an optimal target, etc.
 */
disp.Rect = class {
    /**
     * 
     * @param {string} x 
     * @param {string} y 
     * @param {string} w 
     * @param {string} h 
     * @param {string} fill : the color of the <rect>
     * @param {string} className : class for the <rect> object
     * @param {string} id : id for the <rect> object
     * @param {string} transform
     */
    constructor(x, y, w, h, fill, className = undefined, id = undefined,
        transform = undefined) {
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        this.fill = fill;
        this.className = className;
        this.id = id;
        this.transform = transform;
    }
}


disp.Circle = class {
    /**
     * 
     * @param {string} cx : center x
     * @param {string} cy : center y
     * @param {string} r : radius
     * @param {string} fill : color
     * @param {string} stroke : stroke color
     * @param {string} strokeWidth : <svg> <circle> attr "stroke-width"
     * @param {string} className : class for the <circle> object
     * @param {string} id : id for the <circle> object
     * @param {string} transform
     */
    constructor(cx, cy, r, fill, stroke, strokeWidth, className = undefined,
        id = undefined, transform = undefined) {
        this.cx = cx;
        this.cy = cy;
        this.r = r;
        this.fill = fill;
        this.stroke = stroke;
        this.strokeWidth = strokeWidth;
        this.className = className;
        this.id = id;
        this.transform = transform;
    }
}


disp.Line = class {
    /**
     * 
     * @param {string} x1 
     * @param {string} y1 
     * @param {string} x2 
     * @param {string} y2 
     * @param {string} stroke 
     * @param {string} strokeWidth : <svg> <line> attr "stroke-width" 
     * @param {string} className : class for the <line> object
     * @param {string} id : id for the <line> object
     * @param {string} transform
     */
    constructor(x1, y1, x2, y2, stroke, strokeWidth, className = undefined,
        id = undefined, transform = undefined) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.stroke = stroke;
        this.strokeWidth = strokeWidth;
        this.className = className;
        this.id = id;
        this.transform = transform;
    }
}


disp.Text = class {
    /**
     * 
     * @param {string} text 
     * @param {string} x 
     * @param {string} y 
     * @param {string} fill 
     * @param {string} fontSize : <svg> -> <text> attr "font-size"
     * @param {string} fontFamily : <svg> -> <text> attr "font-family"
     * @param {string} className : class for the <text> object
     * @param {string} id : id for the <text> object
     * @param {string} transform
     */
    constructor(text, x, y, fill, fontSize, fontFamily = undefined,
        className = undefined, id = undefined, transform = undefined) {
        this.text = text;
        this.x = x;
        this.y = y;
        this.fill = fill;
        this.fontSize = fontSize;
        this.fontFamily = fontFamily;
        this.className = className;
        this.id = id;
        this.transform = transform;
    }
}

disp.Polygon = class {
    /**
     * @param {string} points
     * @param {string} fill
     * @param {string} className
     * @param {string} id
     * @param {string} transform
     */
    constructor(points, fill, className = undefined, id = undefined,
        transform = undefined) {
        this.points = points
        this.fill = fill;
        this.className = className;
        this.id = id;
        this.transform = transform;
    }
}
/**
 * A class that encapsulates all the elements that will be used by d3 to draw on
 * the display.
 * 
 * @package acvs-online
 * @version 1.6 (07/04/2021)
 * @author Walden Li
 * 
 * @update 1.6 (07/04/21) included polygons; updated duplicate()
 * @update 1.5 added a duplicate() method and removed the logic object
 * @update 1.4 added a setter method to logic
 * @update 1.3 added a "logic" object to the constructor
 * @update 1.2 fixed bugs in methods for adding arrays
 */
disp.DisplayDataset = class {

    constructor( lines=[], texts=[], rects=[], circles=[], polygons=[] ) {
        this.lines = lines;
        this.texts = texts;
        this.rects = rects;
        this.circles = circles;
        this.polygons = polygons;
    }

    // Setter methods.
    set_lines(lines) { this.lines = lines }

    set_texts(texts) { this.texts = texts }

    set_rects(rects) { this.rects = rects }

    set_circles(circles) { this.circles = circles }

    set_polygons(polygons) { this.polygons = polygons }

    // Methods for adding an array of objects to the display.
    add_lines(lines) { this.lines = this.lines.concat(lines) }

    add_texts(texts) { this.texts = this.texts.concat(texts) }

    add_rects(rects) { this.rects = this.rects.concat(rects) }

    add_circles(circles) { this.circles = this.circles.concat(circles) }

    add_polygons(polygons) { this.polygons = this.polygons.concat(polygons) }

    // Methods for adding one object to the display.
    add_a_line(line) { this.lines.push(line) }

    add_a_text(text) { this.texts.push(text) }

    add_a_rect(rect) { this.rects.push(rect) }

    add_a_circle(circle) { this.circles.push(circle) }

    add_a_polygon(polygon) { this.polygons.push(polygon) }

    duplicate() {
        return new disp.DisplayDataset(
            JSON.parse(JSON.stringify(this.lines)),
            JSON.parse(JSON.stringify(this.texts)),
            JSON.parse(JSON.stringify(this.rects)),
            JSON.parse(JSON.stringify(this.circles)),
            JSON.parse(JSON.stringify(this.polygons))
        );
    }

    /**
     * Merge the current <DisplayDataset> with another one.
     * 
     * @param {disp.DisplayDataset} dispDataset : the <DisplayDataset> to be merged in
     * @param {boolean} remove : if dispDataset should be deleted after being merged in
     */
    merge( dispDataset, remove = true ) {
        this.add_lines( dispDataset.lines );
        this.add_texts( dispDataset.texts );
        this.add_rects( dispDataset.rects );
        this.add_circles( dispDataset.circles );
        this.add_polygons( dispDataset.polygons );
        if (remove) { dispDataset = null }
    }

}
/**
 * DisplayWidget is a class that encapsulates the logic for the visual display.
 * It is instantiated once in a <Trail>.
 * Previously, this module was responsible for not only the graphics but also
 * some ad-hoc data calculation. In the new version, <DisplayWidget> only
 * handles the graphic display.
 * Depending on the version of the ACVS experiment, <DisplayWidget> takes in a
 * <DisplayDataset> that contains a number of <disp.Square>, <disp.Digit>,
 * <disp.Circle>, <disp.Line>, etc. for d3 to draw on the screen.
 * 
 * @package acvs-online
 * @version 1.7 (07/04/2021)
 * @author Walden Y. Li
 * 
 * @update 1.7 (07/04/21) Added polygon rendering
 * @update 1.6 (06/02/21) Added "transform" property for all shapes
 * @update 1.5 Added run_rsvp() method.
 */
disp.DisplayWidget = class {
    constructor(parent, size="0 0 100 100", width="90vmin") {
        this.parent = parent;   // the parent HTML element for the widget
        this.cue;
        this.stimuli;
        // Create the svg container element and selection
        this.svg_container = this.parent.selectAll("div").data([0]).enter().append("div")
            .attr("class", "svg_container")
            .style("width", width);
        // Create the svg element and selection
        this.svg = this.svg_container.selectAll("svg").data([0]).enter().append("svg")
            .attr("viewBox", size)
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("class", "ace_svg_content_responsive");
        // TODO: a previously included event listener
        // window.addEventListener("resize", this.show.bind(this));  // redraw the graphic if the window resizes.
    }

    set_cue( cue ) {
        this.cue = cue;
    }

    set_stimuli( stimuli ) {
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
        this.parent.selectAll("polygon").remove();
    }

    /**
     * This method clears the display and adds a string as a <text> element at
     * the display center.
     * 
     * @param {string} text
     * @param {string} x x coordinate for the text
     * @param {string} y y coordinate for the text
     * @param {string} size font size
     */
    show_feedback( text, x = "50", y = "50", size = "2pt" ) {
        this.clear();
        this.svg.append("text")
            .text(text)
            .attr("x", x)
            .attr("y", y)
            .style("font-family", "Arial, Helvetica, sans-serif")
            .style("font-style", "italic")
            .style("font-size", size)
            .style("fill", "white")
            .style("text-anchor", "middle");
    }

    /**
     * The core method for the widget. It takes in a <DisplayDataset> where
     * shapes are encapsulated in customized classes, and uses d3.js to create
     * the corresponding svg elements under the parent element.
     * 
     * @param {disp.DisplayDataset} dataset
     */
    draw( dataset ) {

        // Clear the display
        this.clear();

        // Draw rects
        const rects = this.svg.selectAll("rect").data(dataset.rects);
        rects.enter().append("rect")
            .attr("x", d => d.x )
            .attr("y", d => d.y )
            .attr("width", d => d.width )
            .attr("height", d => d.height )
            .attr("fill", d => d.fill )
            .attr("class", d => d.className)
            .attr("id", d => d.id)
            .attr("transform", d => d.transform);
        rects.exit().remove();

        // Draw circles
        const circles = this.svg.selectAll("circle").data(dataset.circles);
        circles.enter().append("circle")
            .attr("cx", d => d.cx )
            .attr("cy", d => d.cy )
            .attr("r", d => d.r )
            .attr("fill", d => d.fill )
            .attr("stroke", d => d.stroke )
            .attr("stroke-width", d => d.strokeWidth )
            .attr("class", d => d.className)
            .attr("id", d => d.id)
            .attr("transform", d => d.transform);
        circles.exit().remove();

        // Draw lines
        const lines = this.svg.selectAll("line").data(dataset.lines);
        lines.enter().append("line")
            .attr("x1", d => d.x1 )
            .attr("y1", d => d.y1 )
            .attr("x2", d => d.x2 )
            .attr("y2", d => d.y2 )
            .attr("stroke", d => d.stroke )
            .attr("stroke-width", d => d.strokeWidth )
            .attr("class", d => d.className)
            .attr("id", d => d.id)
            .attr("transform", d => d.transform);
        lines.exit().remove();

        // Draw texts
        const texts = this.svg.selectAll("text").data(dataset.texts);
        texts.enter().append("text")
            .text( d => d.text )
            .attr("x", d => d.x )
            .attr("y", d => d.y )
            .attr("fill", d => d.fill )
            .attr("font-size", d => d.fontSize )
            .attr("class", d => d.className )
            .attr("id", d => d.id)
            .attr("transform", d => d.transform)
            .style("font-family", d => d.fontFamily);
        texts.exit().remove();

        // Draw polygons
        const polygons = this.svg.selectAll("polygon").data(dataset.polygons);
        polygons.enter().append("polygon")
            .attr("points", d => d.points)
            .attr("fill", d => d.fill )
            .attr("class", d => d.className )
            .attr("id", d => d.id)
            .attr("transform", d => d.transform)
        polygons.exit().remove();

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
    run_rsvp( cue, stimuli, cue_duration, soa, isi ) {

        setTimeout( ()=>{ this.draw( cue ) }, 0 );

        setTimeout( ()=>{ this.clear()}, cue_duration );

        for( let i = 0; i < stimuli.length; i++ ) {
            setTimeout(()=>{ this.draw( stimuli[i] ) }, isi*i + soa );
        }

    }

    dump(text) {
        this.parent.insert("div", ":first-child").html(text).style("color", "white");
    }

}
/**
 * The kernel for a display generator class that has basic settings and methods
 * for creating abstract trial logic.
 * 
 * Update (10/16/2020): has_preview, num_trials, and num_trials_to_slice were
 *   extracted to this base class constructor.
 * 
 * @author Walden Y. Li
 * @version 1.6
 */
disp.DisplayGenerator = class {

    /**
     * 
     * @param {number} num_trials : The number of trials specified for
     *   generating the block trial conditions.
     * @param {number} num_trials_to_slice : The number of actual trials needed
     *   in this block, if defined.
     * @requires
     *   (num_trials_to_slice <= num_trials && num_trials_to_slice % 3 === 0)
     *   if (num_trials_to_slice !== undefined)
     */
    constructor(num_trials, num_trials_to_slice) {
        this._num_total_trials = num_trials;
        this._num_trials_to_slice = num_trials_to_slice;
        this._target_digits = [2, 3, 4, 5];
        this._distractor_digits = [6, 7, 8, 9];
        this._setting = new disp.DisplaySetting();
        this._block_data = null;
    }

    _get_grid_pos() {
        let result = new Map();
        const r = this._setting.ring_radius;
        const cx = this._setting.screen_center_x;
        const cy = this._setting.screen_center_y;
        const sz = this._setting.square_size;
        const p = this._setting.subring_radius_proportion;
        let i = 1;  // grid number, to be set as the key of the output <Map>
        for (let j = 0; j < 3; j++) {   // three rings, from inner to outer
            let n = this._setting.ring_square_numbers[j];    // get # of squares in this ring
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

    /**
     * Helper function to get the distance between to grid positions
     * @param {Object} grid1 
     * @param {Object} grid2 
     */
    _get_grid_dist(grid1, grid2) {
        return Math.sqrt((grid1.x - grid2.x) * (grid1.x - grid2.x) +
            (grid1.y - grid2.y) * (grid1.y - grid2.y));
    }


    /**
     * Given display grid position info, the optimal target eccentricity, and
     * the non-optimal target eccentricity, return an object with three items:
     * 0. "optTargPos" : the position (indexed between 0 - 53) of the opt targ
     * 1. "nonOptTargPos" : same as above, of the non opt targ
     * 2. "nonTargPool" : an array of randomized grid position indexes without
     *     two targets
     * 
     * @param {Map<number,object>} gridPos 
     * @param {number} optTargEcc 
     * @param {number} nonOptTargEcc 
     */
    _generate_target_pools_by_ecc(gridPos, optTargEcc, nonOptTargEcc,
        nOptTarg = 1, nNonOptTarg = 1) {

        let result = {};

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
        // const optTargPos = util.Util.select_rand_from_array(optTargPool, null, false);
        // const nonOptTargPos = util.Util.select_rand_from_array(nonOptTargPool, null, false);
        // Randomly select target grids (and make sure they are not close to
        // each other)
        if (nOptTarg === 1 && nNonOptTarg === 1) {
            let optTargPos, nonOptTargPos;
            let selected = false;
            while (!selected) {
                optTargPos = util.Util.choose_from(optTargPool);
                nonOptTargPos = util.Util.choose_from(nonOptTargPool, [optTargPos]);
                if (this._get_grid_dist(gridPos.get(optTargPos), gridPos.get(
                    nonOptTargPos)) >= this._setting.min_targ_dist) {
                    selected = true;
                }
            }
            result.optTargPos = optTargPos;
            result.nonOptTargPos = nonOptTargPos;
            // Remove target positions from the pool
            optTargPool.splice(optTargPool.indexOf(optTargPos), 1);
            nonOptTargPool.splice(nonOptTargPool.indexOf(nonOptTargPos), 1);
        } else {
            let optTargPos = [];
            let nonOptTargPos = [];

        }


        // Add the rest to non-target pool
        nonTargPool = nonTargPool.concat(optTargPool).concat(nonOptTargPool);
        // Shuffle the non-target pool
        util.Util.fisher_yates_shuffle(nonTargPool);
        result.nonTargPool = nonTargPool;

        // Return three things with an object
        return result;

    }


    /**
     * 
     * @param {number} num_total_trials 
     * @param {number} min : the minimum number of the digits set (e.g., in most
     *      classic ACVS paradigms this number is 2)
     * @requires num_total_trials % 12 === 0
     */
    _generate_trial_digits(num_total_trials, min=2) {

        let result = [];

        // All possible combinations of target digits
        // Every row is a choice of optimal target digit
        const digit_combs = [
            [[min, min+1], [min, min+2], [min, min+3]],   // opt digit == 2
            [[min+1, min], [min+1, min+2], [min+1, min+3]],   // opt digit == 3
            [[min+2, min], [min+2, min+1], [min+2, min+3]],
            [[min+3, min], [min+3, min+1], [min+3, min+2]]
        ]
        const digitRows = util.Util.generate_random_array([0, 1, 2, 3], num_total_trials, 3);
        const digitColumns = util.Util.generate_random_array([0, 1, 2], num_total_trials, 3);

        for (let i = 0; i < num_total_trials; i++) {
            result.push(digit_combs[digitRows.pop()][digitColumns.pop()]);
        }

        return result;

    }

    _generate_trial_conditions() {
        throw ReferenceError("Abstract method called");
    }

    _make_block_displays() {
        throw ReferenceError("Abstract method called");
    }


    /**
     * Returns the reference to the display settings object
     */
    get_setting() {
        return this._setting;
    }

    /**
     * Returns the next array of <Display> with a trial condition logic array
     * in this block.  When exhausted this method will return null.
     */
    yield_trial_display() {
        if (this._block_data.length > 0) {
            return this._block_data.pop();
        } else {
            return null;
        }
    }


    /**
     * A static version of the method get_grid_pos().
     */
    static get_grid_pos() {
        const setting = new disp.DisplaySetting();
        let result = new Map();
        const r = setting.ring_radius;
        const cx = setting.screen_center_x;
        const cy = setting.screen_center_y;
        const sz = setting.square_size;
        const p = setting.subring_radius_proportion;
        let i = 1;  // grid number, to be set as the key of the output <Map>
        for (let j = 0; j < 3; j++) {   // three rings, from inner to outer
            let n = setting.ring_square_numbers[j];    // get # of squares in this ring
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
 * A generators class that yields a block of Standard ACVS displays. Previously
 * named "StandardTrialDataGenerator" (before 1.4), but updated when I tried
 * to systematically separate display logic from experiment logic.
 * Still the classic paradigm, still out lab's favorite.
 * With preview version available.
 * 
 * @author Walden Y. Li
 * @version 1.7 (updated 1/18/2021)
 * 
 * @update 1.7 Added static generate_one_display() method.
 */
disp.StandardDisplayGenerator = class extends disp.DisplayGenerator {

    constructor(num_trials, num_trials_to_slice=undefined, has_preview=true)
    {
        super(num_trials, num_trials_to_slice);
        if (num_trials % 12 !== 0) {
            throw RangeError( "Number of total block trials must be an " +
            "integer multiple of 12.");
        }
        if (num_trials_to_slice !== undefined && num_trials_to_slice > num_trials) {
            throw RangeError( "Number of sliced trials must not exceed " +
            "number of total trials." );
        }
        this._has_preview = has_preview;
        // Set paradigm-specific settings
        this._colors = [
            "rgb(255, 0, 0)",
            "rgb(0, 0, 255)",
            "rgb(0, 150, 0)"
        ];

        // // Set square colors (1+1+14+12+12+14=54)
        // this._num_green_dist = 14;
        // this._num_red_dist = 12;
        // this._num_blue_dist = 12;
        // this._num_var_dist = 14;    // variable distractor is either red or blue

        // Set square colors (1+1+14+12+12+14=54)
        this._num_green_dist = 14;
        this._num_red_dist = 9;
        this._num_blue_dist = 9;
        this._num_var_dist = 20;    // variable distractor is either red or blue

        // Create block data according to trial conditions
        this._block_data = this._make_block_displays(
            this._generate_trial_conditions());
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
    _make_trial_display(optTargEcc, nonOptTargEcc, optTargDigit,
        nonOptTargDigit, optTargColor, nonOptTargColor) {
        const x = this._setting.screen_center_x;
        const y = this._setting.screen_center_y;
        const sz = this._setting.square_size;

        let fixation = new disp.DisplayDataset();
        let preview = new disp.DisplayDataset();
        let stimuli = new disp.DisplayDataset();

        const gridPos = this._get_grid_pos();

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
            optTargGrid.x + this._setting.digit_shift_x + '',
            optTargGrid.y + this._setting.digit_shift_y + '',
            this._setting.digit_color,
            this._setting.digit_size,
            this._setting.digit_font,
            this._setting.digit_class_name
        ));
        stimuli.add_a_text(new disp.Text(
            nonOptTargDigit + '',
            nonOptTargGrid.x + this._setting.digit_shift_x + '',
            nonOptTargGrid.y + this._setting.digit_shift_y + '',
            this._setting.digit_color,
            this._setting.digit_size,
            this._setting.digit_font,
            this._setting.digit_class_name
        ));

        // 2. Add GREEN distractor rects and digits. They can be of any digit.
        for (let i = 0; i < this._num_green_dist; i++) {

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
                util.Util.select_rand_from_array(this._target_digits.concat(
                    this._distractor_digits)) + '',
                grid.x + this._setting.digit_shift_x + '',
                grid.y + this._setting.digit_shift_y + '',
                this._setting.digit_color,
                this._setting.digit_size,
                this._setting.digit_font,
                this._setting.digit_class_name
            ));
        }

        // 3. Add RED distractor rects and digits. Digits must be 6-9.
        for (let i = 0; i < this._num_red_dist; i++) {

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
                util.Util.select_rand_from_array(this._distractor_digits) + '',
                grid.x + this._setting.digit_shift_x + '',
                grid.y + this._setting.digit_shift_y + '',
                this._setting.digit_color,
                this._setting.digit_size,
                this._setting.digit_font,
                this._setting.digit_class_name
            ));
        }

        // 4. Add BLUE distractor rects and digits. Digits must be 6-9.
        for (let i = 0; i < this._num_blue_dist; i++) {

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
                util.Util.select_rand_from_array(this._distractor_digits) + '',
                grid.x + this._setting.digit_shift_x + '',
                grid.y + this._setting.digit_shift_y + '',
                this._setting.digit_color,
                this._setting.digit_size,
                this._setting.digit_font,
                this._setting.digit_class_name
            ));
        }

        // 5. Add variable distractor rects and digits
        for (let i = 0; i < this._num_var_dist; i++) {

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
                util.Util.select_rand_from_array(this._distractor_digits) + '',
                grid.x + this._setting.digit_shift_x + '',
                grid.y + this._setting.digit_shift_y + '',
                this._setting.digit_color,
                this._setting.digit_size,
                this._setting.digit_font,
                this._setting.digit_class_name
            ));
        }

        // Finally, generate a fixation cross to everything
        const fixation_text = new disp.Text(
            '+', x, y, 'white', 3, null, this._setting.fixation_cross_class_name
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

    _generate_trial_conditions() {

        let result = [];

        // Determine target eccentricity
        let ecc1 = util.Util.generate_random_array([1, 2, 3], this._num_total_trials, 3);
        let ecc2 = util.Util.generate_random_array([1, 2, 3], this._num_total_trials, 3);

        for (let i = 0; i < this._num_total_trials; i++) {
            result.push([ecc1.pop(), ecc2.pop()]);
        }
        
        // Generate digits
        let digits = this._generate_trial_digits(this._num_total_trials);

        // Generate optimal target colors
        let optColors = util.Util.generate_random_array([0,1], this._num_total_trials, 6);
        // Add everything to the output
        for( let i = 0; i < result.length; i++ ) {
            let optColor = optColors.pop();
            let nonOptColor = optColor === 1 ? 0 : 1;
            result[i] = result[i].concat(digits.pop().concat([optColor, nonOptColor]));
        }

        return result;

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

    _make_block_displays(trialConds) {
        let trial_conditions = trialConds.slice();  // make a copy
        let result = [];
        let currentTrialCond;
        while (trial_conditions.length > 0) {
            currentTrialCond = trial_conditions.pop();
            let currentTrialDisplays = this._make_trial_display(...currentTrialCond);
            let currentTrialLogic = this._make_trial_logic(...currentTrialCond);
            result.push(
                {
                    "logic": currentTrialLogic,
                    "cue": currentTrialDisplays.cue,
                    "stimuli": currentTrialDisplays.stimuli
                }
            );
        }
        // If number of block trials is less than 20, this is a practice trial,
        // and because the trial condition array 
        if (this._num_trials_to_slice !== undefined) {
            result = result.slice(0, this._num_trials_to_slice);
        }
        return result;
    }

}
/**
 * <ACMCFDisplayGenerator> is a base class for the Adaptive Choice Foraging (or
 * Adaptive Choice Mouse Click Foraging) Task.
 * 
 * @author Walden Y. Li
 * @version 1.2 (08/27/2021)
 * 
 * @update 1.2 Included makers for diamonds and pentagons
 */
disp.ACFDisplayGenerator = class {

    constructor() {

        // Display settings
        this._screen_x = 100;   // length of the main axis (horizontal)
        this._screen_y = 80;    // length of the cross axis (vertical)
        this._screen_x_border = 0;  // length of blank space on x axis from the left OR right border
        this._screen_y_border = 5;  // length of blank space on y axis from the top OR bottom border
        this._max_x_jitter = 3.5;
        this._max_y_jitter = 3.5 / 1.25;

        // Display general settings
        this._n_items_x = 14;   // number of items on the main axis
        this._n_items_y = 11;    // number of items on the cross axis
        this._n_total_items = this._n_items_x * this._n_items_y;
        this._n_targ_per_color = 20;
        this._n_dist_opt_color = 10;
        this._n_items_opt_color = this._n_targ_per_color + this._n_dist_opt_color;
        this._n_dist_non_opt_color = 74;
        this._n_items_non_opt_color = this._n_targ_per_color + this._n_dist_non_opt_color;
        (function assert_total_item_within_bound() {
            if (this._n_items_opt_color * 2 + this._n_items_non_opt_color >
                this._n_items_x * this._n_items_y) {
                throw Error("Number of items in display exceeds maximum.")
            }
        }).bind(this)();

        /**
         * A 3x3 matrix representing if a particular colored shape is a target.
         * Rows are colors and columns are shapes.
         */
        this._is_targ = util.Util.ndarray([3, 3], 0);

        /** A 3x3 matrix representing the number of each type of object. */
        this._item_count = util.Util.ndarray([3, 3], 0);

        // Stimulus shape settings
        this._shape_0 = "square";
        this._shape_1 = "pentagon";
        this._shape_2 = "diamond";
        this._shapes = [this._shape_0, this._shape_1, this._shape_2];
        this._circle_radius = 1.128379;
        this._square_size = 2;  // length of each *side* of the square
        this._diamond_diagonal_len = 2.828427;
        this._diamond_main_axis_len = this._diamond_diagonal_len;
        this._diamond_cross_axis_len = this._diamond_diagonal_len;
        this._triangle_side_len = 3.039343*0.9;
        this._pentagon_radius = 1.297;
        this._background_rect_size = 3;

        // Stimulus color settings
        // Exact color string to use in <svg> shapes. Could be a generic name
        // or an rgb.
        // this._color_0 = "#FF5733";
        this._color_0 = "rgb(255,55,55)";
        this._color_1 = "rgb(38,125,0)";
        this._color_2 = "rgb(85,85,255)";
        this._colors = [this._color_0, this._color_1, this._color_2];
        // Color aliases.
        this._color_0_alias = "red";
        this._color_1_alias = "green";
        this._color_2_alias = "blue";
        this._color_aliases = [this._color_0_alias, this._color_1_alias, this._color_2_alias];

        //
        this._rand_trial_seq = [
            [2, 2, 2, 0, 0, 0, 0, 0, 1, 1, 1, 2, 2, 2, 2, 1, 1, 1, 1, 0, 0],
            [0, 0, 0, 0, 1, 1, 1, 2, 2, 2, 2, 2, 0, 0, 0, 1, 1, 1, 1, 2, 2],
            [1, 1, 1, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 2, 2, 2, 1, 1, 1, 1, 2],
            [0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 2, 2, 0, 0, 0, 0, 2, 2, 2, 1, 1],
            [0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 0, 0, 0, 2, 2, 2, 2, 0],
            [0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2],
            [1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 0, 0, 0, 0, 0, 2, 2, 2, 2, 0, 0],
            [1, 1, 1, 1, 2, 2, 2, 2, 0, 0, 0, 0, 1, 1, 1, 2, 2, 2, 0, 0, 0],
            [1, 1, 1, 1, 2, 2, 2, 0, 0, 0, 0, 1, 1, 1, 2, 2, 2, 0, 0, 0, 2],
            [0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 0, 0, 0, 2, 2, 2, 2, 1, 1, 1],
            [1, 1, 1, 2, 2, 2, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 0, 0, 0, 0, 2],
            [0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2],
            [1, 1, 1, 1, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 1, 1, 1, 2, 2, 2, 2],
            [0, 0, 0, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 0, 0, 0, 2, 2, 2, 2, 0],
            [1, 1, 1, 0, 0, 0, 2, 2, 2, 2, 1, 1, 1, 2, 2, 2, 0, 0, 0, 0, 1],
            [2, 2, 2, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 2, 2, 2, 2],
            [1, 1, 1, 2, 2, 2, 0, 0, 0, 0, 2, 2, 2, 2, 1, 1, 1, 1, 0, 0, 0],
            [2, 2, 2, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 2, 2, 2, 2, 1],
            [1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 0, 0, 0, 0, 0, 2, 2, 2, 2, 0, 0],
            [2, 2, 2, 2, 1, 1, 1, 0, 0, 0, 1, 1, 1, 2, 2, 2, 0, 0, 0, 0, 1],
            [2, 2, 2, 0, 0, 0, 2, 2, 2, 2, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0],
            [1, 1, 1, 1, 2, 2, 2, 0, 0, 0, 2, 2, 2, 2, 0, 0, 0, 0, 1, 1, 1],
            [0, 0, 0, 2, 2, 2, 1, 1, 1, 0, 0, 0, 0, 2, 2, 2, 2, 1, 1, 1, 1],
            [0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 2, 2, 2, 2, 1, 1, 1, 1, 2, 2, 2],
            [1, 1, 1, 2, 2, 2, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 2, 2, 2, 2, 0],
            [1, 1, 1, 2, 2, 2, 0, 0, 0, 2, 2, 2, 2, 0, 0, 0, 0, 1, 1, 1, 1],
            [1, 1, 1, 2, 2, 2, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 0, 0],
            [0, 0, 0, 2, 2, 2, 2, 0, 0, 0, 0, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1],
            [2, 2, 2, 2, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 2, 2, 2, 1, 1, 1, 1],
            [0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 2, 2, 2, 2, 0, 0],
            [2, 2, 2, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 0, 0, 0, 0, 1, 1, 1],
            [2, 2, 2, 1, 1, 1, 1, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 1, 1, 1, 2],
            [2, 2, 2, 2, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 2, 2, 2, 1, 1],
            [0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 1, 1, 1, 0, 0, 0, 0, 2, 2, 2],
            [0, 0, 0, 0, 2, 2, 2, 2, 1, 1, 1, 0, 0, 0, 1, 1, 1, 2, 2, 2, 1],
            [1, 1, 1, 2, 2, 2, 2, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 2, 2, 2, 0],
            [0, 0, 0, 0, 1, 1, 1, 2, 2, 2, 2, 1, 1, 1, 1, 2, 2, 2, 0, 0, 0],
            [2, 2, 2, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 2, 2, 2, 2, 0, 0, 0],
            [2, 2, 2, 2, 0, 0, 0, 1, 1, 1, 2, 2, 2, 1, 1, 1, 0, 0, 0, 0, 1],
            [0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 2, 2, 2, 2, 0, 0, 0],
            [1, 1, 1, 1, 2, 2, 2, 2, 0, 0, 0, 1, 1, 1, 0, 0, 0, 2, 2, 2, 0],
            [0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 0, 0, 0, 2, 2, 2, 1, 1, 1, 0],
            [0, 0, 0, 0, 2, 2, 2, 1, 1, 1, 2, 2, 2, 2, 1, 1, 1, 1, 0, 0, 0],
            [0, 0, 0, 0, 0, 2, 2, 2, 2, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 0, 0],
            [1, 1, 1, 1, 2, 2, 2, 0, 0, 0, 2, 2, 2, 2, 1, 1, 1, 0, 0, 0, 0],
            [2, 2, 2, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 2, 2, 2, 1, 1, 1, 1, 2],
            [2, 2, 2, 2, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 0, 0, 0, 0],
            [1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 0, 0, 0, 0, 0, 2, 2, 2, 2, 0, 0],
            [2, 2, 2, 2, 0, 0, 0, 1, 1, 1, 2, 2, 2, 0, 0, 0, 1, 1, 1, 1, 0],
            [1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 0, 0, 0, 0, 2, 2, 2, 2],
            [2, 2, 2, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 0, 0, 0, 0, 2],
            [0, 0, 0, 0, 1, 1, 1, 2, 2, 2, 1, 1, 1, 2, 2, 2, 2, 0, 0, 0, 1],
            [0, 0, 0, 2, 2, 2, 2, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 0],
            [2, 2, 2, 1, 1, 1, 1, 2, 2, 2, 2, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 2, 2, 2, 2, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 0, 0],
            [1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 2],
            [1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 0, 0, 0, 2, 2, 2, 2, 0],
            [1, 1, 1, 0, 0, 0, 0, 2, 2, 2, 1, 1, 1, 2, 2, 2, 2, 0, 0, 0, 1],
            [2, 2, 2, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 2, 2, 2, 2, 0],
            [0, 0, 0, 2, 2, 2, 1, 1, 1, 1, 2, 2, 2, 2, 0, 0, 0, 1, 1, 1, 0],
            [2, 2, 2, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 2, 2, 2, 2, 1, 1],
            [2, 2, 2, 2, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 2, 2, 2, 1],
            [2, 2, 2, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 2, 2, 2, 2, 0, 0, 0, 0],
            [0, 0, 0, 1, 1, 1, 0, 0, 0, 2, 2, 2, 2, 1, 1, 1, 1, 2, 2, 2, 0],
            [1, 1, 1, 1, 1, 2, 2, 2, 0, 0, 0, 2, 2, 2, 2, 0, 0, 0, 0, 1, 1],
            [2, 2, 2, 2, 0, 0, 0, 1, 1, 1, 2, 2, 2, 0, 0, 0, 1, 1, 1, 1, 0],
            [2, 2, 2, 2, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 2, 2, 2, 1, 1, 1, 1],
            [1, 1, 1, 1, 2, 2, 2, 2, 2, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 2, 2],
            [2, 2, 2, 2, 0, 0, 0, 2, 2, 2, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1],
            [1, 1, 1, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 2, 2, 2, 2, 1, 1, 1, 1],
            [0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 2, 2, 2, 1, 1, 1, 2, 2, 2, 2],
            [2, 2, 2, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 2, 2, 2, 2],
            [2, 2, 2, 2, 0, 0, 0, 2, 2, 2, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1],
            [1, 1, 1, 1, 0, 0, 0, 0, 2, 2, 2, 2, 0, 0, 0, 2, 2, 2, 1, 1, 1],
            [2, 2, 2, 2, 1, 1, 1, 1, 0, 0, 0, 2, 2, 2, 1, 1, 1, 0, 0, 0, 0]
        ]

        // An array of all displays in this generator
        this._block_displays = [];

    }

    _get_grid_pos() {
        let result = new Map();
        let i = 0;  // grid number, to be set as the keys of the output <Map>
        let x = this._screen_x_border + ((this._screen_x - 2 * this._screen_x_border) / this._n_items_x) / 2;   // initialize x coord.
        for (let j = 0; j < this._n_items_x; j++) {
            let y = this._screen_y_border + ((this._screen_y - 2 * this._screen_y_border) / this._n_items_y) / 2;   // initialize y coord.
            for (let k = 0; k < this._n_items_y; k++) {
                result.set(i, [x, y]);
                i++;
                y += (this._screen_y - 2 * this._screen_y_border) / this._n_items_y;
            }
            x += (this._screen_x - 2 * this._screen_x_border) / this._n_items_x;  // inc. x coord. to the next col.
        }
        return result;
    }

    /**
     * Private helper function for the display generator to look up number of
     * items there should be in the display.
     * 
     * @param {*} color index or name string of the color
     * @param {*} shape index or name string of the shape
     */
    _get_item_count(color, shape) {

        (function assert_input_type() {
            if (typeof color !== "number" && typeof color !== "string") {
                throw TypeError("Input color type error");
            }
            if (typeof shape !== "number" && typeof shape !== "string") {
                throw TypeError("Input shape type error");
            }
        })();

        let color_index;
        let shape_index;
        if (typeof color === "string") {
            color_index = this._colors.indexOf(color);
            if (color_index < 0) {
                color_index = this._color_aliases.indexOf(color);
            }
            (function assert() {
                if (color_index < 0) {
                    throw Error(`Color ${color} not found.`);
                }
            })();
        } else if (typeof color === "number") {
            (function assert() {
                if (color >= this._colors.length) {
                    throw Error(`Color index ${color} out of bound.`);
                }
            }).bind(this)();
            color_index = color;
        }

        if (typeof shape === "string") {
            shape_index = this._shapes.indexOf(shape);
            (function assert() {
                if (shape_index < 0) {
                    throw Error(`Shape ${shape} not found.`);
                }
            })();
        } else if (typeof shape === "number") {
            (function assert() {
                if (shape >= this._shapes.length) {
                    throw Error(`Shape index ${shape} out of bound.`);
                }
            }).bind(this)();
            shape_index = shape;
        }

        return this._item_count[color_index][shape_index];

    }

    /**
     * Private helper function for the display generator to set number of
     * items there should be in the display.
     * 
     * @param {*} color 
     * @param {*} shape 
     * @param {number} count 
     */
    _set_item_count(color, shape, count) {

        (function assert_input_type() {
            if (typeof color !== "number" && typeof color !== "string") {
                throw TypeError("Input color type error");
            }
            if (typeof shape !== "number" && typeof shape !== "string") {
                throw TypeError("Input shape type error");
            }
            if (count < 0 || !Number.isInteger(count)) {
                throw RangeError("Number of items should be a positive integer.");
            }
        })();

        let color_index;
        let shape_index;
        if (typeof color === "string") {
            color_index = this._colors.indexOf(color);
            if (color_index < 0) {
                color_index = this._color_aliases.indexOf(color);
            }
            (function assert() {
                if (color_index < 0) {
                    throw Error(`Color ${color} not found.`);
                }
            })();
        } else if (typeof color === "number") {
            (function assert() {
                if (color >= this._colors.length) {
                    throw Error(`Color index ${color} out of bound.`);
                }
            }).bind(this)();
            color_index = color;
        }

        if (typeof shape === "string") {
            shape_index = this._shapes.indexOf(shape);
            (function assert() {
                if (shape_index < 0) {
                    throw Error(`Shape ${shape} not found.`);
                }
            })();
        } else if (typeof shape === "number") {
            (function assert() {
                if (shape >= this._shapes.length) {
                    throw Error(`Shape index ${shape} out of bound.`);
                }
            }).bind(this)();
            shape_index = shape;
        }
        this._item_count[color_index][shape_index] = count;

    }

    /**
     * Return the exact color name of an alias color name.
     * For example, if the red color in the display uses a different rgb string
     * to represent color instead of "red", this function will return the exact
     * rgb of the red color when getting input "red".
     * 
     * @param {string} str color name
     */
    _get_color_value(str) {
        if (this._colors.indexOf(str) > -1) {
            // if color name matches what is already exact name, return itself
            return str;
        } else {
            // if color name does not match exact name, look up for its alias
            const index = this._color_aliases.indexOf(str);
            if (index > -1) {
                return this._colors[index];
            }
        }
        return null;
    }

    /**
     * Return the alias color name of an exact color name.
     * For example, if the red color in the display uses a different rgb string
     * to represent color instead of "red", this function will return "red" if
     * input is the exact rgb value of the red color.
     * 
     * @param {string} str color name
     */
    _get_color_alias(str) {
        if (this._color_aliases.indexOf(str) > -1) {
            // if color name matches what is already alias name, return itself
            return str;
        } else {
            // if color name does not match alias name, look up for its exact
            const index = this._colors.indexOf(str);
            if (index > -1) {
                return this._color_aliases[index];
            }
        }
        return null;
    }

    _colors_are_equal(color1, color2) {
        return this._get_color_value(color1) === this._get_color_value(color2);
    }

    /**
     * Given center point coordinates, two dimenson lengths, and other info,
     * return a <Polygon> object of the diamond.
     * 
     * @param {number} x center x
     * @param {number} y center y
     * @param {number} mainLen length of the main (horizontal) axis
     * @param {number} crossLen length of the cross (vertical) axis
     * @param {string} fill color
     * @param {string} className 
     * @param {string} id 
     * @param {string} transform 
     */
    _make_a_diamond(x, y, mainLen, crossLen, fill, className = undefined,
        id = undefined, transform = undefined) {
        const points = `${x},${y - crossLen / 2} `  // top
            .concat(`${x - mainLen / 2},${y} `) // left
            .concat(`${x},${y + crossLen / 2} `) // bottom
            .concat(`${x + mainLen / 2},${y}`); // right
        return new disp.Polygon(points, fill, className, id, transform);
    }

    /**
     * Given center point coordinates and the length of each side, return a
     * <Polygon> object of a equalateral triangle.
     * 
     * @param {number} x center x
     * @param {number} y center y
     * @param {number} sideLen length of the side
     * @param {string} fill color
     * @param {string} className 
     * @param {string} id 
     * @param {string} transform 
     */
    _make_a_triangle(x, y, sideLen, fill, className=undefined, id=undefined,
        transform=undefined) {
        const sqrt3 = Math.sqrt(3);
        const points = `${x-sideLen/2},${y+sideLen/(2*sqrt3)} `   // left
            .concat(`${x+sideLen/2},${y+sideLen/(2*sqrt3)} `)   // right
            .concat(`${x},${y-sideLen*(sqrt3/2-1/(2*sqrt3))}`); // top
        return new disp.Polygon(points, fill, className, id, transform);
    }

    /**
     * Given center point coordinates and the length of each side, return a
     * <Polygon> object of a regular pentagon.
     * 
     * @param {number} x center x
     * @param {number} y center y
     * @param {number} radius radius of circumcircle
     * @param {string} fill color
     * @param {string} className 
     * @param {string} id 
     * @param {string} transform 
     */
    _make_a_pentagon(x, y, radius, fill, className=undefined, id=undefined,
        transform=undefined) {
        const points = `${x},${y-radius} `   // top
            .concat(`${x+radius*Math.sin(2*Math.PI/5*1)},${y-radius*Math.cos(2*Math.PI/5*1)} `)   // top right
            .concat(`${x+radius*Math.sin(2*Math.PI/5*2)},${y-radius*Math.cos(2*Math.PI/5*2)} `) // bottom right
            .concat(`${x+radius*Math.sin(2*Math.PI/5*3)},${y-radius*Math.cos(2*Math.PI/5*3)} `) // bottom left
            .concat(`${x+radius*Math.sin(2*Math.PI/5*4)},${y-radius*Math.cos(2*Math.PI/5*4)} `); // top left
        return new disp.Polygon(points, fill, className, id, transform);
    }

    _generate_trial_conditions() {
        throw Error("Abstract method called.")
    }

    _make_trial_logic() {
        throw Error("Abstract method called.")
    }

    _make_trial_display() {
        throw Error("Abstract method called.")
    }

    get_total_displays_count() {
        return this._block_displays.length;
    }

    /**
     * "Public" method. Returns one <DisplayDataset> of this block if there is
     * any left, returns null otherwise.
     */
    yield_trial_display() {
        if (this._block_displays.length > 0) {
            return this._block_displays.shift();
        } else {
            return null;
        }
    }

    /**
     * "Public" method. Generates all displays in this generator and store in
     * `this._block_displays`.
     */
    make_block_displays() {
        throw Error("Abstract method called.")
    }

}
/**
 * <ACFDisplayGenerator2> is otherwise identical to <ACFDisplayGenerator1>
 * except that it uses triangles in place of circles.
 * 
 * @author Walden Y. Li
 * @created 07/02/2021
 */
disp.ACFDisplayGenerator3 = class extends disp.ACFDisplayGenerator {

    /**
     * 
     * @param {number} n_trials 
     * @param {*} targ_sq_color target square color (index, exact value, or alias)
     * @param {*} targ_cir_color target circle color (index, exact value, or alias)
     * @param {*} targ_diamond_color target diamond color (index, exact value, or alias)
     */
    constructor(n_trials, targ_sq_color, targ_cir_color, targ_diamond_color, finalize=true) {

        super(finalize);

        this._n_total_trials = n_trials;
        if (typeof targ_sq_color === "string") {
            this._targ_sq_color = this._get_color_value(targ_sq_color);
        } else if (typeof targ_sq_color === "number"){
            this._targ_sq_color = this._colors[targ_sq_color];
        }
        if (typeof targ_cir_color === "string") {
            this._targ_cir_color = this._get_color_value(targ_cir_color);
        } else if (typeof targ_cir_color === "number"){
            this._targ_cir_color = this._colors[targ_cir_color];
        }
        if (typeof targ_diamond_color === "string") {
            this._targ_diamond_color = this._get_color_value(targ_diamond_color);
        } else if (typeof targ_diamond_color === "number"){
            this._targ_diamond_color = this._colors[targ_diamond_color];
        }

        // Set target info in the matrix
        this._is_targ[this._colors.indexOf(this._get_color_value(targ_sq_color))][0] = 1;
        this._is_targ[this._colors.indexOf(this._get_color_value(targ_cir_color))][1] = 1;
        this._is_targ[this._colors.indexOf(this._get_color_value(targ_diamond_color))][2] = 1;

        if (finalize) {
            this.make_block_displays(this._generate_trial_conditions());
        }

    }

    /**
     * Balanced variables within one block:
     * Non optimal target color (0, 1, 2) max rep = 3
     */
    _generate_trial_conditions() {

        // let result = [];

        // (function assert() {
        //     if (this._n_total_trials % 3 !== 0) {
        //         throw Error("Total trial number must be a multiple of 3.")
        //     }
        // }).bind(this)();

        // let nonOptColors = util.Util.generate_random_array([0, 1, 2], this._n_total_trials, 3);

        // for (let i = 0; i < this._n_total_trials; i++) {
        //     result[i] = [nonOptColors.pop()];
        // }
        // return result;
        return this._rand_trial_seq[util.Util.gen_random_int(0, this._rand_trial_seq.length-1, true)].slice();

    }

    _make_trial_logic(nonOptTargColor) {
        return ({
            // Between-sub variables
            targSquareColor: this._get_color_alias(this._targ_sq_color),
            targCircleColor: this._get_color_alias(this._targ_cir_color),
            targDiamondColor: this._get_color_alias(this._targ_diamond_color),
            // Trial-specific variables
            nonOptTargColorIndex: nonOptTargColor,
            nonOptTargColorName: this._color_aliases[nonOptTargColor]
        });
    }

    /**
     * 
     * @param {number} nonOptColor *index* of non-optimal target color
     */
    _make_trial_display(nonOptColor) {
        let result = new disp.DisplayDataset();

        const gridPos = this._get_grid_pos();
        let items = util.Util.range(this._n_total_items);
        util.Util.fisher_yates_shuffle(items);

        // Determine number of each item type in the display
        // Targets
        this._set_item_count(this._targ_sq_color, "square", this._n_targ_per_color);
        this._set_item_count(this._targ_cir_color, "pentagon", this._n_targ_per_color);
        this._set_item_count(this._targ_diamond_color, "diamond", this._n_targ_per_color);
        // Determine non optimal color distractors (more abundant)
        // let temp = util.Util.split_int(this._n_dist_non_opt_color, 2);  // spliting nonoptimal dist items into 2
        // [0, 1, 2].forEach(
        //     ((shape) => {
        //         if (!this._is_targ[nonOptColor][shape]) {
        //             this._set_item_count(nonOptColor, shape, temp.pop());
        //         }
        //     }).bind(this)
        // );
        // // Determine optimal colors distractors
        // let colors = [0, 1, 2];
        // util.Util.remove_element_from_array(colors, nonOptColor);
        // // Now ``colors`` only contain optimal target colors
        // colors.forEach( ((c) => {
        //     let temp = util.Util.split_int(this._n_dist_opt_color, 2);
        //     [0, 1, 2].forEach(
        //         ((shape) => {
        //             if (!this._is_targ[c][shape]) {
        //                 this._set_item_count(c, shape, temp.pop());
        //             }
        //         }).bind(this)
        //     );
        // }).bind(this));

        // Determine non optimal color distractors (more abundant)
        [0, 1, 2].forEach(
            ((shape) => {
                if (!this._is_targ[nonOptColor][shape]) {
                    this._set_item_count(nonOptColor, shape, Math.floor(this._n_dist_non_opt_color/2));
                }
            }).bind(this)
        );
        // Determine optimal colors distractors
        let colors = [0, 1, 2];
        util.Util.remove_element_from_array(colors, nonOptColor);
        // Now ``colors`` only contain optimal target colors
        colors.forEach( ((c) => {
            [0, 1, 2].forEach(
                ((shape) => {
                    if (!this._is_targ[c][shape]) {
                        this._set_item_count(c, shape, Math.floor(this._n_dist_opt_color/2));
                    }
                }).bind(this)
            );
        }).bind(this));

        // 1. Add squares
        this._colors.forEach( (function add_squares(color) {

            for (let i = 0; i < this._get_item_count(color, "square"); i++) {
                // Get grid info
                let grid_no = items.pop();
                let grid = gridPos.get(grid_no);
                // Set coordinates with a random jitter
                let x = grid[0] + (Math.random() - 0.5) * this._max_x_jitter;
                let y = grid[1] + (Math.random() - 0.5) * this._max_y_jitter;
                // Add target shape
                result.add_a_rect(new disp.Rect(
                    x - this._square_size / 2 + '',     // square anchor is top left corner, so center is x - sz/2
                    y - this._square_size / 2 + '',
                    this._square_size,
                    this._square_size,
                    this._get_color_value(color),
                    this._colors_are_equal(color, this._targ_sq_color) ?
                        `targ_sq_${this._get_color_alias(color)}` :
                        `dist_sq_${this._get_color_alias(color)}`,
                    `pos_${grid_no}`
                ));
                // Add transparent ground shapes
                result.add_a_rect(new disp.Rect(
                    x - this._background_rect_size / 2 + '',     // square anchor is top left corner, so center is x - sz/2
                    y - this._background_rect_size / 2 + '',
                    this._background_rect_size,
                    this._background_rect_size,
                    "transparent",
                    this._colors_are_equal(color, this._targ_sq_color) ?
                        `targ_sq_${this._get_color_alias(color)}` :
                        `dist_sq_${this._get_color_alias(color)}`,
                    `pos_${grid_no}_bg`
                ));
            }

        }).bind(this) );

        // 2. Add pentagons
        this._colors.forEach( (function add_pentagons(color) {

            for (let i = 0; i < this._get_item_count(color, "pentagon"); i++) {
                // Get grid info
                let grid_no = items.pop();
                let grid = gridPos.get(grid_no);
                // Set coordinates with a random jitter
                let x = grid[0] + (Math.random() - 0.5) * this._max_x_jitter;
                let y = grid[1] + (Math.random() - 0.5) * this._max_y_jitter;
                // Generate polygon
                const poly = this._make_a_pentagon(
                    x,
                    y,
                    this._pentagon_radius,
                    this._get_color_value(color),
                    this._colors_are_equal(color, this._targ_cir_color) ?
                        `targ_pentagon_${this._get_color_alias(color)}` :
                        `dist_pentagon_${this._get_color_alias(color)}`,
                    `pos_${grid_no}`
                );
                // Add target shape
                result.add_a_polygon(poly);
                // Add transparent ground shapes
                result.add_a_rect(new disp.Rect(
                    x - this._background_rect_size / 2 + '',     // square anchor is top left corner, so center is x - sz/2
                    y - this._background_rect_size / 2 + '',
                    this._background_rect_size,
                    this._background_rect_size,
                    "transparent",
                    this._colors_are_equal(color, this._targ_cir_color) ?
                        `targ_pentagon_${this._get_color_alias(color)}` :
                        `dist_pentagon_${this._get_color_alias(color)}`,
                    `pos_${grid_no}_bg`
                ));
            }

        }).bind(this) );

        // 3. Add diamonds
        this._colors.forEach( (function add_diamonds(color) {

            for (let i = 0; i < this._get_item_count(color, "diamond"); i++) {
                // Get grid info
                let grid_no = items.pop();
                let grid = gridPos.get(grid_no);
                // Set coordinates with a random jitter
                let x = grid[0] + (Math.random() - 0.5) * this._max_x_jitter;
                let y = grid[1] + (Math.random() - 0.5) * this._max_y_jitter;
                // Generate polygon
                const poly = this._make_a_diamond(
                    x,
                    y,
                    this._diamond_main_axis_len,
                    this._diamond_cross_axis_len,
                    this._get_color_value(color),
                    this._colors_are_equal(color, this._targ_diamond_color) ?
                        `targ_diamond_${this._get_color_alias(color)}` :
                        `dist_diamond_${this._get_color_alias(color)}`,
                    `pos_${grid_no}`
                );
                // Add target shape
                result.add_a_polygon(poly);
                // Add transparent ground shapes
                result.add_a_rect(new disp.Rect(
                    x - this._background_rect_size / 2 + '',     // square anchor is top left corner, so center is x - sz/2
                    y - this._background_rect_size / 2 + '',
                    this._background_rect_size,
                    this._background_rect_size,
                    "transparent",
                    this._colors_are_equal(color, this._targ_diamond_color) ?
                        `targ_diamond_${this._get_color_alias(color)}` :
                        `dist_diamond_${this._get_color_alias(color)}`,
                    `pos_${grid_no}_bg`
                ));
            }

        }).bind(this) );
        
        // (function assert_display_complete() {
        //     if (items.length > 0) {
        //         throw Error("Display not complete.");
        //     }
        // })();

        return result;

    }

    make_block_displays() {
        let result = [];
        const trial_conds = this._generate_trial_conditions();
        for (let i = 0; i < this._n_total_trials; i++) {
            const trial_cond = trial_conds.pop(); // [optTargColor, nonOptTargColor]
            result.push({
                "logic": this._make_trial_logic(trial_cond),
                "stimuli": this._make_trial_display(trial_cond)
            });
        }
        this._block_displays = result;
    }

}
/**
 * <MCFDisplayGenerator> is a base class for Mouse Click Foraging display
 * generator classes. It contains basic settings and logic of a display.
 * 
 * @author Walden Y. Li
 * @version 1.2 (02/08/2021)
 */
disp.MCFDisplayGenerator = class {

    constructor() {

        // Display settings
        this._screen_x = 100;   // length of the main axis (horizontal)
        this._screen_y = 80;    // length of the cross axis (vertical)
        this._screen_x_border = 0;  // length of blank space on x axis from the left OR right border
        this._screen_y_border = 5;  // length of blank space on y axis from the top OR bottom border
        this._max_x_jitter = 3.5;
        this._max_y_jitter = 3.5 / 1.25;

        // Stimuli settings
        this._n_items_x = 10;   // number of items on the main axis
        this._n_items_y = 8;    // number of items on the cross axis
        this._n_total_items = this._n_items_x * this._n_items_y;
        this._n_targ_sq = 20;
        this._n_targ_cir = 20;
        this._n_dist_sq = 20;
        this._n_dist_cir = 20;
        this._circle_radius = 0.7;
        this._square_size = 2;
        this._background_rect_size = 3;

        // An array of all displays in this generator
        this._block_displays = null;

    }

    _get_grid_pos() {
        let result = new Map();
        let i = 0;  // grid number, to be set as the keys of the output <Map>
        let x = this._screen_x_border + ((this._screen_x - 2 * this._screen_x_border) / this._n_items_x) / 2;   // initialize x coord.
        for (let j = 0; j < this._n_items_x; j++) {
            let y = this._screen_y_border + ((this._screen_y - 2 * this._screen_y_border) / this._n_items_y) / 2;   // initialize y coord.
            for (let k = 0; k < this._n_items_y; k++) {
                result.set(i, [x, y]);
                i++;
                y += (this._screen_y - 2 * this._screen_y_border) / this._n_items_y;
            }
            x += (this._screen_x - 2 * this._screen_x_border) / this._n_items_x;  // inc. x coord. to the next col.
        }
        return result;
    }

    get_total_displays_count() {
        return this._block_displays.length;
    }

    /**
     * "Public" method. Returns one <DisplayDataset> of this block if there is
     * any left, returns null otherwise.
     */
    yield_trial_display() {
        if (this._block_displays.length > 0) {
            return this._block_displays.pop();
        } else {
            return null;
        }
    }

}
/**
 * The <DisplayGenerator> class for Mouse Click Foraging task.
 * 
 * @author Walden Y. Li
 * @version 1.3 (02/08/2021)
 * 
 * @update 1.3 Made this class an extension of the base class
 *  <MCFDisplayGenerator>.
 * @update 1.2 Added a black object to the back of each display object to allow
 *  some degree of deviation in mouse clicking.
 */
disp.MCFDisplayGenerator1 = class extends disp.MCFDisplayGenerator {

    constructor(n_trials, targ_sq_color, targ_cir_color) {

        super();

        // Generator parameters
        this._n_total_trials = n_trials;
        this._targ_sq_color = targ_sq_color;
        this._targ_cir_color = targ_cir_color;
        this._dist_sq_color = targ_cir_color;
        this._dist_cir_color = targ_sq_color;

        // An array of displays in the block this generator is responsible for
        this._block_displays = this._make_block_displays();

    }

    _make_block_displays() {
        let result = [];
        for (let i = 0; i < this._n_total_trials; i++) {
            result.push(this._make_trial_display());
        }
        return result;
    }

    _make_trial_display() {
        let result = new disp.DisplayDataset();
        const gridPos = this._get_grid_pos();
        let items = util.Util.range(this._n_total_items);
        util.Util.fisher_yates_shuffle(items);

        // 1. Add target squares
        for (let i = 0; i < this._n_targ_sq; i++) {
            // Get grid info
            let grid_no = items.pop();
            let grid = gridPos.get(grid_no);
            // Set coordinates with a random jitter
            let x = grid[0] + (Math.random()-0.5) * this._max_x_jitter;
            let y = grid[1] + (Math.random()-0.5) * this._max_y_jitter;
            // Add target shape
            result.add_a_rect(new disp.Rect(
                x - this._square_size/2 + '',     // square anchor is top left corner, so center is x - sz/2
                y - this._square_size/2 + '',
                this._square_size,
                this._square_size,
                this._targ_sq_color,
                `targ_sq_${this._targ_sq_color}`,
                `pos_${grid_no}`
            ));
            // Add transparent ground shapes
            result.add_a_rect(new disp.Rect(
                x - this._background_rect_size/2 + '',     // square anchor is top left corner, so center is x - sz/2
                y - this._background_rect_size/2 + '',
                this._background_rect_size,
                this._background_rect_size,
                "transparent",
                `targ_sq_${this._targ_sq_color}`,
                `pos_${grid_no}_bg`
            ));
        }

        // 2. Add distractor squares
        for (let i = 0; i < this._n_dist_sq; i++) {
            // Get grid info
            let grid_no = items.pop();
            let grid = gridPos.get(grid_no);
            // Set coordinates with a random jitter
            let x = grid[0] + (Math.random()-0.5) * this._max_x_jitter;
            let y = grid[1] + (Math.random()-0.5) * this._max_y_jitter;
            result.add_a_rect(new disp.Rect(
                x - this._square_size/2 + '',
                y - this._square_size/2 + '',
                this._square_size,
                this._square_size,
                this._dist_sq_color,
                `dist_sq_${this._dist_sq_color}`,
                `pos_${grid_no}`
            ));
            // Add transparent ground shapes
            result.add_a_rect(new disp.Rect(
                x - this._background_rect_size/2 + '',     // square anchor is top left corner, so center is x - sz/2
                y - this._background_rect_size/2 + '',
                this._background_rect_size,
                this._background_rect_size,
                "transparent",
                `dist_sq_${this._dist_sq_color}`,
                `pos_${grid_no}_bg`
            ));
        }

        // 3. Add target circles
        for (let i = 0; i < this._n_targ_cir; i++) {
            // Get grid info
            let grid_no = items.pop();
            let grid = gridPos.get(grid_no);
            // Set coordinates with a random jitter
            let x = grid[0] + (Math.random()-0.5) * this._max_x_jitter;
            let y = grid[1] + (Math.random()-0.5) * this._max_y_jitter;
            result.add_a_circle(new disp.Circle(
                x + '',
                y + '',
                this._circle_radius,
                this._targ_cir_color,
                this._targ_cir_color,
                null,
                `targ_cir_${this._targ_cir_color}`,
                `pos_${grid_no}`
            ));
            // Add transparent ground shapes
            result.add_a_rect(new disp.Rect(
                x - this._background_rect_size/2 + '',     // square anchor is top left corner, so center is x - sz/2
                y - this._background_rect_size/2 + '',
                this._background_rect_size,
                this._background_rect_size,
                "transparent",
                `targ_cir_${this._targ_cir_color}`,
                `pos_${grid_no}_bg`
            ));
        }

        // 4. Add distractor circles
        for (let i = 0; i < this._n_dist_cir; i++) {
            // Get grid info
            let grid_no = items.pop();
            let grid = gridPos.get(grid_no);
            // Set coordinates with a random jitter
            let x = grid[0] + (Math.random()-0.5) * this._max_x_jitter;
            let y = grid[1] + (Math.random()-0.5) * this._max_y_jitter;
            result.add_a_circle(new disp.Circle(
                x + '',
                y + '',
                this._circle_radius,
                this._dist_cir_color,
                this._dist_cir_color,
                null,
                `dist_cir_${this._dist_cir_color}`,
                `pos_${grid_no}`
            ));
            // Add transparent ground shapes
            result.add_a_rect(new disp.Rect(
                x - this._background_rect_size/2 + '',     // square anchor is top left corner, so center is x - sz/2
                y - this._background_rect_size/2 + '',
                this._background_rect_size,
                this._background_rect_size,
                "transparent",
                `dist_cir_${this._dist_cir_color}`,
                `pos_${grid_no}_bg`
            ));
        }        

        return result;
    }

}
/**
 * The <DisplayGenerator> class for the baseline task of the MCF task. A
 * baseline task block constitutes of 20 trials of single-target mouse clicking
 * task where a participant is asked to click on the center of the 
 * For a display generator class, a total of 40 different 
 * 
 * @author Walden Y. Li
 * @version 1.2 (06/30/2021)
 * 
 * @update 1.2 (06/30/21) Changed return object for block dataset
 * @created 01/31/2021
 */
disp.MCFBaselineDisplayGenerator = class extends disp.MCFDisplayGenerator {

    constructor() {

        super();

        this._targ_pos_pool = [
            17, 18, 19, 20, 21, 22,
            25, 26, 27, 28, 29, 30,
            33, 34, 35, 36, 37, 38,
            41, 42, 43, 44, 45, 46,
            49, 50, 51, 52, 53, 54,
            57, 58, 59, 60, 61, 62
        ];
        this._grid_pos = this._get_grid_pos();

        this._block_displays = this._make_block_displays();

    }

    _make_trial_display(targ_pos) {
        let result = new disp.DisplayDataset();
        const x = this._grid_pos.get(targ_pos)[0];
        const y = this._grid_pos.get(targ_pos)[1];
        result.add_a_text(new disp.Text(
            '+',
            x,
            y,
            'white',
            3,
            undefined,
            "mcf_baseline_target_cross",
            `cross_${x.toFixed(2)}_${y.toFixed(2)}`
        ));
        return result;
    }

    _make_block_displays() {
        let result = [];
        // Shuffle target positions for each trial
        util.Util.fisher_yates_shuffle(this._targ_pos_pool);
        // For each position, generate a trial
        this._targ_pos_pool.forEach((pos) => {
            result.push({
                logic: null,
                stimuli: this._make_trial_display(pos)
            });
        });
        return result;
    }


    static generate_a_fixation() {
        let result = new disp.DisplayDataset();

        return result;
    }

}
// Define an objection which will act as a namespace.
'use strict'
const exp = {};
/**
 * This is a kernel class for experiments.
 * 
 * @author Walden Li
 * @version 1.4 (10/2/2020)
 */
exp.ExperimentKernel = class {

    constructor() {
        this._steps = []; // an array of the experiment steps
        this._steps_finalized = false; // private flag for signaling initialization
        this._db = new util.Database();
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
/// Abstract Base Class for Block Trials
///
exp.AbstractTrial = class {
  constructor () {
    this.trial_completed_signal = null //new util.Signal();
  }

  /////////////////////////////////////////////////////////////////////////////
  ///
  /// All subclasses should override this method in order to provide the
  /// behavior for the trial.
  ///
  run_trial () {
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
        // if ((timing.length - 1) !== cue.length) throw ("ERROR: Mismatch in cue frames and number of time stamps");
        this.logic = logic;
        this.timing = timing;
        this.cue = cue;
        this.stimuli = stimuli;


        this.trial_completed_signal = new util.Signal();

        this.display_widget = new disp.DisplayWidget(util.Workspace.workspace());

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
        util.Workspace.clear_header();
        util.Workspace.clear_workspace();
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
            util.Workspace.show_message("Please use: 'v' for 2, 'b' for 3, 'n' for 4, and 'm' for 5", "red");
            setTimeout(() => {
                util.Workspace.clear_message();
            }, 2000);
        }

        this.trial_data.blockTrial = this._trial_number_in_block;
        this.trial_data.blockNumber = this._block_number;

        this.trial_data.logic = this.logic;

        let response = this.answer_keys.get(the_key_the_user_pressed);
        if (response === undefined) response = -1;
        this.trial_data.response = response;
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

        this.keyboard = this.keyboard.destroy();

        util.Util.clear_timeouts();

        this.show_debriefing();
    }

    ///////////////////////////////////////////////////////////////////////////////
    ///
    /// helper method providing the logic for what happens when the user hits an
    /// invalid key.
    ///
    respond_to_invalid_user_keyboard_input(the_key_the_user_pressed) {
        util.Workspace.show_message("Key '" + the_key_the_user_pressed + "' not recognized. Please use: 'v' for 2, 'b' for 3, 'n' for 4, and 'm' for 5", "red");

        util.Util.play_beep_sound();

        setTimeout(() => {
            util.Workspace.clear_message();
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


    run_trial() {

        this.initialize_keyboard();

        this.display_widget.clear();
        util.Workspace.clear_message();

        if(window._test) {
            this.keyboard.turn_on();
        }

        for (let i = 0; i < this.cue.length; i++) {
            setTimeout((() => {
                this.display_widget.draw(this.cue[i]);
            }).bind(this), this.timing[i]);
        }

        if(this.timing.length - this.cue.length === 1) {
            // if stimuli only has one frame (the normal circumstance)
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
        } else {
            // if stimuli has more than one frame (so far this only happens when
            // the stimuli is an RSVP stream)
            // calculate the inter-frame interval
            const isi = this.timing[this.timing.length-1] - this.timing[this.timing.length-2];
            // calculate timeout
            const timeout = this.timing[this.cue.length] + this.stimuli.length * isi + 1000;
            // when the first frame is shown, open keyboard and record a timestamp
            setTimeout((()=> {
                this.display_widget.draw(this.stimuli[0]);
                this.keyboard.turn_on();
                this.trial_data.stimuli_shown_at = performance.now();
            }).bind(this), this.timing[this.cue.length + 1]);
            // draw the rest of the frames
            for (let i = 1; i < this.stimuli.length-1; i++) {
                setTimeout((() => {
                    this.display_widget.draw(this.stimuli[i]);
                }).bind(this), this.timing[this.cue.length] + isi * i );
            }

            // timeout
            setTimeout((() => {
                this.respond_to_valid_user_keyboard_input('trial_timed_out', performance.now());
            }).bind(this), timeout);
        }

    }

}/**
 * A trial class for Mouse Click Foraging task, compatible with both equal and
 * different subset version.
 * 
 * @author Walden Y. Li
 * @version 1.2 (6/30/2021)
 * 
 * @update 1.2 (6/30/21) added optimal target element; added trial logic in
 * trial data to record
 * @created 1/31/2021
 */
exp.MCFTrial = class extends exp.AbstractTrial {

    constructor(stimuli, targ_sq_color, targ_cir_color, opt_targ_color=undefined) {

        super();

        this._stimuli = stimuli;
        this._targ_sq_color = targ_sq_color;
        this._targ_cir_color = targ_cir_color;
        // If display has different subset sizes
        // Note that this is coded such that 0 = the color of target squares and
        // 1 = the color of target circes
        this._opt_targ_color = opt_targ_color;

        this._trial_completed_signal = new util.Signal();

        this._display_widget = new disp.DisplayWidget(util.Workspace.workspace(), "0 0 100 80", "125vmin");

        // Create an object to store the data for this Trial
        this._trial_data = { "trial_start_timestamp": performance.now() };

        // Trial parameters
        this._fixation_duration = 1000;   // duration fixation cross is shown
        this._feedback_duration = 1500;
        this._max_targ_click_interval = 10000;    // max time allowed between two target clicks before trial resets
        this._err_msg_duration = 3000;  // duration of error message (wrong targ click or timed out) appears on screen

        // Trial runtime variables
        this._n_total_targs = 40; // 40 = whole, <40 = partial
        this._n_targ_left = this._n_total_targs;
        this._n_run = 1;
        this._response_sequence = [];
        this._response_timestamps = [];
        this._response_locations = [];
        this._n_wrong_attempt = 0;

    }


    _process_click(data) {
        // Determine if this object is a target
        if (data.className.slice(0, 4) === "targ") {
            // If it is, record the timestamp of this target click
            this._response_timestamps.push(performance.now());
            // Clear existing timeouts
            util.Util.clear_timeouts();
            // Record target position (x & y or cx & cy, depending on the shape)
            if (data.x !== undefined) {
                this._response_locations.push([parseFloat(data.x).toFixed(2), parseFloat(data.y).toFixed(2)]);
            } else {
                this._response_locations.push([parseFloat(data.cx).toFixed(2), parseFloat(data.cy).toFixed(2)]);
            }
            // Determine if this is a switch of target type (only when this is not the first target in the trial)
            if (this._response_sequence.length > 0 &&
                data.className.slice(5, 7) !== this._response_sequence[this._response_sequence.length - 1].slice(5, 7)) {
                this._n_run++;
            }
            // Record target identity in the response sequence
            this._response_sequence.push(`${data.className}_${data.id}`);
            // Decrement remaining target count
            this._n_targ_left--;
            // Remove the object and its background object
            d3.select(`#${data.id}`).remove();
            if (data.id[data.id.length - 1] !== 'g') {
                d3.select(`#${data.id}_bg`).remove();
            } else {
                d3.select(`#${data.id.slice(0, data.id.length - 3)}`).remove();
            }
            // Create a timeout for next object
            this._create_trial_timeout(this._max_targ_click_interval);
        } else {
            // If the clicked object is not a target, clear the display
            this._display_widget.clear();
            // Clear existing timeouts
            util.Util.clear_timeouts();
            // Play a beep sound
            util.Util.play_beep_sound();
            // Show feedback
            this._display_widget.show_feedback(
                "Oops, remember the targets are " + this._targ_sq_color + " squares " +
                "and " + this._targ_cir_color + " circles. " +
                "Let's try again!", 50, 40);
            // Increment wrong attempt count
            this._n_wrong_attempt++;
            // After 3 seconds, reset trial parameters show the display again
            this._reset_trial(this._err_msg_duration);
        }
        // Check if there is any target left
        if (this._n_targ_left === 0) {
            this._trial_data.trial_completed_timestamp = performance.now();
            this._end_trial();
        }
    }

    _reset_trial_params() {
        this._response_sequence = [];
        this._response_locations = [];
        this._response_timestamps = [];
        this._n_targ_left = this._n_total_targs;
        this._n_run = 1;
    }

    /**
     * Create a timeout such that after certain time, the display refreshes to
     * the original state and trial parameters reset.
     * @param {number} t : time (ms) until reset
     */
    _reset_trial(t) {
        setTimeout(() => {
            this._reset_trial_params();
            this._render();
        }, t)
    }

    _end_trial() {
        util.Util.clear_timeouts();
        // Record trial logic
        this._trial_data.logic = {};
        this._trial_data.logic.targ_sq_color = this._targ_sq_color;
        this._trial_data.logic.targ_cir_color = this._targ_cir_color;
        this._trial_data.logic.opt_targ_color = this._opt_targ_color;
        // Record trial result
        this._trial_data.run_number = this._n_run;
        this._trial_data.run_length = 40 / this._n_run;
        this._trial_data.n_wrong_attempt = this._n_wrong_attempt;
        this._trial_data.response_sequence = this._response_sequence;
        this._trial_data.response_timestamps = this._response_timestamps;
        this._trial_data.response_locations = this._response_locations;
        this._trial_data.rt = (this._trial_data.trial_completed_timestamp - this._trial_data.stimuli_rendered_timestamp) / 1000;
        this._display_widget.clear();
        setTimeout((() => {
            this._display_widget = this._display_widget.destroy();
            this._trial_completed_signal.emit(this._trial_data);
        }).bind(this), this._feedback_duration);
    }

    /**
     * Render a trial display. Called at the beginning of a trial or when
     * a non-target is clicked and the display needs resetting.
     */
    _render() {
        const fixation = new disp.DisplayDataset();
        fixation.add_a_text(new disp.Text(
            '+', 50, 40, 'white', 3, undefined, "fixation-cross-center"
        ));
        util.Util.clear_timeouts();
        this._display_widget.clear();
        this._display_widget.draw(fixation);
        setTimeout(() => {
            this._display_widget.clear();
            this._display_widget.draw(this._stimuli);
            d3.selectAll("rect, circle").on("click", d => this._process_click(d));
            this._trial_data.stimuli_rendered_timestamp = performance.now();
            // Create a timeout that resets the trial after 10s of no response
            this._create_trial_timeout(this._max_targ_click_interval);
        }, this._fixation_duration);
    }

    /**
     * Create a timeout. After certain time, reset trial parameters and redraw
     * the display.
     * @param {number} t : time (ms) until trial resets
     */
    _create_trial_timeout(t) {
        setTimeout(() => {
            this._display_widget.show_feedback("Please click a target as quickly as you can!");
            this._reset_trial(this._err_msg_duration);
        }, t)
    }

    run_trial() {

        this._display_widget.clear();
        util.Workspace.clear_message();

        this._render();
    }

    set_trial_number(n) {
        this._trial_data.blockTrial = n;
    }

    set_block_number(n) {
        this._trial_data.blockNumber = n;
    }

    get_trial_completed_signal() {
        return this._trial_completed_signal;
    }

}
/**
 * A trial class for Adaptive Choice Visual Foraging task.
 * 
 * @author Walden Y. Li
 * @version 1.1 (07/07/2021)
 * 
 * @created 7/7/21
 */
exp.ACFTrial = class extends exp.AbstractTrial {

    /**
     * 
     * @param {disp.DisplayDataset} stimuli 
     * @param {string} targ_sq_color 
     * @param {string} targ_cir_color 
     * @param {string} targ_diamond_color 
     * @param {number} non_opt_targ_color
     */
    constructor(stimuli, targ_sq_color, targ_cir_color, targ_diamond_color, non_opt_targ_color) {

        super();

        this._stimuli = stimuli;
        this._targ_sq_color = targ_sq_color;
        this._targ_cir_color = targ_cir_color;
        this._targ_diamond_color = targ_diamond_color;
        this._non_opt_targ_color = non_opt_targ_color;

        this._trial_completed_signal = new util.Signal();

        this._display_widget = new disp.DisplayWidget(util.Workspace.workspace(), "0 0 100 80", "125vmin");

        // Create an object to store the data for this Trial
        this._trial_data = { "trial_start_timestamp": performance.now() };

        // Trial parameters
        this._fixation_duration = 1000;   // duration fixation cross is shown
        this._feedback_duration = 1500;
        this._max_targ_click_interval = 10000;    // max time allowed between two target clicks before trial resets
        this._err_msg_duration = 3000;  // duration of error message (wrong targ click or timed out) appears on screen

        // Trial runtime variables
        this._n_total_targs = 30;
        this._n_targ_left = this._n_total_targs;
        this._n_run = 1;

        // User response container
        this._response = [];
        this._n_wrong_attempt = 0;

    }


    _process_click(data) {
        // Determine if this object is a target
        if (data.className.slice(0, 4) === "targ") {
            // Create a response object to store information about this click
            let response = {};
            // If it is, record the timestamp of this target click
            response.timestamp = performance.now();
            // Clear existing timeouts
            util.Util.clear_timeouts();
            // Record svg object info
            response.objectInfo = data;
            // Determine if this is a switch of target type (only when this is not the first target in the trial)
            if (this._response.length > 0 &&
                data.className.slice(5, 7) !== this._response[this._response.length - 1].objectInfo.className.slice(5, 7)) {
                this._n_run++;
            }
            // Add reponse data into the trial response array
            this._response.push(response);
            // Decrement remaining target count
            this._n_targ_left--;
            // Remove the object and its background object
            d3.select(`#${data.id}`).remove();
            if (data.id[data.id.length - 1] !== 'g') {
                d3.select(`#${data.id}_bg`).remove();
            } else {
                d3.select(`#${data.id.slice(0, data.id.length - 3)}`).remove();
            }
            // Create a timeout for next object
            this._create_trial_timeout(this._max_targ_click_interval);
        } else {
            // If the clicked object is not a target, clear the display
            this._display_widget.clear();
            // Clear existing timeouts
            util.Util.clear_timeouts();
            // Play a beep sound
            util.Util.play_beep_sound();
            // Show feedback
            this._display_widget.show_feedback(
                `Remember the targets are ${this._targ_sq_color} squares, ` +
                `${this._targ_cir_color} pentagons, and ` +
                `${this._targ_diamond_color} diamonds. Let's try again!`,
                50, 40, "1.5pt");
            // this._display_widget.show_feedback(
            //     `Remember the targets are ${this._targ_sq_color} squares, ` +
            //     `${this._targ_cir_color} triangles, and ` +
            //     `${this._targ_diamond_color} diamonds. Let's try again!`,
            //     50, 40, "1.5pt");
            // Increment wrong attempt count
            this._n_wrong_attempt++;
            // After 3 seconds, reset trial parameters show the display again
            this._reset_trial(this._err_msg_duration);
        }
        // Check if there is any target left
        if (this._n_targ_left === 0) {
            this._trial_data.trial_completed_timestamp = performance.now();
            this._end_trial();
        }
    }

    _reset_trial_params() {
        this._response = [];
        this._n_targ_left = this._n_total_targs;
        this._n_run = 1;
    }

    /**
     * Create a timeout such that after certain time, the display refreshes to
     * the original state and trial parameters reset.
     * @param {number} t : time (ms) until reset
     */
    _reset_trial(t) {
        setTimeout(() => {
            this._reset_trial_params();
            this._render();
        }, t)
    }

    _end_trial() {
        util.Util.clear_timeouts();
        // Record trial logic
        this._trial_data.logic = {};
        this._trial_data.logic.targ_sq_color = this._targ_sq_color;
        this._trial_data.logic.targ_pentagon_color = this._targ_cir_color;
        this._trial_data.logic.targ_diamond_color = this._targ_diamond_color;
        this._trial_data.logic.non_opt_targ_color = this._non_opt_targ_color;
        // Record trial result
        this._trial_data.run_number = this._n_run;
        this._trial_data.run_length = this._n_total_targs / this._n_run;
        this._trial_data.n_wrong_attempt = this._n_wrong_attempt;
        this._trial_data.response = this._response;
        this._trial_data.rt = (this._trial_data.trial_completed_timestamp - this._trial_data.stimuli_rendered_timestamp) / 1000;
        this._display_widget.clear();
        this._display_widget.show_feedback("Success");
        setTimeout((() => {
            this._display_widget = this._display_widget.destroy();
            this._trial_completed_signal.emit(this._trial_data);
        }).bind(this), this._feedback_duration);
    }

    /**
     * Render a trial display. Called at the beginning of a trial or when
     * a non-target is clicked and the display needs resetting.
     */
    _render() {
        const fixation = new disp.DisplayDataset();
        fixation.add_a_text(new disp.Text(
            '+', 50, 40, 'white', 3, undefined, "fixation-cross-center"
        ));
        util.Util.clear_timeouts();
        this._display_widget.clear();
        this._display_widget.draw(fixation);
        setTimeout(() => {
            this._display_widget.clear();
            this._display_widget.draw(this._stimuli);
            d3.selectAll("rect, circle, polygon").on("click", d => this._process_click(d));
            this._trial_data.stimuli_rendered_timestamp = performance.now();
            // Create a timeout that resets the trial after 10s of no response
            this._create_trial_timeout(this._max_targ_click_interval);
        }, this._fixation_duration);
    }

    /**
     * Create a timeout. After certain time, reset trial parameters and redraw
     * the display.
     * @param {number} t : time (ms) until trial resets
     */
    _create_trial_timeout(t) {
        setTimeout(() => {
            this._display_widget.show_feedback("Please click a target as quickly as you can!");
            this._reset_trial(this._err_msg_duration);
        }, t)
    }

    run_trial() {

        this._display_widget.clear();
        util.Workspace.clear_message();

        this._render();
    }

    set_trial_number(n) {
        this._trial_data.blockTrial = n;
    }

    set_block_number(n) {
        this._trial_data.blockNumber = n;
    }

    get_trial_completed_signal() {
        return this._trial_completed_signal;
    }

}
/**
 * A trial controller class for Mouse Click Foraging baseline task.
 * 
 * @author Walden Y. Li
 * @version 1.1 (02/09/2021)
 */
exp.MCFBaselineTrial = class extends exp.AbstractTrial {

    constructor(stimuli) {

        super();

        this._stimuli = stimuli;

        this._trial_completed_signal = new util.Signal();

        this._display_widget = new disp.DisplayWidget(util.Workspace.workspace(), "0 0 100 80", "125vmin");

        // Create an object to store the data for this Trial
        this._trial_data = { "trial_start_timestamp": performance.now() };

        // Trial parameters
        this._feedback_duration = 1500;

        // Trial runtime variables
        // None

    }

    _show_fixation() {
        const fixation = new disp.DisplayDataset();
        fixation.add_a_text(new disp.Text(
            '+', 50, 40, 'white', 3, undefined, "fixation-cross-center"
        ));
        this._display_widget.clear();
        this._display_widget.draw(fixation);
        // Note: When the onclick callback function is set without "bind(this)",
        // the this._fixation_clicked_callback function will think "this" as
        // the SVGTextElement, i.e., the fixation cross.  Adding "bind(this)"
        // sets this class to be the object to which "this" keyword can refer to
        // inside this._fixation_clicked_callback function.
        d3.select(".fixation-cross-center").on("click", this._fixation_clicked_callback.bind(this));
    }

    _fixation_clicked_callback() {
        this._display_widget.clear();
        this._display_widget.draw(this._stimuli);
        this._trial_data.stimuli_rendered_timestamp = performance.now();
        d3.select(".mcf_baseline_target_cross").on("click", this._target_clicked_callback.bind(this));
    }

    _target_clicked_callback(data) {
        this._trial_data.trial_completed_timestamp = performance.now();
        // Record trial result
        this._trial_data.targ_info = data.id;
        // Record target position
        this._trial_data.targ_pos = [parseFloat(data.x).toFixed(2), parseFloat(data.y).toFixed(2)];
        this._trial_data.rt = (this._trial_data.trial_completed_timestamp - this._trial_data.stimuli_rendered_timestamp)/1000;
        this._display_widget.clear();
        setTimeout((() => {
            this._display_widget = this._display_widget.destroy();
            this._trial_completed_signal.emit(this._trial_data);
        }).bind(this), this._feedback_duration);
    }

    run_trial() {

        this._display_widget.clear();
        util.Workspace.clear_message();

        this._show_fixation();
    }

    set_trial_number(n) {
        this._trial_data.blockTrial = n;
    }

    set_block_number(n) {
        this._trial_data.blockNumber = n;
    }

    get_trial_completed_signal() {
        return this._trial_completed_signal;
    }

}
/**
 * 
 */
exp.ConsentStep = class extends util.AbstractStep {
    constructor(db) {
        super();
        this._db = db;
    }

    execute() {

        const CONSENT_FORM_URL = "https://exp.leberatory.org/files/forms/Consent_Prolific.pdf";

        // The message
        util.Workspace.workspace().append("p")
            .html("The following is the consent form. Please read it carefully.")
            .style("font-size", "1.2em")
            .style("font-style", "italic")
            .style("text-align", "center")

        // Use an <iframe> to display the consent form
        util.Workspace.workspace().append("iframe")
            .attr("width", "70%")
            .attr("height", "400")
            .attr("src", CONSENT_FORM_URL);
        
        const responseArea = util.Workspace.workspace().append("div")
            .attr("id", "consent-response-area")
            .style("width", "80%")
            .style("display", "block")
            .style("margin", "auto");
        
        responseArea.append("button")
        .attr("class", "btn-wide")
        .text("I agree to participate")
        .on("click", (function(){
            this._db.EventsTable.add_new_row("Subject agreed to consent form");
            alert("Before we get started, please answer 2 quick questions.");
            let age = prompt("Please type your age:", "N/A");
            let gender = prompt("Please type your gender (Female/Male/Non-Binary):", "N/A");
            alert("Thank you!");
            this._db._user_data = {
                self_reported_age: age,
                self_reported_gender: gender,
                // sub_id: SUB_ID,
                prolific_id: util.Util.get_prolific_id(),
                study_id: util.Util.get_study_id(),
                session_id: util.Util.get_session_id(),
                cb_id: util.Util.get_cb_id()
            };
            util.Workspace.clear_workspace();
            this.step_completed_signal.emit();
            }).bind(this));

        responseArea.append("button")
        .text("I do NOT agree to participate")
        .attr("class", "btn-wide")
        .on("click", () => {
            util.Workspace.clear_header();
            util.Workspace.clear_workspace();
            util.Workspace.append_paragraphs([
                "<br><br><br><br>",
                "You have declined to participate.",
                "<br>",
                "Thank you for your consideration.",
                "<br>",
                "You may now close the tab."
            ]);
        });
        
    }

}
/**
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
 * @version 1.1 (08/04/2020)
 * @author Walden Li
 */
exp.CheckBrowserStep = class extends(util.AbstractStep) {

    constructor(db) {
        super();
        this._db = db;
    }

    execute() {

        if ( navigator.cookieEnabled === false ) {
        
        }

        const is_fullscreen = () => { return document.fullscreenElement !== null };

        // This function requests the browser to enter full screen. In Chrome,
        // the request can only be called by a user action such as a mouseclick
        // or a keypress, for security reasons.
        // This function checks if the browser is in full-screen mode. If not,
        // it will reveal the overlay div and prompt user to click to trigger
        // a full-screen request. It will then 
        const check_fullscreen = () => {
            if( !is_fullscreen() ) {
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

}
/**
 * <Block> represents a block of ACVS experiment.
 * 
 * @package acvs-online
 * @author Walden Li
 * @version 1.6 (10/12/2020)
 * 
 * @update 1.6 : changed display generator class
 * @update 1.5 : added timeline parameter to the constructor
 */
exp.Block = class extends util.AbstractStep {

    /**
     * 
     * @param {util.Database} db 
     * @param {number} block_no 
     * @param {disp.DisplayGenerator} display_generator 
     * @param {Array<number>} timeline
     */
    constructor(db, block_no, display_generator, timeline) {
        super();

        this._db = db;

        this._block_no = block_no;

        if (util.Util.is_test_mode()) {
            this._trial_timeline = util.Util.zeros(timeline.length);
        } else {
            this._trial_timeline = timeline;
        }

        this._display_generator = display_generator;

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
        return new exp.Trial(logic, cue, stimuli, this._trial_timeline);
    }

    _run_next_trial(previous_results = null) {
        if (previous_results != null) {
            this._accuracy_data.push(previous_results.bool);
            this._all_trials_data.push(previous_results);
        }

        let display = this._display_generator.yield_trial_display();

        if (display != null) {
            // create a new trial
            let trial = this._construct_trial(display.logic, display.cue, display.stimuli);
            trial._trial_number_in_block = this._trial_num;
            this._trial_num++;
            trial._block_number = this._block_no;

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
        this._db.ExperimentTable.add_new_row(this._block_no, this._all_trials_data);
        // localStorage.setItem(window._acvs_guid, btoa(JSON.stringify(this._db)));
    }

    _show_summary() {
        // Show cursor
        util.Workspace.show_cursor();
        // Calculate accuracy (%)
        const accuracy = (Math.round(util.Util.mean(this._accuracy_data) * 1000) / 10);
        let paragraph = [];
        paragraph.push("<br><br><br>");
        if(this._block_no === 0) {
            paragraph.push("<b>You complete the first practice block!</b>");
        } else if (this._block_no === 0.5) {
            paragraph.push("<b>You completed the second practice block!")
        } else {
            paragraph.push("<b>You Completed Block #" + this._block_no + "!</b>");
        }
        paragraph.push("<hr>");
        paragraph.push("Your Accuracy: " + accuracy + "%");
        paragraph.push("<hr>");
        paragraph.push("<b>Ready to continue?</b>");
        util.Workspace.append_paragraphs(paragraph);

        // create a button for the user to press to acknowledge
        util.Workspace.append_button("Yes", this.step_completed_signal.emit.bind(this.step_completed_signal));
        util.Workspace.clear_message()
    }

    execute() {
        util.Workspace.hide_cursor();
        util.Workspace.clear_header();
        util.Workspace.clear_workspace();
        this._db.EventsTable.add_new_row("beginning block step #" + this._block_no);
        this._run_next_trial();
        util.Workspace.show_message(".", "black");
    }

}/**
 * A block of the task Adaptive Choice Visual Foraging.
 * 
 * @author Walden Y. Li
 * @version 1.1 (07/07/2021)
 * 
 * @created 7/7/21
 */
exp.ACFBlock = class extends util.AbstractStep {

    /**
     * 
     * @param {util.Database} db 
     * @param {number} block_no 
     * @param {disp.DisplayGenerator} display_generator
     * @param {number} n_max_trials : if display_generator has more displays than
     *  desired, set the trial number needed here 
     */
    constructor(db, block_no, display_generator, n_max_trials=undefined) {
        
        super();

        this._db = db;

        this._block_no = block_no;
        if (n_max_trials !== undefined) {
            this._n_max_trials = n_max_trials;
        } else {
            this._n_max_trials = display_generator.get_total_displays_count();
        }

        // Check display generator type: baseline or main task
        display_generator instanceof disp.MCFBaselineDisplayGenerator ?
            this._block_type = "baseline" : this._block_type = "main";


        this._display_generator = display_generator;

        // Array of data for each of the trials
        this._all_trials_data = [];

        this._trial_num = 1;

    }

    _construct_trial(stimuli, logic) {
        if (this._block_type === "main") {
            return new exp.ACFTrial(stimuli, logic["targSquareColor"],
                logic["targCircleColor"], logic["targDiamondColor"],
                logic["nonOptTargColorIndex"]);
        } else if (this._block_type === "baseline") {
            return new exp.MCFBaselineTrial(stimuli);
        }
    }

    _run_next_trial(previous_results = null) {

        if (previous_results != null) {
            this._all_trials_data.push(previous_results);
        }

        if (this._trial_num <= this._n_max_trials) {
            let display = this._display_generator.yield_trial_display();
            if (display !== null) {
                // Create a new trial
                let trial = this._construct_trial(display.stimuli, display.logic);
                trial.set_block_number(this._block_no);
                trial.set_trial_number(this._trial_num);
                this._trial_num++;
    
                // When the trial is completed call the next trial (~recursive)
                trial.get_trial_completed_signal().connect(this._run_next_trial.bind(this));
    
                // start the trial
                trial.run_trial();
            } else {
                // all trials have been completed so tell the user how they did.
                this._save_data();
                this._show_summary();
            }
        } else {
            // Trial about to create exceeds max number of trials in the block
            this._save_data();
            this._show_summary();
        }

    }

    _save_data() {
        this._db.ExperimentTable.add_new_row(this._block_no, this._all_trials_data);
    }

    _show_summary() {
        // Calculate accuracy (%)
        let paragraph = [];
        paragraph.push("<br><br><br>");
        if(this._block_no === 0) {
            paragraph.push("<b>You complete the practice block!</b>");
        } else {
            paragraph.push("<b>You Completed Block #" + this._block_no + "!</b>");
        }
        paragraph.push("<hr>");
        paragraph.push("<b>Ready to continue?</b>");
        util.Workspace.append_paragraphs(paragraph);

        // create a button for the user to press to acknowledge
        util.Workspace.append_button("Yes", this.step_completed_signal.emit.bind(this.step_completed_signal));
        util.Workspace.clear_message();
    }

    execute() {
        util.Workspace.clear_header();
        util.Workspace.clear_workspace();
        this._db.EventsTable.add_new_row("beginning block #" + this._block_no);
        this._run_next_trial();
    }

}
/**
 * <MCFBlock> represents a block of Mouse Click Foraging task.
 * 
 * @author Walden Y. Li
 * @version 1.0 (1/31/2021)
 * 
 */
exp.MCFBlock = class extends util.AbstractStep {

    /**
     * 
     * @param {util.Database} db 
     * @param {number} block_no 
     * @param {disp.DisplayGenerator} display_generator
     * @param {number} cb_no : 1 or 0 
     * @param {number} n_trials : if display_generator has more displays than
     *  desired, set the trial number needed here 
     */
    constructor(db, block_no, display_generator, cb_no=undefined, n_max_trials=undefined) {
        super();

        this._db = db;

        this._block_no = block_no;
        if (n_max_trials !== undefined) {
            this._n_max_trials = n_max_trials;
        } else {
            this._n_max_trials = display_generator.get_total_displays_count();
        }

        // Check display generator type: baseline or main task
        display_generator instanceof disp.MCFBaselineDisplayGenerator ?
            this._block_type = "baseline" : this._block_type = "main";

        this._targ_sq_color = "";
        this._targ_cir_color = "";
        if (cb_no === 1) {
            this._targ_sq_color = "red";
            this._targ_cir_color = "green";
        } else if (cb_no === 0) {
            this._targ_sq_color = "green";
            this._targ_cir_color = "red";
        }

        if (util.Util.is_test_mode()) {
        }

        this._display_generator = display_generator;

        // Array of data for each of the trials
        this._all_trials_data = [];

        this._trial_num = 1;

    }

    _construct_trial(stimuli) {
        if (this._block_type === "main") {
            return new exp.MCFTrial(stimuli, this._targ_sq_color, this._targ_cir_color);
        } else if (this._block_type === "baseline") {
            return new exp.MCFBaselineTrial(stimuli);
        }
    }

    _run_next_trial(previous_results = null) {

        if (previous_results != null) {
            this._all_trials_data.push(previous_results);
        }

        if (this._trial_num <= this._n_max_trials) {
            let display = this._display_generator.yield_trial_display();
            if (display !== null) {
                // Create a new trial
                let trial = this._construct_trial(display);
                trial.set_block_number(this._block_no);
                trial.set_trial_number(this._trial_num);
                this._trial_num++;
    
                // When the trial is completed call the next trial (~recursive)
                trial.get_trial_completed_signal().connect(this._run_next_trial.bind(this));
    
                // start the trial
                trial.run_trial();
            } else {
                // all trials have been completed so tell the user how they did.
                this._save_data();
                this._show_summary();
            }
        } else {
            // Trial about to create exceeds max number of trials in the block
            this._save_data();
            this._show_summary();
        }

    }

    _save_data() {
        this._db.ExperimentTable.add_new_row(this._block_no, this._all_trials_data);
        console.log(this._db);
    }

    _show_summary() {
        // Calculate accuracy (%)
        let paragraph = [];
        paragraph.push("<br><br><br>");
        if(this._block_no === 0) {
            paragraph.push("<b>You complete the practice block!</b>");
        } else {
            paragraph.push("<b>You Completed Block #" + this._block_no + "!</b>");
        }
        paragraph.push("<hr>");
        paragraph.push("<b>Ready to continue?</b>");
        util.Workspace.append_paragraphs(paragraph);

        // create a button for the user to press to acknowledge
        util.Workspace.append_button("Yes", this.step_completed_signal.emit.bind(this.step_completed_signal));
        util.Workspace.clear_message();
    }

    execute() {
        util.Workspace.clear_header();
        util.Workspace.clear_workspace();
        this._db.EventsTable.add_new_row("beginning block #" + this._block_no);
        this._run_next_trial();
    }

}///////////////////////////////////////////////////////////////////////////////
///
/// The <BriefingSet> is used to put an image on the screen. The step will
/// end when the user types the "key".
///
exp.BriefingStep = class extends(util.AbstractStep) {
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
  execute () {
    // show the image on screen
    util.Workspace.clear_header();
    util.Workspace.clear_workspace();
    util.Workspace.append_paragraphs([this._htmlImgTag]);

    // if the user hits the callbackKey, then the step will exit
    let keyboard = new util.KeyFilter( (function (key) {
        if (key == this._callbackKey) {
          keyboard.destroy();
          this._db.EventsTable.add_new_row("Instruction page callback key received.");
          this.step_completed_signal.emit();
        }
      }).bind(this)
    );
  }
}
/**
 * A step that should be executed before the main experiment. It sends stimuli
 * data to the server to avoid sending larger volume of data in the end of 
 * experiment. It also serves as a check of connection and server readiness.
 * 
 * @author Walden Y. Li
 * @created 07/09/2021
 */
exp.SubmitStimuliStep = class extends util.AbstractStep {

    /**
     * 
     * @param {string} link the submission link
     * @param  {...disp.DisplayGenerator} args display generators to record
     */
    constructor(link, ...args) {
        super();
        this._submission_link = link;
        this._data = args;
    }

    execute() {

        // UI
        util.Workspace.workspace().append("p").attr("class", "debriefing-title")
            .style("animation", "blinker 1s linear infinite")
            .html("Preparing experiment data...");

        // Send to server
        const link = this._submission_link;
        $.ajax({
            type: "POST",
            url: link,
            data: {
                stimuli: {
                    prolificId: util.Util.get_prolific_id,
                    sessionId: util.Util.get_session_id,
                    studyId: util.Util.get_study_id,
                    stimuliData: JSON.stringify(this._data)
                }
            },
            success: () => {
                util.Workspace.workspace().select(".debriefing-title")
                    .html("Experiment preparation ready.");
                setTimeout( (()=> {
                    util.Workspace.workspace().select(".debriefing-title").remove();
                    this.step_completed_signal.emit();
                }).bind(this), 100);
                
            },
            failure: (errMsg) => {
                alert("There is something wrong this your Internet connection" +
                ". Please refresh and try again. Error message: " + errMsg);
            }
        })
    }

}
/**
 * Submit data step designed for experiments run on Prolific.
 * 
 * @package acvs-online
 * @version 1.2 (updated 1/1/2021)
 * @author Walden Y. Li
 */
exp.SubmitDataStep = class extends util.AbstractStep {

    constructor(db, submitLink, completeLink) {
        super();
        this._db = db;
        this._submit_link = submitLink;
        this._complete_link = completeLink;
    }

    execute() {

        util.Workspace.clear_workspace();
        util.Workspace.show_header("Online Experiment - Cognitive Control Lab");
        d3.select("#overlay").remove();

        // Tell participants we are submitting data
        util.Workspace.workspace().append("p").attr("class", "debriefing-title")
            .html("Submitting data ...");

        util.Util.redirect(this._complete_link, 10000);
        
        // Submit data
        $.ajax({
            type: "POST",
            url: this._submit_link,
            data: {
                "data": JSON.stringify(this._db)
            },
            success: () => {
                util.Workspace.workspace().select(".debriefing-title")
                    .html("-- END OF EXPERIMENT --");
                util.Util.clear_timeouts();
                util.Util.redirect(this._complete_link, 2000);
            },
            failure: (errMsg) => {
                alert(errMsg);
            }
        })

        // Debriefing message
        util.Workspace.workspace().append("p").attr("class", "debriefing-msg")
            .html(
                "<p>You have completed the experiment. Thank you for your " +
                "participation.</p>" + 
                "<p>IMPORTANT: If not automatically redirected after 10 seconds, " +
                "Please click on the button below to go back to Prolific." +
                "If you " +
                "have any questions or concerns, " +
                "please email us at the following address:</br>" +
                "li.6942@osu.edu (Walden Li)."
            );

        // Debriefing form button
        util.Workspace.workspace().append("button")
            .attr("class", "btn-regular")
            .text("GO BACK TO PROLIFIC")
            .on("click", () => {
                window.open(this._complete_link);
            });

        this._db.EventsTable.add_new_row("Data submitted.");
        util.Util.set_cookie("completed_acvs", "true", 30);

    }

}
/**
 * The tasks in ACF7 is otherwise same as ACF2 except for changes in:
 * ACVS: ratio becomes 3:1
 * ACF: shapes become squares, pentagons, and diamonds, and ratio increases
 * 
 * ACF7 is also otherwise same as ACF5 except for a difference in task order:
 * ACF --> ACVS --> MCF
 */
exp.ACF7 = class extends exp.ExperimentKernel {
    constructor() {

        super();
        //
        // Set up the database
        //
        this._db.add_new_table("EventsTable");
        this._db.EventsTable.add_new_column("Event");

        this._db.add_new_table("ExperimentTable");
        this._db.ExperimentTable.add_new_column("BlockNumber");
        this._db.ExperimentTable.add_new_column("AllTrialsData");

        this._db.add_new_table("_user_data");

        const INSTR_ROOT = "https://exp.leberatory.org/files/instr/acf7/";
        const INSTR_FILE_EXT = "jpeg";

        // Get determine version based on counterbalance id
        // In this experiment, there will be 2 versions of MCFT and 6 versions
        // of ACVF. So, the cb id will be 
        const cb = parseInt(util.Util.get_cb_id());
        const mcf_version = cb % 2;
        const acf_version = cb % 6;
        let mcf_colors, acf_colors;
        switch (mcf_version) {
            case 1: mcf_colors = ["red", "green"]; break;
            case 0: mcf_colors = ["green", "red"]; break;
            default:
        }
        switch (acf_version) {
            case 1: acf_colors = ["red", "green", "blue"]; break;
            case 2: acf_colors = ["red", "blue", "green"]; break;
            case 3: acf_colors = ["green", "red", "blue"]; break;
            case 4: acf_colors = ["green", "blue", "red"]; break;
            case 5: acf_colors = ["blue", "red", "green"]; break;
            case 0: acf_colors = ["blue", "green", "red"]; break;
            default:
        }

        // Generate displays
        const g_acvs = new disp.StandardDisplayGenerator(108);
        const b = new disp.MCFBaselineDisplayGenerator();
        const g_mcf = new disp.MCFDisplayGenerator1(20, ...mcf_colors);
        const g_acf = new disp.ACFDisplayGenerator3(21, ...acf_colors);

        // Send stimuli (first part)
        // this.add_new_step(new exp.SubmitStimuliStep(
        //     `receive.php?PROLIFIC_PID=${util.Util.get_prolific_id()}`,
        //     g_acvs)
        // );

        // Informed consent
        this.add_new_step(new exp.ConsentStep(this._db));
        this.add_new_step(new exp.CheckBrowserStep(this._db));

        // Block 1 (Mouse Click Baseline)
        this.add_new_step(new exp.BriefingStep(this._db, [`<img src=${INSTR_ROOT}baseline_0.${INSTR_FILE_EXT}>`], " "));
        this.add_new_step(new exp.ACFBlock(this._db, 1, b, 18));

        // ACF Practice Block
        this.add_new_step(new exp.BriefingStep(this._db, [`<img src=${INSTR_ROOT}acf_0_cb_${acf_version}.${INSTR_FILE_EXT}>`], " "));
        this.add_new_step(new exp.ACFBlock(this._db, 0, new disp.ACFDisplayGenerator3(3, ...acf_colors)));

        // Block 2 (ACF)
        this.add_new_step(new exp.BriefingStep(this._db, [`<img src=${INSTR_ROOT}acf_1_cb_${acf_version}.${INSTR_FILE_EXT}>`], " "));
        this.add_new_step(new exp.ACFBlock(this._db, 2, g_acf));

        // ACVS instruction and practice block
        for (let i = 0; i < 9; i++) {
            this.add_new_step(new exp.BriefingStep(this._db, [`<img src=${INSTR_ROOT}acvs_${i}.${INSTR_FILE_EXT}>`], " "));
        }
        this.add_new_step(new exp.Block(
            this._db,
            0,  // block number
            new disp.StandardDisplayGenerator(12, 10),    // is practice block; has preview
            [0, 400, 1400]  // timing
        ));

        // Block 3 (ACVS)
        this.add_new_step(new exp.Block(this._db, 3, g_acvs, [0, 400, 1400]));

        // MCF Practice Block
        this.add_new_step(new exp.BriefingStep(this._db, [`<img src=${INSTR_ROOT}mcf_0_cb_${mcf_version}.${INSTR_FILE_EXT}>`], " "));
        this.add_new_step(new exp.MCFBlock(this._db, 0, new disp.MCFDisplayGenerator1(2, ...mcf_colors), mcf_version));

        // Block 4 (MCF)
        this.add_new_step(new exp.BriefingStep(this._db, [`<img src=${INSTR_ROOT}mcf_1_cb_${mcf_version}.${INSTR_FILE_EXT}>`], " "));
        this.add_new_step(new exp.MCFBlock(this._db, 4, g_mcf, mcf_version));

        // Block 5 (Mouse Click Baseline 2nd half)
        this.add_new_step(new exp.BriefingStep(this._db, [`<img src=${INSTR_ROOT}baseline_1.${INSTR_FILE_EXT}>`], " "));
        this.add_new_step(new exp.ACFBlock(this._db, 5, b));

        this.add_new_step(new exp.SubmitDataStep(this._db,
            `receive.php?PROLIFIC_PID=${util.Util.get_prolific_id()}`,
            "https://app.prolific.co/submissions/complete?cc=2BE7278B")
        );

    }
}
window.onload = () => {

    window._acvs_guid = "8A519BC4C0D340EC901068D6137EECC2";

    util.Workspace.show_header("Online Experiment - Cognitive Control Lab");
    const experiment = new exp.ACF7();
    experiment.run();

}
  </script>

</body>
</html>