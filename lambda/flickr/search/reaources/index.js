const requireRoot = require('app-root-path').require;
const frickrSearch = requireRoot("/libs/frickrSearch");
const apiRenderTemplate = requireRoot("/libs/apiRenderTemplate");

exports.handler = async (event, context) => {
  const startTime = new Date();
  console.log(event);
  const serachParams = {}
  if(event.q){
    serachParams.text = event.q;
    delete event.q;
  }else if(!event.user_id && !event.tags){
    return apiRenderTemplate("failed", startTime, {images: []});
  }
  const allSearchResults = await frickrSearch.searchAllFlickrPhotos(Object.assign(serachParams, event));

  return apiRenderTemplate("success", startTime, {images: allSearchResults});
};