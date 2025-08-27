import sqlite from 'sqlite3'
import { open } from 'sqlite'
import dotenv from 'dotenv'

dotenv.config()

export async function openDb() {
    return open({
        filename: process.env.DB_FILE,
        driver: sqlite.Database
    })
}