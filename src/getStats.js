// const axios = require('axios');
const initialArray = require('./initialArray');
// const rateLimit = require('axios-rate-limit');
// const wait = require('util').promisify(setTimeout);

module.exports = async (interaction) => {
	console.log('initail Array:', initialArray);
	await interaction.editReply('edited yo!');
};
