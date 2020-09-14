const ytdl = require('ytdl-core');
const requireRoot = require('app-root-path').require;
const util = requireRoot('/libs/util');

exports.getInfoFromUrl = async function getInfoFromUrl(...urls) {
  const results = [];
  const youtubeInfos = await Promise.all(
    urls.flatMap((url) => {
      return ytdl.getInfo(url);
    }),
  );

  for (const youtubeInfo of youtubeInfos) {
    const maxSizeThumbnail = util.maxBy(
      youtubeInfo.player_response.videoDetails.thumbnail.thumbnails,
      (thumb) => thumb.width * thumb.height,
    );
    results.push({
      id: youtubeInfo.video_id.toString(),
      author: youtubeInfo.author,
      title: youtubeInfo.title,
      description: youtubeInfo.description,
      duration_millis: parseInt(youtubeInfo.length_seconds || '0') * 1000,
      thumbnail_image_url: maxSizeThumbnail.url,
      posted_date_time: youtubeInfo.published,
      keywords: youtubeInfo.player_response.videoDetails.keywords,
      videos: youtubeInfo.formats,
      related_videos: youtubeInfo.related_videos,
    });
  }
  return {
    videos: results,
  };
};
