// Docsify plugin default values
let defaultDocsifyUpdatedOptions = {
  text: ">Last Modify: ",
  formatUpdated: "{YYYY}/{MM}/{DD}",
  whereToPlace: "bottom"
}

// Docsify plugin functions
function plugin(hook, vm) {
  
  var time = '{docsify-updated}';
  if (CONFIG.repo !== '') {
      var date_url = 'https://api.github.com/repos/' + CONFIG.repo + '/commits?per_page=1';

      if (CONFIG.basePath !== '') {
          date_url = date_url + '&path=' + CONFIG.basePath + vm.route.file;
      }
      fetch(date_url).then((response) => {
        return response.json();
      }).then((commits) => {
          if (commits.length > 0) {
              time = tinydate(CONFIG.dateFormat)(new Date(commits[0]['commit']['committer']['date']));
          }
      });
  }
  
  let text = vm.config.timeUpdater.text + time
  let whereToPlace = String(vm.config.timeUpdater.whereToPlace).toLowerCase()
  hook.beforeEach(function (content) {
    switch (whereToPlace) {
      case "top":
        return text + "\n\n" + content
      case "bottom":
        return content + "\n\n" + text
      default:
        return content + "\n\n" + text
    }
  })
}

// Docsify plugin options
window.$docsify = (window.$docsify || {})
// https://docsify.js.org/#/configuration?id=formatupdated
// https://github.com/lukeed/tinydate#patterns
window.$docsify.formatUpdated = window.$docsify["timeUpdater"] ? window.$docsify["timeUpdater"].formatUpdated : defaultDocsifyUpdatedOptions.formatUpdated
window.$docsify["timeUpdater"] = Object.assign(defaultDocsifyUpdatedOptions, window.$docsify["timeUpdater"])
window.$docsify.plugins = (window.$docsify.plugins || []).concat(plugin)

// Usage:
// window.$docsify = {
//   timeUpdater: {
//     text: ">last update time: {docsify-updated}",
//     formatUpdated: '{YYYY}/{MM}/{DD}',
//     whereToPlace: "bottom" // top || bottom
//   }
// }
