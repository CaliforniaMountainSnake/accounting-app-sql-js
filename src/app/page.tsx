"use client";
import { Container, Spinner, Table, Text, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import initSqlJs, { Database, SqlValue } from "sql.js";

export default function Home() {
  const [rows, setRows] = useState<SqlValue[][]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const SQL = await initSqlJs({
        locateFile: (file) => `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/${file}`,
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
    <Container fluid>
      {!ready && (
        <VStack>
          <Spinner />
          <Text>Loading...</Text>
        </VStack>
      )}
      {ready && (
        <Table.Root variant="outline" size="lg">
          <Table.Caption captionSide="top">Users from SQLite (sql.js)</Table.Caption>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>ID</Table.ColumnHeader>
              <Table.ColumnHeader>Name</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {rows.map(([id, name]) => (
              <Table.Row key={Number(id)}>
                <Table.Cell>{id}</Table.Cell>
                <Table.Cell>{name}</Table.Cell>
              </Table.Row>
            ))}
            <Table.Row>
              <Table.Cell />
            </Table.Row>
          </Table.Body>
        </Table.Root>
      )}
    </Container>
  );
}
