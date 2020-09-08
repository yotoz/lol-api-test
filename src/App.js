import React, { useState, useMemo, useEffect } from 'react';
import './App.css';

//module
import {
	getUserByName,
	getMatchByAccountId,
	STATE_CODE,
	getChampionName,
	getAllChampions,
} from './Config/config';

function App() {
	const [matches, setMatches] = useState([]);
	const [state, setState] = useState(STATE_CODE[0]);
	let champions = {};

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
		getAllChampions().then((result) => {
			console.log(result);

			Object.values(result).forEach((e) => {
				champions = { ...champions, [e.key]: { ...e } };
			});

			console.log(champions);
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
							game id : {match.gameId}, role : {match.role},
							champion : {typeof champions['1']}
						</div>
					);
				});
			default:
				return undefined;
		}
	}, [state]);

	return (
		<div className="App">
			<button onClick={handleGetData}>getMatches</button>
			{drawByState}
		</div>
	);
}

export default App;
