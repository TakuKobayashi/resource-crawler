import { FlickrImageResource } from '../../../interfaces/resource-result';
import { importScrapedData, ScrapedDataModels, ScrapedDataModelPart } from '../../../utils/data-importers';
import { ResourceTypes } from '../../../../sequelize/enums/resource-types';
const Flickr = require('flickr-sdk');

const FLICKR_PHOTO_ROOT_URL = 'https://www.flickr.com/photos/';
const PER_PAGE_COUNT = 500;
const EXTRA_OPTIONS =
  'description, date_upload, date_taken, owner_name, original_format, geo, tags, o_dims, url_sq, url_t, url_s, url_q, url_m, url_n, url_z, url_c, url_l, url_o';

export async function searchFlickrPhotos(searchObj: { [s: string]: any }) {
  const searchQueries = {
    per_page: PER_PAGE_COUNT,
    extras: EXTRA_OPTIONS,
    ...searchObj,
  };
  const flickr = new Flickr(process.env.FLICKR_APIKEY);
  const response = await flickr.photos.search(searchQueries);
  return response.body.photos;
}

export function convertToPhotoToObject(flickrPhoto): FlickrImageResource {
  const rootWebsiteUrl = FLICKR_PHOTO_ROOT_URL + flickrPhoto.owner.toString() + '/' + flickrPhoto.id.toString() + '/';
  return {
    id: flickrPhoto.id,
    website_url: rootWebsiteUrl,
    user_name: flickrPhoto.owner,
    title: flickrPhoto.title,
    describe: flickrPhoto.description,
    tags: flickrPhoto.tags,
    latitude: flickrPhoto.latitude,
    longitude: flickrPhoto.longitude,
    accuracy: flickrPhoto.accuracy,
    image_url:
      flickrPhoto.url_o ||
      flickrPhoto.url_l ||
      flickrPhoto.url_c ||
      flickrPhoto.url_z ||
      flickrPhoto.url_n ||
      flickrPhoto.url_m ||
      flickrPhoto.url_q ||
      flickrPhoto.url_s ||
      flickrPhoto.url_t ||
      flickrPhoto.url_sq,
  } as FlickrImageResource;
}

export async function searchFlickrPhotosToFlickerImageResources(searchObj: { [s: string]: any }): Promise<FlickrImageResource[]> {
  const searchFlickrImageResources: FlickrImageResource[] = [];
  const searchResult = await searchFlickrPhotos(searchObj);
  for (const photo of searchResult.photo) {
    searchFlickrImageResources.push(convertToPhotoToObject(photo));
  }

  return searchFlickrImageResources;
}

export async function allSearchAndImportFlickrPhotoData(keywordModels: any[]) {
  for (const keyword of keywordModels) {
    let page = 1;
    let totalPageCount = 0;
    do {
      const flickrPhotos = await searchFlickrPhotos({ text: keyword.word, page: page });
      page = flickrPhotos.page;
      totalPageCount = flickrPhotos.pages;
      const flickrImageResources = flickrPhotos.photo.map((flickrPhoto) => convertToPhotoToObject(flickrPhoto));
      const results: ScrapedDataModels = {};
      for (const flickrImageResource of flickrImageResources) {
        const scrapedData: ScrapedDataModelPart = {
          content: {
            service_type: keyword.service_type,
            title: flickrImageResource.title,
            website_url: flickrImageResource.website_url,
            service_content_id: flickrImageResource.id,
            service_user_id: flickrImageResource.user_id,
            service_user_name: flickrImageResource.user_name,
          },
          resource: {
            resource_type: ResourceTypes.image,
            url: flickrImageResource.image_url,
          },
          contentTags: flickrImageResource.tags.split(' '),
          geolocation: undefined,
        };
        if (
          flickrImageResource.latitude &&
          flickrImageResource.latitude != 0 &&
          flickrImageResource.longitude &&
          flickrImageResource.longitude != 0
        ) {
          scrapedData.geolocation = {
            latitude: flickrImageResource.latitude,
            longitude: flickrImageResource.longitude,
          };
        }
        results[flickrImageResource.image_url] = scrapedData;
      }
      await importScrapedData({ keywordModel: keyword, scrapedDataModels: results });
      page += 1;
    } while (page <= totalPageCount);
  }
}
