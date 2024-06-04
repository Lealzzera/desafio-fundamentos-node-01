import fs from "fs/promises";

const databasePath = new URL("./db.json", import.meta.url);

export class Database {
	#database = {};

	constructor() {
		fs.readFile(databasePath, "utf-8")
			.then((data) => {
				this.#database = JSON.parse(data);
			})
			.catch(() => {
				this.#persist();
			});
	}

	#persist() {
		fs.writeFile(databasePath, JSON.stringify(this.#database));
	}

	select(table, search) {
		let data = this.#database[table] ?? [];
		if (search) {
			data = data.filter((row) => {
				return Object.entries(search).some(([key, value]) => {
					return row[key].toLowerCase().includes(value.toLowerCase());
				});
			});
		}
		return data;
	}

	insert(table, data) {
		if (Array.isArray(this.#database[table])) {
			this.#database[table].push(data);
		} else {
			this.#database[table] = [data];
		}
		this.#persist();
	}

	delete(table, id) {
		const rowIndex = this.#database[table].findIndex((item) => item.id === id);
		if (rowIndex > -1) {
			this.#database[table].splice(rowIndex, 1);
			this.#persist();
			return true;
		} else {
			return false;
		}
	}

	update(table, id, data) {
		const rowIndex = this.#database[table].findIndex((item) => item.id === id);
		if (rowIndex > -1) {
			this.#database[table][rowIndex] = {
				id,
				title: data.title,
				description: data.description,
				completed_at: this.#database[table][rowIndex].completed_at,
				created_at: this.#database[table][rowIndex].created_at,
				updated_at: String(new Date().toLocaleString("pt-BR")),
			};
			this.#persist();
			return true;
		} else {
			return false;
		}
	}

	updatePartialTask(table, id, data) {
		const rowIndex = this.#database[table].findIndex((row) => row.id === id);
		if (rowIndex > -1) {
			this.#database[table][rowIndex] = {
				...this.#database[table][rowIndex],
				updated_at: String(new Date().toLocaleString("pt-BR")),
				completed_at: String(new Date().toLocaleString("pt-BR")),
				...data,
			};
			this.#persist();
			return true;
		} else {
			return false;
		}
	}
}
