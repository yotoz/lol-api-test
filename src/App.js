import React from 'react';
import './App.css';
import axios from 'axios';

import { getUserByName } from './Config/config';

function App() {
	return (
		<div className="App">
			<button
				onClick={() => {
					getUserByName('Yotoz')
						.then((result) => {
							console.log(result);
						})
						.catch((error) => {
							console.log(error);
						});
				}}>
				test
			</button>
		</div>
	);
}

export default App;
