import { Builder, Capabilities, By, ThenableWebDriver } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';
import { Request, Response } from 'express';

const sleep = (ms: number) => {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve(ms);
    }, ms),
  );
};

async function crawler(movieName: string): Promise<void> {
    const capabilities = Capabilities.chrome();
    const options = new chrome.Options();
    options.addArguments('--headless');
    capabilities.set('chromeOptions', {
      'args': ['--no-sandbox', '--disable-dev-shm-usage', '--headless'],
    });
    const driver = await new Builder().withCapabilities(capabilities).build();
    const movieInfoUrl = `https://search.daum.net/search?nil_suggest=btn&w=tot&DA=SBC&q=영화+${movieName}`

    function goto(url: string) {
        driver.navigate().to(url);
    }

    goto(movieInfoUrl)
    await sleep(2000);
    const result: {movieName?: string, titleEng?: string; ratings?: string, synopsis?: string, thumb?: string} = {};
    result.movieName = movieName;

    // 상영 등급
    // document.querySelector('.wid_n > .coll_cont > .mg_cont > .info_movie > .wrap_cont > dl:nth-child(2) > dd:nth-child(2)').textContent; 
    const REGEXFORRATINGS = /(?<=\|\s)\d{0,2}\W{2,4}(?:관람가)|청소년관람불가/g;
    result.ratings = (await driver.findElement(By.css('.wid_n > .coll_cont > .mg_cont > .info_movie > .wrap_cont > dl:nth-child(2) > dd:nth-child(2)')).getText()).trim().match(REGEXFORRATINGS)?.toString();;
    // console.log(result)


    // 영화 소개
    // document.querySelector('.wid_n > .coll_cont > .mg_cont > .info_movie > .wrap_cont > dl:nth-child(5) > .cont > .f_more').getAttribute('href');
    // const synopsisUrl = (await driver.findElement(By.css('.wid_n > .coll_cont > .mg_cont > .info_movie > .wrap_cont > dl:nth-child(5) > .cont > .f_more')).getAttribute('href'));
    const synopsisUrl = (await driver.findElement(By.css('.wid_n > .coll_cont > .mg_cont > .info_movie > .wrap_thumb > .thumb')).getAttribute('href'));

    goto(synopsisUrl)
    await sleep(2000);

    // document.querySelector('.desc_cont').innerHTML;
    result.synopsis = (await driver.findElement(By.css('.desc_cont')).getAttribute('innerHTML'))
    // console.log(result)

    // 썸네일
    // goto(movieInfoUrl)
    // await sleep(2000);
    // document.querySelector('.wid_n > .coll_cont > .mg_cont > .info_movie > .wrap_thumb > .thumb').getAttribute('href');
    // const thumbUrl = (await driver.findElement(By.css('.wid_n > .coll_cont > .mg_cont > .info_movie > .wrap_thumb > .thumb')).getAttribute('href'));

    // goto(thumbUrl)
    // await sleep(2000);

    // document.querySelector('span.bg_img').getAttribute('style');
    const REGEXFORTHUMB = /(?<=\(").*(?=")/g
    result.thumb = (await driver.findElement(By.css('span.bg_img')).getAttribute('style')).match(REGEXFORTHUMB)?.toString();
    console.log(result)

    await driver.quit();

  }

  // crawler()

export {
  // crawlerUtil,
  crawler
}