import Dotenv from "dotenv";
Dotenv.config();
import Bull from "bull";
import page from "../adapters/page";

const queue = new Bull("header", process.env.REDIS as string);

queue.process(2, async (job, done) => {
  const data = job.data;
  switch (data.type) {
    case "header":
      await page.updateHeader(
        data.data.state,
        data.data.city,
        data.data.image,
        data.data.title
      );
      break;
    case "zips":
      await page.updateZips(data.data.state, data.data.city, data.data.zips);
      break;
    case "faqs":
      await page.updateFaqs(data.data.state, data.data.city, data.data.faqs);
      break;
    case "reviews":
      await page.updateReviews(
        data.data.state,
        data.data.city,
        data.data.reviews
      );
      break;
    case "embedded":
      await page.updateembeddedVideos(
        data.data.state,
        data.data.city,
        data.data.embedded
      );
      break;
    case "attorney":
      await page.updateAttorney(
        data.data.state,
        data.data.city,
        data.data.attorney
      );
      break;
    case "articles":
        await page.updateArticles(
          data.data.state,
          data.data.city,
          data.data.articles
          );
      break;
      case "attorney_click":
        await page.updateAttorneyClick(
          data.data.state,
          data.data.city,
          data.data.cid
        );
        break;
    default:
      break;
  }

  return done(undefined, true);
});

export default queue;
