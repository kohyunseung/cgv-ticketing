const {Builder, By, Key, until} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const readline = require('readline');

let id = '';
let pw = '';
let theater = '';
let date = '';
let movieCode = '';
let y = '';
let count = '';
let isNear = false;

let driver = null;

const readInfo = () => {
    const r = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })

    r.question('ID를 입력해주세요: ', (value) => {
        id = value;
        r.question('비밀번호를 입력해주세요: ', (value) => {
            pw = value;
             r.question('영화관을 입력해주세요: ', (value) => {
                 theater = value;
                //  ticketing();
                 r.question('상영일자를 입력해주세요(YYYYMMDD): ', (value) => {
                    date = value;
                    ticketing();
                    // r.question('영화를 입력해주세요: ', (value) => {
            //         movieCode = value;
            //         r.question('좌석 위치를 입력해주세요. (세로 기준 앞에서부터 1)', (value) => {
            //             y = value;
            //             r.question('매수를 입력해주세요.', (value) => {
            //                 count = value;
            //                 r.question('좌석이 붙어있어야 하나요?(y/n)', (value) => {
            //                     isNear = value;
            //                     r.close();
            //                     ticketing();
            //                 })
            //             })
            //         })
                 })
            })
        })
    })
}

const ticketing = async () => {
    console.log(id, pw, theater, movieCode, y, count, isNear)
    // headless로 크롬 드라이버 실행
    driver = await new Builder()
    .forBrowser('chrome')    
    .build();
    try{
        await login();
        await setTheater();
        await setDate();
    }
    catch(e){
        console.log(e);
        driver.quit();
    }
}

const login = async () => {
    await driver.get('https://cgv.co.kr')
    let loginButton = await driver.findElement(By.css('.memberInfo_wrap > li'))
    await loginButton.click();
    let inputId = await driver.findElement({id: 'txtUserId'})
    inputId.sendKeys(id)
    let inputPw = await driver.findElement({id: 'txtPassword'})
    inputPw.sendKeys(pw)
    let submitButton = await driver.findElement({id: 'submit'})
    submitButton.click()
    await driver.wait(until.elementLocated(By.css('.video_wrap')), 30000)
}

const setTheater = async () => {
    await driver.navigate().to('https://cgv.co.kr/theater')
    let theaterButton = await driver.findElement(By.css(`a[title="${theater}"]`))
    theaterButton.click()
}

const setDate = async () => {
    await driver.wait(until.elementLocated(By.id('ifrm_movie_time_table')), 30000)
    driver.executeScript(`document.getElementById("ifrm_movie_time_table").src = document.getElementById("ifrm_movie_time_table").src.replace(document.getElementById("ifrm_movie_time_table").src.slice(-8), "${date}")`)
}

readInfo();