import { Builder, Capabilities, By, WebDriver } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';

interface Iresult {
  id?: number;
  movieName?: string;
  titleEng?: string;
  ratings?: string | undefined;
  synopsis?: string;
  thumb?: string;
}

class crawlerUtil {
  private REGEXFORRATINGS: RegExp;
  private REGEXFORTHUMB: RegExp;
  constructor() {
    this.REGEXFORRATINGS = /(?<=\|\s)\d{0,2}\W{2,4}(?:관람가)|청소년관람불가/g;
    this.REGEXFORTHUMB = /(?<=\(").*(?=")/g;
  }

  sleep = (ms: number) => {
    return new Promise((resolve) =>
      setTimeout(() => {
        resolve(ms);
      }, ms),
    );
  };

  goto(driver: WebDriver, url: string) {
    driver.navigate().to(url);
  }

  movieRatingCrawler = async(driver: WebDriver, result: Iresult, movieId: number, movieName: string): Promise<void> => {
    try {
    const movieInfoUrl = `https://search.daum.net/search?nil_suggest=btn&w=tot&DA=SBC&q=영화+${movieName}`

    this.goto(driver, movieInfoUrl);
    await this.sleep(2000);

    result.ratings = (await driver.findElement(By.css('.wid_n > .coll_cont > .mg_cont > .info_movie > .wrap_cont > dl:nth-child(2) > dd:nth-child(2)')).getText()).trim().match(this.REGEXFORRATINGS)?.toString();
    } catch (err) {
      console.log(`rating, movieId: ${movieId}, movieName: ${movieName}, Element not found`);
    }
  }

  moviesynopsisCrawler = async(driver: WebDriver, result: Iresult, movieId: number, movieName: string): Promise<void>  => {
    try {
    const synopsisUrl = (await driver.findElement(By.css('.wid_n > .coll_cont > .mg_cont > .info_movie > .wrap_thumb > .thumb')).getAttribute('href'));

    this.goto(driver, synopsisUrl);
    await this.sleep(2000);

    result.synopsis = (await driver.findElement(By.css('.desc_cont')).getAttribute('innerHTML'));
    } catch (err) {
      console.log(`synopsis, movieId: ${movieId}, movieName: ${movieName}, Element not found`);
    }
  }

  movieThumbUrlCrawler = async(driver: WebDriver, result: Iresult, movieId: number, movieName: string): Promise<void>  => {
    try {
    await this.sleep(2000);

    result.thumb = (await driver.findElement(By.css('span.bg_img')).getAttribute('style')).match(this.REGEXFORTHUMB)?.toString();
    } catch (err) {
      console.log(`thumbUrl, movieId: ${movieId}, movieName: ${movieName}, Element not found`);
      result.thumb = undefined;
    }
  }

  crawler = async(movieId:number, movieName: string | null) => {
    if (!movieName) throw new Error("movieName is not defined, crawlerUtil.crawler()");

    const result: Iresult = {};

    const capabilities = Capabilities.chrome();
    const options = new chrome.Options();
    options.addArguments('--headless');
    capabilities.set('chromeOptions', {
      'args': ['--no-sandbox', '--disable-dev-shm-usage', '--headless'],
    });
    const driver = await new Builder().withCapabilities(capabilities).build();

    result.id = movieId;
    result.movieName = movieName;
    await this.movieRatingCrawler(driver, result, movieId, movieName);
    await this.moviesynopsisCrawler(driver, result, movieId, movieName);
    await this.movieThumbUrlCrawler(driver, result, movieId, movieName);

    await this.sleep(4000);
    await driver.quit();

    return result;
  }
}

export {
  crawlerUtil,
  Iresult
}

