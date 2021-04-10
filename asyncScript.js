require("chromedriver");
const fs= require("fs");
let wd = require("selenium-webdriver");
let browser = new wd.Builder().forBrowser('chrome').build();

let specifications = ["performance","display","camera","battery","usersRating","websiteRating","price"];
let percentage = ["performanceScore","displayScore","cameraScore","batteryScore"];
let finalData = {};
async function main5(data,links){
    let promises = [];
    for(let i=0 ;i <data.length;i++){
       promises.push(main6(data,i,links));
    }
    await Promise.all(promises);
    fs.writeFileSync("phonesData.json",JSON.stringify(finalData));
}
async function main6(data,i,links){
    let browser = new wd.Builder().forBrowser('chrome').build();
    let phoneName = data[i];

        phoneName=phoneName.replace(/\s/g,"-");
        finalData[phoneName]={};
       // console.log(phoneName);
        await browser.get("https://www.91mobiles.com/"+links[i]);
        await browser.wait(wd.until.elementLocated(wd.By.css(".specsTable")));
        let containers = await browser.findElements(wd.By.css(".specs_ul"));
     //   console.log(containers.length);
        for(let j=0 ; j < containers.length ;j++){
            let block = await containers[j].findElements(wd.By.css("label")); 
            let spec = []
            for(let k =0 ; k < block.length ;k++){
                let description  = await block[k].getAttribute("innerText");
                spec.push(description);
            }
           // console.log(spec);
           
            finalData[phoneName][specifications[j]]=spec;
        }
        let perc = await browser.findElements(wd.By.css(".specs_ul div.mtr_bar_div.expand div"));
       
        for(let it=  0; it< perc.length ; it++){
            let ans = await (await perc[it].getAttribute("style")).toString();
            let lines = ans.split(" ");
           // console.log(parseInt(lines[1]));
           finalData[phoneName][percentage[it]] = parseInt(lines[1]);
            
        }
        let ratings = await browser.findElements(wd.By.css(".top_box  span.ratpt"));
        for(let r =0 ; r<ratings.length;r++){
            let ans = await (await ratings[r].getAttribute("innerText"));
            finalData[phoneName][specifications[r+4]]=ans;
        }
        let pricing = await browser.findElements(wd.By.css("div[data-store]"));
        let q =0 ;
        finalData[phoneName][specifications[6]]={};
        let dec = Math.min(3,pricing.length);
        for(let p =0 ; p < dec ; p++){
            let onlineStore = await pricing[p].getAttribute("data-store");

            let arr = [];
            console.log(onlineStore);
            let price = await pricing[p].getAttribute("data-price");
            if(price==null){
                continue;
            }
            price="Rs." + price;
            arr.push(price);
            console.log(price);
            
            let link = await pricing[p].findElement(wd.By.css(".priclist_lft .prclst_strN span"));
            let realLink = await link.getAttribute("data-href-url");
            realLink = "https://www.91mobiles.com"+realLink;
            console.log(realLink);
            arr.push(realLink);
            console.log(arr);
          finalData[phoneName][specifications[6]][onlineStore] = arr;
        }
        console.log(finalData); 
}
  module.exports= main5;

