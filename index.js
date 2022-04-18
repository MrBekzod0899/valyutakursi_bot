const TelegramBot = require('node-telegram-bot-api')
const TOKEN = '5356615331:AAH_RfJqDYxNdyUMVXMU0cglQmfOuFtTonU'
const axios = require('axios')
const { options } = require('nodemon/lib/config')

const bot = new TelegramBot(TOKEN, {polling: true})

// bot.on('message',msg=>{     let {id}=msg.from     let {text}=msg
// axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${text}`)
// .then(data=>{         console.log(data.data[0].phonetics[0].audio)
// bot.sendMessage(id,data.data[0].meanings[0].synonyms[1])
// bot.sendAudio(id,data.data[0].phonetics[0].audio)     })     .catch(err=>{
//      bot.sendMessage(id,err)         console.log(err)     }) })
// bot.onText(/\/start/,msg=>{     let {last_name,first_name,id}=msg.from
// console.log(msg)     bot.sendMessage(id,'Ro`yhatdan tanlang',{
// reply_markup:{             resize_keyboard:true,
// one_time_keyboard:true,             keyboard:[                [
//   {                    text:'📍Location',
// request_location:true                 },                 {
//  text:'📱Contact',                     request_contact:true
// },                 'Username',                 'Info'                 ]
//       ]         }     }) }) bot.onText(/\/cat_order/,msg=>{     let {id}=
// msg.from     axios.get('https://api.thecatapi.com/v1/images/search')
// .then(res=>{         let {url}=res.data[0]         console.log(res.data[0])
//           bot.sendPhoto(id,url)     }) }) valyuta kursi

const URL = 'https://cbu.uz/uz/arkhiv-kursov-valyut/json/'

// bu bot valyuta kursini kurish uchun ishlatiladi

bot.onText(/\/start/, msg => {
  let {id, last_name, first_name, username} = msg.from
  bot.sendMessage(id, `Assalomu alaykum <a href='tg://user?id=${id}'> ${first_name} ${last_name} </a> botimizga xush kelibsiz`, {
    reply_markup: {
      resize_keyboard: true,
      one_time_keyboard: true,
        keyboard: [
        [
          {
            text: '💶EURO🇪🇺',
            callback_data: 'EUR'
          }, {
            text: '💵DOLLOR🇺🇸',
            callback_data: 'USD'
          }, {
            text: '💷FUNT🏴󠁧󠁢󠁥󠁮󠁧󠁿',
            callback_data: 'GBP'
          }, {
            text: '💴RUBL🇷🇺',
            callback_data: 'RUB'
          }
        ]
      ]
    },
    parse_mode:'HTML'
  })
})

bot.on('message',msg=>{
    let {id}=msg.from
    let {text}=msg
    if(text=='💶EURO🇪🇺') getMethod(id,'EUR')
    if(text=='💵DOLLOR🇺🇸') getMethod(id,'USD')
    if(text==='💷FUNT🏴󠁧󠁢󠁥󠁮󠁧󠁿') getMethod(id,'GBP')
    if(text==='💴RUBL🇷🇺') getMethod(id,'RUB')
    if(text!=='/start' && text!=='💶EURO🇪🇺' && text!=='💵DOLLOR🇺🇸' && text!=='💷FUNT🏴󠁧󠁢󠁥󠁮󠁧󠁿' && text!=='💴RUBL🇷🇺'){
        result(msg)
    }
})

function getMethod(id,info){
 const variable=
  {
    resize_keyboard: true,
    one_time_keyboard: true,
    inline_keyboard: [
      [
        {
          text: '❌',
          callback_data:`delete${info}`
        }, {
          text: '⬅️➡️',
          callback_data: `convert${info}`
        }
      ]
    ]
  }
 
  axios.get(URL)
        .then(res => {
        let moneyCash = res.data.filter(item => item.Ccy == info)
        if (moneyCash) {
            bot.sendMessage(id, `${moneyCash[0].Date} sanasiga ko'ra <b> 1 ${moneyCash[0].CcyNm_UZ} ${moneyCash[0].Rate} </b> so'mga teng `, {
                reply_markup:variable,
                parse_mode:'HTML'
            })
        }
    })
}

bot.on('callback_query', query => {
  let {id} = query.from
  let {message_id}=query.message
  let {chat_id}=query.message.from
  let {data} = query
  if(data.includes('delete')){
      bot.deleteMessage(id,message_id)
      bot.deleteMessage(id,message_id-1)
  }
  if(data.includes('convert')){
      bot.sendMessage(id,'raqam ko`rinishida qiymat kiriting: Masalan 100000')
  }
})

function result(msg){
        let {text}=msg
        let {id}=msg.from
        console.log()

        if((text/1342).toString() !== 'NaN'){
            let num=parseFloat(text)
            axios.get(URL)
                  .then(res => {
                  let moneyCash = res.data.filter((item,index) => index<4)
                  let text='' 
                  moneyCash.forEach((item,index)=>{
                      text+=`<b>${index+1}</b> ${num} so'm  <b><i>${(num/item.Rate).toFixed(4)}</i></b> ${item.CcyNm_UZ} ga teng  \n`
                  })
                  if (moneyCash) {
                      bot.sendMessage(id, `${text}`, {
                          parse_mode:'HTML'
                      })
                  }
            })   
        }
        else{
            bot.sendMessage(id,'raqam tipidagi ma`lumot kiriting')
        }
      
}
