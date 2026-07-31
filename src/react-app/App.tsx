import "./App.css";
import GameManager from "./GameManager";
import ThemeSwitcher from "./ThemeSwitcher";

function App() {
	return (
		<>
			<header className="app-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
				<div>
					<h1>PSG — Portlaoise Social Board Games</h1>
					<p>Manage board game names, owners, and who currently has them.</p>
				</div>
				<div style={{ marginLeft: "1rem" }}>
					<ThemeSwitcher />
				</div>
			</header>
			<main>
				<GameManager />
			</main>
		</>
	);
}

export default App;
