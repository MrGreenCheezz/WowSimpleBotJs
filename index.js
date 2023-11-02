const registerModule = require("./RegisterModule")
const discord = require('discord.js');
const { REST, Routes, Client, GatewayIntentBits,Events } =  require('discord.js');
const command = require("./Commands.js")
const dicsordBot = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
const botToken = "NDI0MzIyMDM5MzI3ODgzMjY2.GqW8iw.BSItCly7fu6lJdP_xpLya2CDfp14DUJ0tbcaTQ";

const rest = new REST().setToken(botToken);

const commands = [
   command.InfoCommand.data.toJSON(),
   command.RegisterCommand.data.toJSON(),
   command.CheckOnline.data.toJSON()
];

(async () => {
	try {
		console.log(`Started refreshing commands application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationCommands("424322039327883266"),
			{ body: commands },
		);

		console.log(`Successfully reloaded  application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();



dicsordBot.once(Events.ClientReady, e => {
    console.log("Bot started!")
})

// and deploy your commands!
dicsordBot.on("messageCreate",msg =>{
    if(msg.content.toLowerCase() === "test"){
        msg.channel.send("lol")
    }
})

dicsordBot.on(Events.InteractionCreate, async interaction =>{
if(!interaction.isChatInputCommand()) return;
    if(interaction.commandName === command.InfoCommand.data.name){
        try{
            if(interaction.channelId === "1162433195753607299"){
                await command.InfoCommand.execute(interaction);
                
            }
            else{
                return;
            }
        }
        catch{
            console.log("erorr")
        }
    }
    if(interaction.commandName === command.RegisterCommand.data.name){
        try{
            if(interaction.channelId === "1162433195753607299"){
            await command.RegisterCommand.execute(interaction);
            }
            else{
                return;
            }
            
        }
        catch{
            console.log("erorr")
        }
    }
    if(interaction.commandName === command.CheckOnline.data.name){
        try{
            if(interaction.channelId === "1162433195753607299"){
            await command.CheckOnline.execute(interaction);
            }
            else{
                return;
            }
        }
        catch{
            console.log("erorr")
        }
    }
})

dicsordBot.login(botToken);