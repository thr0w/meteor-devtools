const Dispatcher = require('./dispatcher'),
      Constants = require('./constants'),
      _ = require('underscore');

var compactJSONString = function(d, maxLength){
  var str  = JSON.stringify(d);
  if(str.length <= maxLength){
    return str;
  } else { 
    var postFix = ' ... }';
    return [str.substr(0,maxLength - postFix.length),
      postFix].join('');
  }
};

var unescapeBackSlashes = function(str){
  return str.replace(/\\"/g, '"');
};

module.exports = {
  addTrace : function(data){
    var isValid = data && data.messageJSON && 
      typeof data.isOutbound !== 'undefined';

    if(isValid){
      var d = JSON.parse(data.messageJSON);  
      d = _.isArray(d) ? d : [d];

      _.each(d, function(m){
        Dispatcher.dispatch({
          type : Constants.NEW_TRACE,
          data : {
            jsonString : unescapeBackSlashes(JSON.stringify(m)),
            compactJSONString : 
              unescapeBackSlashes(compactJSONString(m, 50)),
            isOutbound : data.isOutbound
          }
        });
      });
    }
  },

  toggleTraceExtension : function(traceId){
    Dispatcher.dispatch({
      type : Constants.TOGGLE_TRACE_EXTEND,
      data : traceId
    });
  },

  clearLogs : function(){
    Dispatcher.dispatch({
      type : Constants.CLEAR_LOGS
    });
  } 
};