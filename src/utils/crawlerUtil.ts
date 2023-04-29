import { Builder, Capabilities, By, ThenableWebDriver } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';
import { Request, Response } from 'express';

// const sleep = (ms: number) => {
//   return new Promise((resolve) =>
//     setTimeout(() => {
//       resolve(ms);
//     }, ms),
//   );
// };

class crawlerUtil {
  private capabilities: Capabilities;
  private options: chrome.Options;
  private driver: ThenableWebDriver;
  private result: {titleEng?: string; ratings?: string, synopsis?: string, thumb?: string} = {};
  private REGEXFORRATINGS: RegExp;
  private REGEXFORTHUMB: RegExp;
  constructor() {
    this.capabilities = Capabilities.chrome();
    this.options = new chrome.Options();
    this.options.addArguments('--headless');
    this.capabilities.set('chromeOptions', {
      'args': ['--no-sandbox', '--disable-dev-shm-usage', '--headless'],
    });
    this.driver = new Builder().withCapabilities(this.capabilities).build();
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

  goto(url: string) {
    this.driver.navigate().to(url);
  }

  movieRatingCrawler = async(movieName: string): Promise<void> => {
    const movieInfoUrl = `https://search.daum.net/search?nil_suggest=btn&w=tot&DA=SBC&q=영화+${movieName}`

    this.goto(movieInfoUrl);
    this.result.ratings = (await this.driver.findElement(By.css('.wid_n > .coll_cont > .mg_cont > .info_movie > .wrap_cont > dl:nth-child(2) > dd:nth-child(2)')).getText()).trim().match(this.REGEXFORRATINGS)?.toString();
  }

  moviesynopsisCrawler = async(): Promise<void>  => {
    const synopsisUrl = (await this.driver.findElement(By.css('.wid_n > .coll_cont > .mg_cont > .info_movie > .wrap_cont > dl:nth-child(5) > .cont > .f_more')).getAttribute('href'));

    this.goto(synopsisUrl);
    await this.sleep(2000);

    this.result.synopsis = (await this.driver.findElement(By.css('.desc_cont')).getAttribute('innerHTML'));
  }

  movieThumbUrlCrawler = async(): Promise<void>  => {
    // const thumbUrl = (await this.driver.findElement(By.css('.wid_n > .coll_cont > .mg_cont > .info_movie > .wrap_thumb > .thumb')).getAttribute('href'));

    // this.goto(thumbUrl);
    await this.sleep(2000);

    this.result.thumb = (await this.driver.findElement(By.css('span.bg_img')).getAttribute('style')).match(this.REGEXFORTHUMB)?.toString();
  }

  crawler = async(movieName: string) => {
    console.log(movieName)
    await this.movieRatingCrawler(movieName);
    await this.moviesynopsisCrawler();
    await this.movieThumbUrlCrawler();
    console.log(this.result);

    await this.sleep(4000);
    await this.driver.quit();

    return this.result;
  }
}

// crawler = async(req: Request, res: Response): Promise<void> => {
//   const capabilities = Capabilities.chrome();
//   const options = new chrome.Options();
//   options.addArguments('--headless');
//   capabilities.set('chromeOptions', {
//     'args': ['--no-sandbox', '--disable-dev-shm-usage', '--headless'],
//   });
//   const driver = await new Builder().withCapabilities(capabilities).build();
//   const movieInfoUrl = "https://search.daum.net/search?nil_suggest=btn&w=tot&DA=SBC&q=영화+롱디"
//   const result: {titleEng?: string; ratings?: string, synopsis?: string, thumb?: string} = {};

//   function goto(url: string) {
//     driver.navigate().to(url);
//   }

//   goto(movieInfoUrl)
//   result.ratings = (await driver.findElement(By.css('.wid_n > .coll_cont > .mg_cont > .info_movie > .wrap_cont > dl:nth-child(2) > dd:nth-child(2)')).getText()).trim().match(this.REGEXFORRATINGS)?.toString();
//   console.log(result);

//   await driver.quit();
// }
// }

// async function crawler(req: Request, res: Response): Promise<void> {
    // const capabilities = Capabilities.chrome();
    // const options = new chrome.Options();
    // options.addArguments('--headless');
    // capabilities.set('chromeOptions', {
    //   'args': ['--no-sandbox', '--disable-dev-shm-usage', '--headless'],
    // });
    // const driver = await new Builder().withCapabilities(capabilities).build();
    // const movieInfoUrl = "https://search.daum.net/search?nil_suggest=btn&w=tot&DA=SBC&q=영화+롱디"

    // function goto(url: string) {
    //     driver.navigate().to(url);
    // }

    // goto(movieInfoUrl)
    // const result: {titleEng?: string; ratings?: string, synopsis?: string, thumb?: string} = {};
    // 영어 제목
    // result.titleEng = (await driver.findElement(By.css('.sub_title > span:nth-child(3)')).getText()); 
    // console.log(result)

    // 상영 등급
    // document.querySelector('.wid_n > .coll_cont > .mg_cont > .info_movie > .wrap_cont > dl:nth-child(2) > dd:nth-child(2)').textContent; 
    // const REGEXFORRATINGS = /(?<=\|\s)\d{0,2}\W{2,4}(?:관람가)|청소년관람불가/g;
    // result.ratings = (await driver.findElement(By.css('.wid_n > .coll_cont > .mg_cont > .info_movie > .wrap_cont > dl:nth-child(2) > dd:nth-child(2)')).getText()).trim().match(REGEXFORRATINGS)?.toString();


    // 영화 소개
    // document.querySelector('.wid_n > .coll_cont > .mg_cont > .info_movie > .wrap_cont > dl:nth-child(5) > .cont > .f_more').getAttribute('href');
    // const synopsisUrl = (await driver.findElement(By.css('.wid_n > .coll_cont > .mg_cont > .info_movie > .wrap_cont > dl:nth-child(5) > .cont > .f_more')).getAttribute('href'));

    // goto(synopsisUrl)
    // await sleep(2000);

    // // document.querySelector('.desc_cont').innerHTML;
    // result.synopsis = (await driver.findElement(By.css('.desc_cont')).getAttribute('innerHTML'))

    // // 썸네일
    // goto(movieInfoUrl)
    // await sleep(2000);
    // // document.querySelector('.wid_n > .coll_cont > .mg_cont > .info_movie > .wrap_thumb > .thumb').getAttribute('href');
    // const thumbUrl = (await driver.findElement(By.css('.wid_n > .coll_cont > .mg_cont > .info_movie > .wrap_thumb > .thumb')).getAttribute('href'));

    // goto(thumbUrl)
    // await sleep(2000);

    // // document.querySelector('span.bg_img').getAttribute('style');
    // const REGEXFORTHUMB = /(?<=\(").*(?=")/g
    // result.thumb = (await driver.findElement(By.css('span.bg_img')).getAttribute('style')).match(REGEXFORTHUMB)?.toString();

    // await driver.quit();

    // res.status(200).json({ data: result });
  // }

export {
  crawlerUtil,
}

