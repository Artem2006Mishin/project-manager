import { useState } from 'react';
import api from './api/axios';

const App = () => {
	const [users, setUsers] = useState([]);

	const getUsersAsync = async () => {
		try {
			const res = await api.get('/users');
			setUsers(res.data);
		} catch (error) {
			console.log(error.message);
		}
	};

	const setToken = () => {
		localStorage.setItem('authToken', 'firstToken');
	};

	return (
		<>
			<button onClick={getUsersAsync}>getUsers</button>
			<button onClick={setToken}>setToken</button>

			<h5>пользователи</h5>

			<ul>
				{users.map((u) => (
					<li key={u.name}>
						<p>
							name: {u.name} age: {u.age}
						</p>
					</li>
				))}
			</ul>
		</>
	);
};

export default App;
