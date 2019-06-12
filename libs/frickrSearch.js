const requireRoot = require('app-root-path').require;
const util = requireRoot('/libs/util');

const Flickr = require('flickr-sdk');

const PER_PAGE_COUNT = 500;
const EXTRA_OPTIONS =
  'description, date_upload, date_taken, owner_name, original_format, geo, tags, o_dims, url_sq, url_t, url_s, url_q, url_m, url_n, url_z, url_c, url_l, url_o';
const LIMIT_SEARCH_MILLISECOND = 240000;
const MAX_REQUEST_SLEEP_MILLISECOND = 1000;

const searchFlickrPhotos = async function searchFlickrPhotos(searchParams) {
  const response = await searchFlickr(searchParams);
  return response.body.photos;
};

exports.searchFlickrPhotos = searchFlickrPhotos;

exports.searchAllFlickrPhotos = async function searchAllFlickrPhotos(searchObj) {
  const allSearchResults = [];
  let pageNumber = 1;
  const startTime = new Date();
  let retryCounter = 0;
  while (new Date() - startTime < LIMIT_SEARCH_MILLISECOND) {
    const searchQueries = Object.assign(
      {
        per_page: PER_PAGE_COUNT,
        page: pageNumber,
        extras: EXTRA_OPTIONS,
      },
      searchObj,
    );
    const requestStartTime = new Date();
    const searchResult = await searchFlickrPhotos(searchQueries).catch((error) => (retryCounter = retryCounter + 1));
    if (!searchResult && retryCounter > 0) {
      if (retryCounter >= 5) {
        break;
      } else {
        await util.sleep(MAX_REQUEST_SLEEP_MILLISECOND);
        continue;
      }
    }
    retryCounter = 0;
    if (searchResult.page >= searchResult.pages) {
      break;
    }
    pageNumber = pageNumber + 1;
    for (const photo of searchResult.photo) {
      allSearchResults.push({
        id: photo.id,
        user_name: photo.owner,
        title: photo.title,
        describe: photo.description,
        tags: photo.tags,
        latitude: photo.latitude,
        longitude: photo.longitude,
        accuracy: photo.accuracy,
        image_url:
          photo.url_o ||
          photo.url_l ||
          photo.url_c ||
          photo.url_z ||
          photo.url_n ||
          photo.url_m ||
          photo.url_q ||
          photo.url_s ||
          photo.url_t ||
          photo.url_sq,
      });
    }
    const elapsedMilliSecond = new Date() - requestStartTime;
    if (elapsedMilliSecond < MAX_REQUEST_SLEEP_MILLISECOND) {
      await util.sleep(elapsedMilliSecond);
    }
  }

  return allSearchResults;
};

async function searchFlickr(searchParams) {
  const flickr = new Flickr(process.env.FLICKR_APIKEY);
  return flickr.photos.search(searchParams);
}
