import { randomUUID } from "node:crypto";
import { buildPathPattern } from "./utils/build-path-pattern.js";
import { Database } from "./database.js";

const database = new Database();

const TASKS_TABLE = "tasks";
export const routes = [
  {
    method: "GET",
    path: "/tasks",
    handler: (req, res) => {
      return res.end(JSON.stringify(database.select(TASKS_TABLE)));
    },
  },
  {
    method: "POST",
    path: "/tasks",
    handler: (req, res) => {
      const { title, description } = req.body;
      if (!title || !description) {
        return res.writeHead(422).end(
          JSON.stringify({
            error: "Title and description are mandatory fields",
          })
        );
      }
      const now = new Date();
      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: now,
        updated_at: now,
      };
      database.insert(TASKS_TABLE, task);
      return res.writeHead(201).end(JSON.stringify(task));
    },
  },
  {
    method: "PUT",
    path: "/tasks/:id",
    handler: (req, res) => {
      const { title, description } = req.body;
      if (!title || !description) {
        return res.writeHead(422).end(
          JSON.stringify({
            error: "Title and description are mandatory fields",
          })
        );
      }
      const { id } = req.params;
      try {
        const newTask = database.update(TASKS_TABLE, id, {
          title,
          description,
          updated_at: new Date(),
        });
        return res.writeHead(200).end(JSON.stringify(newTask));
      } catch (error) {
        return res.writeHead(422).end(
          JSON.stringify({
            error: "Task id not found",
          })
        );
      }
    },
  },
  {
    method: "DELETE",
    path: "/tasks/:id",
    handler: (req, res) => {
      const { id } = req.params;
      try {
        database.delete(TASKS_TABLE, id);
        return res.writeHead(204).end();
      } catch (error) {
        return res.writeHead(422).end(
          JSON.stringify({
            error: "Task id not found",
          })
        );
      }
    },
  },
  {
    method: "PATCH",
    path: "/tasks/:id/complete",
    handler: (req, res) => {
      const { id } = req.params;
      try {
        const now = new Date();
        const newTask = database.update(TASKS_TABLE, id, {
          completed_at: now,
          updated_at: now,
        });
        return res.writeHead(200).end(JSON.stringify(newTask));
      } catch (error) {
        return res.writeHead(422).end(
          JSON.stringify({
            error: "Task id not found",
          })
        );
      }
    },
  },
];
