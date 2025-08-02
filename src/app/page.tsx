"use client";

import { useEffect, useState } from "react";
import initSqlJs, { Database, SqlValue } from "sql.js";

export default function Home() {
  const [rows, setRows] = useState<SqlValue[][]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const SQL = await initSqlJs({
        // locateFile: (file) => `https://sql.js.org/dist/${file}`,
        locateFile: () => `/sql-wasm.wasm`,
      });

      const db: Database = new SQL.Database();
      db.run("CREATE TABLE users (id INTEGER, name TEXT);");
      db.run("INSERT INTO users VALUES (?, ?);", [1, "Alice"]);
      db.run("INSERT INTO users VALUES (?, ?);", [2, "Bob"]);
      db.run("INSERT INTO users VALUES (?, ?);", [3, "Kek"]);

      const result = db.exec("SELECT * FROM users;")[0];
      setRows(result.values);
      setReady(true);
      db.close();
    })();
  }, []);

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Users from SQLite (sql.js)</h1>
      {!ready && <p>Loading...</p>}
      {ready && (
        <table className="border border-collapse">
          <thead>
            <tr>
              <th className="border px-2">ID</th>
              <th className="border px-2">Name</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([id, name]) => (
              <tr key={Number(id)}>
                <td className="border px-2">{id}</td>
                <td className="border px-2">{name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
