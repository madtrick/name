'use strict';

var Promise = require('bluebird');
var tpAPI   = require('tp-api');

module.exports = {
  cliOptions: [
    {
      description : 'Target Process entity id',
      required    : false,
      long        : 'target-process-id',
      short       : 'tp'
    }
  ],

  setup: function (config) {
    this.targetprocess = tpAPI(config);
  },

  preMessageHook : function (options, data) {
    return new Promise( function (resolve) {
      var targetProcessId            = options.cli.tp;
      var messageWithTargetProcessId = data.replace(/:tp-ticket-id:/g, targetProcessId);

      resolve(messageWithTargetProcessId);
    });
  },

  afterCreatePullRequest: function (options, pullRequest) {
    var self    = this;
    var comment = 'Submitted Pull Request ' + pullRequest.url;

    return new Promise( function () {
      if (!options.cli.tp) {
        return;
      }

      self.targetprocess().comment(options.cli.tp, comment, function (error) {
        if (error) {
          console.error(error);
          return;
        } else {
          console.log('Commented on Target Process entity #', options.cli.tp);
        }
      });
    });
  }
};
