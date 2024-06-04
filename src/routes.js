import { Database } from "./database.js";
import { buildRoutePath } from "./utils/build-route-path.js";
import { randomUUID } from "crypto";

const database = new Database();

export const routes = [
	{
		method: "GET",
		path: buildRoutePath("/tasks"),
		handler: (req, res) => {
			const { id } = req.query;
			const tasks = database.select("tasks", id ? { id } : null);
			return res.end(JSON.stringify(tasks));
		},
	},
	{
		method: "POST",
		path: buildRoutePath("/tasks"),
		handler: (req, res) => {
			const { title, description } = req.body;
			if (!title || !description) {
				return res
					.writeHead(401)
					.end("Title and description are required params.");
			}
			database.insert("tasks", {
				id: randomUUID(),
				title,
				description,
				completed_at: null,
				created_at: String(new Date().toLocaleString("pt-BR")),
				updated_at: String(new Date().toLocaleString("pt-BR")),
			});
			return res.writeHead(201).end();
		},
	},
	{
		method: "PUT",
		path: buildRoutePath("/tasks/:id"),
		handler: (req, res) => {
			const { id } = req.params;
			const { title, description, completed_at, created_at, updated_at } =
				req.body;
			const updateTask = database.update("tasks", id, {
				title,
				description,
			});
			return !updateTask
				? res.writeHead(404).end("Task not found!")
				: res.writeHead(204).end();
		},
	},
	{
		method: "DELETE",
		path: buildRoutePath("/tasks/:id"),
		handler: (req, res) => {
			const { id } = req.params;
			const deleteTask = database.delete("tasks", id);
			return !deleteTask
				? res.writeHead(404).end("Task not found")
				: res.writeHead(204).end();
		},
	},
	{
		method: "PATCH",
		path: buildRoutePath("/tasks/:id/complete"),
		handler: (req, res) => {
			const { id } = req.params;
			const data = req.body;
			const updateTask = database.updatePartialTask("tasks", id, data);

			return !updateTask
				? res.writeHead(404).end("Task not found!")
				: res.writeHead(201).end();
		},
	},
];
