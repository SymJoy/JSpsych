/*
 * Example plugin template
 */

jsPsych.plugins["dashed-sentence"] = (function() {

  var plugin = {};

  plugin.info = {
    name: "dashed-sentence",
    parameters: {
      stimulus: {
        type: jsPsych.plugins.parameterType.HTML_STRING, // BOOL, STRING, INT, FLOAT, FUNCTION, KEYCODE, SELECT, HTML_STRING, IMAGE, AUDIO, VIDEO, OBJECT, COMPLEX
        default: undefined,
        description: 'The sentence to read'
      },
      read: {
        type: jsPsych.plugins.parameterType.KEYCODE,
        array: true,
        default: jsPsych.ALL_KEYS,
        description: 'The keys the subject is allowed to press to go to next word'
      },
      above: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'above',
        default: null,
        description: 'Any content here will be displayed above the stimulus.'
      },
      below: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'below',
        default: null,
        description: 'Any content here will be displayed below the stimulus.'
      }
    }
  }

  plugin.trial = function(display_element, trial) {

    var new_html = '';
    var index = 0;
    var word_array = trial.stimulus.split(" ");
    var length = word_array.length;
    var dotted_sentence = '';

    for (var z = 0; z < length; z++) {
      if(z != 0) {
        dotted_sentence += ' ';
      }

      var word_len = word_array[z].length;
      var dotted_word = '';
      for (var w = 0; w < word_len; w++) {
        dotted_word += '_';
      }

      dotted_sentence += dotted_word;
    }

    // add above text
    if(trial.above !== null){
      new_html += trial.above;
    }

    new_html += '<div id="main-sentence">'+dotted_sentence+'</div>';

    // add below text
    if(trial.below !== null){
      new_html += trial.below;
    }

    // draw
    display_element.innerHTML = new_html;

    // store response
    var response = {
      rt: null,
      key: null
    };

    // function to end trial when it is time
    var end_trial = function() {

      // kill any remaining setTimeout handlers
      jsPsych.pluginAPI.clearAllTimeouts();

      // kill keyboard listeners
      if (typeof keyboardListener !== 'undefined') {
        jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
      }

      // gather the data to store for the trial
      var trial_data = {
        "rt": response.rt,
        "stimulus": trial.stimulus,
        "key_press": response.key
      };

      // clear the display
      display_element.innerHTML = '';

      // move on to the next trial
      jsPsych.finishTrial(trial_data);
    };

    // function to handle responses by the subject
    var after_response = function(info) {
      //Adapt display test
      handle_dashed_sentence();

      // only record the first response
      if (response.key == null) {
        response = info;
      }
    };

    // start the response listener
    if (trial.read != jsPsych.NO_KEYS) {
      var keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
        callback_function: after_response,
        valid_responses: trial.read,
        rt_method: 'performance',
        persist: true,
        allow_held_key: false
      });
    }

    //Function handling dashed sentence
    var handle_dashed_sentence = function() {
      var dashed_sentence = '';

      for (var i = 0; i < length; i++) {
        if(i != 0) {
          dashed_sentence += ' ';
        }

        if(i == index) {
          dashed_sentence += word_array[i];
        }
        else {
          var word_len = word_array[i].length;
          var dotted_word = '';
          for (var y = 0; y < word_len; y++) {
            dotted_word += '_';
          }

          dashed_sentence += dotted_word;
        }
      }

      document.getElementById("main-sentence").innerHTML = dashed_sentence;

      if(index == length) {
        end_trial();
      }

      index++;
    };
  };

  return plugin;
})();
