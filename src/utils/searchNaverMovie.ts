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
    const movieInfoUrl = "https://search.naver.com/search.naver?sm=tab_hty.top&where=nexearch&query=벤자민+버튼의+시간은+거꾸로+간다+정보&oquery=영화+벤자민+버튼의+시간은+거꾸로+간다+정보&tqi=iZqsWlprvmZssv4pgeNssssssi0-186988"
    const moviePhotoUrl = "https://search.naver.com/search.naver?sm=tab_hty.top&where=nexearch&query=벤자민+버튼의+시간은+거꾸로+간다+포토&oquery=벤자민+버튼의+시간은+거꾸로+간다+포토&tqi=iZqvRsprvhGssPTIeKRssssst3w-370162"

    function goto(url: string) {
        driver.navigate().to(url);
    }

    goto(movieInfoUrl)
    const result: {titleEng?: string; ratings?: string, info?: string, thumbnail?: string} = {};
    result.titleEng = (await driver.findElement(By.css('.sub_title > span:nth-child(3)')).getText()); 
    console.log(result)

    // 상영 등급
    // document.querySelector('.info.txt_4 > div:nth-child(2) > dd').textContent;    
    result.ratings = (await driver.findElement(By.css('.info.txt_4 > div:nth-child(2) > dd')).getText())
    console.log(result)

    // 영화 소개
    // document.querySelector('.text._content_text').textContent;
    result.info = (await driver.findElement(By.css('.text._content_text')).getText())
    console.log(result)


    goto(moviePhotoUrl)
    await sleep(5000)
    
    // 썸네일
    // document.querySelector('._image_base_poster > div > div > div > div > div > ul > li:nth-child(1) > a > img').getAttribute('src');
    result.thumbnail = (await driver.findElement(By.css('[class*=image_base_poster] li:first-child img')).getAttribute('src'));
    console.log(result)
       

    await driver.quit();
  }


crawler();


