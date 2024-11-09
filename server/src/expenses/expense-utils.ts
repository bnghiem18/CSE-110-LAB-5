import exp from "constants";
import { Expense } from "../types";
import { Request, Response } from "express";
import{Database} from "sqlite";

export async function createExpenseServer(req: Request, res: Response, db: Database) {

    try {
        // Type casting the request body to the expected format.
        const { id, cost, description } = req.body as { id: string, cost: number, description: string };
 
        if (!description || !id || !cost) {
            return res.status(400).send({ error: "Missing required fields" });
        }
 
        await db.run('INSERT INTO expenses (id, description, cost) VALUES (?, ?, ?);', [id, description, cost]);
        res.status(201).send({ id, description, cost });
 
    } catch (error) {
 
        return res.status(400).send({ error: `Expense could not be created, + ${error}` });
    };
 
 }
 

export async function deleteExpense(req: Request, res: Response, db: Database) {
    
    const { id, cost, description } = req.params;

    if(!id) {
        return res.status(400).send({ error: "Missing required fields" });
    }


    try {
        const deletedExpense =  db.get('SELECT * FROM expenses WHERE id = ?;', [id]);

        if (!deletedExpense) {
            return res.status(404).send({ error: "Couldn't find expense" });
        }

        await db.run('DELETE FROM expenses WHERE id = ?;', [id]);

        res.status(200).send(deletedExpense);
    } catch (error) {
        res.status(500).send({ error: `Error deleting expense: + ${error}` });
    }
}

export async function getExpenses(req: Request, res: Response, db: Database) {
    try {
        // Retrieve all expenses from the database
        const expenses = await db.all('SELECT * FROM expenses;');

        // Send the retrieved expenses as the response
        res.status(200).send({ data: expenses });
    } catch (error) {
        // Handle any errors that may occur during the database query
        return res.status(400).send({ error: `Expenses could not be retrieved, + ${error}` });
    }
}