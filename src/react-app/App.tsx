// src/react-app/App.tsx

import "./App.css";
import GameManager from "./GameManager";

function App() {
	return (
		<>
			<header className="app-header">
				<h1>PSG — Portlaoise Social Board Games</h1>
				<p>Manage board game names, owners, and who currently has them.</p>
			</header>
			<main>
				<GameManager />
			</main>
		</>
	);
}

export default App;
