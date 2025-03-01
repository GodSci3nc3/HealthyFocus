import {NextResponse} from "next/server";
import {connection} from "@/libs/mysql";

export async function GET () {
    const result = await connection.query('SELECT NOW()');
    console.log(result);
    return NextResponse.json({message: result[0]['NOW()']});
}