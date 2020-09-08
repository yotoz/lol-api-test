import React from 'react';
import './App.css';

//module
import { UserRequestProvider } from './Config/config';

//components
import UserInfo from './Components/UserInfo';

function App() {
	return (
		<UserRequestProvider>
			<UserInfo />
		</UserRequestProvider>
	);
}

export default App;
