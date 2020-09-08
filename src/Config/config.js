import axios from 'axios';

const ApiDefault = {
	key: 'RGAPI-06367617-241d-4d6b-a14e-01eff285e3eb',
};

const Url = `/lol/summoner/v4/summoners`;

export const getUserByName = (name) => {
	return new Promise(async (resolve, reject) => {
		const summonerUrl = `${Url}/by-name/${name}?api_key=${ApiDefault.key}`;

		try {
			const result = await axios(summonerUrl);

			resolve(result);
		} catch (error) {
			reject(error);
		}
	});
};
