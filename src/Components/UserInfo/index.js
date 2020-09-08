import React, {
	useState,
	useMemo,
	useEffect,
	useContext,
} from 'react';

//module
import {
	getUserByName,
	getMatchByAccountId,
	STATE_CODE,
	getAllChampions,
	getLastestVersion,
	ddragonUrl,
	UserRequestContext,
	getLeagueByUser,
} from '../../Config/config';

import {
	BrowserRouter,
	Switch,
	Route,
	Link,
	Redirect,
} from 'react-router-dom';

const UserInfo = () => {
	/////debug data
	const target = 'Yotoz';
	///////////////

	const [matches, setMatches] = useState([]);
	const [state, setState] = useState(STATE_CODE[0]);
	const [champions, setChampions] = useState({});
	const [lastestVersion, setLastestVersion] = useState();
	const { user, setUser } = useContext(UserRequestContext);
	const [tier, setTier] = useState({
		tier: '',
		rank: '',
	});

	const getUserData = () => {
		setState(STATE_CODE[1]);

		getUserByName(target)
			.then((_user) => {
				setUser(_user);
				getMatchByAccountId(_user.data.accountId)
					.then((matches) => {
						setMatches(matches.data.matches);
						setState(STATE_CODE[999]);
					})
					.catch((error) => {
						console.log(error);
						setState(STATE_CODE[3]);
					});
				getLeagueByUser(_user.data.id).then((league) => {
					setTier({
						tier: league.data[0].tier,
						rank: league.data[0].rank,
					});
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

		getUserData();
	}, []);

	const drawMatches = useMemo(() => {
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

	const drawUserProfile = useMemo(() => {
		switch (state) {
			case STATE_CODE[0]:
				return undefined;
			case STATE_CODE[1]:
				return <h1>PROFILE INFO LOADING...</h1>;
			case STATE_CODE[2]:
				return <h1>GET USER PROFILE FAIL</h1>;
			case STATE_CODE[3]:
				return <h1>GET MATCH DATA FAIL</h1>;
			case STATE_CODE[999]:
				return (
					<div>
						{user ? (
							<div>
								<img
									src={`${ddragonUrl}/cdn/${lastestVersion}/img/profileicon/${user.data.profileIconId}.png`}
									alt={`${user.data.profileIconId}`}
								/>
								<div>
									<div
										style={{
											fontSize: '40px',
											fontWeight: 'bold',
										}}>
										{user.data.name}
									</div>
									<div>
										Level : {user.data.summonerLevel}
									</div>
									<div>
										Tier : {tier.tier} {tier.rank}
									</div>
								</div>
							</div>
						) : (
							<h1>유저 정보 로드 에러</h1>
						)}
					</div>
				);

			default:
				return undefined;
		}
	}, [state]);

	return (
		<div className="App">
			{drawUserProfile}
			<BrowserRouter>
				<br />
				<div>
					<Link to="/matches">Matches</Link>
				</div>
				<div>
					<Link to="/champions">Champions</Link>
				</div>
				<hr />
				<Switch>
					<Route path="/matches">
						<div>{drawMatches}</div>
					</Route>
					<Route path="/champions">
						<h2>챔피언 데이터 없음</h2>
					</Route>
					<Route>
						<Redirect to="/matches" />
					</Route>
				</Switch>
			</BrowserRouter>
		</div>
	);
};

export default UserInfo;
