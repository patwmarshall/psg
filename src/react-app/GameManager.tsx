// src/react-app/GameManager.tsx

import React, { useEffect, useState } from "react";
import { Game } from "./types";
import * as api from "./api";
import "./App.css";

export default function GameManager() {
  const [games, setGames] = useState<Game[]>([]);
  const [name, setName] = useState("");
  const [owner, setOwner] = useState("");
  const [editing, setEditing] = useState<Game | null>(null);

  useEffect(() => {
    fetchGames();
  }, []);

  async function fetchGames() {
    try {
      const data = await api.getGames();
      setGames(data);
    } catch (e) {
      console.error(e);
      alert("Failed to load games");
    }
  }

  async function onAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      await api.addGame({ name: name.trim(), owner: owner.trim(), holder: owner.trim() || "" });
      setName("");
      setOwner("");
      // Ensure the UI is refreshed after adding a game. Await fetchGames so state updates before returning.
      await fetchGames();
    } catch (err) {
      console.error(err);
      alert("Failed to add game");
      // As a last-resort fallback, reload the page so the UI reflects the server state.
      try {
        window.location.reload();
      } catch (reloadErr) {
        // ignore
      }
    }
  }

  async function onDelete(id: string) {
    if (!confirm("Delete this game?")) return;
    await api.deleteGame(id);
    fetchGames();
  }

  function startEdit(g: Game) {
    setEditing(g);
  }

  async function saveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    await api.updateGame(editing.id, editing);
    setEditing(null);
    fetchGames();
  }

  async function transfer(id: string) {
    const newHolder = prompt("Who currently has this game?");
    if (newHolder === null) return;
    await api.transferHolder(id, newHolder);
    fetchGames();
  }

  return (
    <div className="game-manager">
      <section className="add-section">
        <h2>Add game</h2>
        <form onSubmit={onAdd}>
          <input placeholder="Game name" value={name} onChange={(e) => setName(e.target.value)} />
          <input placeholder="Owner (person who owns it)" value={owner} onChange={(e) => setOwner(e.target.value)} />
          <button type="submit">Add</button>
        </form>
      </section>

      <section className="list-section">
        <h2>Games</h2>
        {games.length === 0 ? (
          <p>No games yet.</p>
        ) : (
          <ul className="games">
            {games.map((g) => (
              <li key={g.id} className="game-item">
                <div className="game-main">
                  <strong>{g.name}</strong>
                  <div className="meta">
                    <span>Owner: {g.owner || "—"}</span>
                    <span>Holder: {g.holder || "—"}</span>
                  </div>
                </div>
                <div className="actions">
                  <button onClick={() => transfer(g.id)}>Transfer / Check-in</button>
                  <button onClick={() => startEdit(g)}>Edit</button>
                  <button onClick={() => onDelete(g.id)} className="danger">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {editing && (
        <section className="edit-section">
          <h2>Edit</h2>
          <form onSubmit={saveEdit}>
            <input
              value={editing.name}
              onChange={(e) => setEditing({ ...editing, name: e.target.value })}
            />
            <input
              value={editing.owner}
              onChange={(e) => setEditing({ ...editing, owner: e.target.value })}
            />
            <input
              value={editing.holder}
              onChange={(e) => setEditing({ ...editing, holder: e.target.value })}
            />
            <button type="submit">Save</button>
            <button type="button" onClick={() => setEditing(null)}>
              Cancel
            </button>
          </form>
        </section>
      )}
    </div>
  );
}
