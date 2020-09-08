import React, { useState, useMemo, useEffect } from 'react';
import './App.css';

//module
import {
	getUserByName,
	getMatchByAccountId,
	STATE_CODE,
	getAllChampions,
	getLastestVersion,
	ddragonUrl,
	UserRequestProvider,
} from './Config/config';

function App() {
	const [matches, setMatches] = useState([]);
	const [state, setState] = useState(STATE_CODE[0]);
	const [champions, setChampions] = useState({});
	const [lastestVersion, setLastestVersion] = useState();

	const handleGetData = () => {
		setState(STATE_CODE[1]);

		// getChampionName(62).then((result) => {
		// 	console.log(result);
		// });

		getUserByName('Yotoz')
			.then((user) => {
				getMatchByAccountId(user.data.accountId)
					.then((matches) => {
						setMatches(matches.data.matches);
						setState(STATE_CODE[999]);
					})
					.catch((error) => {
						console.log(error);
						setState(STATE_CODE[3]);
					});
			})
			.catch((error) => {
				console.log(error);
				setState(STATE_CODE[2]);
			});
	};

	useEffect(() => {
		getLastestVersion().then((version) => {
			setLastestVersion(version);
			getAllChampions(version).then((result) => {
				let _champions = {};
				Object.values(result).forEach((e) => {
					_champions = { ..._champions, [e.key]: { ...e } };
				});

				setChampions(_champions);
			});
		});
	}, []);

	const drawByState = useMemo(() => {
		switch (state) {
			case STATE_CODE[0]:
				return undefined;
			case STATE_CODE[1]:
				return <h1>LOADING...</h1>;
			case STATE_CODE[2]:
				return <h1>GET USER DATA FAIL</h1>;
			case STATE_CODE[3]:
				return <h1>GET MATCH DATA FAIL</h1>;
			case STATE_CODE[999]:
				return matches.map((match, idx) => {
					return (
						<div key={idx}>
							<img
								src={`${ddragonUrl}/cdn/${lastestVersion}/img/champion/${
									champions[match.champion].id
								}.png`}
								alt={champions[match.champion].name}
							/>
							game id : {match.gameId}, role : {match.role},
							champion : {champions[match.champion].name}
						</div>
					);
				});
			default:
				return undefined;
		}
	}, [state]);

	return (
		<UserRequestProvider>
			<button onClick={handleGetData}>getMatches</button>
			{drawByState}
		</UserRequestProvider>
	);
}

export default App;
