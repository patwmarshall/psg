// src/react-app/App.tsx

import React from "react";
import "./App.css";
import GameManager from "./GameManager";

function App() {
	return (
		<>
			<header className="app-header">
				<h1>PSG — Personal Shelf for Games</h1>
				<p>Manage board game names, owners, and who currently has them.</p>
			</header>
			<main>
				<GameManager />
			</main>
		</>
	);
}

export default App;
