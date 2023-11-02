const {SlashCommandBuilder, EmbedBuilder, SlashCommandStringOption  } = require('discord.js');
const registerModule = require('./RegisterModule.js')
const CheckStatusModule = require('./CheckStatusModule.js')
const lich = require('./')


const InfoCommand = {
    data: new SlashCommandBuilder()
            .setName('сервер_инфо')
            .setDescription("информация о сервере и важные ссылки.")
    ,
    async execute(interaction){
        const test = new EmbedBuilder()
        .setColor("Aqua")
        .setAuthor({name:'WoW 3.3.5 server',
         iconURL:'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/26f6931d-1e6a-42a6-aa5d-570af97ff567/d8b63w1-c56a1118-92f3-4976-8d70-f138cf870525.png/v1/fill/w_868,h_921,q_70,strp/baby_murlock_by_fettmajs_d8b63w1-pre.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MTA4NyIsInBhdGgiOiJcL2ZcLzI2ZjY5MzFkLTFlNmEtNDJhNi1hYTVkLTU3MGFmOTdmZjU2N1wvZDhiNjN3MS1jNTZhMTExOC05MmYzLTQ5NzYtOGQ3MC1mMTM4Y2Y4NzA1MjUucG5nIiwid2lkdGgiOiI8PTEwMjQifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.vW8jcXLUv8F6dChZP8qgBTUkHwEg51D9SDM4N9LWBZI',
        })
        .setTitle('Информация о сервере:')
        .setDescription('Здесь находится основная информация о нашем сервере.')
        .setImage('https://i.ytimg.com/vi/BCr7y4SLhck/maxresdefault.jpg')
        .addFields(
	    {name:'Чистый клиент можно скачать тут', value:'[Wraith of Lich King 3.3.5](https://wowdl.net/client/World-of-Warcraft-3.3.5a.12340-ruRU)'},
            {name:'Версия сервера', value:'Wraith of Lich King 3.3.5'},
            {name:'Ссылка для скачивания патча', value:'[google drive](https://drive.google.com/file/d/1-lJt8SRcXyO7yY9AV0TxGFZ6rS8IJDuv/view?usp=sharing)'},
            {name:'Set realmlist', value:'95.182.110.19'},
            {name:'Для регистрации аккаунта используйте комманду', value:'/регистрация'},
        )
        
        await interaction.reply({ embeds: [test] })
    }

}

const RegisterCommand = {
    data: new SlashCommandBuilder()
        .setName('регистрация')
        .setDescription("Регистрация нового аккаунта на сервере с Логином и Паролем.")
        .addStringOption(option => option.setName("логин").setRequired(true).setDescription("логин для аккаунта"))
        .addStringOption(option => option.setName("пароль").setRequired(true).setDescription("пароль для аккаунта"))      
    ,
    async execute(interaction){
        let pass = interaction.options.getString('пароль');
        let name = interaction.options.getString('логин');
        registerModule.registerAccount(name, pass, async (err, message)=>{
            if(err){
                await interaction.reply("Произошла ошибка!");
            }
            else{
                //await interaction.deleteReply();
                await interaction.user.send("Вы зарегистрировались под ником " + name + " и паролем - " + pass);
		        await interaction.channel.send(interaction.user.displayName + ", ваша регистрация завершена!");
            }
        });
    }
}

const CheckOnline = {
    data: new SlashCommandBuilder()
    .setName('онлайн')
    .setDescription('информация о статусе сервера')
    ,
    async execute(interaction){
        CheckStatusModule.doTheStatusCheck(async(err,result)=>{
            if(err){
                await interaction.reply("Произошла ошибка!")
            }
            else{
                await interaction.reply(`Сейчас онлайн ${result} игроков!`)
            }
        })
    }
}

module.exports = {InfoCommand,RegisterCommand,CheckOnline}