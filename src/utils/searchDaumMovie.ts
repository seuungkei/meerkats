import { Builder, Capabilities, By } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome';

const sleep = (ms: number) => {
    return new Promise((resolve) =>
      setTimeout(() => {
        resolve(ms);
      }, ms),
    );
  };
  

async function crawler(): Promise<void> {
    const capabilities = Capabilities.chrome();
    const options = new chrome.Options();
    options.addArguments('--headless');
    capabilities.set('chromeOptions', {
      'args': ['--no-sandbox', '--disable-dev-shm-usage', '--headless'],
    });
    const driver = await new Builder().withCapabilities(capabilities).build();
    const movieInfoUrl = "https://search.daum.net/search?nil_suggest=btn&w=tot&DA=SBC&q=영화+겨울왕국"

    function goto(url: string) {
        driver.navigate().to(url);
    }

    goto(movieInfoUrl)
    const result: {titleEng?: string; ratings?: string, synopsis?: string, thumbnail?: string} = {};
    // 영어 제목
    // result.titleEng = (await driver.findElement(By.css('.sub_title > span:nth-child(3)')).getText()); 
    // console.log(result)

    // 상영 등급
    // REGEX 필요함!!
    // document.querySelector('.wid_n > .coll_cont > .mg_cont > .info_movie > .wrap_cont > dl:nth-child(2) > dd:nth-child(2)').textContent; 
    result.ratings = (await driver.findElement(By.css('.wid_n > .coll_cont > .mg_cont > .info_movie > .wrap_cont > dl:nth-child(2) > dd:nth-child(2)')).getText()).trim().split('|')[2];
    console.log(result)

    // 영화 소개
    // document.querySelector('.wid_n > .coll_cont > .mg_cont > .info_movie > .wrap_cont > dl:nth-child(5) > .cont > .f_more').getAttribute('href');
    const synopsisUrl = (await driver.findElement(By.css('.wid_n > .coll_cont > .mg_cont > .info_movie > .wrap_cont > dl:nth-child(5) > .cont > .f_more')).getAttribute('href'));

    goto(synopsisUrl)
    await sleep(2000);

    // document.querySelector('.desc_cont').innerHTML;
    result.synopsis = (await driver.findElement(By.css('.desc_cont')).getAttribute('innerHTML'))
    // console.log(result)

    // 썸네일
    goto(movieInfoUrl)
    await sleep(2000);
    // document.querySelector('.wid_n > .coll_cont > .mg_cont > .info_movie > .wrap_thumb > .thumb').getAttribute('href');
    const thumbUrl = (await driver.findElement(By.css('.wid_n > .coll_cont > .mg_cont > .info_movie > .wrap_thumb > .thumb')).getAttribute('href'));

    goto(thumbUrl)
    await sleep(2000);

    // document.querySelector('span.bg_img').getAttribute('style');
    result.thumbnail = (await driver.findElement(By.css('span.bg_img')).getAttribute('style'));
    console.log(result)
    

    // document.querySelector('._image_base_poster > div > div > div > div > div > ul > li:nth-child(1) > a > img').getAttribute('src');
    // result.thumbnail = (await driver.findElement(By.css('[class*=image_base_poster] li:first-child img')).getAttribute('src'));
    // console.log(result)
       

    await driver.quit();
  }


crawler();


