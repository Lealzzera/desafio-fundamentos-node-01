import fs from "node:fs";
import { parse } from "csv-parse";

const dirname = new URL("./test-csv-task.csv", import.meta.url);

const processFile = async () => {
	const records = [];
	const parser = fs.createReadStream(dirname).pipe(parse({ delimiter: ";" }));
	for await (const record of parser) {
		records.push(record);
	}
	return records;
};

const fileRecords = await processFile();

fileRecords.map(async (item, index) => {
	if (index !== 0) {
		await fetch("http:localhost:3333/tasks", {
			method: "POST",
			body: JSON.stringify({ title: item[0], description: item[1] }),
		});
	}
});
