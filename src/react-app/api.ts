// src/react-app/api.ts

import { Game } from "./types";

async function request<T>(path: string, opts?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    headers: { "Content-Type": "application/json" },
    ...opts,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error ${res.status}: ${text}`);
  }
  return (await res.json()) as T;
}

export const getGames = async (): Promise<Game[]> => request<Game[]>('/api/games');

export const addGame = async (g: Omit<Game, 'id'>): Promise<Game> =>
  request<Game>('/api/games', {
    method: 'POST',
    body: JSON.stringify(g),
  });

export const updateGame = async (id: string, g: Game): Promise<Game> =>
  request<Game>(`/api/games/${id}`, {
    method: 'PUT',
    body: JSON.stringify(g),
  });

export const deleteGame = async (id: string): Promise<void> =>
  request<void>(`/api/games/${id}`, { method: 'DELETE' });

export const transferHolder = async (id: string, holder: string): Promise<Game> =>
  request<Game>(`/api/games/${id}/transfer`, {
    method: 'POST',
    body: JSON.stringify({ holder }),
  });
