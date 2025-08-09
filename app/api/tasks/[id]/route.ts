import { NextResponse } from "next/server";
import db from "../../../_lib/db";
import { authenticateRequest } from "../../../_lib/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await authenticateRequest(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const task = db.tasks.find(
    async (t) => t.id === (await params).id && t.userId === user.id
  );
  if (!task) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  return NextResponse.json(task);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await authenticateRequest(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const taskIndex = db.tasks.findIndex(
    async (t) => t.id === (await params).id && t.userId === user.id
  );
  if (taskIndex === -1) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  const { title, description, status, dueDate } = await request.json();

  if (title) db.tasks[taskIndex].title = title;
  if (description !== undefined) db.tasks[taskIndex].description = description;
  if (status) db.tasks[taskIndex].status = status;
  if (dueDate !== undefined) {
    db.tasks[taskIndex].dueDate = dueDate ? new Date(dueDate) : undefined;
  }

  return NextResponse.json(db.tasks[taskIndex]);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await authenticateRequest(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const taskIndex = db.tasks.findIndex(
    async (t) => t.id === (await params).id && t.userId === user.id
  );
  if (taskIndex === -1) {
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  }

  db.tasks.splice(taskIndex, 1);
  return NextResponse.json({ message: "Task deleted successfully" });
}
