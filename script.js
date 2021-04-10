
const pup = require("puppeteer");
let specs = require("./newscript");
let cmds = process.argv.slice(2);
console.log(cmds);
let data =[];
let links = [];
if(cmds[0]=="phones" || cmds[0]=='phone'){
    main1(cmds[2]);
}else if(cmds[0]=="popular"){
    main3(cmds[0]);
}else{
    let companyName = cmds[0];
    main2(companyName);
}
/* Three functions based on inputs , covering:
  1. phone around [price-bracket] upto 40000, ex: phone around 25000; main1 function,
  2. top [company-Name] phones  : apple, samsung; main2 function,
  3. popular phones : popular; main3 function */

async function main1(price){
    let browser  = await pup.launch({
        headless:false,
        defaultViewport:false,
        args:["--start-maximized"]
    });
    let pages = await browser.pages();
    let tab = pages[0];
    await tab.goto(`https://www.91mobiles.com/top-10-mobiles-below-${price}-in-india`);
    await tab.waitForSelector(".finder_snipet_wrap",{visible:true});
    let phones =  await tab.$$(".finder_snipet_wrap a.hover_blue_link.name.gaclick")
    // console.log(phones.length);
    for(let i of phones){
        let phone = await tab.evaluate(function(ele){
             return ele.textContent;
        },i); 
        data.push(phone);
        
    }
    for(let i of phones){
        let phone = await tab.evaluate(function(ele){
            return ele.getAttribute("href");
        },i); 
        links.push(phone);   
    }
    // getting all the smartPhones in a range;
    data=data.slice(0,7);
    specs(data,links);
    // data.slice(5);
    // console.log(data);
    // console.log(links);
}
async function main2(companyName,price){
    let browser  = await pup.launch({
        headless:false,
        defaultViewport:false,
        args:["--start-maximized"]
    });
    let pages = await browser.pages();
    let tab = pages[0];
    await tab.goto(`https://www.91mobiles.com/top-10-${companyName}-mobiles-in-india`);
    await tab.waitForSelector(".finder_snipet_wrap",{visible:true});
    let phones =  await tab.$$(".finder_snipet_wrap a.hover_blue_link.name.gaclick")
    // console.log(phones.length);
    for(let i of phones){
        let phone = await tab.evaluate(function(ele){
             return ele.textContent;
        },i); 
        data.push(phone);
    }
    for(let i of phones){
        let phone = await tab.evaluate(function(ele){
            return ele.getAttribute("href");
        },i); 
        links.push(phone);
        
    }
    // getting all the smartPhones of a particular company
    data=data.slice(0,7);
    console.log(data);
    specs(data,links);
   // data.slice(5);
   // console.log(data);
   // console.log(links);
}
async function main3(popular){
    let browser  = await pup.launch({
        headless:false,
        defaultViewport:false,
        args:["--start-maximized"]
    });
    let pages = await browser.pages();
    let tab = pages[0];
    await tab.goto(`https://www.91mobiles.com/top-10-oppo-mobiles-in-india`);
    await tab.waitForSelector(".top_mobiles_ul_width",{visible:true});
    let phones = await tab.$$(".right.top_mobiles_ul_li_right a");
    let ratings = await tab.$$(".right.top_mobiles_ul_li_right span.rating_box_new_list_small");
    
   // console.log(phones.length);
    for(let i of phones){
        let phone = await tab.evaluate(function(ele){
             return ele.textContent;
        },i); 
        data.push(phone);
    }
    for(let i of phones){
        let phone = await tab.evaluate(function(ele){
             return ele.getAttribute("href");
        },i); 
        links.push(phone);
    }
    let dataRating=[];
    for(let i of ratings){
        let phoneRating = await tab.evaluate(function(ele){
             return ele.textContent;
        },i); 
        dataRating.push(phoneRating);
    }
    let linkData = [];
    let finalData = [];
    let j=0;
    for(let i =0 ;i < data.length;i++){
        if(parseInt(dataRating[i])>85){
            finalData[j]=data[i];
            linkData[j] = links[i];
            j++;
        }
    }
  // getting all the popular phones;
  //  console.log(finalData);
  //  console.log(linkData);
    specs(finalData,linkData);

}






