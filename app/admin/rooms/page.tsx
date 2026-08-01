"use client";

import { FormEvent, useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { AdminGuard } from "@/components/AdminGuard";
import { fetchAllRooms, updateRoom, deleteRoom, createRoom } from "@/lib/rooms";
import { Room } from "@/lib/types";
import { Plus, Edit3, Trash2 } from "lucide-react";

export default function AdminRoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [editing, setEditing] = useState<Room | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [capacity, setCapacity] = useState(1);
  const [floor, setFloor] = useState("");
  const [description, setDescription] = useState("");
  const [enabled, setEnabled] = useState(true);
  const [amenities, setAmenities] = useState("");
  const [openTime, setOpenTime] = useState("08:00");
  const [closeTime, setCloseTime] = useState("20:00");

  useEffect(() => {
    (async () => setRooms(await fetchAllRooms()))();
  }, []);

  async function refresh() {
    setRooms(await fetchAllRooms());
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      name,
      location,
      capacity,
      floor,
      description,
      enabled,
      amenities: amenities.split(",").map((item) => item.trim()).filter(Boolean),
      openTime,
      closeTime,
    };
    if (editing) {
      await updateRoom(editing.id, payload);
    } else {
      await createRoom(payload);
    }
    setFormOpen(false);
    setEditing(null);
    await refresh();
  }

  async function handleDelete(id: string) {
    await deleteRoom(id);
    await refresh();
  }

  function startEdit(room: Room) {
    setEditing(room);
    setName(room.name);
    setLocation(room.location);
    setCapacity(room.capacity);
    setFloor(room.floor ?? "");
    setDescription(room.description ?? "");
    setEnabled(room.enabled !== false);
    setAmenities((room.amenities ?? []).join(", "));
    setOpenTime(room.openTime ?? "08:00");
    setCloseTime(room.closeTime ?? "20:00");
    setFormOpen(true);
  }

  function openNew() {
    setEditing(null);
    setName("");
    setLocation("");
    setCapacity(1);
    setFloor("");
    setDescription("");
    setEnabled(true);
    setFormOpen(true);
  }

  return (
    <AdminGuard>
      <AppShell>
        <div className="mb-6 flex flex-col gap-4 items-center text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sidebar-purple/80">Manage Rooms</p>
            <h1 className="text-3xl font-semibold text-ink-900">Room inventory</h1>
          </div>
          <button onClick={openNew} className="inline-flex items-center gap-2 rounded-2xl bg-sidebar-purple px-4 py-2 text-sm font-semibold text-white justify-center">
            <Plus size={16} /> Add Room
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {rooms.map((room) => (
            <div key={room.id} className="rounded-3xl border border-line bg-white/95 p-5 shadow-soft">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xl font-semibold text-ink-900">{room.name}</p>
                  <p className="text-sm text-ink-500 mt-1">{room.location} • Floor {room.floor ?? "—"}</p>
                </div>
                <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${room.enabled !== false ? "bg-category-interviewBg text-category-interview" : "bg-category-otherBg text-category-other"}`}>
                  {room.enabled !== false ? "Enabled" : "Disabled"}
                </span>
              </div>
              <p className="text-sm text-ink-500 mt-4">{room.description ?? "No description provided."}</p>
              <div className="mt-4 flex flex-wrap gap-2 text-sm text-ink-500">
                <span>Capacity: {room.capacity}</span>
                <span>Floor: {room.floor ?? "N/A"}</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button onClick={() => startEdit(room)} className="inline-flex items-center gap-2 rounded-2xl border border-line bg-white px-3 py-2 text-sm font-semibold text-sidebar-purple">
                  <Edit3 size={14} /> Edit
                </button>
                <button onClick={() => handleDelete(room.id)} className="inline-flex items-center gap-2 rounded-2xl border border-line bg-white px-3 py-2 text-sm font-semibold text-ink-700">
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {formOpen && (
          <div className="mt-6 rounded-3xl border border-line bg-white/95 p-6 shadow-soft">
            <h2 className="text-lg font-semibold text-ink-900 mb-4">{editing ? "Edit room" : "Add new room"}</h2>
            <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-semibold text-ink-500">Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} className="focus-ring mt-2 w-full rounded-2xl border border-line bg-bg/60 px-4 py-3 text-sm outline-none focus:border-brand focus:bg-white" />
              </div>
              <div>
                <label className="text-sm font-semibold text-ink-500">Location</label>
                <input value={location} onChange={(e) => setLocation(e.target.value)} className="focus-ring mt-2 w-full rounded-2xl border border-line bg-bg/60 px-4 py-3 text-sm outline-none focus:border-brand focus:bg-white" />
              </div>
              <div>
                <label className="text-sm font-semibold text-ink-500">Capacity</label>
                <input type="number" min={1} value={capacity} onChange={(e) => setCapacity(Number(e.target.value))} className="focus-ring mt-2 w-full rounded-2xl border border-line bg-bg/60 px-4 py-3 text-sm outline-none focus:border-brand focus:bg-white" />
              </div>
              <div>
                <label className="text-sm font-semibold text-ink-500">Floor</label>
                <input value={floor} onChange={(e) => setFloor(e.target.value)} className="focus-ring mt-2 w-full rounded-2xl border border-line bg-bg/60 px-4 py-3 text-sm outline-none focus:border-brand focus:bg-white" />
              </div>
              <div>
                <label className="text-sm font-semibold text-ink-500">Amenities</label>
                <input value={amenities} onChange={(e) => setAmenities(e.target.value)} placeholder="e.g. TV Screen, Whiteboard" className="focus-ring mt-2 w-full rounded-2xl border border-line bg-bg/60 px-4 py-3 text-sm outline-none focus:border-brand focus:bg-white" />
              </div>
              <div>
                <label className="text-sm font-semibold text-ink-500">Open time</label>
                <input type="time" value={openTime} onChange={(e) => setOpenTime(e.target.value)} className="focus-ring mt-2 w-full rounded-2xl border border-line bg-bg/60 px-4 py-3 text-sm outline-none focus:border-brand focus:bg-white" />
              </div>
              <div>
                <label className="text-sm font-semibold text-ink-500">Close time</label>
                <input type="time" value={closeTime} onChange={(e) => setCloseTime(e.target.value)} className="focus-ring mt-2 w-full rounded-2xl border border-line bg-bg/60 px-4 py-3 text-sm outline-none focus:border-brand focus:bg-white" />
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm font-semibold text-ink-500">Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="focus-ring mt-2 w-full rounded-2xl border border-line bg-bg/60 px-4 py-3 text-sm outline-none focus:border-brand focus:bg-white min-h-[120px]" />
              </div>
              <div className="sm:col-span-2 flex items-center gap-3">
                <input id="enabled" type="checkbox" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} className="h-4 w-4 rounded border-line text-sidebar-purple focus:ring-sidebar-purple" />
                <label htmlFor="enabled" className="text-sm text-ink-600">Room is enabled for booking</label>
              </div>
              <div className="sm:col-span-2 flex flex-wrap gap-3">
                <button type="submit" className="rounded-2xl bg-sidebar-purple px-4 py-3 text-sm font-semibold text-white">
                  Save room
                </button>
                <button type="button" onClick={() => setFormOpen(false)} className="rounded-2xl border border-line bg-white px-4 py-3 text-sm font-semibold text-ink-700">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </AppShell>
    </AdminGuard>
  );
}
