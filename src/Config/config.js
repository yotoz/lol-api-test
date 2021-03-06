import React, { useState, createContext } from 'react';

import axios from 'axios';

const ApiDefault = {
	key: 'RGAPI-06367617-241d-4d6b-a14e-01eff285e3eb',
};

const Url = `/lol`;
export const ddragonUrl = `https://ddragon.leagueoflegends.com`;

export const getLastestVersion = () => {
	return new Promise(async (resolve, reject) => {
		const versionUrl = `${ddragonUrl}/api/versions.json`;

		try {
			const version = await axios(versionUrl);

			resolve(version.data[0]);
		} catch (error) {
			reject(error);
		}
	});
};

export const STATE_CODE = {
	0: 'unrequest',
	1: 'loading',
	2: 'get user data fail',
	3: 'get match data fail',
	999: 'success',
};

export const getUserByName = (name) => {
	return new Promise(async (resolve, reject) => {
		const summonerUrl = `${Url}/summoner/v4/summoners/by-name/${name}?api_key=${ApiDefault.key}`;

		try {
			const result = await axios(summonerUrl);

			resolve(result);
		} catch (error) {
			reject(error);
		}
	});
};

export const getMatchByAccountId = (accountId) => {
	return new Promise(async (resolve, reject) => {
		const matchUrl = `${Url}/match/v4/matchlists/by-account/${accountId}?api_key=${ApiDefault.key}`;

		try {
			const result = await axios(matchUrl);

			resolve(result);
		} catch (error) {
			reject(error);
		}
	});
};

const getChampionName = (championId) => {
	return new Promise(async (resolve, reject) => {
		try {
			const lastestVersion = await getLastestVersion();

			const championNameUrl = `${ddragonUrl}/cdn/${lastestVersion}/data/ko_KR/champion.json`;
			const championName = await axios(championNameUrl);

			Object.values(championName.data.data).forEach((e) => {
				if (e.key === championId + '') {
					resolve(e.name);
				}
			});

			throw 'champion not found';

			// resolve(championName.data.data);
		} catch (error) {
			reject(error);
		}
	});
};

export const getAllChampions = async (version) => {
	try {
		const championNameUrl = `${ddragonUrl}/cdn/${version}/data/ko_KR/champion.json`;
		const champions = await axios(championNameUrl);

		return champions.data.data;
	} catch (error) {
		console.log(error);
	}
};

export const getLeagueByUser = (userId) => {
	return new Promise(async (resolve, reject) => {
		const leagueUrl = `${Url}/league/v4/entries/by-summoner/${userId}?api_key=${ApiDefault.key}`;

		try {
			const result = await axios(leagueUrl);

			resolve(result);
		} catch (error) {
			reject(error);
		}
	});
};

//////////////////////////////////////////////context
export const UserRequestContext = createContext();

export const UserRequestProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const context = {
		user,
		setUser,
	};

	return (
		<UserRequestContext.Provider value={context}>
			{children}
		</UserRequestContext.Provider>
	);
};
//////////////////////////////////////////////////////
