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

    static window_is_iframe() {
        try {
            return window.self !== window.top;
        } catch (err) {
            return true;
        }
    }


    static play_beep_sound() {
        const beep = new Audio("data:audio/mpeg;base64,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wZ0G7jqlt/OcDIKX+/1NblSX+VKfQfP8xuJJGk7////rf////+PgXTv///1JThJJQainmySAB6imUyuVbVttUo7T4Csa821OuF88f62+CZHFnGf///mQgYIEO0SMF2NVy9NxYTdlqJ8AuS4zr//SJoTUJ+CaKKTcZvosrUPo8W/MUv0f033E9E/QpN6P///v/////WRR2mwUAYUABjabRu1vrOLKAF0kIdHjnEx/iNWo7jGn1////mApxNTJQQOU1Het/NoUFTMQs6Vja///THaGIl/0fojl8mjd/Jo8W+ZfpNpCajsz7////6kn/////WRRgDz//LD1KSTDjKOciSAKxdLx5S31uYqKIWj/+5JECgAC8V5M6g9rdFyr6Vo9rW6KtHcr5DEJQRkSpLRklSigvVc4QpmyPe9H3zHR1/in9P/8VNCMJOzYUDyVjfwHP0ZgiZt/3/+9EBnDKbegdUrckhgntHaQ9vX/X/9A/////+r/////mJ3/9ItRcoVRogAcmV9N8z0pvES8QQsKoMGXEymPQyWm6E4HQLqgpv/CZJAtYXQSwoF8e6SB56zABEoW+qgZjJAZovGr0Gl5/OjFKL3JwnaX9v7/X8y1f/////////49WAzMzEYYMZLq6CUANIqbDX7lisBIdraAEPwShTRc9WZ2vAqBc4NQ9GrUNaw0Czcrte0g1NEoiU8NFjx4NFh54FSwlOlgaCp0S3hqo8SLOh3/63f7P/KgKJxxhgGSnAFMCnIogwU5JoqBIDAuBIiNLETyFmiImtYiDTSlb8ziIFYSFv/QPC38zyxEOuPeVGHQ77r/1u/+kq49//6g4gjoVQSUMYQUSAP8PwRcZIyh2kCI2OwkZICZmaZxgnsNY8DmSCWX0idhtz3VTJSqErTSB//1X7TTTVVV//uSZB2P8xwRJ4HvYcItQlWBACM4AAABpAAAACAAADSAAAAEVf/+qCE000VVVVU0002//+qqqqummmmr///qqqppppoqqqqppppoqqATkEjIyIxBlBA5KwUEDBBwkFhYWFhUVFfiqhYWFhcVFRUVFv/Ff/xUVFRYWFpMQU1FMy45OS41qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqg==");
        beep.play();
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
        return d3.select("#hidden-test").html() === "true";
    }

    static get_sub_id() {
        return d3.select("#hidden-sub-id").html();
    }

    static is_alt_server_mode() {
        return d3.select("#hidden-alt").html() === "true";
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
        if ( max_rep===0 ) return result;

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
            return Util.generate_random_array(items, length, max_rep);
        } else return result;

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
